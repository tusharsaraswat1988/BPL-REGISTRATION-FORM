import React, { useState } from 'react';
import { RegistrationRecord } from '../types';
import { Search, Trophy, Shield } from 'lucide-react';

interface DirectoryProps {
  registrations: RegistrationRecord[];
}

export const TeamsDirectory: React.FC<DirectoryProps> = ({ registrations }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = registrations.filter(team => {
    const matchesCategory = selectedCategory === 'all' || team.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      team.branding.teamName.toLowerCase().includes(q) ||
      team.association.associationName.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1A2C68]">
        <div>
          <span className="text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport">
            OFFICIAL TOURNAMENT SHOWCASE • SEASON 1
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            Registered Teams
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Confirmed school and academy teams participating in the BidWar Premier League Kids Version.
          </p>
        </div>

        {/* Division Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0A1230] p-1 rounded-xl border border-[#1A2C68] text-xs font-semibold overflow-x-auto">
          {[
            { id: 'all', label: 'All Teams' },
            { id: 'class_4_5_6', label: 'Class 4–5–6' },
            { id: 'class_7_8_9', label: 'Class 7–8–9' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer select-none font-heading text-xs uppercase tracking-wider ${
                selectedCategory === cat.id
                  ? 'bg-[#FFB800] text-slate-950 font-black shadow-md shadow-[#FFB800]/20'
                  : 'text-slate-400 hover:text-white hover:bg-[#0E1B48]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by Team Name or School..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] shadow-inner"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
      </div>

      {/* Simplified Showcase Teams Grid (Strict Privacy Enforced) */}
      {filteredTeams.length === 0 ? (
        <div className="p-12 text-center bg-[#0B1538]/60 rounded-2xl border border-[#1A2C68]">
          <p className="text-sm text-slate-400">No teams match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map(record => {
            const isCategory1 = record.category === 'class_4_5_6';
            const categoryLabel = isCategory1 ? 'Class 4–5–6' : 'Class 7–8–9';

            return (
              <div
                key={record.id}
                className="bg-[#0B1538] border border-[#1A2C68] hover:border-[#FFB800]/60 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-[#FFB800]/10 flex flex-col items-center text-center group"
              >
                {/* 1. LARGE ASSOCIATION LOGO (Visual Focal Point) */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#070D24] border border-[#1A2C68] group-hover:border-[#FFB800]/40 p-2 flex items-center justify-center mb-5 shadow-lg relative overflow-hidden transition-colors">
                  {record.association.associationLogo ? (
                    <img
                      src={record.association.associationLogo}
                      alt={record.association.associationName}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#FFB800]">
                      <Shield className="w-10 h-10 stroke-1" />
                      <span className="text-[10px] font-black uppercase font-mono-sport mt-1 text-slate-400">
                        {record.association.associationName?.slice(0, 3).toUpperCase() || 'BPL'}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. TEAM NAME */}
                <h3 className="text-lg sm:text-xl font-black text-white font-heading tracking-wide uppercase leading-tight line-clamp-2">
                  {record.branding.teamName}
                </h3>

                {/* 3. ASSOCIATION NAME */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1.5 mb-5 line-clamp-2">
                  {record.association.associationName}
                </p>

                {/* 4. CATEGORY BADGE */}
                <div className="mt-auto pt-2 w-full flex justify-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono-sport uppercase tracking-wider ${
                      isCategory1
                        ? 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30'
                        : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{categoryLabel}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
