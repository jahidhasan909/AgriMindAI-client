"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import ThemeToggle from './ThemeToggle';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role: string;
}


interface CustomUserData {
    _id: string;
    userId: string;
    name: string;
    email: string;
    mobileNumber: string;
    image: string;
    district: string;
    upazila: string;
    role: 'farmer' | 'buyer' | 'admin';
    status: 'active' | 'blocked' | string;
}

const Navbar: React.FC = () => {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const { data, isPending } = authClient.useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [userData, setUserData] = useState<CustomUserData | null>(null);

    const user = data?.user as User | undefined;


    useEffect(() => {
        if (user?.email && baseurl) {
            fetch(`${baseurl}/api/own/usercollaction?email=${user?.email}`)
                .then(res => res.json())
                .then(userEmail => setUserData(userEmail))
                .catch(err => console.error("Error fetching user data from DB:", err));
        }
    }, [user?.email, baseurl]);


    const activeRole = userData?.role || user?.role || 'farmer';

    if (isPending) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-950/85 backdrop-blur-sm z-[100] text-sm font-semibold text-slate-600 dark:text-zinc-400 tracking-wider">
                Loading AgriMindAI...
            </div>
        );
    }

    if (pathname.includes('dashboard') || pathname.includes('login') || pathname.includes('registration')) {
        return null;
    }

    const linkClass = (path: string): string =>
        pathname === path
            ? "text-[#76a601] font-bold transition-colors"
            : "text-slate-500 hover:text-[#76a601] dark:text-slate-300 dark:hover:text-[#76a601] font-medium transition-colors";

    return (
        <nav className="fixed top-0 z-50 w-full">
            <div className="px-4 container border border-slate-200/80 my-4 bg-white/80 dark:bg-zinc-950/60 dark:border-zinc-800 shadow-md rounded-xl backdrop-blur-md mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0 gap-1">
                        <Image
                            width={34}
                            height={33}
                            alt='logo'
                            className='object-cover h-[29px] md:h-[34px] w-auto'
                            src='https://i.ibb.co.com/RpY5p653/Screenshot-2026-07-18-at-10-35-00-PM-removebg-preview.png'
                        />
                        <span className="text-sm lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            AgriMind<span className='text-[#79a602]'>AI</span>
                        </span>
                    </Link>


                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className={linkClass('/')}>Home</Link>
                        <Link href="/marketplace" className={linkClass('/marketplace')}>Marketplace</Link>
                        <Link href="/ai-doctor" className={linkClass('/ai-doctor')}>AI Doctor</Link>
                        <Link href="/about" className={linkClass('/about')}>About</Link>
                    </div>


                    <div className="flex items-center gap-4">
                        <ThemeToggle />


                        <div className="hidden lg:flex items-center gap-4">
                            {!user ? (
                                <Link href='/login' className="group relative inline-flex overflow-hidden rounded-md p-[2px]">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#76a601_50%,#E2E8F0_100%)]"
                                    />
                                    <Button className="relative z-10 rounded-md bg-[#76a601] px-7 font-bold text-white py-4 shadow-sm transition-all hover:bg-[#2a5d04] cursor-pointer">
                                        Login
                                    </Button>
                                </Link>
                            ) : (
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="focus:outline-none flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-zinc-900 cursor-pointer rounded-xl p-1 pr-2 transition-all active:scale-95 text-slate-600 dark:text-zinc-400">
                                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700">
                                                <AvatarImage alt={userData?.name || user?.name} src={userData?.image || user?.image} />
                                                <AvatarFallback className="bg-rose-100 text-[#f05a28] dark:bg-zinc-800 dark:text-green-400 font-semibold">
                                                    {(userData?.name || user?.name)?.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-200" />
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-zinc-950 dark:border-zinc-800 z-[100]">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userData?.name || user?.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{userData?.email || user?.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800">
                                                <Link href={`/dashboard/${activeRole}`} className="w-full block">
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    await authClient.signOut();
                                                    window.location.href = '/';
                                                }}
                                                className="text-red-600 dark:text-red-400 cursor-pointer flex justify-between items-center focus:bg-red-50 dark:focus:bg-red-950/20"
                                            >
                                                <span>Log Out</span>
                                                <ArrowRight className="size-4" />
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {/* Mobile Navigation Controls */}
                        <div className="lg:hidden flex items-center gap-2">
                            {user && (
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <button className="focus:outline-none flex items-center gap-1 cursor-pointer rounded-full transition-transform active:scale-95 text-slate-600 dark:text-zinc-400">
                                            <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700">
                                                <AvatarImage alt={userData?.name || user?.name} src={userData?.image || user?.image} />
                                                <AvatarFallback className="bg-orange-200 text-[#f05a28] dark:bg-zinc-800 dark:text-orange-400 font-semibold">
                                                    {(userData?.name || user?.name)?.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-zinc-950 dark:border-zinc-800 z-[100]">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{userData?.name || user?.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{userData?.email || user?.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className="cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800">
                                                <Link href={`/dashboard/${activeRole}`} className="w-full block">
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    await authClient.signOut();
                                                    window.location.href = '/';
                                                }}
                                                className="text-red-600 dark:text-red-400 cursor-pointer flex justify-between items-center focus:bg-red-50 dark:focus:bg-red-950/20"
                                            >
                                                <span>Log Out</span>
                                                <ArrowRight className="size-4" />
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {!user && (
                                <Link href='/login' className="group relative inline-flex overflow-hidden rounded-md p-[2px]">
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#f05a28_50%,#E2E8F0_100%)]"
                                    />
                                    <Button className="relative z-10 h-8 rounded-md bg-[#f05a28] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#e04f20] cursor-pointer">
                                        Login
                                    </Button>
                                </Link>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-slate-700 dark:text-slate-200 hover:text-[#f05a28] cursor-pointer"
                            >
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu Links */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800 px-4 pt-2 pb-4 space-y-2 shadow-inner duration-200 z-50">
                    <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/marketplace"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/marketplace' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}
                    >
                        Marketplace
                    </Link>
                    <Link
                        href="/ai-doctor"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/ai-doctor' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}
                    >
                        AI Doctor
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/about' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-zinc-900'}`}
                    >
                        About
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;