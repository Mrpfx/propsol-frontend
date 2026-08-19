"use client";

import React, { useState, useEffect } from "react";
import { planService, Plan, PlanPrice } from "@/services/plan.service";
import { partnershipService, PartnershipPlan } from "@/services/partnership.service";
import { toast } from "react-hot-toast";
import { 
    CreditCard, 
    Edit, 
    RefreshCw, 
    Check, 
    X, 
    Sparkles, 
    DollarSign, 
    Layers,
    Loader2,
    Handshake
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface EditPlanModalProps {
    plan: any;
    isPartnership?: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

function EditPlanModal({ plan, isPartnership = false, isOpen, onClose, onSave }: EditPlanModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        subtitle: string;
        description: string;
        is_popular: boolean;
        highlight_text: string;
        prices: any[];
    }>({
        name: "",
        subtitle: "",
        description: "",
        is_popular: false,
        highlight_text: "",
        prices: []
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name || "",
                subtitle: plan.subtitle || "",
                description: plan.description || "",
                is_popular: !!plan.is_popular,
                highlight_text: plan.highlight_text || "",
                prices: (plan.prices || []).map((p: any) => ({ ...p }))
            });
        }
    }, [plan]);

    const handlePriceChange = (index: number, field: string, value: any) => {
        const updatedPrices = [...formData.prices];
        updatedPrices[index] = {
            ...updatedPrices[index],
            [field]: value
        };
        setFormData((prev) => ({
            ...prev,
            prices: updatedPrices
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isPartnership) {
                await partnershipService.updatePartnershipPlan(plan.id, formData);
                toast.success("Partnership plan updated successfully!");
            } else {
                await planService.updatePlan(plan.id, formData);
                toast.success("Prop Pass plan updated successfully!");
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to update plan:", error);
            toast.error("Failed to update plan");
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 my-8">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            {isPartnership ? <Handshake className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                Edit {isPartnership ? "Partnership Plan" : "Prop Pass Plan"}: {plan.name}
                            </h2>
                            <p className="text-xs text-slate-400">Slug: {plan.slug}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    {/* Plan Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Plan Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>

                    {/* Popular Badge Toggle & Highlight Text */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Highlight Badge Text
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. MOST POPULAR"
                                value={formData.highlight_text}
                                onChange={(e) => setFormData((prev) => ({ ...prev, highlight_text: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer w-full hover:bg-slate-100/80 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.is_popular}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, is_popular: e.target.checked }))}
                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Mark as Popular Plan
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Price Tiers */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-slate-700">
                                Pricing Tiers ({formData.prices.length})
                            </label>
                        </div>
                        <div className="space-y-3">
                            {formData.prices.map((priceItem, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"
                                >
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">
                                            Account Size (Display Name)
                                        </label>
                                        <input
                                            type="text"
                                            value={priceItem.account_size_display}
                                            onChange={(e) =>
                                                handlePriceChange(index, "account_size_display", e.target.value)
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">
                                            Price ($ USD)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={priceItem.price}
                                                onChange={(e) =>
                                                    handlePriceChange(index, "price", parseFloat(e.target.value) || 0)
                                                }
                                                className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:border-blue-500 outline-none font-semibold text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminPlansPage() {
    const [activeTab, setActiveTab] = useState<"pass" | "partnership">("pass");
    const [passPlans, setPassPlans] = useState<Plan[]>([]);
    const [partnershipPlans, setPartnershipPlans] = useState<PartnershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const [pPlans, ptPlans] = await Promise.all([
                planService.getAllPlans().catch(() => []),
                partnershipService.getPartnershipPlans().catch(() => [])
            ]);
            setPassPlans(pPlans);
            setPartnershipPlans(ptPlans);
        } catch (error) {
            console.error("Failed to fetch plans:", error);
            toast.error("Failed to fetch plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const currentPlans = activeTab === "pass" ? passPlans : partnershipPlans;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Manage Pricing Plans
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Configure funding challenge plans, partnership models, tiers, and pricing.
                    </p>
                </div>
                <button
                    onClick={fetchPlans}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh Plans
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                    onClick={() => setActiveTab("pass")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        activeTab === "pass"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <CreditCard className="w-4 h-4" />
                    <span>Prop Pass Plans ({passPlans.length})</span>
                </button>

                <button
                    onClick={() => setActiveTab("partnership")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        activeTab === "partnership"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                >
                    <Handshake className="w-4 h-4" />
                    <span>Partnership Plans ({partnershipPlans.length})</span>
                </button>
            </div>

            {/* Plans Grid */}
            {loading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <LoadingSpinner size="md" message="Loading pricing plans..." />
                </div>
            ) : currentPlans.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                        No {activeTab === "pass" ? "Prop Pass" : "Partnership"} plans found
                    </p>
                    <p className="text-slate-400 text-xs mt-1">Please ensure backend initial seeding has completed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPlans.map((plan: any) => (
                        <div
                            key={plan.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative"
                        >
                            {/* Popular Badge */}
                            {plan.is_popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-300" />
                                    {plan.highlight_text || "POPULAR"}
                                </div>
                            )}

                            {/* Plan Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="mb-4 pr-16">
                                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                                    {plan.subtitle && (
                                        <p className="text-sm font-semibold text-blue-600 mt-0.5">
                                            {plan.subtitle}
                                        </p>
                                    )}
                                </div>

                                {plan.description && (
                                    <p className="text-xs text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                                        {plan.description}
                                    </p>
                                )}

                                {/* Price Tiers List */}
                                <div className="mb-6 space-y-2 rounded-xl bg-slate-50 p-4 border border-slate-100 flex-1">
                                    <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                                        Pricing Tiers
                                    </p>
                                    {(plan.prices || []).map((price: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
                                        >
                                            <span className="text-slate-600 font-medium">
                                                {price.account_size_display}
                                            </span>
                                            <span className="font-bold text-slate-900">
                                                ${price.price?.toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={() => {
                                        setSelectedPlan(plan);
                                        setIsEditOpen(true);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit {activeTab === "partnership" ? "Partnership Plan" : "Plan"}
                                </button>
                            </div>

                            {/* Footer Slug */}
                            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                                <span>Slug</span>
                                <span className="font-mono text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded text-[11px]">
                                    {plan.slug}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {selectedPlan && (
                <EditPlanModal
                    plan={selectedPlan}
                    isPartnership={activeTab === "partnership"}
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    onSave={fetchPlans}
                />
            )}
        </div>
    );
}
