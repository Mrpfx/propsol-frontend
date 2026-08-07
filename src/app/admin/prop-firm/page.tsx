// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { PropFirmRegistration } from "@/services/prop-firm.service";
import { Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";

export default function PropFirmPage() {
    const [registrations, setRegistrations] = useState<PropFirmRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const data = await adminService.getPropFirmRegistrations();
            setRegistrations(data);
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            // Optimistic update
            setRegistrations((prev) =>
                prev.map((reg) =>
                    reg.id === id ? { ...reg, account_status: newStatus as any } : reg
                )
            );
            await adminService.updatePropFirmRegistration(id, { account_status: newStatus as any });
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure (could be improved with a toast and proper revert)
            fetchRegistrations();
        }
    };

    const filteredRegistrations = registrations.filter((reg) => {
        const matchesSearch = reg.propfirm_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.login_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || reg.account_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "passed":
                return "bg-green-100 text-green-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Prop Firm Registrations</h2>
                    <p className="text-gray-500">Manage prop firm accounts and their statuses.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
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
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center">
                                    <div className="flex justify-center">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredRegistrations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    No registrations found
                                </td>
                            </tr>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {reg.propfirm_name}
                                    </td>
                                    <td className="px-6 py-4">{reg.login_id}</td>
                                    <td className="px-6 py-4">${reg.account_size.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                                reg.account_status
                                            )}`}
                                        >
                                            {reg.account_status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {reg.account_status !== 'passed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, 'passed')}
                                                    className="rounded p-1 text-green-600 hover:bg-green-50"
                                                    title="Mark as Passed"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {reg.account_status !== 'failed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, 'failed')}
                                                    className="rounded p-1 text-red-600 hover:bg-red-50"
                                                    title="Mark as Failed"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {reg.account_status !== 'in_progress' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, 'in_progress')}
                                                    className="rounded p-1 text-blue-600 hover:bg-blue-50"
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
        </div>
    );
}
