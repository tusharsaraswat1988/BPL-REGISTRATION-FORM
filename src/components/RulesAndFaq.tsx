import React from 'react';
import { 
  Trophy, Shield, Calendar, HelpCircle, Tv
} from 'lucide-react';

export const RulesAndFaq: React.FC = () => {
  const faqs = [
    {
      q: "What are the official tournament categories?",
      a: "There are EXACTLY TWO registration categories based on school class: Category 1: Class 4–5–6 and Category 2: Class 7–8–9. Age-based categories such as U-11, U-13, or U-15 are strictly NOT used."
    },
    {
      q: "How many players are required per team squad?",
      a: "Every squad must have EXACTLY 8 PLAYERS. There are no substitutes or reserve players in this tournament format."
    },
    {
      q: "What is the team registration fee?",
      a: "The standard team registration fee is ₹8,000. If your team chooses the optional custom branding package (including customized team jerseys with printed school/academy logo, live broadcast lower-third graphics, and social media spotlight), the total fee is ₹13,000 (₹8,000 base + ₹5,000 branding)."
    },
    {
      q: "Who is eligible to submit registrations?",
      a: "Registrations can be submitted by schools, cricket academies, sports clubs, or sports associations through their authorized mentor or sports coordinator. Exactly ONE mentor must be designated per team."
    },
    {
      q: "What credentials are generated upon registration?",
      a: "Once registered, your team receives an official Registration ID in the format BPL-2026-XXXX (e.g. BPL-2026-0001) and an official 4-digit numeric Team Code (e.g. 1027) used for toss fixtures and digital scoring."
    },
    {
      q: "When is the tournament being held?",
      a: "The tournament takes place on 3rd & 4th October 2026 in the National Capital Region (NCR), organised by Bidwar.in & KV TechMedia."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport">
          OFFICIAL TOURNAMENT HANDBOOK
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white font-heading mt-1 mb-3">
          Tournament Format & Official Rules
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Official guidelines for <strong>BIDWAR PREMIER LEAGUE — KIDS VERSION — SEASON 1</strong>. Organised by <strong>Bidwar.in & KV TechMedia</strong>.
        </p>
      </div>

      {/* Format Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0B1538] border border-[#1A2C68] rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20 flex items-center justify-center font-bold">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">Squad & Match Structure</h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li><strong>EXACTLY 8 PLAYERS</strong> per team roster</li>
            <li><strong>No substitutes</strong> permitted</li>
            <li>Box Cricket fast-paced tournament format</li>
            <li>Multi-match tournament fixtures</li>
            <li>Toss and match control using 4-digit Team Code</li>
          </ul>
        </div>

        <div className="bg-[#0B1538] border border-[#1A2C68] rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">Mentor & Association</h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li><strong>Exactly ONE Mentor</strong> per team</li>
            <li>Mentor photo and contact verification</li>
            <li>Association/School endorsement</li>
            <li>Unique jersey numbers (1–99)</li>
            <li>Safe heavy synthetic box-cricket balls</li>
          </ul>
        </div>

        <div className="bg-[#0B1538] border border-[#1A2C68] rounded-2xl p-6 space-y-3 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <Tv className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">Fee & Tech Inclusions</h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li><strong>Base Entry Fee:</strong> ₹8,000 per team</li>
            <li><strong>With Branding:</strong> ₹13,000 (adds ₹5,000)</li>
            <li>Live ball-by-ball scoring on BidWar</li>
            <li>OBS stream lower-third graphics</li>
            <li>Official BPL-2026 digital team credentials</li>
          </ul>
        </div>
      </div>

      {/* Exactly Two Categories Detail Card */}
      <div className="bg-[#0B1538] border border-[#1A2C68] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
          <Calendar className="w-5 h-5 text-[#FFB800]" />
          Official Registration Categories
        </h3>
        <p className="text-xs text-slate-300">
          Tournament dates: <strong>3rd & 4th October 2026</strong>. There are strictly two divisions:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[#070D24] border border-[#1A2C68] text-xs space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] font-bold border border-[#FFB800]/30 uppercase font-mono-sport">
              CATEGORY 1
            </span>
            <h4 className="text-base font-bold text-white">Class 4–5–6 Division</h4>
            <p className="text-slate-300">
              For students studying in 4th, 5th, or 6th standard. All 8 players must belong to Class 4, 5, or 6.
            </p>
            <div className="pt-2 border-t border-[#1A2C68] text-[11px] text-slate-400">
              Roster requirement: Exactly 8 players
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070D24] border border-[#1A2C68] text-xs space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-500/15 text-sky-400 font-bold border border-sky-500/30 uppercase font-mono-sport">
              CATEGORY 2
            </span>
            <h4 className="text-base font-bold text-white">Class 7–8–9 Division</h4>
            <p className="text-slate-300">
              For students studying in 7th, 8th, or 9th standard. All 8 players must belong to Class 7, 8, or 9.
            </p>
            <div className="pt-2 border-t border-[#1A2C68] text-[11px] text-slate-400">
              Roster requirement: Exactly 8 players
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
          <HelpCircle className="w-5 h-5 text-[#FFB800]" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-[#0B1538] border border-[#1A2C68] space-y-2 text-left shadow"
            >
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#070D24] text-[#FFB800] border border-[#1A2C68] text-xs flex items-center justify-center font-mono font-bold">
                  Q
                </span>
                {faq.q}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
