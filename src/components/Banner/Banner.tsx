import React from "react";
import { Button } from "../ui/button";
import { Sparkles, ArrowRight, Store } from "lucide-react";
import Link from "next/link";

const Banner = () => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Video */}
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-1000"
            >
                <source
                    src="https://res.cloudinary.com/f7ajpgib/video/upload/f_auto,q_auto,w_1280/Screen_Recording_2026-07-20_at_9.32.53_AM_sjcvex.mp4"
                    type="video/mp4"
                />
            </video>

            {/* Modern Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/30" />
            
            {/* Subtle Grid Accent Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-12">
                
                {/* AI Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime-400 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-black/20 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-lime-400 animate-pulse" />
                    <span>Next-Gen Agricultural Intelligence</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.15]">
                    Smarter Farming Starts with{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-400 via-emerald-300 to-teal-200">
                        AgriMind AI
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-normal">
                    Get AI-powered farming advice, diagnose crop issues instantly, and sell your harvest directly to trusted buyers—all in one intelligent ecosystem.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
                    <Link href={'/registration'}><Button className="w-full sm:w-auto h-12 px-7 bg-lime-500 hover:bg-lime-600 text-slate-950 font-bold text-base rounded-xl transition-all duration-300 shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 hover:cursor-pointer">
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </Button></Link>

                  <Link href={'/marketplace'}>
                    <Button 
                        variant="outline" 
                        className="w-full sm:w-auto h-12 px-7 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md font-semibold text-base rounded-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 hover:cursor-pointer"
                    >
                        <Store className="w-4 h-4 text-lime-400" />
                        Explore Marketplace
                    </Button></Link>
                </div>

                {/* Bottom Trust Stats Preview (Optional Glass Strip) */}
                <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
                    <div>
                        <p className="text-2xl font-bold text-white">98%</p>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">AI Diagnostic Accuracy</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">24/7</p>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">Real-time Advisory</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-2xl font-bold text-white">Direct</p>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">Buyer Connections</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Banner;