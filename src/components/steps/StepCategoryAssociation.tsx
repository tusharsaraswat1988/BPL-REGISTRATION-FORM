import React from 'react';
import { AssociationDetails, CategoryId, TournamentCategory } from '../../types';
import { CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { ImageUploadField } from '../ImageUploadField';

interface StepProps {
  category: CategoryId | '';
  setCategory: (cat: CategoryId) => void;
  association: AssociationDetails;
  setAssociation: React.Dispatch<React.SetStateAction<AssociationDetails>>;
  categories: TournamentCategory[];
  errors: Record<string, string>;
}

export const StepCategoryAssociation: React.FC<StepProps> = ({
  category,
  setCategory,
  association,
  setAssociation,
  categories,
  errors
}) => {
  const handleChange = (field: keyof AssociationDetails, value: string) => {
    setAssociation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      {/* 1. Category Selection - EXACTLY TWO CATEGORIES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-xs font-bold border border-[#FFB800]/40">
                1
              </span>
              Select Tournament Category
            </h3>
            <p className="text-xs text-slate-400">
              Select division based on player school class. Squad must have exactly 8 players.
            </p>
          </div>
          <span className="text-xs text-[#FFB800] font-semibold hidden sm:inline">
            Oct 3-4, 2026 • Varanasi
          </span>
        </div>

        {errors.category && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 max-w-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.category}</span>
          </div>
        )}

        {/* Compact Category Cards (Reduced Width & Essential Data Only) */}
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(cat => {
              const isSelected = category === cat.id;
              const isCat1 = cat.id === 'class_4_5_6';

              // Distinct color styles per category when chosen
              const selectedStyle = isCat1
                ? 'bg-gradient-to-br from-amber-500/20 via-[#0B1538] to-[#070D24] border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/15'
                : 'bg-gradient-to-br from-cyan-500/20 via-[#0B1538] to-[#070D24] border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/15';

              const unselectedStyle =
                'bg-[#081028]/60 border-[#1A2C68] hover:border-slate-500 hover:bg-[#0b1638] text-slate-400';

              return (
                <div
                  key={cat.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setCategory(cat.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setCategory(cat.id);
                    }
                  }}
                  className={`relative p-3.5 rounded-xl border transition-all duration-200 cursor-pointer text-left select-none active:scale-[0.99] ${
                    isSelected ? selectedStyle : unselectedStyle
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono-sport tracking-wider ${
                        isSelected
                          ? isCat1
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-[#15234D] text-slate-300 border border-[#253975]'
                      }`}
                    >
                      {cat.classes || (isCat1 ? 'Class 4, 5, 6' : 'Class 7, 8, 9')}
                    </span>

                    {isSelected ? (
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${
                          isCat1 ? 'text-amber-400' : 'text-cyan-400'
                        }`}
                      />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-600 block flex-shrink-0" />
                    )}
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-bold mb-1.5 font-heading transition-colors ${
                      isSelected
                        ? isCat1
                          ? 'text-amber-300'
                          : 'text-cyan-300'
                        : 'text-slate-200'
                    }`}
                  >
                    {cat.name}
                  </h4>

                  {/* Crucial Data: Age Eligibility */}
                  <div
                    className={`px-2.5 py-1 rounded-md border text-[11px] mb-2 transition-colors ${
                      isSelected
                        ? isCat1
                          ? 'bg-[#070D24]/80 border-amber-400/30 text-amber-200'
                          : 'bg-[#070D24]/80 border-cyan-400/30 text-cyan-200'
                        : 'bg-[#060B1E]/60 border-[#1A2C68] text-slate-400'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-75 mr-1">
                      Age:
                    </span>
                    <span className="font-bold text-white font-mono-sport text-[11px]">
                      {cat.ageEligibility ||
                        (isCat1
                          ? '8 to 11 Yrs 11 Mos'
                          : '12 to 14 Yrs 11 Mos')}
                    </span>
                  </div>

                  {/* Crucial Data: Squad Requirement & Fee */}
                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                    <span className="text-slate-400 text-[10px]">Squad:</span>
                    <span
                      className={`font-bold font-mono-sport text-[11px] ${
                        isSelected
                          ? isCat1
                            ? 'text-amber-300'
                            : 'text-cyan-300'
                          : 'text-slate-300'
                      }`}
                    >
                      8 Players (₹1,000 / player)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Association Details */}
      <div className="pt-6 border-t border-[#1A2C68]">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-xs font-bold border border-[#FFB800]/40">
              2
            </span>
            Association & Branch Information
          </h3>
          <p className="text-xs text-slate-400">
            The registering entity may be a School, Cricket Academy, Club, or Sports Association.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Association Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Association / School Name <span className="text-[#FFB800]">*</span>
            </label>
            <input
              type="text"
              value={association.associationName}
              onChange={e => handleChange('associationName', e.target.value)}
              placeholder="e.g. Delhi Public School / Drona Cricket Academy"
              className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
                errors.associationName ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            />
            {errors.associationName && (
              <p className="text-[11px] text-red-400 mt-1">{errors.associationName}</p>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Branch / Campus <span className="text-[#FFB800]">*</span>
            </label>
            <input
              type="text"
              value={association.branch}
              onChange={e => handleChange('branch', e.target.value)}
              placeholder="e.g. East Campus, Sector 28 / Main Branch"
              className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
                errors.branch ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            />
            {errors.branch && (
              <p className="text-[11px] text-red-400 mt-1">{errors.branch}</p>
            )}
          </div>

          {/* Association Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Official Email <span className="text-[#FFB800]">*</span>
            </label>
            <input
              type="email"
              value={association.email}
              onChange={e => handleChange('email', e.target.value.trim())}
              placeholder="e.g. sports@school.edu.in"
              className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
                errors.email ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Association Mobile */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Contact Mobile <span className="text-[#FFB800]">*</span>
            </label>
            <input
              type="tel"
              maxLength={13}
              value={association.mobile}
              onChange={e => {
                const val = e.target.value.replace(/[^\d+]/g, '');
                handleChange('mobile', val);
              }}
              placeholder="10-digit number (e.g. 9811234567)"
              className={`w-full px-4 py-3 bg-[#0A1230] border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FFB800]/50 transition-all ${
                errors.mobile ? 'border-red-500' : 'border-[#1A2C68] focus:border-[#FFB800]'
              }`}
            />
            {errors.mobile && (
              <p className="text-[11px] text-red-400 mt-1">{errors.mobile}</p>
            )}
          </div>
        </div>

        {/* Association Logo - Professional Upload */}
        <div className="mt-5">
          <ImageUploadField
            label="Association / School Logo"
            required
            tag="associations"
            value={association.associationLogo}
            onChange={url => handleChange('associationLogo', url)}
            error={errors.associationLogo}
            aspectRatio="square"
            helperText="Official crest or logo of school, academy or club"
          />
        </div>
      </div>
    </div>
  );
};
