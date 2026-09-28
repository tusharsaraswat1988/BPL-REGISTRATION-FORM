import React, { useEffect } from 'react';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../../config/tournamentConfig';

interface StepTeamBrandingProps {
  teamName: string;
  setTeamName: (val: string) => void;
  includeBranding: boolean;
  setIncludeBranding: (val: boolean) => void;
  teamTagline: string;
  setTeamTagline: (val: string) => void;
  errors: Record<string, string>;
}

export const StepTeamBranding: React.FC<StepTeamBrandingProps> = ({
  teamName,
  setTeamName,
  includeBranding,
  setIncludeBranding,
  teamTagline,
  setTeamTagline,
  errors
}) => {
  const totalAmount = TOURNAMENT_CONFIG.TOTAL_WITH_BRANDING || 13000;

  // Always ensure official full team registration package is active
  useEffect(() => {
    if (!includeBranding) {
      setIncludeBranding(true);
    }
  }, [includeBranding, setIncludeBranding]);

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A2C68]">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Shield className="w-5 h-5 text-[#FFB800]" />
            Team Identity & Registration Charges
          </h3>
          <p className="text-xs text-slate-400">
            Specify your official team name and confirm your tournament registration charges.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Team Details & Single Unified Package */}
        <div className="lg:col-span-7 space-y-6">
          {/* Team Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Official Team Name <span className="text-[#FFB800]">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="e.g. DPS Thunderbolts or Drona Young Challengers"
              className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
                errors.teamName ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            />
            {errors.teamName ? (
              <p className="text-[11px] text-red-400 mt-1.5">{errors.teamName}</p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">
                Must reflect your school, academy, or club identity.
              </p>
            )}
          </div>

          {/* Team Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Team Tagline / Motto <span className="text-slate-500 text-[11px] normal-case font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={teamTagline}
              onChange={e => setTeamTagline(e.target.value)}
              placeholder="e.g. Strike Fast, Strike Hard"
              className="w-full px-4 py-3 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/50 transition-all"
            />
          </div>

          {/* Single Unified Charge: Team Registration Charges (₹13,000) */}
          <div className="pt-4 border-t border-[#1A2C68]">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Tournament Charges <span className="text-[#FFB800]">*</span>
            </label>
            
            <div className="p-5 rounded-2xl bg-[#0B1538] border-2 border-[#FFB800] ring-2 ring-[#FFB800]/30 shadow-xl shadow-[#FFB800]/10 text-left relative">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-[#FFB800] uppercase font-mono-sport flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FFB800]" />
                  OFFICIAL TOURNAMENT PACKAGE
                </span>
                <div className="flex items-center gap-1 text-[#FFB800] text-xs font-bold font-mono-sport bg-[#FFB800]/15 px-2.5 py-1 rounded-full border border-[#FFB800]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>INCLUDED</span>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-black text-white font-heading uppercase tracking-wide">
                Team Registration Charges
              </h4>

              <div className="text-3xl font-black text-[#FFB800] font-mono-sport my-2">
                ₹{totalAmount.toLocaleString('en-IN')}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Complete official tournament registration package for 8 squad players, including custom match jerseys with school/academy logo branding, match broadcast, and digital live scoring.
              </p>

              <div className="pt-3 border-t border-[#1A2C68] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Full 8-Player Squad Entry</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Custom Branded Team Jerseys</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Live Web Scoring & OBS Broadcast</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Trophies, Medals & Certificates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Team Identity Summary & Official Fee Breakdown */}
        <div className="lg:col-span-5 bg-[#0A1230] border border-[#1A2C68] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2C68] text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono-sport">
              <Shield className="w-3.5 h-3.5 text-[#FFB800]" />
              Team Identity Card
            </span>
            <span className="text-[10px] font-mono-sport bg-[#070D24] px-2 py-0.5 rounded text-[#FFB800] border border-[#1A2C68]">
              SEASON 1
            </span>
          </div>

          {/* Identity Preview Box */}
          <div className="p-6 rounded-xl bg-[#070D24] border border-[#1A2C68] text-center space-y-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#FFB800] font-mono-sport">
              OFFICIAL TEAM NAME
            </span>
            <h4 className="text-xl font-black text-white font-heading tracking-wide">
              {teamName.trim() ? teamName : 'Enter Team Name'}
            </h4>
            {teamTagline.trim() && (
              <p className="text-xs text-slate-400 italic">
                "{teamTagline}"
              </p>
            )}

            <div className="pt-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40">
                ✓ Team Registration Package Included
              </span>
            </div>
          </div>

          {/* Fee Calculation Breakdown */}
          <div className="p-4 rounded-xl bg-[#070D24] border border-[#1A2C68] space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Team Registration Charges:</span>
              <span className="font-mono font-semibold text-white">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2.5 border-t border-[#1A2C68] flex justify-between font-bold text-sm">
              <span className="text-white">Calculated Total Fee:</span>
              <span className="text-[#FFB800] font-mono-sport text-base">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
