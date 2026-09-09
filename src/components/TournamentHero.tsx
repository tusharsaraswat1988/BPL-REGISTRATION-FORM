import React from 'react';
import { Calendar, Trophy, ShieldCheck, Tv, Radio, Sparkles, Award } from 'lucide-react';

interface HeroProps {
  onStartRegistration: () => void;
  onCheckStatus: () => void;
}

export const TournamentHero: React.FC<HeroProps> = ({ onStartRegistration, onCheckStatus }) => {
  return (
    <div className="relative overflow-hidden bg-[#070D24] border-b border-[#1A2C68] py-12 sm:py-16">
      {/* Dynamic ambient sports light glow */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-[#FFB800]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#1A2C68]/40 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Brand Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4 font-sans">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold uppercase">
              <span className="live-dot" />
              Official Registration Open · Deadline 15 Sept 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1538] text-slate-300 border border-[#1A2C68] text-xs font-semibold">
              <span className="text-slate-400">Varanasi, UP • Organised by</span>
              <strong className="text-white">BidWar.in & KV TechMedia</strong>
            </span>
          </div>

          {/* Tournament Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase font-display leading-tight mb-2 font-extrabold">
            BIDWAR PREMIER LEAGUE
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-lg bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800] font-bold text-xs sm:text-sm tracking-wider uppercase mb-4 font-sans">
            KIDS BOX CRICKET — SEASON 1 • VARANASI TOURNAMENT
          </div>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            The premier youth box cricket championship bringing school and academy players together in Varanasi. 8 teams per division, 2 groups of 4, knockout Semi-Finals, and Grand Final with live digital scoring.
          </p>

          {/* Tournament Vital Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left font-sans">
            <div className="scoreboard-tile p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Tournament Dates</p>
                <p className="text-sm font-display font-bold text-white">3RD & 4TH OCTOBER 2026</p>
                <p className="text-xs text-[#FFB800] font-medium">Deadline: 15 September 2026</p>
              </div>
            </div>

            <div className="scoreboard-tile p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Two Age Divisions</p>
                <p className="text-sm font-display font-bold text-white">CLASS 4–6 & CLASS 7–9</p>
                <p className="text-xs text-slate-400">8 to 11.9 yrs & 12 to 14.9 yrs</p>
              </div>
            </div>

            <div className="scoreboard-tile p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Match Format</p>
                <p className="text-sm font-display font-bold text-white">2 GROUPS · 3 MATCHES / TEAM</p>
                <p className="text-xs text-slate-400">Top 2 to Semis · Final</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartRegistration}
              className="gold-button gold-button-hover w-full sm:w-auto px-8 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#070D24]" />
              <span>Register Team Squad</span>
            </button>

            <button
              onClick={onCheckStatus}
              className="ghost-button ghost-button-hover w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
              <span>Verify Registration Status</span>
            </button>
          </div>

          {/* Key Trust highlights for School/Academy Principals & Coordinators */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-400 font-sans">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Strict Class & ID Verification
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FFB800]" />
              Official Entry ₹8,000 (Branding Available)
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-sky-400" />
              Live Scoring & Digital Scoreboards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
