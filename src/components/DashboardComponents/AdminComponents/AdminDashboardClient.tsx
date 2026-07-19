"use client";

import React from 'react';
import { 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid,
    AreaChart,
    Area
} from 'recharts';
import { 
    Users, 
    ShoppingBag, 
    DollarSign, 
    TrendingUp, 
    Layers, 
    Plus, 
    Download,
    Search,
    Bell,
    Mail
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardClientProps {
    stats: {
        totalUsers: number;
        totalBuyers: number;
        totalFarmers: number;
        totalProducts: number;
        totalEarnings: number;
    };
    payments: any[];
    products: any[];
}

const AdminDashboardClient: React.FC<DashboardClientProps> = ({ stats, payments, products }) => {
    
    
    const chartData = [
        { name: 'S', sales: 4000, products: 2400 },
        { name: 'M', sales: 3000, products: 1398 },
        { name: 'T', sales: 2000, products: 9800 },
        { name: 'W', sales: 2780, products: 3908 },
        { name: 'T', sales: 1890, products: 4800 },
        { name: 'F', sales: 2390, products: 3800 },
        { name: 'S', sales: 3490, products: 4300 },
    ];

    
    const formattedChartData = payments.length > 0 
        ? payments.slice(-7).map((p, index) => ({
            name: new Date(p.paidAt).toLocaleDateString('en-US', { weekday: 'short' })[0],
            sales: p.amount,
            products: 200 
          }))
        : chartData;

    return (
        <div className="min-h-screen bg-[#f8faf9] dark:bg-slate-950 p-4 md:p-8 font-sans antialiased text-slate-900 dark:text-slate-100">
            <div className="max-w-[1600px] mx-auto space-y-8">
                
                
            

                {/* Dashboard Headline & System Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
                        <p className="text-sm text-slate-400 font-medium mt-0.5">Plan, prioritize, and monitor agricultural assets with ease.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="inline-flex items-center gap-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2.5 rounded-xl transition-all shadow-xs shadow-emerald-600/10">
                            <Plus className="h-4 w-4" /> Add Product
                        </button>
                        <button className="inline-flex items-center gap-2 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl transition-all">
                            <Download className="h-4 w-4" /> Import Data
                        </button>
                    </div>
                </div>

                {/* Grid 1: Metric Overview Cards (Match Screenshot Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    
                    {/* Active Highlight Card - Total Users */}
                    <Card className="p-6 bg-emerald-700 text-white border-none rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-700/10 group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2">
                            <Users className="h-32 w-32" />
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold text-emerald-100">Total Framework Users</span>
                            <span className="p-2 bg-emerald-600/40 rounded-full text-white">
                                <TrendingUp className="h-4 w-4" />
                            </span>
                        </div>
                        <div className="mt-6 space-y-1">
                            <h2 className="text-4xl font-black tracking-tight">{stats.totalUsers}</h2>
                            <p className="text-xs text-emerald-200/80 font-medium">+14% increased from last month</p>
                        </div>
                    </Card>

                    {/* Buyers Counter Card */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xs group">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Platform Buyers</span>
                            <span className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                                <Users className="h-4 w-4" />
                            </span>
                        </div>
                        <div className="mt-6 space-y-1">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.totalBuyers}</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Verified active shoppers</p>
                        </div>
                    </Card>

                    {/* Farmers Counter Card */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xs">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Registered Farmers</span>
                            <span className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                                <Layers className="h-4 w-4" />
                            </span>
                        </div>
                        <div className="mt-6 space-y-1">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.totalFarmers}</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Aggregated agriculture producers</p>
                        </div>
                    </Card>

                    {/* Products Inventory Status Card */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xs">
                        <div className="flex justify-between items-start">
                            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">Total Fruit & Vegetable Items</span>
                            <span className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                                <ShoppingBag className="h-4 w-4" />
                            </span>
                        </div>
                        <div className="mt-6 space-y-1">
                            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.totalProducts}</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Live marketplace SKUs available</p>
                        </div>
                    </Card>
                </div>

                {/* Grid 2: Recharts Component & Side Meta Presentation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Main Recharts Column */}
                    <Card className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xs">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Project Analytics</h3>
                                <p className="text-xs text-slate-400">Platform billing dynamics relative to inventory</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <span className="flex items-center gap-1.5 text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-600"></span> Gross Revenue</span>
                                <span className="flex items-center gap-1.5 text-slate-400"><span className="h-2 w-2 rounded-full bg-slate-200"></span> Target Listings</span>
                            </div>
                        </div>

                        {/* Minimalist Grid BarChart Inspired directly by Donezo UI Mockup */}
                        <div className="h-72 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formattedChartData} barSize={35}>
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                                    />
                                    <Bar 
                                        dataKey="sales" 
                                        fill="#047857" 
                                        radius={[10, 10, 10, 10]} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Revenue Area Mini Overview Card */}
                    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Escrow Progress</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Total processed payments volume</p>
                                </div>
                                <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 rounded-xl">
                                    <DollarSign className="h-4 w-4" />
                                </span>
                            </div>
                            <div className="mt-6">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalEarnings} BDT</h2>
                                <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md inline-block mt-1">
                                    Platform Master Ledger Vol.
                                </p>
                            </div>
                        </div>

                        {/* Sparkline Area chart representing stable billing curves */}
                        <div className="h-24 w-full mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Grid 3: Latest Platform Inventory Ledger */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Inventory Enlistments</h3>
                            <p className="text-xs text-slate-400">Overview of recent vegetable & crop additions across hubs</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                                    <th className="pb-3 font-medium">Product Handle</th>
                                    <th className="pb-3 font-medium">Sector Category</th>
                                    <th className="pb-3 font-medium">Bidding Floor Pricing</th>
                                    <th className="pb-3 text-center font-medium">Platform Lifecycle Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                {products.slice(0, 4).map((product) => (
                                    <tr key={product._id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="py-3.5 font-semibold text-slate-900 dark:text-white">{product.productName}</td>
                                        <td className="py-3.5 text-slate-500">{product.category}</td>
                                        <td className="py-3.5 font-bold text-slate-900 dark:text-white">{product.pricePerKg} BDT/Kg</td>
                                        <td className="py-3.5 text-center">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border
                                                ${product.availability === 'Available' 
                                                    ? 'bg-emerald-50/60 text-emerald-700 border-emerald-100' 
                                                    : 'bg-slate-50 text-slate-400 border-slate-200'}
                                            `}>
                                                {product.availability}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardClient;