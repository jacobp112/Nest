import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Database, Mail, Cookie, FileCheck, Users } from 'lucide-react';
import TopNav from '../components/TopNav';
import Starfield from '../components/experience/Starfield';

const PolicyPoint = ({ icon: Icon, title, text }) => (
  <div className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
    <div className="shrink-0 p-3 bg-slate-900 rounded-xl h-fit text-slate-400">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  </div>
);

export default function PrivacyPolicyPage({ onNavigate }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <TopNav onNavigate={onNavigate} />

      <div className="fixed inset-0 z-0">
        <Starfield density={1000} speed={0.2} reducedMotion={true} />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950 pointer-events-none" />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 text-indigo-400">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-display mb-4">Data Protection &amp; Privacy</h1>
          <p className="text-slate-400">Compliance with UK GDPR and the Data Protection Act 2018.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-16">
          <PolicyPoint
            icon={Database}
            title="Controller Status"
            text="Nest Finance Ltd is the Data Controller for your account information. Open Banking providers act as independent controllers for the separate banking connection."
          />
          <PolicyPoint
            icon={Users}
            title="Household Privacy"
            text="Inviting a partner does not automatically share data. They must accept the invite and provide independent consent before their institutions are connected on Nest."
          />
          <PolicyPoint
            icon={Lock}
            title="Zero-Knowledge Vault"
            text="Vault entries are encrypted client-side and Nest acts as the Processor for storage. We technically cannot decrypt the content."
          />
          <PolicyPoint
            icon={FileCheck}
            title="No Onward Sale"
            text="Nest does not sell your data. Providers accessed through Nest are contractually prohibited from using any data pulled via our application for advertising."
          />
        </div>

        <section className="space-y-4 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4 font-display">1. Information We Collect</h3>
          <ul className="space-y-2 text-slate-300 list-disc pl-5">
            <li><strong>Identity data:</strong> Name, email, household role.</li>
            <li><strong>Financial data:</strong> Balances, transactions, and holdings pulled via Open Banking (Plaid/TrueLayer).</li>
            <li><strong>Vault data:</strong> Encrypted blobs stored for you; we never inspect the decrypted content.</li>
          </ul>
        </section>

        <section className="space-y-4 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4 font-display">2. Your Rights</h3>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-emerald-400" />
              <div>
                <h4 className="text-white font-bold">Right to Erasure</h4>
                <p className="text-sm text-slate-400">Request full account deletion. Vault data deletion is cryptographic and irreversible.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileCheck size={18} className="text-indigo-400" />
              <div>
                <h4 className="text-white font-bold">Right to Portability</h4>
                <p className="text-sm text-slate-400">Export your transaction history and net worth logs as CSV anytime.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users size={18} className="text-slate-300" />
              <div>
                <h4 className="text-white font-bold">Revocation of Consent</h4>
                <p className="text-sm text-slate-400">Unlink bank accounts instantly via Settings, and remove household connections individually.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4 font-display">3. Cookies &amp; Communications</h3>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Cookie size={18} className="text-amber-400" />
              <p className="text-sm text-slate-300">
                We use essential cookies to stabilize sessions, remember settings, and keep the UI responsive. No tracking cookies are used for advertising.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-sky-400" />
              <p className="text-sm text-slate-300">
                Administrative emails (account, billing, security) are sent from Nest addresses. You control promotional opt-in preferences inside Settings.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-12">
          <h3 className="text-2xl font-bold text-white mb-4 font-display">4. Data Retention &amp; Security</h3>
          <p className="text-sm text-slate-300">
            We retain account data for as long as needed to provide the Service. Vault backups are retained until you delete them. We keep audit logs for troubleshooting and compliance purposes.
          </p>
          <p className="text-sm text-slate-300">
            We implement industry-standard safeguards (TLS, encryption-at-rest, SOC2 controls) and regularly review providers for compliance with GDPR and UK data protection law.
          </p>
        </section>

      </main>
    </div>
  );
}
