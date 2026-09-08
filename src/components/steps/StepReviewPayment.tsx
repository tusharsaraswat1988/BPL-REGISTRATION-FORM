import React, { useRef, useState } from 'react';
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
  Trophy, Users, ArrowRight, Upload, Sparkles, AlertCircle
} from 'lucide-react';

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
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculatedBaseFee = 8000;
  const calculatedBrandingFee = includeBranding ? 5000 : 0;
  const calculatedTotalFee = calculatedBaseFee + calculatedBrandingFee;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText('bidwarsports@hdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProof(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          tag: 'payment_proof'
        })
      });
      const data = await res.json();
      if (data.secure_url) {
        setPayment(prev => ({ ...prev, paymentProofUrl: data.secure_url }));
      }
    } catch (err) {
      console.error('Proof upload error:', err);
    } finally {
      setIsUploadingProof(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            Registration Review & Payment
          </h3>
          <p className="text-xs text-slate-400">
            Review your association, mentor, and 8-player squad details before confirming registration.
          </p>
        </div>
      </div>

      {/* Review Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Association & Category Summary */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 relative">
          <button
            type="button"
            onClick={() => onBackToStep(0)}
            className="absolute top-3 right-3 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
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
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase font-mono-sport">
              Category: {category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}
            </span>
          </div>
        </div>

        {/* Mentor Summary */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 relative">
          <button
            type="button"
            onClick={() => onBackToStep(1)}
            className="absolute top-3 right-3 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Mentor In-Charge
          </div>
          <p className="text-base font-bold text-white font-heading">{mentor.name || 'Mentor Name'}</p>
          <p className="text-xs text-slate-300">{mentor.designation || 'Head Coach / In-Charge'}</p>
          <p className="text-xs text-slate-400 mt-2">
            Mobile: <strong className="text-slate-200">{mentor.mobile}</strong>
            {mentor.secondMobile ? ` / ${mentor.secondMobile}` : ''}
          </p>
          <p className="text-xs text-slate-400">
            Email: <strong className="text-slate-200">{mentor.email}</strong>
          </p>
        </div>

        {/* Team Identity Summary */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 relative">
          <button
            type="button"
            onClick={() => onBackToStep(2)}
            className="absolute top-3 right-3 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-sky-400" />
            Team Identity & Branding
          </div>
          <p className="text-base font-bold text-white font-heading">{teamName || 'Team Name'}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
              includeBranding 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {includeBranding ? 'Branding Package (₹13,000 Total)' : 'Standard Entry (₹8,000 Total)'}
            </span>
          </div>
        </div>

        {/* 8-Player Squad Summary */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 relative">
          <button
            type="button"
            onClick={() => onBackToStep(3)}
            className="absolute top-3 right-3 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
          >
            Edit
          </button>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Squad Roster (Strictly 8 Players)
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
            {players.map((p, idx) => (
              <div key={idx} className="truncate">
                <span className="text-amber-400 font-mono font-bold mr-1">#{p.jerseyNumber || idx + 1}</span>
                <span>{p.playerName || `Player ${idx + 1}`}</span>
                <span className="text-[10px] text-slate-500 ml-1">(Cl.{p.studentClass})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Fee Breakdown */}
      <div className="pt-6 border-t border-slate-800">
        <div className="mb-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <CreditCard className="w-5 h-5 text-amber-400" />
            Tournament Fee & Payment Details
          </h4>
          <p className="text-xs text-slate-400">
            Fee calculation is strictly determined by the official tournament backend rules.
          </p>
        </div>

        {/* Pricing Inclusions Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-mono-sport">
                ₹{calculatedTotalFee.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">
                (Base: ₹8,000 {includeBranding ? '+ Branding: ₹5,000' : '+ Branding: ₹0'})
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Includes 8 player match registrations, box-cricket fixtures, digital scoring & arena coverage.
            </p>
          </div>
          <div className="text-xs text-amber-300 font-bold bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/40 whitespace-nowrap">
            {includeBranding ? 'Branded Team Package' : 'Standard Team Entry'}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Payment Method *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['UPI', 'Bank Transfer (NEFT/RTGS/IMPS)', 'Cheque/Demand Draft'] as PaymentMethod[]).map(method => (
              <button
                key={method}
                type="button"
                onClick={() => setPayment(prev => ({ ...prev, method }))}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  payment.method === method
                    ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/40 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {method === 'UPI' && <QrCode className="w-4 h-4 text-amber-400" />}
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
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                <div className="text-center text-slate-950 font-mono text-[10px] font-bold">
                  <QrCode className="w-12 h-12 mx-auto text-slate-900" />
                  <span>BIDWAR UPI</span>
                </div>
              </div>
              <div className="flex-1 text-left space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Tournament VPA:</span>
                  <code className="text-xs font-mono font-bold text-amber-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    bidwarsports@hdfcbank
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded cursor-pointer"
                  >
                    {copiedUpi ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Account: <strong className="text-white">BIDWAR SPORTS TECH SOLUTIONS PVT LTD</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {payment.method === 'Bank Transfer (NEFT/RTGS/IMPS)' && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Account Holder</span>
                <strong className="text-white">BIDWAR SPORTS TECH SOLUTIONS PVT LTD</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Bank & Branch</span>
                <strong className="text-white">HDFC Bank Ltd, DLF Cyber City</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Account Number</span>
                <strong className="text-amber-400 font-mono font-bold">50200084918231</strong>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">IFSC Code</span>
                <strong className="text-white font-mono font-bold">HDFC0000281</strong>
              </div>
            </div>
          </div>
        )}

        {payment.method === 'Cheque/Demand Draft' && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs text-slate-300 mb-6">
            <p>
              Please make cheque or Demand Draft in favour of: <strong className="text-white">BIDWAR SPORTS TECH SOLUTIONS PVT LTD</strong>.
            </p>
            <p className="text-slate-400">
              Submit transaction reference / cheque number below and attach scanned copy or receipt.
            </p>
          </div>
        )}

        {/* Transaction Reference & Date & Proof Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Transaction Reference / UTR / Cheque # *
            </label>
            <input
              type="text"
              value={payment.transactionReference}
              onChange={e => setPayment(prev => ({ ...prev, transactionReference: e.target.value }))}
              placeholder="e.g. 428198301982 or UTR number"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Payment Date *
            </label>
            <input
              type="date"
              value={payment.paymentDate}
              onChange={e => setPayment(prev => ({ ...prev, paymentDate: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Payment Proof Upload * */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Payment Screenshot / Proof *
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProofUpload}
              accept="image/*,.pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingProof}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>{isUploadingProof ? 'Uploading...' : 'Upload Payment Receipt'}</span>
            </button>
            <input
              type="url"
              value={payment.paymentProofUrl || ''}
              onChange={e => setPayment(prev => ({ ...prev, paymentProofUrl: e.target.value }))}
              placeholder="Or paste receipt URL..."
              className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>
          {payment.paymentProofUrl && (
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Proof attached: {payment.paymentProofUrl}
            </p>
          )}
        </div>

        {/* Declaration */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 mb-6">
          <input
            id="terms-check"
            type="checkbox"
            checked={agreedToTerms}
            onChange={e => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800 cursor-pointer"
          />
          <label htmlFor="terms-check" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
            <strong className="text-white block font-medium mb-0.5">Tournament Rules & Age Verification Undertaking</strong>
            I certify that all 8 players meet the school class requirement for Category <strong>{category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}</strong> for BidWar Premier League Kids Season 1 (3-4 October 2026).
          </label>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="button"
            disabled={!agreedToTerms || isSubmitting}
            onClick={onSubmit}
            className={`w-full py-4 rounded-xl text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 font-heading cursor-pointer ${
              agreedToTerms && !isSubmitting
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 shadow-amber-500/25 active:scale-[0.99]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Registration to Official Tournament Server...</span>
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 text-slate-950" />
                <span>Confirm Registration & Generate BPL-2026 Pass (₹{calculatedTotalFee.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
