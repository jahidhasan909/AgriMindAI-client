import React from 'react';
import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import SalesHistoryTable from '@/components/DashboardComponents/FarmerComponents/SalesHistory';


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

const SalesHistoryPage = async () => {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    const session = await auth.api.getSession({ headers: await headers() });
    const farmerEmail = session?.user?.email;
    

    let salesData: PaymentData[] = [];

    try {
        
        const res = await fetch(`${baseurl}/api/payments/get-all-sales`, {
            cache: 'no-store'
        });
        
        if (res.ok) {
            const allSales: PaymentData[] = await res.json();
            
         
            salesData = allSales.filter(payment => !!payment.buyerEmail);
        }
    } catch (error) {
        console.error("Error fetching sales history:", error);
    }

    return (
        <div className="bg-white/10 min-h-screen">
            <div className="py-12 px-4 lg:py-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
                
                {/* Header */}
                <header className="py-7 px-10 rounded-2xl bg-gradient-to-r dark:from-green-950/20 dark:to-slate-900 border border-gray-100 dark:border-green-900/30">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                        Sales & Payment History
                    </h1>
                    <p className="lg:text-[1rem] text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Track all successful payments and earnings from your buyers.
                    </p>
                </header>

                {/* Client Presentation Table Component */}
                <SalesHistoryTable sales={salesData} />

            </div>
        </div>
    );
};

export default SalesHistoryPage;