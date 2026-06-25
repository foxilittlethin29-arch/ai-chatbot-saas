"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Trash2,
  MessageSquare,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Settings,
  LayoutDashboard,
  MoreHorizontal,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, truncate } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import {
  getConversations,
  createConversation,
  deleteConversation,
  updateConversation,
  searchConversations,
} from "@/services/conversation-service";
import toast from "react-hot-toast";

export function Sidebar() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const {
    conversations,
    sidebarOpen,
    setConversations,
    addConversation,
    removeConversation,
    updateConversation: updateStoreConversation,
    setSidebarOpen,
  } = useChatStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (session?.user?.id) {
      loadConversations();
    }
  }, [session?.user?.id]);

  async function loadConversations() {
    if (!session?.user?.id) return;
    try {
      const data = await getConversations(session.user.id);
      setConversations(data);
    } catch {
      // silently fail
    }
  }

  async function handleNewChat() {
    if (!session?.user?.id) return;
    try {
      const conv = await createConversation(session.user.id);
      addConversation(conv);
      router.push(`/chat/${conv.id}`);
    } catch {
      toast.error("Failed to create conversation");
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!session?.user?.id) return;
    try {
      await deleteConversation(id, session.user.id);
      removeConversation(id);
      if (params?.id === id) {
        router.push("/chat");
      }
      toast.success("Conversation deleted");
    } catch {
      toast.error("Failed to delete conversation");
    }
  }

  async function handleRename(id: string) {
    if (!session?.user?.id || !editTitle.trim()) return;
    try {
      const updated = await updateConversation(id, session.user.id, {
        title: editTitle.trim(),
      });
      updateStoreConversation(id, { title: updated.title });
      setEditingId(null);
      toast.success("Conversation renamed");
    } catch {
      toast.error("Failed to rename conversation");
    }
  }

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (!query.trim() || !session?.user?.id) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchConversations(session.user.id, query);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    }
    setIsSearching(false);
  }

  function startEditing(e: React.MouseEvent, id: string, title: string) {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title);
  }

  const displayConversations =
    searchQuery.trim() && searchResults.length > 0
      ? searchResults
      : conversations;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r bg-sidebar transition-transform duration-300 lg:static lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-r-0"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Chatbot</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="hidden lg:flex"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3">
          {displayConversations.length === 0 ? (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            <div className="space-y-1">
              {displayConversations.map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => router.push(`/chat/${conv.id}`)}
                  className={cn(
                    "group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-sidebar-accent",
                    params?.id === conv.id && "bg-sidebar-accent"
                  )}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 overflow-hidden">
                    {editingId === conv.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 rounded border bg-background px-1 py-0.5 text-sm"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRename(conv.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => handleRename(conv.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="truncate font-medium">
                          {conv.title || "New Chat"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(conv.updatedAt || conv.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                  {editingId !== conv.id && (
                    <div className="hidden items-center gap-0.5 group-hover:flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => startEditing(e, conv.id, conv.title)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => handleDelete(e, conv.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t p-3">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start gap-2"
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <div className="mt-2 flex items-center gap-2 rounded-lg border p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback>
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">
                  {session?.user?.name || "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session?.user?.email || ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle button when sidebar is closed */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-2 top-3 z-30 lg:flex"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}