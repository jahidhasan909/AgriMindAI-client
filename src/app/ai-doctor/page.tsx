"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export default function AIDoctorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "আস্সালামু আলাইকুম! আমি আপনার AI সহকারী। 🌾\n\nগাছের রোগ, পোকা, সার, সেচ, স্বাস্থ্য বা অন্য যেকোনো বিষয়ে আপনার কী ধরনের পরামর্শ বা তথ্য লাগবে বলুন?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userMessageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/doctor-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "user",
          message: userMessageText,
        }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: data.reply,
          },
        ]);
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: "দুঃখিত, এই মুহূর্তে উত্তর দিতে সমস্যা হচ্ছে। আপনার আর কী পরামর্শ লাগবে বলুন?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();  
      handleSendMessage();
    }
  };

  return (
    <div className="flex mt-27 max-w-7xl mx-auto mb-9 flex-col h-[600px] w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#76a601]/10 flex items-center justify-center text-[#76a601]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm sm:text-base flex items-center gap-1.5">
              AgriMind Assistant <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Online • 24/7 Smart AI Care
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-full bg-[#76a601]/10 dark:bg-[#76a601]/20 text-[#76a601] flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-[#76a601] text-white rounded-tr-none shadow-md shadow-[#76a601]/10"
                  : "bg-slate-100 dark:bg-zinc-800/80 text-slate-800 dark:text-zinc-100 rounded-tl-none border border-slate-200/60 dark:border-zinc-700/50"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#76a601]/10 text-[#76a601] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 px-4 py-2.5 rounded-2xl rounded-tl-none">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#76a601]" />
              <span>AI চিন্তা করছে...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form Area */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
      >
        <div className="relative flex items-center bg-slate-100 dark:bg-zinc-800/80 rounded-2xl border border-slate-200/80 dark:border-zinc-700/60 focus-within:border-[#76a601] dark:focus-within:border-[#76a601] transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="আপনার প্রশ্নটি লিখুন (Enter চাপুন)..."
            rows={1}
            className="w-full resize-none bg-transparent py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none max-h-32 min-h-[44px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-xl bg-[#76a601] text-white hover:bg-[#689300] disabled:opacity-40 disabled:hover:bg-[#76a601] transition-all shadow-md shadow-[#76a601]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}