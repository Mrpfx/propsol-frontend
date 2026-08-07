// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { api } from '@/lib/api';

const bookingLinkService = {
  getAllBookingLinks: async () => (await api.get('/booking-links/')).data
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [calendlyLink, setCalendlyLink] = useState("https://calendly.com/hello-propfirmsolutions/30min");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    (async () => {
      try {
        const links = await bookingLinkService.getAllBookingLinks();
        if (links && links.length > 0 && links[0].url) {
          setCalendlyLink(links[0].url);
        }
      } catch (err) {}
    })();
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Support/Contact", href: "/support" },
    { name: "FAQ", href: "/faq" },
    { name: "About", href: "/about" },
    { name: "Referrals", href: "/dashboard?tab=referrals" }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${isHome ? "bg-[#0a0e27]/90 border-slate-700/30" : "bg-white/90 border-slate-200/50"}`}>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-2xl font-bold text-primary">Prop</span>
            <span className={`text-2xl font-bold ${isHome ? "text-white" : "text-slate-900"}`}>Sol</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors ${isHome ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-primary"}`}
                key={link.name}
              >
                {link.name}
              </Link>
            ))}
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 text-sm font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20 bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-900 border-none"
            >
              Book Call
            </a>
          </nav>
        </div>
        <div className="md:hidden flex items-center ml-auto mr-2 sm:mr-4">
          <a
            href={calendlyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors shadow-md bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-900 border-none whitespace-nowrap"
          >
            Book Call
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <Link
            href="/signup"
            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${isHome ? "text-white bg-white/10 hover:bg-white/20" : "text-primary bg-primary/10 hover:bg-primary/20"}`}
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Sign In
          </Link>
        </div>
        <button
          className={`md:hidden p-2 transition-colors ${isHome ? "text-slate-200 hover:text-white" : "text-slate-600 hover:text-primary"}`}
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-auto pb-8 bg-white md:hidden shadow-2xl"
          style={{ backgroundColor: "#ffffff", opacity: 1, zIndex: 9999 }}
        >
          <div className="container mx-auto px-4 h-20 flex items-center justify-between border-b border-slate-100">
            <Link href="/" className="flex items-center gap-0.5" onClick={() => setIsOpen(false)}>
              <span className="text-2xl font-bold text-primary">Prop</span>
              <span className="text-2xl font-bold text-slate-900">Sol</span>
            </Link>
            <button className="p-2 text-slate-600 hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 pt-12">
            {navLinks.map(link => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-slate-900 hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-4 w-full px-8 mt-4">
              <Link
                href="/signin"
                className="w-full py-3 text-center text-lg font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="w-full py-3 text-center text-lg font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
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
