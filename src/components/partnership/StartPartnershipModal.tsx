// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Trophy, 
  ShieldCheck, 
  Building2, 
  Wallet, 
  DollarSign, 
  Info, 
  Star, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  Handshake
} from 'lucide-react';

interface StartPartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAccountType?: 'challenge' | 'instant';
}

const PROP_FIRMS = [
  { 
    id: 'TenTrade', 
    name: 'TenTrade', 
    badge: 'TenTrade', 
    badgeColor: 'text-amber-500', 
    accent: 'from-amber-500/20 to-orange-500/20',
    svgLogo: (
      <div className="flex items-center gap-1.5 font-black tracking-wider text-white text-base">
        <span>TEN</span>
        <span className="text-amber-500">TRADE</span>
      </div>
    )
  },
  { 
    id: 'FundingPips', 
    name: 'Funding Pips', 
    badgeColor: 'text-blue-400',
    svgLogo: (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center font-bold text-slate-900 text-sm">
          iP
        </div>
        <span className="font-bold text-white text-sm">Funding Pips</span>
      </div>
    )
  },
  { 
    id: 'FundedNext', 
    name: 'FundedNext', 
    badgeColor: 'text-purple-400',
    svgLogo: (
      <div className="flex items-center gap-2">
        <div className="flex items-center text-purple-400 font-bold text-lg">
          ⇄
        </div>
        <span className="font-bold text-white text-sm">FundedNext</span>
      </div>
    )
  },
  { 
    id: 'FTMO', 
    name: 'FTMO', 
    badgeColor: 'text-blue-500',
    svgLogo: (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 border-2 border-blue-400 rotate-45 flex items-center justify-center" />
        <span className="font-bold text-white text-base tracking-widest">FTMO</span>
      </div>
    )
  }
];

const ACCOUNT_SIZES = [
  { size: 50000, label: '$50,000', fee: 319, isRecommended: true },
  { size: 90000, label: '$90,000', fee: 519 },
  { size: 100000, label: '$100,000', fee: 569 },
  { size: 200000, label: '$200,000', fee: 699 },
  { size: 500000, label: '$500,000', fee: 1999 }
];

export default function StartPartnershipModal({ isOpen, onClose, defaultAccountType = 'challenge' }: StartPartnershipModalProps) {
  const router = useRouter();
  
  // State for progressive vertical step flow
  const [accountType, setAccountType] = useState<'challenge' | 'instant' | null>(defaultAccountType);
  const [propFirm, setPropFirm] = useState<string | null>(null);
  const [accountSize, setAccountSize] = useState<number | null>(null);

  // Reset selections when modal opens or defaultAccountType changes
  React.useEffect(() => {
    if (isOpen) {
      setAccountType(defaultAccountType || 'challenge');
      setPropFirm(null);
      setAccountSize(null);
    }
  }, [isOpen, defaultAccountType]);

  if (!isOpen) return null;

  const selectedFirmObj = PROP_FIRMS.find(f => f.id === propFirm);
  const selectedSizeObj = ACCOUNT_SIZES.find(s => s.size === accountSize);
  const totalFee = selectedSizeObj ? selectedSizeObj.fee : 0;

  const handleAccountTypeSelect = (type: 'challenge' | 'instant') => {
    setAccountType(type);
    // Reset subsequent choices if user changes account type
    setPropFirm(null);
    setAccountSize(null);
  };

  const handlePropFirmSelect = (firmId: string) => {
    setPropFirm(firmId);
    // If account size was not set, reset or keep null
    if (!accountSize) {
      setAccountSize(null);
    }
  };

  const handleAccountSizeSelect = (size: number) => {
    setAccountSize(size);
  };

  const handleContinueToPayment = () => {
    if (!accountType || !propFirm || !accountSize) return;

    const params = new URLSearchParams({
      model: 'partnership',
      accountType: accountType,
      propFirm: propFirm,
      accountSize: accountSize.toString(),
      price: totalFee.toString()
    });
    onClose();
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#090e23] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-white">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#090e23]/95 backdrop-blur-md px-6 py-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Handshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Start Partnership</h2>
              <p className="text-xs text-slate-400">Step-by-step selection for your partnership account setup.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body - Progressive Vertical Flow */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          
          {/* STEP 1: ACCOUNT TYPE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold">1</span>
                <span>ACCOUNT TYPE</span>
              </div>
              {accountType && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Challenge Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect('challenge')}
                className={`relative text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  accountType === 'challenge'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-600/10'
                    : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    accountType === 'challenge' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                  }`}>
                    {accountType === 'challenge' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white mb-1">Challenge Account</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We pass the challenge and deliver a live funded account.
                  </p>
                </div>
              </button>

              {/* Instant Funded Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect('instant')}
                className={`relative text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  accountType === 'instant'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-600/10'
                    : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    accountType === 'instant' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                  }`}>
                    {accountType === 'instant' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white mb-1">Instant Funded Account</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Already funded. We start trading immediately and share profits.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: SELECT PROP FIRM (Unfolds vertically when account type is active) */}
          {accountType && (
            <div className="space-y-3 animate-slideDown border-t border-slate-800/60 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold">2</span>
                  <span>SELECT PROP FIRM</span>
                </div>
                {propFirm ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selectedFirmObj?.name}
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-medium animate-pulse">
                    Select a prop firm to continue
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PROP_FIRMS.map((firm) => {
                  const isSelected = propFirm === firm.id;
                  return (
                    <button
                      key={firm.id}
                      type="button"
                      onClick={() => handlePropFirmSelect(firm.id)}
                      className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[90px] ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                          : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                      }`}
                    >
                      <div className="absolute top-2.5 right-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="my-auto">
                        {firm.svgLogo}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Info Box */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center gap-3 text-xs text-blue-200/90">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <span>We work with top rated prop firms to give you the best opportunities. You can switch firms anytime you want.</span>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT ACCOUNT SIZE (Unfolds vertically once prop firm is selected) */}
          {accountType && propFirm && (
            <div className="space-y-3 animate-slideDown border-t border-slate-800/60 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold">3</span>
                  <span>SELECT ACCOUNT SIZE</span>
                </div>
                {accountSize ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {selectedSizeObj?.label}
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-medium animate-pulse">
                    Select account size to see pricing
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ACCOUNT_SIZES.map((item) => {
                  const isSelected = accountSize === item.size;
                  return (
                    <button
                      key={item.size}
                      type="button"
                      onClick={() => handleAccountSizeSelect(item.size)}
                      className={`relative p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-blue-950/50 border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                          : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                      }`}
                    >
                      <div className="absolute top-2 right-2">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="text-base font-extrabold text-white mt-1 mb-1">{item.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        8% Profit Target<br/>10% Max Drawdown
                      </div>
                      <div className="mt-3 text-sm font-bold text-blue-400">
                        ${item.fee}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recommendation Callout */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200/90">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <div>
                  <span className="font-bold text-amber-400">Most traders choose $50,000</span> – Best balance between risk and reward. Larger account sizes mean higher profit potential.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 & 5: SUMMARY & NEXT STEP (Unfolds vertically once size is selected) */}
          {accountType && propFirm && accountSize && (
            <div className="space-y-6 animate-slideDown border-t border-slate-800/60 pt-6">
              
              {/* STEP 4: SUMMARY */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold">4</span>
                  <span>PARTNERSHIP SUMMARY</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0f1738]/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Account Type</div>
                      <div className="text-xs font-bold text-white capitalize">{accountType} Account</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Prop Firm</div>
                      <div className="text-xs font-bold text-white">{selectedFirmObj?.name || propFirm}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Account Size</div>
                      <div className="text-xs font-bold text-white">${accountSize.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Total Fee</div>
                      <div className="text-xs font-bold text-blue-400">${totalFee}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 5: NEXT STEP */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold">5</span>
                  <span>NEXT STEP & CONFIRMATION</span>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center gap-3 text-xs text-blue-200/90">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <span>After your payment is confirmed, we will purchase the account and share the investor login details with you within 24 hours.</span>
                </div>
              </div>

              {/* Bottom Total & Continue Bar */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Total Amount</div>
                  <div className="text-3xl font-extrabold text-blue-400">${totalFee}.00</div>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-1.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleContinueToPayment}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Secure payment • 100% safe & encrypted</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
