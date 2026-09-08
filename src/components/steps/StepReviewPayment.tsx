import React, { useState } from 'react';
import { 
  AssociationDetails, 
  MentorDetails, 
  PlayerDetails, 
  PaymentInfo, 
  PaymentMethod,
  CategoryId 
} from '../../types';
import { 
  ShieldCheck, CreditCard, QrCode, Building, CheckCircle2, 
  Trophy, Users, ArrowRight, Loader2, Copy, Check
} from 'lucide-react';
import { ImageUploadField } from '../ImageUploadField';
import { TOURNAMENT_CONFIG } from '../../config/tournamentConfig';

interface StepReviewPaymentProps {
  category: CategoryId;
  association: AssociationDetails;
  mentor: MentorDetails;
  teamName: string;
  includeBranding: boolean;
  players: PlayerDetails[];
  payment: PaymentInfo;
  setPayment: React.Dispatch<React.SetStateAction<PaymentInfo>>;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBackToStep: (stepIndex: number) => void;
}

export const StepReviewPayment: React.FC<StepReviewPaymentProps> = ({
  category,
  association,
  mentor,
  teamName,
  includeBranding,
  players,
  payment,
  setPayment,
  isSubmitting,
  onSubmit,
  onBackToStep
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const baseFee = TOURNAMENT_CONFIG.REGISTRATION_FEE;
  const brandingFee = includeBranding ? TOURNAMENT_CONFIG.BRANDING_FEE : 0;
  const totalAmount = baseFee + brandingFee;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(TOURNAMENT_CONFIG.PAYMENT_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A2C68]">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <ShieldCheck className="w-5 h-5 text-[#FFB800]" />
            Registration Review & Payment Confirmation
          </h3>
          <p className="text-xs text-slate-400">
            Carefully verify all 8 players, mentor contacts, and registration details prior to official submission.
          </p>
        </div>
      </div>

      {/* Review Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Association & Category Summary */}
        <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] relative">
          <button
            type="button"
            onClick={() => onBackToStep(0)}
            className="absolute top-3 right-3 text-[11px] text-[#FFB800] hover:text-amber-300 font-semibold cursor-pointer select-none"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono-sport">
            <Building className="w-3.5 h-3.5 text-[#FFB800]" />
            Association & Category
          </div>
          <p className="text-base font-bold text-white font-heading">{association.associationName || 'Not specified'}</p>
          <p className="text-xs text-slate-300 mt-0.5">
            Branch: <span className="text-white font-medium">{association.branch || 'Main Branch'}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Email: {association.email} • Mobile: {association.mobile}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#FFB800]/15 text-[#FFB800] text-xs font-bold border border-[#FFB800]/30 uppercase font-mono-sport">
              Division: {category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}
            </span>
          </div>
        </div>

        {/* Mentor Summary */}
        <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] relative">
          <button
            type="button"
            onClick={() => onBackToStep(1)}
            className="absolute top-3 right-3 text-[11px] text-[#FFB800] hover:text-amber-300 font-semibold cursor-pointer select-none"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono-sport">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Mentor In-Charge
          </div>
          <p className="text-base font-bold text-white font-heading">{mentor.name || 'Mentor Name'}</p>
          <p className="text-xs text-slate-300">{mentor.designation || 'Head Coach / Coordinator'}</p>
          <p className="text-xs text-slate-400 mt-2">
            Mobile: <strong className="text-slate-200">{mentor.mobile}</strong>
            {mentor.secondMobile ? ` / ${mentor.secondMobile}` : ''}
          </p>
          <p className="text-xs text-slate-400">
            Email: <strong className="text-slate-200">{mentor.email}</strong>
          </p>
        </div>

        {/* Team Identity Summary (NO KIT COLORS) */}
        <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] relative">
          <button
            type="button"
            onClick={() => onBackToStep(2)}
            className="absolute top-3 right-3 text-[11px] text-[#FFB800] hover:text-amber-300 font-semibold cursor-pointer select-none"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono-sport">
            <Trophy className="w-3.5 h-3.5 text-[#FFB800]" />
            Team Identity & Registration Tier
          </div>
          <p className="text-base font-bold text-white font-heading">{teamName || 'Team Name'}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
              includeBranding 
                ? 'bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {includeBranding ? 'Full Branding Package (₹13,000)' : 'Standard Entry (₹8,000)'}
            </span>
          </div>
        </div>

        {/* 8-Player Squad Summary */}
        <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] relative">
          <button
            type="button"
            onClick={() => onBackToStep(3)}
            className="absolute top-3 right-3 text-[11px] text-[#FFB800] hover:text-amber-300 font-semibold cursor-pointer select-none"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono-sport">
            <Users className="w-3.5 h-3.5 text-[#FFB800]" />
            Squad Roster (Strictly 8 Players)
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
            {players.map((p, idx) => (
              <div key={idx} className="truncate">
                <span className="text-[#FFB800] font-mono font-bold mr-1">#{p.jerseyNumber || idx + 1}</span>
                <span>{p.playerName || `Player ${idx + 1}`}</span>
                <span className="text-[10px] text-slate-500 ml-1">(Cl.{p.studentClass})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Fee Breakdown */}
      <div className="pt-6 border-t border-[#1A2C68]">
        <div className="mb-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <CreditCard className="w-5 h-5 text-[#FFB800]" />
            Tournament Entry Fee & Payment
          </h4>
          <p className="text-xs text-slate-400">
            Calculated strictly according to official tournament pricing.
          </p>
        </div>

        {/* Pricing Inclusions Banner */}
        <div className="p-5 rounded-xl bg-[#0B1538] border border-[#FFB800]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shadow-lg shadow-[#FFB800]/5">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#FFB800] font-mono-sport">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">
                (Base: ₹8,000 {includeBranding ? '+ Branding Add-on: ₹5,000' : '+ Branding: ₹0'})
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Includes 8 player match registrations, box-cricket fixtures, digital scoring & arena coverage.
            </p>
          </div>
          <div className="text-xs text-[#FFB800] font-bold bg-[#FFB800]/15 px-3 py-1.5 rounded-lg border border-[#FFB800]/30 whitespace-nowrap font-mono-sport">
            {includeBranding ? 'Branded Team Package' : 'Standard Team Entry'}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Payment Method <span className="text-[#FFB800]">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['UPI', 'Bank Transfer (NEFT/RTGS/IMPS)', 'Cheque/Demand Draft'] as PaymentMethod[]).map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setPayment(prev => ({ ...prev, method }))}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                  payment.method === method
                    ? 'bg-[#0E1B48] border-[#FFB800] ring-2 ring-[#FFB800]/40 text-white shadow-md'
                    : 'bg-[#0A1230] border-[#1A2C68] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {method === 'UPI' && <QrCode className="w-4 h-4 text-[#FFB800]" />}
                  {method === 'Bank Transfer (NEFT/RTGS/IMPS)' && <Building className="w-4 h-4 text-sky-400" />}
                  {method === 'Cheque/Demand Draft' && <CreditCard className="w-4 h-4 text-emerald-400" />}
                  <span className="text-xs font-bold text-white">{method}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Method Instructions */}
        {payment.method === 'UPI' && (
          <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                <div className="text-center text-slate-950 font-mono text-[10px] font-bold">
                  <QrCode className="w-12 h-12 mx-auto text-slate-900" />
                  <span>BIDWAR UPI</span>
                </div>
              </div>
              <div className="flex-1 text-left space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400">Tournament VPA:</span>
                  <code className="text-xs font-mono font-bold text-[#FFB800] bg-[#070D24] px-2.5 py-1 rounded border border-[#1A2C68]">
                    {TOURNAMENT_CONFIG.PAYMENT_CONFIG.upiId}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="text-[11px] text-slate-300 hover:text-white bg-[#1A2C68] px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUpi ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Account: <strong className="text-white">{TOURNAMENT_CONFIG.PAYMENT_CONFIG.bankAccountName}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {payment.method === 'Bank Transfer (NEFT/RTGS/IMPS)' && (
          <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] space-y-3 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#070D24] p-2.5 rounded-lg border border-[#1A2C68]">
                <span className="text-slate-400 block text-[10px] uppercase">Account Holder</span>
                <strong className="text-white">{TOURNAMENT_CONFIG.PAYMENT_CONFIG.bankAccountName}</strong>
              </div>
              <div className="bg-[#070D24] p-2.5 rounded-lg border border-[#1A2C68]">
                <span className="text-slate-400 block text-[10px] uppercase">Bank & Branch</span>
                <strong className="text-white">{TOURNAMENT_CONFIG.PAYMENT_CONFIG.bankName}</strong>
              </div>
              <div className="bg-[#070D24] p-2.5 rounded-lg border border-[#1A2C68]">
                <span className="text-slate-400 block text-[10px] uppercase">Account Number</span>
                <strong className="text-[#FFB800] font-mono font-bold">{TOURNAMENT_CONFIG.PAYMENT_CONFIG.accountNumber}</strong>
              </div>
              <div className="bg-[#070D24] p-2.5 rounded-lg border border-[#1A2C68]">
                <span className="text-slate-400 block text-[10px] uppercase">IFSC Code</span>
                <strong className="text-white font-mono font-bold">{TOURNAMENT_CONFIG.PAYMENT_CONFIG.ifscCode}</strong>
              </div>
            </div>
          </div>
        )}

        {payment.method === 'Cheque/Demand Draft' && (
          <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] space-y-2 text-xs text-slate-300 mb-6">
            <p>
              Please make cheque or Demand Draft in favour of: <strong className="text-white">{TOURNAMENT_CONFIG.PAYMENT_CONFIG.bankAccountName}</strong>.
            </p>
            <p className="text-slate-400">
              Submit transaction reference / cheque number below and attach scanned copy or receipt.
            </p>
          </div>
        )}

        {/* Transaction Reference & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Transaction Reference / UTR Number <span className="text-[#FFB800]">*</span>
            </label>
            <input
              type="text"
              value={payment.transactionReference}
              onChange={e => setPayment(prev => ({ ...prev, transactionReference: e.target.value }))}
              placeholder="e.g. 428198301982 or UTR number"
              className="w-full px-4 py-3 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Date <span className="text-[#FFB800]">*</span>
            </label>
            <input
              type="date"
              value={payment.paymentDate}
              onChange={e => setPayment(prev => ({ ...prev, paymentDate: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0A1230] border border-[#1A2C68] rounded-xl text-xs text-white focus:outline-none focus:border-[#FFB800]"
            />
          </div>
        </div>

        {/* Payment Proof Upload via ImageUploadField */}
        <div className="mb-6">
          <ImageUploadField
            label="Payment Screenshot / Receipt Proof"
            required
            value={payment.paymentProofUrl}
            onChange={url => setPayment(prev => ({ ...prev, paymentProofUrl: url }))}
            aspectRatio="wide"
            helperText="Screenshot or scanned receipt showing UTR / transaction ID and amount"
          />
        </div>

        {/* Undertaking Declaration */}
        <div className="p-4 rounded-xl bg-[#0A1230] border border-[#1A2C68] flex items-start gap-3 mb-6">
          <input
            id="terms-check"
            type="checkbox"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 text-[#FFB800] focus:ring-[#FFB800] bg-slate-800 cursor-pointer"
          />
          <label htmlFor="terms-check" className="text-xs text-slate-300 cursor-pointer leading-relaxed select-none">
            <strong className="text-white block font-medium mb-0.5">Tournament Undertaking & Age Verification</strong>
            I certify that all 8 players meet the school class requirement for Division <strong>{category === 'class_4_5_6' ? 'Class 4, 5, 6' : 'Class 7, 8, 9'}</strong> for BidWar Premier League Kids Season 1 (3rd & 4th October 2026).
          </label>
        </div>

        {/* FINAL SUBMIT BUTTON (Distinct from auto-save) */}
        <div>
          <button
            type="button"
            disabled={!agreedToTerms || isSubmitting}
            onClick={onSubmit}
            className={`w-full py-4 rounded-xl text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-heading cursor-pointer select-none active:scale-[0.99] ${
              agreedToTerms && !isSubmitting
                ? 'bg-[#FFB800] hover:bg-[#FBBF24] shadow-[#FFB800]/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                <span>Submitting Official Registration...</span>
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 text-slate-950" />
                <span>Submit Official Tournament Registration (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
