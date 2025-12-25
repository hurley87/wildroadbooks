'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatMessage } from '@/components/ui/chat-message';
import { ChatInput } from '@/components/ui/chat-input';
import { SparklesIcon } from '@/components/ui/sparkles';
import { RotateCCWIcon } from '@/components/ui/rotate-ccw';
import { LoaderPinwheelIcon } from '@/components/ui/loader-pinwheel';
import { BookTextIcon } from '@/components/ui/book-text';
import { Square, Trophy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type QuizPhase = 'reading' | 'quiz' | 'results';
type PromptStyle = 'challenge' | 'classic';

// Introduction and Chapter 1 content
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

To summarize, exographics enables us to get representations of abstract concepts into our visual fields (reification purpose) and, once there, it extends our WMs to be able to make longer, more complex arguments (memory extension purpose).`;

function PromptStyleToggle({
  promptStyle,
  onChange,
  isDisabled,
}: {
  promptStyle: PromptStyle;
  onChange: (next: PromptStyle) => void;
  isDisabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant={promptStyle === 'classic' ? 'default' : 'outline'}
        onClick={() => onChange('classic')}
        disabled={isDisabled}
        className="text-xs"
      >
        Classic
      </Button>
      <Button
        type="button"
        size="sm"
        variant={promptStyle === 'challenge' ? 'default' : 'outline'}
        onClick={() => onChange('challenge')}
        disabled={isDisabled}
        className="text-xs"
      >
        Challenging
      </Button>
    </div>
  );
}

function QuizChat({
  promptStyle,
  onResetToReading,
  onFinished,
  onChangePromptStyle,
}: {
  promptStyle: PromptStyle;
  onResetToReading: () => void;
  onFinished: (score: number) => void;
  onChangePromptStyle: (next: PromptStyle) => void;
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const api =
    promptStyle === 'classic'
      ? '/api/quiz?style=classic'
      : '/api/quiz?style=challenge';

  const { messages, sendMessage, status, error, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({
      api,
    }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Start the quiz immediately when mounted (matches previous "Start Quiz" behavior)
  // Uses ref guard to prevent double-send in React Strict Mode
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    sendMessage({ text: "I'm ready to start the quiz." });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Parse score from messages
  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant') return;

    const textParts = lastMessage.parts.filter((part) => part.type === 'text');
    const textContent = textParts.map((part) => part.text).join('');

    // Look for score pattern [SCORE:X/10] (supports decimal scores like 9.5)
    const scoreMatch = textContent.match(/\[SCORE:(\d+(?:\.\d+)?)\/10\]/);
    if (!scoreMatch) return;

    const parsedScore = parseFloat(scoreMatch[1]);
    if (!Number.isFinite(parsedScore)) return;

    onFinished(parsedScore);
  }, [messages, onFinished]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput('');
  };

  // Count questions asked (assistant messages that aren't the final score)
  const questionCount = messages.filter(
    (msg) =>
      msg.role === 'assistant' &&
      !msg.parts.some(
        (part) => part.type === 'text' && part.text.includes('[SCORE:')
      )
  ).length;

  return (
    <>
      {/* Header with progress + style toggle + reset */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <SparklesIcon size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            Quiz Interviewer
            {questionCount > 0 && (
              <span className="ml-2 text-muted-foreground">
                • Question {questionCount} of 10
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <PromptStyleToggle
            promptStyle={promptStyle}
            isDisabled={isLoading}
            onChange={(next) => {
              // Avoid mixing prompt styles mid-thread; reset back to reading on change.
              onChangePromptStyle(next);
              setMessages([]);
              setInput('');
              onResetToReading();
            }}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([]);
              setInput('');
              onResetToReading();
            }}
            className="text-xs"
          >
            <RotateCCWIcon size={14} className="mr-1.5" />
            Reset
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 relative">
            <div className="pointer-events-none absolute inset-0 paper-texture opacity-30" />

            <div className="relative z-10 text-center max-w-2xl animate-fade-up">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-primary border-2 border-primary/30 relative overflow-hidden shadow-lg">
                  <SparklesIcon size={32} className="text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow" />
                </div>
              </div>

              <h2 className="text-2xl font-serif mb-3 text-foreground">
                Ready for Your Quiz
              </h2>
              <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                I'll ask you 8-10 questions about Chapter 1 to test your
                understanding. Answer each question thoughtfully, and I'll
                evaluate your responses.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="group flex w-full gap-4 py-4 px-6 bg-muted/30 animate-fade-in relative">
                <div className="pointer-events-none absolute inset-0 paper-texture" />
                <div className="flex w-full max-w-3xl mx-auto gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-primary border border-primary/30 relative overflow-hidden">
                      <SparklesIcon size={20} className="text-primary" />
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <LoaderPinwheelIcon size={16} />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stop}
                    className="flex-shrink-0 text-xs"
                    aria-label="Stop generation"
                  >
                    <Square className="h-3.5 w-3.5 mr-1.5" />
                    Stop
                  </Button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm border-t border-border animate-fade-in">
            <strong>Error:</strong>{' '}
            {error.message || 'An error occurred while processing your request.'}
          </div>
        )}
      </div>

      {/* Input area */}
      <ChatInput
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        placeholder="Type your answer here..."
      />
    </>
  );
}

export function QuizInterface() {
  const [phase, setPhase] = useState<QuizPhase>('reading');
  const [score, setScore] = useState<number | null>(null);
  const [promptStyle, setPromptStyle] = useState<PromptStyle>('challenge');
  const [quizRunKey, setQuizRunKey] = useState(0);

  const handleStartQuiz = () => {
    setPhase('quiz');
    setScore(null);
    setQuizRunKey((k) => k + 1);
  };
  
  const handleRetry = () => {
    setPhase('reading');
    setScore(null);
    setQuizRunKey((k) => k + 1);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] border border-border rounded-lg overflow-hidden bg-background shadow-lg gilt-edge">
      {/* Reading Phase */}
      {phase === 'reading' && (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <BookTextIcon size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Chapter 1</span>
            </div>
            <PromptStyleToggle
              promptStyle={promptStyle}
              onChange={(next) => {
                setPromptStyle(next);
                setScore(null);
                setQuizRunKey((k) => k + 1);
              }}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-serif prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-strong:font-semibold">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {CHAPTER_1_CONTENT}
              </div>
            </div>
          </div>
          
          <div className="border-t border-border bg-background/95 backdrop-blur-sm p-6">
            <Button
              onClick={handleStartQuiz}
              className="w-full"
              size="lg"
            >
              <SparklesIcon size={16} className="mr-2" />
              Start Quiz
            </Button>
          </div>
        </div>
      )}
      
      {/* Quiz Phase */}
      {phase === 'quiz' && (
        <QuizChat
          key={`${promptStyle}-${quizRunKey}`}
          promptStyle={promptStyle}
          onChangePromptStyle={(next) => setPromptStyle(next)}
          onResetToReading={() => {
            setPhase('reading');
            setScore(null);
            setQuizRunKey((k) => k + 1);
          }}
          onFinished={(parsedScore) => {
            setScore(parsedScore);
            setPhase('results');
          }}
        />
      )}
      
      {/* Results Phase */}
      {phase === 'results' && score !== null && (
        <div className="flex flex-col h-full items-center justify-center px-6 py-12 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 paper-texture opacity-30" />
          
          <div className="relative z-10 w-full max-w-md">
            {/* Results card */}
            <div className="bg-background border border-border rounded-2xl p-8 shadow-xl gilt-edge animate-fade-up">
              {/* Score ring */}
              <div className="flex justify-center mb-8">
                <div className="relative w-32 h-32">
                  {/* Outer ring */}
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    {/* Background circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={score >= 8 ? 'hsl(160, 40%, 35%)' : score >= 6 ? 'hsl(45, 80%, 45%)' : 'hsl(25, 85%, 50%)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(score / 10) * 339.292} 339.292`}
                      strokeDashoffset="0"
                      className="transition-all duration-1000 ease-out"
                      style={{ 
                        filter: `drop-shadow(0 0 6px ${score >= 8 ? 'hsl(160, 40%, 35%)' : score >= 6 ? 'hsl(45, 80%, 45%)' : 'hsl(25, 85%, 50%)'})`
                      }}
                    />
                  </svg>
                  {/* Score text in center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-4xl font-bold text-foreground leading-none">{score}</span>
                    <span className="text-sm text-muted-foreground font-medium mt-1">out of 10</span>
                  </div>
                </div>
              </div>
              
              {/* Result message */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif mb-2 text-foreground">
                  {score >= 8 ? 'Excellent Work!' :
                   score >= 6 ? 'Well Done!' :
                   'Keep Learning!'}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {score >= 8 ? 'You have demonstrated a strong understanding of the key concepts from Chapter 1.' :
                   score >= 6 ? 'You have a good grasp of the material. Review a few concepts to master them fully.' :
                   'Take another look at Chapter 1 and focus on the core concepts of exographics, engrams, and exograms.'}
                </p>
              </div>
              
              {/* Score breakdown hint */}
              <div className="bg-muted/30 rounded-lg p-4 mb-6 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    score >= 8 ? "bg-primary/10 text-primary" :
                    score >= 6 ? "bg-yellow-500/10 text-yellow-600" :
                    "bg-orange-500/10 text-orange-600"
                  )}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      {score >= 8 ? 'Expert Level' :
                       score >= 6 ? 'Proficient' :
                       'Developing'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {score * 10}% comprehension achieved
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleRetry}
                  size="lg"
                  className="w-full"
                >
                  <RotateCCWIcon size={16} className="mr-2" />
                  Take Quiz Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPhase('reading')}
                  className="w-full"
                >
                  <BookTextIcon size={16} className="mr-2" />
                  Review Chapter 1
                </Button>
              </div>
            </div>
            
            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Your score reflects understanding across 8-10 key concepts from Chapter 1.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

