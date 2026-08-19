// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import * as LucideIcons from 'lucide-react';
import { api } from '@/lib/api';

const planService = {
  getAllPlans: async () => (await api.get('/plans/')).data
};

const bookingLinkService = {
  getAllBookingLinks: async () => (await api.get('/booking-links/')).data
};

const createProxy = () => new Proxy(LucideIcons, {
  get(target, prop) {
    if (prop === 'default') return Image;
    if (prop === 'Link' || prop === 'link') return Link;
    if (prop === 'planService') return planService;
    if (prop === 'bookingLinkService') return bookingLinkService;
    if (target[prop]) return target[prop];
    return LucideIcons[prop] || LucideIcons.HelpCircle || (() => null);
  }
});

export default function Hero() {
  return (
    <section className="relative bg-[#0a0e27] overflow-visible min-h-[100svh] sm:min-h-[800px] flex items-center pb-5 sm:pb-0 lg:pb-7">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/hero-bg.jpg" alt="Background Pattern" fill priority className="object-cover opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#0a0e27]/95 via-[#0a0e27]/70 to-[#0a0e27]/50 sm:from-[#0a0e27]/90 sm:via-[#0a0e27]/40 sm:to-transparent" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-20 md:pt-32 lg:mt-40">
        <div className="w-full lg:max-w-[80%] mb-4 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">We Pass Your Prop Firm Challenge -</h1>
          <p className="text-lg sm:text-2xl lg:text-[2.6rem] text-[#fbbf24] font-light mb-4 leading-tight">Or You Get a Full Refund + $100 Compensation</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-0">
          <div className="w-full lg:w-[45%] z-30 text-center lg:text-left pt-8">
            <p className="text-slate-200 text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 max-w-xl lg:max-w-lg leading-relaxed font-light mx-auto lg:mx-0">
              Accounts are managed in a manner fully compliant with prop firm rules, with limited monthly slots available.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-6 mb-8 sm:mb-12 opacity-100">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8">
                  <Image src="/assets/funded_next_logo.png" alt="FundedNext" fill className="object-contain brightness-0 invert" />
                </div>
                <span className="font-semibold text-white text-xs sm:text-sm lg:text-base">FundedNext</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8">
                  <Image src="/assets/funding_pips_logo.png" alt="FundingPips" fill className="object-contain brightness-0 invert" />
                </div>
                <span className="font-semibold text-white text-xs sm:text-sm lg:base">FundingPips</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                  <Image src="/assets/ftmo_logo.png" alt="FTMO" fill className="object-contain brightness-0 invert" />
                </div>
                <span className="font-bold text-white text-xs sm:text-sm lg:text-base">FTMO</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full lg:w-auto">
              <Link href="/signup" className="w-full md:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-lg sm:text-lg font-bold text-center text-white bg-[#3b82f6] rounded-md hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/30 whitespace-nowrap">
                Get Started Now
              </Link>
              <Link href="/#pricing" className="w-full md:w-auto px-6 sm:px-8 py-3.5 sm:py-4 text-lg sm:text-lg font-bold text-center text-[#3b82f6] bg-white rounded-md hover:bg-gray-50 transition-all shadow-xl whitespace-nowrap">
                View Pricing
              </Link>
            </div>
          </div>
          <div className="relative w-full lg:w-[85%] z-20 mt-12 lg:-mt-12 lg:-mr-5">
            <div className="w-full scale-100 sm:scale-100 lg:scale-107 origin-top-right pt-20">
              <Image src="/assets/images/hero-laptop.png" alt="Trading Laptop" className="object-contain w-full h-auto" priority width={1000} height={1000} />
            </div>
            <div className="absolute bottom-[-15%] left-[-15%] w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 z-30 animate-float pointer-events-none">
              <Image src="/assets/star.png" alt="Star" fill className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
