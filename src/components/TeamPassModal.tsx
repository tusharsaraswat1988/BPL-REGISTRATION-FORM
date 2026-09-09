import React from 'react';
import { RegistrationRecord } from '../types';
import { QrCode, CheckCircle2, Printer, X, Shield, Trophy } from 'lucide-react';

interface TeamPassModalProps {
  registration: RegistrationRecord;
  onClose: () => void;
}

export const TeamPassModal: React.FC<TeamPassModalProps> = ({ registration, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const categoryLabel = registration.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Control Bar (Non-printable) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-sport">
              Official Team Pass • Season 1
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Pass Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header Badge */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-2xl opacity-20 pointer-events-none"
              style={{ backgroundColor: registration.branding.primaryColor || '#f59e0b' }}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg font-mono-sport tracking-wider text-white shadow-lg flex-shrink-0"
                  style={{
                    backgroundColor: registration.branding.primaryColor || '#0284c7',
                    border: `2px solid ${registration.branding.secondaryColor || '#f59e0b'}`
                  }}
                >
                  BPL
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest font-mono-sport">
                    BIDWAR PREMIER LEAGUE — KIDS S1
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading uppercase">
                    {registration.branding.teamName}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {registration.association.associationName} • {registration.association.branch}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Team Code</div>
                <div className="text-xl font-black text-amber-400 font-mono-sport tracking-widest">
                  {registration.teamCode}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  ID: {registration.id}
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Logistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Category</span>
              <strong className="text-white font-mono-sport text-sm uppercase">{categoryLabel}</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Tournament Dates</span>
              <strong className="text-white">3rd & 4th Oct 2026</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fee Paid</span>
              <strong className="text-amber-400 font-mono-sport">₹{registration.payment.totalAmount.toLocaleString('en-IN')}</strong>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" />
                {registration.status}
              </span>
            </div>
          </div>

          {/* Mentor & Squad Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Mentor In-Charge</span>
              <p className="text-sm font-bold text-white">{registration.mentor.name}</p>
              <p className="text-slate-400">{registration.mentor.designation || 'Head Cricket Coach'}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">Branding Package</span>
              <p className="text-sm font-bold text-white">
                {registration.branding.includeBranding ? 'Full Branding Package' : 'Standard Entry'}
              </p>
              <p className="text-slate-400 mt-1">
                {registration.branding.includeBranding
                  ? 'Includes custom jerseys with school logo & broadcast lower-thirds.'
                  : 'Standard match kit & digital scorecards.'}
              </p>
            </div>
          </div>

          {/* 8-Player Roster Table */}
          <div>
            <span className="text-slate-400 block text-[11px] uppercase font-semibold mb-2">Official 8-Player Roster</span>
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden text-xs">
              <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 text-[11px]">
                <div className="col-span-1 text-center font-mono">#</div>
                <div className="col-span-5">Player Name</div>
                <div className="col-span-2">Class</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2 text-right">Size</div>
              </div>
              <div className="divide-y divide-slate-900 max-h-48 overflow-y-auto">
                {registration.players.map((p, idx) => (
                  <div key={p.id || idx} className="grid grid-cols-12 gap-2 px-3 py-2 items-center hover:bg-slate-900/40">
                    <div className="col-span-1 text-center font-mono font-bold text-amber-400">
                      {p.jerseyNumber}
                    </div>
                    <div className="col-span-5 font-medium text-white truncate">
                      {p.playerName}
                    </div>
                    <div className="col-span-2 text-slate-300 font-mono">
                      Class {p.studentClass}
                    </div>
                    <div className="col-span-2 text-slate-400 text-[11px] truncate">
                      {p.cricketRole}
                    </div>
                    <div className="col-span-2 text-right font-mono text-slate-300 text-[11px]">
                      {p.jerseySize}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Footer & QR Code */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <div className="text-slate-400 space-y-1">
              <p className="font-semibold text-white">Organised by Bidwar.in & KV TechMedia</p>
              <p className="text-[11px]">Box Cricket Rules Apply • Present digital pass at match check-in.</p>
              <p className="text-[10px] text-amber-400 font-mono">Tournament Dates: 3rd & 4th October 2026</p>
            </div>
            <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
              <QrCode className="w-14 h-14 text-slate-950" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
