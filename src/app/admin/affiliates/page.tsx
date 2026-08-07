// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { adminAffiliateService } from "@/services/admin-affiliate.service";
import { toast } from "react-hot-toast";
import { 
    Users, 
    DollarSign, 
    Share2, 
    Clock, 
    Check, 
    X, 
    Search, 
    Percent, 
    TrendingUp, 
    Loader2, 
    Save, 
    Settings, 
    CheckCircle 
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
        "bg-green-500": "shadow-emerald-500/30",
        "bg-yellow-500": "shadow-amber-500/30",
        "bg-blue-500": "shadow-blue-500/30",
        "bg-purple-500": "shadow-purple-500/30"
    };

    const gradient = gradientMap[color] || "from-slate-500 to-slate-600";
    const shadow = shadowMap[color] || "shadow-slate-500/30";

    return (
        <div className="relative bg-white p-6 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px]" />
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500`} />
            <div className="relative flex items-start justify-between mb-6">
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ${shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-6 h-6 text-white drop-shadow-sm" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    <TrendingUp className="w-3.5 h-3.5 group-hover:animate-bounce" />
                    <span className="text-xs font-semibold">+12%</span>
                </div>
            </div>
            <div className="relative">
                <h3 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{value}</h3>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </div>
    );
}

export default function AdminAffiliatesPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "commission" | "affiliates">("overview");
    const [stats, setStats] = useState<any>(null);
    const [globalRates, setGlobalRates] = useState<any>([]);
    const [affiliates, setAffiliates] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
    const [editForm, setEditForm] = useState<any>({
        custom_rate: "",
        is_enabled: true,
        current_commission_rate: 0
    });
    const [saving, setSaving] = useState(false);
    const [newTier, setNewTier] = useState({ min_referrals: "", rate: "" });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, ratesRes, affiliatesRes] = await Promise.allSettled([
                adminAffiliateService.getDashboardStats(),
                adminAffiliateService.getGlobalRates(),
                adminAffiliateService.getAllAffiliates()
            ]);

            if (statsRes.status === "fulfilled") setStats(statsRes.value);
            if (ratesRes.status === "fulfilled") setGlobalRates(ratesRes.value);
            if (affiliatesRes.status === "fulfilled") setAffiliates(affiliatesRes.value);
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

    const handleUpdateAffiliate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAffiliate) return;
        setSaving(true);
        try {
            await adminAffiliateService.updateAffiliateConfig(selectedAffiliate.user_id, {
                custom_rate: editForm.custom_rate ? parseFloat(editForm.custom_rate) / 100 : null,
                is_enabled: editForm.is_enabled
            });
            toast.success("Affiliate settings saved");
            setSelectedAffiliate(null);
            fetchData();
        } catch (error) {
            console.error("Error updating affiliate:", error);
            toast.error("Failed to update affiliate");
        } finally {
            setSaving(false);
        }
    };

    const handleAddTier = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTier.min_referrals || !newTier.rate) return;
        setSaving(true);
        try {
            await adminAffiliateService.createGlobalRate({
                min_referrals: parseInt(newTier.min_referrals),
                rate: parseFloat(newTier.rate) / 100
            });
            toast.success("Global rate tier added");
            setNewTier({ min_referrals: "", rate: "" });
            fetchData();
        } catch (error) {
            console.error("Error adding tier:", error);
            toast.error("Failed to add rate tier");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTier = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rate tier?")) return;
        try {
            await adminAffiliateService.deleteGlobalRate(id);
            toast.success("Tier deleted");
            fetchData();
        } catch (error) {
            console.error("Error deleting tier:", error);
            toast.error("Failed to delete tier");
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(val || 0);

    const filteredAffiliates = affiliates.filter((a: any) =>
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.referral_code?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Affiliate Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure global tiers, commissions, and track affiliate payouts.</p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === "overview" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("commission")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === "commission" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Global Tiers
                    </button>
                    <button
                        onClick={() => setActiveTab("affiliates")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            activeTab === "affiliates" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Affiliates List
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <LoadingSpinner message="Loading affiliate statistics..." />
                </div>
            ) : (
                <>
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
                                    title="Total Referrals"
                                    value={stats?.total_referrals || 0}
                                    icon={Share2}
                                    color="bg-purple-500"
                                />
                                <StatCard
                                    title="Total Earnings"
                                    value={formatCurrency(stats?.total_affiliate_earnings)}
                                    icon={DollarSign}
                                    color="bg-green-500"
                                />
                                <StatCard
                                    title="Pending Payouts"
                                    value={formatCurrency(stats?.pending_payouts_sum)}
                                    icon={Clock}
                                    color="bg-yellow-500"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "commission" && (
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900">Global Rate Tiers</h3>
                                    <span className="text-xs text-slate-500">Based on total successful referrals</span>
                                </div>

                                <form onSubmit={handleAddTier} className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min Referrals"
                                        value={newTier.min_referrals}
                                        onChange={(e) => setNewTier({ ...newTier, min_referrals: e.target.value })}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
                                        required
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Rate (%)"
                                        value={newTier.rate}
                                        onChange={(e) => setNewTier({ ...newTier, rate: e.target.value })}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        Add Tier
                                    </button>
                                </form>

                                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                                    {globalRates.map((tier: any) => (
                                        <div className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/50 transition-colors" key={tier.id}>
                                            <div>
                                                <span className="font-semibold text-slate-900 text-sm">{tier.min_referrals}+ Referrals</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-lg font-bold text-blue-600">{(tier.rate * 100).toFixed(1)}%</span>
                                                <button
                                                    onClick={() => handleDeleteTier(tier.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "affiliates" && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="relative w-72">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                    <input
                                        type="text"
                                        placeholder="Search affiliate name or code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left text-sm text-slate-600">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">Affiliate</th>
                                            <th className="px-6 py-4">Referral Code</th>
                                            <th className="px-6 py-4">Rate Override</th>
                                            <th className="px-6 py-4">Total Referrals</th>
                                            <th className="px-6 py-4">Total Earnings</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredAffiliates.map((aff: any) => (
                                            <tr key={aff.user_id} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4 font-medium text-slate-900">{aff.name}</td>
                                                <td className="px-6 py-4 font-mono text-xs">{aff.referral_code}</td>
                                                <td className="px-6 py-4 font-semibold text-blue-600">
                                                    {aff.custom_rate !== null ? `${(aff.custom_rate * 100).toFixed(1)}% (Custom)` : `${(aff.current_commission_rate * 100).toFixed(1)}% (Tier)`}
                                                </td>
                                                <td className="px-6 py-4">{aff.total_referrals}</td>
                                                <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(aff.total_earnings)}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedAffiliate(aff);
                                                            setEditForm({
                                                                custom_rate: aff.custom_rate !== null ? (aff.custom_rate * 100).toString() : "",
                                                                is_enabled: aff.is_enabled !== false,
                                                                current_commission_rate: aff.current_commission_rate
                                                            });
                                                        }}
                                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                                                    >
                                                        Configure
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedAffiliate && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900">Configure {selectedAffiliate.name}</h3>
                                    <button onClick={() => setSelectedAffiliate(null)} className="text-slate-400 hover:text-slate-600">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleUpdateAffiliate} className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Rate Override (%)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="Leave empty for tier default"
                                            value={editForm.custom_rate}
                                            onChange={(e) => setEditForm({ ...editForm, custom_rate: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedAffiliate(null)}
                                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {saving ? "Saving..." : "Save Settings"}
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
