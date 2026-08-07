// @ts-nocheck
'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const items = [
  { title: "Guarantee Safety", description: "All accounts are managed strictly within prop firm rules." },
  { title: "Fully Rule Compliant Trading", description: "Daily loss, max. drawdown, and consistency rules fully respected." },
  { title: "Timely Completion", description: "Passes are completed within 30—60 trading days, minimizing risk." },
  { title: "Zero-Risk Guarantee", description: "If we fail to pass your challenge:\nYou get a full refund of the service fee\nYour challenge fee is refunded\nYou receive $100 compensation for time wasted" }
];

export default function Process() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-[#e0eaf8]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          <div className="flex-1 w-full lg:max-w-[45%]">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-6 sm:mb-8 text-center lg:text-left">
              What PropSol Actually Does
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {items.map((item, index) => (
                <div className="flex items-start gap-2 sm:gap-3" key={index}>
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 fill-blue-500" strokeWidth={0} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-0.5 sm:mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full lg:max-w-[55%] order-first lg:order-last">
            <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/12]">
              <Image
                src="/assets/images/what-propsol-does.png"
                alt="PropSol Trading Dashboard on Monitor and Phone"
                fill
                className="object-contain object-center lg:object-right-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
