// @ts-nocheck
"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
    Building2,
    Layers,
    Target,
    CheckCircle,
    ShieldCheck,
    Clock,
    AlertTriangle,
    Info,
    ArrowLeft,
    Loader2,
    QrCode,
    Bitcoin,
    ExternalLink,
    Copy,
    Check,
    RefreshCw,
    Wallet,
    CreditCard
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { planService } from "@/services/plan.service";
import { propFirmService } from "@/services/prop-firm.service";
import { userService } from "@/services/user.service";
import { paymentService } from "@/services/payment.service";

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
                disabled={!data.challengeType}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
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
                            <ShieldCheck className={`w-8 h-8 ${data.scope === "Full Pass" ? "text-blue-400" : "text-gray-400"}`} />
                        </div>
                        <div>
                            <div className="font-semibold text-lg text-white mb-1">Full Evaluation Pass</div>
                            <div className="text-sm text-gray-400">Complete evaluation passing until funded</div>
                        </div>
                    </div>
                </button>
            </div>
            <button
                onClick={onNext}
                disabled={!data.scope}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 4: Account Size
const ACCOUNT_SIZES = [5000, 10000, 25000, 50000, 100000, 200000];

function Step4AccountSize({ data, updateData, onNext }) {
    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Select Account Size</h2>
            <p className="text-gray-400 mb-6 text-sm">Choose your prop firm account balance</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ACCOUNT_SIZES.map((size) => (
                    <button
                        key={size}
                        onClick={() => updateData({ accountSize: size })}
                        className={`p-6 rounded-xl border text-center transition-all ${
                            data.accountSize === size
                                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                : "border-gray-700 hover:border-gray-600 bg-[#1A2040] text-white"
                        }`}
                    >
                        <div className="text-2xl font-bold">${size.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 mt-1">Evaluation Balance</div>
                    </button>
                ))}
            </div>
            <button
                onClick={onNext}
                disabled={!data.accountSize}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue
            </button>
        </div>
    );
}

// Step 5: Choose Package
function Step5Package({ data, updateData, onNext, plans }) {
    const standardPrice = plans?.find((p) => p.name?.toLowerCase().includes("standard"))?.price || 250;
    const guaranteedPrice = plans?.find((p) => p.name?.toLowerCase().includes("guaranteed"))?.price || 450;

    useEffect(() => {
        if (!data.packageType) {
            updateData({ packageType: "Guaranteed Pass", price: guaranteedPrice });
        }
    }, []);

    const handleSelect = (type, price) => {
        updateData({ packageType: type, price });
    };

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Choose Your Package</h2>
            <p className="text-gray-400 mb-6 text-sm">Select the service level that fits your needs</p>
            <div className="space-y-4">
                <button
                    onClick={() => handleSelect("Standard Pass", standardPrice)}
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
                        <div className="flex-1">
                            <div className="flex justify-between items-center w-full mb-2">
                                <div className="font-semibold text-lg text-white">Standard Pass</div>
                                <div className="text-xl font-bold text-white">${standardPrice}</div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">Professional evaluation passing service at competitive pricing</p>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                                <li>Professional traders</li>
                                <li>30-60 day completion window</li>
                                <li>Access to PropSol live trading system</li>
                            </ul>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => handleSelect("Guaranteed Pass", guaranteedPrice)}
                    className={`w-full text-left p-6 rounded-xl border transition-all relative overflow-hidden ${
                        data.packageType === "Guaranteed Pass"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-700 hover:border-gray-600 bg-[#1A2040]"
                    }`}
                >
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">Recommended</div>
                    <div className="flex items-start">
                        <div className="mt-1 mr-4">
                            <ShieldCheck className={`w-6 h-6 ${data.packageType === "Guaranteed Pass" ? "text-blue-400" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center w-full mb-2">
                                <div className="font-semibold text-lg text-white">Guaranteed Pass</div>
                                <div className="text-xl font-bold text-white">${guaranteedPrice}</div>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">Full refund protection including challenge cost and compensation</p>
                            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                                <li>Priority execution</li>
                                <li>Full refund if we don't pass</li>
                                <li>Challenge cost + compensation included</li>
                                <li>Access to PropSol live trading system</li>
                            </ul>
                        </div>
                    </div>
                </button>
            </div>
            <button onClick={onNext} className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors">
                Continue
            </button>
        </div>
    );
}

// Step 6: Timeline & Rules
function Step6Timeline({ onNext }) {
    const [agreed1, setAgreed1] = useState(false);
    const [agreed2, setAgreed2] = useState(false);

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-2">Timeline & Rules Confirmation</h2>
            <p className="text-gray-400 mb-6 text-sm">Please review and acknowledge the following</p>
            <div className="space-y-6">
                <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <h3 className="font-semibold text-white">Timeline Expectations</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                        We target completion within 30 trading days, with a maximum window of 60 trading days depending on market conditions.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreed1}
                            onChange={(e) => setAgreed1(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-600"
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
                        Do not trade on your account after submission. Any client trading or interference after you submit your credentials will void all guarantees.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={agreed2}
                            onChange={(e) => setAgreed2(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-600"
                        />
                        <span className="text-sm text-gray-300">I understand I must not trade on the account after submission</span>
                    </label>
                </div>
            </div>
            <button
                onClick={onNext}
                disabled={!agreed1 || !agreed2}
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
                    <div className="flex justify-between items-center text-sm text-gray-300">
                        <span>Subtotal</span>
                        <span>${data.price?.toLocaleString()}</span>
                    </div>
                    {vatAmount > 0 && (
                        <div className="flex justify-between items-center text-sm text-gray-300">
                            <span>VAT ({data.vatPercentage}%)</span>
                            <span>${vatAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                        <span className="text-gray-300 font-semibold">Total Price</span>
                        <span className="text-2xl font-bold text-white">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-colors">
                Proceed to Account Credentials
            </button>
        </div>
    );
}

// Step 8: Account Credentials Form
function Step8Credentials({ data, updateData, onNext }) {
    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h2 className="text-xl font-semibold text-white">Account Credentials</h2>
            <p className="text-gray-400 text-sm">Provide your evaluation login details so our system can pass your challenge</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Login ID</label>
                    <input
                        type="text"
                        value={data.loginId || ""}
                        onChange={(e) => updateData({ loginId: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#1A2040] border border-gray-700 text-white focus:border-blue-500 outline-none"
                        placeholder="Enter your evaluation account login ID"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Master Password</label>
                    <input
                        type="password"
                        value={data.password || ""}
                        onChange={(e) => updateData({ password: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#1A2040] border border-gray-700 text-white focus:border-blue-500 outline-none"
                        placeholder="Enter your evaluation account password"
                    />
                </div>
            </div>
            <button
                onClick={onNext}
                disabled={!data.loginId || !data.password}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue to Platform Details
            </button>
        </div>
    );
}

// Step 9: Server & Platform
function Step9Server({ data, updateData, onNext }) {
    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h2 className="text-xl font-semibold text-white">Server & Platform Specifications</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Server Name</label>
                    <input
                        type="text"
                        value={data.serverName || ""}
                        onChange={(e) => updateData({ serverName: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-[#1A2040] border border-gray-700 text-white focus:border-blue-500 outline-none"
                        placeholder="e.g., FundedNext-Server1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Trading Platform</label>
                    <select
                        value={data.platform || "MT5"}
                        onChange={(e) => updateData({ platform: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#1A2040] border border-gray-700 text-white focus:border-blue-500 outline-none"
                    >
                        <option value="MT5">MetaTrader 5 (MT5)</option>
                        <option value="MT4">MetaTrader 4 (MT4)</option>
                        <option value="cTrader">cTrader</option>
                        <option value="DXtrade">DXtrade</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp Number</label>
                    <input
                        type="text"
                        value={data.whatsapp || ""}
                        onChange={(e) => updateData({ whatsapp: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#1A2040] border border-gray-700 text-white focus:border-blue-500 outline-none"
                        placeholder="+1234567890"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Telegram Username</label>
                    <input
                        type="text"
                        value={data.telegram || ""}
                        onChange={(e) => updateData({ telegram: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#1A2040] border border-gray-700 text-white focus:border-blue-500 outline-none"
                        placeholder="@username"
                    />
                </div>
            </div>
            <button
                onClick={onNext}
                disabled={!data.serverName}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Continue to Terms Agreement
            </button>
        </div>
    );
}

// Step 10: Terms Agreement
function Step10Terms({ data, updateData, onNext }) {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [policyAccepted, setPolicyAccepted] = useState(false);

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800 space-y-6">
            <h2 className="text-xl font-semibold text-white">Terms & Guarantees Agreement</h2>
            <div className="space-y-4">
                <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-300">
                            I understand this is an evaluation passing service, executed according to PropSol standard trading rules.
                        </span>
                    </label>
                </div>
                <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={policyAccepted}
                            onChange={(e) => setPolicyAccepted(e.target.checked)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-300">
                            I accept the terms of the {data.packageType || "Guaranteed Pass"} package and confirm I will not trade on the account during evaluation.
                        </span>
                    </label>
                </div>
            </div>
            <button
                onClick={onNext}
                disabled={!termsAccepted || !policyAccepted}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors"
            >
                Proceed to Crypto Payment
            </button>
        </div>
    );
}

// Step 11: Crypto Payment Wizard Step (Production Exact Copy)
function Step11CryptoPayment({ data, updateData, onSubmit, loading }) {
    const isWhopEligible = data.price <= 2500;
    const [method, setMethod] = useState(isWhopEligible ? "whop" : "invoice");
    const [cryptoCurrency, setCryptoCurrency] = useState(data.cryptoCurrency || "btc");
    const [discountInput, setDiscountInput] = useState("");
    const [applyingDiscount, setApplyingDiscount] = useState(false);
    const [estimatedCrypto, setEstimatedCrypto] = useState(null);
    const [loadingEstimate, setLoadingEstimate] = useState(false);

    const availableCurrencies = ["btc", "usdttrc20", "eth", "ltc", "bnb", "trx", "usdc", "sol"];

    const discountPercentage = data.discountPercentage || 0;
    const discountedPrice = data.price * (1 - discountPercentage / 100);
    const vatAmount = (discountedPrice * (data.vatPercentage || 0)) / 100;
    const finalTotal = discountedPrice + vatAmount;

    useEffect(() => {
        const fetchEstimate = async () => {
            if (method === "whop" || finalTotal <= 0) return;
            setLoadingEstimate(true);
            try {
                const res = await api.get(`/crypto-payments/estimate`, {
                    params: { amount: finalTotal, currency_from: "usd", currency_to: cryptoCurrency }
                });
                setEstimatedCrypto(res.data?.estimated_amount || (finalTotal / 95000).toFixed(6));
            } catch (err) {
                // Fallback estimated formula
                setEstimatedCrypto((finalTotal / 95000).toFixed(6));
            } finally {
                setLoadingEstimate(false);
            }
        };
        fetchEstimate();
    }, [cryptoCurrency, finalTotal, method]);

    const handleApplyDiscount = async () => {
        if (!discountInput.trim()) return;
        setApplyingDiscount(true);
        try {
            const res = await paymentService.checkDiscountUsage(discountInput);
            if (res.exists && !res.used) {
                await paymentService.applyDiscount(discountInput);
                updateData({ discountCode: res.code, discountPercentage: res.percentage });
                toast.success(`Discount of ${res.percentage}% applied!`);
            } else {
                toast.error(res.used ? "Discount code already used" : "Invalid discount code");
            }
        } catch (err) {
            toast.error(err?.response?.data?.detail || "Failed to apply discount code");
        } finally {
            setApplyingDiscount(false);
        }
    };

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800">
            <div className="bg-yellow-900/20 border border-yellow-900/50 rounded-lg p-3 mb-6 flex items-center gap-2">
                <Info className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-yellow-500">
                    Important: MT5 Only • Do Not Trade • Target 30 trading days • Max 60 trading days
                </span>
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">Crypto & Card Payment</h2>
            <p className="text-gray-400 mb-6 text-sm">Pay securely for your prop firm challenge</p>

            {/* Discount Code Input */}
            <div className="bg-[#1A2040] p-6 rounded-xl border border-gray-700 mb-8 space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Discount Code"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value)}
                        className="flex-1 px-4 py-2 bg-[#111836] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        onClick={handleApplyDiscount}
                        disabled={!discountInput.trim() || applyingDiscount}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                    >
                        {applyingDiscount ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Apply"}
                    </button>
                </div>

                <div className="h-px bg-gray-700 my-4" />

                <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>${data.price.toFixed(2)}</span>
                </div>
                {discountPercentage > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-400">
                        <span>Discount ({discountPercentage}%)</span>
                        <span>-${((data.price * discountPercentage) / 100).toFixed(2)}</span>
                    </div>
                )}
                {data.vatPercentage > 0 && (
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>VAT ({data.vatPercentage}%)</span>
                        <span>${vatAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                    <span className="text-gray-300 font-medium">Total</span>
                    <span className="text-2xl font-bold text-white">${finalTotal.toFixed(2)}</span>
                </div>

                {method !== "whop" && estimatedCrypto && (
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                        <span className="text-sm text-gray-400">Estimated {cryptoCurrency.toUpperCase()}</span>
                        <div className="flex items-center gap-2">
                            {loadingEstimate ? (
                                <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                            ) : (
                                <>
                                    <span className="text-lg font-semibold text-blue-400">≈ {estimatedCrypto}</span>
                                    <span className="text-sm text-gray-400">{cryptoCurrency.toUpperCase()}</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Crypto Currency Selection Grid */}
            {method !== "whop" && (
                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-3">Select Cryptocurrency</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableCurrencies.map((curr) => (
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
                        ))}
                    </div>
                </div>
            )}

            {/* Payment Method Selector */}
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
                            <CreditCard className={`w-5 h-5 mr-3 mt-0.5 ${method === "whop" ? "text-blue-400" : "text-gray-400"}`} />
                            <div className="flex-1">
                                <div className={`font-medium mb-1 ${method === "whop" ? "text-white" : "text-gray-300"}`}>
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
                </div>
            </div>

            <button
                onClick={() => onSubmit(method, cryptoCurrency)}
                disabled={loading}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
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
        </div>
    );
}

// Order Completion Screen
function OrderSuccessScreen({ orderId }) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown === 0) {
            router.push("/dashboard");
        }
    }, [countdown, router]);

    useEffect(() => {
        const timer = setInterval(() => setCountdown((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
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
                <p className="text-blue-400 mb-1 font-medium">Redirecting to Dashboard</p>
                <p className="text-xs text-gray-400">
                    Redirecting in <span className="text-white font-bold">{countdown}</span> seconds...
                </p>
            </div>
            <button
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
                Go to Dashboard
            </button>
        </div>
    );
}

// Main 11-Step Checkout Page Component
export default function CheckoutPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [completedOrderId, setCompletedOrderId] = useState("");
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        propFirm: "FundedNext",
        challengeType: "2-Step Challenge",
        scope: "Full Pass",
        accountSize: 50000,
        packageType: "Guaranteed Pass",
        price: 450,
        vatPercentage: 0,
        loginId: "",
        password: "",
        serverName: "FundedNext-Server",
        serverType: "MT5",
        platform: "MT5",
        whatsapp: "",
        telegram: "",
        notes: "",
        cryptoCurrency: "btc",
        discountCode: undefined,
        discountPercentage: 0
    });

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const data = await planService.getAllPlans();
                setPlans(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load plans", err);
            }
        };

        const fetchVat = async () => {
            try {
                const res = await api.get("/discounts/vat");
                if (res.data && res.data.length > 0) {
                    setFormData((prev) => ({ ...prev, vatPercentage: res.data[0].percentage }));
                }
            } catch (err) {
                console.error("VAT fetch failed", err);
            }
        };

        fetchPlans();
        fetchVat();
    }, []);

    const updateData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 11));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    const handleSubmitPayment = async (method, cryptoCurrency) => {
        setLoading(true);
        if (!localStorage.getItem("access_token")) {
            toast.error("Please login to complete your order");
            router.push("/signin?returnUrl=/checkout");
            setLoading(false);
            return;
        }

        try {
            await userService.getCurrentUser();
        } catch (err) {
            toast.error("Session expired. Please sign in again.");
            router.push("/signin?returnUrl=/checkout");
            setLoading(false);
            return;
        }

        try {
            const discountedPrice = formData.price * (1 - (formData.discountPercentage || 0) / 100);
            const totalWithVat = discountedPrice + (discountedPrice * (formData.vatPercentage || 0)) / 100;

            const reg = await propFirmService.createRegistration({
                login_id: formData.loginId || "123456",
                password: formData.password || "defaultPass123",
                propfirm_name: formData.propFirm,
                propfirm_website_link: "https://example.com",
                server_name: formData.serverName,
                server_type: formData.serverType,
                challenges_step: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                service_scope: formData.scope === "Step 1 Only" ? 1 : 2,
                propfirm_account_cost: totalWithVat,
                account_size: formData.accountSize,
                account_phases: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                trading_platform: formData.platform,
                propfirm_rules: formData.notes || "No specific rules provided",
                whatsapp_no: formData.whatsapp,
                telegram_username: formData.telegram
            });

            const orderId = reg.id || reg.order_id;
            setCompletedOrderId(orderId);

            const origin = window.location.origin;
            const successUrl = `${origin}/payment/success?order_id=${orderId}`;
            const cancelUrl = `${origin}/checkout`;

            if (method === "whop") {
                const whopRes = await propFirmService.createWhopCheckoutLink(orderId);
                if (whopRes?.checkout_url) {
                    window.location.href = whopRes.checkout_url;
                    return;
                }
            }

            if (method === "invoice") {
                const invoiceRes = await paymentService.createInvoice({
                    price_amount: totalWithVat,
                    price_currency: "usd",
                    pay_currency: cryptoCurrency || formData.cryptoCurrency || "btc",
                    order_id: orderId,
                    order_description: `PropSol - ${formData.propFirm} ${formData.challengeType} - $${formData.accountSize}k`,
                    success_url: successUrl,
                    cancel_url: cancelUrl
                });

                if (invoiceRes?.invoice_url) {
                    window.location.href = invoiceRes.invoice_url;
                    return;
                }
            }

            toast.success("Order created successfully!");
            setStep(12);
        } catch (error) {
            console.error("Payment Submission Error:", error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to process order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0F29] text-white flex flex-col items-center py-10 px-4">
            {step < 12 && (
                <div className="w-full max-w-4xl mb-8">
                    <div className="flex justify-between items-center mb-4">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all font-medium text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all font-medium text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Dashboard</span>
                            </button>
                        )}
                        <div className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full">
                            Step {step} of 11
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-4">PropSol Checkout</h1>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${(step / 11) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="w-full max-w-4xl">
                {step === 1 && <Step1PropFirm data={formData} updateData={updateData} onNext={handleNext} />}
                {step === 2 && <Step2Challenge data={formData} updateData={updateData} onNext={handleNext} />}
                {step === 3 && <Step3Scope data={formData} updateData={updateData} onNext={handleNext} />}
                {step === 4 && <Step4AccountSize data={formData} updateData={updateData} onNext={handleNext} />}
                {step === 5 && <Step5Package data={formData} updateData={updateData} onNext={handleNext} plans={plans} />}
                {step === 6 && <Step6Timeline onNext={handleNext} />}
                {step === 7 && <Step7Summary data={formData} onNext={handleNext} />}
                {step === 8 && <Step8Credentials data={formData} updateData={updateData} onNext={handleNext} />}
                {step === 9 && <Step9Server data={formData} updateData={updateData} onNext={handleNext} />}
                {step === 10 && <Step10Terms data={formData} updateData={updateData} onNext={handleNext} />}
                {step === 11 && (
                    <Step11CryptoPayment
                        data={formData}
                        updateData={updateData}
                        onSubmit={handleSubmitPayment}
                        loading={loading}
                    />
                )}
                {step === 12 && <OrderSuccessScreen orderId={completedOrderId} />}
            </div>
        </div>
    );
}
