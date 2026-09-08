import React from 'react';
import { AssociationDetails, CategoryId, TournamentCategory } from '../../types';
import { CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { ImageUploadField } from '../ImageUploadField';

interface StepProps {
  category: CategoryId;
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
              Select Tournament Category (School Class)
            </h3>
            <p className="text-xs text-slate-400">
              There are strictly two categories based on player school class. Every squad must have exactly 8 players.
            </p>
          </div>
          <span className="text-xs text-[#FFB800] font-semibold hidden sm:inline font-mono-sport">
            Oct 3-4, 2026 • NCR
          </span>
        </div>

        {errors.category && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errors.category}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => {
            const isSelected = category === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none active:scale-[0.99] ${
                  isSelected
                    ? 'bg-[#0B1538] border-[#FFB800] ring-2 ring-[#FFB800]/40 shadow-xl shadow-[#FFB800]/10'
                    : 'bg-[#091230]/60 border-[#1A2C68] hover:border-slate-700 hover:bg-[#091230]'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-[#FFB800]">
                    <CheckCircle2 className="w-5 h-5 fill-[#FFB800]/20" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 uppercase font-mono-sport">
                    {cat.classes || (cat.id === 'class_4_5_6' ? 'Class 4, 5, 6' : 'Class 7, 8, 9')}
                  </span>
                  <span className="text-xs text-slate-400">
                    Official Division
                  </span>
                </div>

                <h4 className="text-xl font-bold text-white mb-1.5 font-heading">
                  {cat.name}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {cat.description}
                </p>

                <div className="pt-3 border-t border-[#1A2C68] flex items-center justify-between text-xs">
                  <span className="text-slate-400">Squad Requirement:</span>
                  <span className="font-bold text-[#FFB800] font-mono-sport">
                    EXACTLY 8 PLAYERS
                  </span>
                </div>
              </div>
            );
          })}
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
              onChange={e => handleChange('email', e.target.value)}
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
              value={association.mobile}
              onChange={e => handleChange('mobile', e.target.value)}
              placeholder="e.g. +91 98112 34567"
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
