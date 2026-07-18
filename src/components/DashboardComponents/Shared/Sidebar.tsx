'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
    Home,
    User,
    PlusCircle,
    Users,
    Menu,
    LogOut,
    LucideIcon,
    History,
    MessageSquare,
    ShoppingBag,
    Boxes
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

// User Roles mapping
type UserRole = 'farmer' | 'buyer' | 'admin';

interface NavItem {
    icon: LucideIcon;
    label: string;
    link: string;
}

interface CustomUserData {
    role: string;
    email: string;
}

export default function DashboardSidebar() {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
    const router = useRouter();
    const pathname = usePathname();
    const { data, isPending } = authClient.useSession();
    const [userData, setUserData] = useState<CustomUserData | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

    const user = data?.user;



    useEffect(() => {
        if (user?.email && baseurl) {
            fetch(`${baseurl}/api/own/usercollaction?email=${user.email}`)
                .then(res => res.json())
                .then(data => setUserData(data))
                .catch(err => console.error("Error fetching user data:", err));
        }
    }, [user?.email, baseurl]);

    const role = (userData?.role as UserRole) || 'farmer';

    const handleLogout = async (): Promise<void> => {
        await authClient.signOut();
        router.push('/');
    };

    if (isPending) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-zinc-950 text-sm font-semibold text-slate-500">
                Loading Dashboard...
            </div>
        );
    }


    const dashboardItems: Record<UserRole, NavItem[]> = {
        farmer: [
            { icon: Home, label: "Dashboard", link: "/dashboard/farmer" },
            { icon: PlusCircle, label: "Add Products", link: "/dashboard/farmer/addproducts" },
            { icon: History, label: "Sales History", link: "/dashboard/farmer/saleshistory" },
            { icon: MessageSquare, label: "Chat Public", link: "/dashboard/farmer/chatpublic" },
            { icon: User, label: "Profile", link: "/dashboard/farmer/profile" },
        ],
        buyer: [
            { icon: Home, label: "Dashboard", link: "/dashboard/buyer" },
            { icon: ShoppingBag, label: "Orders History", link: "/dashboard/buyer/orderhistory" },
            { icon: MessageSquare, label: "Chat Public", link: "/dashboard/buyer/chatpublic" },
            { icon: User, label: "Profile", link: "/dashboard/buyer/profile" },
        ],
        admin: [
            { icon: Home, label: "Dashboard", link: "/dashboard/admin" },
            { icon: Users, label: "Users Manage", link: "/dashboard/admin/usersmanage" },
            { icon: Boxes, label: "Products History", link: "/dashboard/admin/productshistory" },
            { icon: ShoppingBag, label: "Orders History", link: "/dashboard/admin/ordershistory" },
            { icon: MessageSquare, label: "Chat Public", link: "/dashboard/admin/chatpublic" },
            { icon: User, label: "Profile", link: "/dashboard/admin/profile" },
        ],
    };

    const navItems: NavItem[] = dashboardItems[role] || dashboardItems['farmer'];

    return (
        <div className="flex">
            {/* Mobile Responsive Drawer */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl shadow-sm cursor-pointer">
                            <Menu className="w-5 h-5 text-slate-800 dark:text-slate-200" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[260px] p-6 bg-white dark:bg-zinc-950 dark:border-zinc-800 flex flex-col gap-6">
                        <SheetHeader className="px-2 text-left">
                            <SheetTitle>
                                <Link href="/" className="flex items-center flex-shrink-0 gap-1">
                                    <Image
                                        width={34}
                                        height={33}
                                        alt='logo'
                                        className='object-cover h-[29px] w-auto'
                                        src='https://i.ibb.co.com/RpY5p653/Screenshot-2026-07-18-at-10-35-00-PM-removebg-preview.png'
                                    />
                                    <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                                        Agrimind<span className='text-[#79a602]'>AI</span>
                                    </span>
                                </Link>
                            </SheetTitle>
                        </SheetHeader>

                        <nav className="flex flex-col gap-1 w-full mt-4">
                            {navItems.map((item) => {
                                const isActive = pathname === item.link;
                                return (
                                    <Link
                                        key={item.label}
                                        onClick={() => setIsSheetOpen(false)}
                                        href={item.link}
                                        className={`block rounded-xl w-full transition-all ${isActive
                                            ? "bg-[#79a602] font-semibold text-white py-2 px-3 flex items-center gap-2 shadow-sm"
                                            : "flex gap-2 items-center px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl"
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar Layout */}
            <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800 p-6 sticky top-0 h-screen">
                <div className="flex-shrink-0 mb-7 mt-1.5">
                    <Link href="/" className="flex items-center flex-shrink-0 gap-1">
                        <Image
                            width={34}
                            height={33}
                            alt='logo'
                            className='object-cover h-[32px] w-auto'
                            src='https://i.ibb.co.com/RpY5p653/Screenshot-2026-07-18-at-10-35-00-PM-removebg-preview.png'
                        />
                        <span className="text-base lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Agrimind<span className='text-[#79a602]'>AI</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex flex-col flex-grow gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.link;
                        return (
                            <Link
                                key={item.label}
                                href={item.link}
                                className={`block rounded-xl w-full transition-all ${isActive
                                    ? "bg-[#79a602] font-semibold text-white py-2 px-3 flex items-center gap-2 shadow-sm"
                                    : "flex gap-2 items-center px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                                    }`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        );
                    })}

                    <div className="grow" />

                    {/* Active User Credentials Block */}
                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 flex gap-2.5 w-full mx-auto mb-2 items-center">
                        <Avatar className="h-9 w-9 border border-slate-200 dark:border-zinc-700">
                            <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
                            <AvatarFallback className="bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200 text-xs font-bold">
                                {user?.name?.slice(0, 2).toUpperCase() || "AM"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden leading-tight">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user?.email}</p>
                        </div>
                    </div>

                    {/* Logout Button Component */}
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className='bg-[#fcfcfc]  hover:bg-rose-200 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 text-[#db0000] dark:text-rose-400 font-semibold w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 shadow-none h-10 cursor-pointer transition-colors'
                    >
                        Log Out <LogOut className="w-4 h-4" />
                    </Button>
                </nav>
            </aside>
        </div>
    );
}