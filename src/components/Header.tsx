import React from 'react';
import { Trophy, Shield, Calendar, Users, FileText, Search, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'register' | 'lookup' | 'teams' | 'rules';
  setActiveTab: (tab: 'register' | 'lookup' | 'teams' | 'rules') => void;
  registeredCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, registeredCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top utility bar */}
        <div className="flex items-center justify-between py-2 border-b border-slate-800/50 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-semibold tracking-wide">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              OFFICIAL REGISTRATION PORTAL
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">
              Tournament Dates: <strong className="text-slate-200">3rd & 4th October 2026</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              <span className="text-slate-400">Organised by:</span>
              <span className="font-semibold text-slate-200">Bidwar.in & KV TechMedia</span>
            </div>
            <a 
              href="https://bidwar.in" 
              target="_blank" 
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 font-medium transition-colors hidden sm:inline"
            >
              bidwar.in ↗
            </a>
          </div>
        </div>

        {/* Main Brand & Navigation bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-3.5 gap-4">
          {/* Tournament Identity */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('register')}
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6 text-slate-950" />
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-slate-900 border border-amber-400/60 rounded text-[9px] font-bold text-amber-300">
                S1
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold tracking-widest text-amber-400 uppercase font-mono-sport">
                  BIDWAR PREMIER LEAGUE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  KIDS
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-heading">
                BPL KIDS <span className="text-amber-400">2026</span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Box Cricket Tournament • Season 1
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Team Registration</span>
            </button>

            <button
              onClick={() => setActiveTab('lookup')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'lookup'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Find Team Pass</span>
            </button>

            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'teams'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Teams ({registeredCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'rules'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Rules & Format</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
