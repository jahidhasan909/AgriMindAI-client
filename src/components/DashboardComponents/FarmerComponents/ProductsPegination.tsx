"use client";

import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { MoreVertical, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProductRequest {
    _id: string;
    productName: string;
    category: string;
    pricePerKg: number;
    availability: 'Available' | 'Unavailable';
    contactNumber: string;
    location: {
        district?: string;
        upazila?: string;
    } | string;
    harvestDate: string;
    shortDescription: string;
    images: string[];
    farmerId: string;
    farmerName: string;
    farmerEmail: string;
    farmerImage: string;
    buyerEmail?: string;
    buyerName?: string;
    buyerId?: string;
    createdAt: string;
}

interface ProductsProp {
    data: ProductRequest[];
    page: number;
    totalPage: number;
}

interface UserProp {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
    role?: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface FarmerProductsPaginationProps {
    products: ProductsProp;
    user?: UserProp | null; 
}

const FarmerProductsPagination: React.FC<FarmerProductsPaginationProps> = ({products, user }) => {
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const router = useRouter();
    const searchParams = useSearchParams();

    const [prevProductsData, setPrevProductsData] = useState<ProductRequest[] | null>(null);
    const [productData, setProductData] = useState<ProductRequest[]>(products?.data || []);
    
    const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedProductToDelete, setSelectedProductToDelete] = useState<string | null>(null);

    if (products?.data !== prevProductsData) {
        setPrevProductsData(products?.data || null);
        setProductData(products?.data || []);
    }

    const currentPage = products?.page || 1;
    const totalPages = products?.totalPage || 1;

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const triggerDelete = (id: string) => {
        setSelectedProductToDelete(id);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedProductToDelete) return;

        try {
            const res = await fetch(`${baseurl}/api/farmer/products/${selectedProductToDelete}`, {
                method: 'DELETE',
            });

            const deleteData = await res.json();
            if (res.ok && deleteData) {
                toast.success('Product deleted successfully!');
                setProductData(prev => prev.filter(prod => prod._id !== selectedProductToDelete));
                router.refresh();
            } else {
                toast.error('Failed to delete product.');
            }
        } catch (error) {
            toast.error('Error deleting product');
        } finally {
            setIsModalOpen(false);
            setSelectedProductToDelete(null);
        }
    };

    const handleConfirmOrder = async (id: string) => {
        try {
            const res = await fetch(`${baseurl}/api/farmer/products/confirm/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok) {
                toast.success('Order confirmed successfully!');
                router.refresh();
            } else {
                toast.error('Failed to confirm order.');
            }
        } catch (error) {
            toast.error('Error confirming order');
        }
    };

    const filteredProducts = productData.filter(product => {
        if (availabilityFilter === 'all') return true;
        return product?.availability?.toLowerCase() === availabilityFilter.toLowerCase();
    });

    return (
        <div className='bg-white/10'>
            <div className="py-12 px-4 lg:py-8 max-w-7xl mx-auto space-y-6 md:space-y-8 min-h-screen pb-20 relative">
                
                <header className="py-7 px-10 rounded-2xl bg-gradient-to-r dark:from-green-950/20 dark:to-slate-900 border border-gray-100 dark:border-green-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
                            Welcome back, <span className="text-green-600 font-extrabold">{user?.name || "Farmer"}</span> !
                        </h1>
                        <p className="lg:text-[1rem] text-xs text-slate-500 dark:text-slate-400 mt-1">Manage and track your listed agricultural products.</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <select
                            id="availability-filter"
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs focus:outline-hidden cursor-pointer min-w-[145px]"
                        >
                            <option value="all">All ({productData.length})</option>
                            <option value="available">Available ({productData.filter(p => p.availability === 'Available').length})</option>
                            <option value="unavailable">Stock Out ({productData.filter(p => p.availability === 'Unavailable').length})</option>
                        </select>
                    </div>
                </header>

                {filteredProducts.length > 0 ? (
                    <section className="space-y-4 relative">
                        
                        <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Price/Kg</TableHead>
                                        <TableHead>Harvest Date</TableHead>
                                        <TableHead>Buyer Info</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center w-[100px]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => {
                                        const hasBuyer = !!(product.buyerEmail || product.buyerName);
                                        return (
                                            <TableRow key={product._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <TableCell className="font-semibold text-slate-900 dark:text-white max-w-[180px] truncate">
                                                    {product?.productName}
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                                                    {product?.category}
                                                </TableCell>
                                                <TableCell className="text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                                                    {product?.shortDescription}
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-slate-900 dark:text-white">
                                                    {product?.pricePerKg} TK
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                                                    {product?.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                                                    {hasBuyer ? (
                                                        <div>
                                                            <p className="font-semibold text-slate-700 dark:text-slate-300">{product.buyerName}</p>
                                                            <p className="text-[10px] text-slate-500">{product.buyerEmail}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 italic">No buyer yet</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`text-xs capitalize px-2.5 py-0.5 rounded-full border font-semibold
                                                    ${product?.availability === 'Available' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400'}
                                                    `}>{product?.availability}</span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <FarmerActionDropdown product={product} onDelete={triggerDelete} onConfirm={handleConfirmOrder} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="block sm:hidden space-y-4">
                            {filteredProducts.map((product) => {
                                const hasBuyer = !!(product.buyerEmail || product.buyerName);
                                return (
                                    <div key={product._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 relative">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-slate-900 dark:text-white text-base">{product?.productName}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">{product?.category} • {product?.pricePerKg} TK/Kg</p>
                                            </div>
                                            <FarmerActionDropdown product={product} onDelete={triggerDelete} onConfirm={handleConfirmOrder} />
                                        </div>

                                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{product?.shortDescription}</p>

                                        <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800 items-center">
                                            <div>
                                                <span className="text-slate-400 block mb-0.5">Status</span>
                                                <span className={`capitalize font-bold ${product?.availability === 'Available' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {product?.availability}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-slate-400 block mb-0.5">Buyer</span>
                                                <span className="text-slate-700 dark:text-slate-300 font-medium">
                                                    {hasBuyer ? product.buyerName : "None"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

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
                    </section>
                ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                         No products found.
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
                        <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 transform transition-all scale-100">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Product Listing?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">This action will permanently remove the item from the marketplace.</p>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button className="bg-red-600 hover:bg-red-700 text-white" size="sm" onClick={confirmDelete}>Confirm Delete</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface FarmerActionDropdownProps {
    product: ProductRequest;
    onDelete: (id: string) => void;
    onConfirm: (id: string) => void;
}

const FarmerActionDropdown: React.FC<FarmerActionDropdownProps> = ({ product, onDelete, onConfirm }) => {
    const hasBuyer = !!(product?.buyerEmail || product?.buyerName);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0 hover:cursor-pointer">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 text-xs font-medium">
                    <Link href={`/dashboard/farmer/${product._id}`} className="flex items-center gap-2 w-full">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                    </Link>
                </DropdownMenuItem>
                
                {hasBuyer ? (
                    <>
                        <DropdownMenuItem 
                            className="cursor-pointer text-xs font-medium text-green-600 hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => onConfirm(product._id)}
                        >
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Confirm Order</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-xs font-medium text-slate-400 dark:text-slate-600 flex items-center gap-2 opacity-50 cursor-not-allowed">
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit (Disabled)</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem disabled className="text-xs font-medium text-slate-400 dark:text-slate-600 flex items-center gap-2 opacity-50 cursor-not-allowed">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Confirm Order (No Buyer)</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-xs hover:bg-gray-100 font-medium">
                            <Link href={`/dashboard/farmer/products/edit/${product._id}`} className="flex items-center gap-2 w-full">
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Edit Request</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuItem 
                    className="cursor-pointer text-xs font-medium text-destructive focus:text-destructive hover:bg-gray-100 focus:bg-destructive/10 flex items-center gap-2"
                    onClick={() => onDelete(product._id)}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Request</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default FarmerProductsPagination;