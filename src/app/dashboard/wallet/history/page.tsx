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
  getAll: async () => (await api.get('/banners')).data,
  create: async (data) => (await api.post('/banners', data)).data,
  update: async (id, data) => (await api.patch('/banners/' + id, data)).data,
  delete: async (id) => (await api.delete('/banners/' + id)).data
};

const bookingLinkService = {
  getAll: async () => (await api.get('/booking-links')).data,
  create: async (data) => (await api.post('/booking-links', data)).data,
  update: async (id, data) => (await api.patch('/booking-links/' + id, data)).data,
  delete: async (id) => (await api.delete('/booking-links/' + id)).data
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
  const s = createProxy();
  const n = createProxy();
  const i = createProxy();
  const l = createProxy();
  const o = createProxy();
  const c = createProxy();
  const d = createProxy();
  const u = createProxy();
  const f = createProxy();
  const m = createProxy();
  function p() {
    let [e, p] = useState(null);
    let [h, y] = useState([]);
    let [g, x] = useState(true);
    useEffect(() => {
      (async () => {
        try {
          let [e, t] = await Promise.all([s.userService.getCurrentUser(), n.walletService.getWithdrawals()]);
          p(e);
          y(Array.isArray(t) ? t : []);
        } catch (e) {
          console.error("Failed to load data:", e);
          i.toast.error("Failed to load history");
        } finally {
          x(false);
        }
      })();
    }, []);
    if (g) {
      return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    } else {
      return <div className="min-h-screen bg-gray-50"><r.DashboardHeader user={e || undefined} /><main className="container mx-auto px-4 py-8"><div className="max-w-4xl mx-auto"><div className="mb-6"><m.default href="/dashboard/wallet" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"><l.ArrowLeft className="w-4 h-4 mr-1" />Back to Wallet</m.default><h1 className="text-2xl font-bold text-gray-900">Withdrawal History</h1><p className="text-gray-500">View all your past withdrawal requests.</p></div><div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><div className="divide-y divide-gray-50">{h.length === 0 ? <div className="p-12 text-center text-gray-500"><o.History className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No withdrawals found</p></div> : h.map(e => <div className="p-6 hover:bg-gray-50 transition-colors" key={e.id}><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div className="flex items-start gap-4"><div className="p-3 rounded-full bg-blue-50 text-blue-600"><f.ArrowUpRight className="w-5 h-5" /></div><div><div className="flex items-center gap-2 mb-1"><span className="font-semibold text-gray-900 capitalize">{e.payment_method.replace("_", " ")}</span><span className="text-xs text-gray-400">•</span><span className="text-sm text-gray-500">{new Date(e.created_at).toLocaleDateString()}</span></div><div className="text-sm text-gray-600">{e.payment_method === "crypto" && <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{e.crypto_network} • {e.crypto_wallet_address?.slice(0, 6)}...{e.crypto_wallet_address?.slice(-4)}</span>}{e.payment_method === "bank_transfer" && <span>{e.bank_name} • {e.bank_account_number?.slice(-4)}</span>}{e.payment_method === "paypal" && <span>{e.paypal_email}</span>}</div></div></div><div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto"><div className="text-right"><p className="font-bold text-gray-900 text-lg">${e.amount.toFixed(2)}</p></div>{(e => {
                        switch (e) {
                          case "completed":
                          case "approved":
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><c.CheckCircle className="w-3 h-3" /> {e}</span>;
                          case "pending":
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><d.Clock className="w-3 h-3" /> {e}</span>;
                          case "rejected":
                            return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><u.XCircle className="w-3 h-3" /> {e}</span>;
                          default:
                            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{e}</span>;
                        }
                      })(e.status)}</div></div></div>)}</div></div></div></main></div>;
    }
  }
  
export default p;
