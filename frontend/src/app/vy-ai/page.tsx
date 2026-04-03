"use client";

import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon, BotIcon } from "@hugeicons/core-free-icons";
import { Send, Sparkles, TrendingUp, DollarSign, Calendar } from "lucide-react";
import DashboardWrapper from "@/components/layout/DashboardWrapper";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hey — I can help you understand your spending, savings, and patterns. What do you want to explore?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const quickActions: QuickAction[] = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Spending trends",
      prompt: "Show my spending trends this month",
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: "Budget check",
      prompt: "How am I doing against my budget?",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Monthly summary",
      prompt: "Summarize my expenses this month",
    },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "You spent ₹5,200 on food this week — slightly higher than usual.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardWrapper>
    <div className="flex flex-col h-full bg-zinc-900/95 rounded-xl border border-zinc-800 font-sans overflow-hidden">
      
      {/* Header (subtle, not loud) */}
      <div className="px-6 py-3 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-lime-400 flex items-center justify-center">
          <HugeiconsIcon
                icon={BotIcon}
                size={24}
                strokeWidth={1.5}
                className="text-zinc-950"
            />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Vy - AI</h1>
          <p className="text-xs text-zinc-500">Give Your Expenses a Brain.</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-xl text-sm ${
                message.role === "user"
                  ? "bg-lime-400 text-black"
                  : "bg-zinc-900 text-zinc-300 border border-zinc-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleQuickAction(action.prompt)}
              className="flex items-center gap-2 px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-lime-400 transition"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-lime-400 transition">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your spending..."
            className="flex-1 bg-transparent text-white placeholder:text-zinc-500 resize-none outline-none text-sm max-h-[120px]"
            rows={1}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-lime-400 text-black disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </DashboardWrapper>
  );
}