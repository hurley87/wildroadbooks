'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useRef, useMemo } from 'react';
import { MicroInput } from '@/components/ui/micro-input';
import { QuestionCard } from '@/components/ui/question-card';
import { FeedbackBurst } from '@/components/ui/feedback-burst';
import { StreakFlame } from '@/components/ui/streak-flame';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles as SparklesIcon } from 'lucide-react';
import { SparklesIcon as SparklesComponent } from '@/components/ui/sparkles';
import { motion, AnimatePresence } from 'motion/react';

type GamePhase = 'intro' | 'question' | 'evaluating' | 'feedback' | 'complete';

interface GameState {
  phase: GamePhase;
  questionNumber: number;
  totalQuestions: number;
  currentQuestion: string;
  xp: number;
  level: number;
  streak: number;
  score: number | null;
  lastGrade: 0 | 0.5 | 1 | null;
  lastFeedback: string;
}

function extractTextFromMessage(message: any): string {
  return message.parts
    ?.filter((part: any) => part.type === 'text')
    ?.map((part: any) => part.text)
    ?.join(' ') ?? '';
}

function parseGradeFromText(text: string): { grade: 0 | 0.5 | 1 | null; feedback: string; question: string } {
  // Look for "Grade: X/1" pattern
  const gradeMatch = text.match(/Grade:\s*(\d+(?:\.\d+)?)\/1/i);
  let grade: 0 | 0.5 | 1 | null = null;
  
  if (gradeMatch) {
    const gradeValue = parseFloat(gradeMatch[1]);
    if (gradeValue === 1) grade = 1;
    else if (gradeValue === 0.5) grade = 0.5;
    else if (gradeValue === 0) grade = 0;
  }
  
  // Check for final score (not a grade)
  const scoreMatch = text.match(/\[SCORE:(\d+(?:\.\d+)?)\/10\]/);
  if (scoreMatch) {
    return { grade: null, feedback: text, question: '' };
  }
  
  // Extract question from the text (usually after feedback)
  // Look for Q#: or Question #: pattern
  const qMatch = text.match(/(?:Q\d+:|Question\s+\d+:)\s*(.+?)(?:\n|$)/i);
  let question = '';
  if (qMatch) {
    question = qMatch[1].trim();
  } else {
    // If no grade found and doesn't start with feedback keywords, might be a question
    if (!grade && !text.match(/^(Grade:|Great|Good|Almost|Correct|Incorrect)/i)) {
      question = text.trim();
    }
  }
  
  // Extract feedback (everything before the question, or whole text if no question)
  let feedback = text;
  if (question && qMatch) {
    const questionIndex = text.indexOf(qMatch[0]);
    if (questionIndex > 0) {
      feedback = text.substring(0, questionIndex).trim();
    }
  }
  
  return { grade, feedback, question };
}

export function GameInterface() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'intro',
    questionNumber: 0,
    totalQuestions: 10,
    currentQuestion: '',
    xp: 0,
    level: 1,
    streak: 0,
    score: null,
    lastGrade: null,
    lastFeedback: '',
  });

  const [input, setInput] = useState('');
  const hasStartedRef = useRef(false);

  const api = '/api/quiz?style=challenge';
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Start quiz when entering question phase
  useEffect(() => {
    if (gameState.phase === 'question' && !hasStartedRef.current) {
      hasStartedRef.current = true;
      sendMessage({ text: "I'm ready to start the quiz." });
    }
  }, [gameState.phase, sendMessage]);

  // Parse messages to extract questions, grades, and scores
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'assistant') return;

    const textContent = extractTextFromMessage(lastMessage);

    // Check for final score
    const scoreMatch = textContent.match(/\[SCORE:(\d+(?:\.\d+)?)\/10\]/);
    if (scoreMatch) {
      const finalScore = parseFloat(scoreMatch[1]);
      if (Number.isFinite(finalScore)) {
        setGameState((prev) => ({
          ...prev,
          phase: 'complete',
          score: finalScore,
        }));
        return;
      }
    }

    // Parse grade, feedback, and question from response
    const { grade, feedback, question } = parseGradeFromText(textContent);
    
    if (grade !== null && gameState.phase === 'evaluating') {
      // Calculate XP gain with streak multiplier
      const baseXp = 100;
      const multiplier = gameState.streak >= 5 ? 3 : gameState.streak >= 3 ? 2 : 1;
      const xpGain = grade === 1 ? baseXp * multiplier : grade === 0.5 ? (baseXp / 2) * multiplier : 0;
      
      const newXp = gameState.xp + xpGain;
      const newLevel = Math.floor(newXp / 500) + 1;
      const newStreak = grade === 1 ? gameState.streak + 1 : 0;

      setGameState((prev) => ({
        ...prev,
        phase: 'feedback',
        lastGrade: grade,
        lastFeedback: feedback,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        // Store question if present for after feedback
        currentQuestion: question || prev.currentQuestion,
      }));
    } else if (question && gameState.phase !== 'feedback' && gameState.phase !== 'evaluating') {
      // New question received
      const questionCount = messages.filter(
        (msg) =>
          msg.role === 'assistant' &&
          !extractTextFromMessage(msg).includes('[SCORE:')
      ).length;

      setGameState((prev) => ({
        ...prev,
        phase: 'question',
        questionNumber: questionCount,
        currentQuestion: question,
      }));
    }
  }, [messages, gameState.phase, gameState.streak, gameState.xp]);

  const handleStart = () => {
    setGameState((prev) => ({ ...prev, phase: 'question' }));
    setMessages([]);
    hasStartedRef.current = false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setGameState((prev) => ({ ...prev, phase: 'evaluating' }));
    sendMessage({ text: input });
    setInput('');
  };

  const handleFeedbackComplete = () => {
    setGameState((prev) => ({
      ...prev,
      phase: 'question',
      lastGrade: null,
      lastFeedback: '',
    }));
  };

  const handleRetry = () => {
    setGameState({
      phase: 'intro',
      questionNumber: 0,
      totalQuestions: 10,
      currentQuestion: '',
      xp: 0,
      level: 1,
      streak: 0,
      score: null,
      lastGrade: null,
      lastFeedback: '',
    });
    setMessages([]);
    setInput('');
    hasStartedRef.current = false;
  };

  // Memoize particle positions for stability
  const particlePositions = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }));
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-200px)] game-light">
      {/* Bright game background */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 -z-10" />
      
      {/* Ambient particles - subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {particlePositions.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-emerald-500/15 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Intro Phase */}
      <AnimatePresence>
        {gameState.phase === 'intro' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center max-w-2xl"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 relative overflow-hidden shadow-lg">
                  <SparklesComponent size={48} className="text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow" />
                </div>
              </div>
              <p className="text-lg text-slate-600 mb-8">
                Test your understanding of Week 1 Notebook Questions from{' '}
                <em className="text-slate-700">Catching Unicorns</em>. Answer questions to earn XP, build streaks, and level up!
              </p>
              <Button onClick={handleStart} size="lg" className="text-lg px-8 py-6">
                <SparklesIcon className="mr-2" size={20} />
                Begin
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Phase */}
      {gameState.phase !== 'intro' && gameState.phase !== 'complete' && (
        <div className="flex flex-col min-h-[calc(100vh-200px)] pb-32">
          {/* Full-width progress bar at top */}
          <div className="w-full h-2 bg-slate-200 relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
              initial={false}
              animate={{
                width: `${(gameState.questionNumber / gameState.totalQuestions) * 100}%`,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
              style={{
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
              }}
            />
          </div>

          {/* Header with stats */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center">
              {/* Streak */}
              <StreakFlame streak={gameState.streak} />
            </div>
          </div>

          {/* Question Card - tighter spacing with transition */}
          {gameState.currentQuestion && gameState.phase === 'question' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 150,
                duration: 0.5,
              }}
              className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-4 sm:pt-6"
            >
              <QuestionCard
                question={gameState.currentQuestion}
                questionNumber={gameState.questionNumber}
                totalQuestions={gameState.totalQuestions}
                className="w-full max-w-3xl"
              />
            </motion.div>
          )}

          {/* Loading state - waiting for first question */}
          {gameState.phase === 'question' && !gameState.currentQuestion && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Preparing your first question...</p>
              </div>
            </div>
          )}

          {/* Evaluating state */}
          {gameState.phase === 'evaluating' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Evaluating your answer...</p>
              </div>
            </div>
          )}

          {/* Feedback */}
          {gameState.phase === 'feedback' && gameState.lastGrade !== null && (
            <div className="flex-1 flex items-center justify-center">
              <FeedbackBurst
                grade={gameState.lastGrade}
                feedback={gameState.lastFeedback}
                onComplete={handleFeedbackComplete}
              />
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-lg shadow-lg z-50">
              {error.message || 'An error occurred'}
            </div>
          )}
        </div>
      )}

      {/* Complete Phase */}
      <AnimatePresence>
        {gameState.phase === 'complete' && gameState.score !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center max-w-md"
            >
              <div className="mb-8 flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted/20"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={gameState.score >= 8 ? 'hsl(160, 70%, 45%)' : gameState.score >= 6 ? 'hsl(38, 90%, 55%)' : 'hsl(0, 70%, 55%)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(gameState.score / 10) * 339.292} 339.292`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-slate-900 leading-none">
                      {gameState.score}
                    </span>
                    <span className="text-sm text-slate-600 font-medium mt-1">
                      out of 10
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-serif mb-4 text-slate-900">
                {gameState.score >= 8 ? 'Mastery Achieved!' :
                 gameState.score >= 6 ? 'Well Played!' :
                 'Keep Learning!'}
              </h2>
              <p className="text-slate-600 mb-8">
                {gameState.score >= 8 ? 'You have demonstrated a strong understanding of the Week 1 Notebook Questions.' :
                 gameState.score >= 6 ? 'You have a good grasp of the material. Review a few concepts to master them fully.' :
                 'Take another look at the Week 1 Notebook Questions and focus on the core concepts.'}
              </p>

              <div className="flex flex-col gap-3">
                <Button onClick={handleRetry} size="lg" className="w-full">
                  <RotateCcw className="mr-2" size={16} />
                  Play Again
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Micro Input - always visible except in intro */}
      {gameState.phase !== 'intro' && gameState.phase !== 'complete' && (
        <MicroInput
          input={input}
          handleInputChange={(e) => setInput(e.target.value)}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Type your answer..."
          showHelper={gameState.phase === 'question'}
          onSpeechResult={(transcript) => {
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }}
        />
      )}
    </div>
  );
}

