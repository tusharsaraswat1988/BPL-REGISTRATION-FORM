import React, { useState } from 'react';
import {
  X, Phone, Mail, MapPin, Calendar, Building, User, Users,
  Trophy, DollarSign, Shield, ShieldCheck, CheckCircle2,
  Clock, AlertCircle, Copy, Check, MessageCircle, ExternalLink,
  Trash2, Sparkles, Image as ImageIcon, ChevronRight
} from 'lucide-react';
import { UnfinishedRegistrationItem } from '../../server/db/drafts';

interface AdminUnfinishedModalProps {
  draft: UnfinishedRegistrationItem;
  apiKey: string;
  onClose: () => void;
  onDeleteSuccess: (draftToken: string) => void;
}

const STEPS_SUMMARY = [
  { step: 0, title: 'Category & School', short: 'School' },
  { step: 1, title: 'Mentor In-Charge', short: 'Mentor' },
  { step: 2, title: 'Team Identity & Tier', short: 'Branding' },
  { step: 3, title: '8-Player Squad', short: 'Squad' },
  { step: 4, title: 'Review & Payment', short: 'Payment' },
];

export const AdminUnfinishedModal: React.FC<AdminUnfinishedModalProps> = ({
  draft,
  apiKey,
  onClose,
  onDeleteSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'association' | 'mentor' | 'branding' | 'players' | 'payment'>('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/unfinished-registrations/${encodeURIComponent(draft.draftToken)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': apiKey,
        },
      });

      if (res.ok) {
        onDeleteSuccess(draft.draftToken);
      } else {
        const err = await res.json().catch(() => ({}));
        setDeleteError(err.message || 'Failed to delete unfinished draft.');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Network error deleting draft.');
    } finally {
      setIsDeleting(false);
    }
  };

  const primaryMobile = draft.authUserMobile || draft.contactMobile || draft.association.mobile || draft.mentor.mobile || '';
  const cleanPhoneDigits = primaryMobile.replace(/\D/g, '');
  const waNumber = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits;

  const currentStepNum = typeof draft.currentStep === 'number' ? draft.currentStep : 0;
  const progressPercent = Math.min(100, Math.round(((currentStepNum + 1) / 5) * 100));

  const assoc = draft.association;
  const mentor = draft.mentor;
  const players = Array.isArray(draft.players) ? draft.players : [];
  const payment = draft.payment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#091230] border border-[#1A2C68] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-[#070D24] border-b border-[#1A2C68] p-4 sm:p-5 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Unfinished Registration Draft
              </span>

              {draft.authUserMobile && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  OTP Verified: {draft.authUserMobile}
                </span>
              )}

              {draft.category && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {draft.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-wide">
              {draft.teamName || assoc.associationName || '(Untitled In-Progress Team)'}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-500">
                Token: <strong className="text-slate-300">{draft.draftToken}</strong>
              </span>
              <span>•</span>
              <span>Last Active: <strong className="text-amber-300">{new Date(draft.updatedAt).toLocaleString('en-IN')}</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Contact Strip */}
        <div className="bg-[#050B1E] border-b border-[#1A2C68] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            {primaryMobile && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono font-semibold">{primaryMobile}</span>
                <button
                  onClick={() => copyToClipboard(primaryMobile, 'Phone')}
                  className="text-slate-500 hover:text-amber-400 p-0.5"
                  title="Copy Phone"
                >
                  {copiedField === 'Phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}

            {draft.contactEmail && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{draft.contactEmail}</span>
                <button
                  onClick={() => copyToClipboard(draft.contactEmail, 'Email')}
                  className="text-slate-500 hover:text-amber-400 p-0.5"
                  title="Copy Email"
                >
                  {copiedField === 'Email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {primaryMobile && (
              <>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, this is from the BidWar Premier League (BPL Kids) Organizing Committee regarding your team registration for ${draft.teamName || assoc.associationName || 'the tournament'}. Let us know if you need any assistance completing your squad entry!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Team</span>
                </a>

                <a
                  href={`tel:${primaryMobile}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Contact</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-[#070D24] px-4 py-3 border-b border-[#1A2C68]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">
              Registration Progress: <strong className="text-amber-300">{draft.stepName}</strong>
            </span>
            <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
          </div>

          {/* Stepper Dots & Line */}
          <div className="relative pt-1 pb-1">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-5 gap-1 mt-2">
              {STEPS_SUMMARY.map((s) => {
                const isPassed = currentStepNum > s.step;
                const isCurrent = currentStepNum === s.step;
                return (
                  <div
                    key={s.step}
                    className={`text-center py-1 px-1 rounded-lg text-[10px] font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : isPassed
                        ? 'text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {isPassed ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                      )}
                      <span className="truncate">{s.short}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1A2C68] bg-[#070D24] px-4 overflow-x-auto text-xs">
          {[
            { id: 'overview', label: 'Summary' },
            { id: 'association', label: '1. School / Assoc' },
            { id: 'mentor', label: '2. Mentor' },
            { id: 'branding', label: '3. Identity & Tier' },
            { id: 'players', label: `4. Squad (${draft.playersFilledCount}/8)` },
            { id: 'payment', label: '5. Payment Draft' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3.5 font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#FFB800] text-[#FFB800] bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-200">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Team & Category Info Card */}
                <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                    <Trophy className="w-4 h-4" />
                    <span>Team Identity</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Team Name</span>
                      <span className="text-white font-bold text-sm">
                        {draft.teamName || <span className="text-slate-500 italic">Not entered yet</span>}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Division / Category</span>
                      <span className="text-white font-semibold">
                        {draft.category === 'class_4_5_6' ? 'Class 4–5–6 Division' : draft.category === 'class_7_8_9' ? 'Class 7–8–9 Division' : <span className="text-slate-500 italic">Not selected</span>}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Tagline</span>
                      <span className="text-slate-300">
                        {draft.teamTagline || <span className="text-slate-500 italic">None</span>}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Branded Jersey Package</span>
                      <span className={draft.includeBranding ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                        {draft.includeBranding ? 'Yes (Branded Jersey Tier)' : 'Standard Entry Fee Only'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Association Info Card */}
                <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                      <Building className="w-4 h-4" />
                      <span>School / Academy</span>
                    </div>
                    {assoc.associationLogo && (
                      <img
                        src={assoc.associationLogo}
                        alt="Logo"
                        className="w-8 h-8 rounded object-contain bg-slate-900 border border-slate-700"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Institution Name</span>
                      <span className="text-white font-bold">
                        {assoc.associationName || <span className="text-slate-500 italic">Not entered yet</span>}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Branch / Campus</span>
                      <span className="text-slate-300">
                        {assoc.branch || <span className="text-slate-500 italic">—</span>}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">City</span>
                      <span className="text-slate-300">
                        {assoc.city || <span className="text-slate-500 italic">—</span>}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Email & Mobile</span>
                      <span className="text-slate-300">
                        {assoc.email ? `${assoc.email} ` : ''}
                        {assoc.mobile ? `(${assoc.mobile})` : ''}
                        {!assoc.email && !assoc.mobile && <span className="text-slate-500 italic">None entered</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mentor Info Card */}
                <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                      <User className="w-4 h-4" />
                      <span>Mentor In-Charge</span>
                    </div>
                    {mentor.photo && (
                      <img
                        src={mentor.photo}
                        alt="Mentor"
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Name & Designation</span>
                      <span className="text-white font-bold">
                        {mentor.name || <span className="text-slate-500 italic">Not entered</span>}
                        {mentor.designation ? ` (${mentor.designation})` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Mobile Numbers</span>
                      <span className="text-slate-300 font-mono">
                        {mentor.mobile || <span className="text-slate-500 italic">None</span>}
                        {mentor.secondMobile ? ` / ${mentor.secondMobile}` : ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Email</span>
                      <span className="text-slate-300">
                        {mentor.email || <span className="text-slate-500 italic">—</span>}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Squad & Payment Card */}
                <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                    <Users className="w-4 h-4" />
                    <span>Squad & Payment Status</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Players Entered</span>
                      <span className="text-white font-bold">
                        {draft.playersFilledCount} of 8 players entered
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">Payment Method Drafted</span>
                      <span className="text-slate-300">
                        {payment.method || 'UPI'} ({payment.gateway || 'MANUAL'})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] block">UTR / Transaction ID</span>
                      <span className="text-slate-300 font-mono">
                        {payment.transactionReference || payment.utrTransactionId || <span className="text-slate-500 italic">None entered</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHOOL / ASSOCIATION */}
          {activeTab === 'association' && (
            <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-400" />
                <span>Association / School / Academy Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Institution Name</span>
                  <span className="text-white font-bold text-sm">{assoc.associationName || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Branch / Campus</span>
                  <span className="text-slate-200">{assoc.branch || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">City</span>
                  <span className="text-slate-200">{assoc.city || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Institution Type</span>
                  <span className="text-slate-200">{assoc.associationType || 'School'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Official Email</span>
                  <span className="text-slate-200">{assoc.email || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Official Mobile</span>
                  <span className="text-slate-200 font-mono">{assoc.mobile || '—'}</span>
                </div>
              </div>

              {assoc.associationLogo && (
                <div className="pt-3 border-t border-white/5">
                  <span className="text-slate-500 text-[10px] block mb-2">School Logo</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={assoc.associationLogo}
                      alt="Logo"
                      className="w-16 h-16 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1"
                    />
                    <a
                      href={assoc.associationLogo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Full Image</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MENTOR */}
          {activeTab === 'mentor' && (
            <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Mentor In-Charge Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Mentor Name</span>
                  <span className="text-white font-bold text-sm">{mentor.name || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Designation</span>
                  <span className="text-slate-200">{mentor.designation || 'Head Cricket Coach'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Primary Mobile</span>
                  <span className="text-slate-200 font-mono">{mentor.mobile || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Alternative Mobile</span>
                  <span className="text-slate-200 font-mono">{mentor.secondMobile || '—'}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[10px] block">Email</span>
                  <span className="text-slate-200">{mentor.email || '—'}</span>
                </div>
              </div>

              {mentor.photo && (
                <div className="pt-3 border-t border-white/5">
                  <span className="text-slate-500 text-[10px] block mb-2">Mentor Photo</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={mentor.photo}
                      alt="Mentor"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-slate-700"
                    />
                    <a
                      href={mentor.photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Full Photo</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: IDENTITY & BRANDING */}
          {activeTab === 'branding' && (
            <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Team Identity & Tier</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Team Name</span>
                  <span className="text-white font-bold text-sm">{draft.teamName || '—'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Division</span>
                  <span className="text-slate-200">
                    {draft.category === 'class_4_5_6' ? 'Class 4–5–6' : draft.category === 'class_7_8_9' ? 'Class 7–8–9' : '—'}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[10px] block">Tagline / Motto</span>
                  <span className="text-slate-200">{draft.teamTagline || '—'}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[10px] block">Custom Jersey Branding Package</span>
                  <span className={draft.includeBranding ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                    {draft.includeBranding ? 'YES (Includes Custom Colorways & Logo Integration)' : 'NO (Standard Tournament Entry Only)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PLAYERS SQUAD */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>8-Player Squad Roster ({draft.playersFilledCount}/8 entered)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const p = players[idx] || {};
                  const isFilled = Boolean(p.playerName && p.playerName.trim());

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-colors ${
                        isFilled
                          ? 'bg-[#050B1E] border-[#1A2C68]'
                          : 'bg-[#050B1E]/40 border-dashed border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            #{idx + 1}
                          </span>
                          <div>
                            <span className="font-bold text-white text-xs block">
                              {p.playerName || <span className="text-slate-500 italic">Slot #{idx + 1} empty</span>}
                            </span>
                            {isFilled && (
                              <span className="text-[10px] text-amber-400">
                                Class {p.studentClass || '—'} · {p.cricketRole || 'Player'}
                              </span>
                            )}
                          </div>
                        </div>

                        {p.playerPhoto && (
                          <img
                            src={p.playerPhoto}
                            alt={p.playerName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                        )}
                      </div>

                      {isFilled && (
                        <div className="mt-2.5 pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                          <div>
                            <span className="text-slate-600 block">DOB:</span>
                            <span className="text-slate-300">{p.dateOfBirth || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-600 block">Jersey:</span>
                            <span className="text-slate-300 font-mono">#{p.jerseyNumber || '—'} ({p.jerseySize || '—'})</span>
                          </div>
                          {p.parentMobile && (
                            <div className="col-span-2">
                              <span className="text-slate-600 block">Parent Phone:</span>
                              <span className="text-slate-300 font-mono">{p.parentMobile}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENT DRAFT */}
          {activeTab === 'payment' && (
            <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Review & Payment Info Entered</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Payment Method</span>
                  <span className="text-white font-semibold">{payment.method || 'UPI'}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Gateway Mode</span>
                  <span className="text-slate-200">{payment.gateway || 'MANUAL'}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[10px] block">UTR / Transaction Reference</span>
                  <span className="text-amber-400 font-mono font-bold text-sm">
                    {payment.transactionReference || payment.utrTransactionId || <span className="text-slate-500 italic text-xs font-normal">Not entered</span>}
                  </span>
                </div>
              </div>

              {(payment.paymentProofUrl || payment.paymentScreenshot) && (
                <div className="pt-3 border-t border-white/5">
                  <span className="text-slate-500 text-[10px] block mb-2">Payment Proof Screenshot</span>
                  <div className="flex items-center gap-3">
                    <img
                      src={payment.paymentProofUrl || payment.paymentScreenshot}
                      alt="Payment Proof"
                      className="w-24 h-24 rounded-xl object-contain bg-slate-900 border border-slate-700 p-1"
                    />
                    <a
                      href={payment.paymentProofUrl || payment.paymentScreenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Full Screenshot</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {deleteError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-[#070D24] border-t border-[#1A2C68] p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Draft</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-300 font-semibold">Confirm delete?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
