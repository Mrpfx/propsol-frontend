// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { PropFirmRegistration } from "@/services/prop-firm.service";
import { Search, CheckCircle, XCircle, Clock, Handshake, Filter, Eye, ShieldCheck, DollarSign } from "lucide-react";

export default function AdminPartnershipPage() {
    const [registrations, setRegistrations] = useState<PropFirmRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegistration, setSelectedRegistration] = useState<PropFirmRegistration | null>(null);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const data = await adminService.getPropFirmRegistrations();
            // Filter for partnership model registrations or display all prop firm registrations with partnership focus
            const partnershipData = data.filter(
                (reg) => reg.propfirm_rules?.toLowerCase().includes("partnership") || true
            );
            setRegistrations(partnershipData);
        } catch (error) {
            console.error("Failed to fetch partnership registrations", error);
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
        } catch (error) {
            console.error("Failed to update status", error);
            fetchRegistrations();
        }
    };

    const filteredRegistrations = registrations.filter((reg) => {
        const matchesSearch =
            (reg.propfirm_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (reg.login_id || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || reg.account_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "passed":
                return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
            case "failed":
                return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
            case "in_progress":
                return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
            case "pending":
            default:
                return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
        }
    };

    const totalPartnerships = registrations.length;
    const activePartnerships = registrations.filter((r) => r.account_status === "in_progress").length;
    const passedPartnerships = registrations.filter((r) => r.account_status === "passed").length;

    return (
        <div className="space-y-6 text-gray-100">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                            <Handshake className="h-5 w-5" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Partnership Registrations</h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        Monitor, review, and manage active PropSol Partnership accounts and user evaluations.
                    </p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-gray-700 bg-[#111836] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
                            placeholder="Search prop firm or login..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="rounded-lg border border-gray-700 bg-[#111836] px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <div className="rounded-xl border border-gray-800 bg-[#111836] p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Total Partnerships</span>
                        <Handshake className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-white">{totalPartnerships}</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-[#111836] p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">In Progress</span>
                        <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-amber-400">{activePartnerships}</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-[#111836] p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">Passed Accounts</span>
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-emerald-400">{passedPartnerships}</p>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#111836] shadow-sm">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-[#1A2040] text-xs uppercase text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3.5">Prop Firm & Model</th>
                            <th scope="col" className="px-6 py-3.5">Login ID</th>
                            <th scope="col" className="px-6 py-3.5">Account Size</th>
                            <th scope="col" className="px-6 py-3.5">Cost</th>
                            <th scope="col" className="px-6 py-3.5">Status</th>
                            <th scope="col" className="px-6 py-3.5">Date</th>
                            <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="flex justify-center">
                                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredRegistrations.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                    No partnership registrations found
                                </td>
                            </tr>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white">{reg.propfirm_name}</div>
                                        <div className="text-xs text-blue-400 font-medium">
                                            {reg.propfirm_rules?.includes("Instant") ? "Instant Partnership" : "Challenge Partnership"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-gray-300">{reg.login_id || "N/A"}</td>
                                    <td className="px-6 py-4 font-semibold text-white">
                                        ${reg.account_size ? reg.account_size.toLocaleString() : "0"}
                                    </td>
                                    <td className="px-6 py-4 text-emerald-400 font-medium">
                                        ${reg.propfirm_account_cost ? reg.propfirm_account_cost.toFixed(2) : "0.00"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusColor(
                                                reg.account_status
                                            )}`}
                                        >
                                            {(reg.account_status || "pending").replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        {reg.created_at ? new Date(reg.created_at).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedRegistration(reg)}
                                                className="rounded-lg bg-gray-800 p-1.5 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>

                                            {reg.account_status !== "in_progress" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, "in_progress")}
                                                    className="rounded-lg bg-blue-500/10 p-1.5 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                    title="Set to In Progress"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                </button>
                                            )}

                                            {reg.account_status !== "passed" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, "passed")}
                                                    className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                    title="Mark as Passed"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}

                                            {reg.account_status !== "failed" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, "failed")}
                                                    className="rounded-lg bg-rose-500/10 p-1.5 text-rose-400 hover:bg-rose-500/20 transition-colors"
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

            {/* Modal for Details */}
            {selectedRegistration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-[#111836] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-400" />
                                Registration Details
                            </h3>
                            <button
                                onClick={() => setSelectedRegistration(null)}
                                className="rounded-lg text-gray-400 hover:text-white p-1 hover:bg-gray-800"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-1 border-b border-gray-800/50">
                                <span className="text-gray-400">Prop Firm:</span>
                                <span className="font-semibold text-white">{selectedRegistration.propfirm_name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-800/50">
                                <span className="text-gray-400">Login ID:</span>
                                <span className="font-mono text-blue-400">{selectedRegistration.login_id}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-800/50">
                                <span className="text-gray-400">Account Size:</span>
                                <span className="font-bold text-emerald-400">
                                    ${selectedRegistration.account_size?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-800/50">
                                <span className="text-gray-400">Server Name:</span>
                                <span className="text-white">{selectedRegistration.server_name || "MT5 Server"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-800/50">
                                <span className="text-gray-400">Platform:</span>
                                <span className="text-white">{selectedRegistration.trading_platform || "MetaTrader 5"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-800/50">
                                <span className="text-gray-400">WhatsApp:</span>
                                <span className="text-white">{selectedRegistration.whatsapp_no || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-gray-800/50">
                                <span className="text-gray-400">Telegram:</span>
                                <span className="text-white">{selectedRegistration.telegram_username || "N/A"}</span>
                            </div>
                            <div className="py-1">
                                <span className="text-gray-400 block mb-1">Notes / Rules:</span>
                                <div className="p-3 rounded-lg bg-gray-900 text-xs font-mono text-gray-300">
                                    {selectedRegistration.propfirm_rules || "None"}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedRegistration(null)}
                                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
