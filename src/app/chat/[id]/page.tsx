"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chat-store";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import {
  getConversation,
  createMessage,
  updateConversation,
} from "@/services/conversation-service";
import { getChatCompletion } from "@/services/openai-service";
import toast from "react-hot-toast";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    currentConversation,
    messages,
    isLoading,
    isStreaming,
    setCurrentConversation,
    setMessages,
    addMessage,
    updateLastMessage,
    setIsLoading,
    setIsStreaming,
    setError,
    updateConversation: updateStoreConversation,
  } = useChatStore();

  useEffect(() => {
    if (params.id && session?.user?.id) {
      loadConversation();
    }
  }, [params.id, session?.user?.id]);

  async function loadConversation() {
    if (!session?.user?.id || !params.id) return;
    try {
      const conv = await getConversation(
        params.id as string,
        session.user.id
      );
      if (conv) {
        setCurrentConversation(conv);
        setMessages(conv.messages);
      } else {
        router.push("/chat");
      }
    } catch {
      router.push("/chat");
    }
  }

  async function handleSend(content: string) {
    if (!session?.user?.id || !params.id) return;

    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      conversationId: params.id as string,
      role: "user" as const,
      content,
      createdAt: new Date(),
    };
    addMessage(userMessage);
    setIsLoading(true);

    try {
      // Save user message to DB
      await createMessage(params.id as string, "user", content, session.user.id);

      // Auto-generate title if first message
      if (messages.length === 0 && currentConversation) {
        const { generateTitle } = await import("@/services/openai-service");
        const title = await generateTitle(content);
        if (title && title !== "New Chat") {
          await updateConversation(params.id as string, session.user.id, {
            title,
          });
          updateStoreConversation(params.id as string, { title });
        }
      }

      // Add empty assistant message for streaming
      const assistantMessage = {
        id: crypto.randomUUID(),
        conversationId: params.id as string,
        role: "assistant" as const,
        content: "",
        createdAt: new Date(),
      };
      addMessage(assistantMessage);
      setIsLoading(false);
      setIsStreaming(true);

      // Get all messages for context
      const allMessages = useChatStore.getState().messages.slice(0, -1);
      const chatHistory = allMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      // Stream response
      let fullContent = "";
      await getChatCompletion(chatHistory, (chunk) => {
        fullContent += chunk;
        updateLastMessage(chunk);
      });

      // Save assistant message to DB
      if (fullContent) {
        await createMessage(
          params.id as string,
          "assistant",
          fullContent,
          session.user.id
        );
      }

      setIsStreaming(false);
    } catch (error: any) {
      setIsLoading(false);
      setIsStreaming(false);
      setError(error.message);
      toast.error("Failed to get AI response");
    }
  }

  function handleStop() {
    setIsStreaming(false);
    setIsLoading(false);
  }

  return (
    <>
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
      />
      <ChatInput
        onSend={handleSend}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onStop={handleStop}
      />
    </>
  );
}