"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  Users, ShoppingBag, BrainCircuit, FileSearch,
  Satellite, ArrowRight, MapPin, Calendar, Star, Package,
  Cpu, Truck, FileText, ChevronDown, Heart, ShoppingCart,
  Quote
} from "lucide-react";

interface StatsData {
  farmerCount: number;
  buyerCount: number;
  aiResolutionRate: number;
  totalDiagnostics?: number;
}

interface ChartItem {
  name?: string;
  value?: number;
  district?: string;
  count?: number;
}

interface ChartData {
  reportsByUtility: ChartItem[];
  topDistricts: ChartItem[];
  statusOverview: ChartItem[];
}

interface Product {
  _id: string;
  productName: string;
  category: string;
  pricePerKg: number;
  availability: string;
  shortDescription: string;
  images: string[];
  location?: { district?: string; upazila?: string } | string;
  harvestDate?: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL ;

const UTILITY_COLORS = ['#f97316', '#06b6d4', '#ea580c', '#3b82f6', '#14b8a6'];
const STATUS_COLORS = ['#ef4444', '#eab308', '#10b981'];
const DISTRICT_COLORS = ['#a855f7', '#ec4899', '#06b6d4', '#f97316', '#10b981'];

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children, className = "",
}) => (
  <div className={`bg-white border border-slate-200/80 shadow-sm rounded-2xl ${className}`}>
    {children}
  </div>
);

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
    {text}
  </span>
);

const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse min-h-[400px]">
    <div className="bg-slate-100 h-52 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-100 rounded w-2/3" />
      <div className="h-3 bg-slate-100 rounded w-1/3" />
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-100 rounded w-16" />
        <div className="h-10 w-10 bg-slate-100 rounded-full" />
      </div>
    </div>
  </div>
);

const LiveStatsSection: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // সরাসরি আপনার দেওয়া দুইটা API থেকে ডাটা ফেচ
    Promise.all([
      fetch(`${BASE}/api/usercollaction`).then((r) => r.json()),
      fetch(`${BASE}/api/payments/get-all-sales`).then((r) => r.json()),
    ])
      .then(([userData, paymentData]) => {
        setUsers(Array.isArray(userData) ? userData : []);
        setPayments(Array.isArray(paymentData) ? paymentData : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);


  const farmerCount = users.filter((u) => u.role === "farmer").length;
  const buyerCount = users.filter((u) => u.role === "buyer").length;

  const totalSalesAmount = payments
    .filter((p) => p.status === "success")
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const productSalesMap = payments.reduce((acc: any, p) => {
    if (p.productName) {
      acc[p.productName] = (acc[p.productName] || 0) + (p.amount || 0);
    }
    return acc;
  }, {});
  const reportsByUtilityData = Object.keys(productSalesMap).map((name) => ({
    name,
    value: productSalesMap[name],
  }));

  const districtMap = users.reduce((acc: any, u) => {
    if (u.district) {
      acc[u.district] = (acc[u.district] || 0) + 1;
    }
    return acc;
  }, {});
  const topDistrictsData = Object.keys(districtMap).map((district) => ({
    district,
    count: districtMap[district],
  }));


  const statusMap = payments.reduce((acc: any, p) => {
    if (p.status) {
      const statusName = p.status.charAt(0).toUpperCase() + p.status.slice(1);
      acc[statusName] = (acc[statusName] || 0) + 1;
    }
    return acc;
  }, {});
  const statusOverviewData = Object.keys(statusMap).map((name) => ({
    name,
    value: statusMap[name],
  }));

 
  const statCards = [
    {
      icon: <Users size={22} className="text-purple-600" />,
      label: "Registered Farmers",
      value: loading ? "—" : farmerCount.toLocaleString(),
      accent: "purple",
    },
    {
      icon: <ShoppingBag size={22} className="text-blue-600" />,
      label: "B2B Buyers",
      value: loading ? "—" : buyerCount.toLocaleString(),
      accent: "blue",
    },
    {
      icon: <BrainCircuit size={22} className="text-amber-600" />,
      label: "Total Sales Revenue",
      value: loading ? "—" : `৳${totalSalesAmount.toLocaleString()}`,
      accent: "amber",
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold dark:text-white tracking-tight">
            Numbers that matter
          </h2>
          <p className="text-slate-600 mt-2 max-w-xl mx-auto dark:text-gray-300 text-sm md:text-base">
            See how the community is growing and sales performance.
          </p>
        </div>

        {/* 3 Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
            >
              <GlassCard className="p-6 flex items-center gap-5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${card.accent}-50 border border-${card.accent}-100 shrink-0`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-slate-900">
                    {loading ? (
                      <span className="inline-block w-16 h-7 bg-slate-100 rounded animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </p>
                  <p className="text-xs text-slate-500 font-medium tracking-wide mt-0.5">
                    {card.label}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* 3 Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart 1: Product Sales Revenue */}
          <GlassCard className="p-6 flex flex-col justify-between min-h-[320px]">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Sales by Product
            </h3>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-xs animate-pulse">
                Loading sales…
              </div>
            ) : (
              <>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportsByUtilityData.length ? reportsByUtilityData : [{ name: 'No Sales', value: 1 }]}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {reportsByUtilityData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={UTILITY_COLORS[index % UTILITY_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 pt-2 text-[10px] text-slate-600 font-medium">
                  {reportsByUtilityData.map((item, index) => (
                    <div key={item.name || index} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: UTILITY_COLORS[index % UTILITY_COLORS.length] }} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>

          {/* Chart 2: Top Districts */}
          <GlassCard className="p-6 flex flex-col justify-between min-h-[320px]">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Top Districts
            </h3>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-xs animate-pulse">
                Loading districts…
              </div>
            ) : (
              <div className="h-52 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topDistrictsData}
                    margin={{ top: 0, right: 5, left: -28, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="district" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }} />
                    <Bar dataKey="count" radius={[5, 5, 0, 0]} maxBarSize={22}>
                      {topDistrictsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DISTRICT_COLORS[index % DISTRICT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </GlassCard>

          {/* Chart 3: Payment Status Overview */}
          <GlassCard className="p-6 flex flex-col justify-between min-h-[320px]">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Payment Status Overview
            </h3>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-slate-400 text-xs animate-pulse">
                Loading status…
              </div>
            ) : (
              <>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusOverviewData}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {statusOverviewData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 pt-2 text-[10px] text-slate-600 font-medium">
                  {statusOverviewData.map((item, index) => (
                    <div key={item.name || index} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length] }} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>

        </div>
      </div>
    </section>
  );
};

const AIFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Cpu size={28} className="text-emerald-600" />,
      badge: "AI Adaptive Mode",
      title: "Crop Doctor & Telemetry Command",
      description:
        "Our context-aware Agentic AI continuously processes drone telemetry streams, multispectral imagery, and soil sensor data to perform real-time crop disease diagnosis. It delivers specific, actionable treatment protocols.",
      bullets: [
        "Multispectral drone image analysis",
        "Soil & moisture telemetry fusion",
        "Disease classification scoring",
        "Automated alert dispatch",
      ],
      accentClass: "border-emerald-200 bg-emerald-50/50",
      pillClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      icon: <FileSearch size={28} className="text-blue-600" />,
      badge: "AI Adoption Mode",
      title: "Document Intelligence & Auto-Classification",
      description:
        "Our Document Intelligence pipeline ingests farm invoices, government subsidy documents, and harvest records using OCR + LLM reasoning. It performs bulk grading of produce batches.",
      bullets: [
        "Invoice scanning via OCR",
        "Automated produce quality grading",
        "Category tagging & enrichment",
        "Settlement routing pipelines",
      ],
      accentClass: "border-blue-200 bg-blue-50/50",
      pillClass: "bg-blue-100 text-blue-800 border-blue-200",
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-8 ">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <SectionLabel text="Core AI Agents" />
          <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white">
            Two Modes. One Intelligent Platform.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div key={f.badge} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55, ease: "easeOut" }}>
              <div className={`h-full border ${f.accentClass} rounded-2xl p-7 space-y-5 shadow-sm`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white border border-slate-200 shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest border px-2.5 py-0.5 rounded-full ${f.pillClass}`}>{f.badge}</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1.5">{f.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{f.description}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <ArrowRight size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Satellite size={26} className="text-emerald-600" />,
      title: "Telemetry Data & Image Capture",
      description:
        "Autonomous agricultural drones sweep field grids, capturing high-resolution multispectral images and sensor readings.",
    },
    {
      step: "02",
      icon: <Cpu size={26} className="text-blue-600" />,
      title: "Agentic AI Diagnosis",
      description:
        "The AI engine cross-references field data against a curated disease model library. It generates a structured diagnosis report.",
    },
    {
      step: "03",
      icon: <Truck size={26} className="text-amber-600" />,
      title: "Marketplace Settlement",
      description:
        "Verified healthy produce is listed with AI-generated labels. Payments clear safely and delivery paths optimize natively.",
    },
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-8 ">
      <div className="max-w-7xl mx-auto space-y-14">
        <div className="text-center">
          <SectionLabel text="How It Works" />
          <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white">
            From Field to Marketplace in 3 Steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-emerald-200 via-slate-300 to-blue-200" />
          {steps.map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55, ease: "easeOut" }}>
              <GlassCard className="p-7 h-full flex flex-col gap-5 relative">
                <div className="absolute -top-4 left-7 bg-white border border-slate-200 rounded-full px-3 py-0.5 text-xs font-black text-slate-400 tracking-widest shadow-sm">
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200">
                  {s.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{s.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductsPreviewSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/products?page=1&limit=3`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.products.slice(0, 3));
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const getLocation = (loc?: Product["location"]) => {
    if (!loc) return "Bangladesh";
    if (typeof loc === "string") return loc;
    return [loc.upazila, loc.district].filter(Boolean).join(", ") || "Bangladesh";
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center">
          <SectionLabel text="Fresh From Farms" />
          <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white">Latest Marketplace Listings</h2>
        </div>

        {error ? (
          <div className="text-center py-16 text-slate-400 text-sm">Failed to load products. Please try again later.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading
              ? [0, 1, 2].map((k) => <SkeletonCard key={k} />)
              : products.map((p, i) => (
                  <motion.div key={p._id} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55, ease: "easeOut" }}>
                    
                    <div className="relative bg-white border border-slate-200/90 shadow-sm rounded-[2rem] p-4 flex flex-col h-full group hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                      <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 flex items-center justify-center">
                        <img
                          src={p.images?.[0] || "/placeholder.png"}
                          alt={p.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                          {p.category}
                        </span>
                        
                      </div>

                      <div className="pt-5 px-2 pb-14 flex flex-col gap-2.5 flex-1 relative">
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">{p.productName}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{p.shortDescription}</p>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-[10px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-emerald-600" /> {getLocation(p.location)}</span>
                          {p.harvestDate && (
                            <span className="flex items-center gap-1"><Calendar size={11} className="text-blue-600" /> {p.harvestDate}</span>
                          )}
                          <span className="flex items-center gap-1"><Star size={11} className="text-amber-500 fill-amber-500" /> Premium</span>
                        </div>

                        <div className="absolute bottom-1 left-2 flex flex-col">
                          <span className="text-2xl font-black text-slate-900">৳{p.pricePerKg}</span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider -mt-1">Per Kilogram</span>
                        </div>

                        <div className="absolute -bottom-4 -right-4 bg-white pl-4 pt-4 rounded-tl-[2rem] overflow-hidden z-10">
                          <Link 
                            href={`/marketplace/${p._id}`}
                            className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center  shadow-md hover:bg-emerald-500 hover:text-slate-950 transition-all duration-300"
                          >
                            <ShoppingCart size={20} className="fill-current" />
                          </Link>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ))}
          </div>
        )}

        <div className="flex justify-center pt-8">
          <Link
            href="/marketplace"
            className="group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm px-8 py-3.5 rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:scale-[1.02]"
          >
            <Package size={17} />
            Show All Products
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};



 const testimonials = [
  {
    name: "Azharul Islam",
    role: "Paddy & Vegetable Farmer, Bogura",
    userType: "Farmer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote: "The AI disease diagnosis feature identified blight disease in my tomato field early, saving my entire harvest.",
    detail: "Earlier, I had to sell to middlemen at low prices in the local market. Now, through AgriMind, I can sell directly to buyers in Dhaka and Chattogram at fair prices."
  },
  {
    name: "Tanveer Ahmed",
    role: "Procurement Manager, Agro Foods",
    userType: "Buyer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    quote: "Sourcing high-quality, fresh produce directly from farmers has become remarkably easy.",
    detail: "Getting fresh vegetables and fruits straight from the fields reduced our supply chain costs by 20% while ensuring top-tier product quality."
  },
  {
    name: "Rahim Sheikh",
    role: "Mango & Litchi Orchard Owner, Rajshahi",
    userType: "Farmer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    quote: "Accurate weather updates and the marketplace payment system are extremely fast and secure.",
    detail: "Previously, selling on credit meant waiting months to receive payments. Now, with AgriMind's secure payment gateway, funds transfer directly to my account right upon delivery."
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-emerald-600 font-bold text-xs tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/50">
              Community Reviews
            </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
      Farmer & Buyer Experiences
    </h2>
    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-2xl">
      See how farmers are getting fair prices with AgriMind AI and how buyers are getting fresh produce.
    </p>
          </div>
          <Link
            href="#reviews"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shrink-0 shadow-sm"
          >
            See All Reviews <ArrowRight size={14} />
          </Link>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className="p-6 flex flex-col justify-between h-full space-y-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                
                {/* Background Quote Watermark */}
                <Quote className="absolute right-4 top-4 text-slate-100 dark:text-slate-800/40 w-16 h-16 -z-0 pointer-events-none" />

                <div className="space-y-4 z-10">
                  {/* User Profile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                          {t.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {t.role}
                        </p>
                      </div>
                    </div>

                    {/* User Type Badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      t.userType === "Farmer"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                        : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                    }`}>
                      {t.userType === "Farmer" ? "কৃষক" : "বায়ার"}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>

                  {/* Main Quote */}
                  <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                {/* Detailed Story */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4 leading-relaxed font-normal z-10">
                  {t.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const faqs = [
  {
    q: "How does AgriMind AI help farmers diagnose crop diseases?",
    a: "Farmers can simply upload a photo of their infected crop or leaf to the AI Scanner. The platform analyzes the visual symptoms in seconds, identifies the disease, and provides recommended organic and chemical treatments.",
  },
  {
    q: "How can B2B buyers purchase fresh produce directly from farmers?",
    a: "Buyers can browse active listings in the Marketplace, filter by crop type, district, or harvest date, and directly place orders or initiate negotiations with registered farmers.",
  },
  {
    q: "Is there any fee for farmers to list their crops in the marketplace?",
    a: "No, listing crops and using basic AI advisory services are completely free for farmers. Our goal is to connect farmers directly with verified buyers without middleman cuts.",
  },
  {
    q: "How are payments handled between buyers and farmers?",
    a: "AgriMind uses a secure payment gateway where buyer funds are safely held until the order is delivered and verified by the buyer, ensuring instant and reliable payouts to the farmer's account.",
  },
  {
    q: "How do buyers verify the quality and origin of the produce?",
    a: "Every product listing includes farmer details, location (upazila and district), harvest dates, and real farm photos. Buyers can also view farmer ratings and direct contact credentials before placing an order.",
  }
];

const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="w-full py-24 px-4 sm:px-6 md:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-10">
            <span className="inline-block px-3 py-1 bg-emerald-5 border border-emerald-200 rounded-md text-xs font-bold text-emerald-700 tracking-wide">
              ❓ FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-black dark:text-white tracking-tight leading-none">
              Frequently asked questions
            </h2>
           
          </div>

          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, i) => {
              const isOpen = openIdx === i;
              return (
                <div 
                  key={i} 
                  className="bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    className="w-full text-left flex items-center justify-between gap-4 p-5 group transition-colors"
                  >
                    <span className={`text-sm md:text-base font-bold transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-800 group-hover:text-slate-950'}`}>
                      {faq.q}
                    </span>
                    <ChevronDown 
                      size={18} 
                      className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-emerald-600" : ""}`} 
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <p className="px-5 pb-5 text-xs md:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const HomeSections: React.FC = () => (
  <div className=" text-slate-900 font-sans antialiased overflow-hidden">
    <LiveStatsSection />
    <AIFeaturesSection />
    <HowItWorksSection />
    <ProductsPreviewSection />
    <TestimonialsSection />
    <FAQSection />
  </div>
);

export default HomeSections;