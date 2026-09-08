import React, { useRef, useState } from 'react';
import { PlayerDetails, CategoryId, CricketRole, BattingStyle, BowlingStyle, JerseySize } from '../../types';
import { Users, AlertCircle, Sparkles, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';

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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedClasses = category === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];

  const handlePlayerChange = (index: number, field: keyof PlayerDetails, value: any) => {
    setPlayers(prev => {
      const updated = [...prev];
      const player = { ...updated[index], [field]: value };

      // Clear bowling style if changing role away from Bowler / All Rounder
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

  const handlePhotoUploadForActive = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          tag: 'player_photo'
        })
      });
      const data = await res.json();
      if (data.secure_url) {
        handlePlayerChange(activePlayerIndex, 'playerPhoto', data.secure_url);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Helper to prefill 8 compliant players for instant demonstration
  const handleAutofillCompliantSquad = () => {
    const defaultClass = allowedClasses[1] || allowedClasses[0];
    const defaultYear = category === 'class_4_5_6' ? 2015 : 2013;

    const sampleRoster: Array<{ name: string; num: number; role: CricketRole; bat?: BattingStyle; bowl?: BowlingStyle; cls: number }> = [
      { name: 'Aarav Sharma', num: 7, role: 'All Rounder', bat: 'Right Hand', bowl: 'Right Arm Medium', cls: allowedClasses[1] },
      { name: 'Devansh Mehta', num: 18, role: 'Batsman', bat: 'Right Hand', cls: allowedClasses[1] },
      { name: 'Kabir Gill', num: 99, role: 'Bowler', bowl: 'Right Arm Spin', cls: allowedClasses[0] },
      { name: 'Reyansh Joshi', num: 10, role: 'Wicket Keeper', bat: 'Left Hand', cls: allowedClasses[0] },
      { name: 'Samar Verma', num: 45, role: 'Bowler', bowl: 'Left Arm Spin', cls: allowedClasses[1] },
      { name: 'Ishaan Kulkarni', num: 24, role: 'All Rounder', bat: 'Right Hand', bowl: 'Right Arm Fast', cls: allowedClasses[2] || allowedClasses[1] },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Users className="w-5 h-5 text-amber-400" />
            Team Roster (EXACTLY 8 PLAYERS)
          </h3>
          <p className="text-xs text-slate-400">
            Every registration must contain exactly 8 players. There are no substitutes in this tournament.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutofillCompliantSquad}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
              className={`p-2.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-slate-800 border-amber-500 ring-2 ring-amber-500/30 text-white'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
              } ${hasDuplicateJersey ? 'border-red-500/80' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono-sport text-amber-400">
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

      {/* Active Player Edit Form Card */}
      {activePlayer && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center font-mono-sport text-xs">
                {activePlayerIndex + 1}
              </span>
              <span className="font-bold text-white uppercase text-sm font-heading">
                Editing Player #{activePlayerIndex + 1} of 8: {activePlayer.playerName || 'New Player'}
              </span>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              Class Category: {category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Player Name * */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Player Name *
              </label>
              <input
                type="text"
                value={activePlayer.playerName}
                onChange={e => handlePlayerChange(activePlayerIndex, 'playerName', e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* School Class * */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                School Class * (Must be {allowedClasses.join(', ')})
              </label>
              <select
                value={activePlayer.studentClass || allowedClasses[0]}
                onChange={e => handlePlayerChange(activePlayerIndex, 'studentClass', parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {allowedClasses.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Date of Birth * */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date of Birth *
              </label>
              <input
                type="date"
                value={activePlayer.dateOfBirth}
                onChange={e => handlePlayerChange(activePlayerIndex, 'dateOfBirth', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Parent Mobile * */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent Mobile *
              </label>
              <input
                type="tel"
                value={activePlayer.parentMobile}
                onChange={e => handlePlayerChange(activePlayerIndex, 'parentMobile', e.target.value)}
                placeholder="+91 98110 00000"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Parent Email * */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent Email *
              </label>
              <input
                type="email"
                value={activePlayer.parentEmail}
                onChange={e => handlePlayerChange(activePlayerIndex, 'parentEmail', e.target.value)}
                placeholder="parent@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Jersey Number * (Unique) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Jersey Number * (1–99)
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
                className={`w-full px-3.5 py-2.5 bg-slate-900 border rounded-xl text-sm font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500 ${
                  jerseyNumberCounts[activePlayer.jerseyNumber] > 1 ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
                }`}
              />
            </div>

            {/* Jersey Size * */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Jersey Size *
              </label>
              <select
                value={activePlayer.jerseySize}
                onChange={e => handlePlayerChange(activePlayerIndex, 'jerseySize', e.target.value as JerseySize)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {jerseySizes.map(sz => (
                  <option key={sz} value={sz}>{sz} ({parseInt(sz) ? `Chest ${sz}"` : sz})</option>
                ))}
              </select>
            </div>

            {/* Cricket Role * */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Cricket Role *
              </label>
              <select
                value={activePlayer.cricketRole}
                onChange={e => handlePlayerChange(activePlayerIndex, 'cricketRole', e.target.value as CricketRole)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {cricketRoles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Batting Style (Required for Batsman, All Rounder, Wicket Keeper) */}
            {(activePlayer.cricketRole === 'Batsman' ||
              activePlayer.cricketRole === 'All Rounder' ||
              activePlayer.cricketRole === 'Wicket Keeper') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Batting Style *
                </label>
                <select
                  value={activePlayer.battingStyle || 'Right Hand'}
                  onChange={e => handlePlayerChange(activePlayerIndex, 'battingStyle', e.target.value as BattingStyle)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {battingStyles.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Bowling Style (Required for Bowler, All Rounder) */}
            {(activePlayer.cricketRole === 'Bowler' || activePlayer.cricketRole === 'All Rounder') && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Bowling Style *
                </label>
                <select
                  value={activePlayer.bowlingStyle || 'Right Arm Medium'}
                  onChange={e => handlePlayerChange(activePlayerIndex, 'bowlingStyle', e.target.value as BowlingStyle)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {bowlingStyles.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Player Photo * */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Player Photo * (Passport Style / Headshot)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {activePlayer.playerPhoto ? (
                <div className="w-14 h-14 rounded-xl border border-slate-700 bg-slate-950 p-0.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={activePlayer.playerPhoto}
                    alt={activePlayer.playerName || 'Player'}
                    className="w-full h-full object-cover rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/50 flex-shrink-0 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUploadForActive}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isUploadingPhoto ? 'Uploading to Cloudinary...' : 'Upload Player Photo'}</span>
                  </button>
                  <span className="text-[11px] text-slate-500">Used for official Team Pass & match graphics.</span>
                </div>
                <input
                  type="url"
                  value={activePlayer.playerPhoto}
                  onChange={e => handlePlayerChange(activePlayerIndex, 'playerPhoto', e.target.value)}
                  placeholder="Or paste direct image URL..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Stepper buttons between players */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
            <button
              type="button"
              disabled={activePlayerIndex === 0}
              onClick={() => setActivePlayerIndex(prev => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              ← Previous Player
            </button>
            <span className="text-slate-400">
              Player {activePlayerIndex + 1} of 8
            </span>
            <button
              type="button"
              disabled={activePlayerIndex === 7}
              onClick={() => setActivePlayerIndex(prev => Math.min(7, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              Next Player →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
