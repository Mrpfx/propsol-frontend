"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Check, Calendar, User as UserIcon, DollarSign } from "lucide-react";
import Link from "next/link";
import { userService, ReferralStatsResponse } from "@/services/user.service";
import { walletService, EarningItem } from "@/services/wallet.service";

export function ReferralsView() {
    const [stats, setStats] = useState<ReferralStatsResponse | null>(null);
    const [earnings, setEarnings] = useState<EarningItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, earningsData] = await Promise.all([
                    userService.getReferralStats(),
                    walletService.getEarnings()
                ]);
                setStats(statsData);
                setEarnings(earningsData);
            } catch (error) {
                console.error("Failed to fetch referral data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const referralLink = stats?.referral_code
        ? `https://propfirmsol.com/signup?ref=${stats.referral_code}`
        : "Loading...";

    const handleCopy = async () => {
        if (!stats?.referral_code) return;
        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleShare = async () => {
        if (!stats?.referral_code) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join PropSol',
                    text: 'Join me on PropSol and get funded!',
                    url: referralLink,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopy();
        }
    };

    if (loading) {
        return <div className="py-20 text-center text-gray-500">Loading referral data...</div>;
    }

    return (
        <div className="flex flex-col gap-8 py-8">
            {/* Top Referral Card */}
            <div className="flex justify-center">
                <div className="w-full max-w-md rounded-2xl bg-gray-100 p-8 text-center">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">
                        Share your unique link or referral code
                    </h3>
                    <p className="mb-6 text-xs text-gray-500">
                        On Standard Pass You instantly earn <span className="font-bold text-gray-900">5%</span> from your referred client upon payment. On Guaranteed pass, Once your referral's account is successfully passed, you earn <span className="font-bold text-gray-900">5%</span> available for immediate withdrawal.
                        <Link href="/dashboard/wallet" className="ml-1 text-blue-600 hover:underline font-medium">
                            Go to Wallet
                        </Link>
                    </p>

                    <div className="mb-8 text-left">
                        <label className="mb-2 block text-xs font-medium text-gray-700">
                            Referral Link
                        </label>
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                            <span className="truncate text-sm text-gray-600 select-all">
                                {referralLink}
                            </span>
                            <div className="flex gap-2 text-gray-500">
                                <button onClick={handleShare} className="hover:text-gray-900" title="Share">
                                    <Share2 className="h-4 w-4" />
                                </button>
                                <button onClick={handleCopy} className="hover:text-gray-900" title="Copy">
                                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-left">
                        <h4 className="mb-4 text-sm font-bold text-gray-900">Referral Stats</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total referrals</span>
                                <span className="font-medium text-gray-900">{stats?.total_referrals || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Successful passes</span>
                                <span className="font-medium text-gray-900">{stats?.successful_passes || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Pending referrals</span>
                                <span className="font-medium text-gray-900">{stats?.pending_referrals || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total earned</span>
                                <span className="font-medium text-gray-900">${stats?.total_earned?.toFixed(2) || "0.00"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings History Table */}
            <div className="w-full">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Earnings History</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-500">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Referred User</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {earnings.length > 0 ? (
                                    earnings.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    {new Date(item.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="h-4 w-4 text-gray-400" />
                                                    {item.referred_user_name || "Unknown User"}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4 text-green-500" />
                                                    {item.amount.toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === "available"
                                                        ? "bg-green-100 text-green-800"
                                                        : item.status === "withdrawn"
                                                            ? "bg-gray-100 text-gray-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                >
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No earnings found yet. Share your link to start earning!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
