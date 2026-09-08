import React, { useState } from 'react';
import { Search, ShieldAlert, AlertCircle, Lock, ShieldCheck } from 'lucide-react';

export const LookupRegistration: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthPending, setIsAuthPending] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setErrorMessage(null);
    setResult(null);
    setIsAuthPending(false);

    try {
      const res = await fetch(`/api/registrations/${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (res.status === 401 && data.error === 'AuthenticationPending') {
        setIsAuthPending(true);
      } else if (res.ok && data.registration) {
        setResult(data.registration);
      } else {
        setErrorMessage(data.message || 'No team registration found matching your lookup.');
      }
    } catch (err) {
      setErrorMessage('Could not connect to registration server. Please check your connection.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport">
          PRIVATE REGISTRATION LOOKUP & CREDENTIALS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 mb-2">
          Verify Registration Status
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your <strong>4-digit numeric Team Code</strong> (e.g. <code className="text-[#FFB800]">4821</code>) or <strong>Registration ID</strong> (e.g. <code className="text-[#FFB800]">BPL-2026-0001</code>).
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Enter 4-digit Team Code (e.g. 4821) or Registration ID (e.g. BPL-2026-0001)..."
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
      </form>

      {/* Authentication Pending Banner (Child / Parent Privacy Guard) */}
      {isAuthPending && (
        <div className="max-w-2xl mx-auto p-5 rounded-2xl bg-[#091230] border border-[#FFB800]/40 text-left space-y-2.5 shadow-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#FFB800]" />
            <h4 className="text-sm font-bold text-white font-heading">
              Private Lookup Protected — BidWar OTP Authentication Pending
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To strictly protect child and parent personal data, full registration lookup requires an authenticated BidWar mobile OTP session.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[11px] text-[#FFB800] font-mono-sport font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Direct lookup will unlock upon official BidWar OTP identity provider connection.</span>
          </div>
        </div>
      )}

      {/* Error display */}
      {errorMessage && !isAuthPending && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div>
            <strong className="block text-red-200">Lookup Notice</strong>
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
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-[#FFB800] font-mono-sport">
                  {result.category === 'class_4_5_6' ? 'Class 4–5–6 Division' : 'Class 7–8–9 Division'}
                </span>
                <h3 className="text-xl font-black text-white font-heading">
                  {result.branding?.teamName || result.teamName}
                </h3>
                <p className="text-xs text-slate-300">
                  {result.association?.associationName} ({result.association?.branch})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-mono-sport">
                {result.status || 'SUBMITTED'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
