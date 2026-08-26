// @ts-nocheck
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Shield, 
  Gift, 
  Users, 
  Star 
} from 'lucide-react';

interface HeroProps {
  onOpenPartnershipModal?: () => void;
}

export default function Hero({ onOpenPartnershipModal }: HeroProps) {
  return (
    <section className="relative bg-white pt-10 sm:pt-14 pb-5 sm:pb-6 overflow-hidden border-b border-slate-100">
      
      {/* ================= DESKTOP BACKGROUND: DARK CANVAS WITH SINGLE THIN BLUE BORDER LINE (lg:block) ================= */}
      <div className="hidden lg:block absolute top-0 right-0 w-[58%] h-full pointer-events-none overflow-hidden select-none z-0">
        <svg 
          className="w-full h-full object-cover" 
          viewBox="0 0 1000 700" 
          preserveAspectRatio="none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="thinGlowDesk" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="slashGradDesk" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* 1. Dark Navy Right Canvas */}
          <polygon points="460,0 1000,0 1000,700 340,700" fill="#060919" />

          {/* 2. Single Thin Crisp Electric Blue Border Line (Separating White & Dark Navy) */}
          <line 
            x1="460" y1="0" 
            x2="340" y2="700" 
            stroke="#2563eb" 
            strokeWidth="2" 
            filter="url(#thinGlowDesk)" 
          />

          {/* 3. Bottom Right Electric Blue Slash Line */}
          <line 
            x1="620" y1="700" 
            x2="1000" y2="440" 
            stroke="url(#slashGradDesk)" 
            strokeWidth="1.8" 
            filter="url(#thinGlowDesk)" 
          />

          {/* 4. Soft Faint Candlestick Silhouettes */}
          <g opacity="0.08">
            <rect x="720" y="240" width="10" height="90" fill="#3b82f6" rx="1" />
            <line x1="725" y1="220" x2="725" y2="350" stroke="#3b82f6" strokeWidth="1" />

            <rect x="780" y="160" width="12" height="130" fill="#60a5fa" rx="1" />
            <line x1="786" y1="130" x2="786" y2="310" stroke="#60a5fa" strokeWidth="1" />

            <rect x="850" y="210" width="10" height="100" fill="#2563eb" rx="1" />
            <line x1="855" y1="190" x2="855" y2="330" stroke="#2563eb" strokeWidth="1" />

            <rect x="910" y="110" width="14" height="160" fill="#3b82f6" rx="1" />
            <line x1="917" y1="80" x2="917" y2="290" stroke="#3b82f6" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* ================= MOBILE BACKGROUND: SLANTED SINGLE THIN BLUE BORDER TRANSITION (lg:hidden) ================= */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-[52%] pointer-events-none z-0">
        <svg 
          className="w-full h-full object-cover" 
          viewBox="0 0 1000 600" 
          preserveAspectRatio="none" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="mobThinGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dark Navy Mobile Container */}
          <polygon points="0,50 1000,100 1000,600 0,600" fill="#060919" />

          {/* Single Thin Slanted Electric Blue Border Line */}
          <line 
            x1="0" y1="50" 
            x2="1000" y2="100" 
            stroke="#2563eb" 
            strokeWidth="2" 
            filter="url(#mobThinGlow)" 
          />
        </svg>
      </div>

      <div className="container mx-auto px-2.5 sm:px-4 lg:px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center mb-5 sm:mb-6">
          
          {/* Left Text Content Area */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-4 text-center lg:text-left pt-1 sm:pt-2">
            
            {/* Top Social Proof Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-4 w-4 sm:h-6 sm:w-6 rounded-full ring-2 ring-white bg-blue-600 text-white font-bold text-[8px] sm:text-[10px] flex items-center justify-center">JD</div>
                <div className="inline-block h-4 w-4 sm:h-6 sm:w-6 rounded-full ring-2 ring-white bg-indigo-600 text-white font-bold text-[8px] sm:text-[10px] flex items-center justify-center">MK</div>
                <div className="inline-block h-4 w-4 sm:h-6 sm:w-6 rounded-full ring-2 ring-white bg-emerald-600 text-white font-bold text-[8px] sm:text-[10px] flex items-center justify-center">AS</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold uppercase text-[9px] sm:text-[11px] tracking-wider text-slate-800">TRUSTED BY 1,000+ TRADERS</span>
                <span className="text-amber-500 font-bold text-[10px] sm:text-xs">⭐⭐⭐⭐⭐ 5.0</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 leading-[1.15] tracking-tight">
              We Pass Your Prop Firm Challenge -<br />
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Or You Get a Full Refund + $100 Compensation
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Accounts are managed in a manner fully compliant with prop firm rules, with limited monthly slots available.
            </p>

            {/* Prop Firm Badges - SINGLE HORIZONTAL LINE ON ALL MOBILE SCREENS (NO SCROLLBAR) */}
            <div className="flex items-center justify-center lg:justify-start gap-1.5 sm:gap-3 py-0.5">
              <div className="px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-800 shrink-0">
                <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded bg-blue-600 text-white text-[8px] sm:text-[10px] font-black flex items-center justify-center">FN</span>
                <span>FundedNext</span>
              </div>
              <div className="px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-800 shrink-0">
                <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 rounded bg-cyan-600 text-white text-[8px] sm:text-[10px] font-black flex items-center justify-center">P</span>
                <span>FundingPips</span>
              </div>
              <div className="px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-800 shrink-0">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-600 rotate-45 flex items-center justify-center shrink-0" />
                <span className="font-extrabold tracking-wider">FTMO</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenPartnershipModal}
                className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 text-xs sm:text-sm group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                href="/pricing"
                className="w-full sm:w-auto px-7 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-full transition-all shadow-sm text-center text-xs sm:text-sm"
              >
                View Pricing
              </Link>
            </div>

            {/* Micro-Trust Points */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-5 pt-1 text-[10px] sm:text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                <span>100% Rule Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                <span>Limited Monthly Slots</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                <span>Performance You Can Trust</span>
              </div>
            </div>

          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-6 relative flex items-center justify-center pt-2 lg:pt-0 z-10">
            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl">
              
              <Image 
                src="/assets/money_laptop1.png"
                alt="PropSol Trading Laptop Dashboard with Money Stacks"
                width={800}
                height={650}
                priority
                unoptimized
                className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] relative z-10 hover:scale-[1.02] transition-transform duration-300"
              />

            </div>
          </div>

        </div>

        {/* ================= DARK TRUST STATS BAR (100% SINGLE HORIZONTAL LINE ON ALL MOBILE SCREENS) ================= */}
        <div className="rounded-xl sm:rounded-3xl bg-[#060919] border border-blue-900/50 p-2.5 sm:p-5 text-white shadow-2xl relative overflow-hidden z-20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="grid grid-cols-4 gap-1 sm:gap-4 relative z-10 items-center">
            
            {/* Item 1 */}
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
                <Shield className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xl font-black text-white leading-tight">100%</div>
                <div className="text-[8px] sm:text-xs text-slate-400 font-medium truncate leading-none">Refund</div>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0">
                <Gift className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xl font-black text-white leading-tight">+$100</div>
                <div className="text-[8px] sm:text-xs text-slate-400 font-medium truncate leading-none">Bonus</div>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                <Users className="w-3 h-3 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xl font-black text-white leading-tight">1k+</div>
                <div className="text-[8px] sm:text-xs text-slate-400 font-medium truncate leading-none">Traders</div>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center gap-1 sm:gap-3">
              <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-md sm:rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Star className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-400 fill-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xl font-black text-white leading-tight">Top</div>
                <div className="text-[8px] sm:text-xs text-slate-400 font-medium truncate leading-none">Rated</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
