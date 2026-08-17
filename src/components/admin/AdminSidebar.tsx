// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Share2,
    Briefcase,
    Handshake,
    CreditCard,
    ArrowUpRight,
    MessageCircle,
    Mail,
    ExternalLink,
    Settings,
    UserCog,
    LogOut,
    X
} from "lucide-react";
import { authService } from "@/services/auth.service";

export const hasPermission = (adminUser: any, requiredRole: string) => {
    if (!adminUser || !adminUser.roles) return false;
    
    const userRoles = Array.isArray(adminUser.roles)
        ? adminUser.roles.map((r: any) => String(r).toLowerCase())
        : [String(adminUser.roles).toLowerCase()];

    return (
        userRoles.includes("super_admin") ||
        userRoles.includes("super admin") ||
        userRoles.includes(requiredRole.toLowerCase())
    );
};

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose = () => {} }: AdminSidebarProps) {
    const pathname = usePathname();
    const [adminUser, setAdminUser] = useState<any>(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin_data");
        if (storedAdmin) {
            try {
                setAdminUser(JSON.parse(storedAdmin));
            } catch (e) {
                console.error("Failed to parse admin data", e);
            }
        }
    }, []);

    const menuItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            exact: true,
            role: "dashboard"
        },
        {
            title: "Users",
            icon: Users,
            href: "/admin/users",
            role: "users"
        },
        {
            title: "Affiliates",
            icon: Share2,
            href: "/admin/affiliates",
            role: "users"
        },
        {
            title: "Prop Firms",
            icon: Briefcase,
            href: "/admin/prop-firm",
            role: "prop_firms"
        },
        {
            title: "Partnership Accounts",
            icon: Handshake,
            href: "/admin/partnership",
            role: "prop_firms"
        },
        {
            title: "Plans",
            icon: CreditCard,
            href: "/admin/plans",
            role: "prop_firms"
        },
        {
            title: "Payments",
            icon: CreditCard,
            href: "/admin/payments",
            role: "payments"
        },
        {
            title: "Payouts",
            icon: ArrowUpRight,
            href: "/admin/payouts",
            role: "payouts"
        },
        {
            title: "Transactions",
            icon: ArrowUpRight,
            href: "/admin/transactions",
            role: "transactions"
        },
        {
            title: "Support Tickets",
            icon: MessageCircle,
            href: "/admin/support",
            role: "support"
        },
        {
            title: "Support Messages",
            icon: MessageCircle,
            href: "/admin/messages",
            role: "support"
        },
        {
            title: "Send Emails",
            icon: Mail,
            href: "/admin/emails",
            role: "email_marketing"
        },
        {
            title: "Assign Package",
            icon: Briefcase,
            href: "/admin/packages",
            role: "users"
        },
        {
            title: "Booking Links",
            icon: ExternalLink,
            href: "/admin/booking-links",
            role: "settings"
        },
        {
            title: "Banner Ads",
            icon: MessageCircle,
            href: "/admin/banners",
            role: "settings"
        },
        {
            title: "Manage Admins",
            icon: Users,
            href: "/admin/admins",
            role: "super_admin"
        },
        {
            title: "Settings",
            icon: Settings,
            href: "/admin/settings",
            role: "settings"
        },
        {
            title: "My Profile",
            icon: UserCog,
            href: "/admin/profile",
            role: "dashboard"
        }
    ];

    const visibleItems = menuItems.filter(item => {
        if (!adminUser) return false;
        if (item.role === "dashboard") return true;
        return hasPermission(adminUser, item.role);
    });

    return (
        <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
                <div className="mb-10 flex items-center justify-between pl-2.5">
                    <span className="self-center whitespace-nowrap text-xl font-bold text-gray-900">
                        PROPSOL <span className="text-blue-600">Admin</span>
                    </span>
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <ul className="space-y-2 font-medium">
                    {visibleItems.map((item) => {
                        const active = item.exact
                            ? pathname === item.href
                            : pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => {
                                        if (typeof window !== "undefined" && window.innerWidth < 1024) {
                                            onClose();
                                        }
                                    }}
                                    className={`group flex items-center rounded-lg p-3 transition-all duration-200 ${
                                        active
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <item.icon
                                        className={`h-5 w-5 flex-shrink-0 transition duration-75 ${
                                            active ? "text-white" : "text-gray-500 group-hover:text-gray-900"
                                        }`}
                                    />
                                    <span className="ml-3">{item.title}</span>
                                    {active && (
                                        <div className="ml-auto h-2 w-1 rounded-full bg-white/50" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="mt-auto border-t border-gray-200 pt-4">
                    <button
                        className="group flex w-full items-center rounded-lg p-3 text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                            authService.adminLogout();
                            window.location.href = "/admin/login";
                        }}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-red-600" />
                        <span className="ml-3">Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
