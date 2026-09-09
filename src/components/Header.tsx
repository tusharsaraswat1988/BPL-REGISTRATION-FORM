import React, { useState } from 'react';
import { 
  Trophy, Shield, Users, FileText, PlusCircle, 
  ExternalLink, Menu, X, ShieldCheck, MapPin, Calendar,
  ArrowLeft, Lock, LayoutDashboard
} from 'lucide-react';
import { BplLogo } from './BplLogo';
import { TOURNAMENT_CONFIG, SponsorConfig } from '../config/tournamentConfig';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  registeredCount: number;
  sponsors?: SponsorConfig[];
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPath, 
  onNavigate, 
  registeredCount,
  sponsors = TOURNAMENT_CONFIG.SPONSORS
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSponsor = sponsors && sponsors.length > 0 ? sponsors[0] : null;
  const isAdmin = currentPath === '/admin';

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const menuItems = [
    {
      id: 'register',
      label: 'Register Team',
      path: '/register',
      icon: PlusCircle,
      isPrimary: true
    },
    {
      id: 'teams',
      label: `Registered Teams (${registeredCount})`,
      path: '/teams',
      icon: Users,
      isPrimary: false
    },
    {
      id: 'rules',
      label: 'Rules & Format',
      path: '/rules',
      icon: FileText,
      isPrimary: false
    },
    {
      id: 'verify',
      label: 'Verify Status',
      path: '/verify',
      icon: ShieldCheck,
      isPrimary: false
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#070D24]/95 backdrop-blur-md border-b border-[#1A2C68]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Utility Bar */}
        <div className="flex items-center justify-between py-1.5 border-b border-white/5 text-[11px] font-sans">
          <div className="flex items-center gap-2 sm:gap-3 text-slate-300">
            <span className="flex items-center gap-1.5 text-[#FFB800] font-bold tracking-wide uppercase">
              <span className="live-dot" />
              KIDS VERSION · SEASON 1
            </span>
            <span className="text-slate-600 hidden xs:inline">•</span>
            <span className="flex items-center gap-1 text-slate-300 font-medium hidden sm:inline-flex">
              <Calendar className="w-3 h-3 text-[#FFB800]" />
              3–4 OCTOBER 2026
            </span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="flex items-center gap-1 text-slate-300 font-medium hidden md:inline-flex">
              <MapPin className="w-3 h-3 text-red-400" />
              VARANASI, U.P.
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-400">
            <span className="hidden lg:inline text-slate-400">
              Organised by <strong className="text-slate-200 font-semibold">BidWar.in & KV TechMedia</strong>
            </span>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 text-[10px] uppercase font-mono">
                <Lock className="w-2.5 h-2.5" />
                <span>Admin Session</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleNav('/admin')}
                className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                title="Admin Portal"
              >
                <ShieldCheck className="w-3 h-3 text-amber-500" />
                <span>Admin</span>
              </button>
            )}
            <a 
              href="https://bidwar.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#FFB800] hover:text-[#FFE066] font-semibold transition-colors flex items-center gap-1 active:scale-95 text-xs"
            >
              <span>bidwar.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Main Brand & Navigation Row */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Left: Official Tournament Logo + Exact Required Title/Subtitle */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group select-none min-w-0"
            onClick={() => handleNav('/')}
            title="BidWar Premier League — Home"
          >
            {/* Logo */}
            <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <BplLogo size={48} className="sm:w-[54px] sm:h-[54px]" />
            </div>

            {/* Titles */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-display font-extrabold text-white tracking-tight uppercase leading-tight group-hover:text-[#FFB800] transition-colors">
                  BIDWAR PREMIER LEAGUE
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs sm:text-sm font-semibold text-[#FFB800] tracking-wide">
                  {isAdmin ? 'Admin Control Center' : 'Registration Portal'}
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/15">
                  Varanasi
                </span>
              </div>
            </div>
          </div>

          {/* Center/Right: Desktop Menu */}
          {isAdmin ? (
            <div className="hidden sm:flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Authorized Management Console</span>
              </div>

              <button
                type="button"
                onClick={() => handleNav('/')}
                className="ghost-button ghost-button-hover px-4 py-2 text-xs font-bold flex items-center gap-2 text-slate-200 hover:text-white cursor-pointer select-none"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Public Portal</span>
              </button>
            </div>
          ) : (
            <nav className="hidden lg:flex items-center gap-1.5 bg-[#091230] p-1.5 rounded-xl border border-[#1A2C68]">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
                      isActive
                        ? 'gold-button gold-button-hover shadow-md shadow-[#FFB800]/25 text-[#070D24]'
                        : item.isPrimary
                          ? 'bg-[#FFB800]/15 text-[#FFB800] hover:bg-[#FFB800]/25 border border-[#FFB800]/30'
                          : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right: Mobile Controls */}
          {isAdmin ? (
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => handleNav('/')}
                className="ghost-button ghost-button-hover px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 text-slate-200 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Public Site</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => handleNav('/register')}
                className="gold-button gold-button-hover px-3 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-[#091230] border border-[#1A2C68] text-slate-200 hover:text-white hover:border-[#FFB800] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>

        {/* Medium Screen Horizontal Sub-Nav (Only on Public pages, hidden on Admin) */}
        {!isAdmin && (
          <div className="hidden sm:flex lg:hidden items-center justify-center pb-2.5 pt-0.5 gap-1.5 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 bg-[#091230] p-1 rounded-xl border border-[#1A2C68]">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer select-none ${
                      isActive
                        ? 'gold-button font-bold text-[#070D24]'
                        : 'text-slate-300 hover:text-white hover:bg-[#0E1B48]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu Drawer (Only on Public pages) */}
        {!isAdmin && mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#1A2C68] py-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
                    isActive
                      ? 'bg-[#FFB800] text-[#070D24]'
                      : 'bg-[#091230] text-slate-200 hover:bg-[#0E1B48] border border-[#1A2C68]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  {isActive && <span className="text-[10px] font-extrabold uppercase">Active</span>}
                </button>
              );
            })}

            <div className="pt-2 px-1 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 mt-2 font-sans">
              <span>Venue: <strong>Varanasi Arena</strong></span>
              <span>Dates: <strong>3–4 Oct 2026</strong></span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
