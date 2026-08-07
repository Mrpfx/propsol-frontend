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

const s = createProxy();
  const a = createProxy();
  const l = createProxy();
  const t = createProxy();
  const r = createProxy();
  function _Component2({
    plan: e,
    isOpen: i,
    onClose: n,
    onSave: c
  }) {
    let [d, o] = useState(false);
    let [u, x] = useState({
      description: "",
      subtitle: "",
      prices: []
    });
    useEffect(() => {
      if (e) {
        x({
          description: e.description,
          subtitle: e.subtitle,
          prices: [...e.prices]
        });
      }
    }, [e]);
    let m = (e, s, a) => {
      let l = [...u.prices];
      l[e] = {
        ...l[e],
        [s]: a
      };
      x({
        ...u,
        prices: l
      });
    };
    let p = async () => {
      o(true);
      try {
        await l.planService.updatePlan(e.id, u);
        r.default.success("Plan updated successfully");
        c();
        n();
      } catch (e) {
        console.error("Failed to update plan:", e);
        r.default.error("Failed to update plan");
      } finally {
        o(false);
      }
    };
    if (i) {
      return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto"><div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900">Edit Plan: {e.name}</h2><button onClick={n} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><t.X className="h-5 w-5" /></button></div><div className="space-y-6"><div><label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label><input type="text" value={u.subtitle} onChange={e => x({
                ...u,
                subtitle: e.target.value
              })} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div><div><label className="mb-2 block text-sm font-medium text-gray-700">Description</label><textarea value={u.description} onChange={e => x({
                ...u,
                description: e.target.value
              })} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" /></div><div><label className="mb-2 block text-sm font-medium text-gray-700">Prices</label><div className="space-y-4">{u.prices.map((e, a) => <div className="flex gap-4 items-end bg-gray-50 p-4 rounded-lg" key={a}><div className="flex-1"><label className="mb-1 block text-xs font-medium text-gray-500">Account Size (Display)</label><input type="text" value={e.account_size_display} onChange={e => m(a, "account_size_display", e.target.value)} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm" /></div><div className="w-32"><label className="mb-1 block text-xs font-medium text-gray-500">Price ($)</label><input type="number" value={e.price} onChange={e => m(a, "price", parseFloat(e.target.value))} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm" /></div></div>)}</div></div></div><div className="mt-8 flex justify-end gap-3"><button onClick={n} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100" disabled={d}>Cancel</button><button onClick={p} disabled={d} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{d ? "Saving..." : "Save Changes"}</button></div></div></div>;
    } else {
      return null;
    }
  }
  let _Component = LucideIcons.HelpCircle;
  function c() {
    let [e, t] = useState([]);
    let [c, d] = useState(true);
    let [o, u] = useState(null);
    let [x, m] = useState(false);
    let p = async () => {
      d(true);
      try {
        let e = await l.planService.getAllPlans();
        t(e);
      } catch (e) {
        console.error("Failed to fetch plans:", e);
        r.default.error("Failed to fetch plans");
      } finally {
        d(false);
      }
    };
    useEffect(() => {
      p();
    }, []);
    if (c) {
      return <div className="p-8 text-center">Loading plans...</div>;
    } else {
      return <div className="p-6"><div className="mb-8 flex items-center justify-between"><h1 className="text-2xl font-bold text-gray-900">Manage Pricing Plans</h1><button onClick={p} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">Refresh</button></div><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{e.map(e => <div className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md" key={e.id}>{e.is_popular && <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">POPULAR</div>}<div className="p-6"><div className="mb-4"><h3 className="text-lg font-bold text-gray-900">{e.name}</h3><p className="text-sm font-medium text-blue-600">{e.subtitle}</p></div><p className="mb-4 text-xs text-gray-500 line-clamp-3">{e.description}</p><div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4">{e.prices.map((e, a) => <div className="flex justify-between text-xs" key={a}><span className="text-gray-600">{e.account_size_display}</span><span className="font-bold text-gray-900">${e.price}</span></div>)}</div><div className="mt-auto"><button onClick={() => {
                  u(e);
                  m(true);
                }} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"><_Component className="h-4 w-4" />Edit Plan</button></div></div><div className="bg-gray-50 px-6 py-3 text-xs text-gray-500">Slug: <span className="font-mono">{e.slug}</span></div></div>)}</div>{o && <_Component2 plan={o} isOpen={x} onClose={() => m(false)} onSave={() => {
          p();
        }} />}</div>;
    }
  }
  
export default c;
