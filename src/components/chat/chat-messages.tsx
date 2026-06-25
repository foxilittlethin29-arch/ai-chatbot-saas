"use client";

import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { MessageType } from "@/types";
import { ChatMessage } from "./chat-message";
import { Loader2 } from "lucide-react";

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading: boolean;
  isStreaming: boolean;
}

export function ChatMessages({
  messages,
  isLoading,
  isStreaming,
}: ChatMessagesProps) {
  const { containerRef, handleScroll } = useAutoScroll([messages, isStreaming]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="mb-2 text-2xl font-semibold">
            Start a conversation
          </h2>
          <p className="text-muted-foreground">
            Ask me anything! I can help you with writing, analysis, coding,
            research, and much more.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto"
    >
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {isStreaming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="typing-cursor" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}