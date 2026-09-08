import React, { useState } from 'react';
import { RegistrationRecord } from '../types';
import { TeamPassModal } from './TeamPassModal';
import { Search, CheckCircle2, AlertCircle, Printer } from 'lucide-react';

interface LookupProps {
  onSelectRegistration?: (record: RegistrationRecord) => void;
}

export const LookupRegistration: React.FC<LookupProps> = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<RegistrationRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);

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
        <span className="text-xs font-black tracking-widest text-amber-400 uppercase font-mono-sport">
          VERIFICATION & CREDENTIALS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 mb-2">
          Find Your Team Pass & Registration Status
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Enter your <strong>4-digit numeric Team Code</strong> (e.g. <code>1027</code>), <strong>Registration ID</strong> (e.g. <code>BPL-2026-0001</code>), or Mentor Mobile.
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
            className="w-full pl-11 pr-32 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-xl"
          />
          <Search className="w-5 h-5 text-slate-500 absolute left-3.5" />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick Demo links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
          <span>Try sample:</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('1027')}
            className="text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
          >
            Team Code 1027 (DPS)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('1035')}
            className="text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
          >
            Team Code 1035 (Drona)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handleQuickDemo('BPL-2026-0001')}
            className="text-amber-400 hover:text-amber-300 font-mono underline cursor-pointer"
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
        <div className="max-w-2xl mx-auto mt-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm font-mono-sport text-white shadow"
                style={{
                  backgroundColor: result.branding.primaryColor || '#0284c7',
                  border: `2px solid ${result.branding.secondaryColor || '#f59e0b'}`
                }}
              >
                BPL
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400 font-mono-sport">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {result.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Team Code</span>
              <strong className="text-amber-400 font-mono text-base">{result.teamCode}</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Registration ID</span>
              <strong className="text-white font-mono">{result.id}</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Squad Members</span>
              <strong className="text-white">{result.players.length} Players (Exact)</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fee Paid</span>
              <strong className="text-amber-400 font-mono">₹{result.payment.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowPassModal(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer font-heading"
            >
              <Printer className="w-4 h-4" />
              <span>Open & Print Official Team Pass</span>
            </button>
          </div>
        </div>
      )}

      {showPassModal && result && (
        <TeamPassModal
          registration={result}
          onClose={() => setShowPassModal(false)}
        />
      )}
    </div>
  );
};
