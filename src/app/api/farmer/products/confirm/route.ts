import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({ error: 'productId is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const productsCollection = db.collection('products');

        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: { availability: 'Ordered' } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Order confirmed successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
