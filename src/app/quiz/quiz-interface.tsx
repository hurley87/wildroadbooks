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

// Preface content from chunks.json
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

    // Look for score pattern [SCORE:X/10]
    const scoreMatch = textContent.match(/\[SCORE:(\d+)\/10\]/);
    if (!scoreMatch) return;

    const parsedScore = parseInt(scoreMatch[1], 10);
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
                • Question {questionCount} of 5
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
                I'll ask you 5 questions about the Preface to test your
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
              <span className="text-sm font-medium text-foreground">Preface</span>
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
                {PREFACE_CONTENT}
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
                  {score >= 8 ? 'You have demonstrated a strong understanding of the key concepts from the Preface.' :
                   score >= 6 ? 'You have a good grasp of the material. Review a few concepts to master them fully.' :
                   'Take another look at the Preface and focus on the core concepts of exographics.'}
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
                  Review Preface
                </Button>
              </div>
            </div>
            
            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              Your score reflects understanding across 5 key concepts from the Preface.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

