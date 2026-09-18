import React from 'react';
import { 
  Trophy, Calendar, Users, FileText, Tv, ShieldCheck, 
  Award, ChevronRight, CheckCircle2,
  Sparkles, Layers, Shield, ExternalLink, MapPin, Crown
} from 'lucide-react';
import { TournamentCategory, PublicTeamDTO } from '../../types';
import { TOURNAMENT_CONFIG, SponsorConfig, SchoolBrandConfig } from '../../config/tournamentConfig';

interface HomePageProps {
  categories: TournamentCategory[];
  teams: PublicTeamDTO[];
  onNavigate: (path: string) => void;
  sponsors?: SponsorConfig[];
  schools?: SchoolBrandConfig[];
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  teams,
  onNavigate,
  sponsors = TOURNAMENT_CONFIG.SPONSORS,
  schools = TOURNAMENT_CONFIG.REGISTERED_SCHOOLS
}) => {
  const div1 = categories.find(c => c.id === 'class_4_5_6') || categories[0];
  const div2 = categories.find(c => c.id === 'class_7_8_9') || categories[1];

  const activeSponsors = sponsors.filter(s => s.active !== false);
  const registeredSchools = (schools || TOURNAMENT_CONFIG.REGISTERED_SCHOOLS).filter(s => s.active !== false);

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* =================================================================== */}
      {/* 1. HERO SECTION (Clean, High-Trust Tournament Introduction)         */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden border-b border-[#1A2C68] py-12 sm:py-16 lg:py-20 bg-[#070D24]">
        {/* Box Cricket Stadium Atmospheric Background */}
        <div 
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/stadium-bg.jpg')" }}
        />
        {/* Soft Vignette & Gradient Overlays for smooth edge blending & readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070D24]/85 via-[#070D24]/40 to-[#070D24]/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070D24]/50 via-transparent to-[#070D24]" />

        {/* Ambient subtle light layers */}
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
        <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#FFB800]/15 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center">
            {/* Left Column: Hero Intro Content */}
            <div className="flex flex-col justify-center text-left space-y-6">
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1 text-xs font-bold text-red-400 uppercase tracking-wide">
                  <span className="live-dot" />
                  REGISTRATION OPEN · DEADLINE 25 SEPT 2026
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-slate-300">
                  <MapPin className="w-3 h-3 text-[#FFB800]" />
                  PITCH AND PADDLE, SIGRA · 10–11 OCT 2026
                </span>
              </div>

              {/* Tournament Title & Subtitle */}
              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-bold tracking-wider text-[#FFB800] uppercase flex items-center gap-2">
                  <span>OFFICIAL TOURNAMENT REGISTRATION PORTAL</span>
                </div>

                <h1 className="text-hero text-white tracking-tight">
                  <span className="block">BIDWAR PREMIER LEAGUE</span>
                  <span className="block gold-text">KIDS BOX CRICKET · SEASON 1</span>
                </h1>
              </div>

              {/* Tournament Dates & Category Tag */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
                <span className="px-2.5 py-1 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-bold">
                  10TH & 11TH OCTOBER 2026
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">PITCH AND PADDLE, SIGRA</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#FFB800] font-bold">₹1,000 / PLAYER</span>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                The premier youth box cricket championship bringing school and academy players together at Pitch and Paddle, Sigra. 8 teams per category across two verified age divisions with 2-group league stages, Semi-Finals, Grand Final, and live digital scoring.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="gold-button gold-button-hover px-7 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#070D24]" />
                  <span>REGISTER YOUR TEAM SQUAD →</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('/rules')}
                  className="ghost-button ghost-button-hover px-6 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#FFB800]" />
                  <span>VIEW RULES & FORMAT</span>
                </button>
              </div>

              {/* 4 Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Strict Age & Class Validation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#FFB800]" />
                  8 Players Squad (Exact)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  3 Guaranteed League Matches
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  Semi-Finals & Grand Final
                </span>
              </div>
            </div>

            {/* Right Column: Prominent BPL 3D Official Logo with Premium Glow */}
            <div className="relative flex items-center justify-center">
              {/* Dynamic Multi-layered Ambient Glow Effects */}
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-gradient-to-tr from-[#FFB800]/25 via-blue-600/30 to-[#FFB800]/20 blur-3xl animate-pulse" />
              <div className="pointer-events-none absolute w-72 h-72 rounded-full bg-[#FFB800]/20 blur-2xl -top-4 -left-4" />
              <div className="pointer-events-none absolute w-72 h-72 rounded-full bg-blue-500/25 blur-2xl -bottom-4 -right-4" />

              {/* Logo Card Container */}
              <div className="relative group max-w-[290px] sm:max-w-sm md:max-w-md w-full flex flex-col items-center">
                <div className="relative overflow-hidden rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#0F2052]/90 via-[#0A163B]/90 to-[#060D24]/95 border-2 border-[#FFB800]/40 shadow-2xl shadow-blue-950/80 backdrop-blur-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-[#FFB800]/70 group-hover:shadow-[0_0_50px_rgba(255,184,0,0.3)]">
                  {/* High-Resolution 3D Official Emblem */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src="/bpl-hero-logo.jpg"
                      alt="BidWar Premier League Official Emblem"
                      className="w-full h-auto object-cover rounded-2xl shadow-inner transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Subtle Official Tagline Under Logo */}
                <div className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#091333]/90 border border-[#FFB800]/30 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-ping" />
                  <span className="text-xs font-bold font-display uppercase tracking-widest text-[#FFB800]">
                    SEASON 1 - KIDS EDITION
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. FEATURES OF THIS TOURNAMENT                                     */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
            01 / TOURNAMENT SPECIFICATIONS
          </span>
          <h2 className="text-display-md text-white mt-1">
            Features of This Tournament
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Everything organizers, school principals, cricket academies, and mentors need to know about Season 01.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Feature 01 */}
          <div className="panel p-6 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-bold text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">01</span>
              <Calendar className="w-5 h-5 text-[#FFB800]" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">SCHEDULE & VENUE</div>
              <h3 className="font-display text-lg font-bold text-white mt-1">10–11 OCTOBER 2026</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Saturday & Sunday tournament weekend held at Pitch and Paddle, Sigra. Registration closes 25 September 2026.
              </p>
            </div>
          </div>

          {/* Feature 02 */}
          <div className="panel p-6 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-bold text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">02</span>
              <Layers className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">TWO AGE CATEGORIES</div>
              <h3 className="font-display text-lg font-bold text-white mt-1">STRICT AGE LIMITS</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Cat 1: Class 4–6 (8–11.9 yrs) & Cat 2: Class 7–9 (12–14.9 yrs) with mandatory verification.
              </p>
            </div>
          </div>

          {/* Feature 03 */}
          <div className="panel p-6 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-bold text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">03</span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">2 GROUPS & LEAGUE</div>
              <h3 className="font-display text-lg font-bold text-white mt-1">3 MATCHES / TEAM</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                8 teams divided into 2 groups of 4. Every team plays 3 league matches, top 2 advance to Semi-Finals.
              </p>
            </div>
          </div>

          {/* Feature 04 */}
          <div className="panel p-6 space-y-3 relative overflow-hidden group hover:border-[#FFB800]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl font-bold text-[#FFB800]/40 group-hover:text-[#FFB800] transition-colors">04</span>
              <Tv className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">BIDWAR TECH</div>
              <h3 className="font-display text-lg font-bold text-white mt-1">DIGITAL SCORING</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                LED display scoreboards, ball-by-ball web interface, and OBS livestream broadcast graphics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. TOURNAMENT STRUCTURES & DIVISIONS                               */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
            02 / COMPETITION FORMAT & AGE CATEGORIES
          </span>
          <h2 className="text-display-lg text-white mt-1">
            Tournament Structure & Age Eligibility
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Strict age and school class validation ensures fair, competitive youth cricket across both official tournament divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Division 1: Class 4-5-6 */}
          <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="px-3 py-1 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 text-xs font-bold uppercase">
                CATEGORY 01
              </span>
              <span className="text-xs text-[#FFB800] font-bold">
                8 TEAMS · 2 GROUPS OF 4
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                CLASS 4 TO CLASS 6
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Competitive box cricket championship for junior students. All 8 players must fall within the prescribed age bracket.
              </p>
            </div>

            {/* Age Eligibility Callout */}
            <div className="p-3.5 rounded-xl bg-[#070D24] border border-[#1A2C68] space-y-1">
              <div className="text-[11px] text-[#FFB800] font-bold uppercase tracking-wider">Exact Age Eligibility:</div>
              <div className="text-sm font-bold text-white font-mono-sport">
                8 Years to 11 Years 11 Months 29 Days
              </div>
              <div className="text-[11px] text-slate-400">Class 4th, 5th, or 6th standard</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase text-slate-400 block">Squad</span>
                <span className="font-display text-sm font-bold text-white block mt-0.5">8 PLAYERS</span>
              </div>
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase text-slate-400 block">Per Player</span>
                <span className="font-display text-sm font-bold text-[#FFB800] block mt-0.5">₹1,000</span>
              </div>
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase text-slate-400 block">Team Entry</span>
                <span className="font-display text-sm font-bold text-[#FFB800] block mt-0.5">₹8,000</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between border-t border-white/10 text-xs gap-2">
              <span className="text-slate-400">Brand Association Package: +₹5,000 (Total ₹13k)</span>
              <div className="flex items-center gap-1.5 text-xs text-[#FFB800] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                <span>DEADLINE: 25 SEPT</span>
              </div>
            </div>
          </div>

          {/* Division 2: Class 7-8-9 */}
          <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="px-3 py-1 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 text-xs font-bold uppercase">
                CATEGORY 02
              </span>
              <span className="text-xs text-sky-400 font-bold">
                8 TEAMS · 2 GROUPS OF 4
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                CLASS 7 TO CLASS 9
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Competitive box cricket championship for senior youth students. All 8 players must fall within the prescribed age bracket.
              </p>
            </div>

            {/* Age Eligibility Callout */}
            <div className="p-3.5 rounded-xl bg-[#070D24] border border-[#1A2C68] space-y-1">
              <div className="text-[11px] text-sky-400 font-bold uppercase tracking-wider">Exact Age Eligibility:</div>
              <div className="text-sm font-bold text-white font-mono-sport">
                12 Years to 14 Years 11 Months 29 Days
              </div>
              <div className="text-[11px] text-slate-400">Class 7th, 8th, or 9th standard</div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase text-slate-400 block">Squad</span>
                <span className="font-display text-sm font-bold text-white block mt-0.5">8 PLAYERS</span>
              </div>
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase text-slate-400 block">Per Player</span>
                <span className="font-display text-sm font-bold text-sky-400 block mt-0.5">₹1,000</span>
              </div>
              <div className="scoreboard-tile p-3">
                <span className="text-[10px] uppercase text-slate-400 block">Team Entry</span>
                <span className="font-display text-sm font-bold text-sky-400 block mt-0.5">₹8,000</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between border-t border-white/10 text-xs gap-2">
              <span className="text-slate-400">Brand Association Package: +₹5,000 (Total ₹13k)</span>
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>DEADLINE: 25 SEPT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Flow & Tie-Breaker Summary Strip */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#0B1538] border border-[#1A2C68] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FFB800]" />
              Tournament Match & Knockout Architecture
            </h4>
            <span className="text-xs text-[#FFB800] font-mono font-bold">12 LEAGUE MATCHES + 2 SEMIS + GRAND FINAL</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="scoreboard-tile p-3.5 space-y-1">
              <div className="font-bold text-[#FFB800] uppercase">1. League Stage</div>
              <p className="text-slate-300">2 Groups of 4 teams. Every team plays 3 matches against group rivals (6 matches/group).</p>
            </div>

            <div className="scoreboard-tile p-3.5 space-y-1">
              <div className="font-bold text-sky-400 uppercase">2. Qualification Target</div>
              <p className="text-slate-300">Aim for min 2 wins. Standings decided by Points, then Net Run Rate (NRR) tie-breakers.</p>
            </div>

            <div className="scoreboard-tile p-3.5 space-y-1">
              <div className="font-bold text-emerald-400 uppercase">3. Semi-Finals</div>
              <p className="text-slate-300">Top 2 from Group A & Group B (4 teams) clash in knockout Semi-Final 1 & 2.</p>
            </div>

            <div className="scoreboard-tile p-3.5 space-y-1">
              <div className="font-bold text-purple-400 uppercase">4. Grand Final</div>
              <p className="text-slate-300">Semi-Final winners compete to be crowned official Category Champion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. SPONSORS & OFFICIAL PARTNERS                                     */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
            03 / OFFICIAL PARTNERS
          </span>
          <h2 className="text-display-md text-white mt-1">
            Tournament Sponsors & Partners
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Official partners supporting BidWar Premier League — Kids Version Season 01 at Pitch and Paddle, Sigra.
          </p>
        </div>

        {activeSponsors.length > 0 ? (
          <div className="space-y-6">
            {/* Prominent Featured Sponsors Spotlight Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {activeSponsors.map((sp) => {
                const CardWrapper = sp.websiteUrl ? 'a' : 'div';
                const wrapperProps = sp.websiteUrl 
                  ? { href: sp.websiteUrl, target: '_blank', rel: 'noopener noreferrer' } 
                  : {};

                // Tier-specific styling
                const isTitle = sp.type.includes('TITLE');
                const isCoSponsor = sp.type.includes('CO-SPONSOR');

                const cardClasses = isTitle
                  ? 'border-2 border-[#FFB800]/70 bg-gradient-to-b from-[#16275e] via-[#0b1840] to-[#070D24] shadow-2xl shadow-amber-500/15 hover:border-[#FFB800] hover:shadow-[0_0_40px_rgba(255,184,0,0.25)] relative overflow-hidden'
                  : isCoSponsor
                    ? 'border-2 border-sky-500/50 bg-gradient-to-b from-[#0c1f4d] via-[#081538] to-[#060D24] shadow-xl shadow-sky-500/10 hover:border-sky-400 hover:shadow-sky-500/25 relative overflow-hidden'
                    : 'border border-[#1A2C68] bg-[#091333] shadow-lg hover:border-slate-600';

                const badgeClasses = isTitle
                  ? 'bg-gradient-to-r from-amber-500/25 via-[#FFB800]/30 to-amber-500/25 text-[#FFB800] border-amber-400/60 shadow-md shadow-amber-500/20 font-black'
                  : isCoSponsor
                    ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 font-extrabold'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold';

                const logoBoxClasses = isTitle
                  ? 'w-full h-32 sm:h-36 bg-white rounded-2xl p-4 flex items-center justify-center mb-4 shadow-xl ring-2 ring-[#FFB800]/40 transition-transform duration-200 group-hover:scale-[1.03]'
                  : isCoSponsor
                    ? 'w-full h-28 sm:h-32 bg-white rounded-xl p-3.5 flex items-center justify-center mb-4 shadow-md ring-1 ring-sky-500/30 transition-transform duration-200 group-hover:scale-[1.03]'
                    : 'w-full h-28 sm:h-32 bg-white rounded-xl p-3.5 flex items-center justify-center mb-4 shadow-md transition-transform duration-200 group-hover:scale-[1.03]';

                return (
                  <CardWrapper
                    key={sp.id}
                    {...wrapperProps}
                    className={`panel p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${cardClasses} ${
                      sp.websiteUrl ? 'cursor-pointer group' : ''
                    }`}
                  >
                    {/* Top Tier Accent Bar */}
                    {isTitle && (
                      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#FFB800] to-amber-300 shadow-[0_0_12px_rgba(255,184,0,0.8)]" />
                    )}
                    {isCoSponsor && (
                      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-300" />
                    )}

                    <div>
                      {/* Sponsor Tier Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border flex items-center gap-1.5 ${badgeClasses}`}>
                          {isTitle && <Crown className="w-3 h-3 text-[#FFB800]" />}
                          <span>{sp.type}</span>
                        </span>
                        {sp.websiteUrl && (
                          <span className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                            isTitle ? 'text-amber-300 group-hover:text-white' : 'text-slate-400 group-hover:text-white'
                          }`}>
                            <span>Visit Official Site</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      {/* Prominent Sponsor Logo Box */}
                      {sp.logoUrl && (
                        <div className={logoBoxClasses}>
                          <img 
                            src={sp.logoUrl} 
                            alt={`${sp.name} logo`} 
                            className="max-h-full max-w-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Sponsor Name */}
                      <div className="mt-1">
                        <h3 className={`font-display text-xl sm:text-2xl font-black tracking-wide transition-colors flex items-center justify-between ${
                          isTitle ? 'text-[#FFB800] group-hover:text-white' : 'text-white group-hover:text-sky-300'
                        }`}>
                          <span>{sp.name}</span>
                          {sp.websiteUrl && (
                            <span className="text-xs text-slate-500 group-hover:text-white transition-colors">↗</span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                          {sp.tagline || 'Official Tournament Partner · BPL Kids S1'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium">Pitch and Paddle, Sigra</span>
                      <span className={isTitle ? 'text-[#FFB800] font-black' : isCoSponsor ? 'text-sky-400 font-bold' : 'text-slate-400 font-semibold'}>
                        Season 01
                      </span>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 scan-lines opacity-20" />

            {/* Marquee ticker */}
            <div className="relative overflow-hidden border-b border-white/10 pb-4">
              <div className="sponsor-ticker-track gap-8 text-xs font-semibold tracking-wider uppercase text-slate-300">
                <span className="flex items-center gap-2 text-[#FFB800] font-bold">
                  <Shield className="w-4 h-4" />
                  TITLE PARTNERSHIP OPPORTUNITIES OPEN
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-sky-400 font-bold">
                  <Tv className="w-4 h-4" />
                  OFFICIAL BROADCAST & DIGITAL STREAM PARTNER
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Award className="w-4 h-4" />
                  OFFICIAL KIT & APPAREL PARTNER
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-2 text-[#FFB800] font-bold">
                  <Shield className="w-4 h-4" />
                  TITLE PARTNERSHIP OPPORTUNITIES OPEN
                </span>
              </div>
            </div>

            {/* Sponsorship Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="scoreboard-tile p-4 space-y-2 border-t-2 border-t-[#FFB800]">
                <div className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">TIER 01</div>
                <div className="font-display text-base font-bold text-white">TITLE PARTNER</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Prime LED arena display visibility, trophy naming rights, and full-screen livestream overlays.
                </p>
              </div>

              <div className="scoreboard-tile p-4 space-y-2 border-t-2 border-t-sky-400">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400">TIER 02</div>
                <div className="font-display text-base font-bold text-white">BROADCAST PARTNER</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Digital scoreboard branding, live ball-by-ball score stream watermarks, and web directory visibility.
                </p>
              </div>

              <div className="scoreboard-tile p-4 space-y-2 border-t-2 border-t-emerald-400">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">TIER 03</div>
                <div className="font-display text-base font-bold text-white">ASSOCIATE & KIT PARTNER</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Player jersey sleeve placement, arena perimeter banners, and awards ceremony presentation.
                </p>
              </div>
            </div>

            {/* Partner link */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFB800]" />
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
      {/* 4. REGISTERED SCHOOL BRANDS                                         */}
      {/* =================================================================== */}
      {registeredSchools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
              04 / REGISTERED SCHOOL BRANDS
            </span>
            <h2 className="text-display-md text-white mt-1">
              Registered School Brands
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Official schools and educational institutions participating in BidWar Premier League — Season 01.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {registeredSchools.map((school) => {
              const CardWrapper = school.websiteUrl ? 'a' : 'div';
              const wrapperProps = school.websiteUrl 
                ? { href: school.websiteUrl, target: '_blank', rel: 'noopener noreferrer' } 
                : {};

              return (
                <CardWrapper
                  key={school.id}
                  {...wrapperProps}
                  className={`panel p-5 sm:p-6 flex flex-col justify-between border border-[#1A2C68] bg-[#091333] transition-all duration-300 hover:scale-[1.02] hover:border-[#FFB800]/50 shadow-xl ${
                    school.websiteUrl ? 'cursor-pointer group' : ''
                  }`}
                >
                  <div>
                    {/* School Tier Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40">
                        {school.badge || 'PARTICIPATING SCHOOL'}
                      </span>
                      {school.websiteUrl && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-[#FFB800] font-semibold transition-colors">
                          <span>Visit Official Site</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    {/* School Logo Box */}
                    {school.logoUrl && (
                      <div className="w-full h-28 sm:h-32 bg-white rounded-xl p-3 flex items-center justify-center mb-4 shadow-md transition-transform duration-200 group-hover:scale-[1.03]">
                        <img 
                          src={school.logoUrl} 
                          alt={`${school.name} logo`} 
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    {/* School Name */}
                    <div className="mt-1">
                      <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-wide group-hover:text-[#FFB800] transition-colors flex items-center justify-between">
                        <span>{school.name}</span>
                        {school.websiteUrl && (
                          <span className="text-xs text-slate-500 group-hover:text-[#FFB800] transition-colors">↗</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">
                        {school.tagline || 'Official Participating Institution · BPL Kids S1'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium">{school.location || 'Pitch and Paddle, Sigra'}</span>
                    <span className="text-[#FFB800] font-bold">Season 01</span>
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};


