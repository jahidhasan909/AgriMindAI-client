import React from 'react';

import { auth } from '@/lib/auth';
import { he } from 'zod/v4/locales';
import { headers } from 'next/headers';
import OrderHistoryTable from '@/components/DashboardComponents/BuyerComponents/OrderHIstory';

interface PaymentData {
    _id: string;
    productId: string;
    productName: string;
    buyerName: string;
    buyerEmail: string;
    transactionId: string;
    amount: number;
    status: string;
    paidAt: string;
}

interface ApiResponse {
    data: PaymentData[];
    page: number;
    totalPage: number;
}

interface SearchParams {
    page?: string;
}

const OrderHistoryPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams.page) || 1;

    const session=await auth.api.getSession({
        headers:await headers()
    });
    const buyerEmail = session?.user?.email; 

    let orderData: ApiResponse = { data: [], page: 1, totalPage: 1 };

    try {
      
        const res = await fetch(`${baseurl}/api/buyer/payments/get-all-my-payments?buyerEmail=${buyerEmail}&page=${currentPage}&limit=10`, {
            cache: 'no-store'
        });
        
        if (res.ok) {
            orderData = await res.json();
        }
    } catch (error) {
        console.error("Error fetching order history:", error);
    }

    return (
        <div className="bg-white/10 min-h-screen">
            <div className="py-12 px-4 lg:py-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
                
                {/* Header */}
                <header className="py-7 px-10 rounded-2xl bg-gradient-to-r dark:from-green-950/20 dark:to-slate-900 border border-gray-100 dark:border-green-900/30">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                        My Order History
                    </h1>
                    <p className="lg:text-[1rem] text-xs text-slate-500 dark:text-slate-400 mt-1">
                        View and manage all your purchased items and past transactions.
                    </p>
                </header>

                {/* Presentation Component */}
                <OrderHistoryTable orderInfo={orderData} />

            </div>
        </div>
    );
};

export default OrderHistoryPage;