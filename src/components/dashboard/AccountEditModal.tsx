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
        trading_platform: ""
    });

    useEffect(() => {
        if (isOpen && account) {
            setFormData({
                login_id: account.login_id || "",
                password: account.password || "",
                server_name: account.server_name || "",
                trading_platform: account.trading_platform || ""
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
            const updated = await propFirmService.updateRegistration(account.id, formData);
            toast.success("Account updated successfully");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        Edit Prop Firm Registration
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="login_id" className="text-sm font-medium text-gray-700">
                            Login ID
                        </label>
                        <input
                            id="login_id"
                            name="login_id"
                            type="text"
                            value={formData.login_id}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="text"
                            value={formData.password}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="server_name" className="text-sm font-medium text-gray-700">
                            Server Name
                        </label>
                        <input
                            id="server_name"
                            name="server_name"
                            type="text"
                            value={formData.server_name}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="trading_platform" className="text-sm font-medium text-gray-700">
                            Platform
                        </label>
                        <input
                            id="trading_platform"
                            name="trading_platform"
                            type="text"
                            value={formData.trading_platform}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
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
