import React from 'react';
import { 
  Trophy, Calendar, Users, FileText, ShieldCheck, 
  ArrowLeft, Lock, Sparkles, Phone, Mail, MapPin, ExternalLink 
} from 'lucide-react';
import { TournamentCategory, RegistrationConfirmationDTO } from '../../types';
import { TOURNAMENT_CONFIG } from '../../config/tournamentConfig';

interface RegisterPageProps {
  categories?: TournamentCategory[];
  onRegistrationSuccess?: (record: RegistrationConfirmationDTO) => void;
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Closed Announcement Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F1E4A] via-[#091333] to-[#060B1E] border border-amber-500/40 p-6 sm:p-10 shadow-2xl text-center space-y-6">
        {/* Ambient Sports Light Background */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFB800]/15 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 w-80 h-80 bg-blue-600/15 blur-3xl rounded-full" />

        {/* Top Notice Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Official Tournament Notice · Deadline Passed</span>
        </div>

        {/* Trophy / Emblem Visual */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#0B1538] border-2 border-[#FFB800]/40 flex items-center justify-center shadow-xl shadow-amber-500/10">
              <Trophy className="w-10 h-10 text-[#FFB800]" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              Season 1
            </span>
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase font-display tracking-tight">
            Registrations Are Closed
          </h1>
          <div className="text-base sm:text-xl font-extrabold text-[#FFB800] uppercase tracking-wide flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFB800]" />
            <span>See You in the Next League!</span>
            <Sparkles className="w-5 h-5 text-[#FFB800]" />
          </div>
        </div>

        {/* Description Message */}
        <div className="max-w-2xl mx-auto space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
          <p>
            The official registration window for{' '}
            <strong className="text-white">BidWar Premier League — Kids Box Cricket Season 1</strong>{' '}
            closed on <span className="text-[#FFB800] font-semibold">25 September 2026</span>.
            All team slots across the <span className="text-white font-medium">Class 4–6</span> and{' '}
            <span className="text-white font-medium">Class 7–9</span> divisions have now concluded.
          </p>
          <p className="text-slate-400">
            We extend our heartfelt gratitude to all participating schools, cricket academies, mentors,
            parents, and young players for the tremendous response and enthusiasm!
          </p>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-left">
          {/* Action 1: Verify Status */}
          <button
            type="button"
            onClick={() => onNavigate('/verify')}
            className="p-4 rounded-2xl bg-[#08112C] border border-[#1E3272] hover:border-[#FFB800]/50 transition-all group flex flex-col justify-between text-left cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-display font-bold text-white text-sm group-hover:text-[#FFB800] transition-colors">
                Verify Team Status
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Already registered? Look up your official credentials and payment verification.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 mt-3 flex items-center gap-1">
              Verify Status →
            </span>
          </button>

          {/* Action 2: View Teams */}
          <button
            type="button"
            onClick={() => onNavigate('/teams')}
            className="p-4 rounded-2xl bg-[#08112C] border border-[#1E3272] hover:border-[#FFB800]/50 transition-all group flex flex-col justify-between text-left cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/30 text-[#FFB800] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="font-display font-bold text-white text-sm group-hover:text-[#FFB800] transition-colors">
                Registered Teams
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Browse participating school and academy teams confirmed for Season 1.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#FFB800] mt-3 flex items-center gap-1">
              View Squads →
            </span>
          </button>

          {/* Action 3: Rules & Schedule */}
          <button
            type="button"
            onClick={() => onNavigate('/rules')}
            className="p-4 rounded-2xl bg-[#08112C] border border-[#1E3272] hover:border-[#FFB800]/50 transition-all group flex flex-col justify-between text-left cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="font-display font-bold text-white text-sm group-hover:text-[#FFB800] transition-colors">
                Rules & Format
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Check box cricket match rules, scoring criteria, and tournament guidelines.
              </p>
            </div>
            <span className="text-[11px] font-bold text-sky-400 mt-3 flex items-center gap-1">
              View Rules →
            </span>
          </button>
        </div>

        {/* Back to Home CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="ghost-button ghost-button-hover px-6 py-2.5 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFB800]" />
            <span>Return to Tournament Home</span>
          </button>
        </div>

        {/* Tournament Event Details Strip */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#FFB800]" />
            Tournament Dates: <strong className="text-white">10th & 11th October 2026</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" />
            Venue: <strong className="text-white">Pitch and Paddle, Sigra</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-sky-400" />
            Helpline: <strong className="text-white">{TOURNAMENT_CONFIG.HELPLINE_DISPLAY}</strong>
          </span>
        </div>
      </div>

      {/* Official Contact & Inquiry Support Card */}
      <div className="mt-6 p-5 rounded-2xl bg-[#091230] border border-[#1A2C68] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Have questions about Season 1 or Next Edition?
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Reach out to the official BidWar tournament team for inquiries, sponsorships, or upcoming league updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={`tel:${TOURNAMENT_CONFIG.HELPLINE_PHONE}`}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
            <span>Call Desk</span>
          </a>
          <a
            href={TOURNAMENT_CONFIG.WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Group</span>
          </a>
        </div>
      </div>
    </div>
  );
};
