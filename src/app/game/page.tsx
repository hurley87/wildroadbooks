import { GameInterface } from './game-interface';
import { AuthGate } from '@/components/auth-gate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Game - Catching Unicorns | Wild Road Books',
  description: 'Test your understanding of Week 1 Notebook Questions from Catching Unicorns in an immersive game experience.',
};

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 w-full">
        <div className="mx-auto max-w-6xl">
          <AuthGate>
            <GameInterface />
          </AuthGate>
        </div>
      </section>
    </main>
  );
}

