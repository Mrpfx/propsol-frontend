"use client";

import Link from "next/link";
import { Plus, Wallet, Headphones } from "lucide-react";
import { User } from "@/services/user.service";

interface DashboardHeroProps {
    user?: User;
}

export function DashboardHero({ user }: DashboardHeroProps) {
    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <div className="w-full bg-blue-50 py-6 md:py-8">
            <div className="container mx-auto flex flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full flex-row flex-nowrap items-center justify-between gap-2 md:w-auto md:justify-start md:gap-6">
                    <div className="flex min-w-0 items-center gap-2 md:gap-4">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm bg-blue-600 flex items-center justify-center md:h-16 md:w-16">
                            <span className="text-sm font-bold text-white md:text-xl">{initials}</span>
                        </div>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-bold text-gray-900 md:text-lg">{user?.name || "Loading..."}</span>
                            <span className="truncate text-[10px] text-gray-500 md:text-sm">{user?.email || "..."}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <Link
                            href="/dashboard/wallet"
                            className="group flex flex-col items-center justify-center gap-1 rounded-xl bg-blue-50 px-2 py-1 transition-all duration-200 hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border border-blue-100 md:px-4 md:py-2"
                        >
                            <div className="rounded-full bg-blue-100 p-1.5 group-hover:bg-blue-200 transition-colors md:p-2">
                                <Wallet className="h-4 w-4 text-blue-600 md:h-6 md:w-6" />
                            </div>
                            <span className="text-[10px] font-bold text-blue-700 md:text-xs">Wallet</span>
                        </Link>

                        <Link
                            href="/dashboard/support"
                            className="group flex flex-col items-center justify-center gap-1 rounded-xl bg-red-50 px-2 py-1 transition-all duration-200 hover:bg-red-100 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 border border-red-100 md:px-4 md:py-2"
                            title="Support"
                        >
                            <div className="rounded-full bg-red-100 p-1.5 group-hover:bg-red-200 transition-colors md:p-2">
                                <Headphones className="h-4 w-4 text-red-600 md:h-6 md:w-6" />
                            </div>
                            <span className="text-[10px] font-bold text-red-700 md:text-xs">Support</span>
                        </Link>
                    </div>
                </div>

                <Link href="/checkout" className="w-full md:w-auto">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-md md:w-auto md:px-6 md:py-3">
                        <span>Pass New Account</span>
                        <Plus className="h-4 w-4" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
