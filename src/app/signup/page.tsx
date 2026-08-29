// @ts-nocheck
"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/services/auth.service";

function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") || "/dashboard";

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        referralCode: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await authService.register({
                email: formData.email,
                name: formData.fullName,
                password: formData.password,
                referred_by: formData.referralCode || undefined,
            });

            // If registration returns a token, redirect to dashboard or returnUrl
            if (response && response.access_token) {
                toast.success("Signup successful! Redirecting...");
                setTimeout(() => {
                    router.push(returnUrl);
                }, 1500);
            } else {
                // Otherwise redirect to login with returnUrl preserved
                toast.success("Signup successful! Please sign in.");
                setTimeout(() => {
                    router.push(`/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
                }, 1500);
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            const errorMessage = "Registration failed. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Logo */}
            <div className="absolute top-8 left-8 z-20">
                <Link href="/" className="text-2xl font-bold text-[#1234A6]">
                    Prop<span className="text-slate-900">Sol</span>
                </Link>
            </div>

            {/* Decorative 3D Elements */}
            {/* Coil - Left Side */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float-delayed z-0 pointer-events-none">
                <Image
                    src="/assets/coil_v2.png"
                    alt="Decorative Coil"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Star - Bottom Right */}
            <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float z-0 pointer-events-none">
                <Image
                    src="/assets/star.png"
                    alt="Decorative Star"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[600px]">
                {/* Left Section: Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Sign Up</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter Name"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1234A6] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email@gmail.com"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1234A6] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="************"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1234A6] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="referralCode" className="block text-sm font-medium text-slate-700 mb-2">
                                Referral Code (Optional)
                            </label>
                            <input
                                type="text"
                                id="referralCode"
                                value={formData.referralCode}
                                onChange={handleChange}
                                placeholder="If you have a referral code, enter it here."
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1234A6] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#3B60FF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>

                        <div className="flex items-center justify-center text-sm text-slate-500 gap-1 mt-8">
                            <span>Already have an account?</span>
                            <Link href="/signin" className="text-[#3B60FF] hover:text-[#1234A6] font-medium transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Right Section: Visual */}
                <div className="hidden lg:flex w-1/2 bg-[#3758F9] relative items-end p-16 overflow-hidden">
                    {/* Soft Circle Background Design - High Visibility Mode */}
                    {/* Large Top-Left Circle */}
                    <div className="absolute -top-[20%] -left-[10%] w-[90%] h-[90%] rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent blur-2xl border border-white/20 pointer-events-none" />

                    {/* Intersecting Center Circle */}
                    <div className="absolute top-[20%] left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-white/30 to-transparent blur-2xl border border-white/20 pointer-events-none" />

                    {/* Circle Decoration - Bottom Right */}
                    <div className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full backdrop-blur-md z-10" />

                    <div className="relative z-20 mb-10">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 leading-tight">
                            Hey<br />
                            Welcome to<br />
                            PropSol
                        </h2>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <SignUpForm />
        </Suspense>
    );
}
