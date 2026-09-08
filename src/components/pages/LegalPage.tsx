import React, { useState } from 'react';
import { Shield, FileText, Lock, RefreshCw, Mail, Phone, MapPin, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../../config/tournamentConfig';

export type LegalTab = 'terms' | 'privacy' | 'refunds' | 'contact';

interface LegalPageProps {
  initialTab?: LegalTab;
  onNavigate?: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'terms', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#091230] via-[#0D1A45] to-[#091230] border border-[#1A2C68] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] text-xs font-mono font-bold tracking-wider uppercase mb-3">
                <Shield className="w-3.5 h-3.5" />
                <span>LEGAL, COMPLIANCE & POLICIES</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                BidWar Premier League — Season 01
              </h1>
              <p className="text-sm text-slate-400 font-mono mt-1">
                Official Tournament Property of{' '}
                <a
                  href={TOURNAMENT_CONFIG.BIDWAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FFB800] hover:underline inline-flex items-center gap-1"
                >
                  <span>bidwar.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                · Managed by KV TechMedia
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/register')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#E6A600] text-slate-950 font-bold text-xs uppercase tracking-wider font-mono hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#FFB800]/20"
              >
                <span>Register Team</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-[#1A2C68] pb-4 mb-8 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#FFB800] text-slate-950 shadow-md shadow-[#FFB800]/20'
                : 'bg-[#091230] text-slate-300 hover:text-white border border-[#1A2C68] hover:border-slate-500'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms & Conditions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#FFB800] text-slate-950 shadow-md shadow-[#FFB800]/20'
                : 'bg-[#091230] text-slate-300 hover:text-white border border-[#1A2C68] hover:border-slate-500'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('refunds')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'refunds'
                ? 'bg-[#FFB800] text-slate-950 shadow-md shadow-[#FFB800]/20'
                : 'bg-[#091230] text-slate-300 hover:text-white border border-[#1A2C68] hover:border-slate-500'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refund & Cancellation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#FFB800] text-slate-950 shadow-md shadow-[#FFB800]/20'
                : 'bg-[#091230] text-slate-300 hover:text-white border border-[#1A2C68] hover:border-slate-500'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Contact & Support</span>
          </button>
        </div>

        {/* TAB 1: TERMS AND CONDITIONS */}
        {activeTab === 'terms' && (
          <div className="bg-[#050A1C] border border-[#1A2C68] rounded-2xl p-6 sm:p-10 space-y-8 font-sans leading-relaxed">
            <div className="border-b border-[#1A2C68] pb-6">
              <h2 className="text-2xl font-bold font-display text-white">Terms and Conditions</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Last Updated: 8 September 2026 · Effective for BidWar Premier League — Kids Version Season 1
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#FFB800] font-mono uppercase tracking-wider flex items-center gap-2">
                <span>1. Introduction & Acceptance of Terms</span>
              </h3>
              <p className="text-sm text-slate-300">
                Welcome to the official registration portal for <strong>BidWar Premier League (BPL) — Kids Version Season 1</strong> (&quot;Tournament&quot;), organized and operated by <strong>KV TechMedia</strong> in partnership with <strong>BidWar</strong> (&quot;bidwar.in&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing this portal, submitting team or player registrations, or paying the entry fees via Cashfree or official banking channels, you (&quot;Participant&quot;, &quot;Team Mentor&quot;, &quot;School / Academy Authority&quot;, or &quot;Parent / Legal Guardian&quot;) agree to be legally bound by these Terms and Conditions.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#FFB800] font-mono uppercase tracking-wider flex items-center gap-2">
                <span>2. Eligibility & Strict Division Rules</span>
              </h3>
              <p className="text-sm text-slate-300">
                The tournament consists of two strictly segregated age/class divisions:
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc marker:text-[#FFB800]">
                <li>
                  <strong>Class 4–5–6 Division:</strong> All registered players must be bona fide students currently enrolled in Grade/Class 4, 5, or 6.
                </li>
                <li>
                  <strong>Class 7–8–9 Division:</strong> All registered players must be bona fide students currently enrolled in Grade/Class 7, 8, or 9.
                </li>
                <li>
                  <strong>Squad Composition:</strong> Each team must register <strong>EXACTLY 8 PLAYERS</strong>. No substitutes or mid-tournament roster modifications are permitted once the tournament starts.
                </li>
                <li>
                  <strong>Document Verification:</strong> Valid school ID card or municipal birth certificate must be produced upon request by the tournament technical committee prior to the opening match. Any attempt to field over-age or ineligible players results in immediate team disqualification with forfeiture of all fees.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#FFB800] font-mono uppercase tracking-wider flex items-center gap-2">
                <span>3. Registration, Fees & Payment Processing</span>
              </h3>
              <p className="text-sm text-slate-300">
                Participation is confirmed strictly on a first-come, first-served basis upon receipt of authorized payment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#091230] border border-[#1A2C68]">
                  <p className="text-slate-400 uppercase font-bold">Standard Squad Entry</p>
                  <p className="text-xl font-bold text-white mt-1">₹8,000 <span className="text-xs text-slate-400 font-normal">/ team</span></p>
                  <p className="text-[11px] text-slate-400 mt-2">Includes official tournament fixtures, match balls, umpire & scorer fees, and digital score tracking.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#091230] border border-[#FFB800]/30 relative">
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#FFB800]/10 text-[#FFB800] text-[9px] font-bold border border-[#FFB800]/30">RECOMMENDED</span>
                  <p className="text-slate-400 uppercase font-bold">Squad + Team Branding</p>
                  <p className="text-xl font-bold text-[#FFB800] mt-1">₹13,000 <span className="text-xs text-slate-400 font-normal">/ team</span></p>
                  <p className="text-[11px] text-slate-400 mt-2">Includes full entry + 8 customized premium team jerseys with custom names, numbers & association logos.</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                All digital transactions are processed securely through <strong>Cashfree Payments India Pvt. Ltd.</strong>, an RBI-regulated Payment Aggregator. Alternatively, verified Bank Transfer / UPI UTR submissions may be approved manually by the tournament committee.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#FFB800] font-mono uppercase tracking-wider flex items-center gap-2">
                <span>4. Code of Conduct, Safety & Fair Play</span>
              </h3>
              <p className="text-sm text-slate-300">
                All mentors, coaches, parents, and young athletes are expected to uphold the highest standards of sportsmanship. Abusive behavior, dissent towards match officials, or physical misconduct will result in immediate ejection from the tournament arena. The decision of the Tournament Disciplinary Committee and appointed BCCI-certified Box Cricket Umpires shall be final and binding.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#FFB800] font-mono uppercase tracking-wider flex items-center gap-2">
                <span>5. Intellectual Property & Media Broadcast Consent</span>
              </h3>
              <p className="text-sm text-slate-300">
                By registering, mentors and guardians grant BidWar and KV TechMedia the irrevocable right to photograph, film, and broadcast match coverage, player statistics, and team branding across official web portals, live scoring platforms, and verified social media channels for tournament promotion and sports archives.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-[#FFB800] font-mono uppercase tracking-wider flex items-center gap-2">
                <span>6. Limitation of Liability & Medical Disclaimer</span>
              </h3>
              <p className="text-sm text-slate-300">
                Cricket is a physical sport. While standard first-aid facilities and medical kits are provided at the tournament venue, the organizers, sponsors, and venue partners shall not be liable for any accidental physical injuries, loss of personal belongings, or unforeseen health complications sustained during participation.
              </p>
            </section>
          </div>
        )}

        {/* TAB 2: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="bg-[#050A1C] border border-[#1A2C68] rounded-2xl p-6 sm:p-10 space-y-8 font-sans leading-relaxed">
            <div className="border-b border-[#1A2C68] pb-6">
              <h2 className="text-2xl font-bold font-display text-white">Privacy Policy</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Last Updated: 8 September 2026 · Committed to Child Online Safety & Data Protection
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>1. Our Privacy Commitment</span>
              </h3>
              <p className="text-sm text-slate-300">
                BidWar Premier League respects the privacy of our participating youth athletes, their parents, mentors, and school administrators. We handle all personal information with strict security and in full compliance with the Information Technology Act, 2000 and the Digital Personal Data Protection (DPDP) Act, 2023.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>2. Information We Collect</span>
              </h3>
              <p className="text-sm text-slate-300">
                We collect only the necessary information required for tournament accreditation, age verification, emergency safety, and match scoring:
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc marker:text-emerald-400">
                <li>
                  <strong>School / Academy Details:</strong> Institution name, branch, official email, phone number, and institution emblem.
                </li>
                <li>
                  <strong>Mentor / Coach Details:</strong> Full name, mobile number, email address, and coach photograph.
                </li>
                <li>
                  <strong>Player Records:</strong> Full name, grade/class, date of birth (for age-category compliance), parent/guardian contact number, email, player passport photo, jersey number, and cricket role.
                </li>
                <li>
                  <strong>Payment Reference:</strong> Cashfree Gateway Order ID, Payment ID, Bank Reference / UTR. We <strong>NEVER</strong> store complete credit/debit card numbers, CVVs, or NetBanking passwords on our servers.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>3. Public Display vs Private Protection Boundary</span>
              </h3>
              <div className="p-4 rounded-xl bg-[#091230] border border-[#1A2C68] space-y-2 text-xs font-mono">
                <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>STRICT PRIVACY GUARANTEE:</span>
                </p>
                <p className="text-slate-300 leading-normal">
                  Our public teams directory (<code>/api/public/teams</code>) exposes strictly <strong>4 public fields</strong>: Team Name, School/Academy Name, School Logo, and Division Category. All player dates of birth, parent mobile numbers, parent emails, and payment transaction proofs remain strictly private and encrypted behind authenticated mentor login.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>4. Payment Gateway Data Handling</span>
              </h3>
              <p className="text-sm text-slate-300">
                Online payment transactions are processed using 256-bit TLS encryption by <strong>Cashfree Payments India Pvt. Ltd.</strong> Cashfree adheres to strict PCI-DSS Level 1 security standards. Please refer to Cashfree&apos;s privacy policy for details on gateway-level data processing.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>5. No Data Monetization / Third-Party Selling</span>
              </h3>
              <p className="text-sm text-slate-300">
                We do not sell, rent, or trade participant data or children&apos;s personal information to commercial telemarketers, third-party advertising networks, or data brokers under any circumstances.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>6. Contact for Data Correction & Grievances</span>
              </h3>
              <p className="text-sm text-slate-300">
                Parents or school mentors wishing to review, update, or request deletion of their registration records may email our designated Data Protection Desk at <a href="mailto:bpl@bidwar.in" className="text-[#FFB800] underline font-mono">bpl@bidwar.in</a>.
              </p>
            </section>
          </div>
        )}

        {/* TAB 3: REFUND & CANCELLATION POLICY */}
        {activeTab === 'refunds' && (
          <div className="bg-[#050A1C] border border-[#1A2C68] rounded-2xl p-6 sm:p-10 space-y-8 font-sans leading-relaxed">
            <div className="border-b border-[#1A2C68] pb-6">
              <h2 className="text-2xl font-bold font-display text-white">Refund & Cancellation Policy</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Last Updated: 8 September 2026 · Transparent Guidelines for Tournament Registration Fees
              </p>
            </div>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>1. General Registration Fee Policy</span>
              </h3>
              <p className="text-sm text-slate-300">
                The registration fee of <strong>₹8,000 (Standard Entry)</strong> or <strong>₹13,000 (Branded Entry)</strong> is committed directly toward ground reservation, customized team jersey printing, official scoring infrastructure, and live event production upon registration confirmation. Due to the limited slot availability (strictly 16 teams per division), confirmed team registrations are generally <strong>non-cancellable and non-refundable</strong> once tournament fixtures are finalized.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>2. Failed, Duplicate & Interrupted Payment Transactions</span>
              </h3>
              <div className="p-4 rounded-xl bg-[#091230] border border-[#1A2C68] space-y-2 text-xs font-mono">
                <p className="text-white font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#FFB800]" />
                  <span>AUTOMATIC BANK REFUND FOR GATEWAY FAILURES:</span>
                </p>
                <p className="text-slate-300 leading-normal">
                  If an amount is debited from your bank account, card, or UPI app, but the registration page encounters a network error or shows payment failure:
                </p>
                <ul className="pl-4 list-disc space-y-1 text-slate-300">
                  <li>Our backend authoritative verification system automatically checks Cashfree server records within minutes.</li>
                  <li>If the order is successfully captured, your team registration is automatically marked <strong>VERIFIED</strong> with no extra charge.</li>
                  <li>If the transaction is aborted or refunded by the gateway, the entire debited amount is returned to the original payment method by Cashfree within <strong>5 to 7 working days</strong> as per standard banking protocol.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>3. Tournament Postponement & Inclement Weather</span>
              </h3>
              <p className="text-sm text-slate-300">
                In the event of severe weather, rain, government directives, or force majeure events making gameplay unsafe on 3–4 October 2026:
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc marker:text-sky-400">
                <li>Matches will be rescheduled to backup weekend dates announced by the organizing committee.</li>
                <li>All team registrations, jerseys, and seedings will be automatically carried forward.</li>
                <li>In the unlikely event that the tournament is completely cancelled with no alternate dates feasible, a full refund (minus any customized jersey manufacturing costs already incurred) will be credited within 10–14 business days.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-base font-bold text-sky-400 font-mono uppercase tracking-wider flex items-center gap-2">
                <span>4. Refund Dispute Procedure</span>
              </h3>
              <p className="text-sm text-slate-300">
                For any payment queries, duplicate charge reports, or transaction issues, please email <a href="mailto:bpl@bidwar.in" className="text-[#FFB800] underline font-mono">bpl@bidwar.in</a> with:
              </p>
              <ul className="space-y-1 text-xs font-mono text-slate-300 pl-4 list-disc marker:text-[#FFB800]">
                <li>Cashfree Order ID (e.g., <code>BPL_1725830000_ABC</code>)</li>
                <li>Registered Team Name & Mentor Mobile Number</li>
                <li>Bank UTR / Transaction Reference Number</li>
              </ul>
              <p className="text-xs text-slate-400 font-mono mt-2">
                Our payment reconciliation team will investigate and respond with written resolution within <strong>24 to 48 business hours</strong>.
              </p>
            </section>
          </div>
        )}

        {/* TAB 4: CONTACT & SUPPORT */}
        {activeTab === 'contact' && (
          <div className="bg-[#050A1C] border border-[#1A2C68] rounded-2xl p-6 sm:p-10 space-y-8 font-sans leading-relaxed">
            <div className="border-b border-[#1A2C68] pb-6">
              <h2 className="text-2xl font-bold font-display text-white">Contact & Support Details</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Official Merchant Identity & Tournament Operations Desk
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Merchant Contact Details */}
              <div className="p-6 rounded-xl bg-[#091230] border border-[#1A2C68] space-y-4">
                <h3 className="text-xs font-bold text-[#FFB800] font-mono uppercase tracking-widest">
                  OPERATIONS & ORGANIZER DESK
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-[#FFB800] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">BidWar Premier League (BPL)</p>
                      <p className="text-xs text-slate-400 mt-0.5">Varanasi, Uttar Pradesh, India</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Mail className="w-5 h-5 text-[#FFB800] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Official Tournament Email</p>
                      <a href="mailto:bpl@bidwar.in" className="text-white hover:text-[#FFB800] font-mono text-sm transition-colors">
                        bpl@bidwar.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="w-5 h-5 text-[#FFB800] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Tournament Helpline Number</p>
                      <a href="tel:+918707488250" className="text-white hover:text-[#FFB800] font-mono text-sm transition-colors font-bold">
                        +91 87074 88250
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Property & Online Channels */}
              <div className="p-6 rounded-xl bg-[#091230] border border-[#1A2C68] space-y-4">
                <h3 className="text-xs font-bold text-sky-400 font-mono uppercase tracking-widest">
                  EVENT PARTNER & PLATFORMS
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#050A1C] border border-[#1A2C68]/60">
                    <p className="text-slate-400 text-[11px]">Event Partner & Official Portal</p>
                    <a
                      href={TOURNAMENT_CONFIG.BIDWAR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFB800] hover:underline font-bold text-sm inline-flex items-center gap-1.5 mt-0.5"
                    >
                      <span>bidwar.in</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050A1C] border border-[#1A2C68]/60">
                    <p className="text-slate-400 text-[11px]">Operations & Management</p>
                    <p className="text-white font-bold text-sm mt-0.5">Varanasi Operations Desk</p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#050A1C] border border-[#1A2C68]/60">
                    <p className="text-slate-400 text-[11px]">Operating Hours</p>
                    <p className="text-slate-300 font-semibold mt-0.5">Monday – Saturday: 09:00 AM – 07:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cashfree Payment Security Seal */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#091230] to-emerald-950/40 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">256-Bit SSL Encrypted & Cashfree PG Certified</p>
                  <p className="text-slate-400 text-[11px]">RBI-regulated Payment Aggregator · PCI-DSS Level 1 Certified</p>
                </div>
              </div>
              <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-bold">
                100% SECURE GATEWAY CHECKOUT
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
