'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { ChatMessage } from '@/components/ui/chat-message';
import { ChatInput } from '@/components/ui/chat-input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ChatInterface() {
  const [input, setInput] = useState('');
  
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage({ text: input });
    setInput('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] border border-border rounded-lg overflow-hidden bg-background shadow-lg">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center px-6">
              <h2 className="text-xl font-serif mb-2">Chat about Catching Unicorns</h2>
              <p className="text-sm">
                Ask questions about exographics, e-Class ideas, techno-literate culture, and more.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-4 py-4 px-6 bg-muted/30">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary/10 text-primary">
                  AI
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm border-t border-border">
            Error: {error.message || 'An error occurred while processing your request.'}
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

