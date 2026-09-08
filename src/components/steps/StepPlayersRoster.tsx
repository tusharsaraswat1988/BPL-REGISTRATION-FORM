import React, { useState } from 'react';
import { PlayerDetails, CategoryId, CricketRole, BattingStyle, BowlingStyle, JerseySize } from '../../types';
import { Users, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { ImageUploadField } from '../ImageUploadField';

interface StepPlayersRosterProps {
  players: PlayerDetails[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDetails[]>>;
  category: CategoryId;
  errors: Record<string, string>;
}

const cricketRoles: CricketRole[] = ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'];
const battingStyles: BattingStyle[] = ['Right Hand', 'Left Hand'];
const bowlingStyles: BowlingStyle[] = [
  'Right Arm Fast',
  'Right Arm Medium',
  'Right Arm Spin',
  'Left Arm Fast',
  'Left Arm Medium',
  'Left Arm Spin'
];
const jerseySizes: JerseySize[] = ['28', '30', '32', '34', '36', '38', '40', 'S', 'M', 'L'];

export const StepPlayersRoster: React.FC<StepPlayersRosterProps> = ({
  players,
  setPlayers,
  category,
  errors
}) => {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const allowedClasses = category === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];

  const handlePlayerChange = (index: number, field: keyof PlayerDetails, value: any) => {
    setPlayers(prev => {
      const updated = [...prev];
      const player = { ...updated[index], [field]: value };

      if (field === 'cricketRole') {
        if (value === 'Batsman' || value === 'Wicket Keeper') {
          player.bowlingStyle = undefined;
        }
        if (value === 'Bowler') {
          player.battingStyle = undefined;
        }
      }

      updated[index] = player;
      return updated;
    });
  };

  // Helper to prefill 8 compliant players for testing / demo
  const handleAutofillCompliantSquad = () => {
    const defaultYear = category === 'class_4_5_6' ? 2015 : 2013;

    const sampleRoster: Array<{ name: string; num: number; role: CricketRole; bat?: BattingStyle; bowl?: BowlingStyle; cls: number }> = [
      { name: 'Aarav Sharma', num: 7, role: 'All Rounder', bat: 'Right Hand', bowl: 'Right Arm Medium', cls: allowedClasses[1] || allowedClasses[0] },
      { name: 'Devansh Mehta', num: 18, role: 'Batsman', bat: 'Right Hand', cls: allowedClasses[1] || allowedClasses[0] },
      { name: 'Kabir Gill', num: 99, role: 'Bowler', bowl: 'Right Arm Spin', cls: allowedClasses[0] },
      { name: 'Reyansh Joshi', num: 10, role: 'Wicket Keeper', bat: 'Left Hand', cls: allowedClasses[0] },
      { name: 'Samar Verma', num: 45, role: 'Bowler', bowl: 'Left Arm Spin', cls: allowedClasses[1] || allowedClasses[0] },
      { name: 'Ishaan Kulkarni', num: 24, role: 'All Rounder', bat: 'Right Hand', bowl: 'Right Arm Fast', cls: allowedClasses[2] || allowedClasses[0] },
      { name: 'Tanmay Singhal', num: 11, role: 'Batsman', bat: 'Right Hand', cls: allowedClasses[0] },
      { name: 'Pranav Nair', num: 8, role: 'Bowler', bowl: 'Right Arm Spin', cls: allowedClasses[0] }
    ];

    const filled: PlayerDetails[] = sampleRoster.map((s, idx) => ({
      id: `p-${idx + 1}`,
      playerName: s.name,
      studentClass: s.cls,
      dateOfBirth: `${defaultYear}-${String(idx + 3).padStart(2, '0')}-15`,
      parentMobile: `+91 98110 ${20000 + idx * 311}`,
      parentEmail: `parent.${s.name.split(' ')[0].toLowerCase()}@example.com`,
      playerPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      jerseyNumber: s.num,
      jerseySize: '32',
      cricketRole: s.role,
      battingStyle: s.bat,
      bowlingStyle: s.bowl
    }));

    setPlayers(filled);
  };

  // Check duplicate jersey numbers
  const jerseyNumberCounts: Record<number, number> = {};
  players.forEach(p => {
    if (p.jerseyNumber) {
      jerseyNumberCounts[p.jerseyNumber] = (jerseyNumberCounts[p.jerseyNumber] || 0) + 1;
    }
  });

  const activePlayer = players[activePlayerIndex] || players[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Autofill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A2C68]">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Users className="w-5 h-5 text-[#FFB800]" />
            Team Squad Roster (EXACTLY 8 PLAYERS)
          </h3>
          <p className="text-xs text-slate-400">
            Every team must register exactly 8 players. In Box Cricket, all 8 players play with no substitutes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutofillCompliantSquad}
          className="px-3.5 py-2 rounded-xl bg-[#091230] hover:bg-[#0E1B48] border border-[#1A2C68] text-xs font-semibold text-[#FFB800] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
          <span>Quick Pre-Fill Sample Squad</span>
        </button>
      </div>

      {errors.players && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errors.players}</span>
        </div>
      )}

      {/* 8-Player Tab Selector Navigation */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {players.map((p, idx) => {
          const isSelected = activePlayerIndex === idx;
          const isComplete =
            p.playerName?.trim() &&
            p.studentClass &&
            p.dateOfBirth?.trim() &&
            p.parentMobile?.trim() &&
            p.parentEmail?.trim() &&
            p.playerPhoto?.trim() &&
            p.jerseyNumber &&
            p.jerseySize &&
            p.cricketRole;

          const hasDuplicateJersey = jerseyNumberCounts[p.jerseyNumber] > 1;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePlayerIndex(idx)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                isSelected
                  ? 'bg-[#0E1B48] border-[#FFB800] ring-2 ring-[#FFB800]/30 text-white'
                  : 'bg-[#070D24] border-[#1A2C68] hover:border-slate-700 text-slate-400'
              } ${hasDuplicateJersey ? 'border-red-500/80' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono-sport text-[#FFB800]">
                  #{idx + 1}
                </span>
                {isComplete && !hasDuplicateJersey && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {hasDuplicateJersey && (
                  <span className="w-2 h-2 rounded-full bg-red-500" title="Duplicate Jersey #" />
                )}
              </div>
              <div className="text-xs font-bold truncate mt-1 text-slate-200">
                {p.playerName?.split(' ')[0] || `Player ${idx + 1}`}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {p.jerseyNumber ? `J#${p.jerseyNumber}` : 'No J#'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Player Form Card */}
      {activePlayer && (
        <div className="bg-[#0A1230] border border-[#1A2C68] rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A2C68] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#FFB800] text-slate-950 font-black flex items-center justify-center font-mono-sport text-xs">
                {activePlayerIndex + 1}
              </span>
              <span className="font-bold text-white uppercase text-sm font-heading">
                Editing Player #{activePlayerIndex + 1} of 8: {activePlayer.playerName || 'New Player'}
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              Division: {category === 'class_4_5_6' ? 'Class 4, 5, 6' : 'Class 7, 8, 9'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Player Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Player Full Name <span className="text-[#FFB800]">*</span>
              </label>
              <input
                type="text"
                value={activePlayer.playerName}
                onChange={e => handlePlayerChange(activePlayerIndex, 'playerName', e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]/50"
              />
            </div>

            {/* School Class */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Enrolled Class <span className="text-[#FFB800]">* (Must be {allowedClasses.join(', ')})</span>
              </label>
              <select
                value={activePlayer.studentClass || allowedClasses[0]}
                onChange={e => handlePlayerChange(activePlayerIndex, 'studentClass', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800] cursor-pointer"
              >
                {allowedClasses.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date of Birth <span className="text-[#FFB800]">*</span>
              </label>
              <input
                type="date"
                value={activePlayer.dateOfBirth}
                onChange={e => handlePlayerChange(activePlayerIndex, 'dateOfBirth', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
              />
            </div>

            {/* Parent Mobile */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent / Guardian Mobile <span className="text-[#FFB800]">*</span>
              </label>
              <input
                type="tel"
                value={activePlayer.parentMobile}
                onChange={e => handlePlayerChange(activePlayerIndex, 'parentMobile', e.target.value)}
                placeholder="+91 98110 00000"
                className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800]"
              />
            </div>

            {/* Parent Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent Email <span className="text-[#FFB800]">*</span>
              </label>
              <input
                type="email"
                value={activePlayer.parentEmail}
                onChange={e => handlePlayerChange(activePlayerIndex, 'parentEmail', e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800]"
              />
            </div>

            {/* Jersey Number */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Jersey Number <span className="text-[#FFB800]">* (1–99)</span>
                </label>
                {jerseyNumberCounts[activePlayer.jerseyNumber] > 1 && (
                  <span className="text-[10px] text-red-400 font-semibold">
                    Duplicate Jersey Number!
                  </span>
                )}
              </div>
              <input
                type="number"
                min="1"
                max="99"
                value={activePlayer.jerseyNumber || ''}
                onChange={e => handlePlayerChange(activePlayerIndex, 'jerseyNumber', parseInt(e.target.value) || 0)}
                placeholder="e.g. 7"
                className={`w-full px-4 py-2.5 bg-[#070D24] border rounded-xl text-sm font-mono text-[#FFB800] font-bold focus:outline-none focus:border-[#FFB800] ${
                  jerseyNumberCounts[activePlayer.jerseyNumber] > 1 ? 'border-red-500 ring-1 ring-red-500' : 'border-[#1A2C68]'
                }`}
              />
            </div>

            {/* Jersey Size */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Jersey Size <span className="text-[#FFB800]">*</span>
              </label>
              <select
                value={activePlayer.jerseySize}
                onChange={e => handlePlayerChange(activePlayerIndex, 'jerseySize', e.target.value as JerseySize)}
                className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800] cursor-pointer"
              >
                {jerseySizes.map(sz => (
                  <option key={sz} value={sz}>{sz} ({parseInt(sz) ? `Chest ${sz}"` : sz})</option>
                ))}
              </select>
            </div>

            {/* Cricket Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Cricket Role <span className="text-[#FFB800]">*</span>
              </label>
              <select
                value={activePlayer.cricketRole}
                onChange={e => handlePlayerChange(activePlayerIndex, 'cricketRole', e.target.value as CricketRole)}
                className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800] cursor-pointer"
              >
                {cricketRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Batting Style */}
            {(activePlayer.cricketRole === 'Batsman' ||
              activePlayer.cricketRole === 'All Rounder' ||
              activePlayer.cricketRole === 'Wicket Keeper') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Batting Style <span className="text-[#FFB800]">*</span>
                </label>
                <select
                  value={activePlayer.battingStyle || 'Right Hand'}
                  onChange={e => handlePlayerChange(activePlayerIndex, 'battingStyle', e.target.value as BattingStyle)}
                  className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800] cursor-pointer"
                >
                  {battingStyles.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Bowling Style */}
            {(activePlayer.cricketRole === 'Bowler' || activePlayer.cricketRole === 'All Rounder') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Bowling Style <span className="text-[#FFB800]">*</span>
                </label>
                <select
                  value={activePlayer.bowlingStyle || 'Right Arm Medium'}
                  onChange={e => handlePlayerChange(activePlayerIndex, 'bowlingStyle', e.target.value as BowlingStyle)}
                  className="w-full px-4 py-2.5 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800] cursor-pointer"
                >
                  {bowlingStyles.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Player Photo Upload using ImageUploadField */}
          <div className="pt-2 border-t border-[#1A2C68]">
            <ImageUploadField
              label={`Player #${activePlayerIndex + 1} Photo`}
              required
              tag="players"
              value={activePlayer.playerPhoto}
              onChange={url => handlePlayerChange(activePlayerIndex, 'playerPhoto', url)}
              aspectRatio="square"
              helperText="Passport style player headshot for official broadcast & match scoring"
            />
          </div>

          {/* Stepper buttons between players */}
          <div className="flex items-center justify-between pt-3 border-t border-[#1A2C68] text-xs">
            <button
              type="button"
              disabled={activePlayerIndex === 0}
              onClick={() => setActivePlayerIndex(prev => Math.max(0, prev - 1))}
              className="px-3.5 py-2 rounded-lg bg-[#070D24] border border-[#1A2C68] text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              ← Previous Player
            </button>
            <span className="text-slate-400 font-mono">
              Player {activePlayerIndex + 1} of 8
            </span>
            <button
              type="button"
              disabled={activePlayerIndex === 7}
              onClick={() => setActivePlayerIndex(prev => Math.min(7, prev + 1))}
              className="px-3.5 py-2 rounded-lg bg-[#070D24] border border-[#1A2C68] text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Next Player →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
