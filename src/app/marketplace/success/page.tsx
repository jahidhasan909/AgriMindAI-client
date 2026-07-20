import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface SuccessProps {
    searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessProps) {
    const { session_id } = await searchParams;

    if (!session_id) {
        throw new Error('Please provide a valid session_id (`cs_test_...`)');
    }

const baseurl = process.env.NEXT_PUBLIC_BASE_URL
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status === 'open') {
        return redirect('/');
    }

    if (session.status === 'complete') {
        const metadata = session.metadata;
        const customerEmail = session.customer_details?.email;

        if (metadata) {
            try {
                await fetch(`${baseurl}/api/store-payment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: metadata.productId,
                        productName: metadata.productName,
                        buyerName: metadata.buyerName,
                        buyerEmail: metadata.buyerEmail,
                        transactionId: typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
                        amount: session.amount_total ? session.amount_total / 100 : 0
                    }),
                });
            } catch (err) {
                console.error("Failed to update database on backend:", err);
            }
        }

        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-md text-center max-w-md w-full border border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl text-emerald-600">✓</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        We appreciate your business! A confirmation email will be sent to <span className="font-semibold">{customerEmail}</span>.
                    </p>
                    <Link
                        href={`/marketplace/${metadata?.productId || ''}`}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2b223a] hover:bg-[#1d1628] px-6 text-sm font-bold text-white transition-all shadow-sm"
                    >
                        Back to Product
                    </Link>
                </div>
            </div>
        );
    }

    return null;
}