// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { 
    Search, 
    CreditCard, 
    Calendar, 
    DollarSign, 
    CheckCircle, 
    Clock, 
    XCircle, 
    RefreshCw, 
    Filter,
    ShieldCheck,
    Coins,
    User as UserIcon,
    Loader2,
    ArrowUpDown,
    ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

interface UnifiedPayment {
    id: string;
    user_id?: string;
    user_email?: string;
    user_name?: string;
    provider: string; // "nowpayments", "whop", "card", "propfirm", "partnership"
    payment_method: string;
    amount: number;
    currency: string;
    payment_status: string; // "completed", "pending", "failed"
    description?: string;
    reference?: string;
    created_at: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<UnifiedPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [providerFilter, setProviderFilter] = useState("all");
    const [syncingId, setSyncingId] = useState<string | null>(null);

    // Sync / Diagnose Modal state
    const [isDiagnoseOpen, setIsDiagnoseOpen] = useState(false);
    const [diagnoseProvider, setDiagnoseProvider] = useState("whop");
    const [diagnoseIdentifier, setDiagnoseIdentifier] = useState("");
    const [diagnosing, setDiagnosing] = useState(false);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await adminService.getPayments();
            setPayments(data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
            toast.error("Failed to load payment records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleSyncPayment = async (payment: UnifiedPayment) => {
        setSyncingId(payment.id);
        try {
            const providerKey = payment.provider === "nowpayments" ? "nowpayments" : "whop";
            const identifier = payment.reference || payment.id || payment.user_email || "";
            
            const res = await adminService.diagnosePayment({
                provider: providerKey,
                identifier: identifier,
                force_sync: true
            });

            if (res.action_taken && res.action_taken !== "None") {
                toast.success(`Sync result: ${res.action_taken}`);
            } else if (res.mismatch) {
                toast.error(`Mismatch found: Local (${res.local_status}) vs Remote (${res.remote_status})`);
            } else {
                toast.success(`Status verified: ${res.local_status || "OK"}`);
            }
            fetchPayments();
        } catch (err: any) {
            console.error("Sync error:", err);
            toast.error(err.response?.data?.detail || "Failed to sync payment status");
        } finally {
            setSyncingId(null);
        }
    };

    const handleCustomDiagnose = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!diagnoseIdentifier.trim()) {
            toast.error("Please enter a Payment ID, Order ID (e.g. PS-2XPCW9BB), or User Email");
            return;
        }
        setDiagnosing(true);
        try {
            const res = await adminService.diagnosePayment({
                provider: diagnoseProvider,
                identifier: diagnoseIdentifier.trim(),
                force_sync: true
            });

            if (res.action_taken && res.action_taken !== "None") {
                toast.success(`Diagnosis & Sync: ${res.action_taken}`);
            } else if (res.local_status && res.local_status !== "unknown") {
                toast.success(`Record found: ${res.local_status}`);
            } else {
                toast.error(`Diagnosis result: ${res.local_status || "Not found"}`);
            }

            setIsDiagnoseOpen(false);
            setDiagnoseIdentifier("");
            fetchPayments();
        } catch (err: any) {
            console.error("Diagnosis error:", err);
            toast.error(err.response?.data?.detail || "Failed to diagnose payment");
        } finally {
            setDiagnosing(false);
        }
    };

    const filteredPayments = payments.filter((payment) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            (payment.user_email || "").toLowerCase().includes(query) ||
            (payment.user_name || "").toLowerCase().includes(query) ||
            (payment.description || "").toLowerCase().includes(query) ||
            (payment.reference || "").toLowerCase().includes(query) ||
            (payment.payment_method || "").toLowerCase().includes(query);

        const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
        const matchesProvider =
            providerFilter === "all" ||
            (providerFilter === "nowpayments" && payment.provider === "nowpayments") ||
            (providerFilter === "whop" && (payment.provider === "whop" || payment.provider === "propfirm" || payment.provider === "partnership")) ||
            (providerFilter === "card" && payment.provider === "card");

        return matchesSearch && matchesStatus && matchesProvider;
    });

    // Metrics calculations
    const totalVolume = payments
        .filter((p) => p.payment_status === "completed")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const completedCount = payments.filter((p) => p.payment_status === "completed").length;
    const pendingCount = payments.filter((p) => p.payment_status === "pending").length;
    const failedCount = payments.filter((p) => p.payment_status === "failed").length;

    const getStatusBadge = (status: string) => {
        const s = (status || "pending").toLowerCase();
        if (s === "completed" || s === "paid" || s === "finished") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Completed
                </span>
            );
        } else if (s === "failed" || s === "expired" || s === "cancelled") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="w-3.5 h-3.5" />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    Pending
                </span>
            );
        }
    };

    const getProviderBadge = (payment: UnifiedPayment) => {
        if (payment.provider === "nowpayments") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    <Coins className="w-3.5 h-3.5 text-purple-600" />
                    {payment.payment_method}
                </span>
            );
        } else if (payment.provider === "card") {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    {payment.payment_method}
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    {payment.payment_method}
                </span>
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Title & Description */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Payments & Transactions</h2>
                    <p className="text-sm text-gray-500">
                        Monitor, filter, and verify user payment records across NOWPayments (Crypto), Whop Checkout, and Pass Registrations.
                    </p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-2">
                    <button
                        onClick={fetchPayments}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsDiagnoseOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Diagnose / Force Sync Order
                    </button>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-gray-500">Total Volume</span>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-gray-900">
                        ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Total completed revenue</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-gray-500">Completed Payments</span>
                        <div className="p-2 rounded-lg bg-green-50 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-emerald-600">{completedCount}</p>
                    <p className="mt-1 text-xs text-gray-400">Verified transactions</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-gray-500">Pending Payments</span>
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-amber-600">{pendingCount}</p>
                    <p className="mt-1 text-xs text-gray-400">Awaiting confirmation</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-gray-500">Failed / Expired</span>
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                            <XCircle className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="mt-3 text-2xl font-bold text-rose-600">{failedCount}</p>
                    <p className="mt-1 text-xs text-gray-400">Unsuccessful attempts</p>
                </div>
            </div>

            {/* Filter & Toolbar */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search user email, order ID (e.g. PS-2XPCW9BB), or reference..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200">
                        <Filter className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">Filters:</span>
                    </div>

                    <select
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-blue-500 focus:outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed / Paid</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed / Expired</option>
                    </select>

                    <select
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 focus:border-blue-500 focus:outline-none"
                        value={providerFilter}
                        onChange={(e) => setProviderFilter(e.target.value)}
                    >
                        <option value="all">All Gateways</option>
                        <option value="nowpayments">Crypto (NOWPayments)</option>
                        <option value="whop">Whop / Direct</option>
                        <option value="card">Card</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table & Mobile Card View */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Desktop / Tablet Table (Hidden on small mobile) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-3.5 whitespace-nowrap">User</th>
                                <th scope="col" className="px-6 py-3.5 whitespace-nowrap">Gateway & Method</th>
                                <th scope="col" className="px-6 py-3.5">Item / Order ID</th>
                                <th scope="col" className="px-6 py-3.5 whitespace-nowrap">Amount</th>
                                <th scope="col" className="px-6 py-3.5 whitespace-nowrap">Payment Status</th>
                                <th scope="col" className="px-6 py-3.5 whitespace-nowrap">Date</th>
                                <th scope="col" className="px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                            <span>Loading payment records...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        No payment records match the selected criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                                                <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                                                {payment.user_name || "User"}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono mt-0.5">
                                                {payment.user_email || "N/A"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getProviderBadge(payment)}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="text-xs font-semibold text-gray-900 truncate" title={payment.description}>
                                                {payment.description}
                                            </div>
                                            {payment.reference && (
                                                <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                                                    Order: <span className="font-bold text-gray-700">{payment.reference}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                                            ${payment.amount ? payment.amount.toFixed(2) : "0.00"} <span className="text-xs font-normal text-gray-500">{payment.currency}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(payment.payment_status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                            {payment.created_at ? new Date(payment.created_at).toLocaleString() : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleSyncPayment(payment)}
                                                disabled={syncingId === payment.id}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg shadow-sm transition-colors"
                                                title="Force sync status with gateway"
                                            >
                                                {syncingId === payment.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                                ) : (
                                                    <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
                                                )}
                                                <span>Sync</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Responsive Cards (Displayed on narrow screens) */}
                <div className="block md:hidden divide-y divide-gray-200">
                    {loading ? (
                        <div className="p-8 text-center">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
                            <span className="text-sm text-gray-500">Loading payment records...</span>
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                            No payment records found.
                        </div>
                    ) : (
                        filteredPayments.map((payment) => (
                            <div key={payment.id} className="p-4 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            {payment.user_name || "User"}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">
                                            {payment.user_email || "N/A"}
                                        </div>
                                    </div>
                                    {getStatusBadge(payment.payment_status)}
                                </div>

                                <div className="text-xs text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100 space-y-1">
                                    <div className="font-medium text-gray-900">{payment.description}</div>
                                    {payment.reference && (
                                        <div className="font-mono text-[11px] text-gray-500">
                                            Order ID: <span className="font-bold">{payment.reference}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-xs pt-1">
                                    <div>
                                        {getProviderBadge(payment)}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-gray-900">
                                            ${payment.amount ? payment.amount.toFixed(2) : "0.00"} {payment.currency}
                                        </span>
                                        <div className="text-[11px] text-gray-400">
                                            {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : ""}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        onClick={() => handleSyncPayment(payment)}
                                        disabled={syncingId === payment.id}
                                        className="w-full flex justify-center items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
                                    >
                                        {syncingId === payment.id ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                        ) : (
                                            <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
                                        )}
                                        <span>Force Sync Gateway</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Custom Diagnose / Sync Modal */}
            {isDiagnoseOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-blue-600" />
                                Diagnose Order Status
                            </h3>
                            <button
                                onClick={() => setIsDiagnoseOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCustomDiagnose} className="space-y-4 text-sm">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">
                                    Select Payment Gateway
                                </label>
                                <select
                                    value={diagnoseProvider}
                                    onChange={(e) => setDiagnoseProvider(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 text-xs focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="whop">Whop Checkout / Pass & Partnership</option>
                                    <option value="nowpayments">NOWPayments (Crypto)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-700 block mb-1">
                                    Order ID, Registration UUID, or User Email
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. PS-2XPCW9BB, PF-84920, or user@example.com"
                                    value={diagnoseIdentifier}
                                    onChange={(e) => setDiagnoseIdentifier(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 text-xs font-mono focus:border-blue-500 focus:outline-none"
                                />
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Enter any Partnership or PropFirm Order ID (like PS-2XPCW9BB) to force sync its payment status from Whop.
                                </p>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsDiagnoseOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={diagnosing}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                                >
                                    {diagnosing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                    Diagnose & Sync
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
