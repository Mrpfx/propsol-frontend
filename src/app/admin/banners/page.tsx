// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { bannerService, Banner } from "@/services/banner.service";
import { toast } from "react-hot-toast";
import { Plus, ExternalLink, Check, X, Pencil, Trash2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function BannerAdsPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        text: "",
        link: "",
        is_active: true
    });

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await bannerService.getAll();
            setBanners(data);
        } catch (error) {
            console.error("Error fetching banners:", error);
            toast.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBanner) {
                await bannerService.update(editingBanner.id, formData);
                toast.success("Banner updated successfully");
            } else {
                await bannerService.create(formData);
                toast.success("Banner created successfully");
            }
            setIsModalOpen(false);
            setEditingBanner(null);
            setFormData({ text: "", link: "", is_active: true });
            fetchBanners();
        } catch (error) {
            console.error("Error saving banner:", error);
            toast.error("Failed to save banner");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this banner?")) {
            try {
                await bannerService.delete(id);
                toast.success("Banner deleted successfully");
                fetchBanners();
            } catch (error) {
                console.error("Error deleting banner:", error);
                toast.error("Failed to delete banner");
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Banner Ads</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage announcement banners displayed across the platform.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingBanner(null);
                        setFormData({ text: "", link: "", is_active: true });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center shadow-md shadow-blue-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add New Banner
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="md" message="Loading Banners..." />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-700 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Text</th>
                                    <th className="px-6 py-4">Link (Optional)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {banners.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No banners found. Create one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    banners.map((b) => (
                                        <tr className="hover:bg-gray-50" key={b.id}>
                                            <td className="px-6 py-4 font-medium text-gray-900 max-w-md truncate" title={b.text}>
                                                {b.text}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {b.link ? (
                                                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                                                        {b.link}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    b.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}>
                                                    {b.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                    {b.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingBanner(b);
                                                            setFormData({ text: b.text, link: b.link || "", is_active: b.is_active });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(b.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">{editingBanner ? "Edit Banner" : "New Banner"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Text</label>
                                <textarea
                                    required
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] text-sm"
                                    placeholder="Enter the banner text..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="https://example.com/promo"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">Active</label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    {editingBanner ? "Update Banner" : "Create Banner"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
