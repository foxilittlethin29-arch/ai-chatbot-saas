"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MessageType } from "@/types";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: MessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  if (isInline) {
                    return (
                      <code
                        className="rounded bg-background/50 px-1.5 py-0.5 text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="my-2 overflow-hidden rounded-lg border">
                      <div className="flex items-center justify-between bg-background/50 px-4 py-1.5 text-xs text-muted-foreground">
                        <span>{match?.[1] || "code"}</span>
                      </div>
                      <pre className="overflow-x-auto p-4 text-sm">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}