// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown === 0) {
            router.push("/dashboard");
        }
    }, [countdown, router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-[#111836] p-8 rounded-2xl border border-gray-800 text-center py-16 shadow-2xl">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-white">Payment Successful!</h1>
                <p className="text-gray-400 mb-8 text-lg">
                    Thank you for your payment. Your transaction has been completed successfully.
                </p>
                <div className="p-6 bg-blue-500/10 rounded-xl mb-8 border border-blue-500/20">
                    <p className="text-blue-400 mb-2 font-medium">Processing Your Order</p>
                    <p className="text-sm text-gray-400 mb-4">
                        We are currently provisioning your account. You will receive a confirmation email shortly.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                        </span>
                        <span className="text-gray-300">
                            Redirecting to dashboard in <span className="text-white font-bold">{countdown}</span> seconds...
                        </span>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
