import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req: Request) {
    try {
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: 'productId is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const productsCollection = db.collection('products');

        const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
