// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';
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
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div>
            <Link href="/" className="text-2xl font-bold mb-6 block">
              <span className="text-blue-600">Prop</span>
              <span className="text-white">Sol</span>
            </Link>
            <nav className="flex flex-wrap gap-6 text-sm text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/signup" className="hover:text-white transition-colors">Get Started</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
              <Link href="/dashboard?tab=referrals" className="hover:text-white transition-colors">Referrals</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              <a
                href={calendlyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-1.5 bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-900 rounded font-bold text-xs transition-colors"
              >
                Book Call
              </a>
            </nav>
            <p className="mt-8 text-xs text-slate-600">© 2025 PropSol. All rights reserved</p>
          </div>
          <div className="w-full max-w-md">
            <h4 className="font-bold mb-4">Stay up to date</h4>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
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
