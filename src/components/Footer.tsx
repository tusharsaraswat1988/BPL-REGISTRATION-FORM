import React from 'react';
import { ExternalLink, Shield, Instagram, Facebook } from 'lucide-react';
import { BidWarLogo } from './BidWarLogo';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';

interface FooterProps {
  onSelectTab?: (tab: 'register' | 'teams' | 'rules') => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="no-print bg-[#050A1C] border-t border-[#132252] text-slate-400 text-xs mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center space-y-6">
        {/* 1. [ BIDWAR LOGO ] */}
        <div className="flex justify-center">
          <a 
            href={TOURNAMENT_CONFIG.BIDWAR_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block transition-transform duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 rounded-lg p-1"
            title="BidWar — Sports Technology Platform"
          >
            <BidWarLogo height={42} />
          </a>
        </div>

        {/* 2. BIDWAR PREMIER LEAGUE | KIDS VERSION — SEASON 1 | 3rd & 4th October 2026 */}
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-black tracking-widest text-[#FFB800] uppercase font-mono-sport">
            {TOURNAMENT_CONFIG.TOURNAMENT_NAME}
          </h3>
          <p className="text-base sm:text-lg font-black text-white font-heading tracking-wide">
            {TOURNAMENT_CONFIG.TOURNAMENT_EDITION}
          </p>
          <p className="text-xs text-slate-300 font-semibold pt-0.5">
            {TOURNAMENT_CONFIG.TOURNAMENT_DATES}
          </p>
        </div>

        {/* 3. Organised by: Bidwar.in & KV TechMedia (Both clickable) */}
        <div className="pt-2 pb-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-2 font-medium">
            Organised by
          </span>
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-[#091230] px-6 py-2.5 rounded-xl border border-[#1A2C68] shadow-inner">
            {/* Bidwar.in Link */}
            <a
              href={TOURNAMENT_CONFIG.BIDWAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#FFB800] font-bold text-xs sm:text-sm transition-colors cursor-pointer group focus:outline-none focus:text-[#FFB800]"
            >
              <span>Bidwar.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
            </a>

            <span className="text-slate-600 font-bold">&</span>

            {/* KV TechMedia Link */}
            <a
              href={TOURNAMENT_CONFIG.KV_TECHMEDIA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white hover:text-[#FFB800] font-bold text-xs sm:text-sm transition-colors cursor-pointer group focus:outline-none focus:text-[#FFB800]"
            >
              <span>KV TechMedia</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* 4. Social Media Icons ([ Instagram ] [ Facebook ]) */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {/* Instagram */}
          <a
            href={TOURNAMENT_CONFIG.BIDWAR_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official BidWar Instagram"
            className="w-10 h-10 rounded-xl bg-[#091230] border border-[#1A2C68] text-slate-300 hover:text-[#FFB800] hover:border-[#FFB800]/50 hover:bg-[#0E1B48] focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Facebook */}
          <a
            href={TOURNAMENT_CONFIG.BIDWAR_FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Official BidWar Facebook"
            className="w-10 h-10 rounded-xl bg-[#091230] border border-[#1A2C68] text-slate-300 hover:text-[#FFB800] hover:border-[#FFB800]/50 hover:bg-[#0E1B48] focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
          >
            <Facebook className="w-4 h-4" />
          </a>
        </div>

        {/* 5. Copyright & Official Tournament Registration Portal */}
        <div className="pt-6 border-t border-[#132252] text-[11px] text-slate-400 space-y-1">
          <p>© 2026 BidWar Premier League</p>
          <p className="flex items-center justify-center gap-1.5 text-slate-300 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Tournament Registration Portal</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
