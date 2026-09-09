import { ExternalLink, Shield, Instagram, Facebook, Youtube, Lock, PlusCircle, Users, FileText, RefreshCw, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
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
    <footer className="no-print bg-[#050A1C] border-t border-[#1A2C68] text-slate-400 text-xs mt-12 sm:mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Official Tournament WhatsApp Community Highlight Banner */}
        <div className="pt-8 sm:pt-10">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#091535] to-emerald-950/60 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-black/40">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-heading flex items-center gap-2">
                  <span>Official Tournament WhatsApp Community</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                    Live Updates
                  </span>
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Join mentors, team captains, coaches & parents for fixture announcements, toss timings, match rules, and live box-cricket schedule updates.
                </p>
              </div>
            </div>

            <a
              href={TOURNAMENT_CONFIG.WHATSAPP_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join Official Tournament WhatsApp Community"
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all flex-shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Join WhatsApp Community</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Main Multi-Column Horizontal Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-8 sm:py-12">
          {/* Column 1: Brand & Tournament Identity */}
          <div className="space-y-3.5 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 select-none">
              <BplLogo size={42} className="flex-shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-[#FFB800] uppercase tracking-wide leading-tight">
                  BIDWAR PREMIER LEAGUE
                </h3>
                <p className="text-sm font-display font-bold text-white tracking-wide mt-0.5 leading-none">
                  KIDS VERSION · SEASON 01
                </p>
              </div>
            </div>
            
            <div className="space-y-1 text-xs text-slate-300">
              <p className="font-semibold text-white">3–4 OCTOBER 2026</p>
              <p className="text-[11px] text-slate-400">
                Varanasi, Uttar Pradesh, India
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider pt-1">
                A BIDWAR.IN TOURNAMENT PROPERTY
              </p>
            </div>
          </div>

          {/* Column 2: Event Partner & Operations */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800] block">
              EVENT PARTNER
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={TOURNAMENT_CONFIG.BIDWAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer group"
                >
                  <span className="font-bold text-white">bidwar.in</span>
                  <ExternalLink className="w-3 h-3 text-[#FFB800] group-hover:translate-x-0.5 transition-transform" />
                </a>
              </li>
            </ul>
            <div className="space-y-1 text-xs pt-1 text-slate-400">
              <p className="text-white font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Varanasi Operations Desk</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FFB800]" />
                <span>Helpline: </span>
                <a href="tel:+918707488250" className="text-[#FFB800] hover:underline font-bold">
                  +91 87074 88250
                </a>
              </p>
            </div>
          </div>

          {/* Column 3: Quick Access Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800] block">
              QUICK ACCESS
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/register')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Register Team</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/teams')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Registered Teams</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/rules')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rules & Format</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/verify')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verify Status</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/admin')}
                  className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-2 text-[11px]"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Control Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800] block">
              LEGAL & POLICIES
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/terms')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FFB800]" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/privacy')}
                  className="text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/refunds')}
                  className="text-slate-300 hover:text-sky-400 transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Refund & Cancellation</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('/contact')}
                  className="text-slate-300 hover:text-[#FFB800] transition-colors cursor-pointer text-left flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Contact & Support</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect & Socials */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800] block">
              COMMUNITY & SOCIALS
            </span>
            <div className="flex flex-col gap-2">
              <a
                href={TOURNAMENT_CONFIG.WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official Tournament WhatsApp Community"
                className="inline-flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400 text-xs font-semibold transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-white text-xs block font-bold leading-tight">WhatsApp</span>
                    <span className="text-[10px] text-emerald-400/90 font-normal">Join Community</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform mr-0.5" />
              </a>

              <a
                href={TOURNAMENT_CONFIG.BIDWAR_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official BidWar Instagram"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-[#FFB800] text-xs transition-colors group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#091230] border border-[#1A2C68] group-hover:border-[#FFB800]/40 flex items-center justify-center text-slate-400 group-hover:text-[#FFB800] transition-colors">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <span>Instagram</span>
              </a>

              <a
                href={TOURNAMENT_CONFIG.BIDWAR_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official BidWar Facebook"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-[#FFB800] text-xs transition-colors group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#091230] border border-[#1A2C68] group-hover:border-[#FFB800]/40 flex items-center justify-center text-slate-400 group-hover:text-[#FFB800] transition-colors">
                  <Facebook className="w-3.5 h-3.5" />
                </div>
                <span>Facebook</span>
              </a>

              <a
                href={TOURNAMENT_CONFIG.BIDWAR_YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official BidWar YouTube"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-[#FFB800] text-xs transition-colors group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#091230] border border-[#1A2C68] group-hover:border-[#FFB800]/40 flex items-center justify-center text-slate-400 group-hover:text-[#FFB800] transition-colors">
                  <Youtube className="w-3.5 h-3.5" />
                </div>
                <span>YouTube</span>
              </a>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Official tournament updates & match coverage
            </p>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className="border-t border-white/5 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 BidWar Premier League · All Rights Reserved</p>
          
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center text-slate-400">
            <button
              type="button"
              onClick={() => handleNav('/terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => handleNav('/privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => handleNav('/refunds')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={() => handleNav('/contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <span className="text-slate-700">•</span>
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

