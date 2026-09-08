import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, KeyRound, ArrowRight, RefreshCw, AlertCircle, Loader2, Lock, ArrowLeft } from 'lucide-react';
import { AuthSession, setStoredAuthToken } from '../utils/auth';

interface AuthOtpScreenProps {
  title?: string;
  subtitle?: string;
  purpose?: string;
  onAuthenticated: (session: AuthSession) => void;
  ctaText?: string;
}

export const AuthOtpScreen: React.FC<AuthOtpScreenProps> = ({
  title = 'Secure Team Registration',
  subtitle = 'Verify your mobile number to begin your team registration.',
  purpose = 'bpl_registration',
  onAuthenticated,
  ctaText = 'VERIFY & CONTINUE'
}) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const sanitizeMobile = (val: string) => {
    return val.replace(/\D/g, '').slice(0, 10);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(sanitizeMobile(e.target.value));
    setErrorMessage(null);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, purpose })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep('otp');
        setResendCooldown(30);
        setOtp(['', '', '', '', '', '']);
        setInfoMessage('OTP sent successfully to your mobile number.');
        setTimeout(() => {
          otpInputsRef.current[0]?.focus();
        }, 100);
      } else {
        setErrorMessage(data.message || 'Unable to send OTP. Please verify your mobile number.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const updated = [...otp];
      updated[index] = '';
      setOtp(updated);
      return;
    }

    const updated = [...otp];
    if (clean.length === 1) {
      updated[index] = clean;
      setOtp(updated);
      if (index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }
    } else if (clean.length > 1) {
      // Pasting full OTP
      const chars = clean.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        updated[i] = chars[i] || '';
      }
      setOtp(updated);
      const nextEmpty = updated.findIndex(c => !c);
      if (nextEmpty !== -1) {
        otpInputsRef.current[nextEmpty]?.focus();
      } else {
        otpInputsRef.current[5]?.focus();
      }
    }
    setErrorMessage(null);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: fullOtp, purpose })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setStoredAuthToken(data.token);
        const session: AuthSession = {
          token: data.token,
          userId: data.identity?.userId || `user_${mobile}`,
          mobile: data.identity?.mobile || `+91${mobile}`,
          authenticatedAt: data.identity?.authenticatedAt || new Date().toISOString()
        };
        onAuthenticated(session);
      } else {
        setErrorMessage(data.message || 'Invalid or expired OTP. Please check and try again.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formattedMobile = mobile ? `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}` : '';

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-[#0A1230] border border-[#1A2C68] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 bg-[#FFB800]/10 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Brand & Security Badge */}
          <div className="w-14 h-14 rounded-2xl bg-[#070D24] border border-[#1A2C68] text-[#FFB800] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          {/* Heading Area */}
          <div className="space-y-1.5">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport block">
              SECURE TOURNAMENT ACCESS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              {step === 'phone' ? title : 'Verify Mobile Number'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {step === 'phone' ? subtitle : `OTP sent to: ${formattedMobile}`}
            </p>
          </div>

          {/* Notification / Error Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && !errorMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 text-left">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* STEP 1: MOBILE NUMBER INPUT */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-sport mb-2">
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-400 font-bold text-sm border-r border-[#1A2C68] pr-2.5">
                    <Phone className="w-4 h-4 text-[#FFB800]" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    disabled={isLoading}
                    className="w-full pl-24 pr-4 py-3.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-base font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50 tracking-wider shadow-inner"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 pl-1">
                  We will send a 6-digit OTP to verify your mobile number.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || mobile.length !== 10}
                className="w-full py-4 rounded-xl bg-[#FFB800] hover:bg-[#FBBF24] disabled:bg-[#070D24] disabled:text-slate-600 disabled:border disabled:border-slate-800 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FFB800]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-heading"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>SEND OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT OTP INPUT */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono-sport mb-3">
                  Enter 6-Digit OTP
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      disabled={isLoading}
                      className="w-11 h-13 sm:w-13 sm:h-14 bg-[#070D24] border border-[#1A2C68] rounded-xl text-center text-xl sm:text-2xl font-black text-[#FFB800] focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/30 shadow-inner"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full py-4 rounded-xl bg-[#FFB800] hover:bg-[#FBBF24] disabled:bg-[#070D24] disabled:text-slate-600 disabled:border disabled:border-slate-800 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FFB800]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer font-heading"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{ctaText}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs border-t border-[#1A2C68]">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setErrorMessage(null);
                    setInfoMessage(null);
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Number</span>
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={() => handleSendOtp()}
                  className="text-[#FFB800] hover:text-[#FBBF24] disabled:text-slate-600 font-semibold flex items-center gap-1 cursor-pointer transition-colors py-1 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Official BidWar Authentication • Fast & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
