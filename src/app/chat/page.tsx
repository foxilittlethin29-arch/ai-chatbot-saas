"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chat-store";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { createConversation } from "@/services/conversation-service";
import toast from "react-hot-toast";

export default function ChatPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { messages, isLoading, isStreaming } = useChatStore();

  useEffect(() => {
    if (session?.user?.id) {
      redirectToNewChat();
    }
  }, [session?.user?.id]);

  async function redirectToNewChat() {
    if (!session?.user?.id) return;
    try {
      const conv = await createConversation(session.user.id);
      router.replace(`/chat/${conv.id}`);
    } catch {
      toast.error("Failed to create conversation");
    }
  }

  async function handleSend(message: string) {
    if (!session?.user?.id) {
      toast.error("Please sign in to continue");
      return;
    }
    try {
      const conv = await createConversation(session.user.id);
      router.push(`/chat/${conv.id}`);
    } catch {
      toast.error("Failed to create conversation");
    }
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
      />
    </>
  );
}