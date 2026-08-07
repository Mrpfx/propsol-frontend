// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { adminService } from "@/services/admin.service";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { 
    Mail, 
    Users, 
    FileText, 
    Search, 
    X, 
    AlertCircle, 
    ChevronDown, 
    Send, 
    Loader2, 
    Eye, 
    Check 
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function SendEmailsPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [templates, setTemplates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [sendToAll, setSendToAll] = useState(false);
    const [subject, setSubject] = useState("");
    const [emailType, setEmailType] = useState<"custom" | "template">("custom");
    const [customMessage, setCustomMessage] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [sending, setSending] = useState(false);

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const templateDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            try {
                const [usersRes, templatesRes] = await Promise.allSettled([
                    adminService.getUsers(),
                    api.get("/admin/email-templates")
                ]);

                if (usersRes.status === "fulfilled") {
                    setUsers(usersRes.value);
                }
                if (templatesRes.status === "fulfilled") {
                    setTemplates(templatesRes.value.data);
                }
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (templateDropdownRef.current && !templateDropdownRef.current.contains(e.target as Node)) {
                setIsTemplateDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredUsers = users.filter(
        (u) =>
            !selectedUsers.find((selected) => selected.id === u.id) &&
            (u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
    );

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim()) {
            toast.error("Please enter a subject");
            return;
        }
        if (!sendToAll && selectedUsers.length === 0) {
            toast.error("Please select at least one user or enable 'Send to All'");
            return;
        }
        if (emailType === "custom" && !customMessage.trim()) {
            toast.error("Please enter a message");
            return;
        }
        if (emailType === "template" && !selectedTemplate) {
            toast.error("Please select a template");
            return;
        }

        const payload: any = {
            subject: subject.trim(),
            email_type: emailType
        };

        if (sendToAll) {
            payload.send_to_all = true;
        } else {
            payload.user_ids = selectedUsers.map((u) => u.id);
        }

        if (emailType === "custom") {
            payload.custom_message = customMessage;
        } else {
            payload.template_name = selectedTemplate;
        }

        setSending(true);
        try {
            const res = await api.post("/admin/send-email", payload);
            toast.success(res.data?.message || "Emails sent successfully!");
            setSelectedUsers([]);
            setSendToAll(false);
            setSubject("");
            setCustomMessage("");
            setSelectedTemplate("");
        } catch (err: any) {
            const msg = err.response?.data?.detail || "Failed to send emails";
            toast.error(msg);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <LoadingSpinner size="lg" message="Loading Email Composer..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-xl">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Send Emails</h1>
                            <p className="text-blue-100">Send custom messages or templates to users</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSendEmail} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    {/* Recipients Box */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg shadow-blue-500/20">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">Recipients</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Send to All Users</span>
                                <button
                                    type="button"
                                    onClick={() => setSendToAll(!sendToAll)}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${
                                        sendToAll ? "bg-gradient-to-r from-blue-500 to-indigo-600" : "bg-gray-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                                            sendToAll ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {!sendToAll && (
                            <div ref={userDropdownRef} className="relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users by name or email..."
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        value={userSearchQuery}
                                        onChange={(e) => {
                                            setUserSearchQuery(e.target.value);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                    />
                                </div>

                                {isDropdownOpen && filteredUsers.length > 0 && (
                                    <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                                        {filteredUsers.slice(0, 10).map((u) => (
                                            <button
                                                type="button"
                                                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                                onClick={() => {
                                                    setSelectedUsers([...selectedUsers, u]);
                                                    setUserSearchQuery("");
                                                }}
                                                key={u.id}
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-medium text-white">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedUsers.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {selectedUsers.map((u) => (
                                            <span
                                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-sm font-medium text-blue-700 border border-blue-200"
                                                key={u.id}
                                            >
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </span>
                                                {u.name}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedUsers(selectedUsers.filter((item) => item.id !== u.id))}
                                                    className="ml-1 rounded-full p-0.5 hover:bg-blue-200 transition-colors"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {sendToAll && (
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                                <div className="flex items-center gap-2 text-amber-700">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="font-medium">Broadcast Mode</span>
                                </div>
                                <p className="mt-1 text-sm text-amber-600">
                                    This email will be sent to all {users.length} registered users.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Subject Line */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
                        <input
                            type="text"
                            placeholder="Enter email subject..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    {/* Email Content Box */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-2 shadow-lg shadow-purple-500/20">
                                <FileText className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Email Content</h2>
                        </div>

                        <div className="mb-6 flex gap-2 rounded-xl bg-gray-100 p-1">
                            <button
                                type="button"
                                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                                    emailType === "custom" ? "bg-white text-gray-900 shadow-md" : "text-gray-600 hover:text-gray-900"
                                }`}
                                onClick={() => setEmailType("custom")}
                            >
                                Custom Message
                            </button>
                            <button
                                type="button"
                                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                                    emailType === "template" ? "bg-white text-gray-900 shadow-md" : "text-gray-600 hover:text-gray-900"
                                }`}
                                onClick={() => setEmailType("template")}
                            >
                                Use Template
                            </button>
                        </div>

                        {emailType === "custom" ? (
                            <div>
                                <textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder="Write your email message here (HTML supported)..."
                                    className="w-full h-48 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                                <div className="flex items-center justify-between rounded-b-xl border-x border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
                                    <span>HTML formatting enabled</span>
                                    <span>{customMessage.replace(/<[^>]*>/g, "").length} characters</span>
                                </div>
                            </div>
                        ) : (
                            <div ref={templateDropdownRef} className="relative">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm transition-all hover:bg-gray-100"
                                    onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                                >
                                    <span className={selectedTemplate ? "text-gray-900" : "text-gray-400"}>
                                        {selectedTemplate || "Select a template..."}
                                    </span>
                                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isTemplateDropdownOpen ? "rotate-180" : ""}`} />
                                </button>
                                {isTemplateDropdownOpen && (
                                    <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
                                        {templates.length > 0 ? (
                                            templates.map((tpl) => (
                                                <button
                                                    type="button"
                                                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                                                    onClick={() => {
                                                        setSelectedTemplate(tpl);
                                                        setIsTemplateDropdownOpen(false);
                                                    }}
                                                    key={tpl}
                                                >
                                                    <FileText className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{tpl}</span>
                                                    {selectedTemplate === tpl && <Check className="ml-auto h-4 w-4 text-green-500" />}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="px-4 py-3 text-sm text-gray-500">No templates available</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Summary & Submit */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Email Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Recipients</span>
                                <span className="text-sm font-medium text-gray-900">{sendToAll ? `All (${users.length})` : selectedUsers.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Type</span>
                                <span className="text-sm font-medium text-gray-900 capitalize">{emailType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-500">Subject</span>
                                <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{subject || "-"}</span>
                            </div>
                            {emailType === "template" && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Template</span>
                                    <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{selectedTemplate || "-"}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {emailType === "custom" && customMessage && (
                        <button
                            type="button"
                            onClick={() => setIsPreviewOpen(true)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-lg"
                        >
                            <Eye className="h-4 w-4" />
                            Preview Email
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={sending}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="h-5 w-5" />
                                Send Email
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Preview Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Email Preview</h3>
                            <button onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 hover:bg-gray-100 transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-4 border-b border-gray-200 pb-4">
                                <p className="text-sm text-gray-500">Subject:</p>
                                <p className="font-medium text-gray-900">{subject || "(No subject)"}</p>
                            </div>
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: customMessage }} />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button onClick={() => setIsPreviewOpen(false)} className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
