'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, FileText, Settings, Loader2, Check } from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard.jsx';

// --- Constants & Mock Data ---

// NOTE: The HTML must be highly resilient for email clients (inline CSS, table layout).
const WAITLIST_WELCOME_HTML = `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Welcome to Nest</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Base Reset */
        html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; background-color: #0f172a; }
        * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        div[style*="margin: 16px 0"] { margin: 0 !important; }
        table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; border-collapse: collapse !important; }
        table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
        img { -ms-interpolation-mode: bicubic; }
        a { text-decoration: none; }

        /* Typography */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0; }

        /* Mobile */
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .content-padding { padding: 32px 24px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-center { text-align: center !important; }
        }
    </style>
</head>
<body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #0f172a;">
    <center style="width: 100%; background-color: #0f172a;">
        <!-- Preview Text -->
        <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
            You're on the list. Here's what happens next.
        </div>

        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <!-- Main Container -->
                    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden;">

                        <!-- Header -->
                        <tr>
                            <td class="content-padding" style="padding: 48px 48px 0;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td align="left">
                                            <!-- Simple Logo -->
                                            <span style="font-size: 24px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">Nest</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top: 24px;">
                                            <img src="https://nestwealth.com/email-header.png" width="100%" alt="Nest Wealth" style="display: block; max-width: 100%; height: auto; border-radius: 8px;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                            <td class="content-padding" style="padding: 32px 48px 48px;">
                                <h1 style="margin: 0 0 24px; font-size: 24px; line-height: 32px; font-weight: 600; color: #ffffff; letter-spacing: -0.5px;">
                                    Welcome to the waitlist.
                                </h1>

                                <p style="margin: 0 0 24px; font-size: 16px; line-height: 26px; color: #cbd5e1;">
                                    Hi [User Name],
                                </p>

                                <p style="margin: 0 0 24px; font-size: 16px; line-height: 26px; color: #cbd5e1;">
                                    Thank you for your interest in Nest. We've confirmed your spot on our waitlist.
                                </p>

                                <p style="margin: 0 0 24px; font-size: 16px; line-height: 26px; color: #cbd5e1;">
                                    We are currently rolling out access to new members on a weekly basis to ensure the best possible experience. You will receive an email from us as soon as your account is ready to be activated.
                                </p>

                                <!-- Divider -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 12px 0 36px; border-bottom: 1px solid #334155;"></td>
                                    </tr>
                                </table>

                                <!-- Referral Section -->
                                <p style="margin: 36px 0 16px; font-size: 14px; font-weight: 600; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
                                    Move up the list
                                </p>

                                <p style="margin: 0 0 24px; font-size: 15px; line-height: 24px; color: #cbd5e1;">
                                    Want to get access sooner? Invite a friend or partner to join Nest. You'll both receive priority status when they sign up.
                                </p>

                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td style="border-radius: 6px; background-color: #ffffff;">
                                            <a href="[UNIQUE_REFERRAL_LINK]" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #0f172a; text-decoration: none; border-radius: 6px; background-color: #ffffff; border: 1px solid #e2e8f0;">
                                                Copy Invite Link
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 0 48px 48px; background-color: #1e293b;">
                                <p style="margin: 0; font-size: 12px; line-height: 20px; color: #64748b;">
                                    &copy; 2024 Nest Finance Inc.<br>
                                    <a href="#" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> &nbsp;|&nbsp; <a href="#" style="color: #64748b; text-decoration: underline;">Privacy Policy</a>
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

const TEMPLATES = [
  {
    id: 'waitlist-welcome',
    name: 'Waitlist: Welcome',
    desc: 'Sent immediately after sign-up via the landing page form.',
    html: WAITLIST_WELCOME_HTML,
  },
  {
    id: 'onboarding-launch',
    name: 'Onboarding: Launch Invite',
    desc: 'Sent when the user is moved from the waitlist to an active onboarding wave.',
    html: `
        <body style="margin: 0; padding: 40px; background-color: #0d111d;">
            <center>
                <div style="max-width: 500px; background-color: #1e293b; padding: 30px; border-radius: 16px; border: 1px solid #6366f1;">
                    <h2 style="color: #6366f1; font-family: 'Outfit', sans-serif;">Your Nest is Ready!</h2>
                    <p style="color: #94a3b8; font-size: 16px;">
                        The private link to your collaborative financial operating system is now active.
                    </p>
                    <a href="[DASHBOARD_LINK]" target="_blank" style="display: block; margin-top: 30px; padding: 15px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 10px; font-weight: bold;">
                        Access Your Dashboard →
                    </a>
                </div>
            </center>
        </body>
    `,
  },
  {
    id: 'subscription-alert',
    name: 'Billing: Subscription Alert',
    desc: 'Sent when subscription or billing requires attention.',
    html: `
      <body style="margin: 0; padding: 30px; background-color: #0d111d; font-family: Arial, sans-serif;">
          <center>
              <div style="max-width: 520px; background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: left; color: #e2e8f0;">
                  <h2 style="margin-top: 0; color: #f59e0b;">Subscription Alert</h2>
                  <p style="color: #94a3b8; line-height: 1.6;">
                      We could not process your recent payment. Please update your billing details to keep your Nest services active.
                  </p>
                  <a href="[BILLING_PORTAL_LINK]" target="_blank" style="display: inline-block; margin-top: 16px; padding: 12px 18px; background-color: #f59e0b; color: #0f172a; font-weight: bold; text-decoration: none; border-radius: 10px;">
                      Update Billing →
                  </a>
                  <p style="margin-top: 18px; font-size: 12px; color: #475569;">
                      If you have already updated your information, no action is needed.
                  </p>
              </div>
          </center>
      </body>
    `,
  },
];

export default function EmailTemplateAdminView({ onInteract = () => { } }) {
  const [templates, setTemplates] = useState(TEMPLATES);
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES[0].id);
  const [targetUserEmail, setTargetUserEmail] = useState('test@nest.finance');
  const activeTemplateData = useMemo(() => templates.find((t) => t.id === activeTemplate), [templates, activeTemplate]);
  const [isSending, setIsSending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(null);



  const handleSend = () => {
    if (!activeTemplateData || isSending) return;

    setIsSending(true);
    // Simulate API call to ESP
    setTimeout(() => {
      setIsSending(false);
      setLastSentTime(new Date());
      onInteract(`Sent ${activeTemplateData.name} to ${targetUserEmail}`);
    }, 2000);
  };

  return (
    <div className="pt-2">
      {/* Small padding top to clear header in case of external use */}
      <div className="grid grid-cols-12 gap-6">
        {/* 1. Template Selector (Left Panel) */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <DashboardCard className="p-4 flex items-center justify-between border-0 ring-1 ring-white/5 bg-slate-900/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-indigo-400" /> Templates
            </h3>
            <div className="flex items-center gap-3">

              <Settings size={16} className="text-slate-500 hover:text-white cursor-pointer" onClick={() => onInteract('Open ESP Settings')} />
            </div>
          </DashboardCard>

          <div className="space-y-2">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                onClick={() => setActiveTemplate(template.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${activeTemplate === template.id
                    ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-900/40 text-white'
                    : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60 text-slate-300'
                  }`}
              >
                <h4 className="font-bold text-sm">{template.name}</h4>
                <p className="text-[10px] mt-1 opacity-75">{template.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* 2. Preview & Action Panel (Right Panel) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <DashboardCard className="h-full border-0 ring-1 ring-white/5 bg-[#0B0F19] p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Preview: {activeTemplateData?.name}</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Render Status: OK</span>
            </div>

            {/* Email Preview Frame */}
            <div className="relative w-full h-[600px] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                srcDoc={activeTemplateData?.html}
                title="Email Preview"
                width="100%"
                height="100%"
                frameBorder="0"
                // sandbox restricts features, important for HTML emails
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                className="w-full h-full"
              />
            </div>

            {/* Send Action Panel */}
            <div className="mt-8 pt-6 border-t border-white/5 bg-slate-950/40 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <input
                type="email"
                value={targetUserEmail}
                onChange={(e) => setTargetUserEmail(e.target.value)}
                placeholder="Test Email Address (e.g., jane@test.com)"
                className="flex-1 w-full md:w-auto px-4 py-3 rounded-xl bg-slate-800 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />

              <div className="flex items-center gap-4 w-full md:w-auto">
                {lastSentTime && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-[10px] text-emerald-400 flex items-center gap-2"
                  >
                    <Check size={14} /> Last Sent: {lastSentTime.toLocaleTimeString()}
                  </motion.div>
                )}

                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg w-full md:w-auto ${isSending
                      ? 'bg-slate-700 text-slate-400 cursor-wait'
                      : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40'
                    }`}
                >
                  {isSending ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Loader2 size={16} />
                      </motion.div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Test Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
