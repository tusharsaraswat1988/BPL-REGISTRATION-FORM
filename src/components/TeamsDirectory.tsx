import React, { useState } from 'react';
import { RegistrationRecord } from '../types';
import { TeamPassModal } from './TeamPassModal';
import { Search, ShieldCheck, MapPin, ExternalLink } from 'lucide-react';

interface DirectoryProps {
  registrations: RegistrationRecord[];
}

export const TeamsDirectory: React.FC<DirectoryProps> = ({ registrations }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalRecord, setActiveModalRecord] = useState<RegistrationRecord | null>(null);

  const filteredTeams = registrations.filter(team => {
    const matchesCategory = selectedCategory === 'all' || team.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      team.branding.teamName.toLowerCase().includes(q) ||
      team.association.associationName.toLowerCase().includes(q) ||
      team.association.branch.toLowerCase().includes(q) ||
      team.teamCode.toLowerCase().includes(q) ||
      team.mentor.name.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-black tracking-widest text-amber-400 uppercase font-mono-sport">
            CONFIRMED ROSTERS • SEASON 1
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
            Registered Teams Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Official confirmed school and academy squads for the 3rd & 4th October 2026 box-cricket tournament.
          </p>
        </div>

        {/* Official Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'class_4_5_6', label: 'Class 4–5–6' },
            { id: 'class_7_8_9', label: 'Class 7–8–9' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Filter input */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by Team Name, School, Branch, or Team Code..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
      </div>

      {/* Teams Grid */}
      {filteredTeams.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-sm text-slate-400">No teams matched your filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeams.map(record => {
            const categoryLabel = record.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9';

            return (
              <div
                key={record.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm font-mono-sport text-white shadow flex-shrink-0"
                        style={{
                          backgroundColor: record.branding.primaryColor || '#0284c7',
                          border: `2px solid ${record.branding.secondaryColor || '#f59e0b'}`
                        }}
                      >
                        BPL
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-400 font-mono-sport block">
                          {categoryLabel}
                        </span>
                        <h3 className="text-base font-bold text-white font-heading leading-snug">
                          {record.branding.teamName}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-sport font-bold bg-slate-950 text-amber-400 border border-slate-800">
                      #{record.teamCode}
                    </span>
                  </div>

                  {/* Association details */}
                  <div className="text-xs text-slate-400 space-y-1 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                    <p className="text-slate-200 font-medium">{record.association.associationName}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      Branch: {record.association.branch}
                    </p>
                    <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      Mentor: <strong className="text-slate-200">{record.mentor.name}</strong>
                    </p>
                  </div>

                  {/* Squad Preview */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span>Roster ({record.players.length} Players - Exact)</span>
                      <span className="text-amber-400 font-semibold font-mono text-[10px]">
                        ₹{record.payment.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {record.players.map((p, idx) => (
                        <span
                          key={p.id || idx}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono"
                          title={`${p.playerName} (Class ${p.studentClass})`}
                        >
                          #{p.jerseyNumber} {p.playerName.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Confirmed
                  </span>
                  <button
                    onClick={() => setActiveModalRecord(record)}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Team Pass</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeModalRecord && (
        <TeamPassModal
          registration={activeModalRecord}
          onClose={() => setActiveModalRecord(null)}
        />
      )}
    </div>
  );
};
