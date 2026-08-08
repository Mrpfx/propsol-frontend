// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname, redirect } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import * as LucideIcons from 'lucide-react';
import { adminService } from '@/services/admin.service';
import { authService } from '@/services/auth.service';
import { paymentService } from '@/services/payment.service';
import { userService } from '@/services/user.service';
import { propFirmService } from '@/services/prop-firm.service';
import { notificationService } from '@/services/notification.service';
import { api } from '@/lib/api';

import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { walletService } from '@/services/wallet.service';

const bannerService = {
  getAll: async () => (await api.get('/banner-ads/')).data,
  create: async (data) => (await api.post('/banner-ads/', data)).data,
  update: async (id, data) => (await api.patch('/banner-ads/' + id + '/', data)).data,
  delete: async (id) => (await api.delete('/banner-ads/' + id + '/')).data
};

const bookingLinkService = {
  getAll: async () => (await api.get('/booking-links/')).data,
  create: async (data) => (await api.post('/booking-links/', data)).data,
  update: async (id, data) => (await api.patch('/booking-links/' + id + '/', data)).data,
  delete: async (id) => (await api.delete('/booking-links/' + id + '/')).data
};

const planService = {
  getAll: async () => (await api.get('/plans/')).data,
  create: async (data) => (await api.post('/plans/', data)).data,
  update: async (id, data) => (await api.patch('/plans/' + id + '/', data)).data,
  delete: async (id) => (await api.delete('/plans/' + id + '/')).data
};

const payoutService = {
  getAll: async () => (await api.get('/payouts/')).data,
  updateStatus: async (id, status) => (await api.patch('/payouts/' + id + '/', { status })).data
};

const supportService = {
  getTickets: async () => (await api.get('/support/tickets/')).data,
  createTicket: async (data) => (await api.post('/support/tickets/', data)).data,
  replyTicket: async (id, message) => (await api.post('/support/tickets/' + id + '/reply/', { message })).data
};

const createProxy = () => new Proxy(LucideIcons, {
  get(target, prop) {
    if (prop === 'DashboardHeader') return DashboardHeader;
    if (prop === 'walletService') return walletService;
    if (prop === 'default') return Link;
    if (prop === 'useRouter') return useRouter;
    if (prop === 'useSearchParams') return useSearchParams;
    if (prop === 'usePathname') return usePathname;
    if (prop === 'redirect') return redirect;
    if (prop === 'error') return toast.error;
    if (prop === 'success') return toast.success;
    if (prop === 'userService') return userService;
    if (prop === 'adminService') return adminService;
    if (prop === 'authService') return authService;
    if (prop === 'paymentService') return paymentService;
    if (prop === 'propFirmService') return propFirmService;
    if (prop === 'notificationService') return notificationService;
    if (prop === 'bannerService') return bannerService;
    if (prop === 'bookingLinkService') return bookingLinkService;
    if (prop === 'planService') return planService;
    if (prop === 'payoutService') return payoutService;
    if (prop === 'supportService' || prop === 'ticketService') return supportService;
    if (target[prop]) return target[prop];
    return LucideIcons[prop] || LucideIcons.HelpCircle || (() => null);
  }
});

const t = createProxy();
  const a = createProxy();
  const r = createProxy();
  const n = createProxy();
  const s = createProxy();
  const i = createProxy();
  const l = createProxy();
  const o = createProxy();
  const c = createProxy();
  const u = createProxy();
  const d = createProxy();
  function f() {
    let e = (0, r.useRouter)();
    let [f, m] = useState(null);
    let [p, h] = useState(null);
    let [y, g] = useState(true);
    let [x, b] = useState(false);
    let [w, v] = useState("");
    let [j, _] = useState("");
    let [N, S] = useState("TRC20");
    let [k, A] = useState("crypto");
    useEffect(() => {
      (async () => {
        try {
          let [e, t] = await Promise.all([s.userService.getCurrentUser(), i.walletService.getSummary()]);
          m(e);
          h(t);
        } catch (e) {
          console.error("Failed to load data:", e);
          l.toast.error("Failed to load wallet data");
        } finally {
          g(false);
        }
      })();
    }, []);
    let P = async t => {
      t.preventDefault();
      let a = parseFloat(w);
      if (a < 100) {
        l.toast.error("Minimum withdrawal amount is $100");
        return;
      }
      if (p && a > p.available_balance) {
        l.toast.error("Insufficient available balance");
        return;
      }
      if (k === "crypto" && !j) {
        l.toast.error("Please enter your wallet address");
        return;
      }
      let r = N === "BTC" ? "BTC" : "USDT";
      b(true);
      try {
        await i.walletService.requestWithdrawal({
          amount: a,
          payment_method: k,
          crypto_details: k === "crypto" ? {
            wallet_address: j,
            network: N,
            currency: r
          } : undefined
        });
        l.toast.success("Withdrawal request submitted successfully");
        e.push("/dashboard/wallet/history");
      } catch (e) {
        console.error("Withdrawal failed:", e);
        l.toast.error(e.response?.data?.detail || e.message || "Withdrawal failed");
      } finally {
        b(false);
      }
    };
    if (y) {
      return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    } else {
      return <div className="min-h-screen bg-gray-50"><n.DashboardHeader user={f || undefined} /><main className="container mx-auto px-4 py-8"><div className="max-w-2xl mx-auto"><div className="mb-6"><d.default href="/dashboard/wallet" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"><o.ArrowLeft className="w-4 h-4 mr-1" />Back to Wallet</d.default><h1 className="text-2xl font-bold text-gray-900">Request Withdrawal</h1><p className="text-gray-500">Withdraw your earnings to your preferred payment method.</p></div><div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><div className="p-6 border-b border-gray-100 bg-blue-50/50"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500 mb-1">Available Balance</p><p className="text-2xl font-bold text-blue-600">${(p?.available_balance ?? 0).toLocaleString("en-US", {
                        minimumFractionDigits: 2
                      })}</p></div><div className="bg-white p-2 rounded-lg border border-blue-100 shadow-sm"><c.ShieldCheck className="w-6 h-6 text-blue-500" /></div></div></div><form onSubmit={P} className="p-6 space-y-6"><div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span><input type="number" value={w} onChange={e => v(e.target.value)} className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="100.00" min="100" max={p?.available_balance} required={true} /></div><div className="flex items-center justify-between mt-2"><p className="text-xs text-gray-500">Minimum withdrawal: $100.00</p>{p && p.available_balance < 100 && <p className="text-xs text-red-500 flex items-center gap-1"><u.AlertCircle className="w-3 h-3" />Insufficient balance</p>}</div></div><div className="bg-gray-50 rounded-xl p-4 border border-gray-100">{k === "crypto" && <div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Network</label><select value={N} onChange={e => S(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="TRC20">USDT (TRC20)</option><option value="BTC">Bitcoin (BTC)</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label><input type="text" value={j} onChange={e => _(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" placeholder="Enter your wallet address" required={true} /></div></div>}</div><button type="submit" disabled={x || (p?.available_balance || 0) < 100} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">{x ? <React.Fragment>Processing...</React.Fragment> : <React.Fragment>Request Withdrawal</React.Fragment>}</button></form></div></div></main></div>;
    }
  }
  
export default f;
