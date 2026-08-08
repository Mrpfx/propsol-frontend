// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminService, Admin } from "@/services/admin.service";
import { toast } from "react-hot-toast";
import { 
    Users, 
    Edit, 
    Trash2, 
    Key, 
    Check, 
    Loader2, 
    Plus,
    X
} from "lucide-react";

const AVAILABLE_ROLES = [
    "dashboard",
    "users",
    "prop_firms",
    "payments",
    "payouts",
    "transactions",
    "support",
    "settings",
    "email_marketing",
    "super_admin"
];

export default function AdminManagementPage() {
    const router = useRouter();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentAdminUser, setCurrentAdminUser] = useState<any>(null);

    // Modals state
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [isEditRolesOpen, setIsEditRolesOpen] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAdmins();
            setAdmins(data);
        } catch (error: any) {
            console.error("Failed to fetch admins:", error);
            if (error?.response?.status === 403) {
                toast.error("You do not have permission to view admins.");
            } else {
                toast.error("Failed to load admins");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin_data");
        if (storedAdmin) {
            try {
                const parsed = JSON.parse(storedAdmin);
                setCurrentAdminUser(parsed);
                fetchAdmins();
            } catch (e) {
                router.push("/admin/login");
            }
        } else {
            fetchAdmins();
        }
    }, [router]);

    const handleSaveRoles = async () => {
        if (!selectedAdmin) return;
        try {
            await adminService.updateAdmin(selectedAdmin.id, {
                roles: selectedRoles
            });
            toast.success("Roles updated successfully");
            setIsEditRolesOpen(false);
            fetchAdmins();
        } catch (error) {
            console.error("Failed to update roles:", error);
            toast.error("Failed to update roles");
        }
    };

    const handleResetPassword = async () => {
        if (!selectedAdmin || !newPassword) return;
        try {
            await adminService.updateAdmin(selectedAdmin.id, {
                password: newPassword
            });
            toast.success("Password updated successfully");
            setIsResetPasswordOpen(false);
            setNewPassword("");
        } catch (error) {
            console.error("Failed to update password:", error);
            toast.error("Failed to update password");
        }
    };

    const handleDeleteAdmin = async () => {
        if (!selectedAdmin) return;
        try {
            await adminService.deleteAdmin(selectedAdmin.id);
            toast.success("Admin deleted successfully");
            setAdmins(prev => prev.filter(a => a.id !== selectedAdmin.id));
            setIsDeleteModalOpen(false);
            setSelectedAdmin(null);
        } catch (error) {
            toast.error("Failed to delete admin");
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage system administrators, permissions, and roles.</p>
                </div>
                <button
                    onClick={() => router.push("/admin/register")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add New Admin
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-3 whitespace-nowrap">Name</th>
                                <th className="px-6 py-3 whitespace-nowrap">Email</th>
                                <th className="px-6 py-3 whitespace-nowrap">Roles</th>
                                <th className="px-6 py-3 whitespace-nowrap">Status</th>
                                <th className="px-6 py-3 text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {admins.map((adm: any) => (
                                <tr className="hover:bg-gray-50" key={adm.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{adm.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{adm.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1 min-w-[120px]">
                                            {(adm.roles || ["admin"]).map((r: string) => (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize whitespace-nowrap" key={r}>
                                                    {r.replace("_", " ")}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            (adm.Status ?? adm.status ?? true) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                            {(adm.Status ?? adm.status ?? true) ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                setSelectedAdmin(adm);
                                                setSelectedRoles(adm.roles || []);
                                                setIsEditRolesOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                            title="Edit Roles"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedAdmin(adm);
                                                setNewPassword("");
                                                setIsResetPasswordOpen(true);
                                            }}
                                            className="text-orange-600 hover:text-orange-900 p-1"
                                            title="Reset Password"
                                        >
                                            <Key className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedAdmin(adm);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-red-600 hover:text-red-900 p-1"
                                            title="Delete Admin"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Roles Modal */}
            {isEditRolesOpen && selectedAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Edit Roles</h3>
                            <button onClick={() => setIsEditRolesOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Configuring permissions for {selectedAdmin.name}</p>
                        <div className="mb-6 space-y-2 max-h-60 overflow-y-auto pr-2">
                            {AVAILABLE_ROLES.map((role) => (
                                <label
                                    key={role}
                                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer border border-transparent hover:border-gray-200"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedRoles.includes(role)}
                                        onChange={() => {
                                            setSelectedRoles(prev =>
                                                prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
                                            );
                                        }}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{role.replace("_", " ")}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditRolesOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRoles}
                                className="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {isResetPasswordOpen && selectedAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
                            <button onClick={() => setIsResetPasswordOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Set a new password for {selectedAdmin.name}</p>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="text"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsResetPasswordOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetPassword}
                                disabled={!newPassword}
                                className="px-4 py-2 bg-orange-600 text-sm text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedAdmin && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Admin</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete <span className="font-semibold text-gray-900">{selectedAdmin.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAdmin}
                                className="px-4 py-2 bg-red-600 text-sm text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete Admin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
