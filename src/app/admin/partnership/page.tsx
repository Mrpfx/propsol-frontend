// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { PropFirmRegistration } from "@/services/prop-firm.service";
import { 
    Search, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Handshake, 
    Filter, 
    Eye, 
    ShieldCheck, 
    DollarSign,
    Pencil,
    Loader2,
    Save
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPartnershipPage() {
    const [registrations, setRegistrations] = useState<PropFirmRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegistration, setSelectedRegistration] = useState<PropFirmRegistration | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const { partnershipService } = await import("@/services/partnership.service");
            let data = [];
            try {
                data = await partnershipService.getAdminPartnerships();
            } catch (e) {
                console.warn("Partnership endpoint fallback:", e);
                data = await adminService.getPropFirmRegistrations();
            }
            // If partnership returns empty, also fetch prop firm registrations for fallback
            if (!data || data.length === 0) {
                const propFirmData = await adminService.getPropFirmRegistrations();
                data = propFirmData;
            }
            setRegistrations(data);
        } catch (error) {
            console.error("Failed to fetch partnership registrations", error);
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
            const { partnershipService } = await import("@/services/partnership.service");
            try {
                await partnershipService.updateAdminPartnership(id, { account_status: newStatus as any });
            } catch (err) {
                await adminService.updatePropFirmRegistration(id, { account_status: newStatus as any });
            }
            toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
            fetchRegistrations();
        }
    };

    const handleOpenEdit = (reg: PropFirmRegistration) => {
        setSelectedRegistration(reg);
        setEditFormData({
            login_id: reg.login_id || "",
            password: reg.password || "",
            server_name: reg.server_name || "",
            trading_platform: reg.trading_platform || "",
            challenges_step: reg.challenges_step || 1,
            account_status: reg.account_status || "pending",
            payment_status: reg.payment_status || "pending",
            whatsapp_no: reg.whatsapp_no || "",
            telegram_username: reg.telegram_username || "",
            propfirm_rules: reg.propfirm_rules || "",
            admin_notes: reg.admin_notes || ""
        });
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedRegistration) return;
        setSaving(true);
        try {
            const { partnershipService } = await import("@/services/partnership.service");
            let updated;
            try {
                updated = await partnershipService.updateAdminPartnership(selectedRegistration.id, editFormData);
            } catch (err) {
                updated = await adminService.updatePropFirmRegistration(selectedRegistration.id, editFormData);
            }
            setRegistrations((prev) =>
                prev.map((reg) => (reg.id === selectedRegistration.id ? { ...reg, ...editFormData } : reg))
            );
            setSelectedRegistration({ ...selectedRegistration, ...editFormData });
            toast.success("Registration details saved");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save changes", error);
            toast.error("Failed to save registration changes");
        } finally {
            setSaving(false);
        }
    };

    const filteredRegistrations = registrations.filter((reg) => {
        const matchesSearch =
            (reg.propfirm_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.login_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.whatsapp_no || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.telegram_username || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || reg.account_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "passed":
                return "bg-green-50 text-green-700 border border-green-200";
            case "failed":
                return "bg-red-50 text-red-700 border border-red-200";
            case "in_progress":
                return "bg-blue-50 text-blue-700 border border-blue-200";
            case "pending":
            default:
                return "bg-amber-50 text-amber-700 border border-amber-200";
        }
    };

    const getPaymentStatusBadge = (status?: string) => {
        const s = (status || "pending").toLowerCase();
        if (s === "completed" || s === "paid") {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Paid</span>;
        } else if (s === "failed" || s === "cancelled" || s === "expired") {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Failed</span>;
        } else {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
        }
    };

    const totalPartnerships = registrations.length;
    const activePartnerships = registrations.filter((r) => r.account_status === "in_progress").length;
    const passedPartnerships = registrations.filter((r) => r.account_status === "passed").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                            <Handshake className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Partnership Registrations</h2>
                            <p className="mt-0.5 text-sm text-gray-500">
                                Monitor, review, and manage active PropSol Partnership accounts and user evaluations.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <a
                        href="/admin/plans"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-all shadow-sm"
                    >
                        <DollarSign className="w-4 h-4" />
                        <span>Manage Partnership Pricing</span>
                    </a>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-56 shadow-sm"
                            placeholder="Search prop firm, login..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
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

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Total Partnerships</span>
                        <Handshake className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">{totalPartnerships}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">In Progress</span>
                        <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-amber-600">{activePartnerships}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">Passed Accounts</span>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-green-600">{passedPartnerships}</p>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3.5">Prop Firm & Model</th>
                            <th scope="col" className="px-6 py-3.5">Login ID</th>
                            <th scope="col" className="px-6 py-3.5">Account Size</th>
                            <th scope="col" className="px-6 py-3.5">Cost</th>
                            <th scope="col" className="px-6 py-3.5">Payment</th>
                            <th scope="col" className="px-6 py-3.5">Account Status</th>
                            <th scope="col" className="px-6 py-3.5">Date</th>
                            <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center">
                                    <div className="flex justify-center">
                                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredRegistrations.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    No partnership registrations found
                                </td>
                            </tr>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{reg.propfirm_name}</div>
                                        <div className="text-xs text-blue-600 font-medium">
                                            {reg.propfirm_rules?.includes("Instant") ? "Instant Partnership" : "Challenge Partnership"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-700">{reg.login_id || "N/A"}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                        ${reg.account_size ? reg.account_size.toLocaleString() : "0"}
                                    </td>
                                    <td className="px-6 py-4 text-green-600 font-medium">
                                        ${reg.propfirm_account_cost ? reg.propfirm_account_cost.toFixed(2) : "0.00"}
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
                                            <button
                                                onClick={() => {
                                                    setSelectedRegistration(reg);
                                                    setIsEditing(false);
                                                }}
                                                className="rounded p-1.5 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => handleOpenEdit(reg)}
                                                className="rounded p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                title="Edit Registration"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            {reg.account_status !== "in_progress" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, "in_progress")}
                                                    className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Set to In Progress"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                </button>
                                            )}

                                            {reg.account_status !== "passed" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, "passed")}
                                                    className="rounded p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                                                    title="Mark as Passed"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}

                                            {reg.account_status !== "failed" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, "failed")}
                                                    className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Mark as Failed"
                                                >
                                                    <XCircle className="h-4 w-4" />
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

            {/* Modal for Details / Editing */}
            {selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                                {isEditing ? "Edit Registration Details" : "Registration Details"}
                            </h3>
                            <button
                                onClick={() => {
                                    setSelectedRegistration(null);
                                    setIsEditing(false);
                                }}
                                className="rounded-lg text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        {isEditing ? (
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 block mb-1">Login ID</label>
                                        <input
                                            type="text"
                                            value={editFormData.login_id}
                                            onChange={(e) => setEditFormData({ ...editFormData, login_id: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 font-mono text-xs focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 block mb-1">Password</label>
                                        <input
                                            type="text"
                                            value={editFormData.password}
                                            onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 font-mono text-xs focus:border-blue-500 focus:outline-none"
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
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 text-xs focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 block mb-1">Platform</label>
                                        <input
                                            type="text"
                                            value={editFormData.trading_platform}
                                            onChange={(e) => setEditFormData({ ...editFormData, trading_platform: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 text-xs focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 block mb-1">Account Status</label>
                                        <select
                                            value={editFormData.account_status}
                                            onChange={(e) => setEditFormData({ ...editFormData, account_status: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 text-xs focus:border-blue-500 focus:outline-none"
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
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 text-xs focus:border-blue-500 focus:outline-none"
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
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 text-xs focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 block mb-1">Telegram</label>
                                        <input
                                            type="text"
                                            value={editFormData.telegram_username}
                                            onChange={(e) => setEditFormData({ ...editFormData, telegram_username: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 text-xs focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-700 block mb-1">Notes / Rules</label>
                                    <textarea
                                        rows={3}
                                        value={editFormData.propfirm_rules}
                                        onChange={(e) => setEditFormData({ ...editFormData, propfirm_rules: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 font-mono text-xs focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={handleSaveEdit}
                                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                    >
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Prop Firm:</span>
                                    <span className="font-semibold text-gray-900">{selectedRegistration.propfirm_name}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Login ID:</span>
                                    <span className="font-mono text-blue-600 font-medium">{selectedRegistration.login_id || "N/A"}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Trading Password:</span>
                                    <span className="font-mono text-gray-700">{selectedRegistration.password || "••••••••"}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Account Size:</span>
                                    <span className="font-bold text-green-600">
                                        ${selectedRegistration.account_size?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Server Name:</span>
                                    <span className="text-gray-900">{selectedRegistration.server_name || "MT5 Server"}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Platform:</span>
                                    <span className="text-gray-900">{selectedRegistration.trading_platform || "MetaTrader 5"}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">WhatsApp:</span>
                                    <span className="text-gray-900">{selectedRegistration.whatsapp_no || "N/A"}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500">Telegram:</span>
                                    <span className="text-gray-900">{selectedRegistration.telegram_username || "N/A"}</span>
                                </div>
                                <div className="py-1">
                                    <span className="text-gray-500 block mb-1">Notes / Rules:</span>
                                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-700">
                                        {selectedRegistration.propfirm_rules || "None"}
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-between items-center">
                                    <button
                                        onClick={() => handleOpenEdit(selectedRegistration)}
                                        className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs flex items-center gap-1.5 transition-colors border border-blue-200"
                                    >
                                        <Pencil className="h-3.5 w-3.5" /> Edit Registration
                                    </button>
                                    <button
                                        onClick={() => setSelectedRegistration(null)}
                                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
