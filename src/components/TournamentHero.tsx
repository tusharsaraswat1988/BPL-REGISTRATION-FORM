import React from 'react';
import { Calendar, Trophy, ShieldCheck, Tv, Radio, Sparkles, Award } from 'lucide-react';

interface HeroProps {
  onStartRegistration: () => void;
  onCheckStatus: () => void;
}

export const TournamentHero: React.FC<HeroProps> = ({ onStartRegistration, onCheckStatus }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#070D24] via-[#091230] to-[#070D24] border-b border-[#1A2C68] py-10 sm:py-14 bg-pitch-grid">
      {/* Dynamic ambient sports light glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-[#FFB800]/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#1A2C68]/40 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Top Brand Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 text-xs font-bold tracking-wider uppercase font-mono-sport">
              <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
              Official Registration Window Open • Season 1
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0B1538] text-slate-300 border border-[#1A2C68] text-xs font-semibold">
              <span className="text-slate-400">Organised by</span>
              <strong className="text-white">Bidwar.in & KV TechMedia</strong>
            </span>
          </div>

          {/* Tournament Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-heading leading-tight mb-3">
            BIDWAR PREMIER LEAGUE
          </h1>
          <div className="inline-block px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#FFB800]/15 via-[#FFB800]/25 to-[#FFB800]/15 border border-[#FFB800]/40 text-[#FFB800] font-extrabold text-sm sm:text-base tracking-widest uppercase mb-5 font-mono-sport shadow-sm">
            KIDS VERSION — SEASON 1 • BOX CRICKET TOURNAMENT
          </div>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            The premier youth box cricket championship bringing schools, academies, and clubs together. Exactly 8 players per squad across two official school class divisions.
          </p>

          {/* Tournament Vital Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left">
            <div className="bg-[#0B1538] p-3.5 rounded-xl border border-[#1A2C68] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tournament Dates</p>
                <p className="text-sm font-bold text-white">3rd & 4th October 2026</p>
                <p className="text-[11px] text-[#FFB800] font-medium">Saturday & Sunday</p>
              </div>
            </div>

            <div className="bg-[#0B1538] p-3.5 rounded-xl border border-[#1A2C68] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Two Categories</p>
                <p className="text-sm font-bold text-white">Class 4–5–6 & Class 7–8–9</p>
                <p className="text-[11px] text-slate-400">Exactly 8 Players / Team</p>
              </div>
            </div>

            <div className="bg-[#0B1538] p-3.5 rounded-xl border border-[#1A2C68] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">BidWar Tech</p>
                <p className="text-sm font-bold text-white">Live Scoring & OBS</p>
                <p className="text-[11px] text-slate-400">LED Displays & Broadcast</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartRegistration}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFB800] hover:bg-[#FBBF24] text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FFB800]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              <Trophy className="w-4 h-4 text-slate-950" />
              <span>Register Team Squad</span>
            </button>

            <button
              onClick={onCheckStatus}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0A1230] hover:bg-[#0E1B48] text-slate-200 hover:text-white font-bold text-sm tracking-wide border border-[#1A2C68] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Verify Registration Status</span>
            </button>
          </div>

          {/* Key Trust highlights for School/Academy Principals & Coordinators */}
          <div className="mt-8 pt-6 border-t border-[#1A2C68]/80 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Strict Class & ID Verification
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FFB800]" />
              Official Entry ₹8,000 (Branding Add-on Available)
            </span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-sky-400" />
              Live Ball-by-Ball Scoring & WhatsApp Updates
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
