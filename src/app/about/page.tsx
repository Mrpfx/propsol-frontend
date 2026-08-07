// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">About</h1>
                        <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                            We specialize in helping traders pass their proprietary firm challenges quickly, efficiently, and with zero stress on your end. Our mission is simple: you submit, we pass, or you get fully compensated.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px]">
                            <Image
                                src="/assets/about_hero_logo_v2.png"
                                alt="PropPal Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Left Image Grid */}
                        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-start">
                            <div className="flex gap-4 sm:gap-6 items-center">
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <div className="relative w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-2xl overflow-hidden">
                                        <Image
                                            src="/assets/about_trust_top.jpg"
                                            alt="Team Member"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="relative w-[100px] h-[100px] sm:w-[200px] sm:h-[200px] rounded-2xl overflow-hidden">
                                        <Image
                                            src="/assets/about_trust_bottom.jpg"
                                            alt="Team Member"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="relative w-[130px] h-[180px] sm:w-[270px] sm:h-[340px] rounded-2xl overflow-hidden z-10">
                                        <Image
                                            src="/assets/about_trust_main.jpg"
                                            alt="Team Member"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* Dot Pattern Decoration */}
                                    <div className="absolute -bottom-8 -right-8 flex gap-2 z-0 hidden lg:flex">
                                        <div className="grid grid-cols-10 gap-3">
                                            {[...Array(100)].map((_, i) => (
                                                <div key={i} className="w-1 h-1 bg-blue-600 rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="w-full lg:w-1/2">
                            <span className="text-blue-600 font-semibold mb-2 block">Why Traders Trust Us</span>
                            <h2 className="text-4xl font-bold text-slate-900 mb-8">
                                Fast-track your way to profitability
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>Users submit their prop firm account details and make the payment.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>The system verifies the account and begins the passing process.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>Progress is monitored, and users receive notifications at each stage.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>The account is passed successfully within 30 days.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Refund Policy Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Refund Policy</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>A Full Refund of the Service Fee is provided if the account is not passed within 30 days.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>$100 compensation is awarded to the user for the inconvenience.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>The purchase cost of the prop firm account is refunded as well</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                            <div className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] animate-float-delayed">
                                <Image
                                    src="/assets/coil.png"
                                    alt="Refund Policy"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Additional Services Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                            <div className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] animate-float">
                                <Image
                                    src="/assets/star.png"
                                    alt="Additional Services"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">Additional Services</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>Access to a proprietary live trading system designed for successful traders.</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-700">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mt-2.5 flex-shrink-0" />
                                    <span>Continued support and guidance to enhance trading success after account passing.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-20 container mx-auto px-4">
                <div className="bg-[#1234A6] rounded-[30px] sm:rounded-[40px] px-8 pt-26 pb-8 sm:p-26 lg:p-26 text-center relative overflow-hidden">
                    {/* Background Decorations */}
                    {/* Top Left */}
                    <div className="absolute top-0 left-0 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-[#13C296] rounded-br-[60px] sm:rounded-br-[80px] lg:rounded-br-[100px] z-10" />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 border-[1px] border-[#13C296]/50 rounded-br-[60px] sm:rounded-br-[80px] lg:rounded-br-[100px] z-0" />

                    {/* Bottom Right */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-[#13C296] rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] z-10" />
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-24 h-24 sm:w-40 sm:h-40 lg:w-48 lg:h-48 border-[1px] border-[#13C296]/50 rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px] z-0" />

                    <div className="relative z-20 max-w-3xl mx-auto px-2">
                        <h2 className="text-xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Join the Growing Community of<br className="hidden sm:block" /> Successful Traders
                        </h2>
                        <p className="text-blue-100 text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto">
                            We specialize in helping traders pass their proprietary firm challenges quickly, efficiently, and with zero stress on your end. Our mission is simple: you submit, we pass, or you get fully compensated.
                        </p>
                        <Link
                            href="/get-started"
                            className="inline-block bg-white text-[#1234A6] font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base sm:text-lg"
                        >
                            Join Now
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main >
    );
}
