// @ts-nocheck
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    Copy,
    Check,
    Lock,
    ChevronDown,
    ChevronUp,
    Star,
    Sparkles
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { planService, Plan } from "@/services/plan.service";
import { propFirmService } from "@/services/prop-firm.service";
import { userService } from "@/services/user.service";

// Crypto Payment Service helper logic matching backend
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
    challengeType: "2-Step Challenge",
    scope: "Full Pass",
    accountSize: 0,
    packageType: "Guaranteed Pass",
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
    paymentMethod: "whop", // whop, invoice, direct
    agreedToTerms: false,
    agreedToRefundPolicy: false,
    agreedTimeline: false,
    agreedNoTrading: false,
    vatPercentage: 0,
    discountCode: "",
    discountPercentage: 0
};

// Direct Crypto Payment Instructions & QR Code Step Component
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

    return (
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800 max-w-2xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/20 border border-yellow-900/50 mb-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-yellow-400">Waiting for Crypto Payment</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Complete Your Payment</h2>
                <p className="text-gray-400 text-sm">
                    Send exactly{" "}
                    <span className="text-white font-semibold">
                        {payment.pay_amount} {payment.pay_currency?.toUpperCase()}
                    </span>{" "}
                    to the wallet address below
                </p>
            </div>

            {timeLeft > 0 && (
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 text-center">
                    <p className="text-xs text-blue-300 mb-1">Time remaining to send payment</p>
                    <p className="text-2xl font-mono font-bold text-blue-400">{formatTime(timeLeft)}</p>
                </div>
            )}

            {qrUrl && (
                <div className="bg-white p-6 rounded-xl flex justify-center shadow-lg">
                    <img src={qrUrl} alt="Payment QR Code" className="w-56 h-56" />
                </div>
            )}

            <div className="space-y-4">
                <div className="bg-[#1A2040] p-4 rounded-xl border border-gray-700">
                    <label className="block text-xs text-gray-400 mb-1">Amount to Send</label>
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
                    <label className="block text-xs text-gray-400 mb-1">Payment Address</label>
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-mono text-white break-all">{payment.pay_address}</span>
                        <button
                            onClick={() => copyToClipboard(payment.pay_address || "")}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={checkStatus}
                disabled={checking}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
                <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
                {checking ? "Checking..." : "I Have Sent Payment / Check Status"}
            </button>
        </div>
    );
}

// Order Placed Success Screen
function OrderSuccessView({ orderId }) {
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
        <div className="bg-[#111836] p-8 rounded-2xl border border-gray-800 text-center py-16 max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">Order Placed Successfully!</h2>
            <p className="text-gray-300 text-sm">Thank you for your purchase. Your evaluation registration has been recorded.</p>
            <p className="text-xs text-gray-400">
                Order ID: <span className="font-mono text-white font-bold">{orderId}</span>
            </p>
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 max-w-md mx-auto">
                <p className="text-blue-400 text-sm font-medium mb-1">What happens next?</p>
                <p className="text-xs text-gray-300">
                    Our team will verify your details and begin managing your evaluation challenge.
                </p>
            </div>
            <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState(INITIAL_CHECKOUT_DATA);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [directPaymentDetails, setDirectPaymentDetails] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    // Collapsible accordion steps state
    const [activeStep, setActiveStep] = useState<number>(1);

    // Parse URL params for pre-filling selections
    useEffect(() => {
        const modelParam = searchParams.get("model");
        const propFirmParam = searchParams.get("propFirm");
        const accountTypeParam = searchParams.get("accountType") || searchParams.get("challengeType");
        const scopeParam = searchParams.get("scope");
        const accountSizeParam = searchParams.get("accountSize");
        const priceParam = searchParams.get("price");

        if (modelParam || propFirmParam || accountSizeParam || accountTypeParam) {
            const parsedAccountSize = accountSizeParam ? parseInt(accountSizeParam, 10) : 0;
            const parsedPrice = priceParam ? parseFloat(priceParam) : 0;

            let challengeType = "2-Step Challenge";
            if (accountTypeParam === "1-step" || accountTypeParam === "1step" || accountTypeParam === "1-Step Challenge") {
                challengeType = "1-Step Challenge";
            }

            let scope = "Full Pass";
            if (scopeParam === "step-1" || scopeParam === "Step 1 Only") {
                scope = "Step 1 Only";
            }

            setFormData((prev) => ({
                ...prev,
                model: modelParam || prev.model,
                propFirm: propFirmParam || prev.propFirm,
                challengeType: challengeType,
                scope: scope,
                accountSize: parsedAccountSize > 0 ? parsedAccountSize : prev.accountSize,
                price: parsedPrice > 0 ? parsedPrice : prev.price
            }));
        }
    }, [searchParams]);

    // Fetch pricing plans and VAT
    useEffect(() => {
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
    }, []);

    // Calculate plan pricing dynamically
    const computedPrices = useMemo(() => {
        const challengeTypeSlug = formData.challengeType === "1-Step Challenge" ? "1-step" : "2-step";
        let scopeSlug = "full";
        if (formData.challengeType === "2-Step Challenge") {
            scopeSlug = formData.scope === "Step 1 Only" ? "step-1" : "full";
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

        // Fallbacks if API data isn't loaded yet
        const defaultStdPrices = { 50000: 490, 90000: 590, 100000: 690, 200000: 990, 500000: 1390 };
        const defaultGrtPrices = { 50000: 800, 90000: 950, 100000: 1200, 200000: 1700, 500000: 2500 };

        const stdPrice = getPriceForSize(stdPlan, formData.accountSize) || defaultStdPrices[formData.accountSize] || 0;
        const grtPrice = getPriceForSize(grtPlan, formData.accountSize) || defaultGrtPrices[formData.accountSize] || 0;

        return {
            standard: stdPrice,
            guaranteed: grtPrice
        };
    }, [formData.challengeType, formData.scope, formData.accountSize, plans]);

    // Keep formData price in sync with chosen package
    useEffect(() => {
        if (formData.accountSize > 0) {
            const targetPrice = formData.packageType === "Standard Pass" ? computedPrices.standard : computedPrices.guaranteed;
            if (targetPrice > 0 && formData.price !== targetPrice) {
                setFormData((prev) => ({ ...prev, price: targetPrice }));
            }
        }
    }, [formData.packageType, formData.accountSize, computedPrices]);

    const updateData = (fields: Partial<typeof INITIAL_CHECKOUT_DATA>) => {
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    const handleApplyDiscount = async () => {
        if (!formData.discountCode.trim()) return;
        try {
            const res = await api.post("/discounts/validate", { code: formData.discountCode });
            if (res.data && res.data.percentage) {
                updateData({ discountPercentage: res.data.percentage });
                toast.success(`Discount code applied! ${res.data.percentage}% off.`);
            } else {
                toast.error("Invalid discount code.");
            }
        } catch (err) {
            toast.error("Invalid or expired discount code.");
        }
    };

    const handleSubmitOrder = async () => {
        if (!formData.propFirm) {
            toast.error("Please select a Prop Firm");
            setActiveStep(1);
            return;
        }
        if (!formData.accountSize) {
            toast.error("Please select an Account Size");
            setActiveStep(3);
            return;
        }

        if (!formData.loginId || !formData.password) {
            toast.error("Please enter your account login credentials");
            setActiveStep(6);
            return;
        }
        if (!formData.agreedTimeline || !formData.agreedNoTrading) {
            toast.error("Please confirm the timeline and rules agreement");
            setActiveStep(5);
            return;
        }
        if (!formData.agreedToTerms || !formData.agreedToRefundPolicy) {
            toast.error("Please agree to the Terms of Service and Refund Policy");
            return;
        }

        setLoading(true);

        const discountedPrice = formData.price * (1 - (formData.discountPercentage || 0) / 100);
        const finalCost = discountedPrice + (discountedPrice * (formData.vatPercentage || 0)) / 100;

        if (!localStorage.getItem("access_token")) {
            toast.error("Please login to complete your order");
            router.push(`/signin?returnUrl=/checkout?${searchParams.toString()}`);
            setLoading(false);
            return;
        }

        try {
            await userService.getCurrentUser();
            
            const formattedRules = `[Pass Challenge: ${formData.packageType}] ${formData.notes || "Standard Pass evaluation setup"}`;
            const regResult = await propFirmService.createRegistration({
                login_id: formData.loginId,
                password: formData.password,
                propfirm_name: formData.propFirm,
                propfirm_website_link: "https://example.com",
                server_name: formData.serverName || "Live Server",
                server_type: formData.serverType,
                challenges_step: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                service_scope: formData.scope === "Step 1 Only" ? 1 : 2,
                propfirm_account_cost: finalCost,
                account_size: formData.accountSize,
                account_phases: formData.challengeType === "1-Step Challenge" ? 1 : 2,
                trading_platform: formData.platform,
                propfirm_rules: formattedRules,
                whatsapp_no: formData.whatsapp,
                telegram_username: formData.telegram
            });

            const regOrderId = regResult?.order_id || regResult?.id;

            if (!regResult || !regOrderId) {
                throw new Error("Registration failed to return an order ID.");
            }

            setOrderId(regOrderId);

            const origin = window.location.origin;
            const successUrl = `${origin}/dashboard`;
            const cancelUrl = `${origin}/checkout`;
            const orderDescription = `PropSol Pass - ${formData.propFirm} ${formData.challengeType} - $${formData.accountSize}k`;


            if (formData.paymentMethod === "whop") {
                const whopRes = await propFirmService.createWhopCheckoutLink(regOrderId);
                if (whopRes.checkout_url) {
                    window.location.href = whopRes.checkout_url;
                } else {
                    throw new Error("Failed to get Whop checkout URL");
                }
                return;
            }

            if (formData.paymentMethod === "invoice") {
                const invoiceRes = await cryptoService.createInvoice({
                    price_amount: finalCost,
                    price_currency: "usd",
                    pay_currency: formData.cryptoCurrency,
                    order_id: regOrderId,
                    order_description: orderDescription,
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
                    order_id: regOrderId,
                    order_description: orderDescription
                });

                setDirectPaymentDetails(paymentRes);
            }

        } catch (err) {
            console.error("Payment Error:", err);
            toast.error(err?.message || err?.response?.data?.message || "Failed to process order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (directPaymentDetails) {
        return <DirectPaymentView payment={directPaymentDetails} onComplete={() => setIsCompleted(true)} />;
    }

    if (isCompleted) {
        return <OrderSuccessView orderId={orderId} />;
    }

    const discountedPrice = formData.price * (1 - (formData.discountPercentage || 0) / 100);
    const vatAmount = (discountedPrice * (formData.vatPercentage || 0)) / 100;
    const finalTotal = discountedPrice + vatAmount;

    return (
        <div className="min-h-screen bg-[#070B19] text-white py-10 px-4 sm:px-6">
            <div className="w-full max-w-4xl mx-auto space-y-6">
                
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 border-b border-gray-800/80 pb-5">
                    <button
                        type="button"
                        onClick={() => router.push("/pass")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold text-slate-300 bg-slate-900/90 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Pass Page</span>
                    </button>

                    <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 px-3 py-1 rounded-full text-blue-400 text-[11px] font-semibold whitespace-nowrap shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>PropSol Pass Evaluation Checkout</span>
                    </div>
                </div>

                <div className="text-center max-w-xl mx-auto space-y-2 pt-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Complete Your Prop Firm Pass Registration
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400">
                        Step-by-step vertical selection below. Click any step to edit or update your options.
                    </p>
                </div>



                {/* PROGRESSIVE VERTICAL STEP LIST / ACCORDION */}
                <div className="space-y-4 pt-4">

                    {/* STEP 1: CHOOSE PROP FIRM */}
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                        activeStep === 1 ? "border-blue-500 bg-[#0E1535] shadow-lg shadow-blue-500/5" : "border-slate-800/80 bg-[#0A0F29]"
                    }`}>
                        <button
                            type="button"
                            onClick={() => setActiveStep(1)}
                            className="w-full p-5 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    formData.propFirm ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                }`}>
                                    {formData.propFirm ? <CheckCircle2 className="w-4 h-4" /> : "1"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white">Select Prop Firm</h3>
                                    <p className="text-xs text-slate-400">
                                        {formData.propFirm ? `Selected: ${formData.propFirm}` : "Choose your target evaluation firm"}
                                    </p>
                                </div>
                            </div>
                            {formData.propFirm && (
                                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                    {formData.propFirm}
                                </span>
                            )}
                        </button>

                        {activeStep === 1 && (
                            <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                                    {PROP_FIRMS.map((firm) => {
                                        const isSelected = formData.propFirm === firm.id;
                                        return (
                                            <button
                                                key={firm.id}
                                                type="button"
                                                onClick={() => {
                                                    updateData({ propFirm: firm.id });
                                                    setActiveStep(2);
                                                }}
                                                className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                                        : "border-gray-800 bg-[#141B3D] text-gray-300 hover:border-gray-700"
                                                }`}
                                            >
                                                <Building2 className={`w-6 h-6 ${firm.badgeColor}`} />
                                                <span className="text-sm font-semibold">{firm.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 2: CHALLENGE TYPE & SCOPE */}
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                        activeStep === 2 ? "border-blue-500 bg-[#0E1535] shadow-lg shadow-blue-500/5" : "border-slate-800/80 bg-[#0A0F29]"
                    }`}>
                        <button
                            type="button"
                            onClick={() => setActiveStep(2)}
                            className="w-full p-5 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    formData.challengeType ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                }`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white">Challenge Type & Service Scope</h3>
                                    <p className="text-xs text-slate-400">
                                        {formData.challengeType} • {formData.scope}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                                {formData.challengeType}
                            </span>
                        </button>

                        {activeStep === 2 && (
                            <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4 pt-4">
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">
                                        Challenge Model
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => updateData({ challengeType: "2-Step Challenge" })}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                formData.challengeType === "2-Step Challenge"
                                                    ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                                    : "border-gray-800 bg-[#141B3D] text-gray-400 hover:border-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Layers className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-bold text-white">2-Step Challenge</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Standard Phase 1 & Phase 2 evaluation model</p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateData({ challengeType: "1-Step Challenge", scope: "Full Pass" });
                                                setActiveStep(3);
                                            }}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                formData.challengeType === "1-Step Challenge"
                                                    ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                                    : "border-gray-800 bg-[#141B3D] text-gray-400 hover:border-gray-700"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Target className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-bold text-white">1-Step Challenge</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Single stage evaluation to get funded quickly</p>
                                        </button>
                                    </div>
                                </div>

                                {formData.challengeType === "2-Step Challenge" && (
                                    <div className="space-y-3 pt-2">
                                        <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">
                                            Scope of Service
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateData({ scope: "Step 1 Only" });
                                                    setActiveStep(3);
                                                }}
                                                className={`p-4 rounded-xl border text-left transition-all ${
                                                    formData.scope === "Step 1 Only"
                                                        ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                                        : "border-gray-800 bg-[#141B3D] text-gray-400 hover:border-gray-700"
                                                }`}
                                            >
                                                <span className="text-sm font-bold text-white block mb-1">Step 1 Only</span>
                                                <p className="text-xs text-gray-400">We pass Phase 1. You manage Phase 2 yourself.</p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateData({ scope: "Full Pass" });
                                                    setActiveStep(3);
                                                }}
                                                className={`p-4 rounded-xl border text-left transition-all ${
                                                    formData.scope === "Full Pass"
                                                        ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                                        : "border-gray-800 bg-[#141B3D] text-gray-400 hover:border-gray-700"
                                                }`}
                                            >
                                                <span className="text-sm font-bold text-white block mb-1">Full Pass (Step 1 + Step 2)</span>
                                                <p className="text-xs text-gray-400">Complete service passing both phases until funded.</p>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* STEP 3: SELECT ACCOUNT SIZE */}
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                        activeStep === 3 ? "border-blue-500 bg-[#0E1535] shadow-lg shadow-blue-500/5" : "border-slate-800/80 bg-[#0A0F29]"
                    }`}>
                        <button
                            type="button"
                            onClick={() => setActiveStep(3)}
                            className="w-full p-5 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    formData.accountSize ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                }`}>
                                    {formData.accountSize ? <CheckCircle2 className="w-4 h-4" /> : "3"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white">Select Account Size</h3>
                                    <p className="text-xs text-slate-400">
                                        {formData.accountSize ? `$${formData.accountSize.toLocaleString()} Account Capital` : "Choose your challenge size"}
                                    </p>
                                </div>
                            </div>
                            {formData.accountSize > 0 && (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    ${formData.accountSize.toLocaleString()}
                                </span>
                            )}
                        </button>

                        {activeStep === 3 && (
                            <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4 pt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {ACCOUNT_SIZES.map((size) => {
                                        const isSelected = formData.accountSize === size;
                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() => {
                                                    updateData({ accountSize: size });
                                                    setActiveStep(4);
                                                }}
                                                className={`p-4 rounded-xl border text-center transition-all ${
                                                    isSelected
                                                        ? "border-blue-500 bg-blue-500/10 text-white ring-2 ring-blue-500/20"
                                                        : "border-gray-800 bg-[#141B3D] text-gray-300 hover:border-gray-700"
                                                }`}
                                            >
                                                <span className="text-xs text-gray-400 block">$</span>
                                                <span className="text-base font-extrabold text-white">${(size / 1000).toFixed(0)}k</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 4: PACKAGE TYPE & PRICING */}
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                        activeStep === 4 ? "border-blue-500 bg-[#0E1535] shadow-lg shadow-blue-500/5" : "border-slate-800/80 bg-[#0A0F29]"
                    }`}>
                        <button
                            type="button"
                            onClick={() => setActiveStep(4)}
                            className="w-full p-5 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    formData.packageType ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                }`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white">Choose Package Level</h3>
                                    <p className="text-xs text-slate-400">
                                        {formData.packageType} • Fee: ${formData.price}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                ${formData.price}
                            </span>
                        </button>

                        {activeStep === 4 && (
                            <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4 pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateData({ packageType: "Standard Pass" });
                                            setActiveStep(5);
                                        }}
                                        className={`p-5 rounded-2xl border text-left transition-all ${
                                            formData.packageType === "Standard Pass"
                                                ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
                                                : "border-gray-800 bg-[#141B3D] text-gray-400 hover:border-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-white text-base">Standard Pass</span>
                                            <span className="text-lg font-extrabold text-blue-400">
                                                ${computedPrices.standard}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-3">Professional passing service with expert risk management.</p>
                                        <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
                                            <li>Standard evaluation queue</li>
                                            <li>PropSol automated risk protocol</li>
                                            <li>No refund guarantee</li>
                                        </ul>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            updateData({ packageType: "Guaranteed Pass" });
                                            setActiveStep(5);
                                        }}
                                        className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                                            formData.packageType === "Guaranteed Pass"
                                                ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
                                                : "border-gray-800 bg-[#141B3D] text-gray-400 hover:border-gray-700"
                                        }`}
                                    >
                                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
                                            RECOMMENDED
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-white text-base flex items-center gap-1.5">
                                                Guaranteed Pass <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            </span>
                                            <span className="text-lg font-extrabold text-blue-400">
                                                ${computedPrices.guaranteed}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-3">100% money back guarantee + compensation if we fail.</p>
                                        <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
                                            <li>Priority execution desk</li>
                                            <li>Full refund of fee + $100 compensation if not passed</li>
                                            <li>Full peace of mind guarantee</li>
                                        </ul>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 5: TIMELINE & RULES CONFIRMATION */}
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                        activeStep === 5 ? "border-blue-500 bg-[#0E1535] shadow-lg shadow-blue-500/5" : "border-slate-800/80 bg-[#0A0F29]"
                    }`}>
                        <button
                            type="button"
                            onClick={() => setActiveStep(5)}
                            className="w-full p-5 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    formData.agreedTimeline && formData.agreedNoTrading ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                }`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white">Timeline & Rules Confirmation</h3>
                                    <p className="text-xs text-slate-400">
                                        {formData.agreedTimeline && formData.agreedNoTrading ? "Rules Confirmed" : "Review timeline expectations"}
                                    </p>
                                </div>
                            </div>
                        </button>

                        {activeStep === 5 && (
                            <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4 pt-4">
                                <div className="bg-[#141B3D] p-4 rounded-xl border border-gray-800 space-y-3">
                                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
                                        <Clock className="w-4 h-4" />
                                        <span>Completion Timeline (30-60 Trading Days)</span>
                                    </div>
                                    <p className="text-xs text-gray-300 leading-relaxed">
                                        Our target completion window is within 30 to 60 trading days depending on market volatility and prop firm risk parameters.
                                    </p>
                                    
                                    <label className="flex items-center gap-3 text-xs text-gray-200 cursor-pointer pt-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreedTimeline}
                                            onChange={(e) => {
                                                const val = e.target.checked;
                                                updateData({ agreedTimeline: val });
                                                if (val && formData.agreedNoTrading) {
                                                    setActiveStep(6);
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600"
                                        />
                                        <span>I understand and accept the 30-60 trading day timeline</span>
                                    </label>
                                    
                                    <label className="flex items-center gap-3 text-xs text-gray-200 cursor-pointer pt-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreedNoTrading}
                                            onChange={(e) => {
                                                const val = e.target.checked;
                                                updateData({ agreedNoTrading: val });
                                                if (val && formData.agreedTimeline) {
                                                    setActiveStep(6);
                                                }
                                            }}
                                            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600"
                                        />
                                        <span>I confirm I will not place manual trades on the account during evaluation</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 6: ACCOUNT CREDENTIALS & CONTACT INFO */}
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                        activeStep === 6 ? "border-blue-500 bg-[#0E1535] shadow-lg shadow-blue-500/5" : "border-slate-800/80 bg-[#0A0F29]"
                    }`}>
                        <button
                            type="button"
                            onClick={() => setActiveStep(6)}
                            className="w-full p-5 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    formData.loginId ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                }`}>
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white">Account Credentials & Contact Info</h3>
                                    <p className="text-xs text-slate-400">
                                        {formData.loginId ? `Login: ${formData.loginId}` : "Enter MetaTrader login & server details"}
                                    </p>
                                </div>
                            </div>
                        </button>

                        {activeStep === 6 && (
                            <div className="p-5 pt-0 border-t border-slate-800/60 space-y-4 pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1">Account Login ID *</label>
                                        <input
                                            type="text"
                                            value={formData.loginId}
                                            onChange={(e) => updateData({ loginId: e.target.value })}
                                            placeholder="e.g. 1029384"
                                            className="w-full bg-[#141B3D] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1">Trader Password *</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => updateData({ password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full bg-[#141B3D] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1">Server Name</label>
                                        <input
                                            type="text"
                                            value={formData.serverName}
                                            onChange={(e) => updateData({ serverName: e.target.value })}
                                            placeholder="e.g. FTMO-Server"
                                            className="w-full bg-[#141B3D] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1">Trading Platform</label>
                                        <select
                                            value={formData.platform}
                                            onChange={(e) => updateData({ platform: e.target.value })}
                                            className="w-full bg-[#141B3D] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="Metatrader 5">MetaTrader 5 (MT5)</option>
                                            <option value="Metatrader 4">MetaTrader 4 (MT4)</option>
                                            <option value="cTrader">cTrader</option>
                                            <option value="MatchTrader">MatchTrader</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp Number</label>
                                        <input
                                            type="text"
                                            value={formData.whatsapp}
                                            onChange={(e) => updateData({ whatsapp: e.target.value })}
                                            placeholder="+1 234 567 8900"
                                            className="w-full bg-[#141B3D] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-300 mb-1">Telegram Username</label>
                                        <input
                                            type="text"
                                            value={formData.telegram}
                                            onChange={(e) => updateData({ telegram: e.target.value })}
                                            placeholder="@username"
                                            className="w-full bg-[#141B3D] border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(7)}
                                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
                                    >
                                        Next: Order Summary & Payment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* STEP 7: ORDER SUMMARY & PAYMENT */}
                    <div className={`rounded-2xl border transition-all overflow-hidden ${
                        activeStep === 7 ? "border-blue-500 bg-[#0E1535] shadow-lg shadow-blue-500/5" : "border-slate-800/80 bg-[#0A0F29]"
                    }`}>
                        <button
                            type="button"
                            onClick={() => setActiveStep(7)}
                            className="w-full p-5 flex items-center justify-between text-left"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                                    <Wallet className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm sm:text-base text-white">Order Summary & Payment Gateway</h3>
                                    <p className="text-xs text-slate-400">
                                        Total: <span className="text-blue-400 font-bold">${finalTotal.toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                        </button>

                        {activeStep === 7 && (
                            <div className="p-5 pt-0 border-t border-slate-800/60 space-y-6 pt-4">
                                
                                {/* SUMMARY CARD */}
                                <div className="bg-[#141B3D] p-5 rounded-2xl border border-gray-800 space-y-3">
                                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Registration Summary</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-gray-800 pb-3">
                                        <div>
                                            <span className="text-gray-500 block">Prop Firm</span>
                                            <span className="font-bold text-white">{formData.propFirm || "Not Selected"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Challenge Type</span>
                                            <span className="font-bold text-white">{formData.challengeType}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Account Capital</span>
                                            <span className="font-bold text-white">${formData.accountSize?.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Package</span>
                                            <span className="font-bold text-blue-400">{formData.packageType}</span>
                                        </div>
                                    </div>

                                    {/* Discount Code Input */}
                                    <div className="flex gap-2 pt-2">
                                        <input
                                            type="text"
                                            value={formData.discountCode}
                                            onChange={(e) => updateData({ discountCode: e.target.value })}
                                            placeholder="Discount Code"
                                            className="bg-[#0A0F29] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder-gray-500 flex-1 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyDiscount}
                                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold rounded-xl"
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {/* Price breakdown */}
                                    <div className="space-y-1.5 text-xs pt-2">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Base Price</span>
                                            <span>${formData.price.toFixed(2)}</span>
                                        </div>
                                        {formData.discountPercentage > 0 && (
                                            <div className="flex justify-between text-emerald-400">
                                                <span>Discount ({formData.discountPercentage}%)</span>
                                                <span>-${(formData.price - discountedPrice).toFixed(2)}</span>
                                            </div>
                                        )}
                                        {formData.vatPercentage > 0 && (
                                            <div className="flex justify-between text-gray-400">
                                                <span>VAT ({formData.vatPercentage}%)</span>
                                                <span>+${vatAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-gray-800">
                                            <span>Total Amount</span>
                                            <span className="text-blue-400">${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* PAYMENT METHOD SELECTOR */}
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase block">
                                        Select Payment Method
                                    </label>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => updateData({ paymentMethod: "whop" })}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                formData.paymentMethod === "whop"
                                                    ? "border-blue-500 bg-blue-500/10 text-white font-bold"
                                                    : "border-gray-800 bg-[#141B3D] text-gray-400"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <CreditCard className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-bold text-white">Whop Payment</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400">Credit Card / Apple Pay</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => updateData({ paymentMethod: "invoice" })}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                formData.paymentMethod === "invoice"
                                                    ? "border-blue-500 bg-blue-500/10 text-white font-bold"
                                                    : "border-gray-800 bg-[#141B3D] text-gray-400"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Wallet className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-bold text-white">Crypto Invoice</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400">NOWPayments Checkout</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => updateData({ paymentMethod: "direct" })}
                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                formData.paymentMethod === "direct"
                                                    ? "border-blue-500 bg-blue-500/10 text-white font-bold"
                                                    : "border-gray-800 bg-[#141B3D] text-gray-400"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Lock className="w-4 h-4 text-blue-400" />
                                                <span className="text-sm font-bold text-white">Direct Wallet</span>
                                            </div>
                                            <span className="text-[11px] text-gray-400">Send BTC/USDT directly</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Terms & Refund Policy */}
                                <div className="space-y-2 pt-2 text-xs">
                                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreedToTerms}
                                            onChange={(e) => updateData({ agreedToTerms: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600"
                                        />
                                        <span>I agree to the Terms of Service & Disclaimer</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreedToRefundPolicy}
                                            onChange={(e) => updateData({ agreedToRefundPolicy: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-blue-600"
                                        />
                                        <span>I acknowledge and agree to the PropSol Refund Policy</span>
                                    </label>
                                </div>

                                {/* CTA SUBMIT BUTTON */}
                                <button
                                    type="button"
                                    onClick={handleSubmitOrder}
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-base rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Complete Payment (${finalTotal.toFixed(2)})</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#070B19] text-white flex items-center justify-center text-sm">Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
