// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trophy, 
  ShieldCheck, 
  TrendingUp, 
  Eye, 
  Shield, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  FileText,
  Camera,
  ShoppingCart,
  UserCheck,
  BarChart3,
  Play,
  MessageSquare,
  Send,
  Youtube,
  Twitter,
  Instagram,
  Check,
  Rocket
} from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StartPartnershipModal from "@/components/partnership/StartPartnershipModal";

export default function PartnershipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultAccountType, setDefaultAccountType] = useState<'challenge' | 'instant' | null>(null);

  const openModal = (type?: 'challenge' | 'instant') => {
    setDefaultAccountType(type || null);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#070c1e] text-slate-900 selection:bg-blue-600 selection:text-white font-sans">
      
      {/* Navigation Header */}
      <Header onOpenPartnershipModal={() => openModal()} />

      {/* ================= HERO SECTION (LIGHT-TO-DEEP ROYAL BLUE GRADIENT) ================= */}
      <section className="relative pt-24 pb-8 sm:pt-28 md:pt-36 sm:pb-20 md:pb-24 bg-gradient-to-b lg:bg-gradient-to-r from-white via-[#ffffff] via-[65%] lg:via-[15%] to-[#06164a] text-slate-900 overflow-hidden border-b border-slate-200/80">
        
        {/* Rich Deep Royal Blue Backdrop Overlay - Smoothly blends from transparent on left to deep navy on right */}
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-[#06184c]/10 via-[95%] to-[#050d2c]/10 pointer-events-none z-0" />

        {/* Deep Glowing Bloom behind trading chart visual */}
        <div className="absolute bottom-4 lg:top-1/2 right-0 lg:-translate-y-1/2 w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/35 to-indigo-900/60 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none z-0" />

        {/* Trading chart background visual & glowing neon signs on the right side */}
        <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full pointer-events-none overflow-hidden select-none z-0 [mask-image:linear-gradient(to_bottom,black_0%,black_100%)] lg:[mask-image:linear-gradient(to_right,transparent_0%,black_35%,black_100%)]">

          {/* Subtle Grid backdrop */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(192, 236, 255, 1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(192, 236, 255, 1)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_75%_50%,#000_80%,transparent_100%)]" />

          {/* Dynamic Trading Chart Line & Candlesticks SVG */}
          <svg className="absolute top-0 right-0 w-full h-full opacity-70 mix-blend-screen" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#023dc7ff" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#2a3acfff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#456ac3ff" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="lineGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2a3acfff" />
                <stop offset="60%" stopColor="#456ac3ff" />
                <stop offset="100%" stopColor="#5f7fd9ff" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Candlesticks in background */}
            <g opacity="0.45">
              {/* Bullish/Cyan candles */}
              <rect x="520" y="380" width="10" height="90" fill="#22c55e" rx="2" />
              <line x1="525" y1="360" x2="525" y2="490" stroke="#22c55e" strokeWidth="2" />

              <rect x="610" y="290" width="12" height="120" fill="#38bdf8" rx="2" />
              <line x1="616" y1="260" x2="616" y2="430" stroke="#38bdf8" strokeWidth="2" />

              <rect x="700" y="220" width="14" height="150" fill="#38bdf8" rx="2" />
              <line x1="707" y1="180" x2="707" y2="390" stroke="#38bdf8" strokeWidth="2" />

              <rect x="790" y="160" width="12" height="130" fill="#22c55e" rx="2" />
              <line x1="796" y1="130" x2="796" y2="310" stroke="#22c55e" strokeWidth="2" />

              <rect x="880" y="90" width="16" height="180" fill="#38bdf8" rx="2" />
              <line x1="888" y1="60" x2="888" y2="290" stroke="#38bdf8" strokeWidth="2" />
            </g>

            {/* Area Fill beneath chart line */}
            <path
              d="M 400 650 L 450 560 L 520 500 L 580 520 L 650 380 L 720 320 L 790 350 L 860 180 L 940 120 L 1000 80 L 1000 700 L 400 700 Z"
              fill="url(#chartGradient)"
            />

            {/* Main Rising Trend Line */}
            <path
              d="M 400 650 L 450 560 L 520 500 L 580 520 L 650 380 L 720 320 L 790 350 L 860 180 L 940 120 L 1000 80"
              stroke="url(#lineGlow)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {/* Glowing Nodes on Trend Line */}
            <circle cx="520" cy="500" r="6" fill="#385ef8ff" className="animate-pulse" />
            <circle cx="650" cy="380" r="7" fill="#6084faff" className="animate-pulse" />
            <circle cx="720" cy="320" r="6" fill="#3882f8ff" className="animate-pulse" />
            <circle cx="860" cy="180" r="8" fill="#b593fdff" className="animate-pulse" />
            <circle cx="940" cy="120" r="9" fill="#00f0ff" filter="url(#glow)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          
          {/* Top Pill Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600 text-white text-[11px] sm:text-xs font-extrabold uppercase tracking-wider shadow-md shadow-blue-600/20">
              PROPSOL PARTNERSHIP
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#09122e] border border-cyan-500/40 text-[9px] xs:text-[10px] sm:text-xs font-semibold text-white shadow-lg min-w-0">
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-[10px] sm:text-xs shrink-0">
                  ⚡
                </div>
                <span className="truncate"><strong className="text-cyan-400 font-extrabold">CHALLENGE</strong> <span className="text-slate-300">ACCOUNT</span></span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#09122e] border border-amber-500/40 text-[9px] xs:text-[10px] sm:text-xs font-semibold text-white shadow-lg min-w-0">
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-[10px] sm:text-xs shrink-0">
                  🛡️
                </div>
                <span className="truncate"><strong className="text-amber-400 font-extrabold">INSTANT</strong> <span className="text-slate-300">FUNDED</span></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-3.5 lg:space-y-6 text-left">
              <div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-[1.15] tracking-tight">
                  We Pass Your Challenge.<br/>
                  We Do the Trading.<br/>
                  <span className="text-blue-600">We Share the Profits.</span>
                </h1>
              </div>

              <div className="space-y-2 sm:space-y-3 max-w-lg">
                <div className="flex items-center gap-2.5 sm:gap-3 text-slate-800 text-xs sm:text-sm font-bold">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Bring your challenge or instant funded account.</span>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 text-slate-800 text-xs sm:text-sm font-bold">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>We'll handle all of the trading.</span>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 text-slate-800 text-xs sm:text-sm font-bold">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>You monitor in real time. We share profits.</span>
                </div>
              </div>

              {/* Value proposition badges - Fits perfectly in 1 horizontal line without scroll on mobile */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 py-1">
                <div className="p-1.5 sm:p-3 rounded-lg sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-1.5 sm:gap-3 min-w-0">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <div className="text-left min-w-0 overflow-hidden">
                    <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-extrabold text-slate-900 leading-tight truncate">No Upfront</div>
                    <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-slate-500 leading-tight truncate">Fees to PropSol</div>
                  </div>
                </div>

                <div className="p-1.5 sm:p-3 rounded-lg sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-1.5 sm:gap-3 min-w-0">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="text-left min-w-0 overflow-hidden">
                    <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-extrabold text-slate-900 leading-tight truncate">Read-Only</div>
                    <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-slate-500 leading-tight truncate">Access for You</div>
                  </div>
                </div>

                <div className="p-1.5 sm:p-3 rounded-lg sm:rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-1.5 sm:gap-3 min-w-0">
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  </div>
                  <div className="text-left min-w-0 overflow-hidden">
                    <div className="text-[9px] xs:text-[10px] sm:text-[11px] font-extrabold text-slate-900 leading-tight truncate">We Only Earn</div>
                    <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-slate-500 leading-tight truncate">When You Earn</div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 pt-1">
                <button
                  onClick={() => openModal()}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 group text-sm"
                >
                  <span>Start Partnership</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                <a
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl transition-all text-center text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-4 h-4 fill-slate-900 text-slate-900" />
                  <span>How It Works</span>
                </a>
              </div>

              {/* Sub features bullet line */}
              <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 sm:gap-y-2 text-[10px] sm:text-[11px] text-slate-800 pt-0.5 font-bold">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                  <span>Approved Prop Firms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                  <span>Transparent Profit Sharing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                  <span>Read-Only Investor Access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                  <span>Performance-Based</span>
                </div>
              </div>

            </div>

            {/* Right Display Image Visual - Directly Overlaid on Hero Section */}
            <div className="lg:col-span-6 relative flex items-center justify-center pt-1 lg:pt-0">
              <div className="relative w-[105%] -mx-[2.5%] sm:w-full sm:mx-0 max-w-lg lg:max-w-xl flex justify-center lg:justify-end lg:translate-x-6 xl:translate-x-10">
                <Image 
                  src="/assets/money_laptop.png"
                  alt="PropSol Trading Laptop, Cash Stacks and Smartphone Dashboard"
                  width={1050}
                  height={820}
                  priority
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative z-10 scale-105 sm:scale-100 lg:scale-115 xl:scale-125 transform transition-transform origin-center lg:origin-right"
                />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* ================= OUR PARTNERSHIP MODEL (LIGHT SECTION) ================= */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">OUR PARTNERSHIP MODEL</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              A Better Way to Grow Funded Accounts Together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-bold">
                $
              </div>
              <h3 className="text-base font-extrabold text-slate-900">No Upfront Payment</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                There's no passing fee to PropSol. Our compensation comes from profits only.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Aligned Success</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our results depend on your account's performance. We win when you win.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Full Transparency</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You get MT5 investor access and monitor everything without interfering.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Professional Management</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                From challenge phase to live account, we manage the trading with discipline and strategy.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= HOW IT WORKS (DARK NAVY SECTION) ================= */}
      <section id="how-it-works" className="py-20 bg-[#060b1c] text-white border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <div className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">HOW PROPSOL PARTNERSHIP WORKS</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Step-by-Step Process
            </h2>
          </div>

          {/* 6 Step Horizontal Nodes */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10 text-center">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 relative">
                <FileText className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">01</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">1. Select Your Account</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  You select a challenge account or an instant funded account from the list of approved prop firms.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 relative">
                <Camera className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center">02</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">2. Make Deposit</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  You make deposit of the cost of either the challenge account or instant funded account so that we can purchase it.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-400 relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-purple-500 text-white font-bold text-[10px] flex items-center justify-center">03</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">3. Purchase the Account</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We purchase the account on your behalf from the approved prop firm.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center text-blue-300 relative">
                <UserCheck className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">04</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">4. Share Account Details</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  We share the account details (investor login & password) so you can monitor in real time.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 relative">
                <BarChart3 className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">05</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">5. We Manage the Account</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  For challenge accounts, we manage until it becomes live. For instant funded accounts, we start managing immediately.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 relative">
                <DollarSign className="w-5 h-5" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">06</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">6. We Share Profits</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  After receiving payout from the prop firm, we share profits according to the agreed profit ratio.
                </p>
              </div>
            </div>

          </div>

          {/* Sub Callout Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-3 text-xs text-emerald-200">
              <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
              <span><strong className="text-white">Challenge Accounts:</strong> We manage the account until it becomes live, then we start sharing profits after receiving payouts.</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/40 flex items-center gap-3 text-xs text-blue-200">
              <Rocket className="w-5 h-5 text-blue-400 shrink-0" />
              <span><strong className="text-white">Instant Funded Accounts:</strong> We start sharing profits immediately after receiving payouts.</span>
            </div>
          </div>

        </div>
      </section>


      {/* ================= PROFIT SPLIT CARDS (LIGHT SECTION) ================= */}
      <section id="profit-split" className="py-20 bg-slate-100 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: CHALLENGE ACCOUNTS */}
            <div className="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-600/30">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-blue-600">CHALLENGE ACCOUNTS</h3>
                    <p className="text-xs text-slate-500 font-medium">We pass your challenge and continue managing the account until it becomes live.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">PROFIT SPLIT</div>
                    <div className="text-2xl font-black text-slate-900">40% Client / 60% PropSol</div>
                    <div className="text-[10px] text-slate-500">Applies to all payouts received after the account is funded and live.</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">WHAT'S INCLUDED</div>
                    <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                        <span>No passing fee to PropSol</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                        <span>We handle the challenge and funded phase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                        <span>Profit split after payouts are received</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <button
                type="button"
                onClick={() => openModal('challenge')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 text-sm group"
              >
                <span>Choose Challenge Accounts</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: INSTANT FUNDED ACCOUNTS */}
            <div className="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-600/30">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-blue-600">INSTANT FUNDED ACCOUNTS</h3>
                    <p className="text-xs text-slate-500 font-medium">We start trading your instant funded account and we share profits immediately.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">PROFIT SPLIT</div>
                    <div className="text-2xl font-black text-slate-900">60% Client / 40% PropSol</div>
                    <div className="text-[10px] text-slate-500">Applies to all payouts received from the prop firm.</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">WHAT'S INCLUDED</div>
                    <div className="space-y-1.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                        <span>No evaluation phase</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                        <span>We start trading right away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                        <span>Profit split after payouts are received</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <button
                type="button"
                onClick={() => openModal('instant')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 text-sm group"
              >
                <span>Choose Instant Funded Accounts</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ================= MONITOR EVERYTHING IN REAL TIME (LIGHT SECTION) ================= */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image Graphic */}
            <div className="lg:col-span-6">
              <Image 
                src="/assets/monitor_phone_dashboard.png"
                alt="Real time MT5 Investor Dashboard Monitor and Mobile Phone View"
                width={650}
                height={480}
                className="w-full h-auto object-contain rounded-2xl drop-shadow-xl"
              />
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">YOUR ACCOUNT. YOUR VIEW.</div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Monitor Everything in Real Time.
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  You'll receive MT5 Investor Access (read-only) to monitor the account 24/7.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-800 font-bold">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Open Positions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Equity & Margin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Closed Trades</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Trading History</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Account Balance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 stroke-[3]" />
                  <span>Overall Performance</span>
                </div>
              </div>

              {/* Read Only Info Box */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Investor access is read-only.</h4>
                  <p className="text-[11px] text-slate-600">
                    You can view everything, but cannot open or close trades.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ================= REPUTABLE PROP FIRMS (LIGHT SECTION) ================= */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl space-y-10">
          
          <div className="space-y-1">
            <div className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">TRUSTED. VERIFIED. APPROVED.</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              We Work Only With Reputable Prop Firms
            </h2>
            <p className="text-xs text-slate-500">
              We partner with selected firms that meet our standards for fair rules, strong trading conditions, and reliable payout history.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Logos white box */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
              
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 border-2 border-blue-600 rotate-45 flex items-center justify-center" />
                <span className="font-bold text-slate-900 text-base tracking-widest">FTMO</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-purple-600 font-bold text-lg">⇄</span>
                <span className="font-bold text-purple-900 text-sm">FundedNext</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                  iP
                </div>
                <span className="font-bold text-slate-900 text-xs">FundingPips</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-600 text-sm">The5%ers</span>
              </div>

            </div>

            {/* Right Shield Card */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-blue-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                We carefully evaluate every firm to protect our partners and ensure a high probability of successful payouts.
              </p>
            </div>

          </div>

          {/* 4 Green checkmark tags */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              <span>Fair Trading Conditions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              <span>Clear Rules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              <span>Reliable Payouts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
              <span>Global Presence</span>
            </div>
          </div>

        </div>
      </section>


      {/* ================= BOTTOM CTA BANNER (DARK NAVY SECTION) ================= */}
      <section className="py-16 bg-[#060b1c] text-white">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div>
            <div className="flex items-center gap-1 text-base font-black text-blue-400 mb-1">
              <span>PropSol</span>
              <span className="text-white text-xs font-bold uppercase tracking-wider ml-1">PARTNERSHIP</span>
            </div>
            <p className="text-xs text-slate-400">We pass. You grow. We succeed together.</p>
          </div>

          <div className="text-center space-y-4">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Ready to Partner With PropSol?</h2>
              <p className="text-xs text-slate-400">We pass your challenge. We trade. We share the profits.<br/>When payouts come in, we win together.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => openModal('challenge')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 text-xs flex items-center gap-2"
              >
                <span>Start Partnership Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/support"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Speak With PropSol</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <Send className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            <Youtube className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          </div>

        </div>

        <div className="container mx-auto px-4 max-w-7xl pt-8 mt-8 border-t border-slate-800 text-center text-[10px] text-slate-500">
          © 2024 PropSol Partnership. All rights reserved.
        </div>
      </section>


      {/* Modal */}
      <StartPartnershipModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultAccountType={defaultAccountType}
      />

    </main>
  );
}
