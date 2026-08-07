// @ts-nocheck
"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { OrderSummary } from "@/components/payment/OrderSummary";
import { PaymentMethodSelector, CardDetails } from "@/components/payment/PaymentMethodSelector";
import { PaymentProcessing } from "@/components/payment/PaymentProcessing";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { paymentService } from "@/services/payment.service";

export default function PaymentPage() {
    const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        cardNumber: "",
        expiryDate: "",
        cvc: "",
        cardName: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (paymentMethod === "crypto") {
            // Placeholder for crypto logic
            toast.error("Crypto payment not implemented yet.");
            return;
        }

        setStatus("processing");
        setError("");

        try {
            await paymentService.createPayment({
                card_name: cardDetails.cardName,
                card_number: cardDetails.cardNumber,
                card_expiry_date: cardDetails.expiryDate, // Note: Backend expects datetime, might need formatting
                card_type: "Visa", // Hardcoded or detected
                card_cvv: cardDetails.cvc,
            });
            toast.success("Payment successful!");
            setStatus("success");
        } catch (err: any) {
            console.error("Payment error:", err);
            const errorMessage = "Payment failed. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
            setStatus("error");
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            {/* Decorative 3D Elements */}
            {/* Coil - Left Side */}
            <div className="pointer-events-none absolute -left-16 top-1/2 z-0 h-[200px] w-[200px] -translate-y-1/2 animate-float-delayed lg:h-[300px] lg:w-[300px]">
                <Image
                    src="/assets/coil_v2.png"
                    alt="Decorative Coil"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Star - Bottom Right */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 z-0 h-[200px] w-[200px] animate-float lg:h-[300px] lg:w-[300px]">
                <Image
                    src="/assets/star.png"
                    alt="Decorative Star"
                    fill
                    className="object-contain"
                />
            </div>

            <div className="relative z-10 mx-auto max-w-5xl">
                <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
                    Please continue to finalize registration
                </h1>

                <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                    <div className="p-8 md:p-12">
                        {status === "idle" || status === "error" ? (
                            <div className="grid gap-12 lg:grid-cols-2">
                                {/* Left Column - Order Summary */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/"
                                            className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                                        >
                                            <ArrowLeft className="h-6 w-6" />
                                        </Link>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Make Payment <span className="text-blue-600">(Your Order)</span>
                                        </h2>
                                    </div>
                                    <OrderSummary />
                                </div>

                                {/* Right Column - Payment Method */}
                                <div className="flex flex-col justify-between space-y-8">
                                    <PaymentMethodSelector
                                        selectedMethod={paymentMethod}
                                        onSelect={setPaymentMethod}
                                        cardDetails={cardDetails}
                                        onCardDetailsChange={setCardDetails}
                                    />

                                    {status === "error" && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <p className="text-xs text-gray-500">
                                            By continuing, I agree to our{" "}
                                            <Link href="/refund-policy" className="font-medium text-blue-600 hover:underline">
                                                Refund Policy
                                            </Link>
                                            ,{" "}
                                            <Link href="/terms" className="font-medium text-blue-600 hover:underline">
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/privacy-policy" className="font-medium text-blue-600 hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </p>
                                        <button
                                            onClick={handleSubmit}
                                            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        >
                                            Finalize & Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : status === "processing" ? (
                            <PaymentProcessing />
                        ) : (
                            <PaymentSuccess />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
