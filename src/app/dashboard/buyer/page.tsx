"use client";

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Newspaper, 
  ArrowUpRight, 
  User, 
  Clock 
} from 'lucide-react';

import { authClient } from '@/lib/auth-client'; 

interface Payment {
  _id: string;
  amount: number | string;
  status?: string;
  date?: string;
  item?: string;
  productName?: string;
}

const Buyerpage = () => {

  const { data, isPending } = authClient.useSession();
  
  
  const session = data;

  const buyerEmail = session?.user?.email; 
  const buyerName = session?.user?.name || "Buyer";

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeOrders: 0,
    lastPurchase: "No dynamic data",
  });

  const agroNews = [
    { id: 1, title: "নতুন সিজনে ফ্রেশ আমদানিকৃত সবজির উপর ১০% ডিসকাউন্ট!", time: "২ ঘণ্টা আগে" },
    { id: 2, title: "কৃষকদের সরাসরি সহায়তা করুন: আপনার প্রতিটি কেনাকাটা যাচ্ছে সঠিক হাতে।", time: "৫ ঘণ্টা আগে" },
  ];
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL

  useEffect(() => {
   
    if (!buyerEmail) return;

    const fetchBuyerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseurl}/api/buyer/payments/get-all-my-payments?buyerEmail=${buyerEmail}&limit=50`);
        const result = await response.json();

        if (result && result.data) {
          const fetchedData: Payment[] = result.data;
          setPayments(fetchedData);

          let total = 0;
          let activeCount = 0;
          let lastDate = "No orders yet";

          fetchedData.forEach((payment, index) => {
            if (payment.amount) {
              total += Number(payment.amount);
            }
            if (payment.status && payment.status !== 'Delivered') {
              activeCount++;
            }
            if (index === 0 && payment.date) {
              lastDate = payment.date; 
            }
          });

          setStats({
            totalSpent: total,
            activeOrders: activeCount,
            lastPurchase: lastDate
          });
        }
      } catch (error) {
        console.error("Error fetching buyer payments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerData();
  }, [buyerEmail]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1b2833] flex items-center justify-center text-slate-900 dark:text-white font-medium">
        Checking authentication...
      </div>
    );
  }


  if (!buyerEmail) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1b2833] flex items-center justify-center text-slate-900 dark:text-white font-medium">
        Please log in to view your dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#1b2833] flex items-center justify-center text-slate-900 dark:text-white font-medium">
        Loading buyer dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header / Welcome Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-slate-700/50 pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-500 dark:from-emerald-400 dark:to-green-500 bg-clip-text text-transparent">
              Welcome Back, {buyerName}!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">এখানে আপনার কেনাকাটার সামারি এবং লেটেস্ট আপডেট দেখতে পাবেন।</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <User size={18} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{buyerName}</span>
          </div>
        </header>

        {/* Analytics / Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Spent Card */}
          <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Spent (মোট খরচ)</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSpent.toLocaleString()} TK</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp size={12} /> Live automated updates
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign size={24} />
            </div>
          </div>

          {/* Active Orders Card */}
          <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Active Orders (চলতি অর্ডার)</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stats.activeOrders} Items</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock size={12} /> Processing / In Transit
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShoppingBag size={24} />
            </div>
          </div>

          {/* Last Purchase Card */}
          <div className="bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl flex items-center justify-between shadow-xs sm:col-span-2 lg:col-span-1">
            <div className="space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Last Purchase Date</span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stats.lastPurchase}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Thank you for staying with us!</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ArrowUpRight size={24} />
            </div>
          </div>
        </section>

        {/* Main Content Layout (Recent Activity & News) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Middle Column: Recent Purchase List */}
          <section className="lg:col-span-2 bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-emerald-600 dark:text-emerald-400" />
                Recent Purchases (সাম্প্রতিক কেনাকাটা)
              </h2>
            </div>
            
            <div className="divide-y divide-slate-200 dark:divide-slate-700/50 max-h-[400px] overflow-y-auto pr-2">
              {payments.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4">কোনো কেনাকাটার রেকর্ড পাওয়া যায়নি।</p>
              ) : (
                payments.map((purchase) => (
                  <div key={purchase._id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{purchase.item || purchase.productName || "Agro Product"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{purchase.date || "N/A"}</p>
                    </div>
                    <div className="text-right space-y-1.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{purchase.amount} TK</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium inline-block
                        ${purchase.status === 'Delivered' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 
                          purchase.status === 'In Transit' ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' : 
                          'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'}
                      `}>
                        {purchase.status || 'Processing'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Right Column: Latest Agri News / Offers */}
          <section className="bg-slate-50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Newspaper size={18} className="text-emerald-600 dark:text-emerald-400" />
              Latest News & Offers
            </h2>
            
            <div className="space-y-4">
              {agroNews.map((news) => (
                <div key={news.id} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 p-4 rounded-xl space-y-2 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer">
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {news.title}
                  </p>
                  <span className="text-[10px] text-slate-500 dark:text-slate-500 block">{news.time}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Buyerpage;