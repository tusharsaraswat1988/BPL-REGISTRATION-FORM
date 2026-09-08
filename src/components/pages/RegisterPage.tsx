import React, { useState, useEffect } from 'react';
import { AuthOtpScreen } from '../AuthOtpScreen';
import { RegistrationWizard } from '../RegistrationWizard';
import { TournamentCategory, RegistrationConfirmationDTO } from '../../types';
import { AuthSession, fetchAuthSession, clearStoredAuthToken } from '../../utils/auth';
import { ShieldCheck, LogOut, Loader2, Sparkles } from 'lucide-react';

interface RegisterPageProps {
  categories: TournamentCategory[];
  onRegistrationSuccess: (record: RegistrationConfirmationDTO) => void;
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  categories,
  onRegistrationSuccess,
  onNavigate
}) => {
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing valid session on mount
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
  };

  const handleLogout = () => {
    clearStoredAuthToken();
    setAuthSession(null);
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

  // 1. GATE: Unauthenticated user sees ONLY Mobile OTP Authentication
  if (!authSession) {
    return (
      <div className="py-6">
        <AuthOtpScreen
          title="Secure Team Registration"
          subtitle="Verify your mobile number to begin your team registration."
          purpose="bpl_registration"
          ctaText="VERIFY & CONTINUE"
          onAuthenticated={handleAuthenticated}
        />
      </div>
    );
  }

  // 2. AUTHENTICATED: Display Verified Header & Existing 5-Step Registration Wizard
  return (
    <div className="py-6 space-y-6">
      {/* Verified Status Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-[#091230] border border-emerald-500/30 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">✓ Mobile Verified</span>
                <span className="text-xs font-mono text-[#FFB800] font-semibold">{authSession.mobile}</span>
              </div>
              <p className="text-[11px] text-slate-400">Authenticated session active for official team entry</p>
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
      </div>

      {/* 5-Step Registration Wizard */}
      <RegistrationWizard
        categories={categories}
        onRegistrationSuccess={onRegistrationSuccess}
        onNavigateToLookup={() => onNavigate('/verify')}
        authToken={authSession.token}
      />
    </div>
  );
};
