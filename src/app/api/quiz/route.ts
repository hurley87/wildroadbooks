import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { z } from 'zod';

// Full preface content for context
const PREFACE_CONTENT = `Over most of this project, our intent was to title this book "Why Writing Matters." We felt that writing was an important technology that was not receiving the recognition it deserved. Some scholars have taken an entirely different view, seeing it as unimportant. Others have viewed it as an instrument of colonial oppression. Given these stark differences, we decided to explore what precisely writing does for us, particularly when it comes to the discovery of ideas, such things as smartphones, mRNA vaccines, and Large Language Models. Is writing simply a way to record our thinking as we come to it, or does it do something more?

Our point of departure is the work of the cognitive neuroscientist Merlin Donald. Donald coined the term exographics, which he defined to be writing in its broadest sense, writing that not only included the representation of speech but also the symbolic systems of mathematics, music, science, engineering, and other areas of inquiry. He argued that exographics allows us to discover ideas we otherwise couldn't.

Here is an example. Imagine trying to get this sum: 84 + 1, 045 + 693 + 719. Think of this problem as a simple example of trying to discover an idea. Furthermore, you are not allowed to use paper and a pen to get an answer because we're interested in what you can do without recourse to writing. You simply have to sit with your hands neatly folded and work it out in your unaided mind.

Your authors would struggle to remember the numbers, never mind get a correct sum. But if we had a pencil and some paper, we could write down the numbers and then get an answer. Admittedly, this is a simple example, but it clarifies the existence of certain ideas that are only discoverable with exographics.

A more serious example comes from Einstein's work to discover special relativity. He was famous for his thought experiments. The one that led to special relativity had a one-car train with a passenger in the middle of the car traveling at high speed towards a station with an observer on the station's platform. At the point where the passenger is opposite the observer, the observer sees lightening strike the train at the front and back of the car simultaneously. Einstein wondered whether the passenger would see the same thing as the observer. It's at this point that he had to fall back to the mathematics of the experiment which he was able to work through with pen and paper. He freely admitted that his mathematics skills were poor, so there was no way that he could just sit and think the mathematics through in his mind and the complexity of the resulting mathematics bears this out. Einstein required exographics to discover special relativity.

The importance of writing to certain kinds of thinking was a revelation to us. We had thought that all thinking was done in our minds and that exographics was just a way to record the results of that thinking. But, as the arithmetic and Einstein examples illustrate, that's not the case. Furthermore, we were never taught this because our teachers were unaware of it. In fact, it was only discovered in the early 1990s by Donald and other psychologists. The result is still not widely understood, and this is one of our reasons for writing this book.

Once we establish the important role of exographics in the discovery of ideas, our next step will be to explain why the discovery of some ideas requires exographics but others don't. For example, the American R&B percussionists who invented the backbeat didn't need exographics to do so. Neither did Edmond Albius, the boy who, in 1841, discovered a method to hand–pollinate vanilla orchids, which allowed the cultivation of vanilla outside its native habitat and expanded the production of the spice considerably.

So why is exographics required for some ideas but not others?

Our preferred sensory mode for discovering ideas is our visual field. Some 2.5 million years ago, our ancient ancestors were cracking stones together to produce a sharp edge, which would have been helpful in a variety of uses including the butchering of a carcass and the shaping of a wood blank into a spear. For these ancient craftsmen, all of the materials they used were in their visual fields, and the production process could be observed from start to finish. That is not true of the arithmetic problem above. There is no such thing as an "84" in the real world. Nor is there a "+" sign. These are abstract concepts we've invented. To use them to develop an argument, we had to get their representations into our visual fields, and we did this with exographics, symbols written on a physical medium like clay tablets or paper. In this way, these "unicorns" of our minds become as real as stone and wood. It's at this point that we can begin to combine them into ideas, ideas like 84 + 1, 045 + 693 + 719 = 2, 541 and special relativity.

To summarize, when it comes to discovering ideas, we use exographics for two important purposes. First, it enables us to bring representations of abstract concepts into our visual fields (we term this the reification purpose). And second, it enables us to construct longer threads of reasoning involving these representations of abstract concepts (the memory extension purpose). With exographics, Einstein was able to catch the unicorns his mind produced.

From there, we'll look at the societal impacts of the exographics technology. We'll show that it's led to an astonishingly large class of ideas that we could not have discovered otherwise. We term this collection the e-Class and we'll argue that it's been increasing at an exponential rate for centuries. In fact, it's these e-Class ideas that have enabled the rise of techno-literate cultures. Our strong conclusion is that exographics is the most important technology we've created. It's enabled us to go from the hunter-gatherer existence our ancestors lived 10,000 years ago to today's advanced techno-literate cultures.

Bill Hurley, Kingston, Ontario
David Hurley, Stouville, Ontario`;

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
 * Build system prompt for the quiz interviewer
 */
function buildQuizSystemPromptClassic(): string {
  return `You are a Socratic interviewer testing a student's comprehension of the Preface from "Catching Unicorns" by David Hurley and Bill Hurley.

Your role is to:
1. Ask exactly 5 questions about the Preface content
2. Ask ONE question at a time
3. After each answer, provide brief, encouraging feedback (1-2 sentences)
4. Evaluate understanding based on demonstrated knowledge
5. After the 5th question is answered, provide a final assessment and score

**IMPORTANT SCORING RULES:**
- Each of the 5 questions is worth 2 points (total: 10 points)
- Score each answer: 2 points (excellent understanding), 1 point (partial understanding), 0 points (incorrect/no understanding)
- After the 5th answer, calculate the total score and end your response with: [SCORE:X/10] where X is the total score (0-10)

**PREFACE CONTENT:**
${PREFACE_CONTENT}

**KEY CONCEPTS TO COVER IN YOUR QUESTIONS:**
1. Exographics definition (Merlin Donald's term for writing in its broadest sense)
2. The arithmetic example (why paper is needed to solve 84 + 1045 + 693 + 719)
3. Einstein's special relativity example (thought experiment requiring pen and paper)
4. Visual field preference (why abstract concepts need to be brought into visual field)
5. Two purposes of exographics (reification and memory extension)
6. e-Class (ideas that require exographics to discover)
7. Techno-literate culture (enabled by e-Class ideas)

**QUESTION STRATEGY:**
- Start with a welcoming question about exographics
- Progress to more specific concepts
- Mix conceptual questions with example-based questions
- Be conversational and encouraging
- Don't reveal answers - let the student demonstrate understanding

**RESPONSE FORMAT:**
- Keep responses concise (2-4 sentences per question/feedback)
- After each answer, acknowledge what they got right, then ask the next question
- After the 5th answer, provide a brief summary assessment and include [SCORE:X/10] at the very end

Begin by asking your first question about the Preface.`;
}

function buildQuizSystemPromptChallenging(questionsAsked: number): string {
  return `You are a Socratic interviewer testing a student's comprehension of the Preface from "Catching Unicorns" by David Hurley and Bill Hurley.

Hard requirements:
- Ask exactly 5 questions total (label them Q1–Q5).
- Ask ONE question at a time.
- After each user answer: briefly grade it (0/1/2), give 1–2 sentences of feedback, then ask the next question.
- After the user answers Q5: provide a brief overall assessment and end your response with exactly: [SCORE:X/10]

Scoring rules:
- Each question is worth 2 points (total 10).
- 2 = accurate + specific + grounded in the Preface (uses terms/examples correctly)
- 1 = partially correct OR correct but vague/ungrounded
- 0 = incorrect, unrelated, or "I don't know"

Critical behavior (adapt + challenge):
- Your interview MUST adapt to the user's answers.
- If the user is vague or wrong, you MUST challenge them by making the next question force precision or reconciliation (still only ONE question).
  Examples of challenge styles (choose one when needed):
  - "You said X—how does that fit with Y from the arithmetic/Einstein example?"
  - "What would someone who disagrees say, and why does the Preface reject that?"
  - "Name the exact term (reification vs memory extension) and apply it to an example."
- If the user is strong, raise difficulty: ask for a tighter definition, compare the two examples, or connect to e-Class/techno-literate culture.

Conversation state:
- You have already asked ${questionsAsked} questions.
- If ${questionsAsked} = 0, ask Q1. If 1, ask Q2, etc.
- If ${questionsAsked} >= 5, DO NOT ask more questions; provide the final assessment and [SCORE:X/10].

Preface content (the only ground truth):
${PREFACE_CONTENT}

Coverage targets (ensure all are assessed by Q5, but adapt ordering based on weaknesses):
- Exographics definition (Merlin Donald)
- Arithmetic example (why unaided mind struggles; why paper helps)
- Einstein example (thought experiment + need for math/exographics)
- Visual field preference + abstract symbols
- Two purposes: reification + memory extension
- e-Class + techno-literate culture

Response format (every turn):
- "Grade: N/2 — <very short reason>"
- 1–2 sentences of feedback (encouraging but honest)
- Then ask the next question (ONE question, labeled Q#)

Begin now with your next question.`;
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
    
    // Find the latest user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'user');
    
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 });
    }
    
    // Count questions asked so far
    const questionsAsked = countQuestionsAsked(messages as UIMessage[]);
    
    // Build system prompt (toggleable via query param)
    // - style=classic uses the original, gentler interviewer
    // - any other value defaults to the challenging/adaptive interviewer
    const style = new URL(req.url).searchParams.get('style');
    const systemPrompt =
      style === 'classic'
        ? buildQuizSystemPromptClassic()
        : buildQuizSystemPromptChallenging(questionsAsked);
    
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
      maxOutputTokens: 1500,
      temperature: 0.7,
    });
    
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Quiz API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}


