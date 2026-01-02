import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, tool, type UIMessage } from 'ai';
import { embed } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { WEEK_1_QUESTIONS, CHAPTER_1_CONTENT } from '../quiz/constants';

/**
 * Extract text content from a UIMessage using SDK v6 parts pattern
 */
function extractTextFromMessage(message: UIMessage): string {
  return message.parts
    ?.filter(part => part.type === 'text')
    ?.map(part => part.text)
    ?.join(' ') ?? '';
}

/**
 * Count questions asked so far (assistant messages that don't contain score)
 */
function countQuestionsAsked(messages: UIMessage[]): number {
  return messages.filter(msg => {
    if (msg.role !== 'assistant') return false;
    const text = extractTextFromMessage(msg);
    return !text.includes('[SCORE:');
  }).length;
}

/**
 * Build system prompt for the game quiz interviewer
 */
function buildQuizSystemPrompt(questionsAsked: number): string {
  const questionsList = WEEK_1_QUESTIONS.map((q, idx) => `${idx + 1}. ${q.question}`).join('\n');
  
  return `You are a Socratic interviewer testing a student's comprehension of Week 1 Notebook Questions from "Catching Unicorns" by David Hurley and Bill Hurley.

Hard requirements:
- Ask exactly 10-15 questions total (aim for 12-15, label them Q1–Q15).
- Select questions from the Week 1 Notebook Questions list below.
- Ask ONE question at a time - each question must be atomic (single, focused prompt).
- After each user answer: briefly grade it (0/0.5/1), give 1–2 sentences of feedback, then ask the next question.
- After the user answers the final question: provide a brief overall assessment and end your response with exactly: [SCORE:X/10]

**CRITICAL CONSTRAINTS:**
- NEVER reference page numbers, footnotes, or specific locations in the book (e.g., "on p. 4", "in footnote 2", "pp. 5-6")
- NEVER ask multi-part questions - each question must address only one concept or idea
- All questions in the bank are already atomic - use them as written or adapt slightly while maintaining atomicity

Scoring rules:
- Each question is worth 1 point.
- 1 = accurate + specific + grounded in Chapter 1/Introduction (uses terms/examples correctly)
- 0.5 = partially correct OR correct but vague/ungrounded
- 0 = incorrect, unrelated, or "I don't know"
- After all questions, normalize the score to /10: score = 10 × (total points / questions asked)
- Final score can include decimals (e.g., 8.5/10)

Critical behavior (adapt + challenge):
- Your interview MUST adapt to the user's answers.
- Select questions from the Week 1 Notebook Questions list that address gaps or weaknesses in the student's understanding.
- If the user is vague or wrong, you MUST challenge them by selecting a question that forces precision or reconciliation (still only ONE question).
- You may adapt the wording of questions slightly for conversational flow, but maintain the core intent and atomicity.
- If the user is strong, select more challenging questions or ask for deeper analysis on complex topics.

Conversation state:
- You have already asked ${questionsAsked} questions.
- If ${questionsAsked} = 0, ask Q1. If 1, ask Q2, etc.
- If ${questionsAsked} >= 15, DO NOT ask more questions; provide the final assessment and [SCORE:X/10].
- If ${questionsAsked} >= 10 and the conversation feels complete, you may conclude early (still normalize score to /10).

**IMPORTANT: After evaluating each student answer, you MUST call the saveResponse tool with:**
- questionNumber: current question number (1-indexed)
- questionTopic: the topic ID from the question bank (e.g., "engrams-definition")
- questionText: the exact question you asked
- responseText: the student's exact answer
- grade: 0, 0.5, or 1
- feedback: your brief feedback text
- responseTimeMs: time in milliseconds (will be provided in message metadata)

After the final question is answered and you provide [SCORE:X/10], you MUST call the completeSession tool with:
- finalScore: the normalized score (0-10)
- totalQuestions: number of questions asked
- totalXp: total XP earned (calculate from grades: 100 XP per full point, 50 XP per half point)
- maxStreak: longest streak of correct answers

Chapter 1 content (the only ground truth):
${CHAPTER_1_CONTENT}

**WEEK 1 NOTEBOOK QUESTIONS (select 10-15 from these):**
${questionsList}

Response format (every turn):
- "Grade: N/1 — <very short reason>"
- 1–2 sentences of feedback (encouraging but honest)
- Then ask the next question (ONE question, labeled Q#)
- Call saveResponse tool after each evaluation

Begin now with your next question from the Week 1 Notebook Questions.`;
}

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
    
    // Get user ID from Authorization header (Privy token)
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Extract user ID from Bearer token (format: "Bearer privy_user_id")
    // For now, we'll use the token directly as user_id
    // In production, you'd verify the Privy token and extract the user ID
    const userId = authHeader.replace('Bearer ', '').trim();
    
    // Get or create session ID from header
    const sessionIdHeader = req.headers.get('x-session-id');
    const sessionId = sessionIdHeader || crypto.randomUUID();
    
    // Count questions asked so far
    const questionsAsked = countQuestionsAsked(messages as UIMessage[]);
    
    // Note: responseTimeMs will be passed from the tool call itself
    
    // Build system prompt
    const systemPrompt = buildQuizSystemPrompt(questionsAsked);
    
    // Tool to save student response
    const saveResponseTool = tool({
      description: 'Save a student response after evaluation. Call this after grading each answer.',
      parameters: z.object({
        questionNumber: z.number().describe('Current question number (1-indexed)'),
        questionTopic: z.string().describe('Topic ID from question bank (e.g., "engrams-definition")'),
        questionText: z.string().describe('The exact question you asked'),
        responseText: z.string().describe('The student\'s exact answer'),
        grade: z.union([z.literal(0), z.literal(0.5), z.literal(1)]).describe('Grade: 0, 0.5, or 1'),
        feedback: z.string().describe('Your brief feedback text'),
        responseTimeMs: z.number().optional().describe('Time in milliseconds to answer (if available)'),
      }),
      // @ts-ignore - Type inference issue with closures accessing userId/sessionId
      execute: async ({ questionNumber, questionTopic, questionText, responseText, grade, feedback, responseTimeMs }) => {
        try {
          // Generate embedding for the student's response
          const { embedding: embeddingArray } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: `Question: ${questionText}\nStudent Answer: ${responseText}`,
          });
          
          // Calculate XP earned (100 for full credit, 50 for half credit)
          const xpEarned = grade === 1 ? 100 : grade === 0.5 ? 50 : 0;
          
          // Get current streak from previous responses in this session
          // Combined query to prevent race conditions from concurrent inserts
          const { data: lastResponse } = await supabase
            .from('student_responses')
            .select('grade, streak_at_time')
            .eq('session_id', sessionId)
            .order('question_number', { ascending: false })
            .limit(1);
          
          let streakAtTime = 0;
          if (lastResponse && lastResponse.length > 0) {
            const lastGrade = lastResponse[0].grade;
            const lastStreak = lastResponse[0].streak_at_time || 0;
            
            if (lastGrade === 1 && grade === 1) {
              // Continue streak
              streakAtTime = lastStreak + 1;
            } else if (grade === 1) {
              // Start new streak
              streakAtTime = 1;
            } else {
              // Streak broken
              streakAtTime = 0;
            }
          } else {
            // First response in session
            streakAtTime = grade === 1 ? 1 : 0;
          }
          
          // Save to database
          const { error } = await supabase
            .from('student_responses')
            .insert({
              user_id: userId,
              session_id: sessionId,
              question_number: questionNumber,
              question_topic: questionTopic,
              question_text: questionText,
              response_text: responseText,
              grade,
              feedback,
              response_time_ms: responseTimeMs || null,
              xp_earned: xpEarned,
              streak_at_time: streakAtTime,
              embedding: embeddingArray,
            });
          
          if (error) {
            console.error('Error saving response:', error);
            throw error;
          }
          
          return { success: true, grade, xpEarned, streakAtTime };
        } catch (error) {
          console.error('Error in saveResponse tool:', error);
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      },
    });
    
    // Tool to complete session
    const completeSessionTool = tool({
      description: 'Mark a game session as complete with final score. Call this after providing [SCORE:X/10].',
      parameters: z.object({
        finalScore: z.number().describe('Final normalized score (0-10)'),
        totalQuestions: z.number().describe('Total number of questions asked'),
        totalXp: z.number().describe('Total XP earned across all questions'),
        maxStreak: z.number().describe('Longest streak of correct answers'),
      }),
      // @ts-ignore - Type inference issue with closures accessing userId/sessionId
      execute: async ({ finalScore, totalQuestions, totalXp, maxStreak }) => {
        try {
          // Save session
          const { error: sessionError } = await supabase
            .from('game_sessions')
            .insert({
              id: sessionId,
              user_id: userId,
              final_score: finalScore,
              total_questions: totalQuestions,
              total_xp: totalXp,
              max_streak: maxStreak,
            });
          
          if (sessionError) {
            console.error('Error saving session:', sessionError);
            throw sessionError;
          }
          
          // Refresh leaderboard (non-blocking) - fire and forget
          void (async () => {
            try {
              await supabase.rpc('refresh_leaderboard');
            } catch {
              // Ignore errors in non-blocking refresh
            }
          })();
          
          return { success: true };
        } catch (error) {
          console.error('Error in completeSession tool:', error);
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      },
    });
    
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
      system: systemPrompt,
      messages: modelMessages,
      tools: {
        saveResponse: saveResponseTool,
        completeSession: completeSessionTool,
      },
      maxOutputTokens: 1500,
      temperature: 0.7,
    });
    
    // Return response with session ID header
    const response = result.toUIMessageStreamResponse();
    const headers = new Headers(response.headers);
    headers.set('x-session-id', sessionId);
    
    return new Response(response.body, {
      status: response.status,
      headers: headers,
    });
  } catch (error) {
    console.error('Game API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

