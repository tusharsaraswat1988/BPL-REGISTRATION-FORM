import React from 'react';
import { Palette, Sparkles, Check, CheckCircle2, Shield } from 'lucide-react';

interface StepTeamBrandingProps {
  teamName: string;
  setTeamName: (val: string) => void;
  includeBranding: boolean;
  setIncludeBranding: (val: boolean) => void;
  teamTagline: string;
  setTeamTagline: (val: string) => void;
  primaryColor: string;
  setPrimaryColor: (val: string) => void;
  secondaryColor: string;
  setSecondaryColor: (val: string) => void;
  errors: Record<string, string>;
}

const colorPresets = [
  { name: 'Royal Blue & Amber', primary: '#0284c7', secondary: '#f59e0b' },
  { name: 'Warrior Red & Charcoal', primary: '#dc2626', secondary: '#0f172a' },
  { name: 'Emerald & Gold', primary: '#059669', secondary: '#facc15' },
  { name: 'Imperial Purple & Cyan', primary: '#7c3aed', secondary: '#06b6d4' },
  { name: 'Apex Stealth & Solar Gold', primary: '#1e293b', secondary: '#f59e0b' },
  { name: 'Navy & Flame Orange', primary: '#1e3a8a', secondary: '#ea580c' },
];

export const StepTeamBranding: React.FC<StepTeamBrandingProps> = ({
  teamName,
  setTeamName,
  includeBranding,
  setIncludeBranding,
  teamTagline,
  setTeamTagline,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  errors
}) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Palette className="w-5 h-5 text-amber-400" />
            Team Identity & Branding Option
          </h3>
          <p className="text-xs text-slate-400">
            Configure your team name, kit colors, and choose whether to include the official custom branding package.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Branding Option */}
        <div className="lg:col-span-7 space-y-6">
          {/* Team Name * */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Official Team Name *
            </label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="e.g. DPS Thunderbolts / Drona Young Challengers"
              className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                errors.teamName ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            {errors.teamName && (
              <p className="text-[11px] text-red-400 mt-1">{errors.teamName}</p>
            )}
            <span className="text-[11px] text-slate-500">
              Must reflect your school, academy, or club identity.
            </span>
          </div>

          {/* Team Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Team Tagline / Motto (Optional)
            </label>
            <input
              type="text"
              value={teamTagline}
              onChange={e => setTeamTagline(e.target.value)}
              placeholder="e.g. Strike Fast, Strike Hard"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* OFFICIAL BRANDING OPTION (₹8,000 vs ₹13,000) */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Branding Option *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: NO Branding */}
              <div
                onClick={() => setIncludeBranding(false)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative ${
                  !includeBranding
                    ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {!includeBranding && (
                  <div className="absolute top-3 right-3 text-amber-400">
                    <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono-sport">
                    Standard Entry
                  </span>
                </div>
                <div className="text-xl font-black text-white font-mono-sport mb-1">
                  ₹8,000
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Base Registration fee without branding add-on. (₹8,000 total)
                </p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  Branding Add-on: <strong className="text-slate-400">₹0</strong>
                </div>
              </div>

              {/* Option 2: YES Branding */}
              <div
                onClick={() => setIncludeBranding(true)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative ${
                  includeBranding
                    ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                {includeBranding && (
                  <div className="absolute top-3 right-3 text-amber-400">
                    <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                  </div>
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs font-bold text-amber-400 uppercase font-mono-sport flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Full Branding Package
                  </span>
                </div>
                <div className="text-xl font-black text-amber-400 font-mono-sport mb-1">
                  ₹13,000
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Base Registration (₹8,000) + Official Branding Add-on (₹5,000).
                </p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-amber-300/80 font-medium">
                  Custom jerseys with school/team logo & social media spotlight.
                </div>
              </div>
            </div>
          </div>

          {/* Color Palettes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Team Kit Colors
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {colorPresets.map(preset => {
                const isSelected =
                  primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
                  secondaryColor.toLowerCase() === preset.secondary.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setSecondaryColor(preset.secondary);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-950"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-950"
                          style={{ backgroundColor: preset.secondary }}
                        />
                      </div>
                      <span className="truncate">{preset.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">Primary Color</span>
                  <span className="text-[11px] text-slate-500 font-mono">{primaryColor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-300 block">Accent Color</span>
                  <span className="text-[11px] text-slate-500 font-mono">{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Visuals & Fee Preview */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Kit & Match Preview
            </span>
            <span className="text-[10px] font-mono-sport bg-slate-950 px-2 py-0.5 rounded text-amber-400 border border-slate-800">
              BPL S1
            </span>
          </div>

          {/* Jersey Canvas Preview */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center">
            <div
              className="w-28 h-32 rounded-2xl shadow-xl flex flex-col items-center justify-between p-3 border-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: primaryColor,
                borderColor: secondaryColor
              }}
            >
              <div
                className="w-10 h-2.5 rounded-b-md"
                style={{ backgroundColor: secondaryColor }}
              />
              <div className="text-center my-auto">
                <span className="text-lg font-black font-mono-sport tracking-wider text-white">
                  BPL
                </span>
                <div
                  className="h-1 w-8 mx-auto rounded-full mt-1"
                  style={{ backgroundColor: secondaryColor }}
                />
                <div className="text-[8px] font-bold text-white/90 uppercase mt-1 truncate max-w-[80px]">
                  {teamName || 'YOUR TEAM'}
                </div>
              </div>
              <div className="w-full flex justify-between text-[7px] font-bold text-white/80">
                <span>BPL</span>
                <span>2026</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 font-semibold">
              {teamName || 'Team Squad Kit'}
            </p>
            {includeBranding && (
              <span className="mt-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                ✓ Includes Custom Logo Sublimation
              </span>
            )}
          </div>

          {/* Fee Summary Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Base Team Registration:</span>
              <span className="font-mono font-semibold text-white">₹8,000</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Branding Add-on:</span>
              <span className="font-mono font-semibold text-amber-400">
                {includeBranding ? '₹5,000' : '₹0 (None)'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm">
              <span className="text-white">Calculated Total:</span>
              <span className="text-amber-400 font-mono-sport text-base">
                ₹{includeBranding ? '13,000' : '8,000'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
