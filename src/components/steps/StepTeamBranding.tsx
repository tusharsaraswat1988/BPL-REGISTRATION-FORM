import React from 'react';
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
  const baseFee = TOURNAMENT_CONFIG.REGISTRATION_FEE;
  const brandingAddon = TOURNAMENT_CONFIG.BRANDING_FEE;
  const totalAmount = includeBranding ? baseFee + brandingAddon : baseFee;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A2C68]">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Shield className="w-5 h-5 text-[#FFB800]" />
            Team Identity & Branding Option
          </h3>
          <p className="text-xs text-slate-400">
            Specify your official team name and choose whether to include the tournament branding add-on package.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Team Details & Branding Choice */}
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

          {/* Official Branding Selection (₹8,000 vs ₹13,000) */}
          <div className="pt-4 border-t border-[#1A2C68]">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Select Registration Package <span className="text-[#FFB800]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Standard Entry (₹8,000) */}
              <div
                onClick={() => setIncludeBranding(false)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative select-none active:scale-[0.99] ${
                  !includeBranding
                    ? 'bg-[#0B1538] border-[#FFB800] ring-2 ring-[#FFB800]/30 shadow-lg'
                    : 'bg-[#091230]/70 border-[#1A2C68] hover:border-slate-700'
                }`}
              >
                {!includeBranding && (
                  <div className="absolute top-3.5 right-3.5 text-[#FFB800]">
                    <CheckCircle2 className="w-5 h-5 fill-[#FFB800]/20" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono-sport">
                    Standard Entry
                  </span>
                </div>
                <div className="text-2xl font-black text-white font-mono-sport mb-1">
                  ₹{baseFee.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Official team entry for all tournament matches and tournament scoring.
                </p>
                <div className="mt-3 pt-2 border-t border-[#1A2C68]/80 text-[10px] text-slate-500">
                  Branding Add-on: <strong className="text-slate-400">₹0 (None)</strong>
                </div>
              </div>

              {/* Option 2: Full Branding Package (₹13,000) */}
              <div
                onClick={() => setIncludeBranding(true)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left relative select-none active:scale-[0.99] ${
                  includeBranding
                    ? 'bg-[#0B1538] border-[#FFB800] ring-2 ring-[#FFB800]/30 shadow-lg shadow-[#FFB800]/10'
                    : 'bg-[#091230]/70 border-[#1A2C68] hover:border-slate-700'
                }`}
              >
                {includeBranding && (
                  <div className="absolute top-3.5 right-3.5 text-[#FFB800]">
                    <CheckCircle2 className="w-5 h-5 fill-[#FFB800]/20" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-[#FFB800] uppercase font-mono-sport flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Full Branding Package
                  </span>
                </div>
                <div className="text-2xl font-black text-[#FFB800] font-mono-sport mb-1">
                  ₹{(baseFee + brandingAddon).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Base Registration (₹8,000) + Official Custom Branding Add-on (₹5,000).
                </p>
                <div className="mt-3 pt-2 border-t border-[#1A2C68]/80 text-[10px] text-[#FFB800] font-medium">
                  Custom team jerseys with school logo sublimation & media coverage.
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
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                includeBranding 
                  ? 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40' 
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {includeBranding ? '✓ Full Branding Package Included' : 'Standard Tournament Entry'}
              </span>
            </div>
          </div>

          {/* Fee Calculation Breakdown */}
          <div className="p-4 rounded-xl bg-[#070D24] border border-[#1A2C68] space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Base Team Registration Fee:</span>
              <span className="font-mono font-semibold text-white">₹{baseFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Branding Add-on Fee:</span>
              <span className="font-mono font-semibold text-[#FFB800]">
                {includeBranding ? `+₹${brandingAddon.toLocaleString('en-IN')}` : '₹0 (None)'}
              </span>
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
