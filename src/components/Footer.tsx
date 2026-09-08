import React from 'react';
import { ExternalLink, Shield, Instagram, Facebook, Lock, PlusCircle, Users, FileText } from 'lucide-react';
import { BplLogo } from './BplLogo';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="no-print bg-[#050A1C] border-t border-[#1A2C68] text-slate-400 text-xs mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Multi-Column Horizontal Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 sm:py-10">
          {/* Column 1: Brand & Tournament Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 select-none">
              <BplLogo size={42} className="flex-shrink-0" />
              <div>
                <h3 className="text-xs font-bold tracking-widest text-[#FFB800] uppercase font-mono leading-none">
                  BIDWAR PREMIER LEAGUE
                </h3>
                <p className="text-sm font-display text-white tracking-wide mt-1 leading-none">
                  KIDS VERSION · SEASON 01
                </p>
              </div>
            </div>
            
            <div className="space-y-1 text-[11px] font-mono">
              <p className="text-slate-300 font-medium">3–4 OCTOBER 2026</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                A BIDWAR.IN TOURNAMENT PROPERTY
              </p>
            </div>
          </div>

          {/* Column 2: Organisers Information */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB800] font-mono block">
              ORGANISED BY
            </span>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <a
                  href={TOURNAMENT_CONFIG.BIDWAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="font-semibold">Bidwar.in</span>
                  <ExternalLink className="w-3 h-3 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
              <li>
                <a
                  href={TOURNAMENT_CONFIG.KV_TECHMEDIA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="font-semibold">KV TechMedia</span>
                  <ExternalLink className="w-3 h-3 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            </ul>
            <p className="text-[10px] text-slate-500 font-mono">
              Sports Tech, Scoring & Event Management
            </p>
          </div>

          {/* Column 3: Quick Access Navigation */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB800] font-mono block">
              QUICK ACCESS
            </span>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/register')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3 h-3 text-[#FFB800]" />
                  <span>Register Team</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/teams')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Users className="w-3 h-3 text-sky-400" />
                  <span>Registered Teams</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/rules')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>Rules & Format</span>
                </button>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600 cursor-not-allowed select-none">
                <Lock className="w-3 h-3 text-slate-600" />
                <span>Team Pass</span>
                <span className="text-[8px] font-bold uppercase tracking-wider px-1 py-0.2 rounded bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/30 font-mono">
                  COMING SOON
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Connect & Social */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFB800] font-mono block">
              CONNECT
            </span>
            <div className="flex flex-col gap-2">
              {/* Instagram */}
              <a
                href={TOURNAMENT_CONFIG.BIDWAR_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official BidWar Instagram"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-[#FFB800] font-mono text-xs transition-colors group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#091230] border border-[#1A2C68] group-hover:border-[#FFB800]/40 flex items-center justify-center text-slate-400 group-hover:text-[#FFB800] transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <span>Instagram</span>
              </a>

              {/* Facebook */}
              <a
                href={TOURNAMENT_CONFIG.BIDWAR_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official BidWar Facebook"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-[#FFB800] font-mono text-xs transition-colors group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#091230] border border-[#1A2C68] group-hover:border-[#FFB800]/40 flex items-center justify-center text-slate-400 group-hover:text-[#FFB800] transition-colors">
                  <Facebook className="w-3.5 h-3.5" />
                </div>
                <span>Facebook</span>
              </a>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Official tournament updates & coverage
            </p>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="border-t border-white/5 py-3.5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2.5">
          <p>© 2026 BidWar Premier League</p>
          
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Tournament Registration Portal</span>
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a
              href={TOURNAMENT_CONFIG.BIDWAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFB800] hover:text-[#FFE066] font-medium flex items-center gap-1 transition-colors"
            >
              <span>bidwar.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
