// @ts-nocheck
"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 transition-all duration-200 hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-4 text-left"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isOpen ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{question}</h3>
                </div>
            </button>
            <div
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
            >
                <div className="overflow-hidden">
                    <p className="text-slate-600 leading-relaxed pl-[56px]">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function FAQPage() {
    const faqs = [
        {
            question: "How long does the account passing process take?",
            answer: "The process takes a maximum of 30 days from the day you submit your prop firm account details and complete your payment. Many accounts are passed in even less time, depending on the firm and market conditions."
        },
        {
            question: "How will I receive my refund?",
            answer: "Refunds are processed directly to your original payment method."
        },
        {
            question: "Can I continue live trading after passing?",
            answer: "Yes, you will gain access to our system for live trading post-passing."
        },
        {
            question: "What happens if my account is not passed within 30 days?",
            answer: "You will receive a full refund of your service fee, $100 as compensation, and a refund for your prop firm account purchase."
        },
        {
            question: "What happens if the firm denies my account access?",
            answer: "The firm's decision will be carefully reviewed, and appropriate steps will be taken to ensure a fair outcome."
        }
    ];

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-4 bg-white">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-6xl font-bold text-slate-900 mb-6">FAQ</h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                            We've answered the most common questions to help you understand how our service works <br className="lg:hidden" /> <span className="font-bold text-slate-900">— from start to finish.</span>
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative w-[200px] h-[200px] lg:w-[400px] lg:h-[400px]">
                            <Image
                                src="/assets/faq_logo.png"
                                alt="FAQ"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ List Section */}
            <section className="py-20 bg-[#FDFDFF] relative overflow-hidden">
                <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-full overflow-hidden pointer-events-none z-0">
                    <Image
                        src="/assets/faq_bg_overlay.png"
                        alt="Background Decoration"
                        fill
                        className="object-cover object-center opacity-100"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3 block">FAQ</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Any Questions? Look Here
                        </h2>
                        <p className="text-slate-600 mt-4">
                            We've answered the most common questions to help you understand how our service works
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 items-start">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <FAQItem question={faqs[0].question} answer={faqs[0].answer} />
                            <FAQItem question={faqs[3].question} answer={faqs[3].answer} />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <FAQItem question={faqs[1].question} answer={faqs[1].answer} />
                            <FAQItem question={faqs[2].question} answer={faqs[2].answer} />
                            <FAQItem question={faqs[4].question} answer={faqs[4].answer} />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
