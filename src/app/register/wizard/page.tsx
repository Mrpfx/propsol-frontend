"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import { propFirmService } from "@/services/prop-firm.service";

export default function RegistrationWizardPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        loginId: "",
        password: "",
        propFirmName: "",
        propFirmWebsite: "",
        serverName: "",
        serverType: "",
        challengeSteps: "",
        accountCost: "",
        accountSize: "",
        accountPhases: "",
        tradingPlatform: "Metatrader 5 only",
        propFirmRules: "",
        whatsappNumber: "",
        telegramUsername: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateStep = (step: number) => {
        switch (step) {
            case 1:
                if (!formData.loginId || formData.loginId.length < 3) {
                    toast.error("Login ID must be at least 3 characters");
                    return false;
                }
                if (!formData.password || formData.password.length < 6) {
                    toast.error("Password must be at least 6 characters");
                    return false;
                }
                return true;
            case 2:
                if (!formData.propFirmName || formData.propFirmName.length < 3) {
                    toast.error("Prop Firm Name must be at least 3 characters");
                    return false;
                }
                if (!formData.propFirmWebsite || formData.propFirmWebsite.length < 5) {
                    toast.error("Website link must be valid (min 5 chars)");
                    return false;
                }
                if (!formData.serverName || formData.serverName.length < 3) {
                    toast.error("Server Name must be at least 3 characters");
                    return false;
                }
                return true;
            case 3:
                if (!formData.serverType || formData.serverType.length < 2) {
                    toast.error("Server Type must be at least 2 characters");
                    return false;
                }
                if (!formData.challengeSteps || parseInt(formData.challengeSteps) < 1) {
                    toast.error("Challenge Steps must be at least 1");
                    return false;
                }
                if (!formData.accountCost || parseFloat(formData.accountCost) < 0) {
                    toast.error("Account Cost cannot be negative");
                    return false;
                }
                return true;
            case 4:
                if (!formData.accountSize || parseFloat(formData.accountSize) < 0) {
                    toast.error("Account Size cannot be negative");
                    return false;
                }
                if (!formData.accountPhases) {
                    toast.error("Please select Account Phases");
                    return false;
                }
                return true;
            case 5:
                const wordCount = formData.propFirmRules.trim().split(/\s+/).filter(word => word.length > 0).length;
                if (wordCount < 200) {
                    toast.error(`Prop Firm Rules must be at least 200 words. Current: ${wordCount} words.`);
                    return false;
                }
                if (!formData.whatsappNumber || formData.whatsappNumber.length < 5) {
                    toast.error("WhatsApp Number must be valid (min 5 chars)");
                    return false;
                }
                if (!formData.telegramUsername || formData.telegramUsername.length < 3) {
                    toast.error("Telegram Username must be at least 3 characters");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            await propFirmService.createRegistration({
                login_id: formData.loginId,
                password: formData.password,
                propfirm_name: formData.propFirmName,
                propfirm_website_link: formData.propFirmWebsite,
                server_name: formData.serverName,
                server_type: formData.serverType,
                challenges_step: parseInt(formData.challengeSteps) || 1,
                propfirm_account_cost: parseFloat(formData.accountCost) || 0,
                account_size: parseFloat(formData.accountSize) || 0,
                account_phases: formData.accountPhases === "1 Step Challenge" ? 1 : 2,
                trading_platform: "Metatrader 5", // Fixed as per UI
                propfirm_rules: formData.propFirmRules,
                whatsapp_no: formData.whatsappNumber,
                telegram_username: formData.telegramUsername,
            });
            toast.success("Registration successful! Redirecting...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (err: any) {
            console.error("Registration error:", err);
            const errorMessage = "Failed to create registration. Please check your inputs and try again.";
            setError(errorMessage);
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Login ID</label>
                            <input
                                type="text"
                                name="loginId"
                                value={formData.loginId}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Name of Prop Firm</label>
                            <input
                                type="text"
                                name="propFirmName"
                                value={formData.propFirmName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Link to Prop Firm Website</label>
                            <input
                                type="text"
                                name="propFirmWebsite"
                                value={formData.propFirmWebsite}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Server Name</label>
                            <input
                                type="text"
                                name="serverName"
                                value={formData.serverName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Server Type <span className="text-gray-400">(MT5)</span></label>
                            <input
                                type="text"
                                name="serverType"
                                value={formData.serverType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Challenge Steps</label>
                            <input
                                type="number"
                                name="challengeSteps"
                                value={formData.challengeSteps}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Cost of Prop Account</label>
                            <input
                                type="number"
                                name="accountCost"
                                value={formData.accountCost}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Account size indication</label>
                            <input
                                type="number"
                                name="accountSize"
                                value={formData.accountSize}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Account phases</label>
                            <div className="relative">
                                <select
                                    name="accountPhases"
                                    value={formData.accountPhases}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600 appearance-none bg-white"
                                >
                                    <option value="">Select Phase</option>
                                    <option value="1 Step Challenge">1 Step Challenge</option>
                                    <option value="2 Steps Challenge">2 Steps Challenge</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trading platform <span className="text-red-500 italic">Metatrader 5 only</span></label>
                            <input
                                type="text"
                                name="tradingPlatform"
                                value={formData.tradingPlatform}
                                readOnly
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Prop Firm Rules (to state all rules clearly)</label>
                            <textarea
                                name="propFirmRules"
                                value={formData.propFirmRules}
                                onChange={handleInputChange as any}
                                rows={6}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                                placeholder="Please describe the rules in detail (minimum 200 words)..."
                            />
                            <div className="mt-1 text-right text-xs text-slate-500">
                                Word count: {formData.propFirmRules.trim().split(/\s+/).filter(word => word.length > 0).length} / 200 (Minimum)
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp Number</label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={formData.whatsappNumber}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Telegram Username</label>
                            <input
                                type="text"
                                name="telegramUsername"
                                value={formData.telegramUsername}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3B60FF] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-600"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-4 lg:top-8 left-4 lg:left-20 right-4 lg:right-auto w-auto max-w-6xl flex flex-col lg:flex-row justify-between items-start lg:items-center z-20 gap-4">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900">
                    Please continue to finalize registration
                </h1>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <span className="text-slate-500 font-medium italic text-sm lg:text-base">{currentStep}/{totalSteps}</span>
                    <div className="w-full lg:w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#3B60FF] transition-all duration-300 ease-out"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Decorative 3D Elements */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-16 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float-delayed z-0 pointer-events-none">
                <Image
                    src="/assets/coil_v2.png"
                    alt="Decorative Coil"
                    fill
                    className="object-contain"
                />
            </div>

            <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float z-0 pointer-events-none">
                <Image
                    src="/assets/star.png"
                    alt="Decorative Star"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[500px] p-8 lg:p-12">

                {/* Left Section: Form */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    {/* Back Button */}
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <h2 className="text-xl font-bold text-slate-800 mb-8">
                        Prop Firm Account Details Form
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {renderStepContent()}

                    <div className="mt-10">
                        <button
                            onClick={nextStep}
                            disabled={loading}
                            className="w-full bg-[#3B60FF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : (currentStep === totalSteps ? "Finalize & Submit" : "Next")}
                        </button>
                    </div>
                </div>

                {/* Right Section: Visual (PropPal Icon) */}
                <div className="hidden lg:flex w-1/2 items-center justify-center relative">
                    {/* Placeholder for PropPal 3D Icon */}
                    <div className="relative w-64 h-64 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-[-10deg] hover:rotate-0 transition-transform duration-500">
                        <div className="absolute inset-0 bg-[url('/assets/cracked_texture.png')] opacity-20 mix-blend-overlay" />
                        <div className="w-48 h-48 bg-white rounded-2xl shadow-inner flex items-center justify-center relative z-10">
                            <span className="text-3xl font-bold text-[#3B60FF]">PropPal</span>
                        </div>
                        {/* Glow effect */}
                        <div className="absolute -inset-4 bg-blue-500/30 blur-xl -z-10 rounded-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}
