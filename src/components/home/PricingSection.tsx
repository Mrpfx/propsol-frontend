// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Check, ThumbsUp } from 'lucide-react';
import { api } from '@/lib/api';

const planService = {
  getAllPlans: async () => (await api.get('/plans/')).data
};

const fallbackPlans = [
  {
    id: "guaranteed-step1Only",
    slug: "guaranteed-2-step-step-1",
    name: "2-Step Challenge —",
    subtitle: "Step 1 Pass Only",
    description: "Best for traders who want help clearing the first stage",
    benefits: ["You may continue Step 2 yourself", "Or upgrade later to full completion"],
    is_popular: false,
    prices: [
      { account_size: 50000, price: 800, account_size_display: "$50k Account" },
      { account_size: 100000, price: 1200, account_size_display: "$100k Account" },
      { account_size: 200000, price: 1700, account_size_display: "$200k Account" },
      { account_size: 500000, price: 2500, account_size_display: "$500k Account" }
    ]
  },
  {
    id: "guaranteed-fullTwoStep",
    slug: "guaranteed-2-step-full",
    name: "2-Step Challenge —",
    subtitle: "Full (Step 1 + Step 2)",
    description: "Best for traders who want the entire challenge completed.",
    benefits: ["Optional access to the PropSol Trading System for funded trading support"],
    is_popular: true,
    prices: [
      { account_size: 50000, price: 1100, account_size_display: "$50k Account" },
      { account_size: 100000, price: 1600, account_size_display: "$100k Account" },
      { account_size: 200000, price: 2200, account_size_display: "$200k Account" },
      { account_size: 500000, price: 3200, account_size_display: "$500k Account" }
    ]
  },
  {
    id: "guaranteed-oneStep",
    slug: "guaranteed-1-step-full",
    name: "1-Step Challenge —",
    subtitle: "Full",
    description: "Best for firms with single-phase challenges.",
    benefits: ["Funded account returned to you", "Optional access to the PropSol Trading System"],
    is_popular: false,
    prices: [
      { account_size: 50000, price: 1400, account_size_display: "$50k Account" },
      { account_size: 100000, price: 1900, account_size_display: "$100k Account" },
      { account_size: 200000, price: 2600, account_size_display: "$200k Account" },
      { account_size: 500000, price: 3800, account_size_display: "$500k Account" }
    ]
  },
  {
    id: "standard-step1Only",
    slug: "standard-2-step-step-1",
    name: "2-Step Challenge —",
    subtitle: "Step 1 Pass Only",
    description: "Best for traders who want help clearing the first stage",
    benefits: ["You may continue Step 2 yourself", "Or upgrade later to full completion"],
    is_popular: false,
    prices: [
      { account_size: 50000, price: 490, account_size_display: "$50k Account" },
      { account_size: 100000, price: 690, account_size_display: "$100k Account" },
      { account_size: 200000, price: 990, account_size_display: "$200k Account" },
      { account_size: 500000, price: 1390, account_size_display: "$500k Account" }
    ]
  },
  {
    id: "standard-fullTwoStep",
    slug: "standard-2-step-full",
    name: "2-Step Challenge —",
    subtitle: "Full (Step 1 + Step 2)",
    description: "Best for traders who want the entire challenge completed.",
    benefits: ["Optional access to the PropSol Trading System for funded trading support"],
    is_popular: true,
    prices: [
      { account_size: 50000, price: 690, account_size_display: "$50k Account" },
      { account_size: 100000, price: 890, account_size_display: "$100k Account" },
      { account_size: 200000, price: 1290, account_size_display: "$200k Account" },
      { account_size: 500000, price: 1790, account_size_display: "$500k Account" }
    ]
  },
  {
    id: "standard-oneStep",
    slug: "standard-1-step-full",
    name: "1-Step Challenge —",
    subtitle: "Full",
    description: "Best for firms with single-phase challenges.",
    benefits: ["Funded account returned to you", "Optional access to the PropSol Trading System"],
    is_popular: false,
    prices: [
      { account_size: 50000, price: 1400, account_size_display: "$50k Account" },
      { account_size: 100000, price: 1900, account_size_display: "$100k Account" },
      { account_size: 200000, price: 2600, account_size_display: "$200k Account" },
      { account_size: 500000, price: 3800, account_size_display: "$500k Account" }
    ]
  }
];

function Card({ plan, onOpenPassModal }) {
  const router = useRouter();
  const isPopular = plan.is_popular;
  const bgColor = isPopular ? "bg-[#2D2460]" : "bg-[#E0D4FC]";
  const borderColor = isPopular ? "border border-[#4B3DB7]" : "border-none";
  const titleColor = isPopular ? "text-white" : "text-[#2D2460]";
  const subtitleColor = isPopular ? "text-slate-200" : "text-[#4B3DB7]";
  const descColor = isPopular ? "text-slate-300" : "text-slate-700";
  const headerLabelColor = isPopular ? "text-slate-300" : "text-[#2D2460]";
  const benefitIconColor = isPopular ? "text-slate-300" : "text-[#4B3DB7]";
  const badgeStyle = isPopular ? "bg-white text-[#2D2460]" : "bg-[#4B3DB7] text-white";

  let packageType = plan.slug.startsWith("guaranteed") ? "Guaranteed Pass" : "Standard Pass";
  let href = `/checkout?model=pass&packageType=${encodeURIComponent(packageType)}`;
  let planParams = { model: "pass", packageType };
  if (plan.slug.includes("step-1")) {
    href = `/checkout?model=pass&packageType=${encodeURIComponent(packageType)}&accountType=2-step&scope=step-1`;
    planParams = { ...planParams, accountType: "2-step", scope: "step-1" };
  } else if (plan.slug.includes("2-step-full")) {
    href = `/checkout?model=pass&packageType=${encodeURIComponent(packageType)}&accountType=2-step&scope=full`;
    planParams = { ...planParams, accountType: "2-step", scope: "full" };
  } else if (plan.slug.includes("1-step")) {
    href = `/checkout?model=pass&packageType=${encodeURIComponent(packageType)}&accountType=1-step&scope=full`;
    planParams = { ...planParams, accountType: "1-step", scope: "full" };
  }

  let buttonText = "Select Plan";
  if (plan.slug.includes("step-1")) {
    buttonText = "Select Step 1 Pass";
  } else if (plan.slug.includes("2-step-full")) {
    buttonText = "Select Full 2-Step Completion";
  } else if (plan.slug.includes("1-step")) {
    buttonText = "Select 1-Step Completion";
  }

  const handleSelectPlan = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenPassModal) {
      onOpenPassModal(planParams);
      return;
    }
    const isLoggedIn = typeof window !== 'undefined' && Boolean(localStorage.getItem('access_token'));
    if (isLoggedIn) {
      router.push(href);
    } else {
      toast.error('Please sign in to proceed with PropPass checkout.');
      router.push(`/signin?returnUrl=${encodeURIComponent(href)}`);
    }
  };

  return (
    <div className={`relative flex flex-col rounded-lg overflow-hidden transition-all h-full ${bgColor} ${borderColor}`}>
      {isPopular && (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 bg-[#5B4DC7] text-white text-[10px] font-bold px-3 py-1 rounded-b-lg flex items-center gap-1 shadow-sm uppercase tracking-wider whitespace-nowrap z-20">
          MOST CHOSEN
          <ThumbsUp className="w-3 h-3 fill-white" />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4 mt-2">
          <h3 className={`text-lg font-bold ${titleColor} flex items-center gap-2`}>{plan.name}</h3>
          <p className={`text-sm font-medium ${subtitleColor}`}>{plan.subtitle}</p>
        </div>
        <p className={`text-xs mb-3 leading-relaxed ${descColor}`}>{plan.description}</p>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3 border-b border-slate-500/20 pb-2">
            <p className={`font-bold text-[10px] uppercase tracking-wider ${headerLabelColor}`}>ACCOUNT</p>
            <p className={`font-bold text-[10px] uppercase tracking-wider ${headerLabelColor}`}>PRICING</p>
          </div>
          <div className="space-y-2">
            {plan.prices.map((p, idx) => (
              <div className={`flex justify-between items-center text-xs font-medium ${isPopular ? "text-slate-200" : "text-[#2D2460]"}`} key={idx}>
                <span>{p.account_size_display}</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] min-w-[60px] text-center ${badgeStyle}`}>
                  ${p.price}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className={`font-bold text-xs mb-3 ${titleColor}`}>Benefits</p>
          <div className="space-y-2">
            {plan.benefits.map((b, idx) => (
              <div className={`flex items-start gap-2 text-xs ${descColor}`} key={idx}>
                <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${benefitIconColor}`} />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <button
            type="button"
            onClick={handleSelectPlan}
            className="block w-full text-center py-3 rounded font-bold text-white bg-[#4B3DB7] hover:bg-[#3A2E96] transition-all text-xs shadow-lg shadow-indigo-900/20 cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

interface PricingSectionProps {
  onOpenPassModal?: (params?: any) => void;
}

export default function PricingSection({ onOpenPassModal }: PricingSectionProps) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await planService.getAllPlans();
        if (data && data.length > 0) {
          setPlans(data);
        } else {
          setPlans(fallbackPlans);
        }
      } catch (err) {
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const guaranteed = plans.filter(p => p.slug && p.slug.startsWith("guaranteed-"));
  const standard = plans.filter(p => p.slug && p.slug.startsWith("standard-"));

  if (loading) {
    return <div className="py-20 text-center text-white bg-[#050A24]">Loading pricing plans...</div>;
  }

  return (
    <section id="pricing" className="relative scroll-mt-20">
      <div className="relative py-10 sm:py-16 overflow-hidden bg-[#050A24]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              Choose Your Prop Firm Challenge Type
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Choose between Standard Pass or Guaranteed<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Pass with full refund protection
            </p>
          </div>
          {guaranteed.length > 0 && (
            <div className="mb-12 max-w-6xl mx-auto">
              <div className="relative bg-[#0A1033]/80 border border-slate-700/50 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">Guaranteed Pass</h3>
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Full refund if we don't pass your evaluation
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {guaranteed.map(plan => (
                    <Card plan={plan} key={plan.id} onOpenPassModal={onOpenPassModal} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {standard.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <div className="relative bg-[#0A1033]/80 border border-slate-700/50 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Standard Pass</h3>
                  <p className="text-slate-400 text-sm sm:text-base">
                    Professional evaluation passing service - No Refund Guarantee
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {standard.map(plan => (
                    <Card plan={plan} key={plan.id} onOpenPassModal={onOpenPassModal} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
