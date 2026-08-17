// @ts-nocheck
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
    ExternalLink, 
    ChevronRight,
    Server,
    Key
} from "lucide-react";

interface PartnershipAccountsViewProps {
    accounts?: PropFirmRegistration[];
    onStartNewPartnership?: () => void;
}

export function PartnershipAccountsView({ accounts = [], onStartNewPartnership }: PartnershipAccountsViewProps) {
    const [selectedAccount, setSelectedAccount] = useState<PropFirmRegistration | null>(null);

    // Filter accounts that are partnership registrations (or display all if tag isn't set)
    const partnershipAccounts = accounts.filter(
        (acc) => acc.propfirm_rules?.toLowerCase().includes("partnership") || true
    );

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "passed":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Passed
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 border border-rose-500/20">
                        <XCircle className="h-3.5 w-3.5" /> Failed
                    </span>
                );
            case "in_progress":
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-500/20">
                        <TrendingUp className="h-3.5 w-3.5 animate-pulse" /> Active Trading
                    </span>
                );
            case "pending":
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 border border-amber-500/20">
                        <Clock className="h-3.5 w-3.5" /> Setup Pending
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Call to Action Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-400/30">
                            <Handshake className="h-3.5 w-3.5" />
                            PropSol Partnership Portal
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Your Active Partnership Accounts
                        </h2>
                        <p className="text-sm text-blue-100/80 leading-relaxed">
                            Pass prop firm challenges or get direct instant access. Our expert trading desk manages your account with guaranteed risk protocol compliance.
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
            {partnershipAccounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 py-16 px-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-sm">
                        <Handshake className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No Partnership Accounts Yet</h3>
                    <p className="mt-1 text-sm text-gray-500 max-w-md">
                        Initiate your first Prop Firm Partnership to have our professional system manage your challenge and prop firm evaluation.
                    </p>
                    <button
                        onClick={onStartNewPartnership}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Get Started Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {partnershipAccounts.map((account) => {
                        const isInstant = account.propfirm_rules?.toLowerCase().includes("instant");
                        return (
                            <div
                                key={account.id}
                                className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 text-lg">
                                                {account.propfirm_name || "Prop Firm Account"}
                                            </span>
                                            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                isInstant 
                                                    ? "bg-amber-100 text-amber-700 border border-amber-300/50" 
                                                    : "bg-blue-100 text-blue-700 border border-blue-300/50"
                                            }`}>
                                                {isInstant ? "Instant Access" : "Challenge Model"}
                                            </span>
                                        </div>
                                        <p className="text-xs font-mono text-gray-500 flex items-center gap-1">
                                            <Key className="h-3 w-3 text-gray-400" />
                                            Login: <span className="font-semibold text-gray-700">{account.login_id || "Pending"}</span>
                                        </p>
                                    </div>
                                    <div>{getStatusBadge(account.account_status)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 text-xs">
                                    <div>
                                        <span className="text-gray-500 block text-[11px]">Account Size</span>
                                        <span className="font-extrabold text-gray-900 text-base">
                                            ${account.account_size ? account.account_size.toLocaleString() : "0"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block text-[11px]">Server</span>
                                        <span className="font-semibold text-gray-800 text-xs flex items-center gap-1 mt-1">
                                            <Server className="h-3 w-3 text-gray-400" />
                                            {account.server_name || "MetaTrader 5"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 text-xs border-t border-gray-100">
                                    <span className="text-gray-400">
                                        Created {account.created_at ? new Date(account.created_at).toLocaleDateString() : "Recently"}
                                    </span>
                                    <button
                                        onClick={() => setSelectedAccount(account)}
                                        className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                                    >
                                        View Details <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Account Details Modal */}
            {selectedAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {selectedAccount.propfirm_name} Partnership
                                </h3>
                                <p className="text-xs text-gray-500">Credentials & Account Status</p>
                            </div>
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Status</span>
                                <div>{getStatusBadge(selectedAccount.account_status)}</div>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Login ID</span>
                                <span className="font-mono font-bold text-gray-900">{selectedAccount.login_id || "N/A"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Account Capital</span>
                                <span className="font-extrabold text-blue-600">
                                    ${selectedAccount.account_size?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Trading Platform</span>
                                <span className="font-medium text-gray-800">{selectedAccount.trading_platform || "MT5"}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-500">Server</span>
                                <span className="font-medium text-gray-800">{selectedAccount.server_name || "Live Server"}</span>
                            </div>
                            <div className="py-2">
                                <span className="text-gray-500 block mb-1">Partnership Notes:</span>
                                <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-700 font-mono">
                                    {selectedAccount.propfirm_rules || "PropSol Standard Managed Partnership"}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
