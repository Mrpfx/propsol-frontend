// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { User } from "@/services/user.service";
import { api } from "@/lib/api";
import { Search, Package, Check } from "lucide-react";

export default function AssignPackagePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [packageName, setPackageName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await adminService.getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await adminService.assignPackageToUser({
                package_name: packageName,
                amount: parseFloat(amount),
                user_id: selectedUser,
                status: 'active'
            });
            setSuccess(true);
            setPackageName("");
            setAmount("");
            setSelectedUser("");
        } catch (error) {
            console.error("Failed to assign package", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Assign Package</h2>
                <p className="text-gray-500">Manually assign a package to a user.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                {success && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
                        <Check className="h-5 w-5" />
                        <p>Package assigned successfully!</p>
                    </div>
                )}

                <form onSubmit={handleAssign} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Select User
                        </label>
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search user..."
                                className="block w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            required
                            className="block w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">Select a user...</option>
                            {filteredUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Package Name
                        </label>
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="block w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="e.g. Pro Plan"
                                value={packageName}
                                onChange={(e) => setPackageName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedUser}
                        className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                    >
                        {loading ? "Assigning..." : "Assign Package"}
                    </button>
                </form>
            </div>
        </div>
    );
}
