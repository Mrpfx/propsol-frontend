// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "general" | "failed_account" | "passed_account" | "login" | "account_reset" | "password_reset";
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await adminService.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case "failed_account":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "passed_account":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "account_reset":
            case "password_reset":
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-500">System alerts and updates.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="divide-y divide-gray-200">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Bell className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className="flex items-start gap-4 p-6 hover:bg-gray-50">
                                <div className="flex-shrink-0 pt-1">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                                        <span className="text-xs text-gray-500">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
