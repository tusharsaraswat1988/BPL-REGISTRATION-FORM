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
  Trophy, Users, ArrowRight, Loader2, Copy, Check, Zap, AlertCircle
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
  const [isInitiatingCashfree, setIsInitiatingCashfree] = useState(false);
  const [cashfreeError, setCashfreeError] = useState<string | null>(null);

  const baseFee = TOURNAMENT_CONFIG.REGISTRATION_FEE;
  const brandingFee = includeBranding ? TOURNAMENT_CONFIG.BRANDING_FEE : 0;
  const totalAmount = baseFee + brandingFee;

  const isCashfreePaid = Boolean(
    payment.gateway === 'CASHFREE' && 
    payment.paymentStatus === 'VERIFIED' && 
    (payment.gatewayPaymentId || payment.transactionReference)
  );

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(TOURNAMENT_CONFIG.PAYMENT_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  /**
   * Launch Cashfree Payment Gateway Flow
   */
  const handlePayWithCashfree = async () => {
    setIsInitiatingCashfree(true);
    setCashfreeError(null);

    try {
      // 1. Create order on backend
      const res = await fetch('/api/payments/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          includeBranding,
          teamName,
          mentor,
          association,
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize payment session with Cashfree.');
      }

      const { orderId, paymentSessionId, environment, isMock } = orderData;

      // 2. If sandbox mock / development without live keys, simulate instant checkout
      if (isMock || !(window as any).Cashfree) {
        console.log('[Cashfree] Simulating payment verification for order:', orderId);
        
        // Call backend verification
        const verifyRes = await fetch('/api/payments/cashfree/verify-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        const verifyData = await verifyRes.json();

        if (verifyData.verified && verifyData.payment) {
          const payId = verifyData.payment.paymentId || `cf_${orderId}`;
          setPayment(prev => ({
            ...prev,
            method: 'CASHFREE',
            gateway: 'CASHFREE',
            gatewayOrderId: orderId,
            gatewayPaymentId: payId,
            transactionReference: verifyData.payment.bankReference || payId,
            paymentProofUrl: 'CASHFREE_GATEWAY_VERIFIED',
            paymentStatus: 'VERIFIED',
            paymentDate: new Date().toISOString().split('T')[0],
            paidAt: new Date().toISOString(),
          }));
        } else {
          throw new Error('Payment verification failed.');
        }
        return;
      }

      // 3. Launch live Cashfree JS SDK Checkout Modal
      const CashfreeSdk = (window as any).Cashfree;
      const cashfree = CashfreeSdk({
        mode: environment || 'sandbox',
      });

      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_modal',
      }).then(async (result: any) => {
        if (result?.error) {
          console.warn('[Cashfree Checkout Dropped/Error]', result.error);
          setCashfreeError(result.error.message || 'Payment cancelled or incomplete.');
          return;
        }

        // Verify order on backend
        const verifyRes = await fetch('/api/payments/cashfree/verify-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });
        const verifyData = await verifyRes.json();

        if (verifyData.verified) {
          const payId = verifyData.payment?.paymentId || `cf_${orderId}`;
          setPayment(prev => ({
            ...prev,
            method: 'CASHFREE',
            gateway: 'CASHFREE',
            gatewayOrderId: orderId,
            gatewayPaymentId: payId,
            transactionReference: verifyData.payment?.bankReference || payId,
            paymentProofUrl: 'CASHFREE_GATEWAY_VERIFIED',
            paymentStatus: 'VERIFIED',
            paymentDate: new Date().toISOString().split('T')[0],
            paidAt: new Date().toISOString(),
          }));
        } else {
          setCashfreeError(verifyData.error || 'Payment was not marked as successful by Cashfree.');
        }
      }).catch((err: any) => {
        console.error('[Cashfree Checkout Error]', err);
        setCashfreeError(err?.message || 'Payment window encountered an error.');
      });

    } catch (err: any) {
      console.error('[Cashfree Init Error]', err);
      setCashfreeError(err.message || 'Could not connect to payment gateway. Please try again.');
    } finally {
      setIsInitiatingCashfree(false);
    }
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

        {/* Team Identity Summary */}
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
            Tournament Entry Fee & Payment Gateway
          </h4>
          <p className="text-xs text-slate-400">
            Secure payment processing powered by Cashfree Payment Gateway.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'CASHFREE', label: 'Cashfree Online (Instant)', icon: Zap, popular: true },
              { id: 'UPI', label: 'Manual UPI QR / VPA', icon: QrCode },
              { id: 'Bank Transfer (NEFT/RTGS/IMPS)', label: 'Bank Transfer (NEFT/RTGS)', icon: Building },
              { id: 'Cheque/Demand Draft', label: 'Cheque / DD', icon: CreditCard },
            ].map(m => {
              const Icon = m.icon;
              const isSelected = payment.method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPayment(prev => ({ ...prev, method: m.id as PaymentMethod }))}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none active:scale-[0.98] relative ${
                    isSelected
                      ? 'bg-[#0E1B48] border-[#FFB800] ring-2 ring-[#FFB800]/40 text-white shadow-md'
                      : 'bg-[#0A1230] border-[#1A2C68] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {m.popular && (
                    <span className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-[#FFB800] text-slate-950 text-[9px] font-black uppercase tracking-wider font-mono-sport">
                      Instant
                    </span>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-[#FFB800]' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-white leading-tight">{m.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cashfree Payment Flow */}
        {payment.method === 'CASHFREE' && (
          <div className="p-5 rounded-2xl bg-[#0A1230] border border-[#1A2C68] space-y-4 mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB800] font-mono-sport block">
                  Official Online Payment Gateway
                </span>
                <h4 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                  <Zap className="w-4 h-4 text-[#FFB800]" />
                  Cashfree Payments (UPI, Cards, NetBanking, GPay, Paytm)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant registration confirmation upon successful payment. Zero manual verification delay.
                </p>
              </div>

              {isCashfreePaid && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-xs font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PAYMENT VERIFIED ✓</span>
                </div>
              )}
            </div>

            {cashfreeError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{cashfreeError}</span>
              </div>
            )}

            {!isCashfreePaid ? (
              <div className="pt-2 space-y-3">
                <div className="p-4 rounded-xl bg-[#070D24] border border-[#1A2C68] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left space-y-1">
                    <span className="text-xs text-slate-400">Total Payable Amount:</span>
                    <div className="text-2xl font-black text-[#FFB800] font-mono-sport">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Supports all UPI apps (GPay, PhonePe, Paytm), Debit/Credit Cards & Netbanking.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isInitiatingCashfree}
                    onClick={handlePayWithCashfree}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#FFB800] hover:bg-[#FBBF24] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FFB800]/20 flex items-center justify-center gap-2 cursor-pointer font-heading active:scale-95 transition-all select-none"
                  >
                    {isInitiatingCashfree ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>Connecting to Cashfree...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-slate-950 fill-current" />
                        <span>Pay ₹{totalAmount.toLocaleString('en-IN')} with Cashfree</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-left">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Completed & Authenticated via Cashfree Gateway</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono pt-1 text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Payment Reference:</span>
                    <strong className="text-white">{payment.gatewayPaymentId || payment.transactionReference}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Amount Paid:</span>
                    <strong className="text-emerald-400">₹{totalAmount.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Status:</span>
                    <strong className="text-emerald-400">VERIFIED (Instant)</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Method Instructions: Manual UPI */}
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

        {/* Method Instructions: Bank Transfer */}
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

        {/* Method Instructions: Cheque */}
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

        {/* Transaction Reference & Date (Required for manual methods) */}
        {payment.method !== 'CASHFREE' && (
          <>
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
                tag="payment-proofs"
                value={payment.paymentProofUrl}
                onChange={url => setPayment(prev => ({ ...prev, paymentProofUrl: url }))}
                aspectRatio="wide"
                helperText="Screenshot or scanned receipt showing UTR / transaction ID and amount"
              />
            </div>
          </>
        )}

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

        {/* FINAL SUBMIT BUTTON */}
        <div>
          <button
            type="button"
            disabled={!agreedToTerms || isSubmitting || (payment.method === 'CASHFREE' && !isCashfreePaid)}
            onClick={onSubmit}
            className={`w-full py-4 rounded-xl text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-heading cursor-pointer select-none active:scale-[0.99] ${
              agreedToTerms && !isSubmitting && (payment.method !== 'CASHFREE' || isCashfreePaid)
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
