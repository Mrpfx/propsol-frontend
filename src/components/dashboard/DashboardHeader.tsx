"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { authService } from "@/services/auth.service";
import { User } from "@/services/user.service";

interface DashboardHeaderProps {
    user?: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        router.push("/signin");
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <div className="flex items-center gap-12">
                    <Link href="/" className="flex items-center gap-0.5">
                        <span className="text-2xl font-bold text-blue-600">Prop</span>
                        <span className="text-2xl font-bold text-gray-900">Sol</span>
                    </Link>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                        >
                            Home
                        </Link>
                        <Link
                            href="/support"
                            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                        >
                            Support/Contact
                        </Link>
                        <Link
                            href="/faq"
                            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                        >
                            About
                        </Link>
                        <Link
                            href="/dashboard?tab=referrals"
                            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                        >
                            Referrals
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>

                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white p-4 absolute left-0 right-0 shadow-lg">
                    <nav className="flex flex-col gap-4">
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/support"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Support/Contact
                        </Link>
                        <Link
                            href="/faq"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link
                            href="/dashboard?tab=referrals"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Referrals
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
}
