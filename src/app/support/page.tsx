// @ts-nocheck
"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react";
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supportMessageService.createMessage(formData);
            toast.success("Message sent successfully!");
            setSubmitted(true);
            setFormData({ name: "", email: "", phone: "", message: "" });
        } catch (error) {
            console.error("Failed to send support message:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                        {/* Left Info */}
                        <div className="w-full lg:w-5/12 text-center lg:text-left space-y-8">
                            <div>
                                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                                    CONTACT US
                                </span>
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                                    Feel Free To Get In Touch With Us
                                </h1>
                            </div>

                            <p className="text-slate-600 text-base leading-relaxed">
                                Have questions about our prop firm pass services or trading solutions? Send us a message and our support team will respond promptly.
                            </p>

                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <MapPin className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-900 mb-1">Office Location</h3>
                                        <p className="text-slate-600 text-sm">
                                            Grand Emerald Tower, Suite 1204, F. Ortigas Jr. Road, Ortigas Center, Pasig City, Metro Manila 1605
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-600">
                                        <Phone className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-900 mb-1">Phone Number</h3>
                                        <p className="text-slate-600 text-sm">
                                            (+62)81 414 257 9980
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
                            </div>
                        </div>

                        {/* Right Form */}
                        <div className="w-full lg:w-7/12 relative lg:pr-10">
                            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-slate-100 relative z-10">
                                {submitted ? (
                                    <div className="text-center py-8 space-y-4">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                                        <p className="text-slate-600">
                                            Thank you for contacting us. Our team will review your message and get back to you shortly.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                required
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Your Phone (Optional)"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <textarea
                                                rows={4}
                                                required
                                                placeholder="Your Message"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full px-6 py-4 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-600 placeholder:text-slate-400 resize-none text-sm"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 text-sm"
                                        >
                                            {loading ? "Sending Message..." : "Send Message"}
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
