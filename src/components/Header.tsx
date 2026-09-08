import React from 'react';
import { Trophy, Shield, Users, FileText, PlusCircle, Lock, ExternalLink } from 'lucide-react';
import { BplLogo } from './BplLogo';
import { TOURNAMENT_CONFIG, SponsorConfig } from '../config/tournamentConfig';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  registeredCount: number;
  sponsors?: SponsorConfig[];
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPath, 
  onNavigate, 
  registeredCount,
  sponsors = TOURNAMENT_CONFIG.SPONSORS
}) => {
  const activeSponsor = sponsors && sponsors.length > 0 ? sponsors[0] : null;

  return (
    <header className="sticky top-0 z-50 bg-[#070D24]/95 backdrop-blur-md border-b border-[#1A2C68]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Utility Bar — Streamlined Technical Monospace Bar */}
        <div className="flex items-center justify-between py-1 border-b border-white/5 text-[10px] sm:text-[11px] font-mono">
          <div className="flex items-center gap-2 sm:gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-[#FFB800] font-semibold tracking-wider uppercase">
              <span className="live-dot" />
              OFFICIAL TOURNAMENT PORTAL
            </span>
            <span className="text-slate-700 hidden xs:inline">•</span>
            <span className="text-slate-300 font-semibold tracking-wide hidden xs:inline">
              3–4 OCTOBER 2026
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
            <span className="hidden md:inline text-slate-400">
              ORGANISED BY <strong className="text-slate-200 font-semibold">BIDWAR.IN & KV TECHMEDIA</strong>
            </span>
            <a 
              href="https://bidwar.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FFB800] hover:text-[#FFE066] font-medium transition-colors flex items-center gap-1 active:scale-95 text-[10px] sm:text-[11px]"
            >
              <span>bidwar.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Main Brand & Compact Sponsor Row */}
        <div className="flex items-center justify-between py-2 sm:py-2.5 gap-4">
          {/* Left: Official BPL Tournament Logo + Hierarchy Metadata -> Navigates to Home (/) */}
          <div 
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group select-none min-w-0"
            onClick={() => onNavigate('/')}
            title="BidWar Premier League — Home"
          >
            {/* Level 1: Official BPL Tournament Logo Asset */}
            <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.02]">
              <BplLogo size={52} className="sm:w-[58px] sm:h-[58px]" />
            </div>

            {/* Level 2 & 3: Tournament Metadata & Parent Brand Attribution */}
            <div className="min-w-0 flex flex-col justify-center">
              {/* Level 2: Tournament Edition & Dates */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-display text-white tracking-wider uppercase leading-none">
                  KIDS VERSION
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-mono leading-none">
                  SEASON 1
                </span>
              </div>

              {/* Tournament Dates */}
              <div className="text-[10px] sm:text-[11px] text-slate-300 font-mono font-medium tracking-wide mt-1 leading-tight">
                3–4 OCTOBER 2026
              </div>

              {/* Level 3: Platform / Parent Brand Subtle Attribution */}
              <div className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-0.5 leading-none">
                A BIDWAR.IN TOURNAMENT PROPERTY
              </div>
            </div>
          </div>

          {/* Right: Compact Header Sponsor Indicator */}
          <div className="flex-shrink-0">
            <div 
              className="w-32 sm:w-44 h-11 sm:h-12 rounded-lg border border-[#1A2C68] bg-[#091230]/90 px-2 py-1 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden transition-all duration-200"
              title={activeSponsor ? `${activeSponsor.type}: ${activeSponsor.name}` : 'Official Tournament Sponsor Area'}
            >
              {activeSponsor ? (
                activeSponsor.websiteUrl ? (
                  <a 
                    href={activeSponsor.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col justify-center items-center hover:opacity-90 transition-opacity"
                  >
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#FFB800] font-mono block leading-none mb-0.5 truncate max-w-full">
                      {activeSponsor.type}
                    </span>
                    {activeSponsor.logoUrl ? (
                      <img 
                        src={activeSponsor.logoUrl} 
                        alt={activeSponsor.name} 
                        className="max-h-5 max-w-[90%] object-contain" 
                      />
                    ) : (
                      <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-full leading-tight">
                        {activeSponsor.name}
                      </span>
                    )}
                  </a>
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#FFB800] font-mono block leading-none mb-0.5 truncate max-w-full">
                      {activeSponsor.type}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-white truncate max-w-full leading-tight">
                      {activeSponsor.name}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono leading-none">
                    <Shield className="w-2.5 h-2.5 text-[#FFB800]" />
                    <span>OFFICIAL SPONSOR</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 px-1.5 py-0.2 rounded bg-[#0D1840] border border-[#1A2C68] text-[8px] sm:text-[9px] text-slate-300 font-medium font-mono">
                    <span className="w-1 h-1 rounded-full bg-[#FFB800]/70"></span>
                    <span>Partnership Area</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Bar — Slim, Professional Sports League Bar */}
        <div className="flex items-center justify-between pb-2 pt-0.5 gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 bg-[#091230] p-0.5 sm:p-1 rounded-lg border border-[#1A2C68] text-xs font-semibold">
            {/* Register Team Tab */}
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer select-none focus:outline-none uppercase tracking-wider text-[11px] sm:text-xs ${
                currentPath === '/register'
                  ? 'gold-button gold-button-hover font-bold shadow-sm shadow-[#FFB800]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register Team</span>
            </button>

            {/* Registered Teams Tab */}
            <button
              type="button"
              onClick={() => onNavigate('/teams')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer select-none focus:outline-none uppercase tracking-wider text-[11px] sm:text-xs ${
                currentPath === '/teams'
                  ? 'gold-button gold-button-hover font-bold shadow-sm shadow-[#FFB800]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Registered Teams ({registeredCount})</span>
            </button>

            {/* Rules & Format Tab */}
            <button
              type="button"
              onClick={() => onNavigate('/rules')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-150 whitespace-nowrap cursor-pointer select-none focus:outline-none uppercase tracking-wider text-[11px] sm:text-xs ${
                currentPath === '/rules'
                  ? 'gold-button gold-button-hover font-bold shadow-sm shadow-[#FFB800]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Rules & Format</span>
            </button>

            {/* Team Pass Tab — VISIBLY DISABLED & MARKED COMING SOON */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-slate-500 bg-[#070D24]/60 border border-slate-800/60 cursor-not-allowed select-none opacity-80 uppercase tracking-wider text-[11px] sm:text-xs"
              title="Team Pass system will be activated after committee credential verification"
            >
              <Lock className="w-3 h-3 text-slate-600" />
              <span className="text-slate-400">Team Pass</span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 font-mono">
                COMING SOON
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
