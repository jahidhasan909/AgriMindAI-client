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
import { ChevronLeft, ChevronRight, Package, User, ShoppingCart } from 'lucide-react';

interface ProductData {
    _id: string;
    productName: string;
    category: string;
    pricePerKg: number;
    availability: 'Available' | 'Unavailable';
    contactNumber: string;
    harvestDate: string;
    shortDescription: string;
    farmerName: string;
    farmerEmail: string;
    buyerName?: string;
    buyerEmail?: string;
    createdAt: string;
}

interface ApiResponse {
    data: ProductData[];
    page: number;
    totalPage: number;
}

interface AdminProductTableProps {
    productInfo: ApiResponse;
}

const AdminProductTable: React.FC<AdminProductTableProps> = ({ productInfo }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const products = productInfo?.data || [];
    const currentPage = productInfo?.page || 1;
    const totalPages = productInfo?.totalPage || 1;

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <section className="space-y-4">
            {products.length > 0 ? (
                <>
                    {/* Desktop Presentation Table */}
                    <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Farmer Info</TableHead>
                                    <TableHead>Buyer Info</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        {/* Product Details */}
                                        <TableCell className="max-w-[180px]">
                                            <div className="font-semibold text-slate-900 dark:text-white truncate">
                                                {product.productName}
                                            </div>
                                            <div className="text-[10px] text-slate-400 truncate font-mono">
                                                ID: {product._id}
                                            </div>
                                        </TableCell>

                                        {/* Category */}
                                        <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                                            {product.category}
                                        </TableCell>

                                        {/* Price */}
                                        <TableCell className="text-sm font-bold text-slate-900 dark:text-white">
                                            {product.pricePerKg} TK/Kg
                                        </TableCell>

                                        {/* Farmer Details */}
                                        <TableCell>
                                            <div className="text-xs">
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{product.farmerName}</p>
                                                <p className="text-slate-400 dark:text-slate-500 text-[11px]">{product.farmerEmail}</p>
                                            </div>
                                        </TableCell>

                                        {/* Buyer Details */}
                                        <TableCell>
                                            {product.buyerEmail ? (
                                                <div className="text-xs">
                                                    <p className="font-medium text-slate-800 dark:text-slate-200">{product.buyerName}</p>
                                                    <p className="text-slate-400 dark:text-slate-500 text-[11px]">{product.buyerEmail}</p>
                                                </div>
                                            ) : (
                                                <span className="text-xs italic text-slate-400">Not Sold Yet</span>
                                            )}
                                        </TableCell>

                                        {/* Availability Status */}
                                        <TableCell className="text-center">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border
                                            ${product.availability === 'Available' 
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400' 
                                                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400'}
                                            `}>
                                                {product.availability}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block sm:hidden space-y-4">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-[180px]">
                                            {product.productName}
                                        </h3>
                                        <p className="text-xs text-slate-400 font-medium">{product.category} • {product.pricePerKg} TK/Kg</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${product.availability === 'Available' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-rose-600 border-rose-200 bg-rose-50'}`}>
                                        {product.availability}
                                    </span>
                                </div>

                                <div className="space-y-2 pt-2 text-xs border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                    <div className="flex items-start gap-2">
                                        <User className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                                        <div>
                                            <span className="font-semibold block text-slate-700 dark:text-slate-300">Farmer: {product.farmerName}</span>
                                            <span className="text-[10px] text-slate-500">{product.farmerEmail}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 pt-1">
                                        <ShoppingCart className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                                        <div>
                                            <span className="font-semibold block text-slate-700 dark:text-slate-300">
                                                Buyer: {product.buyerEmail ? product.buyerName : "None"}
                                            </span>
                                            {product.buyerEmail && <span className="text-[10px] text-slate-500">{product.buyerEmail}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Pagination Footer */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 px-2">
                            <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                                Showing Page <span className="font-semibold text-slate-800 dark:text-slate-200">{currentPage}</span> of <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
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
                     <Package className="h-8 w-8 text-slate-300" />
                     <p>No products exist in the platform archive.</p>
                </div>
            )}
        </section>
    );
};

export default AdminProductTable;