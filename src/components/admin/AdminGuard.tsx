// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AccessDeniedModal } from "@/components/admin/AccessDeniedModal";
import { hasPermission } from "@/components/admin/AdminSidebar";

const ROUTE_ROLE_MAP: Record<string, string> = {
    "/admin/users": "users",
    "/admin/affiliates": "users",
    "/admin/emails": "email_marketing",
    "/admin/prop-firm": "prop_firms",
    "/admin/plans": "prop_firms",
    "/admin/payments": "payments",
    "/admin/payouts": "payouts",
    "/admin/transactions": "transactions",
    "/admin/support": "support",
    "/admin/messages": "support",
    "/admin/packages": "users",
    "/admin/booking-links": "settings",
    "/admin/banners": "settings",
    "/admin/admins": "super_admin",
    "/admin/settings": "settings",
    "/admin/register": "super_admin"
};

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [hasRoleAccess, setHasRoleAccess] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("admin_access_token");
            const isAdmin = localStorage.getItem("is_admin");

            if (!token) {
                router.push("/admin/login");
                return;
            }

            if (isAdmin) {
                setIsAuthorized(true);
            } else {
                try {
                    const { adminService } = await import("@/services/admin.service");
                    const meData = await adminService.getMe();
                    localStorage.setItem("admin_data", JSON.stringify(meData));
                    localStorage.setItem("is_admin", "true");
                    setIsAuthorized(true);
                } catch (error) {
                    console.error("Admin verification failed:", error);
                    localStorage.removeItem("admin_access_token");
                    localStorage.removeItem("admin_data");
                    localStorage.removeItem("is_admin");
                    router.push("/admin/login");
                    return;
                }
            }

            // Role Permission Check
            const requiredRole = Object.entries(ROUTE_ROLE_MAP).find(
                ([route]) => pathname === route || pathname.startsWith(`${route}/`)
            )?.[1];

            if (!requiredRole) {
                setHasRoleAccess(true);
            } else {
                const storedAdmin = localStorage.getItem("admin_data");
                if (storedAdmin) {
                    try {
                        const adminData = JSON.parse(storedAdmin);
                        setHasRoleAccess(hasPermission(adminData, requiredRole));
                    } catch (e) {
                        setHasRoleAccess(false);
                    }
                } else {
                    setHasRoleAccess(false);
                }
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (!isAuthorized) {
        return null;
    }

    if (!hasRoleAccess) {
        return <AccessDeniedModal />;
    }

    return <>{children}</>;
}
