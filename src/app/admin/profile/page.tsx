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
  const t = createProxy();
  const a = createProxy();
  const l = createProxy();
  const r = createProxy();
  const i = createProxy();
  const d = createProxy();
  const n = createProxy();
  const o = createProxy();
  function c() {
    let [e, c] = useState(null);
    let [m, u] = useState(true);
    let [x, h] = useState(false);
    let [p, b] = useState("");
    let [f, g] = useState("");
    let [y, v] = useState("");
    let [j, N] = useState("");
    useEffect(() => {
      w();
    }, []);
    let w = async () => {
      try {
        u(true);
        let e = await l.adminService.getMe();
        c(e);
        b(e.name);
        g(e.email);
      } catch (e) {
        console.error("Failed to fetch profile:", e);
        a.toast.error("Failed to load profile details");
      } finally {
        u(false);
      }
    };
    let k = async e => {
      e.preventDefault();
      h(true);
      if (y && y !== j) {
        a.toast.error("New passwords do not match");
        h(false);
        return;
      }
      try {
        let e = {
          name: p
        };
        if (y) {
          e.password = y;
        }
        let s = await l.adminService.updateMe(e);
        c(s);
        a.toast.success("Profile updated successfully");
        v("");
        N("");
        let t = localStorage.getItem("admin_data");
        if (t) {
          let e = JSON.parse(t);
          localStorage.setItem("admin_data", JSON.stringify({
            ...e,
            name: s.name
          }));
        }
      } catch (e) {
        console.error("Failed to update profile:", e);
        a.toast.error("Failed to update profile");
      } finally {
        h(false);
      }
    };
    if (m) {
      return <div className="flex h-96 items-center justify-center"><o.Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;
    } else {
      return <div className="max-w-2xl mx-auto"><h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1><p className="text-gray-500 mb-8">Manage your account settings and preferences.</p><div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="p-6 sm:p-8"><form onSubmit={k} className="space-y-6"><div className="flex items-center gap-4 mb-8"><div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">{p.charAt(0).toUpperCase()}</div><div><h3 className="text-lg font-medium text-gray-900">{p}</h3><p className="text-sm text-gray-500">{e?.email}</p><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-2">Administrator</span></div></div><div className="grid gap-6"><div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><r.User className="h-5 w-5 text-gray-400" /></div><input type="text" value={p} onChange={e => b(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Your Name" required={true} /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i.Mail className="h-5 w-5 text-gray-400" /></div><input type="email" value={f} disabled={true} className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed" placeholder="your@email.com" /></div><p className="mt-1 text-xs text-gray-500">Email address cannot be changed directly.</p></div><div className="pt-6 border-t border-gray-100"><h4 className="text-base font-medium text-gray-900 mb-4">Change Password</h4><div className="grid gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">New Password</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><d.Lock className="h-5 w-5 text-gray-400" /></div><input type="password" value={y} onChange={e => v(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Leave blank to keep current" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label><div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><d.Lock className="h-5 w-5 text-gray-400" /></div><input type="password" value={j} onChange={e => N(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Confirm new password" /></div></div></div></div></div><div className="flex justify-end pt-6"><button type="submit" disabled={x} className="flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed">{x ? <React.Fragment><o.Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />Saving...</React.Fragment> : <React.Fragment><n.Save className="-ml-1 mr-2 h-4 w-4" />Save Changes</React.Fragment>}</button></div></form></div></div></div>;
    }
  }
  
export default c;
