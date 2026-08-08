"use client";

import React, { useState, useEffect } from "react";
import { 
    adminAffiliateService, 
    AffiliateDashboardStats, 
    GlobalSettings, 
    AffiliateUser 
} from "@/services/admin-affiliate.service";
import { toast } from "react-hot-toast";
import { 
    Users, 
    DollarSign, 
    Share2, 
    Clock, 
    Search, 
    Percent, 
    TrendingUp, 
    Loader2, 
    Save, 
    Settings, 
    CheckCircle,
    X,
    Shield,
    Sparkles
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

function StatCard({ title, value, icon: Icon, color }: any) {
    const gradientMap: Record<string, string> = {
        "bg-green-500": "from-emerald-500 to-teal-600",
        "bg-yellow-500": "from-amber-400 to-orange-500",
        "bg-blue-500": "from-blue-500 to-indigo-600",
        "bg-purple-500": "from-purple-500 to-fuchsia-600"
    };

    const shadowMap: Record<string, string> = {
        "bg-green-500": "shadow-emerald-500/20",
        "bg-yellow-500": "shadow-amber-500/20",
        "bg-blue-500": "shadow-blue-500/20",
        "bg-purple-500": "shadow-purple-500/20"
    };

    const gradient = gradientMap[color] || "from-slate-500 to-slate-600";
    const shadow = shadowMap[color] || "shadow-slate-500/20";

    return (
        <div className="relative bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <div className="relative flex items-start justify-between mb-6">
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ${shadow} group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
            </div>
            <div className="relative">
                <h3 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-xs text-slate-500 font-medium">{title}</p>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
        </div>
    );
}

export default function AdminAffiliatesPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "settings" | "affiliates">("overview");
    const [stats, setStats] = useState<AffiliateDashboardStats | null>(null);
    const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
        default_commission_rate: 0.1,
        minimum_withdrawal_amount: 50,
        is_program_enabled: true
    });
    const [affiliates, setAffiliates] = useState<AffiliateUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateUser | null>(null);
    const [editForm, setEditForm] = useState<{
        custom_rate: string;
        is_enabled: boolean;
    }>({
        custom_rate: "",
        is_enabled: true
    });
    const [savingSettings, setSavingSettings] = useState(false);
    const [savingUser, setSavingUser] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, settingsRes, affiliatesRes] = await Promise.allSettled([
                adminAffiliateService.getDashboardStats(),
                adminAffiliateService.getGlobalSettings(),
                adminAffiliateService.getAllAffiliates()
            ]);

            if (statsRes.status === "fulfilled") setStats(statsRes.value);
            if (settingsRes.status === "fulfilled") setGlobalSettings(settingsRes.value);
            if (affiliatesRes.status === "fulfilled") setAffiliates(affiliatesRes.value || []);
        } catch (error) {
            console.error("Error loading affiliate data:", error);
            toast.error("Failed to load affiliate data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveGlobalSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingSettings(true);
        try {
            await adminAffiliateService.updateGlobalSettings(globalSettings);
            toast.success("Global affiliate settings saved!");
            fetchData();
        } catch (error) {
            console.error("Error updating global settings:", error);
            toast.error("Failed to update global settings");
        } finally {
            setSavingSettings(false);
        }
    };

    const handleUpdateAffiliate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAffiliate) return;
        setSavingUser(true);
        try {
            const customRateVal = editForm.custom_rate.trim() !== "" 
                ? parseFloat(editForm.custom_rate) / 100 
                : null;

            await adminAffiliateService.updateAffiliateConfig(selectedAffiliate.user_id, {
                custom_rate: customRateVal,
                is_enabled: editForm.is_enabled
            });
            toast.success("Affiliate settings updated successfully");
            setSelectedAffiliate(null);
            fetchData();
        } catch (error) {
            console.error("Error updating affiliate:", error);
            toast.error("Failed to update affiliate");
        } finally {
            setSavingUser(false);
        }
    };

    const formatCurrency = (val?: number) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(val || 0);

    const filteredAffiliates = affiliates.filter((a) =>
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.referral_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Affiliate Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure global settings, commission rates, and track performance.</p>
                </div>
                <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === "overview" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === "settings" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Global Settings
                    </button>
                    <button
                        onClick={() => setActiveTab("affiliates")}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                            activeTab === "affiliates" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Affiliates List ({affiliates.length})
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <LoadingSpinner message="Loading affiliate statistics..." />
                </div>
            ) : (
                <>
                    {/* Tab 1: Overview */}
                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <StatCard
                                    title="Active Affiliates"
                                    value={stats?.active_affiliates_count || 0}
                                    icon={Users}
                                    color="bg-blue-500"
                                />
                                <StatCard
                                    title="Total Referrals / Signups"
                                    value={stats?.total_signups || 0}
                                    icon={Share2}
                                    color="bg-purple-500"
                                />
                                <StatCard
                                    title="Referral Volume"
                                    value={formatCurrency(stats?.total_referral_volume)}
                                    icon={DollarSign}
                                    color="bg-green-500"
                                />
                                <StatCard
                                    title="Pending Earnings"
                                    value={formatCurrency(stats?.total_pending_earnings)}
                                    icon={Clock}
                                    color="bg-yellow-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Global Settings */}
                    {activeTab === "settings" && (
                        <div className="max-w-2xl">
                            <form onSubmit={handleSaveGlobalSettings} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Global Affiliate Program Settings</h3>
                                        <p className="text-xs text-slate-500">Configure default commission rates and payout thresholds.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            Default Commission Rate (%)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={(globalSettings.default_commission_rate * 100).toFixed(1)}
                                                onChange={(e) => setGlobalSettings({
                                                    ...globalSettings,
                                                    default_commission_rate: (parseFloat(e.target.value) || 0) / 100
                                                })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                                                required
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                                                %
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                                            Minimum Withdrawal Threshold ($)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                step="1"
                                                value={globalSettings.minimum_withdrawal_amount}
                                                onChange={(e) => setGlobalSettings({
                                                    ...globalSettings,
                                                    minimum_withdrawal_amount: parseFloat(e.target.value) || 0
                                                })}
                                                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={globalSettings.is_program_enabled}
                                                onChange={(e) => setGlobalSettings({
                                                    ...globalSettings,
                                                    is_program_enabled: e.target.checked
                                                })}
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                            />
                                            <div>
                                                <span className="text-sm font-semibold text-slate-900 block">
                                                    Enable Affiliate Program System-Wide
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    When disabled, new referral commissions will not be generated.
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        disabled={savingSettings}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {savingSettings ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save Settings
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tab 3: Affiliates List */}
                    {activeTab === "affiliates" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="relative w-72">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                    <input
                                        type="text"
                                        placeholder="Search affiliate name or code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                {filteredAffiliates.length === 0 ? (
                                    <div className="p-12 text-center text-slate-500">
                                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                        <p className="font-medium text-sm">No affiliates found matching your filter</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left text-sm text-slate-600">
                                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4">Affiliate</th>
                                                <th className="px-6 py-4">Referral Code</th>
                                                <th className="px-6 py-4">Commission Rate</th>
                                                <th className="px-6 py-4">Total Referrals</th>
                                                <th className="px-6 py-4">Total Earnings</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAffiliates.map((aff) => (
                                                <tr key={aff.user_id} className="hover:bg-slate-50/60 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-900">{aff.name}</div>
                                                        {aff.email && <div className="text-xs text-slate-400">{aff.email}</div>}
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                                                        {aff.referral_code}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-blue-600">
                                                        {aff.custom_rate !== null && aff.custom_rate !== undefined ? (
                                                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                                                                {(aff.custom_rate * 100).toFixed(1)}% (Custom)
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-600">
                                                                {((aff.current_commission_rate || globalSettings.default_commission_rate) * 100).toFixed(1)}% (Global)
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-slate-900">{aff.total_referrals}</td>
                                                    <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(aff.total_earnings)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedAffiliate(aff);
                                                                setEditForm({
                                                                    custom_rate: aff.custom_rate !== null && aff.custom_rate !== undefined 
                                                                        ? (aff.custom_rate * 100).toString() 
                                                                        : "",
                                                                    is_enabled: aff.is_enabled !== false
                                                                });
                                                            }}
                                                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                                                        >
                                                            Configure Rate
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Configure Modal */}
                    {selectedAffiliate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <div>
                                        <h3 className="font-bold text-slate-900">Configure Affiliate</h3>
                                        <p className="text-xs text-slate-500">{selectedAffiliate.name} ({selectedAffiliate.referral_code})</p>
                                    </div>
                                    <button onClick={() => setSelectedAffiliate(null)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleUpdateAffiliate} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Rate Override (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.1"
                                                placeholder="Leave empty for global default"
                                                value={editForm.custom_rate}
                                                onChange={(e) => setEditForm({ ...editForm, custom_rate: e.target.value })}
                                                className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                                                %
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Leave empty to use global default ({(globalSettings.default_commission_rate * 100).toFixed(1)}%).
                                        </p>
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={editForm.is_enabled}
                                                onChange={(e) => setEditForm({ ...editForm, is_enabled: e.target.checked })}
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                            />
                                            <span className="text-xs font-semibold text-slate-700">
                                                Affiliate Account Enabled
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedAffiliate(null)}
                                            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={savingUser}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm"
                                        >
                                            {savingUser ? (
                                                <>
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Settings"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
