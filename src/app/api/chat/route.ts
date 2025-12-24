import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { retrieveContext } from '@/lib/retrieval';
import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

interface ChunksData {
  meta: {
    source: string;
    system_prompt_context?: string;
  };
}

/**
 * Load chunks data from JSON file
 */
function loadChunksData(): ChunksData {
  const filePath = join(process.cwd(), 'content', 'chunks.json');
  const fileContents = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContents) as ChunksData;
}

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
 * Build conversation-aware query from recent messages
 */
function buildConversationQuery(messages: UIMessage[]): string {
  // Get last 4 messages (2 user + 2 assistant typically)
  const recentMessages = messages.slice(-4);
  
  // Filter to user messages and extract text
  const userMessages = recentMessages
    .filter(m => m.role === 'user')
    .map(m => extractTextFromMessage(m));
  
  // Join with spaces for context
  return userMessages.join(' ');
}

/**
 * Build system prompt with retrieved context and core definitions
 */
function buildSystemPrompt(contextChunks: Array<{ content: string; metadata: Record<string, unknown> }>): string {
  const data = loadChunksData();
  const systemContext = data.meta.system_prompt_context || '';
  
  let prompt = `You are a helpful assistant answering questions about "${data.meta.source}".\n\n`;
  
  // Add core definitions from the book
  if (systemContext) {
    prompt += `${systemContext}\n\n`;
  }
  
  // Add retrieved context
  if (contextChunks.length > 0) {
    prompt += `Use the following excerpts from the book to answer the user's question. If the answer cannot be found in these excerpts, say so.\n\n`;
    
    contextChunks.forEach((chunk, idx) => {
      const chapter = chunk.metadata.chapter as string | undefined;
      const pageRange = chunk.metadata.page_range as string | undefined;
      
      // Always include a header - use chapter name if available, fallback to passage number
      if (chapter) {
        prompt += `[Chapter: ${chapter}`;
        if (pageRange) prompt += `, p. ${pageRange}`;
        prompt += `]\n`;
      } else {
        prompt += `[Excerpt ${idx + 1}]\n`;
      }
      prompt += `${chunk.content}\n\n`;
    });
  }
  
  prompt += `Answer the user's question based on the information provided above. Be concise and accurate. Only if your answer uses information from the excerpts, include a single "Sources:" line at the end listing the unique chapter names you drew from (e.g., "Sources: Introduction, Chapter 3"). If the information is not found in the excerpts, simply say so without listing sources.`;
  
  return prompt;
}

// Zod schema for request validation
// AI SDK v6 uses various part types (text, step-start, tool-call, etc.)
const messagePartSchema = z.object({
  type: z.string(),
}).passthrough(); // Allow additional properties like 'text', 'state', etc.

const requestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    parts: z.array(messagePartSchema),
    id: z.string().optional(),
  }).passthrough()), // Allow additional properties for SDK compatibility
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
    
    // Find the latest user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'user');
    
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 });
    }
    
    // Build conversation-aware query for retrieval
    const conversationQuery = buildConversationQuery(messages as UIMessage[]);
    
    // Retrieve relevant context chunks using conversation context
    const contextChunks = await retrieveContext(conversationQuery, 5);
    
    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(contextChunks);
    
    // Convert UI messages to model messages
    // Cast to UIMessage[] since our flexible Zod schema validates the structure
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
      maxOutputTokens: 2000,
      temperature: 0.7,
    });
    
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

