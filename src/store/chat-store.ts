import { create } from "zustand";
import { ConversationType, MessageType } from "@/types";

interface ChatState {
  conversations: ConversationType[];
  currentConversation: ConversationType | null;
  messages: MessageType[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sidebarOpen: boolean;

  setConversations: (conversations: ConversationType[]) => void;
  setCurrentConversation: (conversation: ConversationType | null) => void;
  setMessages: (messages: MessageType[]) => void;
  addMessage: (message: MessageType) => void;
  updateLastMessage: (content: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  setError: (error: string | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addConversation: (conversation: ConversationType) => void;
  removeConversation: (id: string) => void;
  updateConversation: (id: string, data: Partial<ConversationType>) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  error: null,
  sidebarOpen: true,

  setConversations: (conversations) => set({ conversations }),

  setCurrentConversation: (conversation) =>
    set({ currentConversation: conversation }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0) {
        messages[lastIndex] = {
          ...messages[lastIndex],
          content: messages[lastIndex].content + content,
        };
      }
      return { messages };
    }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsStreaming: (isStreaming) => set({ isStreaming }),

  setError: (error) => set({ error }),

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
    })),

  updateConversation: (id, data) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
      currentConversation:
        state.currentConversation?.id === id
          ? { ...state.currentConversation, ...data }
          : state.currentConversation,
    })),
}));