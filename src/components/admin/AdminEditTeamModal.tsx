import React, { useState } from 'react';
import {
  X, Save, Loader2, AlertCircle, CheckCircle2,
  Users, Trophy, Building, User, DollarSign,
  Shield, Check, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { RegistrationFullRecord, PlayerInput } from '../../server/db/registrations';
import { DateChooserField } from '../DateChooserField';
import { ImageUploadField } from '../ImageUploadField';
import { CricketRole, BattingStyle, BowlingStyle, JerseySize } from '../../types';
import { isValidIndianMobile, isValidEmail, validatePlayerDob } from '../../utils/validation';

interface AdminEditTeamModalProps {
  registration: RegistrationFullRecord;
  apiKey: string;
  onClose: () => void;
  onSaveSuccess: (updated: RegistrationFullRecord) => void;
}

type TabType = 'team' | 'association' | 'mentor' | 'players' | 'payment';

const CRICKET_ROLES: CricketRole[] = ['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'];
const BATTING_STYLES: BattingStyle[] = ['Right Hand', 'Left Hand'];
const BOWLING_STYLES: BowlingStyle[] = [
  'Right Arm Fast',
  'Right Arm Medium',
  'Right Arm Spin',
  'Left Arm Fast',
  'Left Arm Medium',
  'Left Arm Spin'
];
const JERSEY_SIZES: JerseySize[] = ['28', '30', '32', '34', '36', '38', '40', 'S', 'M', 'L'];

export const AdminEditTeamModal: React.FC<AdminEditTeamModalProps> = ({
  registration,
  apiKey,
  onClose,
  onSaveSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('team');
  const [activePlayerIdx, setActivePlayerIdx] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State initialized from registration
  const [category, setCategory] = useState<'class_4_5_6' | 'class_7_8_9'>(
    (registration.category as 'class_4_5_6' | 'class_7_8_9') || 'class_4_5_6'
  );
  const [teamName, setTeamName] = useState(registration.teamName || '');
  const [teamTagline, setTeamTagline] = useState(registration.branding?.teamTagline || '');
  const [teamShortCode, setTeamShortCode] = useState(registration.branding?.teamShortCode || 'BPL');
  const [includeBranding, setIncludeBranding] = useState<boolean>(Boolean(registration.includeBranding));
  const [status, setStatus] = useState<string>(registration.status || 'SUBMITTED');
  const [notes, setNotes] = useState<string>(registration.notes || '');

  // Association State
  const [association, setAssociation] = useState({
    associationName: registration.association.associationName || '',
    branch: registration.association.branch || '',
    city: registration.association.city || '',
    email: registration.association.email || '',
    mobile: registration.association.mobile || '',
    associationType: registration.association.associationType || 'School',
    associationLogo: registration.association.associationLogo || '',
  });

  // Mentor State
  const [mentor, setMentor] = useState({
    name: registration.mentor.name || '',
    designation: registration.mentor.designation || 'Head Coach',
    mobile: registration.mentor.mobile || '',
    secondMobile: registration.mentor.secondMobile || '',
    email: registration.mentor.email || '',
    photo: registration.mentor.photo || '',
  });

  // Players State (Guaranteed 8 players)
  const [players, setPlayers] = useState<PlayerInput[]>(() => {
    const existing = registration.players || [];
    const fullList: PlayerInput[] = [];
    const allowedClasses = category === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];

    for (let i = 0; i < 8; i++) {
      const p = existing[i];
      if (p) {
        fullList.push({
          playerName: p.playerName || `Player ${i + 1}`,
          studentClass: p.studentClass || allowedClasses[0],
          dateOfBirth: p.dateOfBirth || (category === 'class_4_5_6' ? '2015-05-15' : '2012-05-15'),
          parentMobile: p.parentMobile || '',
          parentEmail: p.parentEmail || '',
          playerPhoto: p.playerPhoto || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
          jerseyNumber: p.jerseyNumber,
          jerseySize: p.jerseySize || '32',
          cricketRole: p.cricketRole || 'All Rounder',
          battingStyle: p.battingStyle || 'Right Hand',
          bowlingStyle: p.bowlingStyle || 'Right Arm Medium',
        });
      } else {
        fullList.push({
          playerName: `Player ${i + 1}`,
          studentClass: allowedClasses[0],
          dateOfBirth: category === 'class_4_5_6' ? '2015-05-15' : '2012-05-15',
          parentMobile: '',
          parentEmail: '',
          playerPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
          jerseyNumber: undefined,
          jerseySize: '32',
          cricketRole: 'All Rounder',
          battingStyle: 'Right Hand',
          bowlingStyle: 'Right Arm Medium',
        });
      }
    }
    return fullList;
  });

  // Payment State
  const [payment, setPayment] = useState({
    method: registration.payment.method || 'UPI',
    gateway: registration.payment.gateway || 'MANUAL',
    utrTransactionId: registration.payment.utrTransactionId || '',
    paymentScreenshot: registration.payment.paymentScreenshot || '',
    baseAmount: registration.payment.baseAmount ?? 8000,
    brandingAmount: registration.payment.brandingAmount ?? (includeBranding ? 5000 : 0),
    totalAmount: registration.payment.totalAmount ?? (8000 + (includeBranding ? 5000 : 0)),
    paymentStatus: registration.payment.paymentStatus || 'PENDING_VERIFICATION',
    verifiedBy: registration.payment.verifiedBy || '',
    paidAt: registration.payment.paidAt ? registration.payment.paidAt.split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const allowedClasses = category === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];

  // Adjust player classes when category changes
  const handleCategoryChange = (newCat: 'class_4_5_6' | 'class_7_8_9') => {
    setCategory(newCat);
    const valid = newCat === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];
    setPlayers(prev =>
      prev.map(p => ({
        ...p,
        studentClass: valid.includes(Number(p.studentClass)) ? Number(p.studentClass) : valid[0],
      }))
    );
  };

  const handlePlayerChange = (idx: number, field: keyof PlayerInput, val: any) => {
    setPlayers(prev => {
      const copy = [...prev];
      const p = { ...copy[idx], [field]: val };

      // Role style syncing
      if (field === 'cricketRole') {
        if (val === 'Batsman') {
          p.battingStyle = p.battingStyle || 'Right Hand';
          p.bowlingStyle = undefined;
        } else if (val === 'Bowler') {
          p.bowlingStyle = p.bowlingStyle || 'Right Arm Medium';
          p.battingStyle = undefined;
        } else if (val === 'All Rounder') {
          p.battingStyle = p.battingStyle || 'Right Hand';
          p.bowlingStyle = p.bowlingStyle || 'Right Arm Medium';
        } else if (val === 'Wicket Keeper') {
          p.battingStyle = p.battingStyle || 'Right Hand';
          p.bowlingStyle = undefined;
        }
      }

      copy[idx] = p;
      return copy;
    });
  };

  const handleSave = async () => {
    setErrorMsg(null);

    // Basic Validation
    if (!teamName.trim()) {
      setErrorMsg('Team Name is required.');
      setActiveTab('team');
      return;
    }
    if (!association.associationName.trim()) {
      setErrorMsg('Association / School Name is required.');
      setActiveTab('association');
      return;
    }
    if (!association.mobile.trim() || !isValidIndianMobile(association.mobile)) {
      setErrorMsg('Valid Association Mobile is required.');
      setActiveTab('association');
      return;
    }
    if (!mentor.name.trim()) {
      setErrorMsg('Mentor Name is required.');
      setActiveTab('mentor');
      return;
    }
    if (!mentor.mobile.trim() || !isValidIndianMobile(mentor.mobile)) {
      setErrorMsg('Valid Mentor Mobile is required.');
      setActiveTab('mentor');
      return;
    }

    // Players DOB & Name validation
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (!p.playerName?.trim()) {
        setErrorMsg(`Player #${i + 1} Name is required.`);
        setActiveTab('players');
        setActivePlayerIdx(i);
        return;
      }
      const dobCheck = validatePlayerDob(p.dateOfBirth, Number(p.studentClass));
      if (!dobCheck.valid) {
        setErrorMsg(`Player #${i + 1} (${p.playerName}): ${dobCheck.error}`);
        setActiveTab('players');
        setActivePlayerIdx(i);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        category,
        teamName: teamName.trim(),
        includeBranding,
        teamTagline: teamTagline.trim() || null,
        teamShortCode: teamShortCode.trim() || 'BPL',
        status,
        notes: notes.trim() || null,
        association: {
          associationName: association.associationName.trim(),
          branch: association.branch.trim(),
          city: association.city.trim() || null,
          email: association.email.trim(),
          mobile: association.mobile.trim(),
          associationType: association.associationType || 'School',
          associationLogo: association.associationLogo.trim(),
        },
        mentor: {
          name: mentor.name.trim(),
          designation: mentor.designation.trim() || 'Head Coach',
          mobile: mentor.mobile.trim(),
          secondMobile: mentor.secondMobile.trim() || null,
          email: mentor.email.trim() || null,
          photo: mentor.photo.trim() || null,
        },
        players: players.map((p, idx) => ({
          playerName: p.playerName.trim(),
          studentClass: Number(p.studentClass),
          dateOfBirth: p.dateOfBirth.trim(),
          parentMobile: p.parentMobile?.trim() || null,
          parentEmail: p.parentEmail?.trim() || null,
          playerPhoto: p.playerPhoto.trim(),
          jerseyNumber: p.jerseyNumber ? Number(p.jerseyNumber) : undefined,
          jerseySize: p.jerseySize?.trim() || '32',
          cricketRole: p.cricketRole,
          battingStyle: p.battingStyle || undefined,
          bowlingStyle: p.bowlingStyle || undefined,
        })),
        payment: {
          method: payment.method,
          gateway: payment.gateway,
          utrTransactionId: payment.utrTransactionId.trim(),
          paymentScreenshot: payment.paymentScreenshot.trim() || 'CASHFREE_GATEWAY_VERIFIED',
          baseAmount: Number(payment.baseAmount) || 8000,
          brandingAmount: Number(payment.brandingAmount) || 0,
          totalAmount: Number(payment.totalAmount) || 8000,
          paymentStatus: payment.paymentStatus,
          verifiedBy: payment.verifiedBy.trim() || (payment.paymentStatus === 'VERIFIED' ? 'Admin' : null),
          paidAt: payment.paidAt ? new Date(payment.paidAt).toISOString() : new Date().toISOString(),
        },
      };

      const res = await fetch(`/api/admin/registrations/${registration.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.registration) {
        onSaveSuccess(data.registration);
      } else {
        setErrorMsg(data.message || 'Failed to update registration details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  const currentPlayer = players[activePlayerIdx] || players[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#070D24] border border-[#1A2C68] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A2C68] bg-[#0A1232]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  Edit Registration: {teamName || registration.teamName}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#1A2C68] text-[#FFB800] text-xs font-mono font-bold">
                  {registration.id}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                  Code: {registration.teamCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Update school, mentor, squad of 8 players, and payment records authoritatively.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#1A2C68] bg-[#0A1232]/40 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'team'
                ? 'text-[#FFB800] border-[#FFB800] bg-[#1A2C68]/30'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Team & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('association')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'association'
                ? 'text-[#FFB800] border-[#FFB800] bg-[#1A2C68]/30'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>School / Entity</span>
          </button>

          <button
            onClick={() => setActiveTab('mentor')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'mentor'
                ? 'text-[#FFB800] border-[#FFB800] bg-[#1A2C68]/30'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mentor / Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('players')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'players'
                ? 'text-[#FFB800] border-[#FFB800] bg-[#1A2C68]/30'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>8-Player Squad</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border-b-2 ${
              activeTab === 'payment'
                ? 'text-[#FFB800] border-[#FFB800] bg-[#1A2C68]/30'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Payment & Verification</span>
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Contents */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: TEAM & IDENTITY */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Team Name <span className="text-[#FFB800]">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tournament Division / Category <span className="text-[#FFB800]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={e => handleCategoryChange(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="class_4_5_6">Class 4, 5, 6 Division (Junior)</option>
                    <option value="class_7_8_9">Class 7, 8, 9 Division (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Team Tagline / War Cry
                  </label>
                  <input
                    type="text"
                    value={teamTagline}
                    onChange={e => setTeamTagline(e.target.value)}
                    placeholder="e.g. Born to Win, Built to Conquer"
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Team Short Code (3–4 Letters)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={teamShortCode}
                    onChange={e => setTeamShortCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm font-mono text-[#FFB800] font-bold focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Registration Master Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="SUBMITTED">SUBMITTED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 p-3 bg-[#0B1538] border border-[#1A2C68] rounded-xl cursor-pointer w-full">
                    <input
                      type="checkbox"
                      checked={includeBranding}
                      onChange={e => {
                        const checked = e.target.checked;
                        setIncludeBranding(checked);
                        setPayment(prev => ({
                          ...prev,
                          brandingAmount: checked ? 5000 : 0,
                          totalAmount: (prev.baseAmount || 8000) + (checked ? 5000 : 0)
                        }));
                      }}
                      className="w-4 h-4 rounded text-[#FFB800] bg-[#070D24] border-[#1A2C68] focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Full Team Registration Charges (₹13,000)</span>
                      <span className="text-[11px] text-slate-400">Includes Custom Jersey & Logo Branding</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Internal Admin Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Internal remarks regarding special requests, payments, or verifications..."
                  className="w-full px-3.5 py-2 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ASSOCIATION / SCHOOL */}
          {activeTab === 'association' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    School / Entity Full Name <span className="text-[#FFB800]">*</span>
                  </label>
                  <input
                    type="text"
                    value={association.associationName}
                    onChange={e => setAssociation({ ...association, associationName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Branch / Campus <span className="text-[#FFB800]">*</span>
                  </label>
                  <input
                    type="text"
                    value={association.branch}
                    onChange={e => setAssociation({ ...association, branch: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={association.city}
                    onChange={e => setAssociation({ ...association, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Entity Type
                  </label>
                  <select
                    value={association.associationType}
                    onChange={e => setAssociation({ ...association, associationType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="School">School</option>
                    <option value="Academy">Cricket Academy</option>
                    <option value="Club">Sports Club</option>
                    <option value="Organization">Other Organization</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Official Email <span className="text-[#FFB800]">*</span>
                  </label>
                  <input
                    type="email"
                    value={association.email}
                    onChange={e => setAssociation({ ...association, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Contact Mobile Number <span className="text-[#FFB800]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={association.mobile}
                    onChange={e => setAssociation({ ...association, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="School / Entity Logo"
                  value={association.associationLogo}
                  onChange={url => setAssociation({ ...association, associationLogo: url })}
                  tag="associations"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 3: MENTOR */}
          {activeTab === 'mentor' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mentor Full Name <span className="text-[#FFB800]">*</span>
                  </label>
                  <input
                    type="text"
                    value={mentor.name}
                    onChange={e => setMentor({ ...mentor, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={mentor.designation}
                    onChange={e => setMentor({ ...mentor, designation: e.target.value })}
                    placeholder="e.g. Head Coach / Sports Coordinator"
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mentor Primary Mobile <span className="text-[#FFB800]">*</span>
                  </label>
                  <input
                    type="tel"
                    value={mentor.mobile}
                    onChange={e => setMentor({ ...mentor, mobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Alternative Mobile (Optional)
                  </label>
                  <input
                    type="tel"
                    value={mentor.secondMobile}
                    onChange={e => setMentor({ ...mentor, secondMobile: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mentor Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={mentor.email}
                    onChange={e => setMentor({ ...mentor, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Mentor Photo (Optional)"
                  value={mentor.photo}
                  onChange={url => setMentor({ ...mentor, photo: url })}
                  tag="mentors"
                  required={false}
                />
              </div>
            </div>
          )}

          {/* TAB 4: 8 SQUAD PLAYERS */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              {/* Player 1-8 Selector Pills */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 p-2 bg-[#0A1232] border border-[#1A2C68] rounded-xl">
                {players.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePlayerIdx(idx)}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                      activePlayerIdx === idx
                        ? 'bg-[#FFB800] text-[#070D24] shadow-md shadow-[#FFB800]/20'
                        : 'bg-[#0B1538] text-slate-300 hover:bg-[#1A2C68] border border-[#1A2C68]'
                    }`}
                  >
                    <span>P{idx + 1}</span>
                    <span className="text-[10px] font-normal truncate max-w-[55px]">
                      {p.playerName ? p.playerName.split(' ')[0] : 'Slot'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Player Edit Form */}
              <div className="p-4 bg-[#0A1232]/60 border border-[#1A2C68] rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#1A2C68]">
                  <h4 className="text-sm font-bold text-[#FFB800] font-heading flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Editing Player #{activePlayerIdx + 1} Details
                  </h4>
                  <span className="text-xs text-slate-400">
                    Category: {category === 'class_4_5_6' ? 'Class 4-5-6' : 'Class 7-8-9'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Player Full Name <span className="text-[#FFB800]">*</span>
                    </label>
                    <input
                      type="text"
                      value={currentPlayer.playerName}
                      onChange={e => handlePlayerChange(activePlayerIdx, 'playerName', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Enrolled Class <span className="text-[#FFB800]">*</span>
                    </label>
                    <select
                      value={currentPlayer.studentClass}
                      onChange={e => handlePlayerChange(activePlayerIdx, 'studentClass', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                    >
                      {allowedClasses.map(cls => (
                        <option key={cls} value={cls}>Class {cls}</option>
                      ))}
                    </select>
                  </div>

                  {/* DOB Widget */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <DateChooserField
                      label="Date of Birth"
                      value={currentPlayer.dateOfBirth}
                      onChange={val => handlePlayerChange(activePlayerIdx, 'dateOfBirth', val)}
                      studentClass={Number(currentPlayer.studentClass) || allowedClasses[0]}
                      required
                    />
                  </div>

                  {/* Cricket Role */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Cricket Role <span className="text-[#FFB800]">*</span>
                    </label>
                    <select
                      value={currentPlayer.cricketRole}
                      onChange={e => handlePlayerChange(activePlayerIdx, 'cricketRole', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                    >
                      {CRICKET_ROLES.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Batting Style */}
                  {(currentPlayer.cricketRole === 'Batsman' || currentPlayer.cricketRole === 'All Rounder' || currentPlayer.cricketRole === 'Wicket Keeper') && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Batting Style <span className="text-[#FFB800]">*</span>
                      </label>
                      <select
                        value={currentPlayer.battingStyle || 'Right Hand'}
                        onChange={e => handlePlayerChange(activePlayerIdx, 'battingStyle', e.target.value)}
                        className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                      >
                        {BATTING_STYLES.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Bowling Style */}
                  {(currentPlayer.cricketRole === 'Bowler' || currentPlayer.cricketRole === 'All Rounder') && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Bowling Style <span className="text-[#FFB800]">*</span>
                      </label>
                      <select
                        value={currentPlayer.bowlingStyle || 'Right Arm Medium'}
                        onChange={e => handlePlayerChange(activePlayerIdx, 'bowlingStyle', e.target.value)}
                        className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                      >
                        {BOWLING_STYLES.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Jersey Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Jersey Number (1–99, Optional)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={currentPlayer.jerseyNumber || ''}
                      onChange={e => handlePlayerChange(activePlayerIdx, 'jerseyNumber', parseInt(e.target.value, 10) || undefined)}
                      placeholder="e.g. 7"
                      className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm font-mono text-[#FFB800] font-bold focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  {/* Jersey Size */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Jersey Size
                    </label>
                    <select
                      value={currentPlayer.jerseySize || '32'}
                      onChange={e => handlePlayerChange(activePlayerIdx, 'jerseySize', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                    >
                      {JERSEY_SIZES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Parent Mobile */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Parent Mobile (Optional)
                    </label>
                    <input
                      type="tel"
                      value={currentPlayer.parentMobile || ''}
                      onChange={e => handlePlayerChange(activePlayerIdx, 'parentMobile', e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>

                  {/* Parent Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Parent Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={currentPlayer.parentEmail || ''}
                      onChange={e => handlePlayerChange(activePlayerIdx, 'parentEmail', e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full px-3 py-2 bg-[#070D24] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploadField
                    label="Player Photo"
                    value={currentPlayer.playerPhoto}
                    onChange={url => handlePlayerChange(activePlayerIdx, 'playerPhoto', url)}
                    tag="players"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PAYMENT & VERIFICATION */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Verification Status <span className="text-[#FFB800]">*</span>
                  </label>
                  <select
                    value={payment.paymentStatus}
                    onChange={e => setPayment({ ...payment, paymentStatus: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-semibold focus:outline-none ${
                      payment.paymentStatus === 'VERIFIED'
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                        : payment.paymentStatus === 'PAYMENT_REJECTED'
                        ? 'bg-red-950/40 border-red-500/50 text-red-300'
                        : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    }`}
                  >
                    <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PAYMENT_REJECTED">PAYMENT REJECTED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={payment.method}
                    onChange={e => setPayment({ ...payment, method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT / IMPS</option>
                    <option value="CASHFREE">Cashfree Auto Gateway</option>
                    <option value="Cheque/Demand Draft">Cheque / Demand Draft</option>
                    <option value="Cash">Cash Deposit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Gateway Type
                  </label>
                  <select
                    value={payment.gateway}
                    onChange={e => setPayment({ ...payment, gateway: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  >
                    <option value="MANUAL">MANUAL (UPI/Bank Proof)</option>
                    <option value="CASHFREE">CASHFREE AUTOMATED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    UTR / Transaction Reference ID
                  </label>
                  <input
                    type="text"
                    value={payment.utrTransactionId}
                    onChange={e => setPayment({ ...payment, utrTransactionId: e.target.value.trim() })}
                    placeholder="12-digit UTR or Txn ID"
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm font-mono text-[#FFB800] focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Base Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={payment.baseAmount}
                    onChange={e => {
                      const base = parseInt(e.target.value, 10) || 0;
                      setPayment({
                        ...payment,
                        baseAmount: base,
                        totalAmount: base + payment.brandingAmount
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Branding Add-on Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={payment.brandingAmount}
                    onChange={e => {
                      const brand = parseInt(e.target.value, 10) || 0;
                      setPayment({
                        ...payment,
                        brandingAmount: brand,
                        totalAmount: payment.baseAmount + brand
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Total Amount Verified (₹)
                  </label>
                  <input
                    type="number"
                    value={payment.totalAmount}
                    onChange={e => setPayment({ ...payment, totalAmount: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Verified By Official
                  </label>
                  <input
                    type="text"
                    value={payment.verifiedBy}
                    onChange={e => setPayment({ ...payment, verifiedBy: e.target.value })}
                    placeholder="e.g. Tournament Director"
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={payment.paidAt}
                    onChange={e => setPayment({ ...payment, paidAt: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#0B1538] border border-[#1A2C68] rounded-xl text-sm text-white focus:outline-none focus:border-[#FFB800]"
                  />
                </div>
              </div>

              <div>
                <ImageUploadField
                  label="Payment Screenshot Proof"
                  value={payment.paymentScreenshot === 'CASHFREE_GATEWAY_VERIFIED' ? '' : payment.paymentScreenshot}
                  onChange={url => setPayment({ ...payment, paymentScreenshot: url })}
                  tag="payment-proofs"
                  required={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#1A2C68] bg-[#0A1232]/90">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB800] to-[#E68A00] text-[#070D24] text-xs sm:text-sm font-bold shadow-lg shadow-[#FFB800]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
