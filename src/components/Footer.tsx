import React from 'react';
import { Trophy, Mail, Phone, Globe, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'register' | 'lookup' | 'teams' | 'rules') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="no-print bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono-sport text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  BIDWAR PREMIER LEAGUE
                </span>
                <span className="font-heading font-black text-white text-base">
                  KIDS VERSION • S1
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Official registration and team pass gateway for the Premier Youth Box-Cricket championship.
            </p>
            <div className="pt-1">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Tournament Dates</span>
              <span className="text-white font-semibold">3rd & 4th October 2026</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider font-mono-sport">
              Tournament Portal
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('register')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Register New Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lookup')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Download Team Pass / Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('teams')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Registered Squads Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('rules')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Rules, Cutoffs & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Organizers */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider font-mono-sport">
              Tournament Organizers
            </h4>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-white font-bold block">Bidwar.in</span>
                <span className="text-[11px] text-slate-400">Sports Technology & Tournament Management Platform</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-white font-bold block">KV TechMedia</span>
                <span className="text-[11px] text-slate-400">Production, Digital Broadcasting & Event Operations</span>
              </div>
            </div>
          </div>

          {/* Helpdesk */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider font-mono-sport">
              Coordinator Helpdesk
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href="mailto:registrations@bidwar.in"
                className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>registrations@bidwar.in</span>
              </a>
              <a
                href="tel:+919871200026"
                className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 98712 00026 (WhatsApp Helpline)</span>
              </a>
              <div className="pt-2 text-[11px] text-slate-500">
                <span>Production Domain: </span>
                <code className="text-amber-400/90 font-mono">https://bpl.bidwar.in</code>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 BidWar Premier League (BPL Kids Season 1). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for competitive youth cricket with <Shield className="w-3 h-3 text-emerald-400" /> fair play & precision technology.
          </p>
        </div>
      </div>
    </footer>
  );
};
