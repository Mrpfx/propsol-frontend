// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, MapPin, Loader2, CheckCircle } from "lucide-react";
import { supportMessageService } from "@/services/support-ticket.service";
import { toast } from "react-hot-toast";

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            toast.error("Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            await supportMessageService.createMessage(formData);
            setSubmitted(true);
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Failed to send support message:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-0 md:pt-40 lg:pt-48 lg:pb-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden h-auto lg:h-[800px]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                    <div className="absolute bottom-[25%] -right-[5%] w-[25%] h-[50px] -rotate-[8deg] z-0">
                        <div className="w-full h-full bg-purple-100/80" />
                    </div>
                    <div className="absolute bottom-[15%] -right-[5%] w-[30%] h-[60px] -rotate-[8deg] z-0">
                        <div className="w-full h-full bg-purple-200/80" />
                    </div>
                    <div className="absolute bottom-[5%] -right-[5%] w-[25%] h-[50px] -rotate-[8deg] z-0">
                        <div className="w-full h-full bg-cyan-200/80" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-[20%] h-[60px] -rotate-[3deg] origin-bottom-left z-0 translate-y-4">
                        <div className="w-full h-full bg-cyan-200/60" />
                    </div>
                </div>

                <div className="container mx-auto px-4 relative z-10 h-full">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 h-full">
                        <div className="w-full lg:w-1/2 pb-20 lg:pb-32 lg:text-left">
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                                Support &amp; Contact
                            </h1>
                            <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl lg:mx-0">
                                Have questions or need help with your account? Our team is here for you — before, during, and after your account-passing journey.
                            </p>
                        </div>

                        <div className="w-full lg:w-1/2 h-auto lg:h-full relative flex items-end justify-center lg:justify-end">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/40 rounded-full blur-3xl -z-10" />
                            <Image
                                src="/assets/support_hero_image_b.png"
                                alt="Support Team"
                                width={800}
                                height={800}
                                className="relative z-10 object-contain object-bottom"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & Form Section */}
            <section className="py-20 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-bl-[100px] -z-10 hidden lg:block" />
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Info Left */}
                        <div className="w-full lg:w-5/12 pt-10 text-center lg:text-left">
                            <span className="text-blue-600 font-semibold mb-2 block">
                                Contact Us
                            </span>
                            <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-8">
                                Get In Touch With Us
                            </h2>

                            <div className="space-y-8 flex flex-col items-center md:items-start">
                                <div className="hidden lg:flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
                                        <p className="text-slate-600 text-sm mb-2">
                                            Our support specialists are ready to assist you with any inquiry.
                                        </p>
                                        <p className="text-slate-600 text-sm">
                                            <span className="font-medium">Email:</span> Hello@propfirmsol.com
                                        </p>
                                        <p className="text-slate-600 text-sm mt-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-red-500" />
                                            Response Time: Within 12-24 hours on business days.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-900 mb-1">Email Address</h3>
                                        <p className="text-slate-600 text-sm">
                                            Hello@propfirmsol.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <a
                                        href="https://calendly.com/hello-propfirmsol/30min"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-[#fbbf24] text-slate-900 font-bold rounded-lg hover:bg-[#f59e0b] transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 transform hover:-translate-y-0.5"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-slate-900/10 flex items-center justify-center text-sm">
                                            <span>🗓️</span>
                                        </div>
                                        Book a Call
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Form Right */}
                        <div className="w-full lg:w-7/12 relative lg:pr-10">
                            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-slate-100 relative z-10">
                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                        <p className="text-slate-600 mb-6">
                                            Thank you for reaching out. We'll get back to you within 12-24 hours.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your Name"
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Your Email"
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Your Phone"
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="Your Message"
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400 resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Message"
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
