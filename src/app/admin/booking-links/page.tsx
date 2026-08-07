// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { bookingLinkService } from "@/services/booking-link.service";
import { toast } from "react-hot-toast";
import { Plus, Pencil, Trash2, ExternalLink, Check, X } from "lucide-react";

export default function BookingLinksAdminPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        is_active: true
    });

    const fetchLinks = async () => {
        try {
            const data = await bookingLinkService.getAll();
            setLinks(data);
        } catch (error) {
            console.error("Error fetching booking links:", error);
            toast.error("Failed to load booking links");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingLink) {
                await bookingLinkService.update(editingLink.id, formData);
                toast.success("Booking link updated successfully");
            } else {
                await bookingLinkService.create(formData);
                toast.success("Booking link created successfully");
            }
            setIsModalOpen(false);
            setEditingLink(null);
            setFormData({
                title: "",
                url: "",
                is_active: true
            });
            fetchLinks();
        } catch (error) {
            console.error("Error saving booking link:", error);
            toast.error("Failed to save booking link");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this booking link?")) {
            try {
                await bookingLinkService.delete(id);
                toast.success("Booking link deleted successfully");
                fetchLinks();
            } catch (error) {
                console.error("Error deleting booking link:", error);
                toast.error("Failed to delete booking link");
            }
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Links</h1>
                <button
                    onClick={() => {
                        setEditingLink(null);
                        setFormData({
                            title: "",
                            url: "",
                            is_active: true
                        });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
                >
                    <Plus className="w-4 h-4" />
                    Add New Link
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-medium text-gray-500">Title</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">URL</th>
                                    <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {links.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No booking links found. Create one to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    links.map((link) => (
                                        <tr className="hover:bg-gray-50" key={link.id}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{link.title}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-blue-600"
                                                >
                                                    {link.url}
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    link.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                                }`}>
                                                    {link.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                                    {link.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingLink(link);
                                                            setFormData({
                                                                title: link.title,
                                                                url: link.url,
                                                                is_active: link.is_active
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(link.id)}
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingLink ? "Edit Booking Link" : "New Booking Link"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Consultation Call"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://calendly.com/..."
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
                                <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
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
                                    {editingLink ? "Update Link" : "Create Link"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
