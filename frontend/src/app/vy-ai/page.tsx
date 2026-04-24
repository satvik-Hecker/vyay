"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // Added
import { HugeiconsIcon } from "@hugeicons/react";
import { BotIcon } from "@hugeicons/core-free-icons";
import { Send, TrendingUp, DollarSign, Calendar, DollarSignIcon } from "lucide-react";
import DashboardWrapper from "@/components/layout/DashboardWrapper";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey — I can help you understand your spending, savings, and patterns. What do you want to explore?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify({ message: messageToSend }),
      });

      // Robust JSON check
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Check backend URL/Routes.");
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch");

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: "error",
          content: "I hit a snag. Please check your connection or try again later.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <DashboardWrapper>
      <div className="flex flex-col h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] bg-zinc-950/50 rounded-xl border border-zinc-800 font-sans overflow-hidden backdrop-blur-md">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900/30">
          <div className="w-10 h-10 rounded-xl hidden md:flex bg-lime-400  items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.2)]">
            <HugeiconsIcon icon={BotIcon} size={24} strokeWidth={1.5} className="text-zinc-950" />
          </div>
          <div className="ml-12 md:ml-0">
            <h1 className="text-lg font-bold text-white tracking-tight">Vy - AI</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Your Personal Finance Tracker</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-lime-400 text-zinc-950 font-medium rounded-tr-none"
                    : "bg-zinc-900/80 text-zinc-300 border border-zinc-800 rounded-tl-none"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none 
                prose-strong:text-white prose-strong:font-bold 
                prose-p:leading-relaxed prose-ul:list-disc prose-li:my-1">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex">
              <div className="bg-zinc-900/80 border border-zinc-800 px-5 py-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (Sticky above input) */}
        {messages.length < 4 && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {[
              { label: "Trends", icon: <TrendingUp className="w-3.5 h-3.5" />, p: "Analyze my spending trends this month" },
              { label: "Budget", icon: <DollarSign className="w-3.5 h-3.5" />, p: "How is my budget looking?" },
              { label: "Summary", icon: <Calendar className="w-3.5 h-3.5" />, p: "Give me a summary of my last 5 transactions" },
              { label: "Savings Goal", icon: <DollarSignIcon className="w-3.5 h-3.5" />, p: "I want to save ₹50,000 for a new laptop. Based on my spending, how can I achieve this?" },
  { 
    label: "Wasteful Spending", 
    icon: <TrendingUp className="w-3.5 h-3.5" />, 
    p: "Look at my last 20 transactions and identify any recurring expenses I could cut." 
  },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action.p)}
                className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-tighter bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-lime-400 hover:border-lime-400/50 transition-all active:scale-95"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-zinc-900/20">
          <div className="flex items-end gap-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-3 focus-within:border-lime-400/50 focus-within:ring-1 focus-within:ring-lime-400/20 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your financial patterns..."
              className="flex-1 bg-transparent text-white placeholder:text-zinc-600 resize-none outline-none text-sm min-h-6 max-h-30 py-1"
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-lime-400 text-zinc-950 disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(163,230,53,0.1)]"
            >
              <Send className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}