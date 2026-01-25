"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, ListTodo, Settings, Plus } from "lucide-react";

interface ChatHistoryItem {
  id: string;
  title: string;
  preview?: string;
  timestamp?: Date;
}

interface ChatSidebarProps {
  chatHistory?: ChatHistoryItem[];
  onNewChat?: () => void;
  className?: string;
}

export function ChatSidebar({ chatHistory = [], onNewChat, className }: ChatSidebarProps) {
  const pathname = usePathname();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const defaultChats: ChatHistoryItem[] = [
    { id: '1', title: 'Project Deadline' },
    { id: '2', title: 'Weekend Trip Ideas' },
    { id: '3', title: 'Fitness Goals' },
    { id: '4', title: 'Meal Planning' },
    { id: '5', title: 'Learning Python' },
    { id: '6', title: 'Meeting Notes' },
  ];

  const chats = chatHistory.length > 0 ? chatHistory : defaultChats;

  return (
    <div className={cn("flex flex-col h-full bg-card border-r", className)}>
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold text-foreground mb-4">Chat History</h2>
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-smooth flex items-center gap-2",
                selectedChat === chat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-1">
        <Link
          href="/"
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-smooth",
            pathname === "/"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <ListTodo className="h-4 w-4" />
          <span>Tasks</span>
        </Link>
        <Link
          href="/settings"
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-smooth",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>

      <div className="p-4 border-t">
        <Button
          onClick={onNewChat}
          className="w-full"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Message Manus
        </Button>
      </div>
    </div>
  );
}
