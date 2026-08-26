// @ts-nocheck
'use client';

import React from 'react';
import { 
  UserPlus, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Shield, 
  Check 
} from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: UserPlus,
    title: "Share Your Account",
    description: "You purchase the challenge and share investor access (read-only)."
  },
  {
    step: 2,
    icon: ShieldCheck,
    title: "We Trade & Manage",
    description: "Our experts trade within all rules with smart risk management."
  },
  {
    step: 3,
    icon: TrendingUp,
    title: "Pass The Challenge",
    description: "We pass the challenge with consistency and discipline."
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: "You Got Funded",
    description: "Once funded, you keep the profits. We continue managing (optional)."
  }
];

export default function PassHowItWorks() {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto" />
        </div>

        {/* 4 Steps Grid with connecting line */}
        <div className="relative">
          {/* Horizontal Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-7 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-slate-200 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, index) => {
              const IconComp = item.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-4">
                  {/* Circle Badge with Step Number */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                      <IconComp className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-blue-900 border-2 border-white text-white font-extrabold text-xs flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 max-w-xs">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Banner Card at Bottom */}
        <div className="p-6 sm:p-8 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 mx-auto md:mx-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                Fully Compliant With All Prop Firm Rules
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                No rule-breaking. No shortcuts. Just proven strategies and discipline.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-bold text-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Profit Targets</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Daily Drawdown</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Max Drawdown</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Trading Rules</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
