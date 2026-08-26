// @ts-nocheck
'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const guarantees = [
  {
    title: "Guarantee Safety",
    description: "All accounts are managed strictly within prop firm rules."
  },
  {
    title: "Fully Rule Compliant Trading",
    description: "Daily loss, max. drawdown, and consistency rules fully respected."
  },
  {
    title: "Timely Completion",
    description: "Passes are completed within 30–60 trading days, minimizing risk."
  },
  {
    title: "Zero-Risk Guarantee",
    description: "If we fail to pass your challenge:\n• You get a full refund of the service fee\n• Your challenge fee is refunded\n• You receive $100 compensation for time wasted"
  }
];

export default function Process() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-[#edf4fc]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Guarantees */}
          <div className="lg:col-span-6 space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-center lg:text-left">
              What PropSol Actually Does
            </h2>

            <div className="space-y-6">
              {guarantees.map((item, index) => (
                <div className="flex items-start gap-3.5" key={index}>
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Workstation Graphic */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              <Image
                src="/assets/monitor_phone_dashboard.png"
                alt="PropSol Ultra-Wide Trading Workstation Desk Setup with Phone"
                width={800}
                height={550}
                className="w-full h-auto object-contain rounded-2xl drop-shadow-xl hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
