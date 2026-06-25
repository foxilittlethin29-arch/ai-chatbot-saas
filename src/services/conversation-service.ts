import prisma from "@/lib/prisma";
import { ConversationType, SearchResult } from "@/types";

export async function getConversations(
  userId: string
): Promise<ConversationType[]> {
  const conversations = await prisma.conversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return conversations;
}

export async function getConversation(
  id: string,
  userId: string
): Promise<ConversationType | null> {
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return conversation;
}

export async function createConversation(
  userId: string,
  title?: string
): Promise<ConversationType> {
  const conversation = await prisma.conversation.create({
    data: {
      title: title || "New Chat",
      userId,
    },
    include: {
      messages: true,
    },
  });

  return conversation;
}

export async function updateConversation(
  id: string,
  userId: string,
  data: { title?: string }
): Promise<ConversationType> {
  const conversation = await prisma.conversation.update({
    where: { id, userId },
    data,
    include: {
      messages: true,
    },
  });

  return conversation;
}

export async function deleteConversation(
  id: string,
  userId: string
): Promise<void> {
  await prisma.conversation.delete({
    where: { id, userId },
  });

}

export async function createMessage(
  conversationId: string,
  role: string,
  content: string,
  userId?: string
) {
  const message = await prisma.message.create({
    data: {
      conversationId,
      role,
      content,
      userId,
    },
  });

  // Update conversation's updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function searchConversations(
  userId: string,
  query: string
): Promise<SearchResult[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        {
          messages: {
            some: {
              content: { contains: query, mode: "insensitive" },
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: { messages: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  return conversations.map((conv: { id: string; title: string; updatedAt: Date; _count: { messages: number }; messages: { content: string }[] }) => ({
    id: conv.id,
    title: conv.title,
    updatedAt: conv.updatedAt,
    messageCount: conv._count.messages,
    lastMessage: conv.messages[0]?.content?.slice(0, 100),
  }));
}

export async function getDashboardStats(
  userId: string
) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalConversations, totalMessages, todayConversations, todayMessages, lastMessage] =
    await Promise.all([
      prisma.conversation.count({ where: { userId } }),
      prisma.message.count({
        where: { conversation: { userId } },
      }),
      prisma.conversation.count({
        where: { userId, createdAt: { gte: todayStart } },
      }),
      prisma.message.count({
        where: {
          conversation: { userId },
          createdAt: { gte: todayStart },
        },
      }),
      prisma.message.findFirst({
        where: { conversation: { userId } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

  return {
    totalConversations,
    totalMessages,
    lastActivity: lastMessage?.createdAt || null,
    conversationsToday: todayConversations,
    messagesToday: todayMessages,
    averageMessagesPerConversation:
      totalConversations > 0
        ? Math.round((totalMessages / totalConversations) * 10) / 10
        : 0,
  };
}