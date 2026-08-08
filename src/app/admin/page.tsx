// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminService } from "@/services/admin.service";
import { adminAffiliateService } from "@/services/admin-affiliate.service";
import { 
    Users, 
    DollarSign, 
    Briefcase, 
    Activity, 
    Share2, 
    TrendingUp, 
    TrendingDown, 
    CheckCircle, 
    Clock, 
    ArrowRight 
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function StatsCard({ title, value, icon: Icon, trend, color = "blue" }: any) {
    const colorGradients: Record<string, string> = {
        blue: "from-blue-500 to-indigo-600",
        green: "from-emerald-500 to-teal-600",
        purple: "from-purple-500 to-fuchsia-600",
        orange: "from-amber-500 to-orange-600",
        indigo: "from-indigo-500 to-violet-600"
    };

    const shadowColors: Record<string, string> = {
        blue: "shadow-blue-500/25",
        green: "shadow-emerald-500/25",
        purple: "shadow-purple-500/25",
        orange: "shadow-amber-500/25",
        indigo: "shadow-indigo-500/25"
    };

    const topGradients: Record<string, string> = {
        blue: "from-blue-500",
        green: "from-emerald-500",
        purple: "from-purple-500",
        orange: "from-amber-500",
        indigo: "from-indigo-500"
    };

    return (
        <div className="relative rounded-2xl bg-white p-5 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-slate-100">
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:16px_16px]" />
            <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${topGradients[color]} to-transparent opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`} />
            <div className="relative flex items-start justify-between mb-4">
                <div className={`relative p-3 rounded-xl bg-gradient-to-br ${colorGradients[color]} shadow-lg ${shadowColors[color]} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="h-5 w-5 text-white drop-shadow-sm" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                        {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trend.isPositive ? "+" : ""}{trend.value}%
                    </div>
                )}
            </div>
            <div className="relative">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorGradients[color]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [affiliateStats, setAffiliateStats] = useState<any>(null);
    const [topAffiliates, setTopAffiliates] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [statsRes, affStatsRes, topAffRes, regRes] = await Promise.allSettled([
                    adminService.getStats(),
                    adminAffiliateService.getDashboardStats(),
                    adminAffiliateService.getTopAffiliates(5),
                    adminService.getPropFirmRegistrations()
                ]);

                const getVal = (res: any, fallback: any) => res.status === "fulfilled" ? res.value : fallback;
                const propFirms = getVal(regRes, []);
                const activeCount = propFirms.filter((a: any) => a.account_status === "in_progress").length;
                const totalRev = propFirms.reduce((acc: number, b: any) => {
                    if (b.account_status === "in_progress" || b.account_status === "passed" || (b.account_status === "failed" && b.pass_type === "standard_pass")) {
                        return acc + (b.propfirm_account_cost || 0);
                    }
                    return acc;
                }, 0);
                const pendingCount = propFirms.filter((a: any) => a.account_status === "pending").length;

                const baseStats = getVal(statsRes, {});
                setStats({
                    ...baseStats,
                    active_prop_firms: activeCount,
                    total_revenue: totalRev,
                    pending_registrations: pendingCount
                });
                setAffiliateStats(getVal(affStatsRes, {}));
                setTopAffiliates(getVal(topAffRes, []));

                const paidOrders = propFirms
                    .filter((a: any) => ["finished", "confirmed", "completed", "successful"].includes(a.payment_status))
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5);
                setRecentOrders(paidOrders);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoadingSpinner size="lg" message="Loading Dashboard..." />
            </div>
        );
    }

    const totalUsers = stats?.total_users || 0;
    const totalRevenue = stats?.total_revenue || 0;
    const activePropFirms = stats?.active_prop_firms || 0;
    const pendingRegistrations = stats?.pending_registrations || 0;
    const activeAffiliatesCount = affiliateStats?.active_affiliates_count || 0;

    const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(val);

    return (
        <div className="space-y-8">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl -z-10" />
                <div className="py-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h2>
                    <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
                </div>
            </div>

            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatsCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    color="blue"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Earning Affiliates"
                    value={activeAffiliatesCount}
                    icon={Share2}
                    color="indigo"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="green"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Active Prop Firms"
                    value={activePropFirms}
                    icon={Briefcase}
                    color="purple"
                />
                <StatsCard
                    title="Pending Registrations"
                    value={pendingRegistrations}
                    icon={Activity}
                    color="orange"
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Paid Orders Card */}
                <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Recent Paid Orders</h3>
                        </div>
                        <Link href="/admin/payments" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentOrders.length > 0 ? (
                        <div className="space-y-3">
                            {recentOrders.map((order: any) => (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" key={order.id}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                            {(order.propfirm_name || "PF").slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">{order.propfirm_name}</p>
                                            <p className="text-xs text-slate-500">Order: {order.order_id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">{formatCurrency(order.propfirm_account_cost)}</p>
                                        <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                            <Clock className="w-12 h-12 mb-2 opacity-50" />
                            <p className="text-sm">No paid orders yet</p>
                        </div>
                    )}
                </div>

                {/* Top Affiliates Card */}
                <div className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl shadow-lg shadow-purple-500/20">
                                <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Top Affiliates</h3>
                        </div>
                        <Link href="/admin/affiliates" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {topAffiliates.length > 0 ? (
                        <div className="space-y-3">
                            {topAffiliates.map((aff: any, idx: number) => (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors" key={aff.user_id}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                            idx === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" :
                                            idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400 text-white" :
                                            idx === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white" :
                                            "bg-slate-200 text-slate-600"
                                        }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 text-sm">{aff.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">{aff.referral_code}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">{formatCurrency(aff.total_earnings)}</p>
                                        <p className="text-xs text-slate-500">{aff.total_referrals} referrals</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                            <Users className="w-12 h-12 mb-2 opacity-50" />
                            <p className="text-sm">No affiliates yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
