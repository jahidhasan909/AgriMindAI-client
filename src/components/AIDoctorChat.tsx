"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { Send, Bot, User, Loader2, AlertCircle, Leaf, ShoppingBasket, BarChart3, X, Sparkles, ChevronDown } from "lucide-react";

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
    accentColor: "#76a601",
    placeholder: "আপনার সমস্যা বাংলা, English বা Banglish-এ লিখুন... (e.g. amr tomato gach e poka hoise)",
    welcome: "আস্সালামু আলাইকুম! আমি আপনার কৃষি ডক্টর 🌾 Bangla, English বা Banglish (যেমন \"amr dhane poka hoise\") যেকোনো ভাষায় প্রশ্ন করুন — গাছের রোগ, পোকা, সার, সেচ, বন্যা সব বিষয়ে বিস্তারিত পরামর্শ দেব।",
    sublabelShort: "কৃষি বিশেষজ্ঞ",
  },
  buyer: {
    label: "Nutritionist",
    sublabel: "Smart Shopping & Health Consultant",
    icon: <ShoppingBasket className="w-4 h-4" />,
    emoji: "🥗",
    accentColor: "#f05a28",
    placeholder: "স্বাস্থ্য বা কেনাকাটা নিয়ে Bangla/Banglish-এ লিখুন... (e.g. amer poshtigon ki?)",
    welcome: "হ্যালো! আমি আপনার পুষ্টি ও শপিং বিশেষজ্ঞ 🥗 Bangla, English বা Banglish (যেমন \"amer vitamin ki\") যেকোনো ভাষায় প্রশ্ন করুন — ফল-সবজির পুষ্টিগুণ, ফরমালিন চেনার উপায়, রেসিপি — সব বিষয়ে বিস্তারিত উত্তর দেব।",
    sublabelShort: "Nutritionist",
  },
  admin: {
    label: "BI Admin",
    sublabel: "বিদ্যা বিশ্লেষণ সহকারী",
    icon: <BarChart3 className="w-4 h-4" />,
    emoji: "🖥️",
    accentColor: "#6366f1",
    placeholder: "প্ল্যাটফর্ম সমস্যা Bangla বা Banglish-এ লিখুন... (e.g. fraud seller kemne detect korbo)",
    welcome: "আস্সালামু আলাইকুম, Admin! আমি আপনার Business Intelligence AI 🖥️ Bangla, English বা Banglish (যেমন \"seller fraud kemne rokhi\") যেকোনো ভাষায় প্রশ্ন করুন — inventory, fraud detection, escrow, বা platform growth সব বিষয়ে বিস্তারিত পরামর্শ দেব।",
    sublabelShort: "BI বিশ্লেষক",
  },
} as const;

// ─── Typing Indicator ──────────────────────────────────────────────────────────
const TypingIndicator: React.FC<{ accentColor: string; label: string }> = ({ accentColor, label }) => (
  <div className="flex items-end gap-2.5 justify-start">
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
      style={{ background: `${accentColor}25`, border: `1.5px solid ${accentColor}50` }}
    >
      <Bot className="w-4 h-4" style={{ color: accentColor }} />
    </div>
    <div
      className="px-4 py-3 rounded-2xl rounded-bl-sm backdrop-blur-md"
      style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: accentColor, animationDelay: `${i * 0.15}s`, opacity: 0.85 }}
            />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: `${accentColor}cc` }}>
          {label} বিশ্লেষণ করছে...
        </span>
      </div>
    </div>
  </div>
);

// ─── Rich Text Renderer (renders **bold** and bullet lines from AI output) ───
const RichText: React.FC<{ text: string; isUser: boolean }> = ({ text, isUser }) => {
  const lines = text.split("\n");
  return (
    <div className="space-y-0.5">
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
              "text-sm leading-relaxed",
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

// ─── Message Bubble ──────────────────────────────────────────────
const MessageBubble: React.FC<{
  msg: Message;
  persona: typeof PERSONA[UserRole];
  userName: string;
  userImage?: string;
}> = ({ msg, persona, userName, userImage }) => {
  const isUser = msg.sender === "user";
  const timeStr = msg.timestamp.toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          className="w-8 h-8 mt-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{ background: `${persona.accentColor}25`, border: `1.5px solid ${persona.accentColor}50` }}
        >
          <Bot className="w-4 h-4" style={{ color: persona.accentColor }} />
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isUser ? "max-w-[72%] items-end" : "max-w-[82%] items-start"}`}>
        <span className="text-xs text-white/40 px-1">
          {isUser ? userName || "You" : persona.label}
        </span>
        <div
          className={`px-4 py-3 rounded-2xl shadow-md ${
            isUser ? "rounded-br-sm text-white" : "rounded-bl-sm text-white/90 backdrop-blur-md"
          }`}
          style={
            isUser
              ? { backgroundColor: persona.accentColor }
              : { background: `${persona.accentColor}12`, border: `1px solid ${persona.accentColor}35` }
          }
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.text}</p>
          ) : (
            <RichText text={msg.text} isUser={false} />
          )}
        </div>
        <span className="text-[10px] text-white/30 px-1">{timeStr}</span>
      </div>

      {isUser && (
        <div className="w-8 h-8 mt-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden bg-white/10 border border-white/20">
          {userImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userImage} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-white/60" />
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AIDoctorChat: React.FC<{ userRole?: UserRole }> = ({ userRole }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";
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
    userRole || dbUser?.role || (sessionUser?.role as UserRole | undefined) || "farmer";
  const persona = PERSONA[activeRole];

  // Fetch DB user
  useEffect(() => {
    if (sessionUser?.email) {
      fetch(`${baseUrl}/api/own/usercollaction?email=${sessionUser.email}`)
        .then((r) => r.json())
        .then((d) => setDbUser(d))
        .catch(() => null);
    }
  }, [sessionUser?.email, baseUrl]);

  // Seed welcome on role change
  useEffect(() => {
    setMessages([{ id: "welcome", sender: "ai", text: persona.welcome, timestamp: new Date() }]);
    setError(null);
  }, [activeRole, persona.welcome]);

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isLoading, scrollToBottom]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  // Auto-resize textarea
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

    const userMsg: Message = { id: `u-${Date.now()}`, sender: "user", text, timestamp: new Date() };
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
        { id: `ai-${Date.now()}`, sender: "ai", text: data.reply || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।", timestamp: new Date() },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "নেটওয়ার্ক সমস্যা। দয়া করে আবার চেষ্টা করুন।";
      setError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading, activeRole, baseUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ id: `welcome-${Date.now()}`, sender: "ai", text: persona.welcome, timestamp: new Date() }]);
    setError(null);
  };

  const displayName = dbUser?.name || sessionUser?.name || "You";
  const displayImage = dbUser?.image || sessionUser?.image;

  return (
    <div
      className="flex flex-col h-full min-h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl relative"
      style={{
        background: "linear-gradient(135deg, #080f07 0%, #0d1a0b 50%, #080f07 100%)",
        border: `1px solid ${persona.accentColor}30`,
        boxShadow: `0 0 60px ${persona.accentColor}10, 0 25px 60px rgba(0,0,0,0.7)`,
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(${persona.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${persona.accentColor} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Header ── */}
      <div
        className="relative flex items-center justify-between px-5 py-4 flex-shrink-0 z-10"
        style={{
          background: `linear-gradient(135deg, ${persona.accentColor}20, ${persona.accentColor}08)`,
          borderBottom: `1px solid ${persona.accentColor}25`,
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${persona.accentColor}40, ${persona.accentColor}18)`,
              border: `1.5px solid ${persona.accentColor}50`,
              boxShadow: `0 0 16px ${persona.accentColor}30`,
            }}
          >
            <span className="text-2xl leading-none">{persona.emoji}</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-base leading-tight">{persona.label}</h2>
              <span
                className="hidden sm:flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${persona.accentColor}20`, color: persona.accentColor, border: `1px solid ${persona.accentColor}30` }}
              >
                <Sparkles className="w-2.5 h-2.5" /> AI
              </span>
            </div>
            <p className="text-white/45 text-xs">{persona.sublabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Role chip */}
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: `${persona.accentColor}15`, color: persona.accentColor, border: `1px solid ${persona.accentColor}35` }}
          >
            {persona.icon}
            <span className="capitalize">{activeRole}</span>
          </div>

          {/* Clear chat */}
          <button
            onClick={clearChat}
            title="Clear chat"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white/70 hover:bg-white/8 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom glow line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${persona.accentColor}40, transparent)` }}
        />
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div
          className="mx-4 mt-3 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm flex-shrink-0 z-10"
          style={{ background: "#7f1d1d28", border: "1px solid #ef444430" }}
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-300 font-semibold text-xs mb-0.5">Request Failed</p>
            <p className="text-red-400/75 text-xs">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-300 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Messages ── */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4 relative z-10"
        style={{ scrollbarWidth: "thin", scrollbarColor: `${persona.accentColor}30 transparent` }}
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
        {isLoading && <TypingIndicator accentColor={persona.accentColor} label={persona.label} />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Scroll button ── */}
      {showScrollBtn && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 right-5 w-8 h-8 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 z-20"
          style={{ background: persona.accentColor, boxShadow: `0 0 14px ${persona.accentColor}60` }}
        >
          <ChevronDown className="w-4 h-4 text-white" />
        </button>
      )}

      {/* ── Input ── */}
      <div
        className="flex-shrink-0 px-4 pb-4 pt-3 z-10"
        style={{ borderTop: `1px solid ${persona.accentColor}18` }}
      >
        <div
          className="flex items-end gap-3 rounded-xl px-4 py-3 transition-shadow duration-200"
          style={{ background: `${persona.accentColor}08`, border: `1.5px solid ${persona.accentColor}22` }}
        >
          <textarea
            ref={inputRef}
            id="ai-doctor-message-input"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={persona.placeholder}
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white/90 text-sm placeholder:text-white/28 resize-none outline-none leading-relaxed disabled:opacity-50 min-h-[24px] max-h-[120px]"
            style={{ caretColor: persona.accentColor }}
          />

          <button
            id="ai-doctor-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{
              background: input.trim() && !isLoading
                ? `linear-gradient(135deg, ${persona.accentColor}, ${persona.accentColor}cc)`
                : `${persona.accentColor}28`,
              boxShadow: input.trim() && !isLoading ? `0 0 14px ${persona.accentColor}50` : "none",
            }}
          >
            {isLoading
              ? <Loader2 className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />
            }
          </button>
        </div>

        <p className="text-center text-white/18 text-[10px] mt-2 select-none">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded bg-white/8 text-white/30 font-mono text-[9px]">Enter</kbd>
          {" "}to send &nbsp;·&nbsp;
          <kbd className="px-1 py-0.5 rounded bg-white/8 text-white/30 font-mono text-[9px]">Shift+Enter</kbd>
          {" "}for new line
        </p>
      </div>
    </div>
  );
};

export default AIDoctorChat;
