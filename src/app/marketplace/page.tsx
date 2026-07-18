"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';

interface Product {
    _id: string;
    productName: string;
    category: string;
    pricePerKg: number;
    availability: string;
    shortDescription: string;
    images: string[];
}

const MarketplacePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';

    const fetchProducts = async (pageNumber: number) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseurl}/api/products?page=${pageNumber}&limit=20`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
                setTotalPages(data.totalPages);
                setPage(data.currentPage);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50  mt-20 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                        Agri Marketplace
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Explore fresh products directly from our premium farmers.
                    </p>
                </header>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white dark:bg-slate-900 rounded-[32px] p-4 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col justify-between relative overflow-hidden group"
                            >
                                {/* Top Image Section */}
                                <div className="relative aspect-square w-full rounded-[24px] overflow-hidden bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={product.images?.[0] || "/placeholder.png"}
                                        alt={product.productName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        {product.availability === "Available" ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>


                                <div className="pt-5 pb-2 pr-2 relative flex-1 flex flex-col justify-between">
                                    <div className="space-y-2 pr-12">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                                {product.productName}
                                            </h3>

                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                                            {product.shortDescription}
                                        </p>
                                    </div>


                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                                            ৳{product.pricePerKg} <span className="text-xs font-normal text-slate-400">/ kg</span>
                                        </span>


                                        <div className="absolute bottom-[-17px] right-[-17px] bg-slate-50 dark:bg-slate-950 pt-3 pl-3 rounded-tl-[28px]">
                                            <Link
                                                href={`/marketplace/${product._id}`}
                                                className="flex items-center justify-center w-14 h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-4 pt-8">
                    {page > 1 && (
                        <button
                            onClick={() => fetchProducts(page - 1)}
                            className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 transition-all"
                        >
                            Back
                        </button>
                    )}

                    {page < totalPages && (
                        <button
                            onClick={() => fetchProducts(page + 1)}
                            className="px-6 py-2.5 bg-[#f05a28] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#d94f20] transition-all"
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketplacePage;