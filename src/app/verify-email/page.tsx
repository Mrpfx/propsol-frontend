// @ts-nocheck
"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid or missing verification token.");
                return;
            }

            try {
                await authService.verifyEmail(token);
                setStatus("success");
                setMessage("Your email has been successfully verified.");
            } catch (err: any) {
                console.error("Verification error:", err);
                setStatus("error");
                setMessage("Failed to verify email. The link may be invalid or expired.");
            }
        };

        verify();
    }, [token]);

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Logo */}
            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="text-2xl font-bold text-[#1234A6]">
                    Prop<span className="text-slate-900">Sol</span>
                </Link>
            </div>

            {/* Decorative 3D Elements */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float-delayed z-0 pointer-events-none">
                <Image
                    src="/assets/coil_v2.png"
                    alt="Decorative Coil"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float z-0 pointer-events-none">
                <Image
                    src="/assets/star.png"
                    alt="Decorative Star"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 sm:p-12 text-center relative z-10">
                <div className="flex justify-center mb-6">
                    {status === "loading" && (
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    )}
                    {status === "success" && (
                        <CheckCircle className="w-16 h-16 text-green-500" />
                    )}
                    {status === "error" && (
                        <XCircle className="w-16 h-16 text-red-500" />
                    )}
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-4">
                    {status === "loading" && "Verifying Email"}
                    {status === "success" && "Email Verified!"}
                    {status === "error" && "Verification Failed"}
                </h1>

                <p className="text-slate-600 mb-8">
                    {message}
                </p>

                <Link
                    href="/signin"
                    className="inline-block w-full bg-[#3B60FF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200"
                >
                    Back to Sign In
                </Link>
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}
