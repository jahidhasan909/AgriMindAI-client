"use client";

import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export interface ProductProps {
    _id: string;
    productName: string;
    category: string;
    pricePerKg: number;
    availability: string;
    contactNumber: string;
    location: { district: string; upazila: string };
    shortDescription: string;
    images: string[];
    farmerName: string;
}

export const ProductDetailsClient: React.FC<{ product: ProductProps }> = ({ product }) => {
    const [activeImage, setActiveImage] = useState<string>(product.images?.[0] || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [starLoading, setStarLoading] = useState<boolean>(false);
    const [availability, setAvailability] = useState<string>(product.availability);
    const [starCount, setStarCount] = useState<number>(0);

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const router = useRouter();

    // Fetch star count on mount
    useEffect(() => {
        const fetchStarCount = async () => {
            try {
                const res = await fetch(`${baseurl}/api/start/count/${product._id}`);
                if (res.ok) {
                    const data = await res.json();
                    setStarCount(data.count || 0);
                }
            } catch (err) {
                console.error("Error fetching initial star count:", err);
            }
        };
        fetchStarCount();
    }, [product._id, baseurl]);

    const handleStarClick = async (ratingValue: number) => {
        if (starLoading) return;
        setStarLoading(true);

        try {
            const session = await authClient.getSession();
            const user = session?.data?.user;

            if (!user) {
                toast.error("Please login to rate or star this product.");
                setStarLoading(false);
                return;
            }

            const starPayload = {
                productId: product._id,
                buyerEmail: user.email,
                buyerName: user.name || "Jahid Hasan",
                actionType: "star_rating",
                rating: ratingValue,
                createdAt: new Date().toISOString()
            };

            const response = await fetch(`${baseurl}/api/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(starPayload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setStarCount(data.count);
                toast.success(`Product starred with ${ratingValue} stars!`);
            } else {
                toast.error("Failed to submit star rating.");
            }
        } catch (error) {
            toast.error("Network error occurred while rating.");
        } finally {
            setStarLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const session = await authClient.getSession();
            const user = session?.data?.user;

            if (!user) {
                toast.error('Please login as a Buyer to proceed with payment.');
                return;
            }

            let userRole: string | undefined;
            try {
                const res = await fetch(`${baseurl}/api/own/usercollaction?email=${user.email}`);
                if (res.ok) {
                    const dbUser = await res.json();
                    userRole = dbUser?.role;
                }
            } catch (err) {
                console.error('Error fetching user role:', err);
            }

            if (userRole === 'farmer') {
                toast.error('Farmers cannot purchase products.');
                return;
            }

            if (userRole !== 'buyer') {
                toast.error('Only buyers can proceed with payment.');
                return;
            }


            const res = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product,
                    buyerEmail: user.email,
                    buyerName: user.name || 'Jahid Hasan',
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || 'Failed to create payment session.');
                return;
            }

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error('No checkout URL returned.');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-20 bg-[#f8f9fa] dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xs p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column - Gallery */}
                    <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-3 justify-center md:justify-start">
                            {product.images?.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all bg-slate-50 ${activeImage === img ? 'border-[#f05a28]' : 'border-transparent'}`}
                                >
                                    <img src={img} alt={`thumb-${index}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden relative border border-slate-100 dark:border-slate-700 p-8 flex items-center justify-center">
                            <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-md">
                                {product.category}
                            </span>
                            <img src={activeImage} alt={product.productName} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal rounded-lg" />
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                                Farmer: {product.farmerName}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                                {product.productName}
                            </h1>

                            {/* Interactive Star System with Live Count */}
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => {
                                    const ratingValue = i + 1;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleStarClick(ratingValue)}
                                            className="hover:scale-115 transition-transform p-0.5 focus:outline-hidden disabled:opacity-50"
                                            disabled={starLoading}
                                            title={`Rate ${ratingValue} Stars`}
                                        >
                                            <Star className="w-5 h-5 fill-amber-400 text-amber-400 cursor-pointer" />
                                        </button>
                                    );
                                })}

                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                                    ({starCount} {starCount === 1 ? 'person' : 'people'} starred this)
                                </span>
                            </div>

                            <div className="pt-2">
                                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                                    ৳{product.pricePerKg} <span className="text-sm font-normal text-slate-400">/ kg</span>
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                                {product.shortDescription}
                            </p>

                            <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <span className="font-semibold block text-slate-700 dark:text-slate-300">Origin Location:</span>
                                {product.location?.upazila}, {product.location?.district}
                            </div>
                        </div>

                        {/* Button and Vendor section */}
                        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex gap-4">
                                <button
                                    onClick={handlePayment}
                                    disabled={loading || availability !== 'Available'}
                                    className="flex-1 h-14 bg-[#2b223a] hover:bg-[#1d1628] disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {loading ? 'PROCESSING...' : availability === 'Available' ? 'PAY WITH STRIPE' : 'UNAVAILABLE'}
                                </button>
                            </div>
                            <p className="text-center text-xs text-slate-400">Contact Vendor: {product.contactNumber}</p>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-3 gap-2 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                            <div className="flex flex-col items-center p-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">100% Organic</span>
                            </div>
                            <div className="flex flex-col items-center p-2">
                                <Truck className="w-5 h-5 text-indigo-600 mb-1" />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Fast Delivery</span>
                            </div>
                            <div className="flex flex-col items-center p-2">
                                <Sparkles className="w-5 h-5 text-amber-500 mb-1" />
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Top Quality</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};