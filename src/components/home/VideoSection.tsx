// @ts-nocheck
'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export default function VideoSection() {
  return (
    <section className="relative pt-24 sm:pt-40 pb-16 sm:pb-24 bg-[#0a0e27] overflow-hidden mt-[-1px]">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] sm:h-[100px]">
          <path d="M0,0 L1200,0 L1200,20 C1200,20 900,100 600,100 C300,100 0,20 0,20 Z" className="fill-[#e0eaf8]" />
        </svg>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' viewBox='0 0 1000 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C!-- Candlesticks --%3E%3Cg transform='translate(0, 200)'%3E%3C!-- Green Candles --%3E%3Crect x='50' y='-50' width='8' height='80' fill='%2310b981' opacity='0.6'/%3E%3Cline x1='54' y1='-70' x2='54' y2='50' stroke='%2310b981' stroke-width='1' opacity='0.6'/%3E%3Crect x='100' y='-20' width='8' height='40' fill='%2310b981' opacity='0.6'/%3E%3Cline x1='104' y1='-40' x2='104' y2='30' stroke='%2310b981' stroke-width='1' opacity='0.6'/%3E%3Crect x='150' y='-80' width='8' height='120' fill='%2310b981' opacity='0.6'/%3E%3Cline x1='154' y1='-100' x2='154' y2='60' stroke='%2310b981' stroke-width='1' opacity='0.6'/%3E%3C!-- Red Candles --%3E%3Crect x='200' y='0' width='8' height='60' fill='%23ef4444' opacity='0.6'/%3E%3Cline x1='204' y1='-20' x2='204' y2='80' stroke='%23ef4444' stroke-width='1' opacity='0.6'/%3E%3Crect x='250' y='40' width='8' height='40' fill='%23ef4444' opacity='0.6'/%3E%3Cline x1='254' y1='20' x2='254' y2='100' stroke='%23ef4444' stroke-width='1' opacity='0.6'/%3E%3C!-- More Green --%3E%3Crect x='300' y='-40' width='8' height='90' fill='%2310b981' opacity='0.6'/%3E%3Cline x1='304' y1='-60' x2='304' y2='70' stroke='%2310b981' stroke-width='1' opacity='0.6'/%3E%3Crect x='350' y='-100' width='8' height='150' fill='%2310b981' opacity='0.6'/%3E%3Cline x1='354' y1='-120' x2='354' y2='70' stroke='%2310b981' stroke-width='1' opacity='0.6'/%3E%3C!-- Trend Line --%3E%3Cpath d='M54,230 L104,220 L154,160 L204,260 L254,300 L304,210 L354,150 L450,50 L550,150 L650,100 L750,200 L850,50 L950,150' fill='none' stroke='%2338bdf8' stroke-width='2' stroke-opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom center",
            backgroundSize: "cover"
          }}
        />
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Verified Funded Accounts
            <span className="text-slate-400 font-normal text-base sm:text-2xl md:text-3xl block mt-2">
              Proof of Execution, Not Promises
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12">
          <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/assets/certificate_ftmo.jpg"
                alt="FTMO Certificate"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/assets/certificate_funded_next.png"
                alt="FundedNext Certificate"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/assets/certificate_funding_pips.png"
                alt="FundingPips Certificate"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-start sm:items-center justify-center gap-2 text-center text-slate-400 text-xs sm:text-sm max-w-3xl mx-auto px-2">
          <Sparkles className="w-4 h-4 text-slate-500 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            Certificates shown represent previously completed challenges. Demonstrates proof of capability, not guarantee of future outcome.
          </p>
        </div>
      </div>
    </section>
  );
}
