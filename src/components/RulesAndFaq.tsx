import React, { useState } from 'react';
import { 
  Trophy, Shield, Calendar, HelpCircle, Tv, Users, 
  Award, CheckCircle2, AlertTriangle, Scale, Target, 
  Flame, ChevronDown, ChevronRight, UserCheck, Clock,
  Sparkles, FileText, ArrowRight, ShieldCheck, HeartHandshake
} from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';

export const RulesAndFaq: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'format' | 'eligibility' | 'knockout' | 'discipline' | 'fees'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "What are the two official tournament categories and age limits?",
      a: "The tournament is conducted separately across two strict categories: Category 1 (Class 4 to Class 6) for players aged 8 Years to 11 Years 11 Months 29 Days, and Category 2 (Class 7 to Class 9) for players aged 12 Years to 14 Years 11 Months 29 Days. Players must satisfy both the class and the age bracket of their category."
    },
    {
      q: "How many teams participate and how is each category structured?",
      a: "Each category consists of exactly 8 teams divided into 2 groups (Group A: 4 teams and Group B: 4 teams). Every team plays 3 league matches against the other teams in its group, resulting in 6 league matches per group (12 league matches per category)."
    },
    {
      q: "How do teams qualify for the Semi-Finals?",
      a: "The top 2 teams from Group A (1st & 2nd) and the top 2 teams from Group B (1st & 2nd) qualify for the Semi-Final stage (4 Semi-Finalists per category). Teams should ideally target a minimum of 2 wins from 3 matches. Tie-breakers are decided based on Points, then Net Run Rate (NRR), followed by other official tournament tie-breakers."
    },
    {
      q: "What is the Semi-Final and Grand Final format?",
      a: "The 4 qualified teams compete in knockout matches: Semi-Final 1 (Group A Qualifier vs Group B Qualifier) and Semi-Final 2 (Group B Qualifier vs Group A Qualifier). The winners advance to the Grand Final to be crowned Category Champion."
    },
    {
      q: "What is the squad size and are substitutes allowed?",
      a: "Every squad must have EXACTLY 8 registered players and exactly 1 designated Team Mentor/Coach. No substitutes or reserve players are permitted during the tournament."
    },
    {
      q: "What is the registration fee breakdown?",
      a: "Player registration is ₹1,000 per player (total ₹8,000 for the full squad of 8 players). For schools or academies wishing to associate their brand name, custom jersey logos, live broadcast overlays, and social spotlight, an optional Branding Package is available for an additional ₹5,000 (total ₹13,000)."
    },
    {
      q: "What is the registration deadline?",
      a: "The official registration deadline is 15 September 2026. Slots are strictly capped at 8 teams per category on a first-confirmed basis."
    },
    {
      q: "What credentials and ID verification are required?",
      a: "Upon confirmed registration, teams receive an official Registration ID (e.g. BPL-2026-0001) and a 4-digit Team Code (e.g. 1027). Tournament management may conduct age, student class, and identity verification at any time. Any team fielding an ineligible player faces immediate disciplinary action or disqualification."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* 1. Header Banner & Tournament Motto */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL TOURNAMENT STRUCTURE & RULEBOOK</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
          RULES & FORMAT
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Authoritative regulations, match structure, eligibility criteria, knockout flow, and code of conduct for{' '}
          <strong className="text-white">BIDWAR PREMIER LEAGUE — KIDS BOX CRICKET SEASON 1</strong>.
        </p>

        {/* Motto Pill */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 font-mono-sport text-xs">
          <span className="px-3 py-1 rounded-lg bg-[#0B1538] border border-[#1A2C68] text-[#FFB800] font-bold">
            🏆 PLAY HARD
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0B1538] border border-[#1A2C68] text-sky-400 font-bold">
            🤝 PLAY FAIR
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#0B1538] border border-[#1A2C68] text-emerald-400 font-bold">
            🔥 PLAY BOLD
          </span>
        </div>
      </div>

      {/* 2. Quick Filter Navigation Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'all', label: 'Complete Rulebook' },
          { id: 'format', label: 'Tournament Format' },
          { id: 'eligibility', label: 'Age & Eligibility' },
          { id: 'knockout', label: 'League & Knockouts' },
          { id: 'discipline', label: 'Mentors & Discipline' },
          { id: 'fees', label: 'Fees & Registration' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#FFB800] text-[#070D24] shadow-lg shadow-[#FFB800]/20'
                : 'bg-[#0B1538] text-slate-300 border border-[#1A2C68] hover:border-slate-500 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Section: About The Tournament & Core Experience */}
      {(activeTab === 'all' || activeTab === 'format') && (
        <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#FFB800]/20 text-[#FFB800] font-bold text-xs flex items-center justify-center border border-[#FFB800]/40">
                01
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                About The Tournament
              </h2>
            </div>
            <span className="text-xs text-slate-400 uppercase font-semibold">SEASON 01 OVERVIEW</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white">BIDWAR PREMIER LEAGUE – KIDS BOX CRICKET EDITION</strong> is a competitive box-cricket tournament specially designed for young school and academy players. The tournament is structured to give every participating player the experience of competitive cricket, teamwork, strategy, match pressure and knockout-stage competition.
          </p>

          {/* 6 Pillars of BPL */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { title: 'COMPETITION', desc: 'High-intensity box cricket', color: 'text-[#FFB800]' },
              { title: 'STRATEGY', desc: 'Tactical field & run planning', color: 'text-sky-400' },
              { title: 'TEAMWORK', desc: '8-player unified squad', color: 'text-emerald-400' },
              { title: 'MATCH PRESSURE', desc: 'Every ball and run matters', color: 'text-rose-400' },
              { title: 'SPORTSMANSHIP', desc: 'Fair play & umpire respect', color: 'text-purple-400' },
              { title: 'KNOCKOUTS', desc: 'Semi-Finals & Grand Final', color: 'text-amber-400' }
            ].map((pillar, i) => (
              <div key={i} className="scoreboard-tile p-3 text-center space-y-1">
                <span className={`text-[11px] font-bold ${pillar.color} uppercase block tracking-wider`}>
                  {pillar.title}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {pillar.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Section: Age Categories & Strict Eligibility */}
      {(activeTab === 'all' || activeTab === 'eligibility') && (
        <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center border border-sky-500/40">
                02
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Age Categories & Eligibility
              </h2>
            </div>
            <span className="text-xs text-sky-400 font-bold uppercase">TWO SEPARATE DIVISIONS</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The tournament is conducted separately across two strict age and class categories. Players must fall within the prescribed age bracket of the category in which they participate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category 1 Card */}
            <div className="scoreboard-tile p-5 space-y-4 border-l-4 border-l-[#FFB800]">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] text-xs font-bold border border-[#FFB800]/40 uppercase font-mono-sport">
                  🔵 CATEGORY 1
                </span>
                <span className="text-xs text-slate-400 font-bold">8 TEAMS MAX</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">CLASS 4 TO CLASS 6</h3>
                <p className="text-xs text-slate-300 mt-1">Junior division for school students enrolled in 4th, 5th, or 6th standard.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070D24] border border-[#1A2C68] space-y-1.5">
                <div className="text-[11px] text-[#FFB800] uppercase font-bold tracking-wider">Exact Age Eligibility:</div>
                <div className="text-sm font-bold text-white font-mono-sport">
                  8 Years to 11 Years 11 Months 29 Days
                </div>
                <div className="text-[11px] text-slate-400">
                  Roster: Exactly 8 players · 1 Mentor · Zero substitutes
                </div>
              </div>
            </div>

            {/* Category 2 Card */}
            <div className="scoreboard-tile p-5 space-y-4 border-l-4 border-l-sky-400">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/40 uppercase font-mono-sport">
                  🟠 CATEGORY 2
                </span>
                <span className="text-xs text-slate-400 font-bold">8 TEAMS MAX</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">CLASS 7 TO CLASS 9</h3>
                <p className="text-xs text-slate-300 mt-1">Senior youth division for school students enrolled in 7th, 8th, or 9th standard.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070D24] border border-[#1A2C68] space-y-1.5">
                <div className="text-[11px] text-sky-400 uppercase font-bold tracking-wider">Exact Age Eligibility:</div>
                <div className="text-sm font-bold text-white font-mono-sport">
                  12 Years to 14 Years 11 Months 29 Days
                </div>
                <div className="text-[11px] text-slate-400">
                  Roster: Exactly 8 players · 1 Mentor · Zero substitutes
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-white block">Mandatory Player & Age Verification:</strong>
              <span>
                Only registered and eligible players will be permitted to represent a team. The tournament management may conduct age or identity verification whenever required. Any team found using an ineligible player may face disciplinary action, including forfeiture of matches or immediate disqualification.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Section: Tournament Format & Complete Flow */}
      {(activeTab === 'all' || activeTab === 'format' || activeTab === 'knockout') && (
        <div className="panel-rail p-6 sm:p-8 space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                03
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Tournament Format & Flow
              </h2>
            </div>
            <span className="text-xs text-emerald-400 font-bold uppercase">PER CATEGORY BLUEPRINT</span>
          </div>

          {/* Visual Tournament Progression Flow */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#FFB800]" />
              Visual Progression Pathway (For Each Category)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="scoreboard-tile p-4 text-center space-y-2 border-t-2 border-t-[#FFB800]">
                <div className="text-[10px] font-bold text-[#FFB800] uppercase">STAGE 1</div>
                <div className="font-display text-lg font-bold text-white">8 TEAMS</div>
                <p className="text-[11px] text-slate-400">Divided into 2 Groups (Group A & Group B of 4 teams each)</p>
              </div>

              <div className="scoreboard-tile p-4 text-center space-y-2 border-t-2 border-t-sky-400">
                <div className="text-[10px] font-bold text-sky-400 uppercase">STAGE 2</div>
                <div className="font-display text-lg font-bold text-white">GROUP LEAGUE</div>
                <p className="text-[11px] text-slate-400">Every team plays 3 league matches (6 matches/group, 12 total)</p>
              </div>

              <div className="scoreboard-tile p-4 text-center space-y-2 border-t-2 border-t-emerald-400">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">STAGE 3</div>
                <div className="font-display text-lg font-bold text-white">TOP 2 ADVANCE</div>
                <p className="text-[11px] text-slate-400">Top 2 from Group A + Top 2 from Group B = 4 Semi-Finalists</p>
              </div>

              <div className="scoreboard-tile p-4 text-center space-y-2 border-t-2 border-t-purple-400">
                <div className="text-[10px] font-bold text-purple-400 uppercase">STAGE 4</div>
                <div className="font-display text-lg font-bold text-white">2 SEMI-FINALS</div>
                <p className="text-[11px] text-slate-400">Group A Qualifiers vs Group B Qualifiers in knockout ties</p>
              </div>

              <div className="scoreboard-tile p-4 text-center space-y-2 border-t-2 border-t-amber-400 bg-[#FFB800]/5">
                <div className="text-[10px] font-bold text-[#FFB800] uppercase">STAGE 5</div>
                <div className="font-display text-lg font-bold text-[#FFB800]">GRAND FINAL</div>
                <p className="text-[11px] text-slate-300">Winners collide to crown the Category Champion 🏆</p>
              </div>
            </div>
          </div>

          {/* Group Stage Match Structure Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-[#070D24] border border-[#1A2C68] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
                  Group Stage Structure (4 Teams)
                </h4>
                <span className="text-xs text-[#FFB800] font-mono font-bold">6 MATCHES / GROUP</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                In each 4-team group (Team A, Team B, Team C, Team D), every team plays against each of the other 3 teams once:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#0B1538] border border-white/5 text-slate-200">
                  🏏 Match 1: <strong>Team A vs Team B</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1538] border border-white/5 text-slate-200">
                  🏏 Match 2: <strong>Team A vs Team C</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1538] border border-white/5 text-slate-200">
                  🏏 Match 3: <strong>Team A vs Team D</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1538] border border-white/5 text-slate-200">
                  🏏 Match 4: <strong>Team B vs Team C</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1538] border border-white/5 text-slate-200">
                  🏏 Match 5: <strong>Team B vs Team D</strong>
                </div>
                <div className="p-2.5 rounded-lg bg-[#0B1538] border border-white/5 text-slate-200">
                  🏏 Match 6: <strong>Team C vs Team D</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-xs text-slate-400 space-y-1">
                <div>✅ Every team plays <strong>3 league matches</strong></div>
                <div>✅ Every team faces every other team in its group once</div>
                <div>✅ 2 Groups × 6 matches = <strong>12 league matches per category</strong></div>
              </div>
            </div>

            {/* Knockout Bracket Card */}
            <div className="p-5 rounded-2xl bg-[#070D24] border border-[#1A2C68] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#FFB800]" />
                  Semi-Finals & Grand Final Knockout
                </h4>
                <span className="text-xs text-sky-400 font-mono font-bold">KNOCKOUT STAGE</span>
              </div>

              <div className="space-y-3">
                {/* Semi-Final 1 */}
                <div className="p-3 rounded-xl bg-[#0B1538] border border-sky-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-sky-400 uppercase">
                    <span>SEMI-FINAL 1</span>
                    <span>KNOCKOUT TIE</span>
                  </div>
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Group A Qualifier</span>
                    <span className="text-slate-500">VS</span>
                    <span>Group B Qualifier</span>
                  </div>
                </div>

                {/* Semi-Final 2 */}
                <div className="p-3 rounded-xl bg-[#0B1538] border border-sky-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-sky-400 uppercase">
                    <span>SEMI-FINAL 2</span>
                    <span>KNOCKOUT TIE</span>
                  </div>
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Group B Qualifier</span>
                    <span className="text-slate-500">VS</span>
                    <span>Group A Qualifier</span>
                  </div>
                </div>

                {/* Grand Final */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FFB800]/15 via-[#FFB800]/10 to-transparent border border-[#FFB800]/40 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#FFB800] uppercase">
                    <span>🏆 GRAND FINAL</span>
                    <span className="text-emerald-400 font-bold">CHAMPIONSHIP</span>
                  </div>
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Winner Semi-Final 1</span>
                    <span className="text-[#FFB800] font-black">VS</span>
                    <span>Winner Semi-Final 2</span>
                  </div>
                  <div className="text-[11px] text-[#FFB800] pt-1 text-center font-bold">
                    Winner Crowned Category Champion 🥇
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Section: Qualification Targets, Tie-Breakers & Net Run Rate (NRR) */}
      {(activeTab === 'all' || activeTab === 'knockout') && (
        <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center border border-purple-500/40">
                04
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Qualification Criteria & Net Run Rate (NRR)
              </h2>
            </div>
            <span className="text-xs text-purple-400 font-bold uppercase">TIE-BREAKER PROTOCOL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="scoreboard-tile p-5 space-y-2">
              <div className="text-xs font-bold text-[#FFB800] uppercase">TARGET 01</div>
              <h3 className="text-base font-bold text-white font-display">Ideal Qualification Target</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Each team should ideally aim to secure <strong className="text-white">MINIMUM 2 WINS</strong> from its 3 league matches to place itself in a strong position for qualification.
              </p>
            </div>

            <div className="scoreboard-tile p-5 space-y-2">
              <div className="text-xs font-bold text-sky-400 uppercase">TARGET 02</div>
              <h3 className="text-base font-bold text-white font-display">Tie-Breaker Hierarchy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                If fewer than two teams achieve two wins, qualifications are decided strictly in this order:
              </p>
              <ol className="text-xs text-slate-200 list-decimal list-inside space-y-1 font-semibold pt-1">
                <li>Total Points</li>
                <li>Net Run Rate (NRR)</li>
                <li>Other applicable tie-breakers</li>
              </ol>
            </div>

            <div className="scoreboard-tile p-5 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase">TARGET 03</div>
              <h3 className="text-base font-bold text-white font-display">Every Ball Matters</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Net Run Rate (NRR) is crucial. Teams must compete seriously until the final ball of every match and never assume qualification until official standings are declared.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. Section: Team Mentors, Discipline & Match Officials */}
      {(activeTab === 'all' || activeTab === 'discipline') && (
        <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center border border-rose-500/40">
                05
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Mentors, Discipline & Match Officials
              </h2>
            </div>
            <span className="text-xs text-rose-400 font-bold uppercase">CODE OF CONDUCT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mentors Card */}
            <div className="scoreboard-tile p-5 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display">Role of Team Mentors</h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Exactly <strong>1 official mentor</strong> per team.</li>
                <li>Coordinates team participation & reporting.</li>
                <li>Primary contact for organizers & match desk.</li>
                <li>Ensures young players understand & follow all rules.</li>
              </ul>
            </div>

            {/* Discipline Card */}
            <div className="scoreboard-tile p-5 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display">Team & Player Discipline</h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Respect opponents, coaches, and staff.</li>
                <li>Strict sportsmanlike conduct on & off field.</li>
                <li>Zero tolerance for abusive language or behavior.</li>
                <li>Serious misconduct results in penalties or disqualification.</li>
              </ul>
            </div>

            {/* Match Officials Card */}
            <div className="scoreboard-tile p-5 space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-display">Match Officials & Umpires</h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Umpires & appointed officials have final say on pitch.</li>
                <li>No unnecessary arguments or delays permitted.</li>
                <li>Any official concern must be routed via team mentor only.</li>
                <li>Decision of tournament management is authoritative.</li>
              </ul>
            </div>
          </div>

          {/* Schedule & Unforeseen Circumstances */}
          <div className="p-4 rounded-xl bg-[#070D24] border border-[#1A2C68] space-y-2 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FFB800]" />
              Match Schedule & Unforeseen Circumstances
            </div>
            <p className="leading-relaxed">
              Teams will receive their individualized fixture schedules separately and must report well before their scheduled slot. In case of weather, technical issues, venue constraints or other unforeseen circumstances, tournament management reserves the right to modify match timings, sequence, format, playing conditions or fixture structure. All decisions of tournament management are final.
            </p>
          </div>
        </div>
      )}

      {/* 8. Section: Registration Fees & Deadline */}
      {(activeTab === 'all' || activeTab === 'fees') && (
        <div className="panel-rail p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-[#FFB800]/20 text-[#FFB800] font-bold text-xs flex items-center justify-center border border-[#FFB800]/40">
                06
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                Registration Fees & Official Deadline
              </h2>
            </div>
            <span className="text-xs text-[#FFB800] font-bold uppercase font-mono-sport">DEADLINE: 15 SEPT 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Standard Entry Fee */}
            <div className="scoreboard-tile p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-400">PLAYER REGISTRATION</span>
                <span className="text-xs text-emerald-400 font-bold">STANDARD SQUAD</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-white font-display">₹1,000 <span className="text-sm font-normal text-slate-400">/ Player</span></div>
                <div className="text-sm text-[#FFB800] font-bold">₹8,000 per Team Squad (8 Players)</div>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 border-t border-white/10 pt-3 list-disc list-inside">
                <li>Guaranteed minimum 3 league matches</li>
                <li>Official tournament credentials & team code</li>
                <li>Live digital scoring & ball-by-ball web updates</li>
                <li>Access to knockout stages (Semi-Finals & Final)</li>
              </ul>
            </div>

            {/* School/Academy Brand Association Package */}
            <div className="scoreboard-tile p-6 space-y-4 border-2 border-[#FFB800]/40 relative overflow-hidden bg-gradient-to-b from-[#FFB800]/10 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#FFB800]">BRAND ASSOCIATION PACKAGE</span>
                <span className="px-2 py-0.5 rounded bg-[#FFB800]/20 text-[#FFB800] text-[10px] font-bold">OPTIONAL UPGRADE</span>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-[#FFB800] font-display">₹13,000 <span className="text-sm font-normal text-slate-300">/ Team</span></div>
                <div className="text-xs text-slate-300">₹8,000 Base Fee + ₹5,000 Brand Association</div>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 border-t border-white/10 pt-3 list-disc list-inside">
                <li>School/Academy brand crest on team jerseys</li>
                <li>Livestream OBS broadcast lower-third logo placement</li>
                <li>Dedicated social media spotlight on BidWar channels</li>
                <li>Featured banner in the public team directory</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#070D24] border border-[#1A2C68]">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                <Calendar className="w-4 h-4 text-[#FFB800]" />
                <span>Registration Deadline: <strong>15 September 2026</strong></span>
              </div>
              <p className="text-[11px] text-slate-400">Strictly 8 teams per category on a first-come, first-confirmed basis.</p>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="gold-button gold-button-hover px-6 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>REGISTER TEAM SQUAD</span>
                <ArrowRight className="w-4 h-4 text-[#070D24]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 9. Section: Frequently Asked Questions Accordion */}
      <div className="space-y-4 pt-4">
        <div className="text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFB800]">
            QUICK HELP & CLARIFICATIONS
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#FFB800]" />
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-[#0B1538] border-[#FFB800]/50 shadow-lg' 
                    : 'bg-[#091230] border-[#1A2C68] hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#070D24] text-[#FFB800] border border-[#1A2C68] text-xs flex items-center justify-center font-mono font-bold flex-shrink-0">
                      Q
                    </span>
                    <span className="text-sm font-bold text-white">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'rotate-180 text-[#FFB800]' : ''
                  }`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 pl-14">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 10. Final Call to Action Strip */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#0B1538] via-[#0D1B48] to-[#0B1538] border border-[#1A2C68] text-center space-y-4">
        <div className="max-w-2xl mx-auto space-y-2">
          <h3 className="font-display text-2xl font-bold text-white">
            Ready to Enter BidWar Premier League?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Every league match matters. Every run matters. Every wicket matters. Every decision can make a difference.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('/register')}
              className="gold-button gold-button-hover px-8 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#070D24]" />
              <span>START TEAM REGISTRATION →</span>
            </button>
          )}

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('/verify')}
              className="ghost-button ghost-button-hover px-6 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#FFB800]" />
              <span>VERIFY REGISTRATION</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
