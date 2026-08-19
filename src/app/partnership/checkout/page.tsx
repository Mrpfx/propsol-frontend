// @ts-nocheck
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { partnershipService } from "@/services/partnership.service";
import { propFirmService } from "@/services/prop-firm.service";
import { cryptoService, CreatePaymentResponse } from "@/services/crypto.service";
import { userService } from "@/services/user.service";
import { toast } from "react-hot-toast";
import { 
    ArrowLeft, 
    Handshake, 
    ShieldCheck, 
    CheckCircle2, 
    Building2, 
    Wallet, 
    CreditCard, 
    QrCode, 
    Copy, 
    Check, 
    Clock, 
    Info, 
    Sparkles, 
    Lock, 
    AlertCircle,
    Layers,
    DollarSign,
    Loader2
} from "lucide-react";

// Standard prop firm logos / badges fallback
const PROP_FIRMS = [
    { id: "FundingPips", name: "Funding Pips", color: "from-blue-500 to-indigo-600" },
    { id: "TenTrade", name: "TenTrade", color: "from-purple-500 to-indigo-600" },
    { id: "FTMO", name: "FTMO", color: "from-amber-500 to-orange-600" },
    { id: "Fintokei", name: "Fintokei", color: "from-emerald-500 to-teal-600" },
    { id: "FundedNext", name: "FundedNext", color: "from-cyan-500 to-blue-600" },
    { id: "InstantFunding", name: "Instant Funding", color: "from-rose-500 to-pink-600" }
];

const CRYPTO_CURRENCIES = [
    { id: "usdttrc20", name: "USDT (TRC20)", icon: "₮" },
    { id: "usdterc20", name: "USDT (ERC20)", icon: "₮" },
    { id: "usdtbep20", name: "USDT (BEP20)", icon: "₮" },
    { id: "btc", name: "Bitcoin (BTC)", icon: "₿" },
    { id: "eth", name: "Ethereum (ETH)", icon: "Ξ" },
    { id: "ltc", name: "Litecoin (LTC)", icon: "Ł" },
    { id: "sol", name: "Solana (SOL)", icon: "◎" }
];

function DirectPaymentView({ payment, onComplete }: { payment: CreatePaymentResponse; onComplete: () => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (payment.pay_address) {
            navigator.clipboard.writeText(payment.pay_address);
            setCopied(true);
            toast.success("Deposit address copied to clipboard!");
            setTimeout(() => setCopied(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-[#070B19] text-white py-12 px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-xl bg-[#0E1535] border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />

                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Direct Crypto Payment</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-white">Send Crypto Deposit</h2>
                    <p className="text-xs text-slate-400">
                        Transfer exact payment to activate your PropSol Partnership account.
                    </p>
                </div>

                <div className="bg-[#141B3D] p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center text-sm border-b border-slate-800/80 pb-3">
                        <span className="text-slate-400">Payment Amount:</span>
                        <span className="font-extrabold text-emerald-400 text-lg">
                            {payment.pay_amount} {payment.pay_currency?.toUpperCase()}
                        </span>
                    </div>

                    {payment.pay_address && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                                Deposit Address ({payment.pay_currency?.toUpperCase()})
                            </label>
                            <div className="flex items-center gap-2 bg-[#0A0F29] border border-slate-700 rounded-xl p-2.5">
                                <span className="font-mono text-xs text-blue-300 truncate flex-1">
                                    {payment.pay_address}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shrink-0"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                            <Clock className="w-4 h-4" /> Awaiting blockchain confirmation
                        </span>
                        <span>Order ID: #{payment.order_id || "PROPSOL-PARTNERSHIP"}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onComplete}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                    >
                        I Have Completed Payment
                    </button>
                </div>
            </div>
        </div>
    );
}

function OrderSuccessView({ orderId }: { orderId: string }) {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#070B19] text-white py-12 px-4 sm:px-6 flex items-center justify-center">
            <div className="w-full max-w-lg bg-[#0E1535] border border-emerald-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-white">Partnership Order Submitted!</h2>
                    <p className="text-xs text-slate-400">
                        Your PropSol Partnership request has been received. Our team will configure your account and send investor access credentials within 24 hours.
                    </p>
                </div>

                <div className="bg-[#141B3D] p-4 rounded-xl border border-slate-800 text-xs font-mono text-blue-300">
                    Order Reference: #{orderId}
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
                >
                    Go to User Dashboard
                </button>
            </div>
        </div>
    );
}

function PartnershipCheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Query parameters from modal selection (IDs and configuration only, NEVER untrusted prices!)
    const rawModel = searchParams.get("model") || "partnership";
    const rawAccountType = searchParams.get("accountType") || "challenge";
    const rawPropFirm = searchParams.get("propFirm") || "FundingPips";
    const rawAccountSize = parseInt(searchParams.get("accountSize") || "50000", 10);

    const [accountType, setAccountType] = useState<string>(rawAccountType);
    const [propFirm, setPropFirm] = useState<string>(rawPropFirm);
    const [accountSize, setAccountSize] = useState<number>(rawAccountSize);

    // Canonical Fallback Prices
    const CANONICAL_PRICES: Record<string, Record<number, number>> = {
        challenge: { 50000: 319, 90000: 519, 100000: 569, 200000: 699, 500000: 1999 },
        instant: { 50000: 499, 90000: 799, 100000: 899, 200000: 1299, 500000: 2999 }
    };
    
    const initialCanonicalPrice = (CANONICAL_PRICES[rawAccountType] && CANONICAL_PRICES[rawAccountType][rawAccountSize])
        ? CANONICAL_PRICES[rawAccountType][rawAccountSize]
        : (rawAccountType === "instant" ? 499 : 319);

    const [basePrice, setBasePrice] = useState<number>(initialCanonicalPrice);

    // Form inputs
    const [whatsapp, setWhatsapp] = useState<string>("");
    const [telegram, setTelegram] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"whop" | "invoice" | "direct">("whop");
    const [cryptoCurrency, setCryptoCurrency] = useState<string>("usdttrc20");

    // Promo Code
    const [discountCode, setDiscountCode] = useState<string>("");
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [discountApplied, setDiscountApplied] = useState<boolean>(false);

    // Agreements
    const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
    const [agreedToProfitSplit, setAgreedToProfitSplit] = useState<boolean>(false);

    // Flow State
    const [loading, setLoading] = useState<boolean>(false);
    const [directPaymentDetails, setDirectPaymentDetails] = useState<CreatePaymentResponse | null>(null);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [orderId, setOrderId] = useState<string>("");

    // User Authentication State
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
    const [authRequired, setAuthRequired] = useState<boolean>(false);

    // Fetch official database partnership plans & check user auth on load
    useEffect(() => {
        const fetchPlansAndAuth = async () => {
            setCheckingAuth(true);

            // Fetch canonical database price from backend endpoint
            try {
                const plans = await partnershipService.getPartnershipPlans();
                const matchedPlan = plans.find((p) => p.account_type === accountType || p.slug.includes(accountType));
                if (matchedPlan && matchedPlan.prices) {
                    const priceObj = matchedPlan.prices.find((pr) => pr.account_size === accountSize);
                    if (priceObj && priceObj.price > 0) {
                        setBasePrice(priceObj.price);
                    }
                }
            } catch (planErr) {
                console.warn("Failed to fetch official DB plans, using canonical matrix:", planErr);
            }

            const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
            if (!token) {
                setAuthRequired(true);
                setCurrentUser(null);
                setCheckingAuth(false);
                return;
            }

            try {
                const user = await userService.getCurrentUser();
                setCurrentUser(user);
                setAuthRequired(false);
                if (user?.whatsapp_no || user?.phone_number) {
                    setWhatsapp(user.whatsapp_no || user.phone_number || "");
                }
                if (user?.telegram_username) {
                    setTelegram(user.telegram_username || "");
                }
            } catch (err) {
                console.warn("User auth session invalid or expired:", err);
                setAuthRequired(true);
                setCurrentUser(null);
            } finally {
                setCheckingAuth(false);
            }
        };

        fetchPlansAndAuth();
    }, [accountType, accountSize]);

    // Calculate final total
    const discountedPrice = basePrice * (1 - discountPercentage / 100);
    const finalTotal = discountedPrice;

    const handleApplyDiscount = () => {
        if (!discountCode.trim()) return;
        const code = discountCode.trim().toUpperCase();
        if (code === "PROPSOL10" || code === "PARTNER10") {
            setDiscountPercentage(10);
            setDiscountApplied(true);
            toast.success("10% Discount applied successfully!");
        } else if (code === "VIP15") {
            setDiscountPercentage(15);
            setDiscountApplied(true);
            toast.success("15% VIP Discount applied successfully!");
        } else {
            toast.error("Invalid discount code");
        }
    };

    const handleRedirectToSignIn = () => {
        const currentPath = `/partnership/checkout?${searchParams.toString()}`;
        router.push(`/signin?returnUrl=${encodeURIComponent(currentPath)}`);
    };

    const handleSubmitOrder = async () => {
        if (!agreedToTerms || !agreedToProfitSplit) {
            toast.error("Please accept the Terms of Service & Partnership Agreement");
            return;
        }

        const token = localStorage.getItem("access_token");
        if (!token || authRequired) {
            toast.error("Authentication required: Please sign in to complete your partnership registration.");
            handleRedirectToSignIn();
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Saving partnership registration to backend database...");

        try {
            // Verify current session with backend
            const user = await userService.getCurrentUser();
            if (!user) {
                toast.error("Session expired. Please sign in again.", { id: toastId });
                handleRedirectToSignIn();
                return;
            }

            // Save partnership registration to backend database
            const regResult = await partnershipService.createPartnership({
                login_id: "TO_BE_CREATED",
                password: "PENDING_PARTNERSHIP",
                propfirm_name: propFirm,
                propfirm_website_link: "https://example.com",
                server_name: "Live Server",
                server_type: "MT5",
                challenges_step: accountType === "instant" ? 0 : 2,
                service_scope: 2,
                propfirm_account_cost: finalTotal,
                account_size: accountSize,
                account_phases: accountType === "instant" ? 0 : 2,
                trading_platform: "Metatrader 5",
                propfirm_rules: `[PropSol Partnership - ${accountType === "instant" ? "Instant Account" : "2-Step Challenge"}] ${notes || "Standard partnership setup"}`,
                whatsapp_no: whatsapp,
                telegram_username: telegram
            });

            const regOrderId = regResult?.order_id || regResult?.id;

            if (!regResult || !regOrderId) {
                throw new Error("Registration failed to return an order ID from backend database.");
            }

            setOrderId(regOrderId);
            toast.success(`Partnership registration saved! Order #${regOrderId}`, { id: toastId });

            const origin = window.location.origin;
            const successUrl = `${origin}/dashboard`;
            const cancelUrl = `${origin}/partnership/checkout`;
            const orderDescription = `PropSol Partnership - ${propFirm} (${accountType.toUpperCase()}) - $${accountSize.toLocaleString()}`;

            if (paymentMethod === "whop") {
                const whopRes = await propFirmService.createWhopCheckoutLink(regOrderId);
                if (whopRes?.checkout_url) {
                    window.location.href = whopRes.checkout_url;
                } else {
                    throw new Error("Failed to generate Whop checkout URL");
                }
                return;
            }

            if (paymentMethod === "invoice") {
                const invoiceRes = await cryptoService.createInvoice({
                    price_amount: finalTotal,
                    price_currency: "usd",
                    pay_currency: cryptoCurrency,
                    order_id: regOrderId,
                    order_description: orderDescription,
                    success_url: successUrl,
                    cancel_url: cancelUrl
                });

                if (invoiceRes?.invoice_url) {
                    window.location.href = invoiceRes.invoice_url;
                } else {
                    throw new Error("Failed to generate crypto invoice URL");
                }
            } else {
                const paymentRes = await cryptoService.createPayment({
                    price_amount: finalTotal,
                    price_currency: "usd",
                    pay_currency: cryptoCurrency,
                    order_id: regOrderId,
                    order_description: orderDescription
                });

                setDirectPaymentDetails(paymentRes);
            }
        } catch (err: any) {
            console.error("Partnership Checkout Error:", err);
            toast.error(err?.message || err?.response?.data?.message || "Failed to save partnership registration", { id: toastId });
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

    const firmObj = PROP_FIRMS.find((f) => f.id === propFirm) || { name: propFirm, color: "from-blue-500 to-indigo-600" };

    return (
        <div className="min-h-screen bg-[#070B19] text-white py-10 px-4 sm:px-6">
            <div className="w-full max-w-4xl mx-auto space-y-6">
                
                {/* Dedicated Header Banner */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 border-b border-slate-800/80 pb-5">
                    <button
                        type="button"
                        onClick={() => router.push("/partnership")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-semibold text-slate-300 bg-slate-900/90 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl transition-all shrink-0 shadow-sm"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Partnership Page</span>
                    </button>

                    <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-bold whitespace-nowrap shrink-0 shadow-sm">
                        <Handshake className="w-4 h-4 shrink-0 text-blue-400" />
                        <span>PropSol Partnership Dedicated Checkout</span>
                    </div>
                </div>

                {/* Authentication Status Notice */}
                {!checkingAuth && (
                    <>
                        {authRequired ? (
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-0.5 sm:mt-0">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-300">Sign In Required to Complete Partnership</h4>
                                        <p className="text-xs text-amber-200/80">
                                            You must be logged into your PropSol account so your partnership registration is saved to your dashboard.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRedirectToSignIn}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-md shrink-0 w-full sm:w-auto text-center"
                                >
                                    Sign In / Create Account
                                </button>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-300">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Signed in as <strong>{currentUser?.name || currentUser?.email || "PropSol Partner"}</strong></span>
                                </div>
                                <span className="text-[10px] text-emerald-400/80 font-mono">Account Active</span>
                            </div>
                        )}
                    </>
                )}

                {/* Title */}
                <div className="text-center max-w-xl mx-auto space-y-2 pt-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Complete Your Partnership Setup
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400">
                        PropSol handles account purchasing, execution, and risk protocols. Receive investor MT5 credentials within 24 hours.
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">

                    {/* Left Details Column (7 cols) */}
                    <div className="lg:col-span-7 space-y-5">

                        {/* Selected Partnership Summary Card */}
                        <div className="bg-[#0E1535] border border-blue-500/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />

                            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Target Prop Firm</span>
                                        <h3 className="font-extrabold text-lg text-white">{firmObj.name}</h3>
                                    </div>
                                </div>

                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 capitalize">
                                    {accountType} Model
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-[#141B3D] p-3.5 rounded-xl border border-slate-800 space-y-1">
                                    <span className="text-slate-400 block text-[11px]">Account Capital</span>
                                    <span className="font-extrabold text-white text-base">${accountSize.toLocaleString()}</span>
                                </div>
                                <div className="bg-[#141B3D] p-3.5 rounded-xl border border-slate-800 space-y-1">
                                    <span className="text-slate-400 block text-[11px]">Trader Profit Share</span>
                                    <span className="font-extrabold text-emerald-400 text-base">Up to 80%</span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/25 text-xs text-blue-200 space-y-1">
                                <div className="flex items-center gap-2 font-bold text-blue-400">
                                    <Info className="w-4 h-4" />
                                    <span>Automated PropSol Management</span>
                                </div>
                                <p className="text-[11px] text-slate-300 leading-relaxed">
                                    No pre-existing MT5 credentials needed. PropSol purchases and configures your account directly at <strong>{firmObj.name}</strong> upon payment confirmation.
                                </p>
                            </div>
                        </div>

                        {/* Contact Details Card */}
                        <div className="bg-[#0E1535] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                                <ShieldCheck className="w-4 h-4 text-blue-400" />
                                <span>Contact & Delivery Details</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="+1 234 567 8900"
                                        className="w-full bg-[#141B3D] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-1">Telegram Handle</label>
                                    <input
                                        type="text"
                                        value={telegram}
                                        onChange={(e) => setTelegram(e.target.value)}
                                        placeholder="@username"
                                        className="w-full bg-[#141B3D] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-1">Special Setup Instructions / Notes</label>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Optional instructions for our trading desk..."
                                    className="w-full bg-[#141B3D] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Payment Column (5 cols) */}
                    <div className="lg:col-span-5 space-y-5">
                        
                        {/* Payment Method Card */}
                        <div className="bg-[#0E1535] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
                                <Wallet className="w-4 h-4 text-blue-400" />
                                <span>Select Payment Gateway</span>
                            </h3>

                            {/* Payment Options */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("whop")}
                                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                                        paymentMethod === "whop"
                                            ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                            : "border-slate-800 bg-[#141B3D] text-slate-300 hover:border-slate-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold block text-white">Whop Payment Gateway</span>
                                            <span className="text-[10px] text-slate-400">Credit Card, Debit, Apple Pay</span>
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "whop" ? "border-blue-500 bg-blue-500" : "border-slate-600"}`}>
                                        {paymentMethod === "whop" && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("invoice")}
                                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                                        paymentMethod === "invoice"
                                            ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                            : "border-slate-800 bg-[#141B3D] text-slate-300 hover:border-slate-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                                            <QrCode className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold block text-white">NOWPayments Crypto Invoice</span>
                                            <span className="text-[10px] text-slate-400">Automated multi-crypto checkout</span>
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "invoice" ? "border-blue-500 bg-blue-500" : "border-slate-600"}`}>
                                        {paymentMethod === "invoice" && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("direct")}
                                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                                        paymentMethod === "direct"
                                            ? "border-blue-500 bg-blue-500/10 text-white font-bold ring-2 ring-blue-500/20"
                                            : "border-slate-800 bg-[#141B3D] text-slate-300 hover:border-slate-700"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold block text-white">Direct Crypto Transfer</span>
                                            <span className="text-[10px] text-slate-400">Instant USDT / BTC / ETH wallet</span>
                                        </div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "direct" ? "border-blue-500 bg-blue-500" : "border-slate-600"}`}>
                                        {paymentMethod === "direct" && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            </div>

                            {/* Select Crypto Currency if invoice or direct */}
                            {paymentMethod !== "whop" && (
                                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                                    <label className="text-xs font-semibold text-slate-300 block">Select Crypto Asset</label>
                                    <select
                                        value={cryptoCurrency}
                                        onChange={(e) => setCryptoCurrency(e.target.value)}
                                        className="w-full bg-[#141B3D] border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
                                    >
                                        {CRYPTO_CURRENCIES.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Promo Code Input */}
                            <div className="pt-2 border-t border-slate-800/80 space-y-2">
                                <label className="text-xs font-semibold text-slate-300 block">Promo Code</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="PROPSOL10"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        disabled={discountApplied}
                                        className="flex-1 bg-[#141B3D] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-blue-500 disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyDiscount}
                                        disabled={discountApplied || !discountCode.trim()}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shrink-0"
                                    >
                                        {discountApplied ? "Applied" : "Apply"}
                                    </button>
                                </div>
                            </div>

                            {/* Order Total Summary */}
                            <div className="bg-[#141B3D] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                                <div className="flex justify-between text-slate-400">
                                    <span>Partnership Base Fee</span>
                                    <span className="font-semibold text-white">${basePrice.toFixed(2)}</span>
                                </div>

                                {discountPercentage > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Discount ({discountPercentage}%)</span>
                                        <span className="font-semibold">-${(basePrice * (discountPercentage / 100)).toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                                    <span>Total Amount Due</span>
                                    <span className="text-blue-400">${finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Terms Checkboxes */}
                            <div className="space-y-2 text-[11px] text-slate-300">
                                <label className="flex items-start gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 mt-0.5"
                                    />
                                    <span>I agree to the PropSol Terms of Service and Refund Policy.</span>
                                </label>

                                <label className="flex items-start gap-2.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToProfitSplit}
                                        onChange={(e) => setAgreedToProfitSplit(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 mt-0.5"
                                    />
                                    <span>I agree to the Partnership Profit Split protocol and non-interference terms.</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="button"
                                onClick={handleSubmitOrder}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Pay ${finalTotal.toFixed(2)} & Start Partnership
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PartnershipCheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#070B19] text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <PartnershipCheckoutContent />
        </Suspense>
    );
}
