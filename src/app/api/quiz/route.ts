import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { z } from 'zod';

// Week 1 Notebook Questions from the course plan
const WEEK_1_QUESTIONS = [
  {
    id: 1,
    topic: 'engrams-exograms-definition',
    question: "In footnote 2 on p. 4, we describe Merlin Donald's characterization of engrams and exograms. Define both terms and then explain his view of the advantages of exograms. Can you think of any other advantages of exograms?",
  },
  {
    id: 2,
    topic: 'memory-effort',
    question: 'As we know, both engrams and exograms require effort to form and store. Discuss the relative efforts required for each mode of memory.',
  },
  {
    id: 3,
    topic: 'engrams-not-exograms',
    question: 'Are there engrams that cannot be stored as exograms?',
  },
  {
    id: 4,
    topic: 'recall-speed',
    question: 'An important characteristic of memory is speed of recall. What are the relative speeds of recall for engrams and exograms?',
  },
  {
    id: 5,
    topic: 'education-engrams',
    question: "As a part of your education, you are forced to internalize a large list of engrams. For example, a mathematics student must understand how to differentiate an exponential function. With the technologies we now have to search and access our great quantity of exograms (i.e., Google, ChatGPT, etc.), is it still necessary to require students to form engrams?",
  },
  {
    id: 6,
    topic: 'spoken-symbols',
    question: "We've argued that a word written on a page is symbol. Is a spoken word also a symbol? Argue why or why not.",
  },
  {
    id: 7,
    topic: 'techno-literate-characteristics',
    question: 'On pp. 5-6, the characteristics of a techno-literate culture are defined. Briefly describe these 4 characteristics. Is the CAF a techno-literate culture?',
  },
  {
    id: 8,
    topic: 'cooperation-self-domestication',
    question: "A short time ago in evolutionary time (10,000 years ago), we lived in small hunter-gatherer groups. Today our techno-literate groups are very large and, for the most part, urbanized. It's been argued that we're able to live in large anonymous groups because we've self-domesticated (sheep, cows, and other animals have been domesticated with selective breeding) and this fosters cooperation. Why is cooperation so important to Homo sapiens?",
  },
  {
    id: 9,
    topic: 'counter-example-exographics',
    question: 'Use a counter-example to show that the following statement is false: All ideas discoverable by the human mind can be discovered without exographics.',
  },
  {
    id: 10,
    topic: 'abstract-objects',
    question: 'In the book, we refer to concepts without a real-world referent as abstract objects. So, the number 23 is an abstract object whereas a baseball is a concrete object. Explain why the mathematical concept of multiplication is an abstract object.',
  },
];

// Chapter 1 content for context
const CHAPTER_1_CONTENT = `# Introduction

One of the defining traits of our species is the capacity to generate ideas, ideas as diverse as microchips, baseball, and quantum theory. The main contribution of this book is to argue that writing — this skill we have to make persistent visual marks on a medium—has been extraordinarily valuable to us in the discovery of ideas. We'll first explain why and then look at its role in the advance of techno-literate culture, these modern cultures we inhabit that have emerged in only the last 10,000 years, a few minutes of evolutionary time.

Evolutionary biologists tell us that some 7 million years ago our ancestors were sitting in trees with those of chimpanzees. Approximately 3 million years ago, they were bipedal and beginning a period of significant encephalization. Homo sapiens came into existence in Africa about 300,000 years ago and nearly went extinct 70,000 years ago. About 60,000 years ago, we began a migration to Eurasia, eventually settling the globe. Throughout most of this history, we lived a hunter-gatherer existence with small groups moving to where food was more plentiful.

At the dawn of the Agricultural Revolution about 10,000-12,000 years ago, things started to change again in a significant way. In the Fertile Crescent, we began to live in fixed settlements to farm, domesticating various kinds of grains and animals. Eventually the Sumerians built walled cities within significant catchment areas, the first city-states. Importantly, they began to do some clever cultural things, such as making pottery on a large scale; building irrigation systems, constructing large temples and palaces; and inventing the plow, wheel, and lunar calendar. Many scholars mark Sumerian culture as the beginning of civilization.

But as it turns out, there was a revolution within the revolution.

About 5,000 years ago, to manage these fledgling city-states, Sumerian administrators began to make meaningful notations on wet clay tablets. For reasons we will explain, we refer to these notations as exographics. In effect, these tablets appear to have served as the equivalent of a modern shopping list, reminding administrators of who owed what in the settlement of palace and temple accounts. Unbeknownst to the Sumerians, this turned out to be a momentous discovery because we began to use this technology to discover important ideas that could not be discovered otherwise. In fact, we'll argue that these ideas constituted a whole new class of idea, one that would eventually give rise to the made world and lifeways of our modern techno-literate cultures.

Merlin Donald has rightly termed this discovery of non-biological memory a revolution—the Exographic Revolution—primarily because it allowed us to think in a very different way. With this technology, discovering Pirsig's "ghosts" was within our grasp.

So, over the last 10,000 years—a few minutes of evolutionary time—we've gone from small hunter-gatherer societies to the large techno-literate cultures we inhabit today. Back then, we lived in 30-50 person extended family groups. Now, most of us live in very large cities. Tokyo has a population of 37 million. What really sets us apart is our knack for culture. Relative to all other species, our cultural inventiveness has been astonishing. After all, cows don't barbecue or build smartphones, pigs can't make computer chips or do open-heart surgery, and whales can't play the guitar or make ice cream. The thesis of the book is that the phenomenon of the rise of techno-literate culture is explained by our relentlessly curious, networked imaginations enabled by exographics.

Let's unpack this statement.

Exographics is the term we use to describe our inscription of meaningful symbols on a visual medium. The key concept in this definition is the symbolic nature of exographics. By symbolic we mean the use of culturally-agreed symbols to represent the ideas and concepts our heads produce. For example, writing—the visual representations of the words we speak—is symbolic. If we write the word "apple" on a page, there is nothing about this symbol that connects it to the juicy red fruit. In fact, "apple" was spoken long before it was written, and back then our ancestors could just as easily have called it an "elppa."

By the same reasoning, speech is also symbolic.

Most importantly for our work, symbols can be used to represent abstract concepts. Take, for example, unicorns. We can write the word "unicorn," we can say it, and we can draw a picture of one. As we will see, this use of exographics to represent abstract concepts is the key to discovering a large class of ideas that we otherwise couldn't.

We label our modern culture a techno-literate culture and conceptualize it with four characteristics. First, most of the population has some minimal level of literacy including an ability to read, write, and do arithmetic. Second, it includes a relatively small set of individuals who are able to discover ideas that push our culture forward. Third, we've evolved socioeconomic structures and behavioral characteristics that enable large populations of strangers to coexist in relative harmony. These structures include cities, governments, laws, regulations, markets, media, prisons, corporations, and religions. And fourth, there is a substantial education system in place that teaches basic literacy and, for some, the advanced knowledge required to arrive at new ideas. Techno-literate culture is a tectonic shift from our lifeways as hunter-gatherers.

What is not obvious is the cognitive glue that enables this collaboration, but Sarah Hrdy offers some insight with this thought experiment. She first describes the typical things that happen when a group boards an airplane. As she explains, it's an orderly process where strangers go out of their way to cooperate and get along. She then wonders what would happen if it were chimps rather than humans getting on the plane with her:

I cannot keep from wondering what would happen if my fellow human passengers suddenly morphed into another species of ape. What if I were traveling with a planeload of chimpanzees? Any one of us would be lucky to disembark with all ten fingers and toes still attached... Bloody earlobes and other appendages would litter the aisles. Compressing so many highly impulsive strangers into a tight space would be a recipe for mayhem.

One of the benefits of domestication is that it's easier for us to collaborate, live in large anonymous groups, form complex social structures, and, most importantly for this work, solve important problems that require a collective effort. Evolutionary psychologists suggest that humans have undergone an evolutionary process similar to that of domesticated animals, in which traits promoting cooperation and reduced aggression were selected. In effect, they're suggesting we've self-domesticated.

Perhaps the most contentious part of our statement of purpose is the phrase "imaginations enabled by exographics." Exographics is an important cultural skill but does it really play a significant role in our cultural advance? Aren't exographics just a way of recording our thoughts once our imaginations come to them? The implicit premise of this line of reasoning is that we can discover any idea without exographics.

To see that this argument is false, consider the arithmetic problem 8,497 × 8,672. You likely don't know the answer so you can think of this as an artificial exercise to discover an idea. But there is a catch. You're not allowed to use your hands. You simply have to sit with them neatly folded and do the required calculations in your head.

With this constraint, we're trying to understand what our minds are capable of without exographics. Virtually all of us would find this "no-hands" problem impossible. That is, without exographics, it's impossible to discover the idea 8,497 × 8,672 = 73,685,984. But with exographics, it's easy. In fact, it's so easy that children learn to do it in grade school.

To take a more serious idea, consider Einstein's work to discover special relativity. He was famous for his thought experiments. For the one that led to special relativity, he imagined a one-car train with a passenger in the middle of the car traveling at high speed towards a station with an observer on the station's platform. At the point where the passenger is opposite the observer, the observer sees lightning strike the train at the front and back of the car simultaneously. Einstein wondered whether the passenger would see the same thing as the observer. It's at this point that he had to fall back to the mathematics of the experiment which he was able to work through with pen and paper. He freely admitted that his mathematics skills were poor, so there was no way that he could just sit and think through the mathematics in his mind and the complexity of the resulting mathematics bears this out. Einstein required exographics to discover special relativity.

We'll first argue that we do our best work in our visual field. We've been evolving this skill for at least 3 million years, dating to the time when our ancestors were chipping rocks to make tools. All of the material was before them, and they worked away until eventually a tool was produced. But there are some concepts we can imagine that do not have a real-world referent. An example is the number 23. Numbers exist only in our minds, but wood and hammers and nails are things we can reach out and touch. To make 23 real, we can use exographics to inscribe a representation of it on a visual medium, and in that way it comes into our visual field and is as real as a hammer. Once these products of our imaginations are reified on a visual medium, we can begin to use them to fashion new ideas just as our ancient ancestors chipped stone to make tools. As we see it, this is the crucial value of exographics that has been overlooked. Effectively, we're using exographics to make abstract objects real by bringing their exographic representations into our visual fields.

# Chapter 1: The Role of Exographics in the Discovery of Ideas

To avoid confusion, we've decided to term both types of writing exographics and define it to be the inscription of persistent symbols on a visible medium. Basically it's our ability to write symbols on a page (or any other medium). Merlin Donald was the first to use the term in the context of cognitive science.

We'll now get into a detailed explanation for how exographics enables us to discover ideas we otherwise couldn't.

We'll begin by considering our ability to remember symbolic information. Imagine someone speaking the sequence "k 9 L z t 10 b 23 t R" and you are required to remember the symbols in the order given. We'd find this difficult, and our guess is that most readers would also. It's because our memories are not designed to remember unrelated symbols easily. It would be much easier to remember the gist of a joke ten times longer.

Psychologists have proposed models of the way we remember and process information. One useful for our purposes is the Modal Model. It suggests that human memory comprises two main components: Working Memory (WM) and Long-Term Memory (LTM). LTM is a large store of method, knowledge, and experience. WM has the property of having low storage capacity. You can use it to recall a low volume of unrelated information (e.g. "k 9 L") but sequences like "k 9 L z t 10 b 23 t R" are simply too large. Unfortunately LTM is not much help because it's difficult to store symbol sequences quickly.

In sum, our memory architectures are such that we have difficulty storing long strings of unrelated symbolic information quickly. But if we have an exographics capability, we can write a symbolic string down and in so doing store it externally for easy recall later if required.

These arithmetic examples are important because they enable us to prove this statement is false:

All ideas discoverable by the human mind can be discovered without the use of external artifacts (such as exographics).

We term this the neurocentrism fallacy because some of the ideas we discover require us to use tools we operate with our hands. For most people, the arithmetic idea can only be discovered if they use tools like exographics, a calculator, an abacus, or a computer. This, then, is the advantage of exographics. Rather than trying to store the information in our biological memory systems, we can store it as exographics on a medium. Exographics makes 847 × 86 a simple problem. As we've explained, we term this the memory extension purpose of exographics.

Exographics is valuable for idea discovery in another important way. As we suggested in the introductory chapter, it enables us to bring concepts without a real-world referent into our visual fields, and this enables us to manipulate, combine, and recombine such concepts into new ideas.

The concepts we used—"size," "largest," "left," "different," and "3"—do not have corresponding referents in the real world. There is no such thing as a "3" in the real world. We could think about 3 pianos, 3 French hens, or 3 cylinders but there is nothing we can point to in the real world that is a "3." The same is true of the concepts "size," "largest," "left," and "different." We will take some philosophical liberties and label them abstract concepts and distinguish them from concrete concepts like "apples" and "banjos" which do have real-world referents.

As we argued earlier, we're especially good at working with materials in our visual fields to fashion cultural objects and the evidence for this goes back millions of years. In contrast, for certain ideas, the "raw materials" of those ideas are not naturally present in our visual fields. For example, as we noted above, there is no such thing as the number "3" in the real world. But we were able to invent this abstract concept and then bring a representation of it into our visual field by inscribing "3" on a medium. Once inscribed, this representation is as concrete as a tree or a stone. We can then combine it with representations of other abstract concepts in an argument to discover ideas. Hence, exographics allows us to bring representations of abstract concepts into our visual fields where we can then manipulate them into ideas and cultural objects. We term this purpose of exographics its reification purpose.

To summarize, exographics enables us to get representations of abstract concepts into our visual fields (reification purpose) and, once there, it extends our WMs to be able to make longer, more complex arguments (memory extension purpose).

**Note on Memory Terminology:** Merlin Donald distinguishes between engrams (internal/biological memory stored in our brains) and exograms (external memory stored outside our brains, such as writing, notes, books, etc.). The book discusses how exographics creates exograms that extend our memory capabilities.`;

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
  const questionsList = WEEK_1_QUESTIONS.map((q, idx) => `${idx + 1}. ${q.question}`).join('\n');
  
  return `You are a Socratic interviewer testing a student's comprehension of Week 1 Notebook Questions from "Catching Unicorns" by David Hurley and Bill Hurley.

Your role is to:
1. Ask exactly 8-10 questions from the Week 1 Notebook Questions below (aim for 10, but adapt based on conversation flow)
2. Ask ONE question at a time
3. After each answer, provide brief, encouraging feedback (1-2 sentences)
4. Evaluate understanding based on demonstrated knowledge
5. After the final question is answered, provide a final assessment and score

**IMPORTANT SCORING RULES:**
- Each question is worth 1 point (total: 10 points for 10 questions, or normalize to 10 if fewer questions)
- Score each answer: 1 point (excellent understanding), 0.5 points (partial understanding), 0 points (incorrect/no understanding)
- After the final answer, calculate the total score and end your response with: [SCORE:X/10] where X is the total score (0-10)

**CHAPTER 1 CONTENT (for reference):**
${CHAPTER_1_CONTENT}

**WEEK 1 NOTEBOOK QUESTIONS (select 8-10 from these):**
${questionsList}

**QUESTION STRATEGY:**
- Select questions from the Week 1 Notebook Questions list above
- You may adapt the wording slightly for conversational flow, but maintain the core intent of each question
- Start with foundational questions (like engrams/exograms definitions) before moving to more complex ones
- Progress through concepts naturally based on student responses
- Be conversational and encouraging - flow like a natural conversation
- Don't reveal answers - let the student demonstrate understanding
- Ensure good coverage across different topics from the question bank

**RESPONSE FORMAT:**
- Keep responses concise (2-4 sentences per question/feedback)
- After each answer, acknowledge what they got right, then ask the next question
- After the final answer, provide a brief summary assessment and include [SCORE:X/10] at the very end

Begin by asking your first question from the Week 1 Notebook Questions.`;
}

function buildQuizSystemPromptChallenging(questionsAsked: number): string {
  const questionsList = WEEK_1_QUESTIONS.map((q, idx) => `${idx + 1}. ${q.question}`).join('\n');
  
  return `You are a Socratic interviewer testing a student's comprehension of Week 1 Notebook Questions from "Catching Unicorns" by David Hurley and Bill Hurley.

Hard requirements:
- Ask exactly 8-10 questions total (aim for 10, label them Q1–Q10).
- Select questions from the Week 1 Notebook Questions list below.
- Ask ONE question at a time.
- After each user answer: briefly grade it (0/0.5/1), give 1–2 sentences of feedback, then ask the next question.
- After the user answers the final question: provide a brief overall assessment and end your response with exactly: [SCORE:X/10]

Scoring rules:
- Each question is worth 1 point (total 10 for 10 questions, normalize if fewer).
- 1 = accurate + specific + grounded in Chapter 1/Introduction (uses terms/examples correctly)
- 0.5 = partially correct OR correct but vague/ungrounded
- 0 = incorrect, unrelated, or "I don't know"

Critical behavior (adapt + challenge):
- Your interview MUST adapt to the user's answers.
- Select questions from the Week 1 Notebook Questions list that address gaps or weaknesses in the student's understanding.
- If the user is vague or wrong, you MUST challenge them by selecting a question that forces precision or reconciliation (still only ONE question).
- You may adapt the wording of questions slightly for conversational flow, but maintain the core intent.
- If the user is strong, select more challenging questions or ask for deeper analysis on complex topics.

Conversation state:
- You have already asked ${questionsAsked} questions.
- If ${questionsAsked} = 0, ask Q1. If 1, ask Q2, etc.
- If ${questionsAsked} >= 10, DO NOT ask more questions; provide the final assessment and [SCORE:X/10].
- If ${questionsAsked} >= 8 and the conversation feels complete, you may conclude early (still normalize score to /10).

Chapter 1 content (the only ground truth):
${CHAPTER_1_CONTENT}

**WEEK 1 NOTEBOOK QUESTIONS (select 8-10 from these):**
${questionsList}

Response format (every turn):
- "Grade: N/1 — <very short reason>"
- 1–2 sentences of feedback (encouraging but honest)
- Then ask the next question (ONE question, labeled Q#)

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


