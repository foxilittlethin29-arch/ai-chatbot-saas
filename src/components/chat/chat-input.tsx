"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, StopCircle } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  isStreaming: boolean;
  onStop?: () => void;
}

export function ChatInput({
  onSend,
  isLoading,
  isStreaming,
  onStop,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (!isLoading && !isStreaming && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading, isStreaming]);

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isStreaming) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="border-t bg-background">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={isLoading || isStreaming}
            className="min-h-[44px] w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          {isStreaming ? (
            <Button
              onClick={onStop}
              size="icon"
              variant="destructive"
              className="h-[44px] w-[44px] shrink-0 rounded-xl"
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[44px] w-[44px] shrink-0 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI responses are generated and may not always be accurate.
        </p>
      </div>
    </div>
  );
}