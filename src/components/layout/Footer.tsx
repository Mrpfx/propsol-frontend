// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, Shield, Lock } from 'lucide-react';
import { api } from '@/lib/api';

const bookingLinkService = {
  getAllBookingLinks: async () => (await api.get('/booking-links/')).data
};

export default function Footer() {
  const [calendlyLink, setCalendlyLink] = useState("https://calendly.com/hello-propfirmsolutions/30min");

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

  return (
    <footer className="bg-[#040714] text-white py-16 border-t border-slate-800/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          
          <div>
            <Link href="/" className="text-2xl font-black mb-6 inline-flex items-center gap-1">
              <span className="text-blue-500">Prop</span>
              <span className="text-white">Sol</span>
            </Link>

            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400 max-w-2xl">
              <Link href="/" className="hover:text-white transition-colors font-medium">Home</Link>
              <Link href="/partnership" className="hover:text-blue-400 transition-colors font-medium">PropSol Partnership</Link>
              <Link href="/pass" className="hover:text-blue-400 transition-colors font-medium">PropSol Pass</Link>
              <Link href="/pricing" className="hover:text-white transition-colors font-medium">Pricing</Link>
              <Link href="/signup" className="hover:text-white transition-colors font-medium">Get Started</Link>
              <Link href="/about" className="hover:text-white transition-colors font-medium">About</Link>
              <Link href="/faq" className="hover:text-white transition-colors font-medium">FAQ</Link>
              <Link href="/support" className="hover:text-white transition-colors font-medium">Support</Link>
              <Link href="/dashboard?tab=referrals" className="hover:text-white transition-colors font-medium">Referrals</Link>
              <Link href="/terms" className="hover:text-white transition-colors font-medium">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors font-medium">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors font-medium">Refund Policy</Link>
              <a
                href={calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-950 rounded-lg font-bold text-xs transition-colors"
              >
                Book Call
              </a>
            </nav>

            <p className="mt-8 text-xs text-slate-500">© 2025-2026 PropSol. All rights reserved.</p>
          </div>

          <div className="w-full max-w-md bg-[#070c1e] p-6 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-white">Stay up to date</h4>
            <p className="text-xs text-slate-400">Subscribe for proprietary trading system insights and prop firm updates.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-[#0a1128] border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
