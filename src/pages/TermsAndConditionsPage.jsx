import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Shield, Globe, Lock, FileText, Server, Users } from 'lucide-react';
import TopNav from '../components/TopNav';
import Starfield from '../components/experience/Starfield';

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-12 p-8 rounded-3xl border border-white/5 bg-white/[0.02]"
  >
    <h3 className="text-xl font-bold text-white mb-4 font-display">{title}</h3>
    <div className="text-slate-300 leading-relaxed space-y-4 text-sm md:text-base">
      {children}
    </div>
  </motion.div>
);

export default function TermsAndConditionsPage({ onNavigate }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <TopNav onNavigate={onNavigate} />

      <div className="fixed inset-0 z-0">
        <Starfield density={1000} speed={0.2} reducedMotion={true} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950 pointer-events-none" />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:px-12">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 text-emerald-400">
            <Scale size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-2">Terms of Service</h1>
          <p className="text-slate-400">Last Updated: November 26, 2025</p>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Governed by the laws of England and Wales</p>
        </div>

        <Section title="1. Introduction and Definitions">
          <p>
            These Terms constitute a binding agreement between you and <strong>Nest Finance Ltd</strong> (registered in England and Wales). Nest acts as the technical operator of the Nest application and provides an interface-only experience for your financial data.
          </p>
          <p>
            <strong>Regulatory Status:</strong> Nest is an unregulated technical service provider. We integrate with regulated Open Banking providers (such as Plaid Financial Ltd or TrueLayer Ltd) to display your data; we do not perform regulated payment services directly.
          </p>
        </Section>

        <Section title="2. Access to Financial Data">
          <div className="flex gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-4">
            <Server className="shrink-0 text-indigo-400" />
            <p className="text-xs text-indigo-200">
              <strong>Interface Only:</strong> Nest displays data received via your consented sessions. We neither receive nor store your online banking credentials.
            </p>
          </div>
          <h4 className="font-bold text-white mb-2">2.1 Consent and Token Exchange</h4>
          <p>
            Nest shall only receive account data through active, user-consented sessions. Access is facilitated through a secure OAuth-style token exchange between you and the FCA-authorised Open Banking provider.
          </p>
          <p>
            Periodic re-consent is required by the Open Banking provider in accordance with regulation; Nest does not control token expiry.
          </p>
        </Section>

        <Section title="3. The Zero-Knowledge Vault">
          <div className="flex gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl my-4">
            <Lock className="shrink-0 text-rose-400" />
            <p className="text-xs text-rose-200">
              <strong>NO RECOVERY POLICY:</strong> If you lose your Master Password, your Vault data is permanently lost. Nest cannot recover it because we do not store your decryption keys.
            </p>
          </div>
          <p>
            The Vault encrypts data on your device before it reaches Nest. All encryption keys are derived from your Master Password and remain solely in your control.
          </p>
        </Section>

        <Section title="4. Household &amp; Family Features">
          <h4 className="flex items-center gap-2 font-bold text-white mb-2">
            <Users size={16} /> Individual Consent
          </h4>
          <p>
            You cannot grant consent on behalf of another adult. Invited partners must accept their own invitations and connect their banking credentials independently.
          </p>
          <p>
            Nest is a neutral platform. We do not mediate domestic disputes or partition accounts without a valid court order.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <h4 className="flex items-center gap-2 font-semibold text-white mb-2">
            <FileText size={16} /> Ownership
          </h4>
          <p>
            Nest Finance Ltd retains all rights in the application code, the “Wealth OS” design system, and proprietary scoring logic that powers our dashboards.
          </p>
          <p>
            You may not reverse-engineer, copy, or replicate our interface assets or unique functional traits to build a competing product.
          </p>
        </Section>

        <Section title="6. Liability &amp; Breach Notification">
          <h4 className="flex items-center gap-2 font-semibold text-white mb-2">
            <Shield size={16} /> Liability Exclusions
          </h4>
          <p>
            Nest is not liable for financial losses arising from user decisions, investment assumptions, or third-party provider downtime.
          </p>
          <h4 className="font-semibold text-white mt-5 mb-2">6.2 Breach Notification</h4>
          <p>
            If a confirmed data breach impacting your financial information occurs, Nest will notify affected users within 72 hours and report to the ICO when required under UK data protection laws.
          </p>
        </Section>

        <Section title="7. Governing Law">
          <p>
            These Terms are governed by the laws of <strong>England and Wales</strong>. The courts of England and Wales have exclusive jurisdiction over any disputes.
          </p>
        </Section>

        <div className="border-t-2 border-white/10 pt-12 mt-12">
          <div className="flex items-center gap-2 mb-6 text-slate-400">
            <Globe size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">United States Addendum</span>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-xs text-slate-400 italic mb-4">
              These provisions apply only if you are accessing the Service from the United States.
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm text-slate-300">
              <li><strong>Governing Law:</strong> State of Delaware.</li>
              <li><strong>Arbitration:</strong> Binding arbitration administered by the American Arbitration Association (AAA).</li>
              <li><strong>Class Action Waiver:</strong> You agree to resolve disputes on an individual basis.</li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
