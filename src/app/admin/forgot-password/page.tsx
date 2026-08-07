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
  const r = createProxy();
  const i = createProxy();
  const n = createProxy();
  const l = createProxy();
  const a = createProxy();
  function o() {
    let [e, o] = useState("");
    let [s, d] = useState(false);
    let [u, c] = useState("");
    let [f, m] = useState("");
    let p = async t => {
      t.preventDefault();
      d(true);
      c("");
      m("");
      try {
        await a.authService.recoverAdminPassword(e);
        let t = "If this email is registered, you will receive a password reset link shortly.";
        c(t);
        l.toast.success(t);
      } catch (t) {
        console.error("Recovery error:", t);
        let e = "Failed to send recovery email. Please try again.";
        m(e);
        l.toast.error(e);
      } finally {
        d(false);
      }
    };
    return <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden"><div className="absolute top-8 left-8 z-20"><n.default href="/" className="text-2xl font-bold text-red-800">Prop<span className="text-slate-900">Sol</span> <span className="text-red-600 text-sm uppercase tracking-wider ml-1">Admin</span></n.default></div><div className="absolute top-1/2 -translate-y-1/2 -left-16 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-float-delayed z-0 pointer-events-none grayscale opacity-50"><i.default src="/assets/coil_v2.png" alt="Decorative Coil" fill={true} className="object-contain" /></div><div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] animate-spin-slow z-0 pointer-events-none grayscale opacity-50"><i.default src="/assets/star.png" alt="Decorative Star" fill={true} className="object-contain" /></div><div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row relative z-10 min-h-[600px]"><div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center"><h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Password Recovery</h1>{u && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100">{u}</div>}{f && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{f}</div>}<form onSubmit={p} className="space-y-6"><div><label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label><input type="email" id="email" value={e} onChange={e => o(e.target.value)} placeholder="admin@propsol.com" required={true} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all text-slate-600 placeholder:text-gray-300" /></div><button type="submit" disabled={s} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-70 disabled:cursor-not-allowed">{s ? "Sending..." : "Send Recovery Link"}</button><div className="text-center text-sm text-slate-500 mt-8"><n.default href="/admin/login" className="text-red-600 hover:underline">Back to Admin Login</n.default></div></form></div><div className="hidden lg:flex w-1/2 bg-red-700 relative items-end p-16 overflow-hidden"><div className="absolute -top-[20%] -left-[10%] w-[90%] h-[90%] rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent blur-2xl border border-white/20 pointer-events-none" /><div className="absolute top-[20%] left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-b from-white/30 to-transparent blur-2xl border border-white/20 pointer-events-none" /><div className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full backdrop-blur-md z-10" /><div className="relative z-20 mb-10"><h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-6 leading-tight">Secure Account<br />Recovery<br />Protocol</h2></div></div></div></main>;
  }
  
export default o;
