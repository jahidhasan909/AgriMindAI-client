import { ProductDetailsClient, ProductProps } from "./ProductDetailsClient";



interface PageProps {
    params: Promise<{ id: string }>;
}

const DetailsPage = async ({ params }: PageProps) => {
    const { id } = await params;
    const baseurl = process.env.NEXT_PUBLIC_BASE_URL || '';

    let product: ProductProps | null = null;



    try {
        const res = await fetch(`${baseurl}/api/products/${id}`, { cache: 'no-store' });
        if (res.ok) {
            product = await res.json();
        }
    } catch (error) {
        console.error("Failed to fetch product details:", error);
    }

    if (!product) {
        return <div className="text-center py-20 text-slate-500 mt-20">Product not found.</div>;
    }

    return <ProductDetailsClient product={product} />;
};

export default DetailsPage;