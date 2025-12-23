import { cn } from '@/lib/utils';
import { type UIMessage } from 'ai';

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  // Extract text content from message parts
  const textParts = message.parts.filter((part) => part.type === 'text');
  const textContent = textParts.map((part) => part.text).join('');
  
  return (
    <div
      className={cn(
        'flex w-full gap-4 py-4 px-6',
        isUser ? 'bg-background' : 'bg-muted/30'
      )}
    >
      <div className="flex w-full max-w-3xl mx-auto gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-primary/10 text-primary">
          {isUser ? 'U' : 'AI'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap break-words text-foreground">
              {textContent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

