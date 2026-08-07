// @ts-nocheck
"use client";

import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (pathname === "/admin/login" || pathname === "/admin/register") {
        return <>{children}</>;
    }

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-50">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <div className="lg:ml-64">
                    <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
                    <main className="mt-20 p-4 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AdminGuard>
    );
}
