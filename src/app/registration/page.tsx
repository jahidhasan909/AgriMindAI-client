"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import { Loader2, UserPlus, Sprout } from "lucide-react";
import { UploadImagebb } from "@/lib/action/UploadImgbb";

interface RegistrationFormData {
    fullName: string;
    email: string;
    mobileNumber: string;
    image?: FileList;
    district: string;
    upazila: string;
    role: "farmer" | "buyer";
    password: string;
    confirmPassword: string;
}

interface District {
    id: string;
    division_id: string;
    name: string;
}

interface Upazila {
    id: string;
    district_id: string;
    name: string;
}

export default function RegistrationForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<RegistrationFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            mobileNumber: "",
            image: undefined,
            district: "",
            upazila: "",
            role: "farmer",
            password: "",
            confirmPassword: "",
        }
    });

    const selectedDistrict = watch("district");

    const [districts, setDistricts] = useState<District[]>([]);
    const [upazilas, setUpazilas] = useState<Upazila[]>([]);

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

    const filteredUpazilas = upazilas.filter(
        (u) => u.district_id === selectedDistrict
    );

    const baseurl = process.env.NEXT_PUBLIC_BASE_URL;

    const onSubmit = async (data: RegistrationFormData) => {
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {
            const districtName = districts.find((d) => d.id === data.district)?.name || "";
            const upazilaName = upazilas.find((u) => u.id === data.upazila)?.name || "";

            let imageUrl = "";
            if (data.image && data.image.length > 0) {
                const imageFile = data.image[0];
                const imageUploadRes = await UploadImagebb(imageFile);
                imageUrl = imageUploadRes.url;
            }

            const { data: resdata, error } = await authClient.signUp.email({
                name: data.fullName,
                email: data.email,
                password: data.password,
                image: imageUrl || undefined,
            });

            if (error) {
                toast.error(error.message || "Something went wrong during sign up");
                return;
            }

            if (resdata?.user?.id) {
                await fetch(`${baseurl}/api/usercollaction`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: resdata.user.id,
                        name: data.fullName,
                        email: data.email,
                        mobileNumber: data.mobileNumber,
                        image: imageUrl,
                        district: districtName,
                        upazila: upazilaName,
                        role: data.role,
                        status: "active",
                    }),
                });

                toast.success("Verification complete. Welcome!");
                router.push("/login");
            }
        } catch (err) {
            toast.error("An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 font-sans">

            {/* Left Side: Brand Color Banner */}
            <div className="relative hidden md:flex md:w-1/2 lg:w-3/5 bg-[#79a603] flex-col justify-between p-12 lg:p-16 text-white overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                        <Sprout className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl lg:text-3xl font-black tracking-tight text-white">
                        Agrimind<span className="text-slate-900">AI</span>
                    </span>
                </div>

                <div className="relative z-10 space-y-4 max-w-lg">
                    <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                        Together, We Can Build a Better <span className="text-slate-900">Agriculture</span>
                    </h2>
                    <p className="text-sm lg:text-base font-medium text-white/90 leading-relaxed">
                        Every new member strengthens our mission to create smarter farming, sustainable trading, and stronger agricultural ecosystem.
                    </p>
                </div>

                <p className="relative z-10 text-xs font-medium text-white/70">
                    © {new Date().getFullYear()} AgrimindAI. All rights reserved.
                </p>
            </div>

            {/* Right Side: Form Container */}
            <div className="flex w-full md:w-1/2 lg:w-2/5 flex-col justify-center items-center p-4 sm:p-8 lg:p-10 my-6">
                <div className="relative w-full max-w-xl">
                    <div className="absolute inset-0 bg-[#79a603]/10 dark:bg-slate-900/40 border border-[#79a603]/10 dark:border-slate-800 rounded-[2.5rem] translate-y-3.5 translate-x-2.5 -z-10" />

                    <Card className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2.5rem] p-5 sm:p-8 shadow-sm transition-all">
                        <CardContent className="p-0 space-y-6">

                            <div className="text-center space-y-1">
                                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Join the Community
                                </h1>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Create your account to connect and access AI insights.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">

                                {/* Full Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="fullName" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="John Doe"
                                            className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-4.5 outline-none focus-visible:ring-0 focus-visible:border-[#79a603] transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'}`}
                                            {...register("fullName", { required: true })}
                                        />
                                        {errors.fullName && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Name is required</p>}
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="user@example.com"
                                            className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-4.5 outline-none focus-visible:ring-0 focus-visible:border-[#79a603] transition-all ${errors.email ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'}`}
                                            {...register("email", {
                                                required: true,
                                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                            })}
                                        />
                                        {errors.email && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Valid email is required</p>}
                                    </div>
                                </div>

                                {/* Mobile Number & Role */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="mobileNumber" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Mobile Number
                                        </Label>
                                        <Input
                                            id="mobileNumber"
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-4.5 outline-none focus-visible:ring-0 focus-visible:border-[#79a603] transition-all ${errors.mobileNumber ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'}`}
                                            {...register("mobileNumber", { required: true, pattern: /^(?:\+88|88)?(01[3-9]\d{8})$/ })}
                                        />
                                        {errors.mobileNumber && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Valid BD number required</p>}
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="role" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Role
                                        </Label>
                                        <Controller
                                            name="role"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    id="role"
                                                    className="flex h-10 w-full bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-slate-300 text-xs font-semibold rounded-xl px-3 outline-none focus:border-[#79a603] transition-all cursor-pointer"
                                                >
                                                    <option value="farmer" className="dark:bg-slate-900">Farmer</option>
                                                    <option value="buyer" className="dark:bg-slate-900">Buyer</option>
                                                </select>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Profile Image (Optional) */}
                                <div className="flex flex-col gap-1 w-full">
                                    <Label htmlFor="image" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                        Profile Image <span className="text-slate-400 font-normal lowercase">(optional)</span>
                                    </Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="w-full cursor-pointer bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-2 border-slate-200/60 dark:border-slate-700/50 focus-visible:ring-0 focus-visible:border-[#79a603]"
                                        {...register("image")}
                                    />
                                </div>

                                {/* Location fields (District & Upazila grid) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="district" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            District
                                        </Label>
                                        <Controller
                                            name="district"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    id="district"
                                                    className="flex h-10 w-full bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-slate-300 text-xs font-semibold rounded-xl px-2 outline-none focus:border-[#79a603] transition-all cursor-pointer"
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value);
                                                        setValue("upazila", "");
                                                    }}
                                                >
                                                    <option value="" className="dark:bg-slate-900">Select District</option>
                                                    {districts.map((dist) => (
                                                        <option key={dist.id} value={dist.id} className="dark:bg-slate-900">{dist.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.district && <p className="text-[10px] font-semibold text-red-500 pl-1">Required</p>}
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="upazila" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Upazila
                                        </Label>
                                        <Controller
                                            name="upazila"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    id="upazila"
                                                    disabled={!selectedDistrict}
                                                    className="flex h-10 w-full bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-slate-300 text-xs font-semibold rounded-xl px-2 outline-none focus:border-[#79a603] transition-all disabled:opacity-50 cursor-pointer"
                                                >
                                                    <option value="" className="dark:bg-slate-900">Select Upazila</option>
                                                    {filteredUpazilas.map((u) => (
                                                        <option key={u.id} value={u.id} className="dark:bg-slate-900">{u.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.upazila && <p className="text-[10px] font-semibold text-red-500 pl-1">Required</p>}
                                    </div>
                                </div>

                                {/* Password & Confirm Password */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="password" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Min 8 characters"
                                            className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-4.5 outline-none focus-visible:ring-0 focus-visible:border-[#79a603] transition-all ${errors.password ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'}`}
                                            {...register("password", { required: true, minLength: 8 })}
                                        />
                                        {errors.password && <p className="text-[10px] font-semibold text-red-500 pl-1 mt-0.5">Min 8 characters required</p>}
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <Label htmlFor="confirmPassword" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm password"
                                            className="w-full bg-slate-50/50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-4.5 outline-none focus-visible:ring-0 focus-visible:border-[#79a603] transition-all"
                                            {...register("confirmPassword", { required: true })}
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="relative block p-[1px] rounded-xl overflow-hidden mt-2">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#79a603_50%,#E2E8F0_100%)]"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full relative overflow-hidden h-11 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-[#79a603] font-bold shadow-md rounded-xl disabled:opacity-75 transition-all flex items-center justify-center border-none hover:cursor-pointer"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-[#79a603]" />
                                        ) : (
                                            <>
                                                <UserPlus className="w-4.5 h-4.5 mr-2" /> Create Account
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Link to Login Page */}
                                <div className="mt-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                                    Already have an account?{" "}
                                    <Link href="/login" className="font-bold text-[#79a603] hover:underline ml-1">
                                        Log In
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}