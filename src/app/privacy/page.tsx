import React from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Header />
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-slate-400 text-sm sm:text-base">
              At PropSol, we value your privacy. This policy outlines how we collect, use, and protect your personal information.
            </p>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-10 space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">1. Introduction</h2>
              <p className="mb-3">
                These Terms and Conditions (&quot;Agreement&quot;) govern the use of services provided by PropSol (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p className="mb-3">
                By accessing our website or purchasing any service offered by PropSol, you (&quot;Client,&quot; &quot;you,&quot; or &quot;your&quot;) agree to be bound by these Terms and Conditions.
              </p>
              <p>
                If you do not agree with any part of this Agreement, you must not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">2. Nature of Service</h2>
              <p className="mb-3">PropSol provides prop firm challenge assistance services.</p>
              <p className="mb-2">We do not:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-400">
                <li>Operate as a broker</li>
                <li>Provide investment advisory services</li>
                <li>Manage client funds</li>
                <li>Accept deposits for trading</li>
                <li>Guarantee profits</li>
              </ul>
              <p>
                Our service is strictly limited to assisting clients with prop firm challenge completion under agreed conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">3. No Affiliation With Prop Firms</h2>
              <p className="mb-3">
                PropSol is not affiliated, partnered, endorsed, or sponsored by any proprietary trading firm, including but not limited to FTMO, FundedNext, FundingPips, or any other prop firm.
              </p>
              <p className="mb-3">
                All prop firms are independent third-party entities with their own rules and approval processes.
              </p>
              <p>
                Final account approval remains solely at the discretion of the respective prop firm.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">4. Client Responsibilities</h2>
              <p className="mb-2">By purchasing any PropSol service, you confirm that:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-400">
                <li>You are the lawful owner of the prop firm account</li>
                <li>You have legal authority to provide login credentials</li>
                <li>You understand prop firm rules and objectives</li>
                <li>You accept all risks associated with proprietary trading challenges</li>
              </ul>
              <p>
                You are responsible for ensuring that your prop firm account is valid and complies with the firm’s terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">5. Service Types</h2>
              <p className="mb-3">PropSol offers two service categories:</p>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">5.1 Standard Pass</h3>
              <p className="mb-2">The Standard Pass is a non-refundable service.</p>
              <p className="mb-2">Includes:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-400">
                <li>Challenge execution assistance</li>
                <li>Rule-compliant trading framework</li>
                <li>Support communication</li>
              </ul>
              <p className="mb-2 font-semibold text-amber-400">Important:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4 text-slate-400">
                <li>No refunds under any circumstance</li>
                <li>No compensation</li>
                <li>No challenge fee reimbursement</li>
              </ul>
              <p className="mb-4">
                If the challenge fails for any reason, the service is considered completed.
              </p>

              <h3 className="text-lg font-semibold text-blue-400 mb-2">5.2 Guaranteed Pass</h3>
              <p className="mb-2">The Guaranteed Pass includes a conditional refund policy.</p>
              <p className="mb-2">If PropSol fails to pass the challenge under agreed conditions, you are eligible for:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-400">
                <li>100% refund of the PropSol service fee</li>
                <li>Refund of the amount used to purchase the prop firm account</li>
                <li>Additional $100 compensation</li>
              </ul>
              <p className="mb-2 font-semibold text-slate-300">Refund eligibility applies only if:</p>
              <ul className="list-disc pl-5 space-y-1 mb-3 text-slate-400">
                <li>No interference occurs on the account</li>
                <li>Login credentials remain unchanged</li>
                <li>No external trades are placed by the client</li>
                <li>Prop firm rules are not modified mid-challenge</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">6. Confidentiality & Security</h2>
              <p className="mb-3">All client information is treated as strictly confidential.</p>
              <p>
                We do not sell, rent, or disclose personal data except where required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">7. Contact Information</h2>
              <p className="mb-2">For privacy inquiries:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Email: Hello@propfirmsol.com</li>
                <li>Website: www.propfirmsol.com</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
