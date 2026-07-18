"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

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

const Navbar: React.FC = () => {
    const { data, isPending } = authClient.useSession();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);


    const user = data?.user as User | undefined;


    const mockUserData = {
        name: user?.name || "Jahid Hasan",
        email: user?.email || "jahid@agrimind.ai",
        role: user?.role || "farmer",
        image: user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
    };

    if (isPending) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-[100] text-sm font-semibold text-slate-600 tracking-wider">
                Loading AgriMindAI...
            </div>
        );
    }

    if (pathname.includes('dashboard') || pathname.includes('login') || pathname.includes('registration')) {
        return null;
    }

    const linkClass = (path: string): string =>
        pathname === path
            ? "text-[#f05a28] font-bold transition-colors"
            : "text-slate-400 hover:text-[#f05a28] dark:text-slate-200 dark:hover:text-[#f05a28] font-medium transition-colors";

    return (
        <nav className="fixed top-0 z-50 w-full">
            <div className="px-4 container border border-slate-200/80 my-4 bg-white/60 shadow-md rounded-4xl backdrop-blur-md mx-auto sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center flex-shrink-0 gap-1">
                        <Image
                            width={34}
                            height={33}
                            alt='logo'
                            className='object-cover h-[29px] md:h-[34px] w-auto'
                            src='https://i.ibb.co.com/Q54kMTN/Chat-GPT-Image-Jul-12-2026-at-04-36-38-AM-removebg-preview.png'
                        />
                        <span className="text-sm lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            AgriMind<span className='text-[#f05a28]'>AI</span>
                        </span>
                    </Link>


                    <div className="hidden lg:flex items-center gap-8">
                        <Link href="/" className={linkClass('/')}>Home</Link>
                        <Link href="/marketplace" className={linkClass('/marketplace')}>Marketplace</Link>
                        <Link href="/ai-doctor" className={linkClass('/ai-doctor')}>AI Doctor</Link>
                        <Link href="/about" className={linkClass('/about')}>About</Link>
                    </div>


                    <div className="hidden lg:flex items-center gap-4">
                        {!user ? (
                            <Link href='/login' className="group relative inline-flex overflow-hidden rounded-2xl p-[2px]">
                                <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#f05a28_50%,#E2E8F0_100%)]"
                                />
                                <Button className="relative z-10 rounded-2xl bg-[#f05a28] px-7 font-bold text-white py-4 shadow-sm transition-all hover:bg-[#e04f20] cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                        ) : (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger>
                                    <button className="focus:outline-none cursor-pointer rounded-full transition-transform active:scale-95">
                                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700">
                                            <AvatarImage alt={mockUserData.name} src={mockUserData.image} />
                                            <AvatarFallback className="bg-rose-100 text-[#f05a28] dark:bg-zinc-800 dark:text-green-400 font-semibold">
                                                {mockUserData.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-zinc-950 dark:border-zinc-800 z-[100]">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{mockUserData.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{mockUserData.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-200">
                                            <Link href={`/dashboard/${mockUserData.role}`} className="w-full block">
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

                    {/* Mobile Navigation */}
                    <div className="lg:hidden flex items-center gap-2">
                        {user && (
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger>
                                    <button className="focus:outline-none cursor-pointer rounded-full transition-transform active:scale-95">
                                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700">
                                            <AvatarImage alt={mockUserData.name} src={mockUserData.image} />
                                            <AvatarFallback className="bg-orange-200 text-[#f05a28] dark:bg-zinc-800 dark:text-orange-400 font-semibold">
                                                {mockUserData.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-zinc-950 dark:border-zinc-800 z-[100]">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{mockUserData.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{mockUserData.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="bg-slate-100 dark:bg-zinc-800" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-200">
                                            <Link href={`/dashboard/${mockUserData.role}`} className="w-full block">
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

            {/* Mobile Dropdown Menu Links */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-slate-100 dark:border-zinc-800 px-4 pt-2 pb-4 space-y-2 shadow-inner duration-200 z-50">
                    <Link
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/marketplace"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/marketplace' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                    >
                        Marketplace
                    </Link>
                    <Link
                        href="/ai-doctor"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/ai-doctor' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                    >
                        AI Doctor
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-3 py-2.5 rounded-xl ${pathname === '/about' ? 'bg-orange-50 dark:bg-zinc-900 text-[#f05a28] font-semibold' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50'}`}
                    >
                        About
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;