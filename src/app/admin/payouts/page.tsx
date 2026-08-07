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

const a = createProxy();
  const t = createProxy();
  const s = createProxy();
  const r = createProxy();
  const l = createProxy();
  const i = createProxy();
  const n = createProxy();
  const d = createProxy();
  function c() {
    let [e, c] = useState([]);
    let [o, x] = useState([]);
    let [m, p] = useState(true);
    let [u, h] = useState(null);
    let [y, f] = useState("");
    let [g, b] = useState(null);
    let [w, j] = useState("pending");
    let [N, v] = useState(null);
    let [A, k] = useState("");
    useEffect(() => {
      _();
    }, []);
    let _ = async () => {
      try {
        let e = await s.walletService.getAdminWithdrawals();
        let a = e.filter(e => e.status === "pending");
        let t = e.filter(e => e.status !== "pending");
        c(a);
        x(t);
      } catch (e) {
        console.error("Failed to fetch data:", e);
        r.toast.error("Failed to load payouts data");
      } finally {
        p(false);
      }
    };
    let S = async e => {
      if (confirm("Are you sure you want to approve this withdrawal? This will initiate a payout.")) {
        b(e);
        try {
          let a = await s.walletService.approveWithdrawal(e);
          r.toast.success("Payout initiated! Please verify with 2FA.");
          h(a.batch_withdrawal_id);
        } catch (e) {
          console.error("Approval failed:", e);
          r.toast.error(e.response?.data?.detail || "Failed to approve withdrawal");
        } finally {
          b(null);
        }
      }
    };
    let C = async e => {
      e.preventDefault();
      if (N) {
        b(N);
        try {
          await s.walletService.updateWithdrawalStatus(N, {
            status: "rejected",
            rejection_reason: A || "Admin rejected"
          });
          r.toast.success("Withdrawal rejected successfully");
          v(null);
          _();
        } catch (e) {
          console.error("Rejection failed:", e);
          r.toast.error(e.response?.data?.detail || "Failed to reject withdrawal");
        } finally {
          b(null);
        }
      }
    };
    let P = async e => {
      e.preventDefault();
      if (u && y) {
        b("verifying");
        try {
          await s.walletService.verifyPayout(u, y);
          r.toast.success("Payout verified successfully!");
          h(null);
          f("");
          _();
        } catch (e) {
          console.error("Verification failed:", e);
          r.toast.error(e.response?.data?.detail || "Verification failed");
        } finally {
          b(null);
        }
      }
    };
    return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Payout Management</h2><p className="text-slate-500">Manage and verify withdrawal requests.</p></div></div>{N && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"><div className="p-6 border-b border-gray-100 bg-red-50"><h3 className="text-lg font-bold text-red-900 flex items-center gap-2"><i.XCircle className="w-5 h-5" />Reject Withdrawal</h3><p className="text-sm text-red-700 mt-1">Please provide a reason for rejecting this withdrawal request. This will be visible to the user.</p></div><form onSubmit={C} className="p-6 space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label><textarea value={A} onChange={e => k(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 outline-none min-h-[100px] resize-none" placeholder="e.g., Invalid wallet address, Suspicious activity..." autoFocus={true} required={true} /></div><div className="flex gap-3"><button type="button" onClick={() => v(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={g === N} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-70">{g === N ? "Rejecting..." : "Confirm Rejection"}</button></div></form></div></div>}{u && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"><div className="p-6 border-b border-gray-100 bg-blue-50"><h3 className="text-lg font-bold text-blue-900 flex items-center gap-2"><d.ShieldCheck className="w-5 h-5" />Verify Payout</h3><p className="text-sm text-blue-700 mt-1">Enter the 2FA code sent to your email/authenticator to confirm this payout batch.</p></div><form onSubmit={P} className="p-6 space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label><input type="text" value={y} onChange={e => f(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-widest font-mono" placeholder="000000" autoFocus={true} required={true} /></div><div className="flex gap-3"><button type="button" onClick={() => h(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button><button type="submit" disabled={g === "verifying"} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-70">{g === "verifying" ? "Verifying..." : "Verify Payout"}</button></div></form></div></div>}<div className="flex border-b border-gray-200"><button onClick={() => j("pending")} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${w === "pending" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Pending Requests ({e.length})</button><button onClick={() => j("history")} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${w === "history" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Payout History</button></div><div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50/80 text-xs text-slate-500 uppercase"><tr><th className="px-6 py-4 font-medium">User</th><th className="px-6 py-4 font-medium">Amount</th><th className="px-6 py-4 font-medium">Method</th><th className="px-6 py-4 font-medium">Status</th><th className="px-6 py-4 font-medium">Created At</th><th className="px-6 py-4 font-medium text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{m ? <tr><td colSpan={6} className="px-6 py-12 text-center"><n.Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" /></td></tr> : w === "pending" ? e.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500"><p>No pending withdrawals</p></td></tr> : e.map(e => <tr className="hover:bg-slate-50/50 transition-colors" key={e.id}><td className="px-6 py-4"><div className="flex flex-col"><span className="font-medium text-slate-900">{e.user_name || "Unknown User"}</span><span className="text-xs text-slate-500">{e.user_email}</span></div></td><td className="px-6 py-4 font-bold text-slate-900">${e.amount.toFixed(2)}</td><td className="px-6 py-4"><div className="flex flex-col"><span className="capitalize font-medium">{e.payment_method.replace("_", " ")}</span>{e.payment_method === "crypto" && <span className="text-xs text-gray-500 font-mono">{e.crypto_network} • {e.crypto_wallet_address?.slice(0, 6)}...</span>}</div></td><td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><l.Clock className="w-3 h-3" /> {e.status}</span></td><td className="px-6 py-4 text-slate-500">{new Date(e.created_at).toLocaleDateString()}</td><td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => {
                      v(e.id);
                      k("");
                    }} disabled={g === e.id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">Reject</button><button onClick={() => S(e.id)} disabled={g === e.id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">{g === e.id ? "Processing..." : "Approve"}</button></div></td></tr>) : o.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500"><p>No payout history found</p></td></tr> : o.map(e => <tr className="hover:bg-slate-50/50 transition-colors" key={e.id}><td className="px-6 py-4"><div className="flex flex-col"><span className="font-medium text-slate-900">{e.user_name || "Unknown User"}</span><span className="text-xs text-slate-500">{e.user_email}</span></div></td><td className="px-6 py-4 font-bold text-slate-900">${e.amount.toFixed(2)}</td><td className="px-6 py-4"><div className="flex flex-col"><span className="capitalize font-medium">{e.payment_method?.replace("_", " ") || "Crypto"}</span>{e.payment_method === "crypto" && <span className="text-xs text-gray-500 font-mono">{e.crypto_network} • {e.crypto_wallet_address?.slice(0, 6)}...</span>}</div></td><td className="px-6 py-4"><span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${e.status === "completed" || e.status === "approved" ? "bg-green-100 text-green-800" : e.status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>{e.status}</span></td><td className="px-6 py-4 text-slate-500">{new Date(e.created_at).toLocaleDateString()}</td><td className="px-6 py-4 text-right" /></tr>)}</tbody></table></div></div></div>;
  }
  
export default c;
