"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, CreditCard, Calendar, User } from 'lucide-react';

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

interface SalesHistoryTableProps {
    sales: PaymentData[];
}

const SalesHistoryTable: React.FC<SalesHistoryTableProps> = ({ sales }) => {
    return (
        <section className="space-y-4">
            {sales.length > 0 ? (
                <>
                    {/* Desktop View Table */}
                    <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Buyer Details</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Amount Paid</TableHead>
                                    <TableHead>Payment Date</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales.map((payment) => (
                                    <TableRow key={payment._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        {/* Product Name */}
                                        <TableCell className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">
                                            {payment.productName}
                                        </TableCell>
                                        
                                        {/* Buyer Info */}
                                        <TableCell>
                                            <div className="text-sm">
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{payment.buyerName}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500">{payment.buyerEmail}</p>
                                            </div>
                                        </TableCell>
                                        
                                        {/* Transaction ID */}
                                        <TableCell className="text-xs font-mono text-slate-600 dark:text-slate-400">
                                            {payment.transactionId}
                                        </TableCell>
                                        
                                        {/* Amount */}
                                        <TableCell className="text-sm font-bold text-green-600 dark:text-green-400">
                                            {payment.amount} TK
                                        </TableCell>
                                        
                                        {/* Date */}
                                        <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                                            {new Date(payment.paidAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>
                                        
                                        {/* Status */}
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400 capitalize">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {payment.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Responsive Mobile Card View */}
                    <div className="block sm:hidden space-y-4">
                        {sales.map((payment) => (
                            <div key={payment._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-[70%]">
                                        {payment.productName}
                                    </h3>
                                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md">
                                        {payment.amount} TK
                                    </span>
                                </div>

                                <div className="space-y-2 pt-2 text-xs border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <User className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{payment.buyerName} ({payment.buyerEmail})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="font-mono text-[11px]">{payment.transactionId}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                        <span>{new Date(payment.paidAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-between items-center text-xs">
                                    <span className="text-slate-400">Payment Status</span>
                                    <span className="text-emerald-600 font-bold capitalize flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                     No sales history or confirmed payments found.
                </div>
            )}
        </section>
    );
};

export default SalesHistoryTable;