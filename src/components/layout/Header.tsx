// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Handshake } from 'lucide-react';
import { api } from '@/lib/api';

const bookingLinkService = {
  getAllBookingLinks: async () => (await api.get('/booking-links/')).data
};

interface HeaderProps {
  onOpenPartnershipModal?: () => void;
}

export default function Header({ onOpenPartnershipModal }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState("https://calendly.com/hello-propfirmsol/30min");
  const pathname = usePathname();
  const isDarkBg = pathname === "/" || pathname === "/partnership" || pathname === "/pass";

  useEffect(() => {
    (async () => {
      try {
        const links = await bookingLinkService.getAllBookingLinks();
        if (links && links.length > 0) {
          const active = links.find((l: any) => l.is_active);
          if (active && active.url) {
            setCalendlyLink(active.url);
          }
        }
      } catch (err) {}
    })();
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Partnership", href: "/partnership" },
    { name: "PropSol Pass", href: "/pass" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" }
  ];

  const showBookNow = pathname !== "/" && pathname !== "/partnership";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${isDarkBg ? "bg-[#070b19]/90 border-slate-800/80" : "bg-white/90 border-slate-200/50"}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-10">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-600/30">
              P
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-black text-blue-500">Prop</span>
              <span className={`text-2xl font-black ${isDarkBg ? "text-white" : "text-slate-900"}`}>Sol</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  href={link.href}
                  key={link.name}
                  className={`text-sm font-semibold transition-colors ${
                    isActive 
                      ? "text-blue-400" 
                      : isDarkBg 
                        ? "text-slate-300 hover:text-white" 
                        : "text-slate-600 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Buttons Right (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {onOpenPartnershipModal && (
            <button
              onClick={onOpenPartnershipModal}
              className="px-4 py-2 text-xs font-bold rounded-xl transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Handshake className="w-4 h-4" />
              <span>Start Partnership</span>
            </button>
          )}

          {showBookNow && (
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-bold rounded-xl transition-all bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-950 border-none shadow-md shadow-amber-500/20 whitespace-nowrap"
            >
              Book Now
            </a>
          )}

          <Link
            href="/signin"
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
              isDarkBg 
                ? "text-white bg-slate-800/80 hover:bg-slate-700" 
                : "text-slate-700 bg-slate-100 hover:bg-slate-200"
            }`}
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/25"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile action bar & menu button */}
        <div className="lg:hidden flex items-center gap-2">
          {onOpenPartnershipModal && (
            <button
              onClick={onOpenPartnershipModal}
              className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-blue-600 text-white flex items-center gap-1"
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>
          )}
          {showBookNow && (
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-950 shadow-md shadow-amber-500/20 whitespace-nowrap"
            >
              Book Now
            </a>
          )}
          <button
            className={`p-2 transition-colors ${isDarkBg ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-blue-600"}`}
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-auto pb-8 bg-[#070b19] border-b border-slate-800 lg:hidden shadow-2xl z-[9999]"
        >
          <div className="container mx-auto px-4 h-20 flex items-center justify-between border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-1" onClick={() => setIsOpen(false)}>
              <span className="text-2xl font-black text-blue-500">Prop</span>
              <span className="text-2xl font-black text-white">Sol</span>
            </Link>
            <button className="p-2 text-slate-400 hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center gap-5 pt-8">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-semibold text-slate-200 hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 w-full px-8 mt-4">
              {showBookNow && (
                <a
                  href={calendlyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 text-center text-sm font-bold text-slate-950 bg-[#fbbf24] hover:bg-[#f59e0b] rounded-xl transition-all shadow-md shadow-amber-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Book Now
                </a>
              )}

              {onOpenPartnershipModal && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenPartnershipModal();
                  }}
                  className="w-full py-3 text-center text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                >
                  <Handshake className="w-4 h-4" />
                  <span>Start Partnership</span>
                </button>
              )}

              <Link
                href="/signin"
                className="w-full py-3 text-center text-sm font-semibold text-slate-200 bg-slate-800/80 rounded-xl hover:bg-slate-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full py-3 text-center text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
