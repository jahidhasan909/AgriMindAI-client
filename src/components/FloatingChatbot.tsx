"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Lock,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

type UserRole = "Farmer" | "Buyer" | "Admin";

const ROLE_PROMPTS: Record<UserRole, string[]> = {
  Farmer: [
    "🌾 ধানের পাতায় হলুদ দাগ হলে কি করণীয়?",
    "🐛 টমেটো গাছে পোকা দমনে নিরাপদ উপায়?",
    "🧪 মাটিতে ইউরিয়া সারের সঠিক প্রয়োগ?",
    "🌦️ খরা ও অতিরিক্ত গরমে ফসলের যত্ন?",
  ],
  Buyer: [
    "📦 পাইকারি কেনাকাটায় কত ছাড় পাওয়া যাবে?",
    "🚚 ডেলিভারিতে ফসল নষ্ট হলে রিফান্ড পলিসি কি?",
    "🥑 ফসল কি অর্গানিক এবং Grade A/B/C পাওয়া যাবে?",
    "📄 প্রফেশনাল মেমো ও ডিজিটাল ইনভয়েস দেওয়া হয়?",
  ],
  Admin: [
    "📊 বর্তমানে কতজন সক্রিয় কৃষক এবং বায়ার আছেন?",
    "⚠️ কোন ফসলের স্টক কমে গেছে (Low Stock Alert)?",
    "🔥 এই মুহূর্তে সবচেয়ে বেশি চাহিদা কোন ফসলের?",
    "🚚 রংপুর ও বগুড়া জোনে কত ফসল বিক্রির জন্য প্রস্তুত?",
  ],
};

// Rich text parsing helper for markdown style formatting
const RichText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parsed = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        const isEmpty = line.trim() === "";
        const isIndented = /^([•\-]|\d+\.)/.test(line.trim());
        const isBold = parsed.startsWith("<strong>") && parsed.endsWith("</strong>");

        return isEmpty ? (
          <div key={i} className="h-1.5" />
        ) : (
          <p
            key={i}
            className={[
              "text-xs sm:text-sm leading-relaxed",
              isIndented ? "pl-2.5 font-medium" : "",
              isBold && !isUser ? "font-semibold mb-0.5 text-emerald-700 dark:text-emerald-400" : "",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        );
      })}
    </div>
  );
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("Farmer");
  const [token, setToken] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "আস্সালামু আলাইকুম! আমি AgriMind AI সহকারী। 🌾\n\nJWT সুরক্ষিত প্ল্যাটফর্মে আপনাকে স্বাগতম। ভূমিকা অনুযায়ী সার্ভিস গ্রহণে ওপরের **Role** নির্বাচন করুন।",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

  // Function to fetch/issue JWT token for the active role
  const fetchJWTToken = useCallback(
    async (role: UserRole) => {
      try {
        const res = await fetch(`${baseUrl}/jwt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: `${role.toLowerCase()}@agrimind.ai`,
            role,
          }),
        });
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
          if (typeof window !== "undefined") {
            localStorage.setItem("agrimind_token", data.token);
            localStorage.setItem("agrimind_role", role);
          }
          return data.token;
        }
      } catch (err) {
        console.error("JWT fetch error:", err);
      }
      return null;
    },
    [baseUrl]
  );

  // Initialize or handle role change
  useEffect(() => {
    fetchJWTToken(userRole);
  }, [userRole, fetchJWTToken]);

  // Auto scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, loading, scrollToBottom]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      let activeToken = token;
      if (!activeToken) {
        activeToken = await fetchJWTToken(userRole);
      }

      const res = await fetch(`${baseUrl}/api/ai/doctor-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken || ""}`,
        },
        body: JSON.stringify({ role: userRole, message: queryText }),
      });

      // Handle 401 Unauthorized (JWT Expired/Invalid)
      if (res.status === 401) {
        // Refresh token automatically
        const newToken = await fetchJWTToken(userRole);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "⚠️ **সেশন মেয়াডোত্তীর্ণ (401 Unauthorized)**\n\nআপনার JWT সিকিউরিটি টোকেনের মেয়াদ শেষ হয়ে গেছে। টোকেনটি অটো-রিনিউ করা হয়েছে, অনুগ্রহ করে প্রশ্নটি পুনরায় করুন।",
            timestamp: new Date(),
          },
        ]);
        return;
      }

      // Handle 403 Forbidden (RBAC Restricted Topic)
      if (res.status === 403) {
        const errorData = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: `⛔ **অ্যাক্সেস অস্বীকৃত (403 Forbidden)**\n\n${errorData.message || "আপনার বর্তমান ভূমিকাটির জন্য এই নির্দিষ্ট তথ্যটি দেখার অনুমতি নেই।"}`,
            timestamp: new Date(),
          },
        ]);
        return;
      }

      const data = await res.json();
      const replyText =
        data.success && data.reply
          ? data.reply
          : "আপনার বিষয়টি বুঝতে পেরেছি। তবে এই মুহূর্তে সংযোগ ধীরগতির। আপনার আর কী পরামর্শ লাগবে বলুন। 🌱";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: replyText,
          timestamp: new Date(),
        },
      ]);

      if (!isOpen) setHasUnread(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "দুঃখিত, সংযোগ স্থাপন করা যায়নি। আবার চেষ্টা করুন। আপনার আর কী পরামর্শ লাগবে বলুন। 🌱",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: `আস্সালামু আলাইকুম! আমি AgriMind AI সহকারী। 🌾\n\nআপনার বর্তমান রোল: **${userRole}**। নতুন প্রশ্ন নির্দ্বিধায় লিখুন!`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 w-[92vw] sm:w-[390px] h-[540px] max-h-[82vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/40 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl transition-all duration-300"
          >
            {/* ── Chat Header ── */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-900/90 flex flex-col gap-2 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-[#76a601] dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-xs sm:text-sm flex items-center gap-1">
                      AgriMind AI <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> JWT Role Protected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={clearChat}
                    title="Clear chat"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    title="Close chat"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ── Role Selector Bar ── */}
              <div className="flex items-center justify-between bg-slate-200/60 dark:bg-zinc-800/80 p-1 rounded-xl text-[11px] font-medium">
                <span className="text-slate-500 dark:text-zinc-400 pl-2 flex items-center gap-1 text-[10px]">
                  <Lock className="w-3 h-3 text-emerald-500" /> Role:
                </span>
                <div className="flex items-center gap-1">
                  {(["Farmer", "Buyer", "Admin"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRole(r)}
                      className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                        userRole === r
                          ? "bg-[#76a601] text-white shadow-xs font-semibold"
                          : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                      }`}
                    >
                      {r === "Farmer" ? "🌾 Farmer" : r === "Buyer" ? "📦 Buyer" : "📊 Admin"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Messages Container ── */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-3.5 space-y-3 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === "user";
                const timeStr = msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-[#76a601] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-1 border border-emerald-500/20">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`flex flex-col gap-0.5 ${
                        isUser ? "items-end max-w-[80%]" : "items-start max-w-[84%]"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-2xl ${
                          isUser
                            ? "bg-[#76a601] text-white rounded-br-xs shadow-md shadow-emerald-600/10"
                            : "bg-slate-100 dark:bg-zinc-800/90 text-slate-800 dark:text-zinc-100 rounded-bl-xs border border-slate-200/60 dark:border-zinc-700/60 shadow-xs"
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                        ) : (
                          <RichText text={msg.text} isUser={false} />
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 dark:text-zinc-500 px-1 font-mono">
                        {timeStr}
                      </span>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 flex items-center justify-center shrink-0 mt-1">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Dynamic Quick Prompt Chips based on Active Role */}
              {messages.length === 1 && !loading && (
                <div className="pt-1 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 px-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{userRole} সংক্রান্ত দ্রুত প্রশ্নাবলী:</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {ROLE_PROMPTS[userRole].map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(promptText)}
                        className="text-left text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200/60 dark:border-zinc-700/60 hover:border-emerald-300 dark:hover:border-emerald-800 text-slate-700 dark:text-zinc-200 hover:text-[#76a601] transition-all duration-150"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Typing Indicator */}
              {loading && (
                <div className="flex items-start gap-2 justify-start">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-[#76a601] dark:text-emerald-400 flex items-center justify-center shrink-0 mt-1 border border-emerald-500/20">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-xs bg-slate-100 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#76a601]" />
                    <span>JWT যাচায়কৃত AI চিন্তা করছে...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Bottom Button */}
            {showScrollBtn && (
              <button
                onClick={() => scrollToBottom()}
                className="absolute bottom-20 right-4 w-7 h-7 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:scale-105 transition-all z-10"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {/* ── Input Box ── */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <div className="relative flex items-center bg-slate-100 dark:bg-zinc-800/80 rounded-2xl border border-slate-200/80 dark:border-zinc-700/80 focus-within:border-[#76a601] dark:focus-within:border-[#76a601] transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder={`${userRole} হিসেবে প্রশ্ন লিখুন...`}
                  rows={1}
                  disabled={loading}
                  className="w-full resize-none bg-transparent py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none max-h-24 min-h-[40px] leading-relaxed disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-1.5 p-2 rounded-xl bg-[#76a601] text-white hover:bg-[#669000] disabled:opacity-40 disabled:hover:bg-[#76a601] transition-all shadow-md shadow-emerald-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Action Button (FAB) ── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AgriMind AI Floating Chatbot"
        className="relative w-14 h-14 rounded-full bg-[#76a601] hover:bg-[#689400] text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-colors border-2 border-white/20 dark:border-zinc-800"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="w-6 h-6" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
