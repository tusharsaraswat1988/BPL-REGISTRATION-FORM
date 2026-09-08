import React from 'react';
import { 
  Trophy, Calendar, Users, FileText, Tv, ShieldCheck, 
  ArrowRight, Award, Radio, ChevronRight, CheckCircle2,
  Sparkles, Layers, Shield, ExternalLink, Flame
} from 'lucide-react';
import { TournamentCategory, PublicTeamDTO } from '../../types';
import { TOURNAMENT_CONFIG, SponsorConfig } from '../../config/tournamentConfig';

interface HomePageProps {
  categories: TournamentCategory[];
  teams: PublicTeamDTO[];
  onNavigate: (path: string) => void;
  sponsors?: SponsorConfig[];
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  teams,
  onNavigate,
  sponsors = TOURNAMENT_CONFIG.SPONSORS
}) => {
  const div1 = categories.find(c => c.id === 'class_4_5_6') || categories[0];
  const div2 = categories.find(c => c.id === 'class_7_8_9') || categories[1];

  // If sponsors are configured, double the list for continuous marquee loop
  const activeSponsors = sponsors.filter(s => s.active !== false);
  const tickerSponsors = activeSponsors.length > 0 ? [...activeSponsors, ...activeSponsors, ...activeSponsors] : [];

  return (
    <div className="space-y-20 pb-20">
      {/* =================================================================== */}
      {/* 1. HERO SECTION (Dominant Single Conversion Moment)                 */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden border-b border-[#1A2C68] py-12 sm:py-18 lg:py-24 bg-[#070D24]">
        {/* Subtle Broadcast Grid Background & Radial Lights */}
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" />
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#FFB800]/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
            {/* Left Column: Typography, Badges, CTAs, Trust Metrics */}
            <div className="flex flex-col justify-center text-left space-y-6">
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1 text-[10px] font-bold tracking-widest text-red-400 uppercase font-mono">
                  <span className="live-dot" />
                  REGISTRATION OPEN · SEASON 01
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[10px] uppercase tracking-widest text-slate-300 font-mono">
                  NCR ARENA · 3–4 OCT 2026
                </span>
              </div>

              {/* Technical Eyebrow */}
              <div className="space-y-1">
                <div className="text-[11px] sm:text-xs font-bold tracking-widest text-[#FFB800] uppercase font-mono flex items-center gap-1.5">
                  <span>THE NEXT GENERATION OF BOX CRICKET</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-300">OFFICIAL REGISTRATION PORTAL</span>
                </div>

                {/* Main Hero Display Heading */}
                <h1 className="text-hero text-white tracking-tight">
                  <span className="block">KIDS VERSION</span>
                  <span className="block gold-text">SEASON 01</span>
                </h1>
              </div>

              {/* Tournament Dates & Format Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
                <span className="px-2 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-bold">
                  3RD & 4TH OCTOBER 2026
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">OFFICIAL BOX CRICKET TOURNAMENT</span>
              </div>

              {/* Concise Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                The premier youth box cricket championship bringing schools, academies, and clubs together in NCR. Exactly 8 players per squad across two official school class divisions, with broadcast-grade digital scoreboards.
              </p>

              {/* Action Buttons — ONE Dominant Conversion Moment */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="gold-button gold-button-hover px-7 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#070D24]" />
                  <span>REGISTER YOUR TEAM →</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/verify')}
                  className="ghost-button ghost-button-hover px-6 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
                  <span>VERIFY REGISTRATION</span>
                </button>
              </div>

              {/* Trust & Policy Highlights */}
              <div className="pt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Strict ID & Class Validation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FFB800]" />
                  8 Players / Squad (Exact)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  1 Official Mentor
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  OBS Live Broadcast
                </span>
              </div>

              {/* 4 Compact Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="scoreboard-tile p-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">DATES</span>
                  <span className="font-display text-xl text-white block mt-0.5">3–4 OCT</span>
                  <span className="text-[10px] text-[#FFB800] font-mono">Sat & Sun</span>
                </div>

                <div className="scoreboard-tile p-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">DIVISIONS</span>
                  <span className="font-display text-xl text-white block mt-0.5">2 DIVS</span>
                  <span className="text-[10px] text-slate-400 font-mono">Cl 4–6 & 7–9</span>
                </div>

                <div className="scoreboard-tile p-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">SQUAD SIZE</span>
                  <span className="font-display text-xl text-white block mt-0.5">8 PLRS</span>
                  <span className="text-[10px] text-slate-400 font-mono">Exact Roster</span>
                </div>

                <div className="scoreboard-tile p-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">ENTRY FEE</span>
                  <span className="font-display text-xl text-[#FFB800] block mt-0.5">₹8,000</span>
                  <span className="text-[10px] text-slate-400 font-mono">Per Team</span>
                </div>
              </div>
            </div>

            {/* Right Column: Broadcast Tournament Control Surface */}
            <div className="relative">
              <div className="relative mx-auto max-w-md w-full">
                {/* Ambient Glow behind panel */}
                <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-blue-600/20 via-[#FFB800]/15 to-transparent blur-2xl" />

                {/* Control Room Feed Header */}
                <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    CONTROL ROOM · FEED 01
                  </span>
                  <span className="text-slate-300 font-mono">NCR VENUE · IST</span>
                </div>

                {/* Main Broadcast Match Panel */}
                <div className="panel-rail relative overflow-hidden p-5 space-y-4">
                  {/* Top Broadcast Lower-Third Strip */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold font-mono tracking-wider">
                        <span className="live-dot" />
                        OFFICIAL TOURNAMENT
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-slate-400">LOT · BPL-2026</span>
                    </div>
                    <span className="font-mono text-[10px] tracking-wider text-[#FFB800] uppercase font-bold">BOX CRICKET</span>
                  </div>

                  {/* Title & Tag */}
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">SEASON IDENTITY</div>
                    <div className="font-display text-2xl text-white mt-0.5">BIDWAR PREMIER LEAGUE</div>
                    <div className="text-xs text-slate-300 mt-1">National Capital Region Youth Box Championship</div>
                  </div>

                  {/* Two Division Scoreboard Tiles */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="scoreboard-tile p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">DIVISION 1</span>
                        <span className="text-[9px] text-[#FFB800] font-mono font-bold">{div1?.slotsRemaining ?? 6} SLOTS</span>
                      </div>
                      <div className="font-display text-lg text-white">CLASS 4–5–6</div>
                      <div className="text-[10px] text-slate-400 font-mono">8 Players · Entry ₹8k</div>
                    </div>

                    <div className="scoreboard-tile p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">DIVISION 2</span>
                        <span className="text-[9px] text-sky-400 font-mono font-bold">{div2?.slotsRemaining ?? 4} SLOTS</span>
                      </div>
                      <div className="font-display text-lg text-white">CLASS 7–8–9</div>
                      <div className="text-[10px] text-slate-400 font-mono">8 Players · Entry ₹8k</div>
                    </div>
                  </div>

                  {/* Lower Technical Strip */}
                  <div className="scoreboard-tile p-3 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
                      <span className="text-slate-400">MATCH STRUCTURE</span>
                      <span className="text-emerald-400 font-bold">STRICT RULES ENFORCED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div>• Squad: <strong>8 Players (Exact)</strong></div>
                      <div>• Mentor: <strong>1 Official Coach</strong></div>
                      <div>• Subs: <strong>Zero Substitutes</strong></div>
                      <div>• Tech: <strong>OBS Live Overlay</strong></div>
                    </div>
                  </div>

                  {/* Bottom Info Footer (Informational, not a duplicate CTA) */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Organised by: <strong className="text-white">BidWar & KVT</strong></span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      LIVE FEED READY
                    </span>
                  </div>

                  {/* Scan line overlay */}
                  <div className="pointer-events-none absolute inset-0 scan-lines opacity-35" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. KEY INFORMATION STRIP (Numbered BidWar Feature Panels)           */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFB800] font-mono">
            01 / TOURNAMENT SPECIFICATIONS
          </span>
          <h2 className="text-display-md text-white mt-1">
            KEY TOURNAMENT ARCHITECTURE.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Everything organizers, school principals, and team mentors need to understand Season 01 structure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Item 01 */}
          <div className="panel p-5 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">01</span>
              <Calendar className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">SCHEDULE</div>
              <h3 className="font-display text-lg text-white mt-0.5">3–4 OCTOBER 2026</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Saturday & Sunday tournament weekend in National Capital Region.
              </p>
            </div>
          </div>

          {/* Item 02 */}
          <div className="panel p-5 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">02</span>
              <Layers className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">DIVISIONS</div>
              <h3 className="font-display text-lg text-white mt-0.5">TWO SCHOOL DIVISIONS</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Class 4–5–6 Division & Class 7–8–9 Division with verified grade rosters.
              </p>
            </div>
          </div>

          {/* Item 03 */}
          <div className="panel p-5 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">03</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">SQUAD ROSTER</div>
              <h3 className="font-display text-lg text-white mt-0.5">EXACTLY 8 PLAYERS</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                1 certified team mentor, exactly 8 registered players, zero substitutions.
              </p>
            </div>
          </div>

          {/* Item 04 */}
          <div className="panel p-5 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">04</span>
              <Tv className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">BIDWAR TECH</div>
              <h3 className="font-display text-lg text-white mt-0.5">BROADCAST OVERLAYS</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Digital LED scoreboards, live scoring interface, and OBS stream overlay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. NEW SECTION: PREMIUM SPONSOR SHOWCASE (Broadcast Partner Strip)  */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFB800] font-mono">
            02 / OFFICIAL PARTNERS
          </span>
          <h2 className="text-display-md text-white mt-1">
            POWERING THE NEXT GENERATION OF SPORT.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Official partners supporting BidWar Premier League — Kids Version, Season 01.
          </p>
        </div>

        {/* Auto-scrolling Broadcast Sponsor Showcase */}
        {activeSponsors.length > 0 ? (
          <div className="relative overflow-hidden panel p-4 sm:p-6 border border-[#1A2C68]">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#070D24] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#070D24] to-transparent z-10" />

            <div className="sponsor-ticker-track gap-4 py-2">
              {tickerSponsors.map((sp, idx) => {
                const CardWrapper = sp.websiteUrl ? 'a' : 'div';
                const wrapperProps = sp.websiteUrl 
                  ? { href: sp.websiteUrl, target: '_blank', rel: 'noopener noreferrer' } 
                  : {};

                return (
                  <CardWrapper
                    key={`${sp.id}-${idx}`}
                    {...wrapperProps}
                    className={`scoreboard-tile p-4 sm:p-5 flex flex-col justify-between min-w-[260px] sm:min-w-[300px] border border-white/10 transition-transform duration-200 hover:scale-[1.02] select-none ${
                      sp.websiteUrl ? 'cursor-pointer group' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#FFB800] font-mono">
                          {sp.type}
                        </span>
                        {sp.websiteUrl && (
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#FFB800] transition-colors" />
                        )}
                      </div>

                      {sp.logoUrl ? (
                        <div className="h-10 flex items-center mb-2">
                          <img 
                            src={sp.logoUrl} 
                            alt={sp.name} 
                            className="max-h-9 max-w-[160px] object-contain object-left" 
                          />
                        </div>
                      ) : (
                        <div className="font-display text-xl text-white tracking-wide mt-1">
                          {sp.name}
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono tracking-wider pt-2 border-t border-white/5 uppercase">
                      {sp.tagline || 'Proud Partner · BPL Kids S1'}
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        ) : (
          /* Polished Broadcast Sponsor Showcase Property (No fake sponsors) */
          <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
            {/* Ambient Broadcast Scan Lines */}
            <div className="pointer-events-none absolute inset-0 scan-lines opacity-25" />

            {/* Continuous Marquee Ticker of Partnership Opportunities */}
            <div className="relative overflow-hidden border-b border-white/10 pb-4">
              <div className="sponsor-ticker-track gap-8 text-xs font-mono tracking-widest uppercase text-slate-300">
                <span className="flex items-center gap-2 text-[#FFB800] font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  TITLE PARTNERSHIP ENQUIRIES OPEN
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-sky-400 font-bold">
                  <Tv className="w-3.5 h-3.5" />
                  OFFICIAL BROADCAST & DIGITAL STREAM PARTNER
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Award className="w-3.5 h-3.5" />
                  OFFICIAL KIT & APPAREL PARTNER
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-purple-400 font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  HYDRATION & NUTRITION PARTNER
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-[#FFB800] font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  TITLE PARTNERSHIP ENQUIRIES OPEN
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-sky-400 font-bold">
                  <Tv className="w-3.5 h-3.5" />
                  OFFICIAL BROADCAST & DIGITAL STREAM PARTNER
                </span>
              </div>
            </div>

            {/* 3 Broadcast Sponsorship Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="scoreboard-tile p-4 space-y-2 border-t-2 border-t-[#FFB800]">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#FFB800] font-mono">TIER 01</div>
                <div className="font-display text-lg text-white">TITLE PARTNER</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prime LED display visibility, trophy naming rights, and full-screen OBS lower-third overlays during all live matches.
                </p>
              </div>

              <div className="scoreboard-tile p-4 space-y-2 border-t-2 border-t-sky-400">
                <div className="text-[10px] font-bold uppercase tracking-widest text-sky-400 font-mono">TIER 02</div>
                <div className="font-display text-lg text-white">BROADCAST PARTNER</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Digital scoreboard branding, live ball-by-ball score stream watermarks, and official web directory visibility.
                </p>
              </div>

              <div className="scoreboard-tile p-4 space-y-2 border-t-2 border-t-emerald-400">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">TIER 03</div>
                <div className="font-display text-lg text-white">ASSOCIATE & KIT PARTNER</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Player jersey sleeve placement, arena perimeter banners, and official awards ceremony presentation.
                </p>
              </div>
            </div>

            {/* Partnership Contact Footer */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
                Brand Partnership Opportunities for Season 01
              </span>
              <a 
                href="https://bidwar.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB800] hover:text-[#FFE066] font-bold flex items-center gap-1 transition-colors"
              >
                <span>Partner with BidWar & KV TechMedia ↗</span>
              </a>
            </div>
          </div>
        )}
      </section>

      {/* =================================================================== */}
      {/* 4. COMPETITION DIVISIONS (Editorial Information, No Extra CTAs)     */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFB800] font-mono">
            03 / COMPETITION DIVISIONS
          </span>
          <h2 className="text-display-lg text-white mt-1">
            BUILT FOR THE NEXT GENERATION.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Strict school class validation ensures fair, competitive youth cricket across both official divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Division 1: Class 4-5-6 */}
          <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="px-3 py-1 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 text-xs font-bold font-mono uppercase">
                DIVISION 01
              </span>
              <span className="text-xs text-[#FFB800] font-bold font-mono">
                {div1?.slotsRemaining ?? 6} SLOTS REMAINING
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-white">
                CLASS 4–5–6 DIVISION
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Fast-action box cricket specifically designed for junior students currently enrolled in classes 4th, 5th, and 6th.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Squad Limit</span>
                <span className="font-display text-lg text-white block mt-0.5">8 PLAYERS</span>
                <span className="text-[10px] text-slate-400 font-mono">No substitutes</span>
              </div>

              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Base Entry</span>
                <span className="font-display text-lg text-[#FFB800] block mt-0.5">₹8,000</span>
                <span className="text-[10px] text-slate-400 font-mono">Per squad</span>
              </div>
            </div>

            {/* Replaced registration button with elegant status indicator */}
            <div className="pt-3 flex items-center justify-between border-t border-white/10 text-xs font-mono">
              <span className="text-slate-400">Branding add-on available (+₹5k)</span>
              <div className="flex items-center gap-1.5 text-xs text-[#FFB800] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                <span>SLOTS AVAILABLE · ENROLLMENT OPEN</span>
              </div>
            </div>
          </div>

          {/* Division 2: Class 7-8-9 */}
          <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="px-3 py-1 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 text-xs font-bold font-mono uppercase">
                DIVISION 02
              </span>
              <span className="text-xs text-sky-400 font-bold font-mono">
                {div2?.slotsRemaining ?? 4} SLOTS REMAINING
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-white">
                CLASS 7–8–9 DIVISION
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Competitive youth box cricket for senior students currently enrolled in classes 7th, 8th, and 9th.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Squad Limit</span>
                <span className="font-display text-lg text-white block mt-0.5">8 PLAYERS</span>
                <span className="text-[10px] text-slate-400 font-mono">No substitutes</span>
              </div>

              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">Base Entry</span>
                <span className="font-display text-lg text-sky-400 block mt-0.5">₹8,000</span>
                <span className="text-[10px] text-slate-400 font-mono">Per squad</span>
              </div>
            </div>

            {/* Replaced registration button with elegant status indicator */}
            <div className="pt-3 flex items-center justify-between border-t border-white/10 text-xs font-mono">
              <span className="text-slate-400">Branding add-on available (+₹5k)</span>
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>SLOTS AVAILABLE · ENROLLMENT OPEN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. SHOWCASE PREVIEWS: REGISTERED TEAMS & RULES (Broadcast Panels)   */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registered Teams Preview Box */}
          <div className="panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#070D24] border border-[#1A2C68] text-[#FFB800] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-[#FFB800] uppercase font-mono">
                    PUBLIC DIRECTORY ({teams.length} CONFIRMED)
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold">LIVE ROSTER</span>
              </div>

              <div>
                <h3 className="font-display text-2xl text-white">
                  REGISTERED TEAMS SHOWCASE
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Browse confirmed school and academy teams entering Season 01. Review team branding and category assignments.
                </p>
              </div>

              {/* Sample Team Preview Cards (if teams exist) */}
              {teams.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {teams.slice(0, 2).map((t, idx) => (
                    <div key={idx} className="scoreboard-tile p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {t.associationLogo ? (
                          <img src={t.associationLogo} alt="" className="w-7 h-7 rounded object-contain bg-black/40 p-0.5" />
                        ) : (
                          <div className="w-7 h-7 rounded bg-[#0A1230] border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-[#FFB800]">
                            {t.teamName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-xs text-white">{t.teamName}</div>
                          <div className="text-[10px] text-slate-400">{t.associationName}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-slate-300">
                        {t.category === 'class_4_5_6' ? 'Cl 4–6' : 'Cl 7–9'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="scoreboard-tile p-4 text-center">
                  <p className="text-xs text-slate-400 font-mono">Registration window currently active. Slots filling fast.</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigate('/teams')}
                className="ghost-button ghost-button-hover w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VIEW ALL REGISTERED TEAMS ({teams.length})</span>
                <ChevronRight className="w-4 h-4 text-[#FFB800]" />
              </button>
            </div>
          </div>

          {/* Rules & Format Preview Box */}
          <div className="panel p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#070D24] border border-[#1A2C68] text-sky-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase font-mono">
                    OFFICIAL HANDBOOK
                  </span>
                </div>
                <span className="text-[10px] uppercase font-mono text-slate-400">RULES V1.0</span>
              </div>

              <div>
                <h3 className="font-display text-2xl text-white">
                  RULES & TOURNAMENT FORMAT
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Review match regulations, squad roster requirements, 1-mentor rule, no-substitutes policy, and fee structure.
                </p>
              </div>

              {/* 4 Format Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="scoreboard-tile p-2.5">
                  <span className="text-[9px] font-mono text-[#FFB800] block">01 / DIVISIONS</span>
                  <span className="font-bold text-xs text-white">Strict Class Validation</span>
                </div>
                <div className="scoreboard-tile p-2.5">
                  <span className="text-[9px] font-mono text-sky-400 block">02 / SQUAD</span>
                  <span className="font-bold text-xs text-white">8 Players Exactly</span>
                </div>
                <div className="scoreboard-tile p-2.5">
                  <span className="text-[9px] font-mono text-emerald-400 block">03 / MENTOR</span>
                  <span className="font-bold text-xs text-white">1 Certified Coach</span>
                </div>
                <div className="scoreboard-tile p-2.5">
                  <span className="text-[9px] font-mono text-purple-400 block">04 / SCORING</span>
                  <span className="font-bold text-xs text-white">Digital Box Scoring</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigate('/rules')}
                className="ghost-button ghost-button-hover w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VIEW COMPLETE RULES & FORMAT</span>
                <ChevronRight className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. TOURNAMENT SEASON 01 CLOSING PANEL (Broadcast Identity, No CTA)  */}
      {/* =================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="panel-rail p-8 sm:p-10 text-center relative overflow-hidden space-y-6">
          {/* Scan lines texture */}
          <div className="pointer-events-none absolute inset-0 scan-lines opacity-25" />
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/10 blur-2xl rounded-full" />

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFB800] font-mono">
              04 / OFFICIAL SEASON 01 IDENTITY
            </span>
            <h2 className="text-display-md sm:text-display-lg text-white">
              BIDWAR PREMIER LEAGUE · KIDS VERSION
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed font-mono">
              3rd & 4th October 2026 • National Capital Region Box Cricket Arena
            </p>
          </div>

          {/* 4-Pillar Status Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto relative z-10">
            <div className="scoreboard-tile p-3 text-center">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">TEAMS</span>
              <span className="font-display text-sm text-white block mt-0.5">REGISTERED</span>
            </div>
            <div className="scoreboard-tile p-3 text-center">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">SCORING</span>
              <span className="font-display text-sm text-white block mt-0.5">DIGITAL OBS</span>
            </div>
            <div className="scoreboard-tile p-3 text-center">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">DISPLAYS</span>
              <span className="font-display text-sm text-white block mt-0.5">LED ARENA</span>
            </div>
            <div className="scoreboard-tile p-3 text-center">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">RESULTS</span>
              <span className="font-display text-sm text-[#FFB800] block mt-0.5">OFFICIAL</span>
            </div>
          </div>

          {/* Subtle Secondary Links */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono relative z-10">
            <button
              type="button"
              onClick={() => onNavigate('/teams')}
              className="text-slate-300 hover:text-[#FFB800] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Registered Teams →</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => onNavigate('/rules')}
              className="text-slate-300 hover:text-[#FFB800] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Read Tournament Rules →</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

