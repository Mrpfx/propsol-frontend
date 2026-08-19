// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { adminService } from "@/services/admin.service";

export default function AdminRegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        securityCode: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.securityCode || formData.securityCode.trim().length !== 10) {
            const codeErr = "Please enter the valid 10-character admin security code.";
            setError(codeErr);
            toast.error(codeErr);
            setLoading(false);
            return;
        }

        try {
            await adminService.createAdmin({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                security_code: formData.securityCode.trim(),
                Status: true,
                email_verified: true,
            });
            toast.success("Admin created successfully!");
            setFormData({ name: "", email: "", password: "", securityCode: "" });
            router.push("/admin/admins");
        } catch (err: any) {
            console.error("Failed to create admin:", err);
            const errorMessage = err?.response?.data?.detail || "Failed to create admin. Please verify your security code and credentials.";
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
                <Link href="/" className="text-2xl font-bold text-red-800">
                    Prop<span className="text-slate-900">Sol</span> <span className="text-red-600 text-sm uppercase tracking-wider ml-1">Admin</span>
                </Link>
            </div>

            {/* Decorative 3D Elements */}
            {/* Coil - Left Side */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float-delayed z-0 pointer-events-none grayscale opacity-50">
                <Image
                    src="/assets/coil_v2.png"
                    alt="Decorative Coil"
                    fill
                    className="object-contain"
                />
            </div>

            {/* Star - Bottom Right */}
            <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float z-0 pointer-events-none grayscale opacity-50">
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Register Admin</h1>
                    <p className="text-slate-500 mb-8">Create a new administrator account.</p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Admin Name"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@propsol.com"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="************"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-600 placeholder:text-gray-300"
                            />
                        </div>

                        <div>
                            <label htmlFor="securityCode" className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                                <span>Admin Security Code <span className="text-red-500">*</span></span>
                                <span className="text-xs text-slate-400 font-normal">10 characters (Letters & Digits)</span>
                            </label>
                            <input
                                type="text"
                                id="securityCode"
                                name="securityCode"
                                maxLength={10}
                                value={formData.securityCode}
                                onChange={handleChange}
                                placeholder="e.g. P7x9K3m2Q1"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-600 font-mono uppercase placeholder:text-gray-300 tracking-wider"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Admin..." : "Create Account"}
                        </button>

                        <div className="flex justify-center mt-8">
                            <Link href="/admin/login" className="text-sm text-slate-500 hover:text-red-600 transition-colors">
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Right Section: Visual */}
                <div className="hidden lg:flex w-1/2 bg-red-700 relative items-end p-16 overflow-hidden">
                    {/* Soft Circle Background Design - High Visibility Mode */}
                    {/* Large Top-Left Circle */}
                    <div className="absolute -top-[20%] -left-[10%] w-[90%] h-[90%] rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent blur-2xl border border-white/20 pointer-events-none" />

                    {/* Intersecting Center Circle */}
                    <div className="absolute top-[20%] left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-white/30 to-transparent blur-2xl border border-white/20 pointer-events-none" />

                    {/* Circle Decoration - Bottom Right */}
                    <div className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full backdrop-blur-md z-10" />

                    <div className="relative z-20 mb-10">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 leading-tight">
                            Admin<br />
                            Registration<br />
                            Portal
                        </h2>
                    </div>
                </div>
            </div>
        </main>
    );
}
