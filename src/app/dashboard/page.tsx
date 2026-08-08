"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { AccountList } from "@/components/dashboard/AccountList";
import { HistoryView } from "@/components/dashboard/HistoryView";
import { NotificationsView } from "@/components/dashboard/NotificationsView";
import { ReferralsView } from "@/components/dashboard/ReferralsView";
import Footer from "@/components/layout/Footer";
import Loading, { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { userService, User } from "@/services/user.service";
import { propFirmService, PropFirmRegistration } from "@/services/prop-firm.service";

type Tab = "all" | "history" | "notifications" | "referrals";

function DashboardContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<Tab>("all");
    const [user, setUser] = useState<User | undefined>(undefined);
    const [accounts, setAccounts] = useState<PropFirmRegistration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam && ["all", "history", "notifications", "referrals"].includes(tabParam)) {
            setActiveTab(tabParam as Tab);
        }
    }, [searchParams]);

    useEffect(() => {
        // Try to load user from local storage first for immediate display
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing stored user data", e);
            }
        }

        const fetchData = async () => {
            // Fetch User Data
            try {
                const userData = await userService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }

            // Fetch Accounts Data
            try {
                const registrations = await propFirmService.getUserRegistrations();
                const filteredAccounts = registrations.filter((reg: any) =>
                    reg.payment_status && ["completed", "successful", "finished", "confirmed"].includes(reg.payment_status)
                );
                setAccounts(filteredAccounts);
            } catch (error) {
                console.error("Error fetching accounts data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading message="Loading Dashboard..." />;
    }

    return (
        <div className="min-h-screen bg-white">
            <DashboardHeader user={user} />
            <main>
                <DashboardHero user={user} />

                <div className="container mx-auto px-4 py-8">
                    {/* Tab Navigation */}
                    <div className="mb-8 flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${activeTab === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            All Account
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${activeTab === "history"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            History
                        </button>
                        <button
                            onClick={() => setActiveTab("notifications")}
                            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${activeTab === "notifications"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab("referrals")}
                            className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${activeTab === "referrals"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Referrals
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {activeTab === "all" && <AccountList accounts={accounts} />}
                        {activeTab === "history" && <HistoryView />}
                        {activeTab === "notifications" && <NotificationsView />}
                        {activeTab === "referrals" && <ReferralsView />}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<Loading message="Loading Dashboard..." />}>
            <DashboardContent />
        </Suspense>
    );
}
