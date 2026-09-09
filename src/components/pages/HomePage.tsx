import React from 'react';
import { 
  Trophy, Calendar, Users, FileText, Tv, ShieldCheck, 
  Award, ChevronRight, CheckCircle2,
  Sparkles, Layers, Shield, ExternalLink, MapPin
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

  const activeSponsors = sponsors.filter(s => s.active !== false);
  const tickerSponsors = activeSponsors.length > 0 ? [...activeSponsors, ...activeSponsors, ...activeSponsors] : [];

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
                  REGISTRATION OPEN · DEADLINE 15 SEPT 2026
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-semibold text-slate-300">
                  <MapPin className="w-3 h-3 text-[#FFB800]" />
                  VARANASI ARENA · 3–4 OCT 2026
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
                  3RD & 4TH OCTOBER 2026
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">VARANASI, UTTAR PRADESH</span>
                <span className="text-slate-500">•</span>
                <span className="text-[#FFB800] font-bold">₹1,000 / PLAYER</span>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                The premier youth box cricket championship bringing school and academy players together in Varanasi. 8 teams per category across two verified age divisions with 2-group league stages, Semi-Finals, Grand Final, and live digital scoring.
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

            {/* Right Column: Hero Match Info Card */}
            <div className="relative">
              <div className="relative mx-auto max-w-md w-full">
                <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-r from-blue-600/20 via-[#FFB800]/15 to-transparent blur-2xl" />

                <div className="panel-rail p-6 space-y-5 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wide flex items-center gap-1.5">
                      <span className="live-dot" />
                      TOURNAMENT STRUCTURE
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">VARANASI, UP</span>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      BidWar Premier League — Season 01
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Kids Box Cricket Edition · 8 Teams / Division · 2 Groups of 4
                    </p>
                  </div>

                  {/* Two Division Quick Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="scoreboard-tile p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#FFB800]">
                        <span>CATEGORY 1</span>
                        <span>8 TEAMS</span>
                      </div>
                      <div className="font-display text-base font-bold text-white">CLASS 4 TO 6</div>
                      <div className="text-[11px] text-[#FFB800] font-semibold">8 to 11y 11m 29d</div>
                      <div className="text-xs text-slate-400 pt-0.5">₹1k/player · ₹8k squad</div>
                    </div>

                    <div className="scoreboard-tile p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-sky-400">
                        <span>CATEGORY 2</span>
                        <span>8 TEAMS</span>
                      </div>
                      <div className="font-display text-base font-bold text-white">CLASS 7 TO 9</div>
                      <div className="text-[11px] text-sky-400 font-semibold">12 to 14y 11m 29d</div>
                      <div className="text-xs text-slate-400 pt-0.5">₹1k/player · ₹8k squad</div>
                    </div>
                  </div>

                  {/* Summary Checklist */}
                  <div className="scoreboard-tile p-3.5 space-y-2 text-xs text-slate-300">
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>COMPETITION PATHWAY</span>
                      <span className="text-emerald-400">OFFICIAL FORMAT</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      <div>• Groups: <strong>2 Groups of 4</strong></div>
                      <div>• League: <strong>3 Matches / Team</strong></div>
                      <div>• Qualifiers: <strong>Top 2 per Group</strong></div>
                      <div>• Knockouts: <strong>4 Semi-Finalists</strong></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>Deadline: <strong className="text-[#FFB800]">15 Sept 2026</strong></span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      SLOTS OPEN
                    </span>
                  </div>
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
              <h3 className="font-display text-lg font-bold text-white mt-1">3–4 OCTOBER 2026</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Saturday & Sunday tournament weekend held in Varanasi, Uttar Pradesh. Registration closes 15 September 2026.
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
                <span>DEADLINE: 15 SEPT</span>
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
                <span>DEADLINE: 15 SEPT</span>
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
            Official partners supporting BidWar Premier League — Kids Version Season 01 in Varanasi.
          </p>
        </div>

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
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB800]">
                          {sp.type}
                        </span>
                        {sp.websiteUrl && (
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FFB800] transition-colors" />
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
                        <div className="font-display text-lg font-bold text-white tracking-wide mt-1">
                          {sp.name}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 pt-2 border-t border-white/5 uppercase">
                      {sp.tagline || 'Official Partner · BPL Kids S1'}
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
      {/* 5. DIRECT ACCESS GATEWAY CARDS (No duplicate info, clean pathways) */}
      {/* =================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registered Teams Gateway */}
          <div className="panel p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#070D24] border border-[#1A2C68] text-[#FFB800] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wide">
                    PUBLIC DIRECTORY ({teams.length} CONFIRMED)
                  </span>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">LIVE ROSTER</span>
              </div>

              <h3 className="font-display text-xl font-bold text-white">
                Registered Teams Showcase
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Browse confirmed school and academy teams entering Season 01 in Varanasi. Review team rosters and category assignments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/teams')}
              className="ghost-button ghost-button-hover w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VIEW ALL REGISTERED TEAMS ({teams.length})</span>
              <ChevronRight className="w-4 h-4 text-[#FFB800]" />
            </button>
          </div>

          {/* Rules & Format Gateway */}
          <div className="panel p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#070D24] border border-[#1A2C68] text-sky-400 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                    OFFICIAL HANDBOOK
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-semibold">RULES V1.0</span>
              </div>

              <h3 className="font-display text-xl font-bold text-white">
                Rules & Tournament Regulations
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Read match regulations, 8-player squad requirements, 1-mentor rule, no-substitutes policy, and fee guidelines.
              </p>
            </div>

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
      </section>
    </div>
  );
};

