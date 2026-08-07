// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Plus, Trash2, Tag, Percent } from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"discounts" | "vat">("discounts");
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [vats, setVats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [discountName, setDiscountName] = useState("");
    const [discountCode, setDiscountCode] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");
    const [discountExpiry, setDiscountExpiry] = useState("");

    const [vatName, setVatName] = useState("");
    const [vatPercent, setVatPercent] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "discounts") {
                const data = await adminService.getDiscountCodes();
                setDiscounts(data);
            } else {
                const data = await adminService.getVats();
                setVats(data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleCreateDiscount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createDiscountCode({
                discount_name: discountName,
                discount_code: discountCode,
                percentage: parseFloat(discountPercent),
                expires_at: new Date(discountExpiry).toISOString(),
            });
            setDiscountName("");
            setDiscountCode("");
            setDiscountPercent("");
            setDiscountExpiry("");
            fetchData();
        } catch (error) {
            console.error("Failed to create discount", error);
        }
    };

    const handleCreateVat = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createVat({
                vat_name: vatName,
                percentage: parseFloat(vatPercent),
            });
            setVatName("");
            setVatPercent("");
            fetchData();
        } catch (error) {
            console.error("Failed to create VAT", error);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-500">Manage system configurations.</p>
            </div>

            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("discounts")}
                        className={`flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "discounts"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                    >
                        <Tag className="mr-2 h-4 w-4" />
                        Discount Codes
                    </button>
                    <button
                        onClick={() => setActiveTab("vat")}
                        className={`flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === "vat"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            }`}
                    >
                        <Percent className="mr-2 h-4 w-4" />
                        VAT Configuration
                    </button>
                </nav>
            </div>

            {activeTab === "discounts" && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Create Discount Form */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Create Discount Code</h3>
                        <form onSubmit={handleCreateDiscount} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    value={discountName}
                                    onChange={(e) => setDiscountName(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Percentage</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        max="100"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        value={discountPercent}
                                        onChange={(e) => setDiscountPercent(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expires At</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    value={discountExpiry}
                                    onChange={(e) => setDiscountExpiry(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Create Discount
                            </button>
                        </form>
                    </div>

                    {/* Discounts List */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-gray-900">Active Discounts</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {discounts.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No discounts found</div>
                            ) : (
                                discounts.map((discount) => (
                                    <div key={discount.id} className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{discount.discount_name}</p>
                                            <p className="text-sm text-gray-500">
                                                Code: <span className="font-mono font-bold">{discount.discount_code}</span> • {discount.percentage}% off
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Exp: {new Date(discount.expires_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "vat" && (
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Create VAT Form */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">Create VAT</h3>
                        <form onSubmit={handleCreateVat} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    value={vatName}
                                    onChange={(e) => setVatName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Percentage</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                    value={vatPercent}
                                    onChange={(e) => setVatPercent(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Create VAT
                            </button>
                        </form>
                    </div>

                    {/* VAT List */}
                    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-gray-900">VAT Configurations</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {vats.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">No VAT configurations found</div>
                            ) : (
                                vats.map((vat) => (
                                    <div key={vat.id} className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{vat.vat_name}</p>
                                        </div>
                                        <div className="font-bold text-gray-900">{vat.percentage}%</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
