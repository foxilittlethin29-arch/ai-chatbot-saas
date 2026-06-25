import { NextAuthOptions, DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

export interface ConversationType {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: MessageType[];
}

export interface MessageType {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  userId?: string | null;
  createdAt: Date;
}

export interface DashboardStats {
  totalConversations: number;
  totalMessages: number;
  lastActivity: Date | null;
  conversationsToday: number;
  messagesToday: number;
  averageMessagesPerConversation: number;
}

export interface SearchResult {
  id: string;
  title: string;
  updatedAt: Date;
  messageCount: number;
  lastMessage?: string;
}