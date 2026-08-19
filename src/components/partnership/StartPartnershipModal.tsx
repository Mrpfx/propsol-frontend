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
      <div className="flex flex-col items-center justify-center gap-0.5 max-w-full overflow-hidden text-center">
        <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-md bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-[9px] sm:text-xs">
          10
        </div>
        <span className="font-bold text-white text-[9px] xs:text-[10px] sm:text-xs truncate max-w-full">TenTrade</span>
      </div>
    )
  },
  { 
    id: 'FundingPips', 
    name: 'Funding Pips', 
    badgeColor: 'text-blue-400',
    svgLogo: (
      <div className="flex flex-col items-center justify-center gap-0.5 max-w-full overflow-hidden text-center">
        <div className="w-4 h-4 sm:w-6 sm:h-6 rounded bg-white flex items-center justify-center font-bold text-slate-900 text-[8px] sm:text-xs">
          iP
        </div>
        <span className="font-bold text-white text-[9px] xs:text-[10px] sm:text-xs truncate max-w-full">Funding Pips</span>
      </div>
    )
  },
  { 
    id: 'FundedNext', 
    name: 'FundedNext', 
    badgeColor: 'text-purple-400',
    svgLogo: (
      <div className="flex flex-col items-center justify-center gap-0.5 max-w-full overflow-hidden text-center">
        <div className="flex items-center justify-center text-purple-400 font-bold text-xs sm:text-base h-4 sm:h-6">
          ⇄
        </div>
        <span className="font-bold text-white text-[9px] xs:text-[10px] sm:text-xs truncate max-w-full">FundedNext</span>
      </div>
    )
  },
  { 
    id: 'FTMO', 
    name: 'FTMO', 
    badgeColor: 'text-blue-500',
    svgLogo: (
      <div className="flex flex-col items-center justify-center gap-0.5 max-w-full overflow-hidden text-center">
        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-400 rotate-45 flex items-center justify-center my-0.5" />
        <span className="font-bold text-white text-[9px] xs:text-[10px] sm:text-xs truncate max-w-full tracking-wider">FTMO</span>
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

export default function StartPartnershipModal({ isOpen, onClose, defaultAccountType }: StartPartnershipModalProps) {
  const router = useRouter();
  
  // State for progressive vertical step flow - defaults to null so user must select
  const [accountType, setAccountType] = useState<'challenge' | 'instant' | null>(defaultAccountType || null);
  const [propFirm, setPropFirm] = useState<string | null>(null);
  const [accountSize, setAccountSize] = useState<number | null>(null);
  const [accountSizes, setAccountSizes] = useState(ACCOUNT_SIZES);

  // Reset selections & fetch live pricing when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAccountType(defaultAccountType || null);
      setPropFirm(null);
      setAccountSize(null);

      // Fetch dynamic pricing if type is provided
      if (defaultAccountType) {
        import('@/services/partnership.service').then(({ partnershipService }) => {
          partnershipService.getPartnershipPlans().then((plans) => {
            if (plans && plans.length > 0) {
              const currentPlan = plans.find(p => p.account_type === defaultAccountType) || plans[0];
              if (currentPlan && currentPlan.prices && currentPlan.prices.length > 0) {
                const formattedPrices = currentPlan.prices.map(p => ({
                  size: p.account_size,
                  label: p.account_size_display || `$${p.account_size.toLocaleString()}`,
                  fee: p.price
                }));
                setAccountSizes(formattedPrices);
              }
            }
          }).catch((err) => console.warn('Using default partnership pricing:', err));
        });
      }
    }
  }, [isOpen, defaultAccountType]);

  // Update accountSizes when accountType changes
  React.useEffect(() => {
    if (accountType) {
      import('@/services/partnership.service').then(({ partnershipService }) => {
        partnershipService.getPartnershipPlans().then((plans) => {
          if (plans && plans.length > 0) {
            const currentPlan = plans.find(p => p.account_type === accountType) || plans[0];
            if (currentPlan && currentPlan.prices && currentPlan.prices.length > 0) {
              const formattedPrices = currentPlan.prices.map(p => ({
                size: p.account_size,
                label: p.account_size_display || `$${p.account_size.toLocaleString()}`,
                fee: p.price
              }));
              setAccountSizes(formattedPrices);
            }
          }
        }).catch((err) => console.warn('Using default partnership pricing:', err));
      });
    }
  }, [accountType]);

  if (!isOpen) return null;

  const selectedFirmObj = PROP_FIRMS.find(f => f.id === propFirm);
  const selectedSizeObj = accountSizes.find(s => s.size === accountSize);
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
      accountSize: accountSize.toString()
    });
    onClose();
    router.push(`/partnership/checkout?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#090e23] border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-white">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#090e23]/95 backdrop-blur-md px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
              <Handshake className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">Start Partnership</h2>
              <p className="text-[10px] sm:text-xs text-slate-400">Step-by-step selection for your partnership account setup.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Body - Progressive Vertical Flow */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-8 custom-scrollbar">
          
          {/* STEP 1: ACCOUNT TYPE */}
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[11px] font-bold">1</span>
                <span>ACCOUNT TYPE</span>
              </div>
              {accountType ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] text-amber-400 font-medium animate-pulse">
                  Select type to continue
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
              {/* Challenge Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect('challenge')}
                className={`relative text-left p-3 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  accountType === 'challenge'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-600/10 ring-2 ring-blue-500/20'
                    : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                }`}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Trophy className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    accountType === 'challenge' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                  }`}>
                    {accountType === 'challenge' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xs sm:text-base text-white mb-0.5 sm:mb-1">Challenge Account</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-snug sm:leading-relaxed">
                    We pass the challenge & deliver live funded account.
                  </p>
                </div>
              </button>

              {/* Instant Funded Account Card */}
              <button
                type="button"
                onClick={() => handleAccountTypeSelect('instant')}
                className={`relative text-left p-3 sm:p-5 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  accountType === 'instant'
                    ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-600/10 ring-2 ring-blue-500/20'
                    : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                }`}
              >
                <div className="flex items-start justify-between mb-2 sm:mb-4">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    accountType === 'instant' ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                  }`}>
                    {accountType === 'instant' && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xs sm:text-base text-white mb-0.5 sm:mb-1">Instant Funded</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-snug sm:leading-relaxed">
                    Already funded. Start trading & sharing profit immediately.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: SELECT PROP FIRM (Unfolds vertically when account type is active) */}
          {accountType && (
            <div className="space-y-3 animate-slideDown border-t border-slate-800/60 pt-4 sm:pt-6">
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
                  <span className="text-[10px] sm:text-[11px] text-amber-400 font-medium animate-pulse">
                    Select a prop firm to continue
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1 sm:gap-3">
                {PROP_FIRMS.map((firm) => {
                  const isSelected = propFirm === firm.id;
                  return (
                    <button
                      key={firm.id}
                      type="button"
                      onClick={() => handlePropFirmSelect(firm.id)}
                      className={`relative px-1 py-2 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center min-h-[58px] sm:min-h-[85px] overflow-hidden ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                          : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                      }`}
                    >
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10">
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="w-full flex items-center justify-center pt-1">
                        {firm.svgLogo}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Info Box */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-blue-200/90">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span>We work with top rated prop firms to give you the best opportunities. You can switch firms anytime.</span>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT ACCOUNT SIZE (Unfolds vertically once prop firm is selected) */}
          {accountType && propFirm && (
            <div className="space-y-2.5 sm:space-y-3 animate-slideDown border-t border-slate-800/60 pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">3</span>
                  <span>SELECT ACCOUNT SIZE</span>
                </div>
                {accountSize ? (
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> {selectedSizeObj?.label}
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[11px] text-amber-400 font-medium animate-pulse">
                    Select account size
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                {accountSizes.map((item) => {
                  const isSelected = accountSize === item.size;

                  return (
                    <button
                      key={item.size}
                      type="button"
                      onClick={() => handleAccountSizeSelect(item.size)}
                      className={`relative p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
                        isSelected
                          ? 'bg-blue-950/50 border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                          : 'bg-[#0f1738]/60 border-slate-800/80 hover:border-slate-700 hover:bg-[#131d45]/60'
                      }`}
                    >
                      <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                        <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                        }`}>
                          {isSelected && <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="text-xs sm:text-base font-extrabold text-white mt-0.5 sm:mt-1 mb-0.5 sm:mb-1">{item.label}</div>
                      <div className="text-[9px] sm:text-[10px] text-slate-400 leading-tight">
                        8% Profit Target<br/>10% Max Drawdown
                      </div>
                      <div className="mt-1.5 sm:mt-3 text-xs sm:text-sm font-bold text-blue-400">
                        ${item.fee}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Recommendation Callout */}
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs text-amber-200/90">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                </div>
                <div>
                  <span className="font-bold text-amber-400">Most traders choose $50,000</span> – Best balance between risk and reward. Larger account sizes mean higher profit potential.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 & 5: SUMMARY & NEXT STEP (Unfolds vertically once size is selected) */}
          {accountType && propFirm && accountSize && (
            <div className="space-y-4 sm:space-y-6 animate-slideDown border-t border-slate-800/60 pt-4 sm:pt-6">
              
              {/* STEP 4: SUMMARY */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">4</span>
                  <span>PARTNERSHIP SUMMARY</span>
                </div>

                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0f1738]/80 border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-[11px] text-slate-400">Type</div>
                      <div className="text-[11px] sm:text-xs font-bold text-white capitalize truncate">{accountType}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-[11px] text-slate-400">Prop Firm</div>
                      <div className="text-[11px] sm:text-xs font-bold text-white truncate">{selectedFirmObj?.name || propFirm}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-[11px] text-slate-400">Size</div>
                      <div className="text-[11px] sm:text-xs font-bold text-white truncate">${accountSize.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] sm:text-[11px] text-slate-400">Total Fee</div>
                      <div className="text-[11px] sm:text-xs font-bold text-blue-400 truncate">${totalFee}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 5: NEXT STEP */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] sm:text-[11px] font-bold">5</span>
                  <span>NEXT STEP & CONFIRMATION</span>
                </div>

                <div className="p-2.5 sm:p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs text-blue-200/90">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span>After your payment is confirmed, we will purchase the account and share the investor login details with you within 24 hours.</span>
                </div>
              </div>

              {/* Bottom Total & Continue Bar */}
              <div className="pt-3 sm:pt-4 border-t border-slate-800/80 flex flex-row items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs text-slate-400">Total Amount</div>
                  <div className="text-xl sm:text-3xl font-extrabold text-blue-400">${totalFee}.00</div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleContinueToPayment}
                    className="px-5 sm:px-8 py-2.5 sm:py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5 sm:gap-2 group"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-1 text-[9px] sm:text-[11px] text-slate-400">
                    <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
                    <span>Secure payment • 100% safe</span>
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
