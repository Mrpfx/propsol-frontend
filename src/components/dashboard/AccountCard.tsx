"use client";

import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountInfoModal } from "@/components/dashboard/AccountInfoModal";
import { AccountEditModal } from "@/components/dashboard/AccountEditModal";
import Link from "next/link";

import { PropFirmRegistration } from "@/services/prop-firm.service";

interface AccountCardProps {
    id: string;
    password?: string;
    name: string;
    status: "pending" | "in_progress" | "passed" | "failed";
    currentStep: 1 | 2 | 3;
    account: PropFirmRegistration;
}

export function AccountCard({
    id,
    password = "*************",
    name,
    status,
    currentStep,
    account: initialAccount,
}: AccountCardProps) {
    const [account, setAccount] = useState<PropFirmRegistration>(initialAccount);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const isFailed = status === "failed";

    return (
        <>
            <div
                className={cn(
                    "overflow-hidden rounded-xl border border-gray-100 border-t-4 bg-white p-6 shadow-sm",
                    isFailed ? "border-t-red-500" : "border-t-blue-600"
                )}
            >
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">
                                Prop Account Information
                            </h3>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Edit account details"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p>
                                <span className="font-medium text-gray-500">Prop Account ID:</span>{" "}
                                {account.login_id || id}
                            </p>
                            <p>
                                <span className="font-medium text-gray-500">Password:</span>{" "}
                                {account.password || password}
                            </p>
                            <p>
                                <span className="font-medium text-gray-500">Account Name:</span>{" "}
                                {account.propfirm_name || name}
                            </p>
                            <p>
                                <span className="font-medium text-gray-500">Server Name:</span>{" "}
                                {account.server_name || "-"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-500">Platform:</span>{" "}
                                {account.trading_platform || "-"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsInfoModalOpen(true)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Check Prop firm account full information
                    </button>
                </div>


                {/* Progress Stepper */}
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-center justify-between">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors bg-white",
                                    "border-blue-600 bg-blue-600 text-white" // Always blue/completed for Step 1
                                )}
                            >
                                <Check className="h-4 w-4" />
                            </div>
                            <span className="absolute top-10 hidden w-32 text-center text-sm font-medium text-gray-500 sm:block">
                                Register & Submit
                            </span>
                        </div>

                        {/* Line 1-2 */}
                        <div className="flex-1 h-0.5 bg-gray-200 mx-2 relative">
                            <div
                                className={cn(
                                    "absolute inset-0 transition-all duration-500",
                                    "bg-blue-600" // Always blue connecting 1 to 2
                                )}
                                style={{ width: "100%" }}
                            />
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors bg-white",
                                    currentStep >= 2
                                        ? isFailed
                                            ? "border-red-500 bg-red-500 text-white"
                                            : "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-300 text-gray-300"
                                )}
                            >
                                {currentStep > 2 && !isFailed ? (
                                    <Check className="h-4 w-4" />
                                ) : isFailed ? (
                                    <X className="h-4 w-4" />
                                ) : currentStep === 2 ? (
                                    <div className="h-2 w-2 rounded-full bg-current" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-current" />
                                )}
                            </div>
                            <span className="absolute top-10 hidden w-32 text-center text-sm font-medium text-gray-500 sm:block">
                                Passing Process
                            </span>
                        </div>

                        {/* Line 2-3 */}
                        <div className="flex-1 h-0.5 bg-gray-200 mx-2 relative">
                            <div
                                className={cn(
                                    "absolute inset-0 transition-all duration-500",
                                    isFailed ? "bg-red-500" : "bg-blue-600"
                                )}
                                style={{ width: currentStep >= 3 || isFailed ? "100%" : currentStep === 2 ? "50%" : "0%" }}
                            />
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors bg-white",
                                    currentStep >= 3 || isFailed
                                        ? isFailed
                                            ? "border-red-500 bg-red-500 text-white"
                                            : "border-blue-600 bg-blue-600 text-white"
                                        : "border-gray-300 text-gray-300"
                                )}
                            >
                                {currentStep === 3 && !isFailed ? (
                                    <Check className="h-4 w-4" />
                                ) : isFailed ? (
                                    <X className="h-4 w-4" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-current" />
                                )}
                            </div>
                            <span className="absolute top-10 hidden w-32 text-center text-sm font-medium text-gray-500 sm:block">
                                Account Passed
                            </span>
                        </div>
                    </div>
                    {/* Spacer for the absolute text labels */}
                    <div className="h-8"></div>
                </div>
            </div>

            <AccountInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                account={account}
            />

            <AccountEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                account={account}
                onUpdate={(updatedAccount) => setAccount(updatedAccount)}
            />
        </>
    );
}

