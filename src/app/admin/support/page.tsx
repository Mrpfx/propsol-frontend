// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";
import { supportTicketService, SupportTicket, TicketMessage } from "@/services/support-ticket.service";
import { toast } from "react-hot-toast";
import { 
    MessageCircle, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    AlertTriangle, 
    TrendingUp, 
    Search, 
    Loader2, 
    Send, 
    Inbox 
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AdminSupportTicketsPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingTicketDetails, setLoadingTicketDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchTickets = async () => {
        try {
            const data = await supportTicketService.getAllTickets();
            setTickets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
            toast.error("Failed to load support tickets");
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        if (selectedTicket?.messages) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedTicket?.messages]);

    const handleSelectTicket = async (ticket: SupportTicket) => {
        setLoadingTicketDetails(true);
        try {
            const fullTicket = await supportTicketService.getAdminTicketById(ticket.id);
            setSelectedTicket(fullTicket);
        } catch (error) {
            toast.error("Failed to load ticket details");
        } finally {
            setLoadingTicketDetails(false);
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (replyText.trim() && selectedTicket) {
            setSendingReply(true);
            try {
                const newMsg = await supportTicketService.replyToTicket(selectedTicket.id, replyText);
                setSelectedTicket({
                    ...selectedTicket,
                    messages: [...(selectedTicket.messages || []), newMsg]
                });
                setReplyText("");
                toast.success("Reply sent!");
            } catch (error) {
                toast.error("Failed to send reply");
            } finally {
                setSendingReply(false);
            }
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (selectedTicket) {
            setUpdatingStatus(true);
            try {
                const updated = await supportTicketService.updateTicketStatus(selectedTicket.id, newStatus);
                setSelectedTicket({
                    ...selectedTicket,
                    status: updated.status
                });
                setTickets(tickets.map((t) => (t.id === updated.id ? { ...t, status: updated.status } : t)));
                toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
            } catch (error) {
                toast.error("Failed to update status");
            } finally {
                setUpdatingStatus(false);
            }
        }
    };

    const filteredTickets = tickets.filter((t) => {
        const matchesSearch =
            t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.user_email || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "open":
                return { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, label: "Open" };
            case "in_progress":
                return { color: "bg-blue-100 text-blue-700 border-blue-200", icon: AlertCircle, label: "In Progress" };
            case "resolved":
                return { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle, label: "Resolved" };
            case "closed":
                return { color: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircle, label: "Closed" };
            default:
                return { color: "bg-gray-100 text-gray-600 border-gray-200", icon: Clock, label: status };
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case "urgent":
                return { color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" };
            case "high":
                return { color: "bg-orange-100 text-orange-700 border-orange-200", dot: "bg-orange-500" };
            case "medium":
                return { color: "bg-yellow-100 text-yellow-700 border-yellow-200", dot: "bg-yellow-500" };
            default:
                return { color: "bg-gray-100 text-gray-600 border-gray-200", dot: "bg-gray-400" };
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    const stats = {
        total: tickets.length,
        open: tickets.filter((t) => t.status === "open").length,
        inProgress: tickets.filter((t) => t.status === "in_progress").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
        urgent: tickets.filter((t) => t.priority === "urgent" && t.status !== "resolved" && t.status !== "closed").length
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Support Tickets
                    </h2>
                    <p className="text-slate-500">Manage customer support requests and conversations.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-100">
                            <MessageCircle className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            <p className="text-xs text-slate-500">Total Tickets</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-yellow-100">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.open}</p>
                            <p className="text-xs text-slate-500">Open</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-100">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
                            <p className="text-xs text-slate-500">In Progress</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-100">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
                            <p className="text-xs text-slate-500">Resolved</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-red-100">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.urgent}</p>
                            <p className="text-xs text-slate-500">Urgent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
                            placeholder="Search by subject, user name, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
                        >
                            <option value="all">All Status</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
                        >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Split View: Tickets List & Active Chat Panel */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 text-sm">Tickets ({filteredTickets.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                        {loading ? (
                            <div className="p-8 text-center">
                                <LoadingSpinner size="md" message="Loading tickets..." />
                            </div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                <p className="text-sm">No tickets found</p>
                            </div>
                        ) : (
                            filteredTickets.map((ticket) => {
                                const statusInfo = getStatusStyle(ticket.status);
                                const priorityInfo = getPriorityStyle(ticket.priority);
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <div
                                        key={ticket.id}
                                        onClick={() => handleSelectTicket(ticket)}
                                        className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                                            selectedTicket?.id === ticket.id ? "bg-blue-50 border-l-4 border-blue-600" : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {(ticket.user_name || "U")
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className={`w-2 h-2 rounded-full ${priorityInfo.dot}`} />
                                                    <h4 className="font-medium text-slate-900 truncate">{ticket.subject}</h4>
                                                </div>
                                                <p className="text-sm text-slate-500 truncate">
                                                    {ticket.user_name || "Unknown"} • {ticket.user_email || "No email"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusInfo.label}
                                                    </span>
                                                    <span className="text-xs text-slate-400">{formatDate(ticket.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Conversation Details & Reply */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
                    {loadingTicketDetails ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : selectedTicket ? (
                        <>
                            {/* Ticket Top Info */}
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <h3 className="font-semibold text-slate-900 mb-2">{selectedTicket.subject}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="text-slate-600">From: {selectedTicket.user_name || "Unknown"}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-500">{selectedTicket.user_email}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        disabled={updatingStatus}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${getStatusStyle(selectedTicket.status).color}`}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getPriorityStyle(selectedTicket.priority).color}`}>
                                        {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)} Priority
                                    </span>
                                </div>
                            </div>

                            {/* Ticket Messages History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedTicket.messages?.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender_type === "admin" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-4 ${
                                                msg.sender_type === "admin"
                                                    ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                                                    : "bg-slate-100 text-slate-900 rounded-2xl rounded-bl-md"
                                            }`}
                                        >
                                            {msg.sender_type === "user" && (
                                                <p className="text-xs font-medium text-slate-700 mb-1">
                                                    {selectedTicket.user_name || "User"}
                                                </p>
                                            )}
                                            <p className="text-sm whitespace-pre-wrap">{msg.content || msg.message}</p>
                                            <p
                                                className={`text-xs mt-2 ${
                                                    msg.sender_type === "admin" ? "text-blue-200" : "text-slate-500"
                                                }`}
                                            >
                                                {formatDate(msg.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Input Form */}
                            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-slate-50">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your reply..."
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sendingReply || !replyText.trim()}
                                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <MessageCircle className="w-16 h-16 text-slate-300 mb-4" />
                            <p className="font-medium">Select a ticket to view details</p>
                            <p className="text-sm">Click on any ticket from the list</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
