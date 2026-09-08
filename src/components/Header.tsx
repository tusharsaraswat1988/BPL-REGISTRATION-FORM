import React from 'react';
import { Trophy, Shield, Users, FileText, PlusCircle, Lock, ExternalLink } from 'lucide-react';
import { BidWarLogo } from './BidWarLogo';
import { TOURNAMENT_CONFIG, SponsorConfig } from '../config/tournamentConfig';

interface HeaderProps {
  activeTab: 'register' | 'teams' | 'rules';
  setActiveTab: (tab: 'register' | 'teams' | 'rules') => void;
  registeredCount: number;
  hasUnsavedChanges?: boolean;
  sponsors?: SponsorConfig[];
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  registeredCount,
  hasUnsavedChanges = false,
  sponsors = TOURNAMENT_CONFIG.SPONSORS
}) => {
  const activeSponsor = sponsors && sponsors.length > 0 ? sponsors[0] : null;

  const handleTabClick = (tab: 'register' | 'teams' | 'rules') => {
    if (activeTab === 'register' && tab !== 'register' && hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved registration progress in your current section. Your previous completed sections are auto-saved. Are you sure you want to navigate away?'
      );
      if (!confirmLeave) return;
    }
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070D24]/95 backdrop-blur-md border-b border-[#1A2C68]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Utility Bar */}
        <div className="flex items-center justify-between py-1.5 border-b border-[#132252] text-[11px]">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1.5 text-[#FFB800] font-semibold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFB800] animate-pulse"></span>
              OFFICIAL TOURNAMENT REGISTRATION PORTAL
            </span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-slate-300">
              Tournament Dates: <strong className="text-white">3rd & 4th October 2026</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1 bg-[#0B1538] px-2.5 py-0.5 rounded border border-[#1A2C68]">
              <span className="text-slate-400">Organised by:</span>
              <span className="font-semibold text-slate-200">Bidwar.in & KV TechMedia</span>
            </div>
            <a 
              href="https://bidwar.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FFB800] hover:text-[#FBBF24] font-medium transition-colors hidden sm:flex items-center gap-1 active:scale-95"
            >
              <span>bidwar.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Main Brand & Sponsor Grid */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Left: Original BidWar Logo + Official Tournament Identity */}
          <div 
            className="flex items-center gap-3.5 sm:gap-4 cursor-pointer group select-none min-w-0"
            onClick={() => handleTabClick('register')}
          >
            {/* Authentic Original BidWar Logo (Not text) */}
            <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-[1.02]">
              <BidWarLogo height={44} />
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-10 w-px bg-[#1D3575]" />

            {/* Tournament Hierarchy: BIDWAR -> BIDWAR PREMIER LEAGUE -> KIDS VERSION — SEASON 1 */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport">
                  BIDWAR
                </span>
                <span className="text-[9px] text-slate-500 font-mono">/</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-200 uppercase font-mono-sport truncate">
                  PREMIER LEAGUE
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-black tracking-tight text-white flex items-center gap-2 font-heading truncate leading-tight mt-0.5">
                <span>KIDS VERSION</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-mono-sport flex-shrink-0">
                  SEASON 1
                </span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate hidden sm:block">
                Official Box Cricket Tournament • 3rd & 4th October 2026
              </p>
            </div>
          </div>

          {/* Right: STRICT TOP-RIGHT SPONSOR AREA (Fixed visual footprint) */}
          <div className="flex-shrink-0">
            <div 
              className="w-40 sm:w-56 h-14 sm:h-16 rounded-xl border border-[#1A2C68] bg-[#091230]/90 p-2 sm:p-2.5 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden transition-all duration-200"
              title={activeSponsor ? `${activeSponsor.type}: ${activeSponsor.name}` : 'Tournament Sponsor Area'}
            >
              {activeSponsor ? (
                activeSponsor.websiteUrl ? (
                  <a 
                    href={activeSponsor.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col justify-center items-center hover:opacity-90 transition-opacity"
                  >
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FFB800] font-mono-sport block leading-none mb-1 truncate max-w-full">
                      {activeSponsor.type}
                    </span>
                    {activeSponsor.logoUrl ? (
                      <img 
                        src={activeSponsor.logoUrl} 
                        alt={activeSponsor.name} 
                        className="max-h-6 sm:max-h-7 max-w-[90%] object-contain" 
                      />
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-white truncate max-w-full">
                        {activeSponsor.name}
                      </span>
                    )}
                  </a>
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FFB800] font-mono-sport block leading-none mb-1 truncate max-w-full">
                      {activeSponsor.type}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white truncate max-w-full">
                      {activeSponsor.name}
                    </span>
                  </div>
                )
              ) : (
                /* Tasteful Reserved Sponsor Placeholder */
                <div className="flex flex-col items-center justify-center w-full">
                  <div className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 font-mono-sport leading-none">
                    <Shield className="w-2.5 h-2.5 text-[#FFB800]" />
                    <span>OFFICIAL SPONSOR</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0D1840] border border-[#1A2C68] text-[9px] sm:text-[10px] text-slate-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]/70"></span>
                    <span>Partnership Area</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between pb-3 pt-1 gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 bg-[#091230] p-1 rounded-xl border border-[#1A2C68] text-xs font-semibold">
            {/* Team Registration Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('register')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 active:scale-[0.98] ${
                activeTab === 'register'
                  ? 'bg-[#FFB800] text-slate-950 font-bold shadow-md shadow-[#FFB800]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Team Registration</span>
            </button>

            {/* Team Pass Tab — VISIBLY DISABLED & MARKED COMING SOON */}
            <div 
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 bg-[#070D24]/60 border border-slate-800/60 cursor-not-allowed select-none opacity-80"
              title="Team Pass system will be activated after committee credential verification"
            >
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-400">Team Pass</span>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 font-mono-sport">
                COMING SOON
              </span>
            </div>

            {/* Registered Teams Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('teams')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 active:scale-[0.98] ${
                activeTab === 'teams'
                  ? 'bg-[#FFB800] text-slate-950 font-bold shadow-md shadow-[#FFB800]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Teams ({registeredCount})</span>
            </button>

            {/* Rules & Format Tab */}
            <button
              type="button"
              onClick={() => handleTabClick('rules')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 active:scale-[0.98] ${
                activeTab === 'rules'
                  ? 'bg-[#FFB800] text-slate-950 font-bold shadow-md shadow-[#FFB800]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Rules & Format</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
