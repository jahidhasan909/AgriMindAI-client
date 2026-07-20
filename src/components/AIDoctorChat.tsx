"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Send,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Leaf,
  ShoppingBasket,
  BarChart3,
  X,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type UserRole = "farmer" | "buyer" | "admin";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

interface CustomUserData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  status: string;
}

// ─── Persona Config ────────────────────────────────────────────────────────────
const PERSONA = {
  farmer: {
    label: "কৃষি ডক্টর",
    sublabel: "Senior Agricultural Consultant",
    icon: <Leaf className="w-4 h-4" />,
    emoji: "🌾",
    accentColor: "#79a603",
    placeholder:
      "আপনার সমস্যা বাংলা, English বা Banglish-এ লিখুন... (e.g. amr tomato gach e poka hoise)",
    welcome:
      'আস্সালামু আলাইকুম! আমি আপনার কৃষি ডক্টর 🌾 Bangla, English বা Banglish (যেমন "amr dhane poka hoise") যেকোনো ভাষায় প্রশ্ন করুন — গাছের রোগ, পোকা, সার, সেচ, বন্যা সব বিষয়ে বিস্তারিত পরামর্শ দেব।',
    sublabelShort: "কৃষি বিশেষজ্ঞ",
  },
  buyer: {
    label: "Nutritionist",
    sublabel: "Smart Shopping & Health Consultant",
    icon: <ShoppingBasket className="w-4 h-4" />,
    emoji: "🥗",
    accentColor: "#f05a28",
    placeholder:
      "স্বাস্থ্য বা কেনাকাটা নিয়ে Bangla/Banglish-এ লিখুন... (e.g. amer poshtigon ki?)",
    welcome:
      'হ্যালো! আমি আপনার পুষ্টি ও শপিং বিশেষজ্ঞ 🥗 Bangla, English বা Banglish (যেমন "amer vitamin ki") যেকোনো ভাষায় প্রশ্ন করুন — ফল-সবজির পুষ্টিগুণ, ফরমালিন চেনার উপায়, রেসিপি — সব বিষয়ে বিস্তারিত উত্তর দেব।',
    sublabelShort: "Nutritionist",
  },
  admin: {
    label: "BI Admin",
    sublabel: "বিজনেস অ্যানালিটিক্স সহকারী",
    icon: <BarChart3 className="w-4 h-4" />,
    emoji: "🖥️",
    accentColor: "#6366f1",
    placeholder:
      "প্ল্যাটফর্ম সমস্যা Bangla বা Banglish-এ লিখুন... (e.g. fraud seller kemne detect korbo)",
    welcome:
      'আস্সালামু আলাইকুম, Admin! আমি আপনার Business Intelligence AI 🖥️ Bangla, English বা Banglish (যেমন "seller fraud kemne rokhi") যেকোনো ভাষায় প্রশ্ন করুন — inventory, fraud detection, escrow, বা platform growth সব বিষয়ে বিস্তারিত পরামর্শ দেব।',
    sublabelShort: "BI বিশ্লেষক",
  },
} as const;

// ─── Typing Indicator ──────────────────────────────────────────────────────────
const TypingIndicator: React.FC<{ accentColor: string; label: string }> = ({
  accentColor,
  label,
}) => (
  <div className="flex items-end gap-2.5 justify-start">
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
      style={{
        backgroundColor: `${accentColor}15`,
        border: `1px solid ${accentColor}30`,
      }}
    >
      <Bot className="w-4 h-4" style={{ color: accentColor }} />
    </div>
    <div
      className="px-4 py-3 rounded-2xl rounded-bl-sm bg-slate-100 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: accentColor,
                animationDelay: `${i * 0.15}s`,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
        <span
          className="text-xs font-medium text-slate-500 dark:text-zinc-400"
        >
          {label} বিশ্লেষণ করছে...
        </span>
      </div>
    </div>
  </div>
);

// ─── Rich Text Renderer ────────────────────────────────────────────────────────
const RichText: React.FC<{ text: string; isUser: boolean }> = ({
  text,
  isUser,
}) => {
  const lines = text.split("\n");
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const parsed = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        const isEmpty = line.trim() === "";
        const isIndented = /^([•\-]|\d+\.)/.test(line.trim());
        const isBold =
          parsed.startsWith("<strong>") && parsed.endsWith("</strong>");
        return isEmpty ? (
          <div key={i} className="h-1.5" />
        ) : (
          <p
            key={i}
            className={[
              "text-xs sm:text-sm leading-relaxed",
              isIndented ? "pl-3" : "",
              isBold && !isUser ? "font-semibold mb-0.5" : "",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: parsed }}
          />
        );
      })}
    </div>
  );
};

// ─── Message Bubble ────────────────────────────────────────────────────────────
const MessageBubble: React.FC<{
  msg: Message;
  persona: (typeof PERSONA)[UserRole];
  userName: string;
  userImage?: string;
}> = ({ msg, persona, userName, userImage }) => {
  const isUser = msg.sender === "user";
  const timeStr = msg.timestamp.toLocaleTimeString("en-BD", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-start gap-2.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 mt-1 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs"
          style={{
            backgroundColor: `${persona.accentColor}15`,
            border: `1px solid ${persona.accentColor}30`,
          }}
        >
          <Bot className="w-4 h-4" style={{ color: persona.accentColor }} />
        </div>
      )}

      <div
        className={`flex flex-col gap-1 ${
          isUser ? "max-w-[80%] sm:max-w-[70%] items-end" : "max-w-[85%] sm:max-w-[80%] items-start"
        }`}
      >
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 px-1 font-medium">
          {isUser ? userName || "You" : persona.label}
        </span>
        <div
          className={`px-4 py-3 rounded-2xl text-slate-800 dark:text-zinc-100 shadow-xs ${
            isUser
              ? "rounded-br-sm text-white font-normal"
              : "rounded-bl-sm bg-slate-100 dark:bg-zinc-800/90 border border-slate-200/60 dark:border-zinc-700/60"
          }`}
          style={
            isUser
              ? { backgroundColor: persona.accentColor }
              : undefined
          }
        >
          {isUser ? (
            <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
          ) : (
            <RichText text={msg.text} isUser={false} />
          )}
        </div>
        <span className="text-[9px] text-slate-400 dark:text-zinc-600 px-1">
          {timeStr}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 mt-1 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userImage}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AIDoctorChat: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ;
  const { data: session } = authClient.useSession();
  const sessionUser = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const [dbUser, setDbUser] = useState<CustomUserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Resolve active role
  const activeRole: UserRole =
    userRole ||
    dbUser?.role ||
    (sessionUser?.role as UserRole | undefined) ||
    "farmer";
  const persona = PERSONA[activeRole];


  useEffect(() => {
    if (sessionUser?.email) {
      fetch(`${baseUrl}/api/own/usercollaction?email=${sessionUser.email}`)
        .then((r) => r.json())
        .then((d) => setDbUser(d))
        .catch(() => null);
    }
  }, [sessionUser?.email, baseUrl]);


  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: persona.welcome,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, [activeRole, persona.welcome]);

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };


  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Send message
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setError(null);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/api/ai/doctor-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: activeRole, message: text }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.reply || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।",
          timestamp: new Date(),
        },
      ]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "নেটওয়ার্ক সমস্যা। দয়া করে আবার চেষ্টা করুন।";
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading, activeRole, baseUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: persona.welcome,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  const displayName = dbUser?.name || sessionUser?.name || "You";
  const displayImage = dbUser?.image || sessionUser?.image;

  return (
    <div className="flex flex-col h-[600px] w-full bg-white dark:bg-zinc-900 transition-colors duration-300 relative">
    
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 backdrop-blur-xs z-10">
        <div className="flex items-center gap-3">
          {/* Avatar Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
            style={{
              backgroundColor: `${persona.accentColor}15`,
              border: `1px solid ${persona.accentColor}30`,
            }}
          >
            <span className="text-xl leading-none">{persona.emoji}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-slate-900 dark:text-zinc-100 font-bold text-sm sm:text-base leading-tight">
                {persona.label}
              </h3>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${persona.accentColor}15`,
                  color: persona.accentColor,
                }}
              >
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <p className="text-slate-400 dark:text-zinc-500 text-xs">
              {persona.sublabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          
          <button
            onClick={clearChat}
            title="Clear conversation"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="mx-4 mt-3 flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs z-10">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-red-600 dark:text-red-400">
            <p className="font-semibold">Request Failed</p>
            <p className="opacity-90">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4 relative z-10"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(155, 155, 155, 0.2) transparent",
        }}
      >
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            persona={persona}
            userName={displayName}
            userImage={displayImage}
          />
        ))}
        {isLoading && (
          <TypingIndicator
            accentColor={persona.accentColor}
            label={persona.label}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-20 right-5 w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:scale-105 active:scale-95 transition-all z-20"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-10">
        <div className="flex items-end gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 focus-within:border-slate-300 dark:focus-within:border-zinc-600 transition-all">
          <textarea
            ref={inputRef}
            id="ai-doctor-message-input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={persona.placeholder}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 py-1.5 text-slate-900 dark:text-zinc-100 text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-zinc-500 resize-none outline-none leading-relaxed disabled:opacity-50 min-h-[28px] max-h-[120px]"
          />

          <button
            id="ai-doctor-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-xs"
            style={{
              backgroundColor: persona.accentColor,
            }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>

        <p className="text-center text-slate-400 dark:text-zinc-500 text-[10px] mt-2 select-none">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 font-mono text-[9px]">
            Enter
          </kbd>{" "}
          to send &nbsp;·&nbsp;
          <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 font-mono text-[9px]">
            Shift+Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
};

export default AIDoctorChat;