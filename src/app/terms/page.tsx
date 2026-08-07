// @ts-nocheck
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white overflow-x-hidden">
            <Header />

            <div className="pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-4">
                {/* Page Title & Intro */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        PropSol provides a specialized service that helps traders pass their proprietary firm account challenges within 30 days. This includes expert trading management, real-time progress tracking, and post-passing support for live trading.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-24 relative">
                    {/* Left Column: Text Content */}
                    <div className="w-full lg:w-1/2 space-y-16 relative z-10">

                        {/* User Responsibilities */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                                User Responsibilities
                            </h2>
                            <p className="text-slate-600 mb-4">By registering for our service, you agree to:</p>
                            <ul className="space-y-3 text-slate-600 list-disc pl-5">
                                <li>Provide accurate and verifiable personal and prop firm account details</li>
                                <li>Upload valid proof of prop firm account purchase</li>
                                <li>Avoid changing login credentials during the process</li>
                                <li>Refrain from interfering with the account passing process in any way</li>
                                <li>Use all post-passing resources responsibly and according to instructions</li>
                            </ul>
                        </section>

                        {/* Our Guarantee */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                                Our Guarantee
                            </h2>
                            <ul className="space-y-3 text-slate-600">
                                <li>A full refund of your service fee</li>
                                <li>$100 compensation</li>
                                <li>A refund of your prop firm account purchase</li>
                                <li>Continued access to our live trading system</li>
                            </ul>
                        </section>

                        {/* Refund Conditions */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                                Refund Conditions
                            </h2>
                            <ul className="space-y-3 text-slate-600">
                                <li>The 30-day period has elapsed without account success</li>
                                <li>All user responsibilities were fulfilled</li>
                                <li>The refund request is submitted within 5 business days of notification</li>
                            </ul>
                        </section>

                        {/* Live Trading System Access */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                                Live Trading System Access
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Users whose accounts are successfully passed will receive access to PropSol's live trading tools, alerts, and mentorship. Misuse or unauthorized sharing of the system may result in revoked access.
                            </p>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                                Data Security
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                PropSol uses secure encryption to protect all personal and account information. Users are responsible for maintaining the confidentiality of their login credentials.
                            </p>
                        </section>

                        {/* Disclaimer */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                                Disclaimer
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                PropSol is an independent service provider and is not affiliated with any proprietary trading firm. We are not liable for decisions made by the firm post-challenge or for user actions after passing.
                            </p>
                        </section>

                        {/* Changes to Terms */}
                        <section>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
                                Changes to Terms
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                These terms may be updated at any time. Continued use of PropSol services implies acceptance of the latest version.
                            </p>
                        </section>
                    </div>

                    {/* Right Column: Decorative Images */}
                    <div className="hidden lg:block w-1/2 relative">
                        <div className="sticky top-0 h-screen flex flex-col justify-center">
                            {/* Coil Image - Centered vertically, shifted up */}
                            <div className="absolute top-1/2 -translate-y-[90%] lg:-right-10 xl:-right-32 lg:w-[370px] lg:h-[370px] xl:w-[630px] xl:h-[630px] animate-float-delayed">
                                <Image
                                    src="/assets/coil_v2.png"
                                    alt="Decorative Coil"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Star Image - Centered vertically, shifted down */}
                            <div className="absolute top-1/2 translate-y-[30%] lg:-right-10 xl:-right-32 lg:w-[370px] lg:h-[370px] xl:w-[630px] xl:h-[630px] animate-float">
                                <Image
                                    src="/assets/star.png"
                                    alt="Decorative Star"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
