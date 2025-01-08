import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendHorizontal, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatAreaProps {
  chat: {
    messages: ChatMessage[];
  } | null;
  loading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatArea({ chat, loading, onSendMessage }: ChatAreaProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    onSendMessage(input);
    setInput('');
  };

  if (!chat) {
    return (
      <>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white/70 text-center">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Gemini Chat</h2>
          <p>Select a chat or start a new one to begin</p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-black/20 backdrop-blur-sm"
      >

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Gemini..."
            className="flex-grow bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-500"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
      </>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chat.messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <Card
              className={`
                max-w-[80%] backdrop-blur-sm border-0
                ${
                  message.role === 'user'
                    ? 'bg-white/10 text-white'
                    : 'bg-white/20 text-white'
                }
              `}
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Bot className="h-4 w-4 text-purple-400" />
                  )}
                  <span className="font-medium">
                    {message.role === 'user' ? 'You' : 'Gemini'}
                  </span>
                </div>
                {message.role === 'assistant' ? (
                  <ReactMarkdown className="prose prose-invert max-w-none">
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </Card>
          </div>
        ))}

        {loading && (
          <Card className="bg-white/20 border-0 max-w-[80%]">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-black/20 backdrop-blur-sm"
      >

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Gemini..."
            className="flex-grow bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-purple-500"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
