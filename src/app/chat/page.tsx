"use client";

import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { AIChat } from "@/components/chat/ai-chat";
import { ChatSidebar } from "@/components/ui/chat-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";

const ChatPage = () => {
  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
        {/* Chat Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-64 flex-shrink-0"
        >
          <ChatSidebar />
        </motion.div>

        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <Card className="flex-1 flex flex-col bg-gray-900 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">AI Assistant</span>
                  <div className="flex items-center gap-1.5">
                    <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                    <span className="text-sm">!</span>
                  </button>
                  <button className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                    <span className="text-sm">☰</span>
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <AIChat />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ChatPage;
