import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, tool, type UIMessage } from 'ai';
import { embed } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const teacherSystemPrompt = `You are an educational analytics assistant helping teachers understand student comprehension of "Catching Unicorns" by David Hurley and Bill Hurley.

You have access to tools to:
1. searchResponses - Find student responses by semantic similarity
2. getTopicStats - Get aggregate statistics for a specific topic

When asked about student understanding:
1. Use searchResponses to find relevant examples
2. Synthesize patterns and misconceptions
3. Provide actionable insights

Example queries you can handle:
- "Which students struggle with the concept of engrams?"
- "Show me common misconceptions about exographics"
- "What topics have the lowest comprehension rates?"
- "Find students who confuse abstract and concrete objects"
- "Which questions take students the longest?"
- "Show me quick wrong answers (potential guessing)"

Be concise, analytical, and focus on actionable insights for improving instruction.`;

// Tool to search student responses semantically
const searchResponsesTool = tool({
  description: 'Search student responses by semantic meaning. Use this to find responses that match a concept, misconception, or pattern.',
  parameters: z.object({
    query: z.string().describe('What to search for in student responses (e.g., "confusion about engrams", "students who understand exographics well")'),
    topic: z.string().optional().describe('Filter by question topic (e.g., "engrams-definition", "exographics-definition")'),
    maxGrade: z.number().optional().describe('Filter responses with grade at or below this value (0, 0.5, or 1)'),
    limit: z.number().default(10).describe('Maximum number of results to return'),
  }),
  // @ts-ignore - Type inference issue with tool execute function
  execute: async ({ query, topic, maxGrade, limit }) => {
    try {
      // Generate embedding for the search query
      const { embedding: queryEmbedding } = await embed({
        model: google.textEmbeddingModel('text-embedding-004'),
        value: query,
      });

      // Call the search function
      const { data, error } = await supabase.rpc('search_student_responses', {
        query_embedding: queryEmbedding,
        topic_filter: topic || null,
        grade_filter: maxGrade !== undefined ? maxGrade : null,
        match_count: limit,
      });

      if (error) {
        console.error('Error searching responses:', error);
        throw error;
      }

      return {
        success: true,
        results: data || [],
        count: data?.length || 0,
      };
    } catch (error) {
      console.error('Error in searchResponses tool:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        results: [],
        count: 0,
      };
    }
  },
});

// Tool to get topic statistics
const getTopicStatsTool = tool({
  description: 'Get aggregate statistics for a specific question topic. Shows average grades, response times, and grade distribution.',
  parameters: z.object({
    topic: z.string().describe('The question topic to analyze (e.g., "engrams-definition", "exographics-definition")'),
  }),
  // @ts-ignore - Type inference issue with tool execute function
  execute: async ({ topic }) => {
    try {
      const { data, error } = await supabase
        .from('student_responses')
        .select('grade, response_text, response_time_ms')
        .eq('question_topic', topic);

      if (error) {
        console.error('Error fetching topic stats:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return {
          success: true,
          topic,
          totalResponses: 0,
          averageGrade: null,
          averageResponseTime: null,
          distribution: { fullCredit: 0, partial: 0, incorrect: 0 },
        };
      }

      const total = data.length;
      const grades = data.map(r => Number(r.grade)).filter(g => !isNaN(g));
      const avgGrade = grades.length > 0 
        ? grades.reduce((sum, g) => sum + g, 0) / grades.length 
        : 0;
      
      const responseTimes = data
        .map(r => r.response_time_ms)
        .filter((t): t is number => t !== null && t !== undefined);
      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
        : null;

      const fullCredit = data.filter(r => r.grade === 1).length;
      const partial = data.filter(r => r.grade === 0.5).length;
      const incorrect = data.filter(r => r.grade === 0).length;

      return {
        success: true,
        topic,
        totalResponses: total,
        averageGrade: parseFloat(avgGrade.toFixed(2)),
        averageResponseTime: avgResponseTime ? Math.round(avgResponseTime) : null,
        distribution: {
          fullCredit,
          partial,
          incorrect,
        },
      };
    } catch (error) {
      console.error('Error in getTopicStats tool:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

// Zod schema for request validation
const messagePartSchema = z.object({
  type: z.string(),
}).passthrough();

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    parts: z.array(messagePartSchema),
    id: z.string().optional(),
  }).passthrough()),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request with Zod
    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request format', details: validationResult.error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { messages } = validationResult.data;
    
    // Convert UI messages to model messages
    const modelMessages = await convertToModelMessages(
      (messages as UIMessage[]).map((msg) => {
        const { id: _id, ...rest } = msg;
        return rest;
      })
    );
    
    // Stream response using Gemini 2.5 Flash
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: teacherSystemPrompt,
      messages: modelMessages,
      tools: {
        searchResponses: searchResponsesTool,
        getTopicStats: getTopicStatsTool,
      },
      maxOutputTokens: 2000,
      temperature: 0.7,
    });
    
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Teacher API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

