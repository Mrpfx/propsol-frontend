// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Search, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";

interface Transaction {
    id: string;
    type: "deposit" | "withdrawal" | "transfer" | "payment" | "refund";
    amount_cents: number;
    status: "pending" | "completed" | "failed" | "reversed";
    reference?: string;
    created_at: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await adminService.getTransactions();
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter((txn) =>
        txn.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "reversed":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "deposit":
                return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
            case "withdrawal":
                return <ArrowUpRight className="h-4 w-4 text-red-500" />;
            case "payment":
                return <ArrowUpRight className="h-4 w-4 text-blue-500" />;
            default:
                return <RefreshCw className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Transactions</h2>
                    <p className="text-gray-500">View all system transactions.</p>
                </div>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
                        placeholder="Search reference..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Reference</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center">
                                    <div className="flex justify-center">
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((txn) => (
                                <tr key={txn.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 font-medium text-gray-900 capitalize">
                                            {getTypeIcon(txn.type)}
                                            {txn.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">
                                        ${(txn.amount_cents / 100).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                                txn.status
                                            )}`}
                                        >
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">
                                        {txn.reference || "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(txn.created_at).toLocaleDateString()}
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
