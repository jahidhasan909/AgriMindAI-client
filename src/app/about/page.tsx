import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Leaf, 
  ShoppingBasket, 
  BarChart3, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Bot, 
  ArrowRight 
} from "lucide-react";

const STATS = [
  { label: "Farmers Empowered", value: "10,000+" },
  { label: "B2B Buyers Active", value: "1,200+" },
  { label: "AI Scans Processed", value: "50,000+" },
  { label: "Supply Chain Reduced", value: "20%" },
];

const FEATURES = [
  {
    icon: Leaf,
    title: "AI Crop Doctor",
    description: "Instant crop disease detection, treatment advice, and weather alerts using specialized multi-agent AI.",
    color: "#76a601",
  },
  {
    icon: ShoppingBasket,
    title: "Direct Marketplace",
    description: "Connecting local farmers directly with enterprise buyers and retail supply chains without middleman cuts.",
    color: "#f05a28",
  },
  {
    icon: ShieldCheck,
    title: "Escrow Protection",
    description: "Safe, transparent payment gateways ensuring immediate fund delivery upon successful order verification.",
    color: "#10b981",
  },
  {
    icon: BarChart3,
    title: "Smart BI Analytics",
    description: "Data-driven platform insights to monitor market trends, inventory flow, and fair price distribution.",
    color: "#6366f1",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors duration-300 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#76a601]/10 text-[#76a601] font-semibold text-xs border border-[#76a601]/20">
          <Bot className="w-4 h-4" /> About AgriMind AI
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto">
          Revolutionizing Agriculture with <span className="text-[#76a601]">Smart AI</span> & Direct Trade
        </h1>

        <p className="text-slate-500 dark:text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          AgriMind AI bridges the gap between hard-working farmers and buyers by combining role-aware AI advisory, transparent pricing, and direct market access.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800"
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Mission Section ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <span className="text-xs font-bold text-[#f05a28] uppercase tracking-wider">
              Our Purpose
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Fair Profits for Farmers. Fresh Produce for Everyone.
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
              For decades, agricultural producers have faced low profit margins due to middlemen and delayed crop disease diagnoses. AgriMind AI empowers farmers with an AI Doctor for immediate crop care guidance and connects them to enterprise buyers for direct sales with secure payments.
            </p>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4 w-full">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 space-y-2">
              <Users className="w-6 h-6 text-[#76a601]" />
              <h4 className="font-bold text-sm">Community First</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Built specifically to elevate local farming communities.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-zinc-800 space-y-2">
              <TrendingUp className="w-6 h-6 text-[#f05a28]" />
              <h4 className="font-bold text-sm">Market Efficiency</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Reducing supply chain waste and transit delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Ecosystem Features ── */}
      <section className="max-w-6xl mx-auto px-4 pb-20 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            What Powers AgriMind AI
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
            An end-to-end platform tailored for every stakeholder in the agricultural economy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 space-y-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${feat.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Call To Action ── */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#76a601]/10 via-transparent to-[#f05a28]/10 border border-slate-200 dark:border-zinc-800 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to Experience the Future of Agriculture?
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-sm max-w-lg mx-auto">
            Try our AI Doctor now for crop treatment or explore direct farm listings on the marketplace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/ai-doctor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#76a601] text-white font-semibold text-sm hover:opacity-90 transition-all shadow-md"
            >
              Ask AI Doctor <ArrowRight size={16} />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;