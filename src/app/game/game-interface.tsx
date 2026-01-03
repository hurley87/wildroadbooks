'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useRef, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { MicroInput } from '@/components/ui/micro-input';
import { QuestionCard } from '@/components/ui/question-card';
import { FeedbackBurst } from '@/components/ui/feedback-burst';
import { StreakFlame } from '@/components/ui/streak-flame';
import { SpeedBonus } from '@/components/ui/speed-bonus';
import { MilestoneToast } from '@/components/ui/milestone-toast';
import { RankPreview } from '@/components/ui/rank-preview';
import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles as SparklesIcon } from 'lucide-react';
import { SparklesIcon as SparklesComponent } from '@/components/ui/sparkles';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '@/lib/sound-manager';

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
  questionStartTime: number | null;
  lastResponseTime: number | null;
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
  // Questions come after the grade and feedback section
  let question = '';
  let feedback = text;
  
  if (grade !== null) {
    // If there's a grade, the question is typically after the feedback
    // Look for a line containing a question mark (questions must have '?')
    // Split by common separators and find the question
    const parts = text.split(/\n+/);
    
    // Find where feedback ends (after grade line and feedback sentences)
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      // Stop at first part that looks like a question (must contain question mark)
      if (part.includes('?') && !part.match(/^(Grade:|Great|Good|Almost|Correct|Incorrect)/i)) {
        question = parts.slice(i).join(' ').trim();
        feedback = parts.slice(0, i).join('\n').trim();
        break;
      }
    }
    
    // Fallback: if no clear question found, check if last part is a question (must contain question mark)
    if (!question && parts.length > 1) {
      const lastPart = parts[parts.length - 1].trim();
      if (lastPart.length > 10 && lastPart.includes('?') && !lastPart.match(/^(Grade:|Great|Good|Almost|Correct|Incorrect)/i)) {
        question = lastPart;
        feedback = parts.slice(0, -1).join('\n').trim();
      }
    }
  } else {
    // If no grade found and doesn't start with feedback keywords, might be a question
    if (!text.match(/^(Grade:|Great|Good|Almost|Correct|Incorrect)/i)) {
      question = text.trim();
      feedback = '';
    }
  }
  
  return { grade, feedback, question };
}

export function GameInterface() {
  const { user } = usePrivy();
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
    questionStartTime: null,
    lastResponseTime: null,
  });

  const sessionIdRef = useRef<string | null>(null);
  const hasStartedRef = useRef(false);

  // Generate session ID when starting a new game
  if (!sessionIdRef.current) {
    sessionIdRef.current = crypto.randomUUID();
  }

  const api = '/api/game';
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ 
      api,
      headers: async () => {
        const headers: Record<string, string> = {};
        if (user?.id) {
          // Use Privy user ID as Bearer token (in production, use actual access token)
          headers['Authorization'] = `Bearer ${user.id}`;
        }
        if (sessionIdRef.current) {
          headers['x-session-id'] = sessionIdRef.current;
        }
        return headers;
      },
    }),
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
        playSound('complete');
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
        questionStartTime: Date.now(), // Start timer when question is displayed
      }));
    }
  }, [messages, gameState.phase, gameState.streak, gameState.xp]);

  const handleStart = () => {
    setGameState((prev) => ({ ...prev, phase: 'question' }));
    setMessages([]);
    hasStartedRef.current = false;
  };

  const handleVoiceSubmit = (transcript: string) => {
    if (!transcript.trim() || isLoading) return;

    // Calculate response time
    const responseTimeMs = gameState.questionStartTime 
      ? Date.now() - gameState.questionStartTime 
      : undefined;

    setGameState((prev) => ({ 
      ...prev, 
      phase: 'evaluating',
      lastResponseTime: responseTimeMs || null,
    }));
    
    // Send message with response time in metadata
    sendMessage({ 
      text: transcript.trim(),
      metadata: responseTimeMs ? { responseTimeMs } : undefined,
    });
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
      questionStartTime: null,
      lastResponseTime: null,
    });
    setMessages([]);
    sessionIdRef.current = crypto.randomUUID(); // Generate new session ID
    hasStartedRef.current = false;
  };

  // Calculate progress for milestones
  const progress = gameState.questionNumber / gameState.totalQuestions;

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

      {/* Milestone Toast */}
      {gameState.phase !== 'intro' && gameState.phase !== 'complete' && (
        <MilestoneToast progress={progress} />
      )}

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
                streak={gameState.streak}
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
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <FeedbackBurst
                grade={gameState.lastGrade}
                feedback={gameState.lastFeedback}
                onComplete={handleFeedbackComplete}
              />
              {gameState.lastResponseTime !== null && (
                <SpeedBonus responseTimeMs={gameState.lastResponseTime} />
              )}
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
              <p className="text-slate-600 mb-4">
                {gameState.score >= 8 ? 'You have demonstrated a strong understanding of the Week 1 Notebook Questions.' :
                 gameState.score >= 6 ? 'You have a good grasp of the material. Review a few concepts to master them fully.' :
                 'Take another look at the Week 1 Notebook Questions and focus on the core concepts.'}
              </p>

              {/* Rank Preview */}
              <RankPreview xp={gameState.xp} className="mb-8" />

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

      {/* Micro Input - voice-only mode, always visible except in intro */}
      {gameState.phase !== 'intro' && gameState.phase !== 'complete' && (
        <MicroInput
          input=""
          handleInputChange={() => {}}
          handleSubmit={() => {}}
          isLoading={isLoading}
          voiceOnly={true}
          onVoiceSubmit={handleVoiceSubmit}
        />
      )}
    </div>
  );
}

