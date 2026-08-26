// @ts-nocheck
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Brain, 
  DollarSign, 
  BarChart3, 
  RefreshCw, 
  Target, 
  ArrowRight 
} from 'lucide-react';

interface FeaturesProps {
  onOpenPartnershipModal?: () => void;
  ctaHref?: string;
}

const failureReasons = [
  {
    icon: Brain,
    title: "Emotional Overtrading",
    description: "Letting emotions lead to impulsive decisions and costly mistakes.",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
    accentColor: "bg-red-500"
  },
  {
    icon: DollarSign,
    title: "Breaking Daily Drawdown Rules",
    description: "One bad day can violate rules and reset all progress.",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
    accentColor: "bg-amber-500"
  },
  {
    icon: BarChart3,
    title: "Inconsistent Risk Management",
    description: "No clear plan, risking too much or too little randomly.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    accentColor: "bg-blue-500"
  },
  {
    icon: RefreshCw,
    title: "Revenge Trades After Losses",
    description: "Chasing losses leads to bigger losses and blown accounts.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
    accentColor: "bg-emerald-500"
  }
];

export default function Features({ onOpenPartnershipModal, ctaHref }: FeaturesProps) {
  return (
    <section className="py-12 sm:py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-extrabold tracking-widest uppercase">
            WHY CHOOSE PROPSOL
          </div>
          
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            We Don't Promise. We <span className="text-blue-600">Deliver.</span>
          </h2>
          
          <p className="text-xs sm:text-base text-slate-600 font-medium">
            Professionally managed accounts. Consistent results. Long-term growth.
          </p>
        </div>

        {/* Outer White Card Container for Reasons */}
        <div className="bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/80 shadow-xl space-y-8 sm:space-y-10">
          
          <div className="text-center">
            <h3 className="text-lg sm:text-2xl font-bold text-slate-900">
              Why Most Traders Fail Prop Firm Challenge
            </h3>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {failureReasons.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index} 
                  className={`p-5 sm:p-6 rounded-2xl ${item.bgColor} border ${item.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between relative overflow-hidden`}
                >
                  <div className="space-y-3.5">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${item.color}`} />
                    </div>

                    <div className="space-y-1.5">
                      <h4 className={`text-sm sm:text-base font-extrabold ${item.color} leading-tight`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Colored Bottom Accent Bar */}
                  <div className={`w-10 sm:w-12 h-1 ${item.accentColor} rounded-full mt-4 sm:mt-6`} />
                </div>
              );
            })}
          </div>

          {/* Dark Navy CTA Banner (Perfect Mobile & Desktop Responsiveness) */}
          <div className="rounded-2xl bg-[#0a0f29] border border-blue-900/40 p-4 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
            <div className="flex flex-row items-center text-left gap-3.5 sm:gap-4 w-full md:w-auto">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <h4 className="text-sm sm:text-xl font-bold text-white leading-snug">
                  We handle the challenge. You get the funded account.
                </h4>
                <p className="text-[11px] sm:text-sm text-slate-400 font-normal">
                  Sit back while we execute with discipline and precision.
                </p>
              </div>
            </div>

            {ctaHref ? (
              <Link
                href={ctaHref}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap shrink-0 group"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onOpenPartnershipModal}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap shrink-0 group"
              >
                <span>Get Started Today</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
