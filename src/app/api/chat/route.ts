import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { retrieveContext } from '@/lib/retrieval';
import { readFileSync } from 'fs';
import { join } from 'path';

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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid request: messages array required', { status: 400 });
    }
    
    // Find the latest user message for retrieval
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m: UIMessage) => m.role === 'user');
    
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 });
    }
    
    // Extract text content from user message (handle UIMessage structure)
    // AI SDK uses 'parts' array, but older versions may use 'content'
    const userMessageText = typeof lastUserMessage.content === 'string' 
      ? lastUserMessage.content 
      : (lastUserMessage.content?.find((part: any) => part.type === 'text')?.text 
         || (lastUserMessage as any).parts?.find((part: any) => part.type === 'text')?.text 
         || '');
    
    // Retrieve relevant context chunks
    const contextChunks = await retrieveContext(userMessageText, 5);
    
    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(contextChunks);
    
    // Convert UI messages to model messages
    const modelMessages = await convertToModelMessages(
      messages.map((msg: UIMessage) => {
        const { id, ...rest } = msg;
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

