import AdminProductTable from '@/components/DashboardComponents/AdminComponents/ProductsHistoryClient';
import React from 'react';


interface ProductData {
    _id: string;
    productName: string;
    category: string;
    pricePerKg: number;
    availability: 'Available' | 'Unavailable';
    contactNumber: string;
    harvestDate: string;
    shortDescription: string;
    farmerName: string;
    farmerEmail: string;
    buyerName?: string;
    buyerEmail?: string;
    createdAt: string;
}

interface ApiResponse {
    data: ProductData[];
    page: number;
    totalPage: number;
}

interface SearchParams {
    page?: string;
}

const AdminProductHistoryPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams.page) || 1;

    let apiData: ApiResponse = { data: [], page: 1, totalPage: 1 };

    try {
        
        const res = await fetch(`${baseurl}/api/adminAcess/products?page=${currentPage}&limit=10`, {
            cache: 'no-store'
        });
        
        if (res.ok) {
            apiData = await res.json();
        }
    } catch (error) {
        console.error("Error fetching admin product history:", error);
    }

    return (
        <div className="bg-white/10 min-h-screen">
            <div className="py-12 px-4 lg:py-8 max-w-7xl mx-auto space-y-6 md:space-y-8 pb-20">
                
                {/* Header */}
                <header className="py-7 px-10 rounded-2xl bg-gradient-to-r dark:from-green-950/20 dark:to-slate-900 border border-gray-100 dark:border-green-900/30">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                        Global Product Inventory
                    </h1>
                    <p className="lg:text-[1rem] text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Admin Overview: Monitor all listed products, farmers, and buyer assignments across the platform.
                    </p>
                </header>

                {/* Presentation Table Component */}
                <AdminProductTable productInfo={apiData} />

            </div>
        </div>
    );
};

export default AdminProductHistoryPage;