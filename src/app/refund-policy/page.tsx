import React from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Last updated: 01 February 2026
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-10 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Standard Pass</h2>
              <p>
                All payments under the Standard Pass are final. No refunds, compensation, or challenge fee reimbursement apply under any circumstance.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Guaranteed Pass</h2>
              <p className="mb-3">
                If PropSol fails to pass the selected challenge under agreed conditions, the client is eligible for:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li>100% refund of the PropSol service fee</li>
                <li>Refund of the amount used to purchase the prop firm account</li>
                <li>Additional $100 compensation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Refund Exclusions</h2>
              <p className="mb-3 font-semibold text-amber-400">
                Refunds do NOT apply if failure, delay, reset, suspension, or termination occurs due to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li>Failed or incomplete KYC verification</li>
                <li>Use of VPNs, proxies, VPS, or masked IP addresses</li>
                <li>Login from restricted or unsupported countries</li>
                <li>IP inconsistencies flagged by the prop firm</li>
                <li>Prop firm security or compliance reviews</li>
                <li>Account resets or re-verifications initiated by the prop firm</li>
                <li>Client interference or password changes</li>
                <li>Prop firm rule changes beyond our control</li>
              </ul>
              <p className="mt-4 text-slate-300">
                Refund processing time is 7–14 business days after verification.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
