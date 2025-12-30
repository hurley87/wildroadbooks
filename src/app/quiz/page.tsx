import { QuizInterface } from './quiz-interface';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Week 1 Quiz - Catching Unicorns | Wild Road Books',
  description: 'Test your understanding of Week 1 Notebook Questions from Catching Unicorns. Answer questions about engrams, exograms, exographics, techno-literate culture, and abstract objects.',
};

export default function QuizPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 w-full">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif tracking-tight sm:text-4xl mb-2">
              Week 1 Notebook Questions Quiz
            </h1>
            <p className="text-muted-foreground">
              Test your understanding of Week 1 Notebook Questions from <em>Catching Unicorns</em>. Answer questions about engrams, exograms, exographics, techno-literate culture, and abstract objects.
            </p>
          </div>
          
          <QuizInterface />
        </div>
      </section>
    </main>
  );
}



