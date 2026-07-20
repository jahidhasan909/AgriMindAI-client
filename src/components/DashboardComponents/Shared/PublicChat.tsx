"use client";

import React, { useEffect, useState, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ChatMessage {
    _id?: string;
    text: string;
    senderId: string;
    senderName: string;
    senderEmail: string;
    senderImage: string;
    role?: string;
    createdAt: string;
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

export default function PublicChatBox() {
    const { data: userData } = authClient.useSession();
    const user = userData?.user;
    const [dbUser, setDbUser] = useState<CustomUserData | null>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const fetchChats = async () => {
        try {
            const res = await fetch(`${baseurl}/api/publicchat`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setIsLoadingChats(false);
        }
    };

    useEffect(() => {
        fetchChats();

        const interval = setInterval(fetchChats, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (user?.email && baseurl) {
            fetch(`${baseurl}/api/own/usercollaction?email=${user.email}`)
                .then((res) => res.json())
                .then((data) => setDbUser(data))
                .catch((err) => console.error("Error fetching db user data:", err));
        }
    }, [user?.email, baseurl]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!user) {
            toast.error("Please login to participate in the public chat");
            return;
        }

        const chatPayload = {
            text: newMessage,
            senderId: user.id,
            senderName: user.name,
            senderEmail: user.email,
            senderImage: user.image || "https://i.ibb.co.com/placeholder.png",
            role: dbUser?.role || "user",
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, chatPayload as ChatMessage]);
        setNewMessage("");

        try {
            setIsSending(true);
            const res = await fetch(`${baseurl}/api/publicchat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chatPayload),
            });

            if (!res.ok) {
                toast.error("Failed to send message");
                fetchChats();
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Something went wrong");
            fetchChats();
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[550px] w-full max-w-2xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-md overflow-hidden">

            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#79a603] animate-pulse"></span>
                        Public Community Chat
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Everyone can read and reply</p>
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {isLoadingChats ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                        <Loader2 className="h-6 w-6 animate-spin text-[#79a603]" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs font-medium text-slate-400 dark:text-slate-500">
                        No messages yet. Say hello!
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user?.id;
                        const isAdmin = msg.role === "admin";

                        return (
                            <div key={index} className={`flex gap-2.5 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}>

                                <img
                                    src={msg.senderImage}
                                    alt={msg.senderName}
                                    className="h-7 w-7 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                                />

                                <div className={`flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"}`}>
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 px-1">
                                        {msg.senderName} {isAdmin && <span className="text-[9px] text-red-500 font-extrabold ml-1 uppercase bg-red-500/10 px-1 rounded">Admin</span>}
                                    </span>

                                    <div className={`text-xs px-3.5 py-2 rounded-2xl break-all font-medium ${isMe
                                            ? "bg-[#79a603] text-white rounded-tr-none shadow-xs"
                                            : isAdmin
                                                ? "bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-tl-none font-semibold"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={user ? "Type a message..." : "Please login to chat"}
                    disabled={!user || isSending}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-white text-xs font-medium rounded-xl px-4 py-3 outline-none focus:border-[#79a603] dark:focus:border-[#79a603] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending || !user}
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#79a603] text-white hover:bg-[#688f02] transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:cursor-pointer shadow-sm"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    );
}