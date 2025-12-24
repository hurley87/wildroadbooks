'use client';

import { useChat } from '@ai-sdk/react';
import { ChatMessage } from '@/components/ui/chat-message';
import { ChatInput } from '@/components/ui/chat-input';
import { SparklesIcon } from '@/components/ui/sparkles';
import { RotateCCWIcon } from '@/components/ui/rotate-ccw';
import { LoaderPinwheelIcon } from '@/components/ui/loader-pinwheel';
import { Square } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const SUGGESTED_PROMPTS = [
  'What are exographics?',
  'Explain the e-Class concept',
  'How does writing shape ideas?',
  'What is techno-literate culture?',
];

export function ChatInterface() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, status, error, setMessages, stop } = useChat();
  
  const isLoading = status === 'submitted' || status === 'streaming';
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ text: input });
    setInput('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  const handleSuggestedPrompt = (prompt: string) => {
    if (isLoading) return;
    sendMessage({ text: prompt });
    setInput('');
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setInput('');
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] border border-border rounded-lg overflow-hidden bg-background shadow-lg gilt-edge">
      {/* Header with New Chat button */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <SparklesIcon size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">The Guide</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewChat}
            className="text-xs"
          >
            <RotateCCWIcon size={14} className="mr-1.5" />
            New Chat
          </Button>
        </div>
      )}
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 relative">
            {/* Paper texture overlay */}
            <div className="pointer-events-none absolute inset-0 paper-texture opacity-30" />
            
            <div className="relative z-10 text-center max-w-2xl animate-fade-up">
              {/* Avatar */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 text-primary border-2 border-primary/30 relative overflow-hidden shadow-lg">
                  <SparklesIcon size={32} className="text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse-slow" />
                </div>
              </div>
              
              {/* Welcome message */}
              <h2 className="text-2xl font-serif mb-3 text-foreground">
                Welcome to The Guide
              </h2>
              <p className="text-muted-foreground mb-8 text-base leading-relaxed">
                I'm here to help you explore the concepts in <em>Catching Unicorns</em>. 
                Ask me about exographics, e-Class ideas, techno-literate culture, 
                and how writing shapes our understanding of the world.
              </p>
              
              {/* Suggested prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    disabled={isLoading}
                    className="group relative p-4 text-left rounded-lg border border-border bg-background hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 gilt-edge-hover animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="relative z-10 text-sm text-foreground group-hover:text-primary transition-colors">
                      {prompt}
                    </p>
                  </button>
                ))}
              </div>
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
                      <span className="text-sm">The Guide is thinking...</span>
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
            <strong>Error:</strong> {error.message || 'An error occurred while processing your request.'}
          </div>
        )}
      </div>
      
      {/* Input area */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

