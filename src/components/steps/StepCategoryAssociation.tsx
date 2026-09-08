import React, { useRef, useState } from 'react';
import { AssociationDetails, CategoryId, TournamentCategory } from '../../types';
import { Building2, CheckCircle2, AlertCircle, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

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
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof AssociationDetails, value: string) => {
    setAssociation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          tag: 'association_logo'
        })
      });
      const data = await res.json();
      if (data.secure_url) {
        handleChange('associationLogo', data.secure_url);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Category Selection - EXACTLY TWO CATEGORIES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
                1
              </span>
              Select Tournament Category (School Class)
            </h3>
            <p className="text-xs text-slate-400">
              There are strictly two categories based on player school class. Every squad must have exactly 8 players.
            </p>
          </div>
          <span className="text-xs text-amber-400 font-semibold hidden sm:inline font-mono-sport">
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
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 text-amber-400">
                    <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-amber-400/15 text-amber-300 border border-amber-400/30 uppercase font-mono-sport">
                    {cat.classes}
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

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Squad Requirement:</span>
                  <span className="font-bold text-amber-400 font-mono-sport">
                    EXACTLY 8 PLAYERS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Association Details */}
      <div className="pt-6 border-t border-slate-800">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
              2
            </span>
            Association & Branch Information
          </h3>
          <p className="text-xs text-slate-400">
            The registering entity may be a School, Academy, Club, or Sports Association.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Association Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Association Name *
            </label>
            <input
              type="text"
              value={association.associationName}
              onChange={e => handleChange('associationName', e.target.value)}
              placeholder="e.g. Delhi Public School / Drona Cricket Academy"
              className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                errors.associationName ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            {errors.associationName && (
              <p className="text-[11px] text-red-400 mt-1">{errors.associationName}</p>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Branch *
            </label>
            <input
              type="text"
              value={association.branch}
              onChange={e => handleChange('branch', e.target.value)}
              placeholder="e.g. East Campus, Sector 28 / Main Branch"
              className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                errors.branch ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            {errors.branch && (
              <p className="text-[11px] text-red-400 mt-1">{errors.branch}</p>
            )}
          </div>

          {/* Association Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email *
            </label>
            <input
              type="email"
              value={association.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="e.g. sports@dpglobal-delhi.edu.in"
              className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                errors.email ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Association Mobile */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Mobile *
            </label>
            <input
              type="tel"
              value={association.mobile}
              onChange={e => handleChange('mobile', e.target.value)}
              placeholder="e.g. +91 98112 34567"
              className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 ${
                errors.mobile ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            {errors.mobile && (
              <p className="text-[11px] text-red-400 mt-1">{errors.mobile}</p>
            )}
          </div>
        </div>

        {/* Association Logo * Upload & URL */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Association Logo *
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {association.associationLogo ? (
              <div className="w-16 h-16 rounded-xl border border-slate-700 bg-slate-950 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src={association.associationLogo}
                  alt="Association Logo"
                  className="w-full h-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 flex-shrink-0 flex items-center justify-center text-slate-500">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isUploadingLogo ? 'Uploading to Cloudinary...' : 'Upload Logo'}</span>
                </button>
                <span className="text-[11px] text-slate-500">PNG, JPG or SVG</span>
              </div>
              <input
                type="url"
                value={association.associationLogo}
                onChange={e => handleChange('associationLogo', e.target.value)}
                placeholder="Or paste direct image URL (e.g. Cloudinary/CDN)..."
                className={`w-full px-3 py-1.5 bg-slate-950 border rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none ${
                  errors.associationLogo ? 'border-red-500' : 'border-slate-800 focus:border-amber-500'
                }`}
              />
            </div>
          </div>
          {errors.associationLogo && (
            <p className="text-[11px] text-red-400 mt-2">{errors.associationLogo}</p>
          )}
        </div>
      </div>
    </div>
  );
};
