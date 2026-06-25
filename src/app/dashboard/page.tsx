"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, MessagesSquare, Activity, Calendar, ArrowRight, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/services/conversation-service";
import { formatDate } from "@/lib/utils";

interface Stats {
  totalConversations: number;
  totalMessages: number;
  lastActivity: Date | null;
  conversationsToday: number;
  messagesToday: number;
  averageMessagesPerConversation: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    totalConversations: 0,
    totalMessages: 0,
    lastActivity: null,
    conversationsToday: 0,
    messagesToday: 0,
    averageMessagesPerConversation: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      loadStats();
    }
  }, [session?.user?.id]);

  async function loadStats() {
    if (!session?.user?.id) return;
    try {
      const data = await getDashboardStats(session.user.id);
      setStats(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, {session?.user?.name || "User"}!
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats.totalConversations}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.conversationsToday} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Messages
              </CardTitle>
              <MessagesSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats.totalMessages}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.messagesToday} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Messages / Chat
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : stats.averageMessagesPerConversation}
              </div>
              <p className="text-xs text-muted-foreground">
                Per conversation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Last Activity
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : stats.lastActivity
                  ? formatDate(stats.lastActivity)
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                Recent activity
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => router.push("/chat")}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Start New Chat
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => router.push("/settings")}
              >
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Update Settings
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Messages today
                    </span>
                    <span className="font-medium">
                      {stats.messagesToday}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(
                          (stats.messagesToday / 100) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Conversations today
                    </span>
                    <span className="font-medium">
                      {stats.conversationsToday}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(
                          (stats.conversationsToday / 20) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";