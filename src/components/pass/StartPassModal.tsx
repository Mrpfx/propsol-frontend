// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    X,
    Building2,
    CheckCircle2,
    ShieldCheck,
    Info,
    RefreshCw,
    Wallet,
    CreditCard,
    Copy,
    Check,
    Lock,
    Trophy,
    Sparkles,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { planService } from "@/services/plan.service";
import { userService } from "@/services/user.service";
import { propFirmService } from "@/services/prop-firm.service";

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

const PROP_FIRMS = [
    { id: "FundedNext", name: "FundedNext", badgeColor: "text-purple-400" },
    { id: "FundingPips", name: "FundingPips", badgeColor: "text-blue-400" },
    { id: "FTMO", name: "FTMO", badgeColor: "text-blue-500" },
    { id: "TenTrade", name: "TenTrade", badgeColor: "text-amber-500" }
];

const ACCOUNT_SIZES = [50000, 90000, 100000, 200000, 500000];

const INITIAL_CHECKOUT_DATA = {
    model: "pass",
    propFirm: "",
    challengeType: "",
    scope: "",
    accountSize: 0,
    packageType: "",
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
    paymentMethod: "whop", // whop or direct
    agreedToTerms: false,
    agreedToRefundPolicy: false,
    agreedTimeline: false,
    agreedNoTrading: false,
    vatPercentage: 0,
    discountCode: "",
    discountPercentage: 0
};

function DirectPaymentView({ payment, onComplete }) {
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = (seconds % 60).toString().padStart(2, "0");
        return `${mins}:${secs}`;
    };

    return (
        <div className="bg-[#111836] p-5 sm:p-8 rounded-2xl border border-gray-800 max-w-2xl mx-auto space-y-6 text-white">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-900/20 border border-yellow-900/50 mb-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium text-yellow-400">Waiting for Crypto Payment</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Complete Your Payment</h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                    Send exactly{" "}
                    <span className="text-white font-semibold">
                        {payment.pay_amount} {payment.pay_currency?.toUpperCase()}
                    </span>{" "}
                    to the wallet address below
                </p>
            </div>

            {timeLeft > 0 && (
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-3 sm:p-4 text-center">
                    <p className="text-xs text-blue-300 mb-1">Time remaining to send payment</p>
                    <p className="text-xl sm:text-2xl font-mono font-bold text-blue-400">{formatTime(timeLeft)}</p>
                </div>
            )}

            {qrUrl && (
                <div className="bg-white p-4 sm:p-6 rounded-xl flex justify-center shadow-lg">
                    <img src={qrUrl} alt="Payment QR Code" className="w-48 h-48 sm:w-56 sm:h-56" />
                </div>
            )}

            <div className="space-y-4">
                <div className="bg-[#1A2040] p-3.5 sm:p-4 rounded-xl border border-gray-700">
                    <label className="block text-xs text-gray-400 mb-1">Amount to Send</label>
                    <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-mono font-semibold text-white">
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

                <div className="bg-[#1A2040] p-3.5 sm:p-4 rounded-xl border border-gray-700">
                    <label className="block text-xs text-gray-400 mb-1">Deposit Address ({payment.pay_currency?.toUpperCase()})</label>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-mono text-white break-all">{payment.pay_address}</span>
                        <button
                            onClick={() => copyToClipboard(payment.pay_address || "")}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                        >
                            <Copy className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                    onClick={checkStatus}
                    disabled={checking}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                    <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                    {checking ? "Checking Status..." : "Check Payment Status"}
                </button>
                <button
                    onClick={onComplete}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-xs sm:text-sm"
                >
                    I Have Sent Payment
                </button>
            </div>
        </div>
    );
}

interface StartPassModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialPlan?: {
        model?: string;
        accountType?: string;
        scope?: string;
        propFirm?: string;
        accountSize?: number;
    };
}

export default function StartPassModal({ isOpen, onClose, initialPlan }: StartPassModalProps) {
    const router = useRouter();
    const [formData, setFormData] = useState(INITIAL_CHECKOUT_DATA);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createdPayment, setCreatedPayment] = useState(null);
    const [isCustomFirm, setIsCustomFirm] = useState(false);
    const [customFirmInput, setCustomFirmInput] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleRedirectToAuth = (path: string) => {
        onClose();
        if (typeof window !== 'undefined') {
            try {
                sessionStorage.setItem("pending_pass_modal_data", JSON.stringify(formData));
            } catch (e) {
                console.error("Failed to save pass modal state", e);
            }
            const returnUrl = `${window.location.pathname}?openPassModal=true`;
            router.push(`${path}?returnUrl=${encodeURIComponent(returnUrl)}`);
        }
    };

    // Initialize or reset state & check auth when modal opens
    useEffect(() => {
        if (isOpen) {
            const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;
            setIsLoggedIn(Boolean(token));

            // Check if there is a saved pending modal state from before authentication
            let savedStateData: any = null;
            if (typeof window !== 'undefined') {
                const rawSaved = sessionStorage.getItem("pending_pass_modal_data");
                if (rawSaved) {
                    try {
                        savedStateData = JSON.parse(rawSaved);
                        sessionStorage.removeItem("pending_pass_modal_data");
                    } catch (e) {
                        console.error("Failed to parse saved pass modal state:", e);
                    }
                }
            }

            if (savedStateData && (savedStateData.propFirm || savedStateData.accountSize)) {
                setFormData((prev) => ({ ...prev, ...savedStateData }));
            } else {
                let initialChallengeType = "";
                let initialScope = "";

                if (initialPlan?.accountType) {
                    if (initialPlan.accountType.includes("1-step") || initialPlan.accountType.includes("1step")) {
                        initialChallengeType = "1-Step Challenge";
                    } else if (initialPlan.accountType.includes("2-step") || initialPlan.accountType.includes("2step")) {
                        initialChallengeType = "2-Step Challenge";
                    }
                }

                if (initialPlan?.scope) {
                    if (initialPlan.scope === "step-1" || initialPlan.scope === "Step 1 Only") {
                        initialScope = "Step 1 Only";
                    } else if (initialPlan.scope === "full" || initialPlan.scope === "Full Pass") {
                        initialScope = "Full Pass";
                    }
                }

                setFormData({
                    ...INITIAL_CHECKOUT_DATA,
                    propFirm: initialPlan?.propFirm || "",
                    challengeType: initialChallengeType,
                    scope: initialScope,
                    accountSize: initialPlan?.accountSize || 0
                });
            }
            setCreatedPayment(null);
            setIsCustomFirm(false);
            setCustomFirmInput("");
        }
    }, [isOpen, initialPlan]);

    // Fetch pricing plans and VAT
    useEffect(() => {
        if (!isOpen) return;

        const fetchPlans = async () => {
            try {
                const fetchedPlans = await planService.getAllPlans();
                if (fetchedPlans && fetchedPlans.length > 0) {
                    setPlans(fetchedPlans);
                }
            } catch (err) {
                console.error("Failed to fetch plans", err);
            }
        };

        const fetchVat = async () => {
            try {
                const res = await api.get("/discounts/vat");
                if (res.data && res.data.length > 0) {
                    setFormData((prev) => ({ ...prev, vatPercentage: res.data[0].percentage }));
                }
            } catch (err) {
                console.error("Failed to fetch VAT", err);
            }
        };

        fetchVat();
        fetchPlans();
    }, [isOpen]);

    // Progressive selection completion flags
    const isStep1Done = Boolean(formData.propFirm);
    const isStep2Done = Boolean(formData.challengeType) && (formData.challengeType !== "2-Step Challenge" || Boolean(formData.scope));
    const isStep3Done = formData.accountSize > 0;
    const isStep4Done = Boolean(formData.packageType);
    const isStep5Done = formData.agreedTimeline && formData.agreedNoTrading;
    const isStep6Done = Boolean(formData.loginId && formData.password && formData.serverName);

    const computedPrices = useMemo(() => {
        if (!formData.challengeType || formData.accountSize === 0) {
            return { standard: 0, guaranteed: 0 };
        }

        const challengeTypeSlug = formData.challengeType === "1-Step Challenge" ? "1-step" : "2-step";
        let scopeSlug = "full";
        if (formData.challengeType === "2-Step Challenge") {
            scopeSlug = formData.scope === "Step 1 Only" ? "step-1" : "full";
        }
        const stdSlug = `standard-${challengeTypeSlug}-${scopeSlug}`;
        const grtSlug = `guaranteed-${challengeTypeSlug}-${scopeSlug}`;

        const stdPlan = plans.find((p) => p.slug === stdSlug);
        const grtPlan = plans.find((p) => p.slug === grtSlug);

        const getPriceForSize = (plan: any, size: number) => {
            if (!plan || !plan.prices) return 0;
            const match = plan.prices.find((p: any) => p.account_size === size);
            return match ? match.price : 0;
        };

        const defaultStdPrices = { 50000: 490, 90000: 590, 100000: 690, 200000: 990, 500000: 1390 };
        const defaultGrtPrices = { 50000: 800, 90000: 950, 100000: 1200, 200000: 1700, 500000: 2500 };

        const stdPrice = getPriceForSize(stdPlan, formData.accountSize) || defaultStdPrices[formData.accountSize] || 0;
        const grtPrice = getPriceForSize(grtPlan, formData.accountSize) || defaultGrtPrices[formData.accountSize] || 0;

        return {
            standard: stdPrice,
            guaranteed: grtPrice
        };
    }, [formData.challengeType, formData.scope, formData.accountSize, plans]);

    useEffect(() => {
        if (formData.accountSize > 0 && formData.packageType) {
            const targetPrice = formData.packageType === "Standard Pass" ? computedPrices.standard : computedPrices.guaranteed;
            if (targetPrice > 0 && formData.price !== targetPrice) {
                setFormData((prev) => ({ ...prev, price: targetPrice }));
            }
        }
    }, [formData.packageType, formData.accountSize, computedPrices]);

    const updateData = (fields: Partial<typeof INITIAL_CHECKOUT_DATA>) => {
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    const handleSubmitOrder = async () => {
        if (!formData.propFirm) {
            toast.error("Please select a Prop Firm");
            return;
        }
        if (!formData.challengeType || (formData.challengeType === "2-Step Challenge" && !formData.scope)) {
            toast.error("Please select Challenge Type & Scope");
            return;
        }
        if (!formData.accountSize) {
            toast.error("Please select an Account Size");
            return;
        }
        if (!formData.packageType) {
            toast.error("Please select a Package Level");
            return;
        }
        if (!formData.agreedTimeline || !formData.agreedNoTrading) {
            toast.error("Please confirm the timeline and rules agreement");
            return;
        }
        if (!formData.loginId || !formData.password || !formData.serverName) {
            toast.error("Please enter your account login, password, and server name");
            return;
        }
        if (!formData.agreedToTerms || !formData.agreedToRefundPolicy) {
            toast.error("Please agree to the Terms of Service and Refund Policy");
            return;
        }

        const isLoggedIn = typeof window !== 'undefined' && Boolean(localStorage.getItem("access_token"));
        if (!isLoggedIn) {
            toast.error("Please login to complete your order");
            handleRedirectToAuth('/signin');
            return;
        }

        setLoading(true);

        const discountedPrice = formData.price * (1 - (formData.discountPercentage || 0) / 100);
        const finalCost = discountedPrice + (discountedPrice * (formData.vatPercentage || 0)) / 100;

        try {
            await userService.getCurrentUser();

            const formattedRules = `[Pass Package: ${formData.packageType}] ${formData.notes || "Evaluation Pass setup"}`;
            const regResult = await propFirmService.createRegistration({
                login_id: formData.loginId,
                password: formData.password,
                propfirm_name: formData.propFirm,
                propfirm_website_link: "https://example.com",
                server_name: formData.serverName || "Live Server",
                server_type: formData.serverType || "MT5",
                challenges_step: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                service_scope: formData.scope === "Step 1 Only" ? 1 : 2,
                propfirm_account_cost: finalCost,
                account_size: formData.accountSize,
                account_phases: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                trading_platform: formData.platform || "Metatrader 5",
                propfirm_rules: formattedRules,
                whatsapp_no: formData.whatsapp || "",
                telegram_username: formData.telegram || "",
                pass_type: formData.packageType === "Guaranteed Pass" ? "guaranteed_pass" : "standard_pass"
            });

            const regOrderId = regResult?.order_id || regResult?.id;

            if (!regResult || !regOrderId) {
                throw new Error("Registration failed to return an order ID.");
            }

            if (formData.paymentMethod === "whop") {
                const whopRes = await propFirmService.createWhopCheckoutLink(regOrderId);
                if (whopRes.checkout_url) {
                    toast.success("Redirecting to Whop checkout...");
                    onClose();
                    window.location.href = whopRes.checkout_url;
                } else {
                    throw new Error("Failed to get Whop checkout URL");
                }
            } else if (formData.paymentMethod === "direct") {
                const paymentRes = await cryptoService.createPayment({
                    price_amount: finalCost,
                    price_currency: "usd",
                    pay_currency: formData.cryptoCurrency,
                    order_id: `PASS-${regOrderId}`,
                    order_description: `PropSol Pass ${formData.packageType} - $${formData.accountSize.toLocaleString()}`
                });
                setCreatedPayment(paymentRes);
                toast.success("Crypto payment generated!");
            }
        } catch (err: any) {
            console.error("Order submission failed:", err);
            toast.error(err.response?.data?.detail || "Failed to process order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-[#090e23] border border-slate-800/80 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-white">
                
                {/* Modal Header */}
                <div className="sticky top-0 z-20 bg-[#090e23]/95 backdrop-blur-md px-3 py-2.5 sm:px-6 sm:py-4 border-b border-slate-800/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xs sm:text-lg font-bold text-white tracking-tight truncate">PropSol Pass Evaluation Checkout</h2>
                            <p className="text-[9px] sm:text-xs text-slate-400 truncate">Step-by-step selection for your evaluation account.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-3 sm:p-6 overflow-y-auto custom-scrollbar space-y-3.5 sm:space-y-6">
                    {!isLoggedIn ? (
                        <div className="py-6 px-3 sm:py-10 sm:px-6 text-center space-y-5 flex flex-col items-center justify-center my-auto animate-fadeIn">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-xl">
                                <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
                            </div>

                            <div className="space-y-1.5 max-w-md">
                                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                                    Sign In Required to Continue
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    Please sign in or create an account to start your Prop Pass Evaluation checkout. Your evaluation progress will be safely linked to your dashboard profile.
                                </p>
                            </div>

                            <div className="bg-[#111836] border border-slate-800/80 rounded-xl p-3.5 text-left space-y-2.5 max-w-md w-full text-xs text-slate-300 shadow-inner">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>Link evaluation accounts directly to your dashboard</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>Real-time pass progress tracking & notifications</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                    <span>Pass guarantee protection tied to your profile</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleRedirectToAuth('/signin')}
                                    className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group cursor-pointer"
                                >
                                    <span>Sign In to Continue</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRedirectToAuth('/signup')}
                                    className="py-3 px-4 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs sm:text-sm transition-colors border border-slate-700 cursor-pointer"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    ) : createdPayment ? (
                        <DirectPaymentView payment={createdPayment} onComplete={() => { onClose(); router.push("/dashboard"); }} />
                    ) : (
                        <div className="space-y-3.5 sm:space-y-6">

                            {/* STEP 1: SELECT PROP FIRM (Always Displayed) */}
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center justify-between gap-1 flex-nowrap">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">1</span>
                                        <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">SELECT PROP FIRM</span>
                                    </div>
                                    {isStep1Done ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {formData.propFirm}
                                        </span>
                                    ) : (
                                        <span className="text-[9px] sm:text-[11px] text-amber-400 font-medium animate-pulse whitespace-nowrap truncate shrink-0">
                                            Select prop firm to continue
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
                                    {PROP_FIRMS.map((firm) => {
                                        const isSelected = !isCustomFirm && formData.propFirm === firm.name;
                                        return (
                                            <button
                                                key={firm.id}
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomFirm(false);
                                                    updateData({ propFirm: firm.name });
                                                }}
                                                className={`p-1.5 sm:p-3.5 rounded-xl border transition-all duration-300 text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                                    isSelected
                                                        ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10"
                                                        : "bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60"
                                                }`}
                                            >
                                                <Building2 className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${firm.badgeColor}`} />
                                                <span className="font-bold text-[10px] sm:text-xs text-white truncate w-full text-center">{firm.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Custom Firm Input Toggle */}
                                <div className="pt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomFirm(!isCustomFirm)}
                                        className="text-[10px] sm:text-xs text-blue-400 hover:underline font-semibold whitespace-nowrap"
                                    >
                                        {isCustomFirm ? "← Select from popular firms" : "+ Specify another prop firm"}
                                    </button>
                                    {isCustomFirm && (
                                        <div className="mt-1.5 flex gap-1.5">
                                            <input
                                                type="text"
                                                placeholder="Enter prop firm name..."
                                                value={customFirmInput}
                                                onChange={(e) => setCustomFirmInput(e.target.value)}
                                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (customFirmInput.trim()) {
                                                        updateData({ propFirm: customFirmInput.trim() });
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer shrink-0"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* STEP 2: CHALLENGE TYPE & SCOPE (Displayed ONLY after Step 1 is selected) */}
                            {isStep1Done && (
                                <div className="space-y-2 sm:space-y-3 animate-slideDown border-t border-slate-800/60 pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between gap-1 flex-nowrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">2</span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">CHALLENGE TYPE & SCOPE</span>
                                        </div>
                                        {isStep2Done ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {formData.challengeType}{formData.scope ? ` (${formData.scope})` : ""}
                                            </span>
                                        ) : (
                                            <span className="text-[9px] sm:text-[11px] text-amber-400 font-medium animate-pulse whitespace-nowrap truncate shrink-0">
                                                Select challenge type to continue
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                                        <button
                                            type="button"
                                            onClick={() => updateData({ challengeType: "1-Step Challenge", scope: "Full Pass" })}
                                            className={`p-2 sm:p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                                                formData.challengeType === "1-Step Challenge"
                                                    ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10"
                                                    : "bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60"
                                            }`}
                                        >
                                            <div className="font-bold text-[11px] sm:text-sm text-white mb-0.5 whitespace-nowrap">1-Step Challenge</div>
                                            <div className="text-[9px] sm:text-xs text-slate-400 leading-tight line-clamp-2">Single phase evaluation model directly to funded status.</div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => updateData({ challengeType: "2-Step Challenge" })}
                                            className={`p-2 sm:p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                                                formData.challengeType === "2-Step Challenge"
                                                    ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10"
                                                    : "bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60"
                                            }`}
                                        >
                                            <div className="font-bold text-[11px] sm:text-sm text-white mb-0.5 whitespace-nowrap">2-Step Challenge</div>
                                            <div className="text-[9px] sm:text-xs text-slate-400 leading-tight line-clamp-2">Two phase evaluation model (Phase 1 & Phase 2).</div>
                                        </button>
                                    </div>

                                    {formData.challengeType === "2-Step Challenge" && (
                                        <div className="pt-1.5 space-y-1.5 border-t border-slate-800/40">
                                            <label className="text-[10px] sm:text-xs font-semibold text-slate-300">Select 2-Step Scope:</label>
                                            <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => updateData({ scope: "Step 1 Only" })}
                                                    className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all text-[10px] sm:text-xs whitespace-nowrap cursor-pointer ${
                                                        formData.scope === "Step 1 Only"
                                                            ? "bg-blue-600/20 border-blue-500 font-bold text-white"
                                                            : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                                                    }`}
                                                >
                                                    Step 1 Only
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => updateData({ scope: "Full Pass" })}
                                                    className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all text-[10px] sm:text-xs whitespace-nowrap cursor-pointer ${
                                                        formData.scope === "Full Pass"
                                                            ? "bg-blue-600/20 border-blue-500 font-bold text-white"
                                                            : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                                                    }`}
                                                >
                                                    Full Pass (Phase 1 & 2)
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: ACCOUNT SIZE (Displayed ONLY after Step 1 & 2 are selected) */}
                            {isStep1Done && isStep2Done && (
                                <div className="space-y-2 sm:space-y-3 animate-slideDown border-t border-slate-800/60 pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between gap-1 flex-nowrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">3</span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">SELECT ACCOUNT SIZE</span>
                                        </div>
                                        {isStep3Done ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> ${formData.accountSize.toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-[9px] sm:text-[11px] text-amber-400 font-medium animate-pulse whitespace-nowrap truncate shrink-0">
                                                Select account size to continue
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-5 gap-1 sm:gap-2">
                                        {ACCOUNT_SIZES.map((size) => (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => updateData({ accountSize: size })}
                                                className={`px-1 py-2 sm:p-3 rounded-lg sm:rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                                                    formData.accountSize === size
                                                        ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10 font-bold"
                                                        : "bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60"
                                                }`}
                                            >
                                                <div className="font-bold text-[10px] sm:text-sm text-white whitespace-nowrap">${size.toLocaleString()}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: PACKAGE LEVEL & PRICE (Displayed ONLY after Step 1, 2 & 3 are selected) */}
                            {isStep1Done && isStep2Done && isStep3Done && (
                                <div className="space-y-2 sm:space-y-3 animate-slideDown border-t border-slate-800/60 pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between gap-1 flex-nowrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">4</span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">PACKAGE LEVEL & PRICE</span>
                                        </div>
                                        {isStep4Done ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {formData.packageType} (${formData.price})
                                            </span>
                                        ) : (
                                            <span className="text-[9px] sm:text-[11px] text-amber-400 font-medium animate-pulse whitespace-nowrap truncate shrink-0">
                                                Select package level to continue
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                                        {/* Standard Pass */}
                                        <button
                                            type="button"
                                            onClick={() => updateData({ packageType: "Standard Pass", price: computedPrices.standard })}
                                            className={`p-2 sm:p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                                                formData.packageType === "Standard Pass"
                                                    ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10"
                                                    : "bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60"
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-bold text-[11px] sm:text-sm text-white whitespace-nowrap">Standard Pass</span>
                                                <span className="font-extrabold text-blue-400 text-xs sm:text-base">${computedPrices.standard}</span>
                                            </div>
                                            <p className="text-[9px] sm:text-xs text-slate-400 leading-tight line-clamp-2">Professional evaluation handling with standard pass guarantee.</p>
                                        </button>

                                        {/* Guaranteed Pass */}
                                        <button
                                            type="button"
                                            onClick={() => updateData({ packageType: "Guaranteed Pass", price: computedPrices.guaranteed })}
                                            className={`p-2 sm:p-4 rounded-xl border text-left transition-all duration-300 relative cursor-pointer ${
                                                formData.packageType === "Guaranteed Pass"
                                                    ? "bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/10"
                                                    : "bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60"
                                            }`}
                                        >
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-bold text-[11px] sm:text-sm text-white flex items-center gap-1">
                                                    Guaranteed
                                                    <span className="text-[8px] sm:text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">+$100</span>
                                                </span>
                                                <span className="font-extrabold text-blue-400 text-xs sm:text-base">${computedPrices.guaranteed}</span>
                                            </div>
                                            <p className="text-[9px] sm:text-xs text-slate-400 leading-tight line-clamp-2">Full refund + $100 compensation if evaluation is not passed.</p>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 5: COMPLIANCE & RULES (Displayed ONLY after Step 1, 2, 3 & 4 are selected) */}
                            {isStep1Done && isStep2Done && isStep3Done && isStep4Done && (
                                <div className="space-y-2 sm:space-y-3 animate-slideDown border-t border-slate-800/60 pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between gap-1 flex-nowrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">5</span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">COMPLIANCE & RULES AGREEMENT</span>
                                        </div>
                                        {isStep5Done ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Rules Confirmed
                                            </span>
                                        ) : (
                                            <span className="text-[9px] sm:text-[11px] text-amber-400 font-medium animate-pulse whitespace-nowrap truncate shrink-0">
                                                Confirm rules to continue
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="flex items-start gap-2 cursor-pointer p-2 sm:p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreedTimeline}
                                                onChange={(e) => updateData({ agreedTimeline: e.target.checked })}
                                                className="mt-0.5 w-3.5 h-3.5 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-blue-500 shrink-0"
                                            />
                                            <span className="text-[10px] sm:text-xs text-slate-300 leading-tight">
                                                I understand the evaluation completion timeline (typically 3 - 7 business days).
                                            </span>
                                        </label>

                                        <label className="flex items-start gap-2 cursor-pointer p-2 sm:p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreedNoTrading}
                                                onChange={(e) => updateData({ agreedNoTrading: e.target.checked })}
                                                className="mt-0.5 w-3.5 h-3.5 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-blue-500 shrink-0"
                                            />
                                            <span className="text-[10px] sm:text-xs text-slate-300 leading-tight">
                                                I agree NOT to log into or place any trades on the account while evaluation is in progress.
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* STEP 6: ACCOUNT LOGIN CREDENTIALS (Displayed ONLY after Step 1..5 are selected) */}
                            {isStep1Done && isStep2Done && isStep3Done && isStep4Done && isStep5Done && (
                                <div className="space-y-2 sm:space-y-3 animate-slideDown border-t border-slate-800/60 pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between gap-1 flex-nowrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">6</span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">ACCOUNT LOGIN CREDENTIALS</span>
                                        </div>
                                        {isStep6Done ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> ID: {formData.loginId}
                                            </span>
                                        ) : (
                                            <span className="text-[9px] sm:text-[11px] text-amber-400 font-medium animate-pulse whitespace-nowrap truncate shrink-0">
                                                Enter credentials to continue
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 mb-0.5 truncate">Account ID / Login *</label>
                                            <input
                                                type="text"
                                                value={formData.loginId}
                                                onChange={(e) => updateData({ loginId: e.target.value })}
                                                placeholder="e.g. 1029384"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-2.5 py-1.5 text-[11px] sm:text-xs text-white outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 mb-0.5 truncate">Trader Password *</label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => updateData({ password: e.target.value })}
                                                placeholder="************"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-2.5 py-1.5 text-[11px] sm:text-xs text-white outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 mb-0.5 truncate">Server Name *</label>
                                            <input
                                                type="text"
                                                value={formData.serverName}
                                                onChange={(e) => updateData({ serverName: e.target.value })}
                                                placeholder="e.g. FTMO-Server2"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-2.5 py-1.5 text-[11px] sm:text-xs text-white outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] sm:text-xs font-semibold text-slate-300 mb-0.5 truncate">Platform</label>
                                            <select
                                                value={formData.platform}
                                                onChange={(e) => updateData({ platform: e.target.value })}
                                                className="w-full bg-slate-950 border border-slate-800 rounded-lg sm:rounded-xl px-2.5 py-1.5 text-[11px] sm:text-xs text-white outline-none focus:border-blue-500"
                                            >
                                                <option value="Metatrader 5">MetaTrader 5 (MT5)</option>
                                                <option value="Metatrader 4">MetaTrader 4 (MT4)</option>
                                                <option value="cTrader">cTrader</option>
                                                <option value="DXtrade">DXtrade</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 7: ORDER SUMMARY & PAYMENT (Displayed ONLY after Step 1..6 are selected) */}
                            {isStep1Done && isStep2Done && isStep3Done && isStep4Done && isStep5Done && isStep6Done && (
                                <div className="space-y-2.5 animate-slideDown border-t border-slate-800/60 pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between gap-1 flex-nowrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">7</span>
                                            <span className="text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase whitespace-nowrap">ORDER SUMMARY & PAYMENT</span>
                                        </div>
                                    </div>

                                    {/* Order Summary Box */}
                                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-[10px] sm:text-xs">
                                        <div className="flex justify-between text-slate-400">
                                            <span>Prop Firm:</span>
                                            <span className="font-bold text-white truncate max-w-[120px]">{formData.propFirm}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Challenge & Scope:</span>
                                            <span className="font-bold text-white truncate max-w-[140px]">{formData.challengeType} ({formData.scope})</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Account Size:</span>
                                            <span className="font-bold text-white">${formData.accountSize.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Package Level:</span>
                                            <span className="font-bold text-white">{formData.packageType}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1.5 font-bold text-xs sm:text-sm">
                                            <span className="text-white">Total Amount:</span>
                                            <span className="text-blue-400">${formData.price} USD</span>
                                        </div>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div className="space-y-1 pt-0.5">
                                        <label className="text-[10px] sm:text-xs font-semibold text-slate-300">Select Payment Method:</label>
                                        <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                                            <button
                                                type="button"
                                                onClick={() => updateData({ paymentMethod: "whop" })}
                                                className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                                    formData.paymentMethod === "whop"
                                                        ? "bg-blue-600/20 border-blue-500 font-bold text-white"
                                                        : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                                                }`}
                                            >
                                                <span className="text-[10px] sm:text-xs truncate">Whop Pay (Card/Apple)</span>
                                                <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => updateData({ paymentMethod: "direct" })}
                                                className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                                                    formData.paymentMethod === "direct"
                                                        ? "bg-blue-600/20 border-blue-500 font-bold text-white"
                                                        : "bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                                                }`}
                                            >
                                                <span className="text-[10px] sm:text-xs truncate">Crypto Pay (BTC/USDT)</span>
                                                <Wallet className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Terms Agreement */}
                                    <div className="space-y-1 pt-0.5">
                                        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] sm:text-xs text-slate-400">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreedToTerms}
                                                onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
                                                className="w-3 h-3 rounded text-blue-600 bg-slate-950 border-slate-800 shrink-0"
                                            />
                                            <span className="truncate">I agree to the Terms of Service</span>
                                        </label>
                                        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] sm:text-xs text-slate-400">
                                            <input
                                                type="checkbox"
                                                checked={formData.agreedToRefundPolicy}
                                                onChange={(e) => updateData({ agreedToRefundPolicy: e.target.checked })}
                                                className="w-3 h-3 rounded text-blue-600 bg-slate-950 border-slate-800 shrink-0"
                                            />
                                            <span className="truncate">I agree to the Refund Policy</span>
                                        </label>
                                    </div>

                                    {/* Submit Order Button */}
                                    <button
                                        type="button"
                                        disabled={loading || !formData.agreedToTerms || !formData.agreedToRefundPolicy}
                                        onClick={handleSubmitOrder}
                                        className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                                <span>Processing Order...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-3.5 h-3.5" />
                                                <span>Complete Order (${formData.price} USD)</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
