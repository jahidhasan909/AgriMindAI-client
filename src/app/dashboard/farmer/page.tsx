
import FarmerProductsPagination from '@/components/DashboardComponents/FarmerComponents/ProductsPegination';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

const MyReportspage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    let page = params.page;
    
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = session?.user;

    if (!page) {
        page = "1";
    }

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    
    const res = await fetch(`${baseurl}/api/farmer/products/pegination?farmerEmail=${session?.user?.email}&page=${page}`, {
        cache: 'no-store' 
    });
    
    const products = await res.json();

    return (
        <div>
            
            <FarmerProductsPagination products={products} user={user}/>
        </div>
    );
};

export default MyReportspage;