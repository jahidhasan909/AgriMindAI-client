import React from "react";
import type { Metadata } from "next";
import AIDoctorChat from "@/components/AIDoctorChat";
import { Leaf, ShoppingBasket, BarChart3, Sparkles, Bot } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Doctor | AgriMindAI",
  description:
    "Ask your role-aware AI expert — কৃষি ডক্টর for farmers, Nutritionist for buyers, and Business Intelligence for admins. Powered by AgriMindAI.",
};

const FEATURE_CARDS = [
  {
    emoji: "🌾",
    Icon: Leaf,
    role: "Farmer",
    roleBn: "কৃষি ডক্টর",
    color: "#76a601",
    label: "গাছের রোগ ও ফলন পরামর্শ",
  },
  {
    emoji: "🥗",
    Icon: ShoppingBasket,
    role: "Buyer",
    roleBn: "পুষ্টি বিশেষজ্ঞ",
    color: "#f05a28",
    label: "ফরমালিন তথ্য ও পুষ্টিমান",
  },
  {
    emoji: "🖥️",
    Icon: BarChart3,
    role: "Admin",
    roleBn: "BI সহকারী",
    color: "#6366f1",
    label: "ডাটাবেজ ও বিজনেস অ্যানালিটিক্স",
  },
] as const;

export default function AiDoctorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 flex flex-col items-center justify-center pt-24 pb-16 px-4">

      <div className="mb-6 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#76a601] to-emerald-400 p-0.5 shadow-xl shadow-[#76a601]/20 flex items-center justify-center">
          <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[14px] flex items-center justify-center">
            <Bot className="w-8 h-8 text-[#76a601]" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto text-center space-y-2 mb-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering Agriculture.
        </h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#76a601] dark:text-[#76a601] tracking-tight">
          Smart AI for Farmers & Buyers.
        </h2>


      </div>


      <section className="w-full max-w-4xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-2xl dark:shadow-none bg-white dark:bg-zinc-900">
          <AIDoctorChat />
        </div>

        {/* Footnote */}
        <p className="text-center text-slate-400 dark:text-zinc-600 text-xs mt-6">
          AI responses are for informational purposes only. For critical crop or health issues,
          consult a certified expert.{" "}
          <span className="text-[#76a601] font-medium">AgriMind</span>
          <span className="text-[#f05a28] font-medium">AI</span> &copy; {new Date().getFullYear()}
        </p>
      </section>
    </div>
  );
}