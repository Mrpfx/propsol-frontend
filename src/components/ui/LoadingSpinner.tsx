"use client";

import React from "react";
import Image from "next/image";

interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
}

export default function Loading({ message = "Loading...", fullScreen = true }: LoadingProps) {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600"
        : "flex h-96 items-center justify-center";

    return (
        <div className={containerClasses}>
            {fullScreen && (
                <>
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
                        <div style={{ animationDelay: "1s" }} className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
                    </div>
                    <div
                        style={{
                            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
                            backgroundSize: "40px 40px"
                        }}
                        className="absolute inset-0 opacity-20"
                    />
                </>
            )}
            <div className="relative flex flex-col items-center justify-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 bg-white/30 rounded-full opacity-50 blur-3xl animate-pulse" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div style={{ animationDuration: "8s" }} className="w-48 h-48 border border-white/20 rounded-full animate-spin" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div style={{ animationDuration: "6s", animationDirection: "reverse" }} className="w-40 h-40 border border-white/20 rounded-full animate-spin" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div style={{ animationDuration: "4s" }} className="w-32 h-32 border border-white/30 rounded-full animate-spin" />
                    </div>
                    <div className="relative w-48 h-48 animate-spin-slow">
                        <Image
                            src="/assets/star.png"
                            alt="Loading Star"
                            fill
                            className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                            priority
                        />
                    </div>
                </div>
                <div className="relative">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide animate-pulse drop-shadow-lg">
                        {message}
                    </h2>
                </div>
                <div className="flex gap-2 mt-4">
                    <div style={{ animationDelay: "0ms" }} className="w-2 h-2 rounded-full bg-white animate-bounce" />
                    <div style={{ animationDelay: "150ms" }} className="w-2 h-2 rounded-full bg-white animate-bounce" />
                    <div style={{ animationDelay: "300ms" }} className="w-2 h-2 rounded-full bg-white animate-bounce" />
                </div>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent rounded-full blur-sm" />
            </div>
        </div>
    );
}

export function LoadingSpinner({ size = "md", message }: { size?: "sm" | "md" | "lg"; message?: string }) {
    const starSizes = {
        sm: "w-16 h-16",
        md: "w-24 h-24",
        lg: "w-32 h-32",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };

    return (
        <div className="flex flex-col items-center justify-center py-10">
            <div
                className={`relative ${starSizes[size]} mb-4 animate-spin-slow`}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-2xl animate-pulse" />
                </div>
                <Image
                    src="/assets/star.png"
                    alt="Loading"
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                />
            </div>
            {message && (
                <p className={`${textSizes[size]} font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600`}>
                    {message}
                </p>
            )}
        </div>
    );
}
