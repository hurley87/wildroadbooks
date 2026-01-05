import { ChatInterface } from './chat-interface';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - Catching Unicorns | Wild Road Books',
  description: 'Ask questions about Catching Unicorns and explore concepts like exographics, e-Class ideas, and techno-literate culture.',
};

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8 w-full">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif tracking-tight sm:text-4xl mb-2">
              Chat about Catching Unicorns
            </h1>
            <p className="text-muted-foreground">
              Ask questions about exographics, e-Class ideas, techno-literate culture, and the concepts explored in the book.
            </p>
          </div>
          
          <ChatInterface />
        </div>
      </section>
    </main>
  );
}





