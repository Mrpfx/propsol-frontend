// @ts-nocheck
"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/services/auth.service";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        if (!token) {
            setError("Missing reset token.");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            if (isAdmin) {
                await authService.resetAdminPassword(token, newPassword);
            } else {
                await authService.resetPassword(token, newPassword);
            }
            const successMessage = "Password reset successfully. You can now login.";
            setMessage(successMessage);
            toast.success(successMessage);
            setTimeout(() => {
                router.push("/signin");
            }, 2000);
        } catch (err: any) {
            console.error("Reset error:", err);
            const errorMessage = "Failed to reset password. The token may be invalid or expired.";
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-8">Reset Password</h1>

                    {message && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1234A6] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#1234A6] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="admin-checkbox"
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="admin-checkbox" className="ml-2 block text-sm text-gray-900">
                                I am an Admin
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !token}
                            className="w-full bg-[#3B60FF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <div className="text-center text-sm text-slate-500 mt-8">
                            <Link href="/signin" className="text-[#3B60FF] hover:underline">
                                Back to Sign In
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
                            Create a New<br />
                            Strong Password<br />
                            for Your Account
                        </h2>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
