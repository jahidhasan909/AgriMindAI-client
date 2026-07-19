import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const { productId, currentStatus } = await req.json();

        if (!productId || !currentStatus) {
            return NextResponse.json({ error: 'productId and currentStatus are required' }, { status: 400 });
        }

        if (currentStatus === 'Ordered') {
            return NextResponse.json({ error: 'Cannot change status of an ordered product' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const productsCollection = db.collection('products');

        const nextStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';

        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: { availability: nextStatus } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            availability: nextStatus, 
            message: `Status toggled successfully to ${nextStatus}` 
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
