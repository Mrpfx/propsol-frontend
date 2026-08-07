// @ts-nocheck
"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountPassedPage() {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/95 p-4 backdrop-blur-sm">
            {/* Background Shapes */}
            <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

            {/* 3D Elements */}
            <div className="absolute left-4 top-1/3 hidden h-48 w-48 md:block animate-float-slow">
                <Image
                    src="/assets/coil.png"
                    alt="Decorative Coil"
                    fill
                    className="object-contain opacity-80"
                />
            </div>
            <div className="absolute right-4 bottom-1/4 hidden h-56 w-56 md:block animate-float-delayed">
                <Image
                    src="/assets/star.png"
                    alt="Decorative Star"
                    fill
                    className="object-contain opacity-80"
                />
            </div>

            <div className="relative w-full max-w-5xl">
                {/* Header Text - Outside Card */}
                <div className="mb-8 flex items-end justify-between px-4">
                    <h2 className="text-xl font-bold text-blue-600 md:text-2xl">
                        Please continue to finalize registration
                    </h2>
                    <span className="text-sm italic text-gray-500">Phase three</span>
                </div>

                {/* Main Card */}
                <div className="relative w-full overflow-hidden rounded-3xl bg-white p-12 shadow-2xl">
                    <button
                        onClick={() => router.back()}
                        className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <h1 className="mb-6 text-6xl font-bold tracking-tight text-gray-900">
                            <span className="text-blue-600">Prop</span>Sol
                        </h1>

                        <p className="mb-4 text-xl text-gray-800">
                            Account Passed Successfully
                        </p>

                        <Link
                            href="/dashboard"
                            className="mb-16 text-lg font-bold text-blue-600 underline decoration-2 underline-offset-4 hover:text-blue-700"
                        >
                            Track Progress
                        </Link>

                        <div className="relative flex items-center justify-center">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl shadow-blue-200">
                                <Check className="h-14 w-14 stroke-[3]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
