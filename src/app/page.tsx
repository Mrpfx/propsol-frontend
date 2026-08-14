// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Handshake, 
  ArrowRight, 
  Check, 
  Shield, 
  Lock, 
  Users, 
  Info,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StartPartnershipModal from "@/components/partnership/StartPartnershipModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#070b19] text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Header onOpenPartnershipModal={() => setIsModalOpen(true)} />

      {/* Main Content Area */}
      <section className="relative pt-32 pb-20 md:pt-36 md:pb-24 overflow-hidden flex-1 flex items-center">
        {/* Decorative charts & glow background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          
          {/* Header text */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Choose <span className="text-blue-500">Your Model</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Select how you want to grow with PropSol. Two powerful models.<br className="hidden sm:inline" /> One goal – your trading success.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* CARD 1: PROPSOL PASS */}
            <div className="p-8 rounded-3xl bg-[#0a122e]/90 border-2 border-blue-600/60 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="space-y-6">
                
                {/* Header Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-1.5">
                    <span>We Pass. You Trade.</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white mb-2">PropSol Pass</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We pass your challenge account for a basic fee, then hand over the <span className="text-blue-400 font-bold">LIVE</span> account with the complete trading system so you can manage it yourself.
                  </p>
                </div>

                {/* Checkpoints */}
                <div className="space-y-3 text-xs text-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>We pass your challenge account for a basic fee</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>You receive the <strong className="text-white">LIVE</strong> funded account</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Full trading system & guidelines included</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>You manage the account and keep 100% of the profits</span>
                  </div>
                </div>

                {/* Guarantee callout box */}
                <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start gap-3 text-xs text-blue-200">
                  <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">If we fail to pass the account:</span><br/>
                    All fees are fully refunded + $100 compensation for your time.
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Link
                  href="/pass"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group text-sm"
                >
                  <span>Choose PropSol Pass</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

            {/* CARD 2: PROPSOL PARTNERSHIP */}
            <div className="p-8 rounded-3xl bg-[#0a122e]/90 border-2 border-emerald-600/60 hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="space-y-6">
                
                {/* Header Icon & Badge */}
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                    <Handshake className="w-8 h-8" />
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <span>We Trade. We Grow Together.</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white mb-2">PropSol Partnership</h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We pass your challenge and manage it for you. You earn consistent profits without the stress.
                  </p>
                </div>

                {/* Checkpoints */}
                <div className="space-y-3 text-xs text-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>You bring your challenge account, we pass it for <strong className="text-emerald-400">FREE</strong> to become a live account and manage it</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>You bring your instant funded account, we manage it for <strong className="text-emerald-400">FREE</strong> and split profit</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>You earn consistent profit without the stress</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Zero upfront cost – we take the risk, you share the reward</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-6">
                <Link
                  href="/partnership"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 group text-sm"
                >
                  <span>Choose PropSol Partnership</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

          </div>

          {/* Bottom Trust Bar */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white text-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-0.5">Trusted & Verified</h3>
                <p className="text-xs text-slate-500">We partner only with top-rated prop firms.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:border-l md:border-slate-200 md:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-0.5">Secure & Transparent</h3>
                <p className="text-xs text-slate-500">100% transparent process with real-time account updates.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:border-l md:border-slate-200 md:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-0.5">Built for Traders</h3>
                <p className="text-xs text-slate-500">Designed by traders, for traders.</p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-10 text-center space-y-2 text-xs text-slate-400">
            <div className="flex items-center justify-center gap-2 font-semibold text-slate-300">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>No hidden fees. No surprises. Just real opportunities.</span>
            </div>
            <p>
              Still not sure which model is right for you? Learn more in our <Link href="/faq" className="text-blue-400 underline hover:text-blue-300">FAQs</Link> or <Link href="/support" className="text-blue-400 underline hover:text-blue-300">contact us</Link>.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <StartPartnershipModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </main>
  );
}
