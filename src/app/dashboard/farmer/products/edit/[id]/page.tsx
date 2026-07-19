"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";

interface ProductFormData {
    productName: string;
    category: string;
    pricePerKg: number;
    contactNumber: string;
    shortDescription: string;
}

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { data: userData, isPending } = authClient.useSession();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset
    } = useForm<ProductFormData>({
        defaultValues: {
            productName: "",
            category: "",
            pricePerKg: 0,
            contactNumber: "",
            shortDescription: "",
        }
    });

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`${baseurl}/api/products/${id}`, {
                    cache: "no-store"
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch product data");
                }
                const data = await res.json();
                
                // Pre-populate form values
                setValue("productName", data.productName);
                setValue("category", data.category);
                setValue("pricePerKg", data.pricePerKg);
                setValue("contactNumber", data.contactNumber);
                setValue("shortDescription", data.shortDescription);
                
                setIsLoading(false);
            } catch (error: any) {
                toast.error(error.message || "Error loading product details");
                router.push("/dashboard/farmer");
            }
        };

        fetchProduct();
    }, [id, setValue, baseurl, router]);

    if (isPending || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-slate-500">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                    <span>Loading product details...</span>
                </div>
            </div>
        );
    }

    const user = userData?.user;
    if (!user) {
        return <div className="text-center py-20 text-slate-500 font-medium">Please log in to edit products.</div>;
    }

    const onSubmit = async (data: ProductFormData) => {
        try {
            setIsSaving(true);

            const productPayload = {
                productName: data.productName,
                category: data.category,
                pricePerKg: Number(data.pricePerKg),
                contactNumber: data.contactNumber,
                shortDescription: data.shortDescription,
                updatedAt: new Date()
            };

            const res = await fetch(`${baseurl}/api/products/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productPayload)
            });

            if (!res.ok) {
                throw new Error("Failed to save product updates");
            }

            toast.success("Product request updated successfully!");
            router.push("/dashboard/farmer");
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 space-y-6"
            >
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/dashboard/farmer")}
                        className="rounded-full h-8 w-8 p-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Edit Product Request</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Modify the information for your listed item.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Product Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="productName" className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Product Name</Label>
                        <Input
                            id="productName"
                            placeholder="e.g. Organic Mango"
                            className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
                            {...register("productName", { required: "Product name is required" })}
                        />
                        {errors.productName && <p className="text-red-500 text-xs pl-1">{errors.productName.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-1.5">
                            <Label htmlFor="category" className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Category</Label>
                            <select
                                id="category"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden"
                                {...register("category", { required: "Category is required" })}
                            >
                                <option value="">Select Category</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Grains">Grains</option>
                                <option value="Herbs">Herbs</option>
                                <option value="Others">Others</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs pl-1">{errors.category.message}</p>}
                        </div>

                        {/* Price Per Kg */}
                        <div className="space-y-1.5">
                            <Label htmlFor="pricePerKg" className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Price per Kg (TK)</Label>
                            <Input
                                id="pricePerKg"
                                type="number"
                                placeholder="Price"
                                className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
                                {...register("pricePerKg", { 
                                    required: "Price is required",
                                    min: { value: 1, message: "Price must be greater than 0" }
                                })}
                            />
                            {errors.pricePerKg && <p className="text-red-500 text-xs pl-1">{errors.pricePerKg.message}</p>}
                        </div>
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-1.5">
                        <Label htmlFor="contactNumber" className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Contact Number</Label>
                        <Input
                            id="contactNumber"
                            placeholder="e.g. 017XXXXXXXX"
                            className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl"
                            {...register("contactNumber", { required: "Contact number is required" })}
                        />
                        {errors.contactNumber && <p className="text-red-500 text-xs pl-1">{errors.contactNumber.message}</p>}
                    </div>

                    {/* Short Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="shortDescription" className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Short Description</Label>
                        <Textarea
                            id="shortDescription"
                            placeholder="Write a clear details about your crop..."
                            rows={4}
                            className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl resize-none"
                            {...register("shortDescription", { required: "Description is required" })}
                        />
                        {errors.shortDescription && <p className="text-red-500 text-xs pl-1">{errors.shortDescription.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-bold transition-colors cursor-pointer mt-4 flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <span>Save Changes</span>
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
