import React, { useState } from 'react';
import { RegistrationRecord } from '../types';
import { Search, CheckCircle2, AlertCircle, Lock, Shield, Users, Building, Trophy, HelpCircle } from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';

interface LookupProps {
  onSelectRegistration?: (record: RegistrationRecord) => void;
}

export const LookupRegistration: React.FC<LookupProps> = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<RegistrationRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    setResult(null);

    try {
      const res = await fetch(`/api/registrations/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok && data.registration) {
        setResult(data.registration);
      } else {
        setErrorMessage(data.message || 'No team registration found matching your lookup.');
      }
    } catch (err) {
      setErrorMessage('Could not connect to registration server. Please check connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickDemo = (sampleCode: string) => {
    setQuery(sampleCode);
    setIsSearching(true);
    setErrorMessage(null);
    fetch(`/api/registrations/${encodeURIComponent(sampleCode)}`)
      .then(res => res.json())
      .then(data => {
        if (data.registration) setResult(data.registration);
        else setErrorMessage(data.message || 'Team not found');
      })
      .catch(() => setErrorMessage('Error fetching record'))
      .finally(() => setIsSearching(false));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport">
          VERIFICATION & CREDENTIAL STATUS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 mb-2">
          Verify Registration Status
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your <strong>4-digit numeric Team Code</strong> (e.g. <code className="text-[#FFB800]">1027</code>), <strong>Registration ID</strong> (e.g. <code className="text-[#FFB800]">BPL-2026-0001</code>), or Mentor Mobile.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter 4-digit Team Code (e.g. 1027) or Registration ID..."
            className="w-full pl-11 pr-32 py-3.5 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] shadow-xl"
          />
          <Search className="w-5 h-5 text-slate-500 absolute left-3.5" />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 px-4 py-2 rounded-lg bg-[#FFB800] hover:bg-[#FBBF24] disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
          <span>Try verified sample:</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('1027')}
            className="text-[#FFB800] hover:underline font-mono cursor-pointer"
          >
            Team Code 1027 (DPS)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('4831')}
            className="text-[#FFB800] hover:underline font-mono cursor-pointer"
          >
            Team Code 4831 (Drona)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('BPL-2026-0001')}
            className="text-[#FFB800] hover:underline font-mono cursor-pointer"
          >
            BPL-2026-0001
          </button>
        </div>
      </form>

      {/* Error display */}
      {errorMessage && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div>
            <strong className="block text-red-200">Record Not Found</strong>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="max-w-2xl mx-auto mt-6 bg-[#0A1230] border border-[#1A2C68] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A2C68]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#070D24] border border-[#1A2C68] flex items-center justify-center font-black text-sm font-mono-sport text-[#FFB800] shadow">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#FFB800] font-mono-sport">
                  {result.category === 'class_4_5_6' ? 'Class 4–5–6 Division' : 'Class 7–8–9 Division'}
                </span>
                <h3 className="text-xl font-black text-white font-heading">
                  {result.branding.teamName}
                </h3>
                <p className="text-xs text-slate-300">
                  {result.association.associationName} ({result.association.branch})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-sport">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {result.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Team Code</span>
              <strong className="text-[#FFB800] font-mono text-base">{result.teamCode}</strong>
            </div>
            <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registration ID</span>
              <strong className="text-white font-mono">{result.id}</strong>
            </div>
            <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Squad Roster</span>
              <strong className="text-white">{result.players.length} Players (Exact)</strong>
            </div>
            <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68]">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fee Verified</span>
              <strong className="text-[#FFB800] font-mono">₹{result.payment.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* TEAM PASS: EXPLICITLY COMING SOON - NOT ACTIVE */}
          <div className="p-4 rounded-xl bg-[#070D24] border border-[#1A2C68] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-sport">
                  Team Pass — Coming Soon
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Official tournament passes will be issued once verification is completed by the tournament committee.
              </p>
            </div>
            <button
              disabled
              className="px-4 py-2 rounded-lg bg-slate-900 text-slate-500 text-xs font-bold border border-slate-800 cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Pass Unavailable</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
