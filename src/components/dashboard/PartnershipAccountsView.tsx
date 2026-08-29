"use client";

import { useState } from "react";
import { PropFirmRegistration } from "@/services/prop-firm.service";
import { 
    Handshake, 
    Plus, 
    ShieldCheck, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    TrendingUp, 
    ChevronRight,
    Server,
    Key,
    Pencil,
    Phone,
    Send
} from "lucide-react";
import { AccountEditModal } from "@/components/dashboard/AccountEditModal";

interface PartnershipAccountsViewProps {
    accounts?: PropFirmRegistration[];
    onStartNewPartnership?: () => void;
}

export function PartnershipAccountsView({ accounts = [], onStartNewPartnership }: PartnershipAccountsViewProps) {
    const [localAccounts, setLocalAccounts] = useState<PropFirmRegistration[]>(accounts);
    const [selectedAccount, setSelectedAccount] = useState<PropFirmRegistration | null>(null);
    const [editingAccount, setEditingAccount] = useState<PropFirmRegistration | null>(null);

    // Keep local list in sync if parent accounts prop changes
    const displayAccounts = localAccounts.length > 0 ? localAccounts : accounts;

    const handleAccountUpdate = (updated: PropFirmRegistration) => {
        setLocalAccounts((prev) => {
            const exists = prev.some((a) => a.id === updated.id);
            if (exists) {
                return prev.map((a) => (a.id === updated.id ? updated : a));
            }
            return [...prev, updated];
        });
        if (selectedAccount?.id === updated.id) {
            setSelectedAccount(updated);
        }
    };

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "passed":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200 shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Passed & Funded
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200 shrink-0">
                        <XCircle className="h-3.5 w-3.5 text-rose-600" /> Terminated
                    </span>
                );
            case "in_progress":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200 shrink-0">
                        <TrendingUp className="h-3.5 w-3.5 animate-pulse text-blue-600" /> Active Trading
                    </span>
                );
            case "pending":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200 shrink-0">
                        <Clock className="h-3.5 w-3.5 text-amber-600" /> Setup Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6 max-w-full overflow-hidden">
            {/* Header & Call to Action Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-5 sm:p-8 text-white shadow-lg">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div className="space-y-1.5 max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium text-white backdrop-blur-sm border border-white/20">
                            <Handshake className="h-3.5 w-3.5" />
                            PropSol Partnership Management
                        </div>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Active Managed Accounts
                        </h2>
                        <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                            Monitor your prop firm accounts managed by PropSol trading professionals with guaranteed risk protocol.
                        </p>
                    </div>

                    <button
                        onClick={onStartNewPartnership}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 active:scale-[0.98] transition-all cursor-pointer shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        Start New Partnership
                    </button>
                </div>
            </div>

            {/* List of Accounts */}
            {displayAccounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-12 sm:py-16 px-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-3 shadow-inner">
                        <Handshake className="h-7 w-7" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">No Partnership Accounts Active</h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md">
                        Initiate your first Prop Firm Partnership to have our professional algorithm and prop desk manage your evaluation or instant access account.
                    </p>
                    <button
                        onClick={onStartNewPartnership}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                        Get Started Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {displayAccounts.map((account) => {
                        const isInstant = account.propfirm_rules?.toLowerCase().includes("instant");
                        return (
                            <div
                                key={account.id}
                                className="group relative rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all space-y-4 text-gray-900 overflow-hidden"
                            >
                                {/* Card Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-gray-100">
                                    <div className="space-y-1.5 min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-gray-900 text-base sm:text-lg truncate max-w-full">
                                                {account.propfirm_name || "Prop Firm Account"}
                                            </span>
                                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                                isInstant 
                                                    ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                            }`}>
                                                {isInstant ? "Instant Access" : "Challenge Model"}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                                            <p className="font-mono text-gray-600 flex items-center gap-1 shrink-0">
                                                <Key className="h-3 w-3 text-blue-600" />
                                                ID: <span className="font-semibold text-gray-900 break-all">{account.login_id || "Pending"}</span>
                                            </p>
                                            <button
                                                onClick={() => setEditingAccount(account)}
                                                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold hover:underline transition-colors shrink-0 cursor-pointer"
                                                title="Edit account credentials"
                                            >
                                                <Pencil className="h-3 w-3" /> Edit Credentials
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0 self-start sm:self-auto">
                                        {getStatusBadge(account.account_status)}
                                    </div>
                                </div>

                                {/* Stats Grid Box */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 rounded-xl bg-gray-50 p-3 sm:p-4 border border-gray-100 text-xs">
                                    <div className="min-w-0">
                                        <span className="text-gray-500 block text-[11px] font-medium">Account Size</span>
                                        <span className="font-extrabold text-blue-600 text-sm sm:text-base block truncate">
                                            ${account.account_size ? account.account_size.toLocaleString() : "0"}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-gray-500 block text-[11px] font-medium">Server / Platform</span>
                                        <span className="font-semibold text-gray-800 text-xs flex items-center gap-1 mt-0.5 min-w-0">
                                            <Server className="h-3 w-3 text-gray-400 shrink-0" />
                                            <span className="truncate" title={`${account.server_name || "MT5"} (${account.trading_platform || "MetaTrader 5"})`}>
                                                {account.server_name || "MT5"} ({account.trading_platform || "MetaTrader 5"})
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="flex flex-wrap items-center justify-between pt-1 gap-2 text-xs text-gray-500">
                                    <span>
                                        Added {account.created_at ? new Date(account.created_at).toLocaleDateString() : "Recently"}
                                    </span>
                                    <button
                                        onClick={() => setSelectedAccount(account)}
                                        className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                                    >
                                        View Account Info <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Account Details Modal */}
            {selectedAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-2xl space-y-4 text-gray-900 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                                    {selectedAccount.propfirm_name} Partnership
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Account Details & Management Status</p>
                            </div>
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-2.5 text-xs sm:text-sm">
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Status</span>
                                <div>{getStatusBadge(selectedAccount.account_status)}</div>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Login ID / Account #</span>
                                <span className="font-mono font-bold text-blue-600 break-all">{selectedAccount.login_id || "Not set"}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Trading Password</span>
                                <span className="font-mono text-gray-800 break-all">{selectedAccount.password || "••••••••"}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Account Size</span>
                                <span className="font-extrabold text-emerald-600">
                                    ${selectedAccount.account_size?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Trading Platform</span>
                                <span className="font-semibold text-gray-800">{selectedAccount.trading_platform || "MT5"}</span>
                            </div>
                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Server Name</span>
                                <span className="font-semibold text-gray-800">{selectedAccount.server_name || "Live Server"}</span>
                            </div>
                            {selectedAccount.whatsapp_no && (
                                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp
                                    </span>
                                    <span className="font-semibold text-gray-800">{selectedAccount.whatsapp_no}</span>
                                </div>
                            )}
                            {selectedAccount.telegram_username && (
                                <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                                        <Send className="h-3.5 w-3.5 text-blue-600" /> Telegram
                                    </span>
                                    <span className="font-semibold text-gray-800">{selectedAccount.telegram_username}</span>
                                </div>
                            )}
                            <div className="pt-1">
                                <span className="text-gray-500 block mb-1 text-xs font-medium">Partnership Notes:</span>
                                <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-700 font-mono border border-gray-200">
                                    {selectedAccount.propfirm_rules || "PropSol Managed Partnership Protocol"}
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 flex justify-between items-center border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setEditingAccount(selectedAccount);
                                    setSelectedAccount(null);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <Pencil className="h-3.5 w-3.5 text-blue-600" />
                                Edit Credentials
                            </button>
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Credentials Modal */}
            <AccountEditModal
                isOpen={!!editingAccount}
                onClose={() => setEditingAccount(null)}
                account={editingAccount || undefined}
                onUpdate={handleAccountUpdate}
            />
        </div>
    );
}
