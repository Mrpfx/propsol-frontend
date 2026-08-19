// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { PropFirmRegistration } from "@/services/prop-firm.service";
import { Search, Filter, CheckCircle, XCircle, Clock, Eye, Pencil, X, Loader2, Save, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function PropFirmPage() {
    const [registrations, setRegistrations] = useState<PropFirmRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [selectedRegistration, setSelectedRegistration] = useState<PropFirmRegistration | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const data = await adminService.getPropFirmRegistrations();
            setRegistrations(data);
        } catch (error) {
            console.error("Failed to fetch registrations", error);
            toast.error("Failed to load registrations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            setRegistrations((prev) =>
                prev.map((reg) =>
                    reg.id === id ? { ...reg, account_status: newStatus as any } : reg
                )
            );
            await adminService.updatePropFirmRegistration(id, { account_status: newStatus as any });
            toast.success(`Account status updated to ${newStatus.replace("_", " ")}`);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
            fetchRegistrations();
        }
    };

    const handleOpenView = (reg: PropFirmRegistration) => {
        setSelectedRegistration(reg);
        setIsViewModalOpen(true);
    };

    const handleOpenEdit = (reg: PropFirmRegistration) => {
        setSelectedRegistration(reg);
        setEditFormData({
            login_id: reg.login_id || "",
            password: reg.password || "",
            server_name: reg.server_name || "",
            server_type: reg.server_type || "MT5",
            trading_platform: reg.trading_platform || "MT5",
            challenges_step: reg.challenges_step || 1,
            account_status: reg.account_status || "pending",
            payment_status: reg.payment_status || "pending",
            whatsapp_no: reg.whatsapp_no || "",
            telegram_username: reg.telegram_username || "",
            propfirm_rules: reg.propfirm_rules || "",
        });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedRegistration) return;
        setSaving(true);
        try {
            await adminService.updatePropFirmRegistration(selectedRegistration.id, editFormData);
            toast.success("Registration updated successfully");
            setIsEditModalOpen(false);
            fetchRegistrations();
        } catch (error) {
            console.error("Failed to update registration", error);
            toast.error("Failed to update registration");
        } finally {
            setSaving(false);
        }
    };

    const filteredRegistrations = registrations.filter((reg) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            (reg.propfirm_name || "").toLowerCase().includes(query) ||
            (reg.login_id || "").toLowerCase().includes(query) ||
            (reg.user_name || "").toLowerCase().includes(query) ||
            (reg.user_email || "").toLowerCase().includes(query) ||
            (reg.order_id || "").toLowerCase().includes(query);
        const matchesStatus = statusFilter === "all" || reg.account_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "passed":
                return "bg-green-100 text-green-800 border border-green-200";
            case "failed":
                return "bg-red-100 text-red-800 border border-red-200";
            case "pending":
                return "bg-yellow-100 text-yellow-800 border border-yellow-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200";
        }
    };

    const getPaymentStatusBadge = (status?: string) => {
        const s = (status || "pending").toLowerCase();
        if (s === "completed" || s === "paid") {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-800 border border-green-200">Paid / Completed</span>;
        } else if (s === "failed" || s === "cancelled" || s === "expired") {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">Failed / Cancelled</span>;
        } else {
            return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">Payment Pending</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Prop Firm Pass Registrations</h2>
                    <p className="text-gray-500 text-sm">Manage PropSol Pass accounts, review credentials, and monitor evaluations.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
                            placeholder="Search prop firm, login, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending Setup</option>
                        <option value="in_progress">In Progress</option>
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Prop Firm</th>
                            <th scope="col" className="px-6 py-3">Login ID</th>
                            <th scope="col" className="px-6 py-3">Account Size</th>
                            <th scope="col" className="px-6 py-3">Payment Status</th>
                            <th scope="col" className="px-6 py-3">Account Status</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center">
                                    <div className="flex justify-center">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredRegistrations.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No registrations found
                                </td>
                            </tr>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{reg.propfirm_name}</div>
                                        {reg.user_email && (
                                            <div className="text-xs text-gray-400">{reg.user_email}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-700">{reg.login_id || "N/A"}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        ${reg.account_size ? reg.account_size.toLocaleString() : "0"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getPaymentStatusBadge(reg.payment_status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getStatusColor(
                                                reg.account_status
                                            )}`}
                                        >
                                            {(reg.account_status || "pending").replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {reg.created_at ? new Date(reg.created_at).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {/* View Details Button */}
                                            <button
                                                onClick={() => handleOpenView(reg)}
                                                className="rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                                title="View Full Registration Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>

                                            {/* Edit Registration Button */}
                                            <button
                                                onClick={() => handleOpenEdit(reg)}
                                                className="rounded p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                title="Edit Registration"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            {/* Status Shortcut Buttons */}
                                            {reg.account_status !== 'passed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, 'passed')}
                                                    className="rounded p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                                                    title="Mark as Passed"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {reg.account_status !== 'failed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, 'failed')}
                                                    className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Mark as Failed"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {reg.account_status !== 'in_progress' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, 'in_progress')}
                                                    className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Mark as In Progress"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {isViewModalOpen && selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Prop Firm Registration Details</h3>
                                <p className="text-xs text-gray-400 font-mono">Order ID: {selectedRegistration.order_id || selectedRegistration.id}</p>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 py-4 text-sm text-gray-700">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                    <span className="text-xs text-gray-400 block">User Name</span>
                                    <span className="font-semibold text-gray-900">{selectedRegistration.user_name || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">User Email</span>
                                    <span className="font-semibold text-gray-900">{selectedRegistration.user_email || "N/A"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-400 block">Prop Firm Name</span>
                                    <span className="font-semibold text-gray-900">{selectedRegistration.propfirm_name}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Website Link</span>
                                    {selectedRegistration.propfirm_website_link ? (
                                        <a href={selectedRegistration.propfirm_website_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                                            Visit Link <ExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-400 block">Login ID</span>
                                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800 font-semibold">{selectedRegistration.login_id || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Trading Password</span>
                                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">{selectedRegistration.password || "••••••••"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-400 block">Server Name</span>
                                    <span className="font-medium text-gray-900">{selectedRegistration.server_name || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Trading Platform</span>
                                    <span className="font-medium text-gray-900">{selectedRegistration.trading_platform || selectedRegistration.server_type || "MT5"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-400 block">Account Size</span>
                                    <span className="font-bold text-gray-900">${selectedRegistration.account_size ? selectedRegistration.account_size.toLocaleString() : "0"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Package Cost</span>
                                    <span className="font-bold text-emerald-600">${selectedRegistration.propfirm_account_cost ? selectedRegistration.propfirm_account_cost.toFixed(2) : "0.00"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Account Status</span>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${getStatusColor(selectedRegistration.account_status)}`}>
                                        {(selectedRegistration.account_status || "pending").replace("_", " ")}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Payment Status</span>
                                    {getPaymentStatusBadge(selectedRegistration.payment_status)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-400 block">WhatsApp Number</span>
                                    <span className="font-medium text-gray-900">{selectedRegistration.whatsapp_no || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Telegram Username</span>
                                    <span className="font-medium text-gray-900">{selectedRegistration.telegram_username || "N/A"}</span>
                                </div>
                            </div>

                            {selectedRegistration.propfirm_rules && (
                                <div>
                                    <span className="text-xs text-gray-400 block mb-1">Notes & Special Instructions</span>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-700 whitespace-pre-wrap">
                                        {selectedRegistration.propfirm_rules}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                            <button
                                onClick={() => {
                                    setIsViewModalOpen(false);
                                    handleOpenEdit(selectedRegistration);
                                }}
                                className="px-4 py-2 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                            >
                                Edit This Registration
                            </button>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Edit Prop Firm Registration</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Login ID</label>
                                    <input
                                        type="text"
                                        value={editFormData.login_id}
                                        onChange={(e) => setEditFormData({ ...editFormData, login_id: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Trading Password</label>
                                    <input
                                        type="text"
                                        value={editFormData.password}
                                        onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Server Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.server_name}
                                        onChange={(e) => setEditFormData({ ...editFormData, server_name: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Trading Platform</label>
                                    <input
                                        type="text"
                                        value={editFormData.trading_platform}
                                        onChange={(e) => setEditFormData({ ...editFormData, trading_platform: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Account Status</label>
                                    <select
                                        value={editFormData.account_status}
                                        onChange={(e) => setEditFormData({ ...editFormData, account_status: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="pending">Pending Setup</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="passed">Passed</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Payment Status</label>
                                    <select
                                        value={editFormData.payment_status}
                                        onChange={(e) => setEditFormData({ ...editFormData, payment_status: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed / Paid</option>
                                        <option value="failed">Failed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={editFormData.whatsapp_no}
                                        onChange={(e) => setEditFormData({ ...editFormData, whatsapp_no: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Telegram</label>
                                    <input
                                        type="text"
                                        value={editFormData.telegram_username}
                                        onChange={(e) => setEditFormData({ ...editFormData, telegram_username: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-gray-700 block mb-1">Notes / Rules</label>
                                <textarea
                                    rows={3}
                                    value={editFormData.propfirm_rules}
                                    onChange={(e) => setEditFormData({ ...editFormData, propfirm_rules: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-900 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleSaveEdit}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-xs font-semibold text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

