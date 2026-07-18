import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin');
        
        
        const { product, buyerEmail, buyerName } = await req.json();

        if (!product || !buyerEmail || !buyerName) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

       
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: buyerEmail, 
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.productName,
                            images: product.images,
                        },
                        unit_amount: Math.round(product.pricePerKg * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/marketplace/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/marketplace/${product._id}?payment=cancel`,
            metadata: {
                productId: product._id,
                productName: product.productName,
                buyerName,
                buyerEmail
            }
        });

        
        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        );
    }
}