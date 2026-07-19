import React from "react";
import type { Metadata } from "next";
import AIDoctorChat from "@/components/AIDoctorChat";
import { Leaf, ShoppingBasket, BarChart3, Sparkles, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Doctor | AgriMindAI",
  description:
    "Ask your role-aware AI expert — कৃষি ডক্টর for farmers, Nutritionist for buyers, and Business Intelligence for admins. Powered by AgriMindAI.",
};

// ─── Static persona feature cards ─────────────────────────────────────────────
const FEATURE_CARDS = [
  {
    emoji: "🌾",
    Icon: Leaf,
    role: "Farmer",
    roleBn: "কৃষি ডক্টর",
    color: "#76a601",
    bg: "from-[#76a601]/10 to-[#76a601]/5",
    border: "border-[#76a601]/25",
    iconBg: "bg-[#76a601]/15",
    items: [
      "গাছের রোগ ও পোকামাকড় চিকিৎসা",
      "সার ও সেচ পরামর্শ",
      "বন্যা ও মৌসুমী আবহাওয়া ব্যবস্থাপনা",
      "ফলন সর্বোচ্চকরণ কৌশল",
    ],
  },
  {
    emoji: "🥗",
    Icon: ShoppingBasket,
    role: "Buyer",
    roleBn: "পুষ্টি বিশেষজ্ঞ",
    color: "#f05a28",
    bg: "from-[#f05a28]/10 to-[#f05a28]/5",
    border: "border-[#f05a28]/25",
    iconBg: "bg-[#f05a28]/15",
    items: [
      "পুষ্টিগুণ ও ভিটামিন তথ্য",
      "ফরমালিন-মুক্ত পণ্য চেনার উপায়",
      "মৌসুমী ডায়েট পরিকল্পনা",
      "স্বাস্থ্যকর রেসিপি আইডিয়া",
    ],
  },
  {
    emoji: "🖥️",
    Icon: BarChart3,
    role: "Admin",
    roleBn: "BI সহকারী",
    color: "#6366f1",
    bg: "from-indigo-500/10 to-indigo-500/5",
    border: "border-indigo-500/25",
    iconBg: "bg-indigo-500/15",
    items: [
      "Inventory & database optimization",
      "Fraud detection & seller disputes",
      "Escrow & payment resolution",
      "Platform growth strategy",
    ],
  },
] as const;

export default function AiDoctorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-14 px-4">
        {/* Background radial glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(118,166,1,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(118,166,1,0.15) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#76a601]/10 dark:bg-[#76a601]/15 border border-[#76a601]/30 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#76a601]" />
            <span className="text-xs font-semibold text-[#76a601] tracking-wide uppercase">
              Role-Aware Multi-Agent AI
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight mb-4">
            AgriMind
            <span className="text-[#76a601]">AI</span>{" "}
            <span className="relative inline-block">
              Doctor
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "linear-gradient(90deg, #76a601, #f05a28)" }}
              />
            </span>
          </h1>

          <p className="text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            আপনার ভূমিকা অনুযায়ী বিশেষজ্ঞ পরামর্শ পান। কৃষকের জন্য{" "}
            <strong className="text-[#76a601]">কৃষি ডক্টর</strong>, ক্রেতার জন্য{" "}
            <strong className="text-[#f05a28]">পুষ্টিবিদ</strong>, এবং অ্যাডমিনের জন্য{" "}
            <strong className="text-indigo-500">BI বিশ্লেষক</strong> — সবই এক জায়গায়।
          </p>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { Icon: Zap, text: "llama-3.3-70b Powered", color: "#76a601" },
              { Icon: Shield, text: "Groq Inference Engine", color: "#f05a28" },
              { Icon: Sparkles, text: "Smart Bangla Fallback", color: "#6366f1" },
            ].map(({ Icon, text, color }) => (
              <span
                key={text}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800"
              >
                <Icon className="w-3 h-3" style={{ color }} />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.role}
              className={`rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} p-5 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5`}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-xl">{card.emoji}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{card.roleBn}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">{card.role} Persona</p>
                </div>
              </div>

              {/* Feature list */}
              <ul className="space-y-2">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400">
                    <span
                      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: card.color }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Chat Widget ────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="rounded-3xl overflow-hidden shadow-2xl dark:shadow-none"
          style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.35))" }}
        >
          <AIDoctorChat />
        </div>

        {/* Footnote */}
        <p className="text-center text-slate-400 dark:text-zinc-600 text-xs mt-6">
          AI responses are for informational purposes only. For critical crop or health issues,
          consult a certified expert.{" "}
          <span className="text-[#76a601]">AgriMind</span>
          <span className="text-[#f05a28]">AI</span> &copy; {new Date().getFullYear()}
        </p>
      </section>

    </div>
  );
}