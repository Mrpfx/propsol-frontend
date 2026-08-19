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
    Activity,
    Lock,
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
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passed & Funded
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
                        <XCircle className="h-3.5 w-3.5" /> Terminated
                    </span>
                );
            case "in_progress":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                        <TrendingUp className="h-3.5 w-3.5 animate-pulse text-blue-400" /> Active Trading
                    </span>
                );
            case "pending":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                        <Clock className="h-3.5 w-3.5" /> Setup Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Call to Action Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-blue-500/20">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-400/20">
                            <Handshake className="h-3.5 w-3.5" />
                            PropSol Partnership Management
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Active Managed Accounts
                        </h2>
                        <p className="text-sm text-slate-300/80 leading-relaxed">
                            Monitor your prop firm accounts managed by PropSol trading professionals. Guaranteed risk management, evaluation passing, and profit splitting.
                        </p>
                    </div>

                    <button
                        onClick={onStartNewPartnership}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Start New Partnership
                    </button>
                </div>
            </div>

            {/* List of Accounts */}
            {displayAccounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-[#0E1535]/40 py-16 px-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20 shadow-inner">
                        <Handshake className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">No Partnership Accounts Active</h3>
                    <p className="mt-1 text-sm text-slate-400 max-w-md">
                        Initiate your first Prop Firm Partnership to have our professional algorithm and prop desk manage your evaluation or instant access account.
                    </p>
                    <button
                        onClick={onStartNewPartnership}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Get Started Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayAccounts.map((account) => {
                        const isInstant = account.propfirm_rules?.toLowerCase().includes("instant");
                        return (
                            <div
                                key={account.id}
                                className="group relative rounded-2xl border border-slate-800 bg-[#0E1535]/90 p-6 shadow-xl hover:border-blue-500/40 transition-all space-y-4 text-white"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-white text-lg">
                                                {account.propfirm_name || "Prop Firm Account"}
                                            </span>
                                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                isInstant 
                                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            }`}>
                                                {isInstant ? "Instant Access" : "Challenge Model"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-xs font-mono text-slate-400 flex items-center gap-1">
                                                <Key className="h-3 w-3 text-blue-400" />
                                                ID: <span className="font-semibold text-slate-200">{account.login_id || "Pending"}</span>
                                            </p>
                                            <button
                                                onClick={() => setEditingAccount(account)}
                                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium hover:underline transition-colors"
                                                title="Edit account credentials"
                                            >
                                                <Pencil className="h-3 w-3" /> Edit Credentials
                                            </button>
                                        </div>
                                    </div>
                                    <div>{getStatusBadge(account.account_status)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-900/80 p-4 border border-slate-800/80 text-xs">
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Account Size</span>
                                        <span className="font-extrabold text-blue-400 text-base">
                                            ${account.account_size ? account.account_size.toLocaleString() : "0"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 block text-[11px]">Server / Platform</span>
                                        <span className="font-semibold text-slate-200 text-xs flex items-center gap-1 mt-1 truncate">
                                            <Server className="h-3 w-3 text-slate-400 shrink-0" />
                                            {account.server_name || "MT5"} ({account.trading_platform || "MetaTrader 5"})
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-800/60">
                                    <span className="text-slate-400">
                                        Added {account.created_at ? new Date(account.created_at).toLocaleDateString() : "Recently"}
                                    </span>
                                    <button
                                        onClick={() => setSelectedAccount(account)}
                                        className="font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-700/60 bg-[#0E1535] p-6 shadow-2xl space-y-4 text-white">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                                    {selectedAccount.propfirm_name} Partnership
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Account Details & Management Status</p>
                            </div>
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-800/50">
                                <span className="text-slate-400">Status</span>
                                <div>{getStatusBadge(selectedAccount.account_status)}</div>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/50">
                                <span className="text-slate-400">Login ID / Account #</span>
                                <span className="font-mono font-bold text-blue-400">{selectedAccount.login_id || "Not set"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/50">
                                <span className="text-slate-400">Trading Password</span>
                                <span className="font-mono text-slate-300">{selectedAccount.password || "••••••••"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/50">
                                <span className="text-slate-400">Account Size</span>
                                <span className="font-extrabold text-emerald-400">
                                    ${selectedAccount.account_size?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/50">
                                <span className="text-slate-400">Trading Platform</span>
                                <span className="font-medium text-slate-200">{selectedAccount.trading_platform || "MT5"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-800/50">
                                <span className="text-slate-400">Server Name</span>
                                <span className="font-medium text-slate-200">{selectedAccount.server_name || "Live Server"}</span>
                            </div>
                            {selectedAccount.whatsapp_no && (
                                <div className="flex justify-between py-2 border-b border-slate-800/50">
                                    <span className="text-slate-400 flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp
                                    </span>
                                    <span className="font-medium text-slate-200">{selectedAccount.whatsapp_no}</span>
                                </div>
                            )}
                            {selectedAccount.telegram_username && (
                                <div className="flex justify-between py-2 border-b border-slate-800/50">
                                    <span className="text-slate-400 flex items-center gap-1.5">
                                        <Send className="h-3.5 w-3.5 text-blue-400" /> Telegram
                                    </span>
                                    <span className="font-medium text-slate-200">{selectedAccount.telegram_username}</span>
                                </div>
                            )}
                            <div className="py-2">
                                <span className="text-slate-400 block mb-1 text-xs">Partnership Notes:</span>
                                <div className="rounded-xl bg-slate-900 p-3 text-xs text-slate-300 font-mono border border-slate-800">
                                    {selectedAccount.propfirm_rules || "PropSol Managed Partnership Protocol"}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-between items-center border-t border-slate-800">
                            <button
                                onClick={() => {
                                    setEditingAccount(selectedAccount);
                                    setSelectedAccount(null);
                                }}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                <Pencil className="h-3.5 w-3.5 text-blue-400" />
                                Edit Credentials
                            </button>
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
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

