'use client';

import { usePrivy } from '@privy-io/react-auth';
import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { SparklesIcon as SparklesComponent } from '@/components/ui/sparkles';
import { motion } from 'motion/react';

interface AuthGateProps {
  children: ReactNode;
}

/**
 * AuthGate component that protects routes requiring authentication.
 * Shows email login UI for unauthenticated users and renders children for authenticated users.
 */
export function AuthGate({ children }: AuthGateProps) {
  const { ready, authenticated, login } = usePrivy();

  // Bypass auth in test mode (E2E testing)
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';
  if (isTestMode) {
    return <>{children}</>;
  }

  // Show loading state while Privy initializes
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  if (authenticated) {
    return <>{children}</>;
  }

  // Show login UI for unauthenticated users
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-center max-w-md"
      >
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 relative overflow-hidden shadow-lg">
            <SparklesComponent size={48} className="text-primary" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow" />
          </div>
        </div>

        <h1 className="text-3xl font-serif mb-4 text-slate-900">
          Sign in to Play
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Sign in with your email to start playing the quiz game and earn XP!
        </p>

        <Button
          onClick={login}
          size="lg"
          className="text-lg px-8 py-6"
        >
          <SparklesComponent size={20} className="mr-2" />
          Sign in with Email
        </Button>
      </motion.div>
    </div>
  );
}

