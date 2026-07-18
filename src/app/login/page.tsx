"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from 'framer-motion';
import { Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface LoginFormData {
    email: string;
    password: string;
}

export default function AgrimindLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        const userData = {
            email: data.email,
            password: data.password,
        };

        try {
            const { data: resdata, error } = await authClient.signIn.email({
                ...userData,
            });

            if (resdata) {
                toast.success('Welcome back! Let\'s optimize your harvest.');
                router.push('/');
            }

            if (error) {
                toast.error(error?.message || "Something went wrong");
            }
        } catch (err) {
            toast.error("An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 font-sans">

            {/* Left Side: Image Banner with Structured Overlay Text */}
            <div className="relative hidden md:block md:w-1/2 lg:w-3/5">
                <Image
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad451?q=80&w=1200&auto=format&fit=crop" // Placeholder: High-tech smart agriculture field
                    alt="AgrimindAI Banner"
                    fill
                    priority
                    unoptimized
                    className="object-cover"
                />

                {/* Visual Gradient Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-950/50" />

                {/* Overlay Contents */}
                <div className="absolute inset-0 flex flex-col justify-between p-12 lg:p-16 text-white z-10">

                    <div className="flex items-center gap-2">
                        <span className="text-sm lg:text-2xl font-bold dark:text-white tracking-tight">
                            Agrimind<span className='text-[#f05a28]'>AI</span>
                        </span>
                    </div>

                    <div className="space-y-4 max-w-lg">
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            Intelligence Driven <span className="text-[#f05a28]">Agriculture</span>
                        </h2>
                        <p className="text-sm lg:text-base font-medium text-slate-200/90 leading-relaxed">
                            Monitor soil vitals, diagnose crop diseases instantly with computer vision, and leverage predictive analytics to scale your farm's productivity.
                        </p>
                    </div>

                    {/* Footer note in Left Banner */}
                    <p className="text-xs font-medium text-slate-400">
                        © {new Date().getFullYear()} AgrimindAI. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex w-full md:w-1/2 lg:w-2/5 flex-col justify-center items-center p-6 sm:p-10 lg:p-16">

                <div className="relative w-full max-w-md">

                    <div className="absolute inset-0 bg-[#f05a28]/10 dark:bg-slate-900/40 border border-[#f05a28]/10 dark:border-slate-800 rounded-[2.5rem] translate-y-3.5 translate-x-2.5 -z-10" />

                    <Card className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-[2.5rem] p-6 sm:p-10 shadow-sm transition-all">
                        <CardContent className="p-0 space-y-8">

                            <div className="text-center space-y-2">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                    Welcome Back!
                                </h1>
                                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Sign in to your dashboard to manage crops and analytics.
                                </p>
                            </div>

                            {/* Form */}
                            <form
                                className="space-y-5"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                {/* Email Field */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <Label htmlFor="email" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="farmer@agrimind.ai"
                                        className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all ${errors.email ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'
                                            }`}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Please enter a valid email address"
                                            }
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-xs font-medium text-red-500 pl-1 mt-0.5">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="flex flex-col gap-1.5 w-full">
                                    <Label htmlFor="password" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        className={`w-full bg-slate-50/50 dark:bg-slate-800/60 border text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-5 outline-none focus-visible:ring-0 focus-visible:border-[#f05a28] dark:focus-visible:border-[#f05a28] transition-all ${errors.password ? 'border-red-500' : 'border-slate-200/60 dark:border-slate-700/50'
                                            }`}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Password must be at least 8 characters" }
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-xs font-medium text-red-500 pl-1 mt-0.5">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Animated Glowing Conic Border Button */}
                                <div className="relative block p-[1px] rounded-xl overflow-hidden mt-6">
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
                                            <Loader2 className="h-4 w-4 animate-spin text-[#f05a28]" />
                                        ) : (
                                            <>
                                                <LogIn className="w-4.5 h-4.5 mr-2" /> Log In
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Footer Redirection Link */}
                                <div className="mt-4 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                                    {"Don't have an account?"}{" "}
                                    <Link href="/registration" className="font-bold text-[#f05a28] hover:underline ml-1">
                                        Register Now
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