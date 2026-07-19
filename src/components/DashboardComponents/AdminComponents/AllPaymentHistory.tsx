"use client";

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Calendar, User, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';

interface PaymentData {
    _id: string;
    productId: string;
    productName: string;
    buyerName: string;
    buyerEmail: string;
    transactionId: string;
    amount: number;
    status: string;
    paidAt: string;
}

interface ApiResponse {
    data: PaymentData[];
    page: number;
    totalPage: number;
}

interface AdminOrderTableProps {
    orderInfo: ApiResponse;
}

const AdminOrderTable: React.FC<AdminOrderTableProps> = ({ orderInfo }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const orders = orderInfo?.data || [];
    const currentPage = orderInfo?.page || 1;
    const totalPages = orderInfo?.totalPage || 1;

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <section className="space-y-4">
            {orders.length > 0 ? (
                <>
                    {/* Desktop View Table */}
                    <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Buyer Profile</TableHead>
                                    <TableHead>Transaction Reference</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Settled Date</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        {/* Product Details */}
                                        <TableCell className="max-w-[180px]">
                                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                                                {order.productName}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-mono truncate">
                                                PID: {order.productId}
                                            </div>
                                        </TableCell>

                                        {/* Buyer Details */}
                                        <TableCell>
                                            <div className="text-xs">
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{order.buyerName}</p>
                                                <p className="text-slate-400 dark:text-slate-500 text-[11px]">{order.buyerEmail}</p>
                                            </div>
                                        </TableCell>

                                        {/* Transaction Reference */}
                                        <TableCell className="text-xs font-mono text-slate-600 dark:text-slate-400">
                                            {order.transactionId}
                                        </TableCell>

                                        {/* Total Price */}
                                        <TableCell className="text-sm font-bold text-slate-900 dark:text-white">
                                            {order.amount} TK
                                        </TableCell>

                                        {/* Settlement Timestamp */}
                                        <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                                            {new Date(order.paidAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>

                                        {/* Status Tag */}
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 capitalize">
                                                <CheckCircle className="h-3 w-3" />
                                                {order.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Responsive Mobile Layout */}
                    <div className="block sm:hidden space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-[180px]">
                                            {order.productName}
                                        </h3>
                                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">ID: {order.transactionId}</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md border border-green-100 dark:border-green-900/40">
                                        {order.amount} TK
                                    </span>
                                </div>

                                <div className="space-y-2 pt-2 text-xs border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Buyer: {order.buyerName} ({order.buyerEmail})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>Date: {new Date(order.paidAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Payment Process</span>
                                    <span className="text-emerald-600 font-bold capitalize flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" /> {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Server-Driven Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
                            <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                    <Button
                                        key={pageNumber}
                                        variant={pageNumber === currentPage ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 w-8 text-xs ${pageNumber === currentPage ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center gap-3">
                     <DollarSign className="h-8 w-8 text-slate-300" />
                     <p>No billing or transaction histories logged on the platform database.</p>
                </div>
            )}
        </section>
    );
};

export default AdminOrderTable;