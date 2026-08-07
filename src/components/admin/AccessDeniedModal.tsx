// @ts-nocheck
"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Mail } from "lucide-react";

export function AccessDeniedModal() {
    const router = useRouter();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="h-32 bg-gradient-to-br from-red-600 to-rose-700 relative flex items-center justify-center overflow-hidden">
                    <div className="relative z-10 p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                        <ShieldAlert className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                </div>
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        You do not have the required permissions to view this page. Please contact your Super Admin to request access.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push("/admin")}
                            className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Dashboard
                        </button>
                        <a
                            href="mailto:support@propsol.com?subject=Admin Access Request"
                            className="w-full flex items-center justify-center px-4 py-3 bg-white text-slate-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Request Access
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
