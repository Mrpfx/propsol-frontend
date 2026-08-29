"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { propFirmService, PropFirmRegistration } from "@/services/prop-firm.service";

interface AccountEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    account?: PropFirmRegistration;
    onUpdate: (updatedAccount: PropFirmRegistration) => void;
}

export function AccountEditModal({
    isOpen,
    onClose,
    account,
    onUpdate
}: AccountEditModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        login_id: "",
        password: "",
        server_name: "",
        trading_platform: "",
        whatsapp_no: "",
        telegram_username: ""
    });

    useEffect(() => {
        if (isOpen && account) {
            setFormData({
                login_id: account.login_id || "",
                password: account.password || "",
                server_name: account.server_name || "",
                trading_platform: account.trading_platform || "",
                whatsapp_no: account.whatsapp_no || "",
                telegram_username: account.telegram_username || ""
            });
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, account]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account) return;
        setSubmitting(true);
        try {
            let updated;
            try {
                const { partnershipService } = await import("@/services/partnership.service");
                updated = await partnershipService.updatePartnership(account.id, formData);
            } catch (err) {
                updated = await propFirmService.updateRegistration(account.id, formData);
            }
            toast.success("Account details updated successfully");
            onUpdate(updated);
            onClose();
        } catch (err) {
            console.error("Failed to update account:", err);
            toast.error("Failed to update account details");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-gray-900">
                <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            Edit Account Credentials
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Update your login ID, password, server, or contact details
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="login_id" className="text-xs font-semibold text-gray-700">
                                Login ID / Account #
                            </label>
                            <input
                                id="login_id"
                                name="login_id"
                                type="text"
                                value={formData.login_id}
                                onChange={handleChange}
                                placeholder="e.g. 8839201"
                                className="flex h-10 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-xs font-semibold text-gray-700">
                                Account Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="text"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Trading Password"
                                className="flex h-10 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="server_name" className="text-xs font-semibold text-gray-700">
                                Server Name
                            </label>
                            <input
                                id="server_name"
                                name="server_name"
                                type="text"
                                value={formData.server_name}
                                onChange={handleChange}
                                placeholder="e.g. FTMO-Server"
                                className="flex h-10 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="trading_platform" className="text-xs font-semibold text-gray-700">
                                Platform
                            </label>
                            <input
                                id="trading_platform"
                                name="trading_platform"
                                type="text"
                                value={formData.trading_platform}
                                onChange={handleChange}
                                placeholder="e.g. MT5 / MT4 / cTrader"
                                className="flex h-10 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="whatsapp_no" className="text-xs font-semibold text-gray-700">
                                WhatsApp Number
                            </label>
                            <input
                                id="whatsapp_no"
                                name="whatsapp_no"
                                type="text"
                                value={formData.whatsapp_no}
                                onChange={handleChange}
                                placeholder="+1234567890"
                                className="flex h-10 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="telegram_username" className="text-xs font-semibold text-gray-700">
                                Telegram Username
                            </label>
                            <input
                                id="telegram_username"
                                name="telegram_username"
                                type="text"
                                value={formData.telegram_username}
                                onChange={handleChange}
                                placeholder="@username"
                                className="flex h-10 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-xl border border-transparent bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
