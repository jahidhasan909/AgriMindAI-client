"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { UploadImagebb } from "@/lib/action/UploadImgbb";
import { Check, Loader2, Sparkles } from "lucide-react";

interface District {
    id: string;
    name: string;
    bn_name: string;
}

interface Upazila {
    id: string;
    district_id: string;
    name: string;
    bn_name: string;
}

interface ProductFormData {
    productName: string;
    category: string;
    pricePerKg: number;
    availability: string;
    contactNumber: string;
    district: string;
    upazila: string;
    harvestDate: string;
    shortDescription: string;
    images: FileList;
}

export default function CreateProductPost() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [aiLoading, setAiLoading] = useState<boolean>(false);

    const [districts, setDistricts] = useState<District[]>([]);
    const [upazilas, setUpazilas] = useState<Upazila[]>([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState<Upazila[]>([]);

    const { data: userData, isPending } = authClient.useSession();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm<ProductFormData>({
        defaultValues: {
            productName: "",
            category: "",
            pricePerKg: 0,
            availability: "Available",
            contactNumber: "",
            district: "",
            upazila: "",
            harvestDate: new Date().toISOString().split("T")[0],
            shortDescription: "",
        }
    });

    const selectedDistrict = watch("district");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [districtRes, upazilaRes] = await Promise.all([
                    fetch("/districts.json"),
                    fetch("/upazilas.json"),
                ]);

                const districtData = await districtRes.json();
                const upazilaData = await upazilaRes.json();

                setDistricts(districtData?.[2]?.data || []);
                setUpazilas(upazilaData?.[2]?.data || []);
            } catch (error) {
                toast.error("Failed to load location data");
            }
        };

        loadData();
    }, []);

    const handleDistrictChange = (districtName: string) => {
        setValue("district", districtName);
        setValue("upazila", "");

        const selectedDist = districts.find(d => d.name === districtName || d.bn_name === districtName);

        if (selectedDist) {
            const filtered = upazilas.filter(u => u.district_id === selectedDist.id);
            setFilteredUpazilas(filtered);
        } else {
            setFilteredUpazilas([]);
        }
    };

    if (isPending) {
        return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 text-slate-500">Loading session...</div>;
    }

    const user = userData?.user;

    if (!user) {
        return <div className="text-center py-20 text-slate-500 font-medium">Please log in as a farmer to post products.</div>;
    }

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

    const handleAIFill = async () => {
        const productName = (document.getElementById('productName') as HTMLInputElement)?.value?.trim();
        if (!productName || productName.length < 2) {
            toast.error('Please enter a product name first.');
            return;
        }

        setAiLoading(true);
        const targetUrl = `${baseurl}/api/ai/generate-product`;
        console.log('Initiating AI auto-fill request to:', targetUrl, 'with productName:', productName);

        try {
            const res = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productName }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'AI request failed');

            console.log('AI auto-fill response received:', data);

            setValue('shortDescription', data.shortDescription, { shouldValidate: true });
            setValue('pricePerKg', Number(data.pricePerKg), { shouldValidate: true });
            setValue('category', data.category, { shouldValidate: true });

            toast.success('✨ AI auto-filled the product details!');
        } catch (err: any) {
            console.error('AI Auto-Fill client error full stack trace:', err);
            toast.error(err.message || 'Failed to get AI suggestions.');
        } finally {
            setAiLoading(false);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        if (!data.images || data.images.length !== 3) {
            toast.error("You must upload exactly 3 images!");
            return;
        }

        try {
            setIsLoading(true);

            const uploadPromises = Array.from(data.images).map((file) => UploadImagebb(file));
            const uploadedImagesRes = await Promise.all(uploadPromises);
            const imageUrls = uploadedImagesRes.map((img) => img?.url).filter(Boolean);

            if (imageUrls.length !== 3) {
                toast.error("Failed to upload all 3 images. Please try again.");
                return;
            }

            const productPayload = {
                productName: data.productName,
                category: data.category,
                pricePerKg: Number(data.pricePerKg),
                availability: data.availability,
                contactNumber: data.contactNumber,
                location: {
                    district: data.district,
                    upazila: data.upazila
                },
                harvestDate: data.harvestDate,
                shortDescription: data.shortDescription,
                images: imageUrls,
                farmerId: user.id,
                farmerName: user.name,
                farmerEmail: user.email,
                farmerImage: user.image,
                createdAt: new Date(),
            };

            const res = await fetch(`${baseurl}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productPayload),
            });

            const result = await res.json();

            if (res.ok) {
                toast.success("Product posted successfully!");
                reset();
                setFilteredUpazilas([]);
            } else {
                toast.error(result?.message || "Failed to post product");
            }
        } catch (error) {
            console.error("Submission error", error);
            toast.error("Something went wrong during submission");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dark:bg-slate-950 min-h-screen py-12 px-4 transition-colors duration-300">
            <div className="relative max-w-3xl mx-auto">
                <div className="relative overflow-hidden z-10 w-full rounded-[2rem] bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-sm border border-slate-200/60 dark:border-slate-800/80">

                    <div
                        className="absolute inset-0 -z-10 bg-cover bg-center opacity-[0.04] dark:opacity-[0.02] pointer-events-none mix-blend-overlay w-full rounded-[2rem]"
                        style={{
                            backgroundImage: "url('https://i.ibb.co.com/JjtCjy4m/Screenshot-2026-06-19-at-11-15-06-PM.png')"
                        }}
                    />

                    <div className="mb-8 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Post New Farmer Product
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                            Fill up the details below to list your fresh agricultural products for buyers.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        {/* Farmer Info */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/40">
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Farmer Name</Label>
                                <Input value={user?.name || ""} disabled className="cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/40 rounded-xl" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Farmer Email</Label>
                                <Input value={user?.email || ""} disabled className="cursor-not-allowed bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200/40 dark:border-slate-800/40 rounded-xl" />
                            </div>
                        </div>

                        {/* Product Name & Category */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="productName" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Product Name</Label>
                                <Input
                                    id="productName"
                                    placeholder="e.g., Mango, Tomato"
                                    className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] transition-all ${errors.productName ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                        }`}
                                    {...register("productName", { required: "Product name is required" })}
                                />
                                {errors.productName && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.productName.message}</span>}

                                {/* AI Auto-Fill Button */}
                                <button
                                    type="button"
                                    onClick={handleAIFill}
                                    disabled={aiLoading}
                                    className="mt-1 flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-dashed border-violet-400 dark:border-violet-600 bg-violet-50/60 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-bold tracking-wide hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {aiLoading ? (
                                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating.....</>
                                    ) : (
                                        <><Sparkles className="w-3.5 h-3.5" /> ✨ AI Auto-Fill Details</>
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="category" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Category</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="category"
                                            className={`w-full h-10.5 bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] transition-all cursor-pointer ${errors.category ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                                }`}
                                        >
                                            <option value="" className="bg-white dark:bg-slate-900">Select category</option>
                                            <option value="Fruits" className="bg-white dark:bg-slate-900">Fruits (ফলফলাদি)</option>
                                            <option value="Vegetables" className="bg-white dark:bg-slate-900">Vegetables (শাকসবজি)</option>
                                            <option value="Grains" className="bg-white dark:bg-slate-900">Grains &amp; Crops</option>
                                            <option value="Herbs" className="bg-white dark:bg-slate-900">Herbs (ভেষজ)</option>
                                            <option value="Others" className="bg-white dark:bg-slate-900">Others</option>
                                        </select>
                                    )}
                                />
                                {errors.category && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.category.message}</span>}
                            </div>
                        </div>

                        {/* Price per KG & Availability */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="pricePerKg" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Price (per KG ৳)</Label>
                                <Input
                                    id="pricePerKg"
                                    type="number"
                                    placeholder="Enter price per kg"
                                    className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] transition-all ${errors.pricePerKg ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                        }`}
                                    {...register("pricePerKg", { required: "Price is required", min: { value: 1, message: "Price must be greater than 0" } })}
                                />
                                {errors.pricePerKg && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.pricePerKg.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="availability" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Availability Status</Label>
                                <Controller
                                    name="availability"
                                    control={control}
                                    rules={{ required: "Status is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="availability"
                                            className="w-full h-10.5 bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] transition-all cursor-pointer border-slate-200/60 dark:border-slate-700/50"
                                        >
                                            <option value="Available" className="bg-white dark:bg-slate-900">Available</option>
                                            <option value="Stock Out" className="bg-white dark:bg-slate-900">Stock Out</option>
                                            <option value="Upcoming Harvest" className="bg-white dark:bg-slate-900">Upcoming Harvest</option>
                                        </select>
                                    )}
                                />
                            </div>
                        </div>

                        {/* District & Upazila Selection from JSON */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="district" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">District (জেলা)</Label>
                                <Controller
                                    name="district"
                                    control={control}
                                    rules={{ required: "District is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="district"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleDistrictChange(e.target.value);
                                            }}
                                            className={`w-full h-10.5 bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] transition-all cursor-pointer ${errors.district ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                                }`}
                                        >
                                            <option value="" className="bg-white dark:bg-slate-900">Select District</option>
                                            {districts.map((dist) => (
                                                <option key={dist.id} value={dist.name} className="bg-white dark:bg-slate-900">
                                                    {dist.name} ({dist.bn_name})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.district && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.district.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="upazila" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Upazila (উপজেলা)</Label>
                                <Controller
                                    name="upazila"
                                    control={control}
                                    rules={{ required: "Upazila is required" }}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            id="upazila"
                                            disabled={!selectedDistrict}
                                            className={`w-full h-10.5 bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 outline-none focus:border-[#f05a28] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${errors.upazila ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                                }`}
                                        >
                                            <option value="" className="bg-white dark:bg-slate-900">Select Upazila</option>
                                            {filteredUpazilas.map((upazila) => (
                                                <option key={upazila.id} value={upazila.name} className="bg-white dark:bg-slate-900">
                                                    {upazila.name} ({upazila.bn_name})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                />
                                {errors.upazila && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.upazila.message}</span>}
                            </div>
                        </div>

                        {/* Contact Information & Date */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="contactNumber" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Contact Information (Phone)</Label>
                                <Input
                                    id="contactNumber"
                                    type="text"
                                    placeholder="Enter your contact number"
                                    className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] transition-all ${errors.contactNumber ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                        }`}
                                    {...register("contactNumber", { required: "Contact number is required" })}
                                />
                                {errors.contactNumber && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.contactNumber.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="harvestDate" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">Harvest / Collection Date</Label>
                                <Input
                                    id="harvestDate"
                                    type="date"
                                    className="w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-850 dark:text-white text-xs font-medium rounded-xl px-4 py-4.5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] transition-all border-slate-200/60 dark:border-slate-700/50"
                                    {...register("harvestDate", { required: "Date is required" })}
                                />
                                {errors.harvestDate && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.harvestDate.message}</span>}
                            </div>
                        </div>

                        {/* Images Upload */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="images" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                Product Showcase Images (Exactly 3 files required)
                            </Label>
                            <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-2.5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] transition-all cursor-pointer file:text-xs file:font-bold file:text-[#f05a28] file:bg-[#f05a28]/10 file:rounded-lg file:border-none file:px-3 file:py-1 file:mr-3 ${errors.images ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                    }`}
                                {...register("images", {
                                    required: "You must attach product images",
                                    validate: (files) => files.length === 3 || "You must select exactly 3 images"
                                })}
                            />
                            {errors.images ? (
                                <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.images.message}</span>
                            ) : (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium pl-1 mt-1">Hold Ctrl (or Cmd) to select exactly 3 product photos.</span>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="shortDescription" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                Short Description
                            </Label>
                            <Textarea
                                {...register("shortDescription", { required: "Short description is required" })}
                                id="shortDescription"
                                rows={3}
                                placeholder="Write something about your fresh products (origin, taste, quality)..."
                                className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl p-4 outline-none focus-visible:ring-0 focus:border-[#f05a28] transition-all resize-none ${errors.shortDescription ? "border-red-500" : "border-slate-200/60 dark:border-slate-700/50"
                                    }`}
                            />
                            {errors.shortDescription && <span className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.shortDescription.message}</span>}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4 flex w-full relative overflow-hidden rounded-xl p-[1px]">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#f05a28_50%,#E2E8F0_100%)]"
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative overflow-hidden h-12 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-[#f05a28] font-bold shadow-md rounded-xl disabled:opacity-75 transition-all flex items-center justify-center border-none hover:cursor-pointer"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Posting Product...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Post Product Item
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}