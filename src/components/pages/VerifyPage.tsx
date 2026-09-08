import React, { useState, useEffect } from 'react';
import { AuthOtpScreen } from '../AuthOtpScreen';
import { AuthSession, fetchAuthSession, clearStoredAuthToken } from '../../utils/auth';
import { 
  ShieldCheck, Search, Trophy, Shield, LogOut, 
  AlertCircle, Loader2, CheckCircle2, Lock, ExternalLink 
} from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../../config/tournamentConfig';

interface VerifyPageProps {
  onNavigate: (path: string) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ onNavigate }) => {
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [registration, setRegistration] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check existing session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      setIsCheckingAuth(true);
      const session = await fetchAuthSession();
      if (isMounted) {
        setAuthSession(session);
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthenticated = (session: AuthSession) => {
    setAuthSession(session);
    setErrorMessage(null);
  };

  const handleLogout = () => {
    clearStoredAuthToken();
    setAuthSession(null);
    setRegistration(null);
    setQuery('');
    setErrorMessage(null);
  };

  const handleSearchRegistration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || !authSession) return;

    setIsSearching(true);
    setErrorMessage(null);
    setRegistration(null);

    try {
      const res = await fetch(`/api/registrations/${encodeURIComponent(query.trim())}`, {
        headers: {
          Authorization: `Bearer ${authSession.token}`
        }
      });

      const data = await res.json();

      if (res.ok && data.success && data.registration) {
        setRegistration(data.registration);
      } else if (res.status === 403) {
        setErrorMessage('Access denied. This registration is registered under a different mobile identity.');
      } else if (res.status === 404) {
        setErrorMessage(`No registration found matching "${query.trim()}". Please check your 4-digit Team Code or Registration ID.`);
      } else {
        setErrorMessage(data.message || 'Unable to retrieve registration details.');
      }
    } catch (err) {
      setErrorMessage('Network error connecting to tournament server. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0A1230] border border-[#1A2C68] text-[#FFB800] flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-400 font-mono-sport tracking-wider uppercase">
          Verifying secure tournament session...
        </p>
      </div>
    );
  }

  // 1. GATE: Unauthenticated user must verify mobile number with OTP
  if (!authSession) {
    return (
      <div className="py-6">
        <AuthOtpScreen
          title="Verify Your Registration"
          subtitle="Enter the mobile number used during registration. We will send you a secure OTP to verify your identity."
          purpose="bpl_lookup"
          ctaText="VERIFY OTP"
          onAuthenticated={handleAuthenticated}
        />
      </div>
    );
  }

  // 2. AUTHENTICATED: Private Registration Dashboard
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Verified Identity Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#091230] border border-emerald-500/30 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">Identity Verified</span>
              <span className="text-xs font-mono text-[#FFB800] font-semibold">{authSession.mobile}</span>
            </div>
            <p className="text-[11px] text-slate-400">Authenticated to access your private team registration records</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg bg-[#070D24] hover:bg-[#0E1B48] text-slate-400 hover:text-slate-200 border border-[#1A2C68] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Number</span>
        </button>
      </div>

      {/* Page Title & Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport block">
          PRIVATE TEAM CREDENTIALS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
          My Registration
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Enter your <strong>4-digit numeric Team Code</strong> (e.g. <code className="text-[#FFB800]">4821</code>) or <strong>Registration ID</strong> (e.g. <code className="text-[#FFB800]">BPL-2026-0001</code>).
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSearchRegistration} className="max-w-xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="Enter 4-digit Team Code or Registration ID..."
            className="w-full pl-11 pr-32 py-3.5 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 shadow-xl"
            autoFocus
          />
          <Search className="w-5 h-5 text-slate-500 absolute left-3.5" />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 px-4 py-2 rounded-lg bg-[#FFB800] hover:bg-[#FBBF24] disabled:bg-[#070D24] disabled:text-slate-600 disabled:border disabled:border-slate-800 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer font-heading"
          >
            {isSearching ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Checking...</span>
              </span>
            ) : (
              <span>LOOKUP</span>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-3 text-left shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div>
            <strong className="block text-red-200 font-bold mb-0.5">Verification Notice</strong>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* PRIVATE REGISTRATION DETAILS DISPLAY */}
      {registration && (
        <div className="max-w-2xl mx-auto bg-[#0A1230] border border-[#1A2C68] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-28 bg-[#FFB800]/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 space-y-6">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1A2C68]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <span className="text-xs font-black uppercase text-[#FFB800] font-mono-sport tracking-widest">
                  REGISTRATION FOUND ✓
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 font-mono-sport">
                STATUS: {registration.status || 'SUBMITTED'}
              </span>
            </div>

            {/* Team & Association Info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#070D24] border border-[#1A2C68] p-2 flex items-center justify-center flex-shrink-0 shadow-inner">
                {registration.association?.associationLogo ? (
                  <img
                    src={registration.association.associationLogo}
                    alt={registration.teamName}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Trophy className="w-8 h-8 text-[#FFB800]" />
                )}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#FFB800] font-mono-sport">
                  {registration.category === 'class_4_5_6' ? 'Class 4–5–6 Division' : 'Class 7–8–9 Division'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading leading-tight">
                  {registration.branding?.teamName || registration.teamName}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {registration.association?.associationName} {registration.association?.branch ? `(${registration.association.branch})` : ''}
                </p>
              </div>
            </div>

            {/* Official Credentials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#070D24] border border-[#1A2C68]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono-sport">
                  Registration ID
                </span>
                <span className="text-xl font-black text-white font-mono-sport tracking-wider mt-1 block">
                  {registration.id || registration.registrationId}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Official tournament record ID</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070D24] border border-[#1A2C68]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono-sport">
                  4-Digit Team Code
                </span>
                <span className="text-2xl font-black text-[#FFB800] font-mono-sport tracking-widest mt-0.5 block">
                  {registration.teamCode || registration.team_code}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Scoreboard & fixture control code</p>
              </div>
            </div>

            {/* Key Status Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68]">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Payment</span>
                <strong className="text-[#FFB800] font-mono">
                  {registration.payment?.paymentStatus || 'PENDING_VERIFICATION'}
                </strong>
              </div>
              <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68]">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Roster</span>
                <strong className="text-white">8 Players (Confirmed)</strong>
              </div>
              <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68] col-span-2 sm:col-span-1">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Branding</span>
                <strong className="text-slate-300">
                  {registration.includeBranding || registration.include_branding ? 'Custom Branding Active' : 'Standard Tier'}
                </strong>
              </div>
            </div>

            {/* Team Pass Note */}
            <div className="p-4 rounded-2xl bg-[#070D24] border border-[#1A2C68] space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-sport">
                  Team Pass Status: Verification in Progress
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official passes will be released in the WhatsApp community once the tournament committee verifies the roster.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
