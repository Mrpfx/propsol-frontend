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
import { supportTicketService } from '@/services/support-ticket.service';

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
    if (prop === 'supportTicketService' || prop === 'supportService' || prop === 'ticketService') return supportTicketService;
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
    if (target[prop]) return target[prop];
    return LucideIcons[prop] || LucideIcons.HelpCircle || (() => null);
  }
});

const t = createProxy();
  const r = createProxy();
  const a = createProxy();
  const s = createProxy();
  const n = createProxy();
  const l = createProxy();
  const i = createProxy();
  const o = createProxy();
  const c = createProxy();
  const d = createProxy();
  const u = createProxy();
  const m = createProxy();
  const p = createProxy();
  const f = createProxy();
  const h = createProxy();
  const x = createProxy();
  const g = createProxy();
  function y() {
    let [e, y] = useState(null);
    let [b, v] = useState([]);
    let [j, w] = useState(null);
    let [N, k] = useState(true);
    let [S, _] = useState(false);
    let [C, P] = useState(false);
    let [T, O] = useState(false);
    let [M, A] = useState("");
    let L = useRef(null);
    let [E, I] = useState("");
    let [R, $] = useState("medium");
    let [U, F] = useState("");
    let [z, D] = useState(false);
    useEffect(() => {
      B();
    }, []);
    useEffect(() => {
      if (j?.messages) {
        L.current?.scrollIntoView({
          behavior: "smooth"
        });
      }
    }, [j?.messages]);
    let B = async () => {
      try {
        let e = await h.userService.getCurrentUser();
        y(e);
      } catch (e) {
        console.error("Failed to fetch user:", e);
      }
      try {
        let e = await f.supportTicketService.getUserTickets();
        v(Array.isArray(e) ? e : []);
      } catch (e) {
        console.error("Failed to fetch tickets:", e);
        x.toast.error("Failed to load support tickets");
        v([]);
      } finally {
        k(false);
      }
    };
    let H = async e => {
      _(true);
      try {
        let t = await f.supportTicketService.getTicketById(e.id);
        w(t);
      } catch (e) {
        x.toast.error("Failed to load ticket details");
      } finally {
        _(false);
      }
    };
    let q = async e => {
      e.preventDefault();
      if (!E.trim() || !U.trim()) {
        x.toast.error("Please fill in all fields");
        return;
      }
      D(true);
      try {
        let e = await f.supportTicketService.createTicket({
          subject: E,
          message: U,
          priority: R
        });
        v([e, ...b]);
        P(false);
        I("");
        F("");
        $("medium");
        x.toast.success("Ticket created successfully!");
        H(e);
      } catch (e) {
        x.toast.error("Failed to create ticket");
      } finally {
        D(false);
      }
    };
    let K = async e => {
      e.preventDefault();
      if (M.trim() && j) {
        O(true);
        try {
          let e = await f.supportTicketService.sendMessage(j.id, M);
          w({
            ...j,
            messages: [...(j.messages || []), e]
          });
          A("");
        } catch (e) {
          x.toast.error("Failed to send message");
        } finally {
          O(false);
        }
      }
    };
    let X = e => {
      switch (e) {
        case "open":
          return {
            color: "bg-yellow-100 text-yellow-700",
            icon: n.Clock,
            label: "Open"
          };
        case "in_progress":
          return {
            color: "bg-blue-100 text-blue-700",
            icon: m.AlertCircle,
            label: "In Progress"
          };
        case "resolved":
          return {
            color: "bg-green-100 text-green-700",
            icon: l.CheckCircle,
            label: "Resolved"
          };
        case "closed":
          return {
            color: "bg-gray-100 text-gray-600",
            icon: u.XCircle,
            label: "Closed"
          };
        default:
          return {
            color: "bg-gray-100 text-gray-600",
            icon: n.Clock,
            label: e
          };
      }
    };
    let J = e => {
      switch (e) {
        case "urgent":
          return {
            color: "bg-red-100 text-red-700",
            label: "Urgent"
          };
        case "high":
          return {
            color: "bg-orange-100 text-orange-700",
            label: "High"
          };
        case "medium":
          return {
            color: "bg-yellow-100 text-yellow-700",
            label: "Medium"
          };
        case "low":
          return {
            color: "bg-gray-100 text-gray-600",
            label: "Low"
          };
        default:
          return {
            color: "bg-gray-100 text-gray-600",
            label: e
          };
      }
    };
    let Q = e => new Date(e).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    return <div className="min-h-screen bg-gray-50"><p.DashboardHeader user={e || undefined} /><main className="container mx-auto px-4 py-8"><div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><g.default href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"><o.ArrowLeft className="w-4 h-4 mr-1" />Back to Dashboard</g.default><h1 className="text-2xl font-bold text-gray-900">Support Center</h1><p className="text-gray-500">Get help with your account and services</p></div><button onClick={() => P(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20"><a.Plus className="w-5 h-5" />New Ticket</button></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-1 space-y-4"><div className="bg-gradient-to-br from-[#0a0e27] to-[#1a235e] rounded-2xl p-6 text-white relative overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" /><div className="relative z-10"><p className="text-blue-200 text-sm font-medium mb-1">Total Tickets</p><h2 className="text-3xl font-bold">{b.length}</h2><div className="flex gap-4 mt-4 text-xs"><div><span className="text-yellow-300">{b.filter(e => e.status === "open").length}</span><span className="text-blue-200 ml-1">Open</span></div><div><span className="text-green-300">{b.filter(e => e.status === "resolved").length}</span><span className="text-blue-200 ml-1">Resolved</span></div></div></div></div><div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"><div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Your Tickets</h3></div><div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">{N ? <div className="p-8 text-center"><c.Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" /></div> : b.length === 0 ? <div className="p-8 text-center text-gray-500"><d.Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No tickets yet</p><p className="text-sm">Create one to get started</p></div> : b.map(e => {
                  let r = X(e.status);
                  let _Component = r.icon;
                  return <div onClick={() => H(e)} className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${j?.id === e.id ? "bg-blue-50 border-l-4 border-blue-600" : ""}`} key={e.id}><div className="flex items-start justify-between gap-2"><h4 className="font-medium text-gray-900 line-clamp-1">{e.subject}</h4><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${r.color}`}><_Component className="w-3 h-3" />{r.label}</span></div><p className="text-sm text-gray-500 mt-1">{Q(e.created_at)}</p></div>;
                })}</div></div></div><div className="lg:col-span-2">{S ? <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex items-center justify-center"><c.Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div> : j ? <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]"><div className="p-4 border-b border-gray-100 bg-gray-50"><div className="flex items-center gap-3 mb-2"><button onClick={() => w(null)} className="lg:hidden p-1 hover:bg-gray-200 rounded-lg transition-colors"><o.ArrowLeft className="w-5 h-5" /></button><h3 className="font-semibold text-gray-900">{j.subject}</h3></div><div className="flex items-center gap-3"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${X(j.status).color}`}>{X(j.status).label}</span><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${J(j.priority).color}`}>{J(j.priority).label} Priority</span><span className="text-xs text-gray-500">Created {Q(j.created_at)}</span></div></div><div className="flex-1 overflow-y-auto p-4 space-y-4">{j.messages?.map(e => <div className={`flex ${e.sender_type === "user" ? "justify-end" : "justify-start"}`} key={e.id}><div className={`max-w-[80%] ${e.sender_type === "user" ? "bg-blue-600 text-white rounded-2xl rounded-br-md" : "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md"} p-4`}><p className="text-sm whitespace-pre-wrap">{e.content || e.message}</p><p className={`text-xs mt-2 ${e.sender_type === "user" ? "text-blue-200" : "text-gray-500"}`}>{e.sender_type === "admin" && <span className="font-medium">Support Team • </span>}{Q(e.created_at)}</p></div></div>)}<div ref={L} /></div>{j.status !== "closed" && <form onSubmit={K} className="p-4 border-t border-gray-100 bg-gray-50"><div className="flex gap-2"><input type="text" value={M} onChange={e => A(e.target.value)} placeholder="Type your message..." className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" /><button type="submit" disabled={T || !M.trim()} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">{T ? <c.Loader2 className="w-5 h-5 animate-spin" /> : <i.Send className="w-5 h-5" />}</button></div></form>}{j.status === "closed" && <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-gray-500 text-sm">This ticket has been closed</div>}</div> : <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col items-center justify-center text-gray-500"><s.MessageCircle className="w-16 h-16 text-gray-300 mb-4" /><p className="font-medium">Select a ticket to view conversation</p><p className="text-sm">Or create a new ticket to get started</p></div>}</div></div></main>{C && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"><div className="p-6 border-b border-gray-100 bg-gray-50"><h3 className="text-lg font-bold text-gray-900">Create New Support Ticket</h3><p className="text-sm text-gray-500">Describe your issue and we'll get back to you soon</p></div><form onSubmit={q} className="p-6 space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><input type="text" value={E} onChange={e => I(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Brief description of your issue" required={true} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select value={R} onChange={e => $(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"><option value="low">Low - General question</option><option value="medium">Medium - Need assistance</option><option value="high">High - Important issue</option><option value="urgent">Urgent - Critical problem</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label><textarea value={U} onChange={e => F(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none" placeholder="Please describe your issue in detail..." required={true} /></div><div className="flex gap-3 pt-2"><button type="button" onClick={() => P(false)} className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">Cancel</button><button type="submit" disabled={z} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">{z ? <React.Fragment><c.Loader2 className="w-4 h-4 animate-spin" />Creating...</React.Fragment> : "Create Ticket"}</button></div></form></div></div>}</div>;
  }
  
export default y;
