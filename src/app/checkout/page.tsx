// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    Layers,
    Target,
    CheckCircle,
    CheckCircle2,
    ShieldCheck,
    Clock,
    AlertTriangle,
    Info,
    ArrowLeft,
    ArrowRight,
    RefreshCw,
    Wallet,
    CreditCard,
    QrCode,
    Bitcoin,
    ExternalLink,
    Copy,
    Check,
    FileText
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { planService, Plan } from "@/services/plan.service";
import { propFirmService } from "@/services/prop-firm.service";
import { userService } from "@/services/user.service";
import { paymentService } from "@/services/payment.service";

// Crypto Payment Service helper logic matching cPanel build
const cryptoService = {
    getApiStatus: async () => (await api.get("/crypto-payments/status")).data,
    getAvailableCurrencies: async () => (await api.get("/crypto-payments/currencies")).data,
    async getMinimumAmount(currency_from: string, currency_to?: string, is_fixed_rate = false, is_fee_paid_by_user = false) {
        const params = new URLSearchParams({
            currency_from,
            ...(currency_to && { currency_to }),
            is_fixed_rate: is_fixed_rate.toString(),
            is_fee_paid_by_user: is_fee_paid_by_user.toString()
        });
        return (await api.get(`/crypto-payments/min-amount?${params}`)).data;
    },
    async getEstimatedPrice(amount: number, currency_from: string, currency_to: string) {
        const params = new URLSearchParams({
            amount: amount.toString(),
            currency_from,
            currency_to
        });
        return (await api.get(`/crypto-payments/estimate?${params}`)).data;
    },
    createInvoice: async (data: any) => (await api.post("/crypto-payments/invoice", data)).data,
    createPayment: async (data: any) => (await api.post("/crypto-payments/payment", data)).data,
    getPaymentStatus: async (payment_id: string) => (await api.get(`/crypto-payments/payment/${payment_id}/status`)).data,
    getUserPayments: async () => (await api.get("/crypto-payments")).data,
    getPaymentById: async (id: string) => (await api.get(`/crypto-payments/${id}`)).data
};

// Step 1: Choose Your Prop Firm
const PROP_FIRMS = [
    { id: "FundedNext", name: "FundedNext" },
    { id: "FundingPips", name: "FundingPips" },
    { id: "FTMO", name: "FTMO" }
];

function Step1PropFirm({ data, updateData, onNext }) {
    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Choose Your Prop Firm</h2>
            <p className="text-gray-400 mb-6 text-sm">Select the prop firm you purchased your evaluation from</p>
            <div className="space-y-4">
                {PROP_FIRMS.map((firm) => (
                    <button
                        key={firm.id}
                        onClick={() => updateData({ propFirm: firm.id })}
                        className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                            data.propFirm === firm.id
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                        }`}
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-4">
                            <Building2 className="w-5 h-5 text-gray-300" />
                        </div>
                        <span className="font-medium text-white">{firm.name}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={onNext}
                disabled={!data.propFirm}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 2: Select Challenge Type
const CHALLENGES = [
    { id: "2-Step Challenge", name: "2-Step Challenge", desc: "Complete Phase 1, then Phase 2 to get funded" },
    { id: "1-Step Challenge", name: "1-Step Challenge", desc: "Single evaluation phase to get funded" }
];

function Step2Challenge({ data, updateData, onNext }) {
    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Select Challenge Type</h2>
            <p className="text-gray-400 mb-6 text-sm">Choose your evaluation structure</p>
            <div className="space-y-4">
                {CHALLENGES.map((ch) => (
                    <button
                        key={ch.id}
                        onClick={() => updateData({ challengeType: ch.id })}
                        className={`w-full text-left p-6 rounded-xl border transition-all ${
                            data.challengeType === ch.id
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                        }`}
                    >
                        <div className="flex items-start">
                            <div className="mt-1 mr-4">
                                <Layers className={`w-6 h-6 ${data.challengeType === ch.id ? "text-blue-400" : "text-gray-400"}`} />
                            </div>
                            <div>
                                <div className="font-semibold text-lg text-white mb-1">{ch.name}</div>
                                <div className="text-sm text-gray-400">{ch.desc}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
            <button
                onClick={onNext}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 3: Scope of Service
function Step3Scope({ data, updateData, onNext }) {
    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Scope of Service</h2>
            <p className="text-gray-400 mb-6 text-sm">Choose what you need help with</p>
            <div className="space-y-4">
                <button
                    onClick={() => updateData({ scope: "Step 1 Only" })}
                    className={`w-full text-left p-6 rounded-xl border transition-all ${
                        data.scope === "Step 1 Only"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                    }`}
                >
                    <div className="flex items-center">
                        <div className="mr-4">
                            <Target className={`w-8 h-8 ${data.scope === "Step 1 Only" ? "text-blue-400" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <div className="font-semibold text-lg text-white mb-1">Pass Step 1 Only</div>
                            <div className="text-sm text-gray-400">We'll help you pass Phase 1 of your evaluation</div>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => updateData({ scope: "Full Pass" })}
                    className={`w-full text-left p-6 rounded-xl border transition-all ${
                        data.scope === "Full Pass"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                    }`}
                >
                    <div className="flex items-center">
                        <div className="mr-4">
                            <CheckCircle2 className={`w-8 h-8 ${data.scope === "Full Pass" ? "text-blue-400" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <div className="font-semibold text-lg text-white mb-1">Pass Both Step 1 + Step 2 (Full Pass)</div>
                            <div className="text-sm text-gray-400">We'll help you pass both phases and get you funded</div>
                        </div>
                    </div>
                </button>
            </div>
            <button
                onClick={onNext}
                disabled={!data.scope}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 4: Account Size
const ACCOUNT_SIZES = [50000, 100000, 200000, 500000];

function Step4AccountSize({ data, updateData, onNext }) {
    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Select Account Size</h2>
            <p className="text-gray-400 mb-6 text-sm">Choose your evaluation account size</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACCOUNT_SIZES.map((size) => (
                    <button
                        key={size}
                        onClick={() => updateData({ accountSize: size })}
                        className={`p-8 rounded-xl border transition-all flex flex-col items-center justify-center ${
                            data.accountSize === size
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                        }`}
                    >
                        <span className="text-gray-400 text-sm mb-1">$</span>
                        <span className="text-2xl font-bold text-white">${size.toLocaleString()}</span>
                    </button>
                ))}
            </div>
            <button
                onClick={onNext}
                disabled={!data.accountSize}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 5: Choose Package
function Step5Package({ data, updateData, onNext, plans }) {
    const computedPrices = useMemo(() => {
        const challengeTypeSlug = data.challengeType === "1-Step Challenge" ? "1-step" : "2-step";
        let scopeSlug = "full";
        if (data.challengeType === "2-Step Challenge") {
            scopeSlug = data.scope === "Step 1 Only" ? "step-1" : "full";
        }
        const stdSlug = `standard-${challengeTypeSlug}-${scopeSlug}`;
        const grtSlug = `guaranteed-${challengeTypeSlug}-${scopeSlug}`;

        const stdPlan = plans.find((p) => p.slug === stdSlug);
        const grtPlan = plans.find((p) => p.slug === grtSlug);

        const getPriceForSize = (plan, size) => {
            if (!plan || !plan.prices) return 0;
            const match = plan.prices.find((p) => p.account_size === size);
            return match ? match.price : 0;
        };

        return {
            standard: getPriceForSize(stdPlan, data.accountSize),
            guaranteed: getPriceForSize(grtPlan, data.accountSize)
        };
    }, [data.challengeType, data.scope, data.accountSize, plans]);

    useEffect(() => {
        const targetPrice = data.packageType === "Standard Pass" ? computedPrices.standard : computedPrices.guaranteed;
        if (data.price !== targetPrice) {
            updateData({ price: targetPrice });
        }
    }, [data.packageType, computedPrices, data.price, updateData]);

    const handleSelect = (pkgType) => {
        updateData({ packageType: pkgType });
    };

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Choose Your Package</h2>
            <p className="text-gray-400 mb-6 text-sm">Select the service level that fits your needs</p>
            <div className="space-y-4">
                <button
                    onClick={() => handleSelect("Standard Pass")}
                    className={`w-full text-left p-6 rounded-xl border transition-all relative ${
                        data.packageType === "Standard Pass"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                    }`}
                >
                    <div className="flex items-start">
                        <div className="mt-1 mr-4">
                            <CheckCircle className={`w-6 h-6 ${data.packageType === "Standard Pass" ? "text-blue-400" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center w-full mb-2">
                                <div className="font-semibold text-lg text-white">Standard Pass</div>
                                <div className="text-xl font-bold text-white">
                                    {computedPrices.standard > 0 ? `$${computedPrices.standard}` : "N/A"}
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">Professional evaluation passing service at competitive pricing</p>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                                <li>Professional traders</li>
                                <li>30-60 day completion window</li>
                                <li>Lower cost option</li>
                                <li>Access to PropSol live trading system</li>
                            </ul>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => handleSelect("Guaranteed Pass")}
                    className={`w-full text-left p-6 rounded-xl border transition-all relative overflow-hidden ${
                        data.packageType === "Guaranteed Pass"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                    }`}
                >
                    {data.packageType === "Guaranteed Pass" && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg">Recommended</div>
                    )}
                    <div className="flex items-start">
                        <div className="mt-1 mr-4">
                            <ShieldCheck className={`w-6 h-6 ${data.packageType === "Guaranteed Pass" ? "text-blue-400" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <div className="flex justify-between items-center w-full mb-2">
                                <div className="font-semibold text-lg text-white">Guaranteed Pass</div>
                                <div className="text-xl font-bold text-white">
                                    {computedPrices.guaranteed > 0 ? `$${computedPrices.guaranteed}` : "N/A"}
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">Full refund protection including challenge cost and compensation</p>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                                <li>Priority execution</li>
                                <li>Full refund if we don't pass</li>
                                <li>Challenge cost + compensation included</li>
                                <li>Peace of mind guarantee</li>
                                <li>Access to PropSol live trading system</li>
                            </ul>
                        </div>
                    </div>
                </button>
            </div>
            <button
                onClick={onNext}
                disabled={computedPrices.standard === 0 && computedPrices.guaranteed === 0}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50"
            >
                Continue
            </button>
        </div>
    );
}

// Step 6: Timeline & Rules
function Step6Timeline({ onNext }) {
    const [agreedTimeline, setAgreedTimeline] = useState(false);
    const [agreedNoTrading, setAgreedNoTrading] = useState(false);

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Timeline & Rules Confirmation</h2>
            <p className="text-gray-400 mb-6 text-sm">Please review and acknowledge the following</p>
            <div className="space-y-6">
                <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">Timeline Expectations</h3>
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                            Varies by Prop Firm trading system generation
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                        We target completion within 30 trading days, with a maximum window of 60 trading days. Completion time depends on market conditions and trading opportunities.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div
                            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                agreedTimeline ? "bg-blue-600 border-blue-600" : "border-gray-600 group-hover:border-gray-500"
                            }`}
                        >
                            {agreedTimeline && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={agreedTimeline}
                            onChange={(e) => setAgreedTimeline(e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">I understand and accept the 30-60 trading day timeline</span>
                    </label>
                </div>

                <div className="bg-[#1A2040] p-6 rounded-xl border border-yellow-900/30">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold text-yellow-500">Critical: No Trading Policy</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                        Do not trade on your account after submission. Any client trading or interference after you submit your credentials will void all package benefits and guarantees. This is to ensure clean evaluation execution.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div
                            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                agreedNoTrading ? "bg-blue-600 border-blue-600" : "border-gray-600 group-hover:border-gray-500"
                            }`}
                        >
                            {agreedNoTrading && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={agreedNoTrading}
                            onChange={(e) => setAgreedNoTrading(e.target.checked)}
                        />
                        <span className="text-sm text-gray-300">I understand I must not trade on the account after submission</span>
                    </label>
                </div>
            </div>
            <button
                onClick={onNext}
                disabled={!agreedTimeline || !agreedNoTrading}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 7: Order Summary
function Step7Summary({ data, onNext }) {
    const vatAmount = (data.price * (data.vatPercentage || 0)) / 100;
    const totalPrice = data.price + vatAmount;

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p className="text-gray-400 mb-6 text-sm">Review your selections and total price</p>
            <div className="bg-[#1A2040] rounded-xl p-6 space-y-4 mb-8">
                <div className="grid grid-cols-2 gap-4 text-white">
                    <div>
                        <div className="text-xs text-gray-500 uppercase mb-1">Prop Firm</div>
                        <div className="font-medium">{data.propFirm}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase mb-1">Challenge Type</div>
                        <div className="font-medium">{data.challengeType}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase mb-1">Scope</div>
                        <div className="font-medium">{data.scope || "Full Pass"}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase mb-1">Account Size</div>
                        <div className="font-medium">${data.accountSize?.toLocaleString()}</div>
                    </div>
                    <div className="col-span-2">
                        <div className="text-xs text-gray-500 uppercase mb-1">Package</div>
                        <div className="font-medium">{data.packageType}</div>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <div className="text-gray-400">Subtotal</div>
                        <div className="text-white">${data.price?.toLocaleString()}</div>
                    </div>
                    {data.vatPercentage !== undefined && data.vatPercentage > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <div className="text-gray-400">VAT ({data.vatPercentage}%)</div>
                            <div className="text-white">
                                ${vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                        <div className="text-gray-400">Total Price</div>
                        <div className="text-2xl font-bold text-white">
                            ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors">
                Proceed to Account Details
            </button>
        </div>
    );
}

// Step 8: Account Credentials (MT5 Login Details)
function Step8Credentials({ data, updateData, onNext }) {
    const isValid = data.loginId?.length > 3 && data.password?.length > 3 && data.serverName?.length > 3;

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-3 mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-xs text-yellow-500">
                    Important: MT5 Only • Do Not Trade • Target 30 trading days • Max 60 trading days
                </span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">MT5 Login Details</h2>
            <p className="text-gray-400 mb-6 text-sm">Provide your MetaTrader 5 account credentials</p>

            <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-xl p-4 mb-6 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-500/90 leading-relaxed">
                    <span className="font-bold">Warning:</span>
                    <br />
                    Do not trade on this account after submitting your credentials. Any trading activity will void your package benefits.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1 ml-1">MT5 Login ID</label>
                    <input
                        type="text"
                        value={data.loginId}
                        onChange={(e) => updateData({ loginId: e.target.value })}
                        placeholder="Enter your MT5 login ID"
                        className="w-full bg-[#1A2040] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1 ml-1">MT5 Password</label>
                    <input
                        type="text"
                        value={data.password}
                        onChange={(e) => updateData({ password: e.target.value })}
                        placeholder="Enter your MT5 password"
                        className="w-full bg-[#1A2040] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1 ml-1">MT5 Server</label>
                    <input
                        type="text"
                        value={data.serverName}
                        onChange={(e) => updateData({ serverName: e.target.value })}
                        placeholder="e.g. FundedNext-Server"
                        className="w-full bg-[#1A2040] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-blue-900/20 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <p className="text-xs text-blue-200/70">
                    Your credentials are securely encrypted and only used by our professional traders to execute your evaluation. We never share your information with third parties.
                </p>
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 9: Additional Information
function Step9AdditionalInfo({ data, updateData, onNext }) {
    const isValid = data.whatsapp?.length > 3 && data.telegram?.length > 3;

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-3 mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-xs text-yellow-500">
                    Important: MT5 Only • Do Not Trade • Target 30 trading days • Max 60 trading days
                </span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">Additional Information</h2>
            <p className="text-gray-400 mb-6 text-sm">Optional notes for our traders (recommended)</p>

            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 ml-1">WhatsApp Number *</label>
                        <input
                            type="text"
                            value={data.whatsapp}
                            onChange={(e) => updateData({ whatsapp: e.target.value })}
                            placeholder="+1 234 567 8900"
                            className="w-full bg-[#1A2040] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1 ml-1">Telegram Username *</label>
                        <input
                            type="text"
                            value={data.telegram}
                            onChange={(e) => updateData({ telegram: e.target.value })}
                            placeholder="@username"
                            className="w-full bg-[#1A2040] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-500 mb-1 ml-1">Trader Notes (Optional)</label>
                    <textarea
                        value={data.notes}
                        onChange={(e) => updateData({ notes: e.target.value })}
                        placeholder={`Include any relevant information such as:\n- Specific drawdown limits or rules\n- News trading restrictions\n- Preferred trading times\n- Maximum spread requirements\n- Any other special considerations`}
                        rows={6}
                        className="w-full bg-[#1A2040] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Providing detailed information helps our traders execute your evaluation more effectively.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex items-start gap-3 p-4 bg-blue-900/20 rounded-xl">
                <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <p className="text-xs text-blue-200/70">
                    <span className="font-bold">Pro Tip:</span> Include information about your challenge rules, especially if there are restrictions on news trading, maximum daily loss, or specific trading hours required.
                </p>
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 10: Legal & Terms Acknowledgment
function Step10Terms({ data, updateData, onNext }) {
    const isValid = data.agreedToTerms && data.agreedToRefundPolicy;

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-3 mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-xs text-yellow-500">
                    Important: MT5 Only • Do Not Trade • Target 30 trading days • Max 60 trading days
                </span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">Legal & Acknowledgment</h2>
            <p className="text-gray-400 mb-6 text-sm">Please review and accept the terms</p>

            <div className="space-y-4">
                <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center text-xs text-gray-400">
                            ?
                        </div>
                        Service Understanding
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        PropSol provides a professional evaluation passing service. We help you pass your prop firm evaluation by trading on your account. This is a <span className="text-white font-bold">service</span>, not a profit guarantee.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div
                            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                data.agreedToTerms ? "bg-blue-600 border-blue-600" : "border-gray-600 group-hover:border-gray-500"
                            }`}
                        >
                            {data.agreedToTerms && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={data.agreedToTerms}
                            onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
                        />
                        <span className="text-sm text-gray-300">I understand this is an evaluation passing service, not a profit guarantee</span>
                    </label>
                </div>

                <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700">
                    <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center text-xs text-gray-400">
                            !
                        </div>
                        {data.packageType} Terms
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        {data.packageType === "Standard Pass"
                            ? "The Standard Pass package does not include refund protection. We will make our best effort to pass your evaluation within the 60-day window, but no refund is provided if we are unable to complete the evaluation successfully."
                            : "The Guaranteed Pass package includes full refund protection. If we fail to pass your evaluation within the 60-day window, you will receive a full refund of the service fee plus the challenge cost."}
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div
                            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                data.agreedToRefundPolicy ? "bg-blue-600 border-blue-600" : "border-gray-600 group-hover:border-gray-500"
                            }`}
                        >
                            {data.agreedToRefundPolicy && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={data.agreedToRefundPolicy}
                            onChange={(e) => updateData({ agreedToRefundPolicy: e.target.checked })}
                        />
                        <span className="text-sm text-gray-300">
                            I understand the {data.packageType} terms regarding refunds and protection
                        </span>
                    </label>
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={!isValid}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Proceed to Payment
            </button>
        </div>
    );
}

// Step 11: Crypto & Card Payment Screen
function Step11Payment({ data, updateData, onSubmit, loading }) {
    const isWhopEligible = data.price <= 2500;
    const [method, setMethod] = useState(isWhopEligible ? "whop" : "invoice");
    const [availableCurrencies, setAvailableCurrencies] = useState([]);
    const [cryptoCurrency, setCryptoCurrency] = useState("btc");
    const [estimatedCrypto, setEstimatedCrypto] = useState(null);
    const [loadingEstimate, setLoadingEstimate] = useState(false);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);

    const defaultCurrencies = ["btc", "usdttrc20", "eth", "ltc", "bnb", "trx", "usdc"];

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const res = await cryptoService.getAvailableCurrencies();
                const currencies = res?.currencies || [];
                const merged = [...defaultCurrencies.filter((c) => currencies.includes(c)), ...currencies.filter((c) => !defaultCurrencies.includes(c))];
                setAvailableCurrencies(merged.length > 0 ? merged : defaultCurrencies);
            } catch (err) {
                setAvailableCurrencies(defaultCurrencies);
            } finally {
                setLoadingCurrencies(false);
            }
        };
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (!isWhopEligible && method === "whop") {
            setMethod("invoice");
        }
    }, [isWhopEligible, method]);

    const discountPercentage = data.discountPercentage || 0;
    const hasDiscount = discountPercentage > 0;
    const discountedPrice = data.price * (1 - discountPercentage / 100);
    const vatAmount = (discountedPrice * (data.vatPercentage || 0)) / 100;
    const finalTotal = discountedPrice + vatAmount;

    useEffect(() => {
        const fetchEstimate = async () => {
            if (!cryptoCurrency || finalTotal <= 0) return;
            setLoadingEstimate(true);
            try {
                const res = await cryptoService.getEstimatedPrice(finalTotal, "usd", cryptoCurrency);
                setEstimatedCrypto(res.estimated_amount);
            } catch (err) {
                setEstimatedCrypto(null);
            } finally {
                setLoadingEstimate(false);
            }
        };
        fetchEstimate();
    }, [cryptoCurrency, finalTotal]);

    const [discountInput, setDiscountInput] = useState(data.discountCode || "");
    const [checkingDiscount, setCheckingDiscount] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingCode, setPendingCode] = useState("");

    const handleConfirmDiscount = async () => {
        setShowConfirmModal(false);
        setCheckingDiscount(true);
        try {
            const res = await paymentService.checkDiscountUsage(pendingCode);
            if (res.exists && !res.used) {
                await paymentService.applyDiscount(pendingCode);
                updateData({ discountCode: res.code, discountPercentage: res.percentage });
                toast.success(`Discount of ${res.percentage}% applied!`);
            } else {
                toast.error(res.used ? "Discount code already used" : "Invalid discount code");
                updateData({ discountCode: undefined, discountPercentage: 0 });
            }
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Failed to check discount code");
            updateData({ discountCode: undefined, discountPercentage: 0 });
        } finally {
            setCheckingDiscount(false);
            setPendingCode("");
        }
    };

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-3 mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-xs text-yellow-500">
                    Important: MT5 Only • Do Not Trade • Target 30 trading days • Max 60 trading days
                </span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">Crypto Payment</h2>
            <p className="text-gray-400 mb-6 text-sm">Pay with cryptocurrency for your prop firm challenge</p>

            {/* Price Summary & Discount Box */}
            <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700 mb-8 space-y-4">
                {showConfirmModal && (
                    <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-500 mb-1">Confirm Discount Application</p>
                                <p className="text-xs text-amber-200/80 mb-3">
                                    This discount code can only be used once. Once applied, it cannot be undone or reused if you cancel.
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleConfirmDiscount}
                                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-md transition-colors"
                                    >
                                        Confirm & Apply
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="px-3 py-1.5 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-xs font-medium rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={discountInput}
                            onChange={(e) => setDiscountInput(e.target.value)}
                            disabled={hasDiscount || checkingDiscount}
                            placeholder="Discount Code"
                            className="w-full bg-[#111836] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        />
                        {hasDiscount && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xs font-medium flex items-center gap-1">
                                <Check className="w-3 h-3" /> Applied
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            if (discountInput.trim()) {
                                setPendingCode(discountInput.trim());
                                setShowConfirmModal(true);
                            }
                        }}
                        disabled={!discountInput || hasDiscount || checkingDiscount}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center"
                    >
                        {checkingDiscount ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Apply"}
                    </button>
                </div>

                <div className="h-px bg-gray-700 my-4" />

                <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>${data.price.toFixed(2)}</span>
                </div>
                {hasDiscount && (
                    <div className="flex justify-between items-center text-sm text-green-400">
                        <span>Discount ({discountPercentage}%)</span>
                        <span>-${((data.price * discountPercentage) / 100).toFixed(2)}</span>
                    </div>
                )}
                {data.vatPercentage ? (
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>VAT ({data.vatPercentage}%)</span>
                        <span>${vatAmount.toFixed(2)}</span>
                    </div>
                ) : null}
                <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                    <span className="text-gray-300 font-medium">Total</span>
                    <span className="text-2xl font-bold text-white">${finalTotal.toFixed(2)}</span>
                </div>

                {method !== "whop" && estimatedCrypto !== null && (
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <span className="text-sm text-gray-400">
                            Estimated {cryptoCurrency.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                            {loadingEstimate ? (
                                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                            ) : (
                                <>
                                    <span className="text-lg font-semibold text-blue-400">
                                        ≈ {Number(estimatedCrypto).toFixed(8)}
                                    </span>
                                    <span className="text-sm text-gray-400">{cryptoCurrency.toUpperCase()}</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Cryptocurrency Selector */}
            {method !== "whop" && (
                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-3">Select Cryptocurrency</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {loadingCurrencies ? (
                            <div className="col-span-2 sm:col-span-4 text-center py-4 text-gray-500">
                                Loading currencies...
                            </div>
                        ) : (
                            availableCurrencies.slice(0, 8).map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => {
                                        setCryptoCurrency(curr);
                                        updateData({ cryptoCurrency: curr });
                                    }}
                                    className={`p-4 rounded-xl border transition-all ${
                                        cryptoCurrency === curr
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-gray-700 bg-[#1A2040] hover:border-gray-600"
                                    }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Bitcoin className={`w-6 h-6 ${cryptoCurrency === curr ? "text-blue-400" : "text-gray-400"}`} />
                                        <span className={`text-xs font-medium ${cryptoCurrency === curr ? "text-white" : "text-gray-400"}`}>
                                            {curr.toUpperCase()}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Payment Method Option Selector */}
            <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-3">Payment Method</label>
                <div className="space-y-3">
                    <div
                        className={`border rounded-xl overflow-hidden transition-all ${
                            !isWhopEligible
                                ? "border-gray-800 bg-gray-900/50 opacity-60 cursor-not-allowed"
                                : method === "whop"
                                ? "border-blue-500 bg-blue-500/5"
                                : "border-gray-700 bg-[#1A2040]"
                        }`}
                    >
                        <button
                            onClick={() => isWhopEligible && setMethod("whop")}
                            disabled={!isWhopEligible}
                            className="w-full flex items-start p-4 text-left disabled:cursor-not-allowed"
                        >
                            <CreditCard className={`w-5 h-5 mr-3 mt-0.5 ${method === "whop" && isWhopEligible ? "text-blue-400" : "text-gray-400"}`} />
                            <div className="flex-1">
                                <div className={`font-medium mb-1 ${method === "whop" && isWhopEligible ? "text-white" : "text-gray-300"}`}>
                                    Credit Card / Whop
                                </div>
                                <p className="text-xs text-gray-500">
                                    {isWhopEligible
                                        ? "Secure payment via Whop checkout (Credit Card, Crypto, Apple Pay, etc.)"
                                        : "Not available for orders over $2,500"}
                                </p>
                            </div>
                        </button>
                    </div>

                    <div
                        className={`border rounded-xl overflow-hidden transition-all ${
                            method === "invoice" ? "border-blue-500 bg-blue-500/5" : "border-gray-700 bg-[#1A2040]"
                        }`}
                    >
                        <button onClick={() => setMethod("invoice")} className="w-full flex items-start p-4 text-left">
                            <ExternalLink className={`w-5 h-5 mr-3 mt-0.5 ${method === "invoice" ? "text-blue-400" : "text-gray-400"}`} />
                            <div className="flex-1">
                                <div className={`font-medium mb-1 ${method === "invoice" ? "text-white" : "text-gray-300"}`}>
                                    Hosted Payment Page
                                </div>
                                <p className="text-xs text-gray-500">
                                    Redirected to NOWPayments secure page to complete payment
                                </p>
                            </div>
                        </button>
                    </div>

                    <div
                        className={`border rounded-xl overflow-hidden transition-all ${
                            method === "direct" ? "border-blue-500 bg-blue-500/5" : "border-gray-700 bg-[#1A2040]"
                        }`}
                    >
                        <button onClick={() => setMethod("direct")} className="w-full flex items-start p-4 text-left">
                            <QrCode className={`w-5 h-5 mr-3 mt-0.5 ${method === "direct" ? "text-blue-400" : "text-gray-400"}`} />
                            <div className="flex-1">
                                <div className={`font-medium mb-1 ${method === "direct" ? "text-white" : "text-gray-300"}`}>
                                    Direct Wallet Payment
                                </div>
                                <p className="text-xs text-gray-500">
                                    Send crypto directly from your wallet (QR code & address provided)
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-300 space-y-1">
                        <p className="font-semibold">Payment Instructions:</p>
                        {method === "invoice" ? (
                            <p>
                                You'll be redirected to a secure NOWPayments page where you can complete your payment. After payment, you'll be automatically redirected back.
                            </p>
                        ) : method === "direct" ? (
                            <p>
                                You'll receive a unique payment address and QR code. Send the exact amount to complete your order. Payment confirmation typically takes 5-30 minutes depending on network.
                            </p>
                        ) : (
                            <p>You'll be redirected to Whop Checkout to complete your purchase securely.</p>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => onSubmit(method)}
                disabled={(!cryptoCurrency && method !== "whop") || loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Wallet className="w-5 h-5" />
                        {method === "invoice" || method === "whop" ? "Continue to Payment" : "Generate Payment Address"}
                    </>
                )}
            </button>

            <div className="mt-4 text-xs text-center text-gray-500">
                <p>Powered by NOWPayments • Secure cryptocurrency payment processing</p>
            </div>
        </div>
    );
}

// Step 12: Direct Wallet Payment Instructions & QR Code
function Step12DirectPayment({ payment, onComplete }) {
    const [copied, setCopied] = useState(false);
    const [status, setStatus] = useState(payment.payment_status || "waiting");
    const [checking, setChecking] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3600);

    const qrUrl = payment.pay_address
        ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              `${payment.pay_currency}:${payment.pay_address}?amount=${payment.pay_amount}`
          )}`
        : null;

    useEffect(() => {
        const timer = setInterval(() => {
            checkStatus();
        }, 30000);
        return () => clearInterval(timer);
    }, [payment.payment_id]);

    useEffect(() => {
        const countdownTimer = setInterval(() => {
            setTimeLeft((prev) => (prev <= 0 ? (clearInterval(countdownTimer), 0) : prev - 1));
        }, 1000);
        return () => clearInterval(countdownTimer);
    }, []);

    const checkStatus = async () => {
        if (!payment.payment_id) return;
        setChecking(true);
        try {
            const res = await cryptoService.getPaymentStatus(payment.payment_id);
            setStatus(res.payment_status);
            if (res.payment_status === "finished" || res.payment_status === "confirmed") {
                toast.success("Payment confirmed!");
                setTimeout(() => onComplete(), 2000);
            }
        } catch (err) {
            console.error("Failed to check payment status:", err);
        } finally {
            setChecking(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const getStatusColor = (st) => {
        switch (st) {
            case "waiting":
            case "confirming":
                return "text-yellow-400";
            case "confirmed":
            case "finished":
                return "text-green-400";
            case "failed":
            case "expired":
                return "text-red-400";
            default:
                return "text-gray-400";
        }
    };

    const getStatusLabel = (st) => {
        switch (st) {
            case "waiting":
                return "Waiting for payment";
            case "confirming":
                return "Confirming payment";
            case "confirmed":
                return "Payment confirmed";
            case "finished":
                return "Payment completed";
            case "failed":
                return "Payment failed";
            case "expired":
                return "Payment expired";
            default:
                return st;
        }
    };

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800 max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/20 border border-yellow-900/50 mb-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className={`text-sm font-medium ${getStatusColor(status)}`}>{getStatusLabel(status)}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Complete Your Payment</h2>
                <p className="text-gray-400 text-sm">
                    Send exactly{" "}
                    <span className="text-white font-semibold">
                        {payment.pay_amount} {payment.pay_currency?.toUpperCase()}
                    </span>{" "}
                    to the address below
                </p>
            </div>

            {timeLeft > 0 && (
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 mb-6 text-center">
                    <p className="text-xs text-blue-300 mb-1">Time remaining to complete payment</p>
                    <p className="text-2xl font-mono font-bold text-blue-400">{formatTime(timeLeft)}</p>
                </div>
            )}

            {qrUrl && (
                <div className="bg-white p-6 rounded-xl mb-6 flex justify-center">
                    <img src={qrUrl} alt="Payment QR Code" className="w-64 h-64" />
                </div>
            )}

            <div className="space-y-4 mb-6">
                <div className="bg-[#1A2040] p-4 rounded-xl border border-gray-700">
                    <label className="block text-xs text-gray-500 mb-2">Amount to Send</label>
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-mono font-semibold text-white">
                            {payment.pay_amount} {payment.pay_currency?.toUpperCase()}
                        </span>
                        <button
                            onClick={() => copyToClipboard(payment.pay_amount?.toString() || "")}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                    </div>
                </div>

                <div className="bg-[#1A2040] p-4 rounded-xl border border-gray-700">
                    <label className="block text-xs text-gray-500 mb-2">Payment Address</label>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-mono text-white break-all flex-1">{payment.pay_address}</span>
                        <button
                            onClick={() => copyToClipboard(payment.pay_address || "")}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                    </div>
                </div>

                {payment.payin_extra_id && (
                    <div className="bg-[#1A2040] p-4 rounded-xl border border-gray-700">
                        <label className="block text-xs text-gray-500 mb-2">Memo/Tag (Required)</label>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-mono text-white break-all flex-1">{payment.payin_extra_id}</span>
                            <button
                                onClick={() => copyToClipboard(payment.payin_extra_id || "")}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                    </div>
                )}

                {payment.order_id && (
                    <div className="bg-[#1A2040] p-4 rounded-xl border border-gray-700">
                        <label className="block text-xs text-gray-500 mb-2">Order ID</label>
                        <span className="text-sm font-mono text-gray-300">{payment.order_id}</span>
                    </div>
                )}
            </div>

            <button
                onClick={checkStatus}
                disabled={checking}
                className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
            >
                <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                {checking ? "Checking..." : "Check Payment Status"}
            </button>

            <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4">
                <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-red-300 space-y-1">
                        <p className="font-semibold">Important:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Send ONLY {payment.pay_currency?.toUpperCase()} to this address</li>
                            <li>Send the exact amount shown above</li>
                            {payment.payin_extra_id && <li>Include the Memo/Tag or your payment will be lost</li>}
                            <li>Do not close this page until payment is confirmed</li>
                            <li>Payment typically confirms within 5-30 minutes</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs text-center text-gray-500">
                <p>Powered by NOWPayments • Secure cryptocurrency payment processing</p>
            </div>
        </div>
    );
}

// Step 13: Order Placed Success Screen
function Step13OrderSuccess({ orderId }) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown === 0) {
            router.push("/dashboard");
        }
    }, [countdown, router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800 text-center py-16">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-400 mb-2">Thank you for your purchase. Your order has been received and is being processed.</p>
            <p className="text-sm text-gray-500 mb-8">
                Order ID: <span className="font-mono text-white">{orderId}</span>
            </p>
            <div className="p-4 bg-blue-500/10 rounded-xl mb-8 border border-blue-500/20 max-w-md mx-auto">
                <p className="text-blue-400 mb-2 font-medium">What happens next?</p>
                <p className="text-sm text-gray-400">
                    You will receive an email shortly with your login credentials and instructions to start your challenge.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    Redirecting to dashboard in <span className="text-white font-bold">{countdown}</span> seconds...
                </p>
            </div>
            <div className="flex justify-center">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
                >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Default initial state matching cPanel build exact object structure
const INITIAL_CHECKOUT_DATA = {
    propFirm: "",
    challengeType: "2-Step Challenge",
    accountSize: 0,
    packageType: "Standard Pass",
    price: 0,
    loginId: "",
    password: "",
    serverName: "",
    serverType: "MT5",
    platform: "Metatrader 5",
    whatsapp: "",
    telegram: "",
    notes: "",
    cryptoCurrency: "btc",
    agreedToTerms: false,
    agreedToRefundPolicy: false,
    vatPercentage: 0,
    discountCode: "",
    discountPercentage: 0
};

export default function CheckoutPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_CHECKOUT_DATA);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [directPaymentDetails, setDirectPaymentDetails] = useState(null);
    const [plans, setPlans] = useState([]);

    const totalSteps = formData.challengeType === "1-Step Challenge" ? 10 : 11;

    useEffect(() => {
        window.history.pushState({ step }, "");
        const handlePopState = (e) => {
            if (step > 1) {
                e.preventDefault();
                setStep((prev) => {
                    let prevStep = prev - 1;
                    if (prevStep === 3 && formData.challengeType === "1-Step Challenge") {
                        prevStep = 2;
                    }
                    return Math.max(prevStep, 1);
                });
                window.history.pushState({ step: step - 1 }, "");
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [step, formData.challengeType]);

    const updateData = (fields) => {
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    const handleNext = () => {
        setStep((prev) => {
            let nextStep = prev + 1;
            if (nextStep === 3 && formData.challengeType === "1-Step Challenge") {
                nextStep = 4;
            }
            return Math.min(nextStep, 12);
        });
    };

    const handleBack = () => {
        setStep((prev) => {
            let prevStep = prev - 1;
            if (prevStep === 3 && formData.challengeType === "1-Step Challenge") {
                prevStep = 2;
            }
            return Math.max(prevStep, 1);
        });
    };

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const fetchedPlans = await planService.getAllPlans();
                setPlans(fetchedPlans);
            } catch (err) {
                console.error("Failed to fetch plans", err);
                toast.error("Failed to load pricing data");
            }
        };

        const fetchVat = async () => {
            try {
                const res = await api.get("/discounts/vat");
                if (res.data && res.data.length > 0) {
                    updateData({ vatPercentage: res.data[0].percentage });
                }
            } catch (err) {
                console.error("Failed to fetch VAT", err);
            }
        };

        fetchVat();
        fetchPlans();
    }, []);

    const handleSubmitOrder = async (selectedMethod) => {
        setLoading(true);

        const discountedPrice = formData.price * (1 - (formData.discountPercentage || 0) / 100);
        const finalCost = discountedPrice + (discountedPrice * (formData.vatPercentage || 0)) / 100;

        if (!localStorage.getItem("access_token")) {
            toast.error("Please login to complete your order");
            router.push("/signin?returnUrl=/checkout");
            setLoading(false);
            return;
        }

        try {
            try {
                await userService.getCurrentUser();
            } catch (err) {
                console.error("Session validation failed:", err);
                throw new Error("Session expired. Please login again.");
            }

            let regResult;
            try {
                regResult = await propFirmService.createRegistration({
                    login_id: formData.loginId,
                    password: formData.password,
                    propfirm_name: formData.propFirm,
                    propfirm_website_link: "https://example.com",
                    server_name: formData.serverName,
                    server_type: formData.serverType,
                    challenges_step: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                    service_scope: formData.scope === "Step 1 Only" ? 1 : 2,
                    propfirm_account_cost: finalCost,
                    account_size: formData.accountSize,
                    account_phases: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                    trading_platform: formData.platform,
                    propfirm_rules: formData.notes || "No specific rules provided",
                    whatsapp_no: formData.whatsapp,
                    telegram_username: formData.telegram
                });

                if (!regResult || !regResult.order_id) {
                    throw new Error("Registration failed to return an order ID.");
                }

                setOrderId(regResult.order_id);
            } catch (err) {
                console.error("Registration Error:", err);
                throw new Error(err?.response?.data?.message || "Failed to create registration. Please check your details.");
            }

            try {
                const origin = window.location.origin;
                const successUrl = `${origin}/checkout/success?order_id=${regResult.order_id}`;
                const cancelUrl = `${origin}/checkout`;

                if (selectedMethod === "whop") {
                    const whopRes = await propFirmService.createWhopCheckoutLink(regResult.order_id);
                    if (whopRes.checkout_url) {
                        window.location.href = whopRes.checkout_url;
                    } else {
                        throw new Error("Failed to get Whop checkout URL");
                    }
                    return;
                }

                if (selectedMethod === "invoice") {
                    const invoiceRes = await cryptoService.createInvoice({
                        price_amount: finalCost,
                        price_currency: "usd",
                        pay_currency: formData.cryptoCurrency,
                        order_id: regResult.order_id,
                        order_description: `PropSol - ${formData.propFirm} ${formData.challengeType} - $${formData.accountSize}k`,
                        success_url: successUrl,
                        cancel_url: cancelUrl
                    });

                    if (invoiceRes.invoice_url) {
                        window.location.href = invoiceRes.invoice_url;
                    } else {
                        throw new Error("Failed to get invoice URL");
                    }
                } else {
                    const paymentRes = await cryptoService.createPayment({
                        price_amount: finalCost,
                        price_currency: "usd",
                        pay_currency: formData.cryptoCurrency,
                        order_id: regResult.order_id,
                        order_description: `PropSol - ${formData.propFirm} ${formData.challengeType} - $${formData.accountSize}k`
                    });

                    setDirectPaymentDetails(paymentRes);
                    setStep(12);
                }
            } catch (err) {
                console.error("Payment Error:", err);
                throw new Error(err?.response?.data?.message || "Payment creation failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to process order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const currentStepDisplay = formData.challengeType === "1-Step Challenge" && step > 3 ? step - 1 : step;
    const progressPercentage = (currentStepDisplay / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-[#0A0F29] text-white flex flex-col items-center py-10 px-4">
            {step < 11 && (
                <div className="w-full max-w-4xl mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all font-medium"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Back</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all font-medium"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Dashboard</span>
                            </button>
                        )}
                        <div className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full">
                            Step {currentStepDisplay} of {totalSteps}
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-6">PropSol Checkout</h1>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl">
                {(() => {
                    switch (step) {
                        case 1:
                            return <Step1PropFirm data={formData} updateData={updateData} onNext={handleNext} />;
                        case 2:
                            return <Step2Challenge data={formData} updateData={updateData} onNext={handleNext} />;
                        case 3:
                            return <Step3Scope data={formData} updateData={updateData} onNext={handleNext} />;
                        case 4:
                            return <Step4AccountSize data={formData} updateData={updateData} onNext={handleNext} />;
                        case 5:
                            return <Step5Package data={formData} updateData={updateData} onNext={handleNext} plans={plans} />;
                        case 6:
                            return <Step6Timeline onNext={handleNext} />;
                        case 7:
                            return <Step7Summary data={formData} onNext={handleNext} />;
                        case 8:
                            return <Step8Credentials data={formData} updateData={updateData} onNext={handleNext} />;
                        case 9:
                            return <Step9AdditionalInfo data={formData} updateData={updateData} onNext={handleNext} />;
                        case 10:
                            return <Step10Terms data={formData} updateData={updateData} onNext={handleNext} />;
                        case 11:
                            return <Step11Payment data={formData} updateData={updateData} onSubmit={handleSubmitOrder} loading={loading} />;
                        case 12:
                            if (directPaymentDetails) {
                                return <Step12DirectPayment payment={directPaymentDetails} onComplete={() => setStep(13)} />;
                            } else {
                                return <Step13OrderSuccess orderId={orderId} />;
                            }
                        case 13:
                            return <Step13OrderSuccess orderId={orderId} />;
                        default:
                            return null;
                    }
                })()}
            </div>
        </div>
    );
}
