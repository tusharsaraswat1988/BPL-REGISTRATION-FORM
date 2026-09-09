import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield, Key, Lock, Search, Filter, Download, Printer, RefreshCw,
  CheckCircle2, Clock, XCircle, Users, Trophy, DollarSign,
  ExternalLink, Eye, ChevronRight, AlertTriangle, Check, X,
  User, Phone, Mail, MapPin, Calendar, Building, Sparkles,
  FileSpreadsheet, ArrowUpDown, Copy, Layers
} from 'lucide-react';
import { BplLogo } from '../BplLogo';
import { RegistrationFullRecord, PlayerInput } from '../../server/db/registrations';

interface AdminStats {
  totalRegistrations: number;
  totalPlayers: number;
  categoryClass456: number;
  categoryClass789: number;
  verifiedPayments: number;
  pendingPayments: number;
  rejectedPayments: number;
  totalRevenueCollected: number;
  totalRevenueVerified: number;
}

interface AdminPageProps {
  onNavigate?: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  // Auth state
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('bpl_admin_key') || sessionStorage.getItem('bpl_admin_key') || '';
  });
  const [keyInput, setKeyInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [rememberKey, setRememberKey] = useState<boolean>(true);

  // Data state
  const [registrations, setRegistrations] = useState<RegistrationFullRecord[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'class_4_5_6' | 'class_7_8_9'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'VERIFIED' | 'PENDING_VERIFICATION' | 'PAYMENT_REJECTED'>('all');

  // Selected registration for details modal
  const [selectedReg, setSelectedReg] = useState<RegistrationFullRecord | null>(null);

  // Selected registration for printing dossier
  const [printingReg, setPrintingReg] = useState<RegistrationFullRecord | null>(null);

  // Action states
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Test admin key with backend
  const verifyAdminKey = async (keyToTest: string): Promise<boolean> => {
    setIsVerifyingKey(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/verify-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': keyToTest,
        },
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setApiKey(keyToTest);
        if (rememberKey) {
          localStorage.setItem('bpl_admin_key', keyToTest);
        } else {
          sessionStorage.setItem('bpl_admin_key', keyToTest);
        }
        return true;
      } else {
        const data = await res.json().catch(() => ({}));
        setAuthError(data.message || 'Invalid Admin Credentials.');
        setIsAuthenticated(false);
        return false;
      }
    } catch (err: any) {
      setAuthError('Network error connecting to backend API.');
      return false;
    } finally {
      setIsVerifyingKey(false);
    }
  };

  // Auto-verify stored key on mount
  useEffect(() => {
    if (apiKey) {
      verifyAdminKey(apiKey);
    }
  }, []);

  // Fetch all registrations & stats when authenticated
  const fetchData = async () => {
    if (!isAuthenticated || !apiKey) return;
    setLoading(true);
    setError(null);

    try {
      const [regsRes, statsRes] = await Promise.all([
        fetch('/api/admin/registrations', {
          headers: { 'x-admin-key': apiKey },
        }),
        fetch('/api/admin/stats', {
          headers: { 'x-admin-key': apiKey },
        }),
      ]);

      if (regsRes.ok) {
        const regsData = await regsRes.json();
        setRegistrations(regsData.registrations || []);
      } else if (regsRes.status === 403) {
        setIsAuthenticated(false);
        setAuthError('Admin session expired or invalid credentials.');
        return;
      } else {
        setError('Failed to load registrations.');
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || null);
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('bpl_admin_key');
    sessionStorage.removeItem('bpl_admin_key');
    setApiKey('');
    setIsAuthenticated(false);
    setRegistrations([]);
    setStats(null);
  };

  // Handle Payment Verification
  const handleVerifyPayment = async (regId: string) => {
    if (!apiKey) return;
    setVerifyingId(regId);
    try {
      const res = await fetch(`/api/admin/registrations/${regId}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': apiKey,
        },
        body: JSON.stringify({ verifiedBy: 'Tournament Director (Admin)' }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`Payment successfully verified for ${regId}!`);
        // Update local state
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? data.registration : r))
        );
        if (selectedReg && selectedReg.id === regId) {
          setSelectedReg(data.registration);
        }
        // Refresh stats
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(`Verification failed: ${err.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      showToast(`Verification error: ${err.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  // Handle Payment Rejection
  const handleRejectPayment = async (regId: string) => {
    if (!apiKey) return;
    setRejectingId(regId);
    try {
      const res = await fetch(`/api/admin/registrations/${regId}/reject-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': apiKey,
        },
        body: JSON.stringify({
          rejectedBy: 'Tournament Committee Admin',
          reason: rejectReason || 'Payment screenshot unclear or transaction reference unmatched.',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(`Payment marked as rejected for ${regId}`);
        setRegistrations((prev) =>
          prev.map((r) => (r.id === regId ? data.registration : r))
        );
        if (selectedReg && selectedReg.id === regId) {
          setSelectedReg(data.registration);
        }
        setRejectReason('');
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(`Rejection failed: ${err.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      showToast(`Rejection error: ${err.message}`);
    } finally {
      setRejectingId(null);
    }
  };

  // Resend official confirmation & tournament emails
  const handleResendEmails = async (regId: string) => {
    setResendingId(regId);
    try {
      const res = await fetch(`/api/admin/registrations/${regId}/resend-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': apiKey,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        showToast(data.message || 'Confirmation emails resent successfully!');
      } else {
        showToast(`Email resend failed: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      showToast(`Network error resending emails: ${err.message}`);
    } finally {
      setResendingId(null);
    }
  };

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      // Category filter
      if (categoryFilter !== 'all' && reg.category !== categoryFilter) {
        return false;
      }
      // Payment status filter
      if (paymentFilter !== 'all' && reg.payment.paymentStatus !== paymentFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesRegId = reg.id.toLowerCase().includes(q);
        const matchesTeamCode = reg.teamCode.toLowerCase().includes(q);
        const matchesTeamName = reg.teamName.toLowerCase().includes(q);
        const matchesAssoc = reg.association.associationName.toLowerCase().includes(q);
        const matchesAssocCity = (reg.association.city || '').toLowerCase().includes(q);
        const matchesMentor = reg.mentor.name.toLowerCase().includes(q);
        const matchesMentorMobile = reg.mentor.mobile.toLowerCase().includes(q);
        const matchesUtr = (reg.payment.utrTransactionId || '').toLowerCase().includes(q);
        const matchesPlayers = reg.players.some((p) => p.playerName.toLowerCase().includes(q));

        return (
          matchesRegId ||
          matchesTeamCode ||
          matchesTeamName ||
          matchesAssoc ||
          matchesAssocCity ||
          matchesMentor ||
          matchesMentorMobile ||
          matchesUtr ||
          matchesPlayers
        );
      }
      return true;
    });
  }, [registrations, categoryFilter, paymentFilter, searchQuery]);

  // Export to Excel / CSV (Master Sheet with 1 row per team and all 8 player columns)
  const exportMasterCsv = () => {
    if (filteredRegistrations.length === 0) {
      showToast('No registrations to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Team Code',
      'Submitted At',
      'Division Category',
      'Team Name',
      'Tagline',
      'Short Code',
      'Branding Package Included',
      'Association / School Name',
      'Branch',
      'Association City',
      'Association Type',
      'Association Email',
      'Association Mobile',
      'Association Logo URL (Cloudinary)',
      'Mentor Name',
      'Mentor Designation',
      'Mentor Mobile',
      'Mentor Second Mobile',
      'Mentor Email',
      'Mentor Photo URL (Cloudinary)',
      // Player 1 to 8 Headers
      ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((num) => [
        `P${num} Name`,
        `P${num} Class`,
        `P${num} DOB`,
        `P${num} Jersey #`,
        `P${num} Jersey Size`,
        `P${num} Role`,
        `P${num} Batting Style`,
        `P${num} Bowling Style`,
        `P${num} Parent Mobile`,
        `P${num} Parent Email`,
        `P${num} Photo URL (Cloudinary)`,
      ]),
      'Base Entry Fee (INR)',
      'Branding Fee (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Gateway',
      'UTR / Transaction Reference',
      'Gateway Order ID',
      'Payment Status',
      'Paid At',
      'Verified By',
      'Verified At',
      'Payment Proof Screenshot URL (Cloudinary)',
    ];

    const rows = filteredRegistrations.map((r) => {
      const pCols: string[] = [];
      for (let i = 0; i < 8; i++) {
        const p = r.players[i] || ({} as PlayerInput);
        pCols.push(
          p.playerName || '',
          p.studentClass ? String(p.studentClass) : '',
          p.dateOfBirth || '',
          p.jerseyNumber ? String(p.jerseyNumber) : '',
          p.jerseySize || '',
          p.cricketRole || '',
          p.battingStyle || '',
          p.bowlingStyle || '',
          p.parentMobile || '',
          p.parentEmail || '',
          p.playerPhoto || ''
        );
      }

      return [
        r.id,
        r.teamCode,
        new Date(r.createdAt).toLocaleString('en-IN'),
        r.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9',
        r.teamName,
        r.branding.teamTagline || '',
        r.branding.teamShortCode || '',
        r.includeBranding ? 'YES' : 'NO',
        r.association.associationName,
        r.association.branch,
        r.association.city || '',
        r.association.associationType || 'School',
        r.association.email,
        r.association.mobile,
        r.association.associationLogo,
        r.mentor.name,
        r.mentor.designation || 'Head Coach',
        r.mentor.mobile,
        r.mentor.secondMobile || '',
        r.mentor.email,
        r.mentor.photo,
        ...pCols,
        String(r.payment.baseAmount || 8000),
        String(r.payment.brandingAmount || 0),
        String(r.payment.totalAmount || 8000),
        r.payment.method,
        r.payment.gateway || 'MANUAL',
        r.payment.utrTransactionId || '',
        r.payment.gatewayOrderId || '',
        r.payment.paymentStatus,
        r.payment.paidAt ? new Date(r.payment.paidAt).toLocaleString('en-IN') : '',
        r.payment.verifiedBy || '',
        r.payment.verifiedAt ? new Date(r.payment.verifiedAt).toLocaleString('en-IN') : '',
        r.payment.paymentScreenshot || '',
      ];
    });

    const csvContent =
      '\uFEFF' + // UTF-8 BOM so Microsoft Excel opens cleanly
      [headers, ...rows]
        .map((row) =>
          row
            .map((field) => {
              const str = String(field ?? '').replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `BPL_2026_Master_Registrations_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Excel/CSV Master Export downloaded successfully!');
  };

  // Export Flat Player Directory (1 row per player)
  const exportPlayersCsv = () => {
    if (filteredRegistrations.length === 0) {
      showToast('No players to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Team Code',
      'Team Name',
      'Division Category',
      'Association Name',
      'Player Index',
      'Player Name',
      'Student Class',
      'Date of Birth',
      'Jersey Number',
      'Jersey Size',
      'Cricket Role',
      'Batting Style',
      'Bowling Style',
      'Parent Mobile',
      'Parent Email',
      'Player Photo URL (Cloudinary)',
      'Payment Status',
    ];

    const rows: string[][] = [];
    filteredRegistrations.forEach((r) => {
      r.players.forEach((p, idx) => {
        rows.push([
          r.id,
          r.teamCode,
          r.teamName,
          r.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9',
          r.association.associationName,
          String(idx + 1),
          p.playerName,
          String(p.studentClass),
          p.dateOfBirth,
          String(p.jerseyNumber),
          p.jerseySize,
          p.cricketRole,
          p.battingStyle || '',
          p.bowlingStyle || '',
          p.parentMobile,
          p.parentEmail,
          p.playerPhoto,
          r.payment.paymentStatus,
        ]);
      });
    });

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((row) =>
          row
            .map((field) => {
              const str = String(field ?? '').replace(/"/g, '""');
              return `"${str}"`;
            })
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `BPL_2026_Player_Directory_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Player Directory CSV downloaded successfully!');
  };

  // Trigger browser print for single team dossier
  const handlePrintDossier = (reg: RegistrationFullRecord) => {
    setPrintingReg(reg);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // -------------------------------------------------------------
  // RENDER: Login / Password Key Lock Screen
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-[#091230] border border-[#1A2C68] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#FFB800] mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display font-extrabold text-white uppercase tracking-tight">
              BPL Tournament Admin
            </h1>
            <p className="text-slate-400 text-xs mt-1.5 font-sans">
              BidWar Premier League · Official Data & Verification Portal
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (keyInput.trim()) {
                verifyAdminKey(keyInput.trim());
              }
            }}
            className="space-y-5 relative z-10"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Admin Passcode / API Key</span>
                <span className="text-[10px] text-slate-500">Security Encrypted</span>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter tournament admin secret key..."
                  className="w-full bg-[#050B1E] border border-[#1A2C68] focus:border-[#FFB800] text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-colors font-mono placeholder:text-slate-600"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/20"
                />
                <span>Remember on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isVerifyingKey || !keyInput.trim()}
              className="w-full gold-button py-3 rounded-xl font-bold text-sm text-[#070D24] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isVerifyingKey ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center text-[11px] text-slate-500">
            BidWar Premier League (Season 1) · Varanasi Arena
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: Main Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#050B1E] text-slate-100 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1B48] border border-[#FFB800] text-amber-300 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#FFB800]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <div className="bg-[#070D24] border-b border-[#1A2C68] sticky top-[61px] z-30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#FFB800]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-display font-extrabold text-white tracking-wide uppercase">
                  BPL Admin Control Center
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Master DB
                </span>
              </div>
              <p className="text-slate-400 text-xs font-sans">
                Full registrations, Cloudinary media records, Excel exporter & print dossiers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-[#091230] border border-[#1A2C68] hover:border-amber-500/50 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh DB data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FFB800]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={exportMasterCsv}
              className="gold-button px-3.5 py-2 rounded-xl text-xs font-bold text-[#070D24] flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              title="Export all fields including 8 players and Cloudinary URLs to Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Excel (All Data)</span>
            </button>

            <button
              onClick={exportPlayersCsv}
              className="px-3 py-2 rounded-xl bg-[#091230] border border-[#1A2C68] hover:border-white/30 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export 1 row per player roster"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden md:inline">Player Directory CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Teams */}
            <div className="bg-[#091230] border border-[#1A2C68] rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">Registered Teams</span>
                <Trophy className="w-4 h-4 text-[#FFB800]" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {stats.totalRegistrations} <span className="text-xs text-slate-400 font-normal">/ 32 max</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-1.5">
                <span>Class 4-5-6: <strong className="text-amber-400">{stats.categoryClass456}</strong></span>
                <span>Class 7-8-9: <strong className="text-blue-400">{stats.categoryClass789}</strong></span>
              </div>
            </div>

            {/* Total Players */}
            <div className="bg-[#091230] border border-[#1A2C68] rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">Total Players</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {stats.totalPlayers}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 border-t border-white/5 pt-1.5">
                <span>8 Players strictly verified per squad</span>
              </div>
            </div>

            {/* Revenue Collected */}
            <div className="bg-[#091230] border border-[#1A2C68] rounded-2xl p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">Verified Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400">
                ₹{stats.totalRevenueVerified.toLocaleString('en-IN')}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 border-t border-white/5 pt-1.5 flex items-center justify-between">
                <span>Total Booked:</span>
                <span className="text-slate-300 font-semibold">₹{stats.totalRevenueCollected.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Pending Approvals */}
            <div
              onClick={() => setPaymentFilter('PENDING_VERIFICATION')}
              className="bg-[#091230] border border-[#1A2C68] hover:border-amber-500/50 rounded-2xl p-4 relative overflow-hidden cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span className="font-semibold uppercase tracking-wider">Pending Approvals</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400">
                {stats.pendingPayments}
              </div>
              <div className="mt-2 text-[11px] text-slate-400 border-t border-white/5 pt-1.5 flex items-center justify-between">
                <span>Verified: <strong className="text-emerald-400">{stats.verifiedPayments}</strong></span>
                <span>Rejected: <strong className="text-red-400">{stats.rejectedPayments}</strong></span>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-[#091230] border border-[#1A2C68] rounded-2xl p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Team, Reg ID, Code, School, Mentor, Phone, UTR..."
                className="w-full bg-[#050B1E] border border-[#1A2C68] focus:border-[#FFB800] text-white text-xs rounded-xl pl-10 pr-8 py-2.5 outline-none transition-colors placeholder:text-slate-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e: any) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#050B1E] border border-[#1A2C68] focus:border-[#FFB800] text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Divisions (Both)</option>
                <option value="class_4_5_6">Class 4–5–6 Division</option>
                <option value="class_7_8_9">Class 7–8–9 Division</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div className="sm:col-span-3">
              <select
                value={paymentFilter}
                onChange={(e: any) => setPaymentFilter(e.target.value)}
                className="w-full bg-[#050B1E] border border-[#1A2C68] focus:border-[#FFB800] text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Payment Statuses</option>
                <option value="VERIFIED">Verified Payments</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="PAYMENT_REJECTED">Payment Rejected</option>
              </select>
            </div>

            {/* Reset / Count */}
            <div className="sm:col-span-1 text-right">
              <span className="text-xs font-bold text-[#FFB800]">
                {filteredRegistrations.length} <span className="text-[10px] text-slate-400 font-normal">teams</span>
              </span>
            </div>
          </div>
        </div>

        {/* Master Registrations Table */}
        <div className="bg-[#091230] border border-[#1A2C68] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#070D24] text-slate-400 uppercase font-bold tracking-wider text-[10px] border-b border-[#1A2C68]">
                  <th className="py-3.5 px-4">Reg ID & Team Code</th>
                  <th className="py-3.5 px-4">Team & School / Academy</th>
                  <th className="py-3.5 px-4">Division</th>
                  <th className="py-3.5 px-4">Mentor In-Charge</th>
                  <th className="py-3.5 px-4">Squad</th>
                  <th className="py-3.5 px-4">Fee & Payment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2C68]/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#FFB800] mx-auto mb-2" />
                      <span>Loading registration records from database...</span>
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="font-semibold text-slate-300">No registration records found.</p>
                      <p className="text-[11px] text-slate-500 mt-1">Try adjusting your search query or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => {
                    const isVerified = reg.payment.paymentStatus === 'VERIFIED';
                    const isRejected = reg.payment.paymentStatus === 'PAYMENT_REJECTED';
                    const isPending = reg.payment.paymentStatus === 'PENDING_VERIFICATION';

                    return (
                      <tr
                        key={reg.id}
                        className="hover:bg-[#0E1B48]/50 transition-colors group"
                      >
                        {/* Reg ID & Code */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-xs">
                              {reg.id}
                            </span>
                            <button
                              onClick={() => copyToClipboard(reg.id, 'Registration ID')}
                              className="text-slate-500 hover:text-amber-400 transition-colors"
                              title="Copy ID"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-400 font-mono">
                            <span>Code: <strong>{reg.teamCode}</strong></span>
                          </div>
                        </td>

                        {/* Team & School with Logo Preview */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {reg.association.associationLogo ? (
                              <img
                                src={reg.association.associationLogo}
                                alt={reg.association.associationName}
                                className="w-9 h-9 rounded-lg object-contain bg-slate-900 border border-slate-700 flex-shrink-0"
                                onError={(e: any) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-400">
                                <Building className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-bold text-white text-sm truncate group-hover:text-amber-300 transition-colors">
                                {reg.teamName}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {reg.association.associationName} ({reg.association.branch})
                              </div>
                              {reg.includeBranding && (
                                <span className="inline-block mt-0.5 text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  Branded Jersey Included
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              reg.category === 'class_4_5_6'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {reg.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}
                          </span>
                        </td>

                        {/* Mentor */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            {reg.mentor.photo ? (
                              <img
                                src={reg.mentor.photo}
                                alt={reg.mentor.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
                                onError={(e: any) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                <User className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-200 truncate">{reg.mentor.name}</div>
                              <div className="text-[10px] text-slate-400">{reg.mentor.mobile}</div>
                            </div>
                          </div>
                        </td>

                        {/* Squad Preview */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center -space-x-1.5 overflow-hidden">
                            {reg.players.slice(0, 5).map((p, idx) => (
                              <img
                                key={idx}
                                src={p.playerPhoto}
                                alt={p.playerName}
                                title={`${p.playerName} (#${p.jerseyNumber} - ${p.cricketRole})`}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#091230] object-cover bg-slate-800"
                                onError={(e: any) => {
                                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%2394a3b8"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>';
                                }}
                              />
                            ))}
                            {reg.players.length > 5 && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 ring-2 ring-[#091230] text-[9px] font-bold text-slate-300">
                                +{reg.players.length - 5}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {reg.players.length} Players
                          </span>
                        </td>

                        {/* Fee & Payment Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-white">
                            ₹{(reg.payment.totalAmount || 8000).toLocaleString('en-IN')}
                          </div>
                          <div className="mt-1">
                            {isVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                                <XCircle className="w-3 h-3" />
                                Rejected
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedReg(reg)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Inspect Full Registration & Cloudinary Media"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => handlePrintDossier(reg)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Print Official Registration Dossier"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print</span>
                            </button>

                            <button
                              onClick={() => handleResendEmails(reg.id)}
                              disabled={resendingId === reg.id}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                              title="Resend Official Confirmation & Rules Emails"
                            >
                              {resendingId === reg.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Mail className="w-3.5 h-3.5" />
                              )}
                              <span>Email</span>
                            </button>

                            {isPending && (
                              <button
                                onClick={() => handleVerifyPayment(reg.id)}
                                disabled={verifyingId === reg.id}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                title="Quick Verify Payment"
                              >
                                {verifyingId === reg.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                <span>Verify</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DETAILED INSPECTION MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#091230] border border-[#1A2C68] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-[#070D24] border-b border-[#1A2C68] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#FFB800]">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-display font-extrabold text-white">
                      {selectedReg.teamName}
                    </h2>
                    <span className="font-mono text-xs px-2 py-0.5 bg-slate-800 text-amber-400 font-bold rounded border border-slate-700">
                      {selectedReg.id}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 font-bold rounded border border-amber-500/30">
                      Code: {selectedReg.teamCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedReg.association.associationName} · {selectedReg.category === 'class_4_5_6' ? 'Class 4–5–6 Division' : 'Class 7–8–9 Division'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrintDossier(selectedReg)}
                  className="px-3 py-1.5 rounded-lg bg-[#0E1B48] hover:bg-[#152766] border border-[#1A2C68] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Dossier</span>
                </button>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* Section 1: Association & Mentor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Association Card */}
                <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      Association / School
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {selectedReg.association.associationType || 'School'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    {selectedReg.association.associationLogo ? (
                      <a
                        href={selectedReg.association.associationLogo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/logo relative block"
                        title="Click to view full image in Cloudinary"
                      >
                        <img
                          src={selectedReg.association.associationLogo}
                          alt="Logo"
                          className="w-16 h-16 rounded-xl object-contain bg-[#070D24] border border-[#1A2C68] group-hover/logo:border-amber-400 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/logo:opacity-100 flex items-center justify-center transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </a>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                        <Building className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0 space-y-1 text-xs">
                      <div className="font-bold text-white text-sm">{selectedReg.association.associationName}</div>
                      <div className="text-slate-400">Branch: <strong className="text-slate-200">{selectedReg.association.branch}</strong></div>
                      {selectedReg.association.city && (
                        <div className="text-slate-400">City: <strong className="text-slate-200">{selectedReg.association.city}</strong></div>
                      )}
                      <div className="text-slate-400">Email: <strong className="text-slate-200 font-mono">{selectedReg.association.email}</strong></div>
                      <div className="text-slate-400">Phone: <strong className="text-slate-200 font-mono">{selectedReg.association.mobile}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Mentor Card */}
                <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      Mentor In-Charge
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {selectedReg.mentor.designation || 'Head Coach'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    {selectedReg.mentor.photo ? (
                      <a
                        href={selectedReg.mentor.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/photo relative block"
                        title="Click to view full photo in Cloudinary"
                      >
                        <img
                          src={selectedReg.mentor.photo}
                          alt="Mentor"
                          className="w-16 h-16 rounded-xl object-cover bg-[#070D24] border border-[#1A2C68] group-hover/photo:border-blue-400 transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                      </a>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                        <User className="w-6 h-6" />
                      </div>
                    )}

                    <div className="min-w-0 space-y-1 text-xs">
                      <div className="font-bold text-white text-sm">{selectedReg.mentor.name}</div>
                      <div className="text-slate-400">Designation: <strong className="text-slate-200">{selectedReg.mentor.designation || 'Head Coach'}</strong></div>
                      <div className="text-slate-400">Mobile: <strong className="text-slate-200 font-mono">{selectedReg.mentor.mobile}</strong></div>
                      {selectedReg.mentor.secondMobile && (
                        <div className="text-slate-400">Alt Mobile: <strong className="text-slate-200 font-mono">{selectedReg.mentor.secondMobile}</strong></div>
                      )}
                      <div className="text-slate-400">Email: <strong className="text-slate-200 font-mono">{selectedReg.mentor.email}</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: 8 Players Official Roster Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase text-[#FFB800] tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Official Squad (Strictly 8 Players)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    All player photos stored securely on Cloudinary
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedReg.players.map((player, idx) => (
                    <div
                      key={idx}
                      className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-3 flex flex-col justify-between space-y-2.5 relative overflow-hidden group/card hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        <a
                          href={player.playerPhoto}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/pimg relative block flex-shrink-0"
                          title="View high-res photo in Cloudinary"
                        >
                          <img
                            src={player.playerPhoto}
                            alt={player.playerName}
                            className="w-14 h-14 rounded-lg object-cover bg-slate-900 border border-slate-700 group-hover/pimg:border-amber-400"
                            onError={(e: any) => {
                              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="%2394a3b8"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/pimg:opacity-100 flex items-center justify-center transition-opacity">
                            <ExternalLink className="w-3 h-3 text-white" />
                          </div>
                        </a>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Jersey #{player.jerseyNumber} ({player.jerseySize})
                            </span>
                          </div>
                          <div className="font-bold text-white text-xs truncate mt-0.5">
                            {player.playerName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            Class {player.studentClass} · DOB: {player.dateOfBirth}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-2 text-[10px] space-y-0.5 text-slate-400">
                        <div>Role: <strong className="text-slate-200">{player.cricketRole}</strong></div>
                        {player.battingStyle && (
                          <div>Batting: <strong className="text-slate-300">{player.battingStyle}</strong></div>
                        )}
                        {player.bowlingStyle && (
                          <div>Bowling: <strong className="text-slate-300">{player.bowlingStyle}</strong></div>
                        )}
                        <div className="truncate">Parent: <strong className="text-slate-300 font-mono">{player.parentMobile}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Payment & Verification Panel */}
              <div className="bg-[#050B1E] border border-[#1A2C68] rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" />
                      Payment Details & Screenshot Proof
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Total Authoritative Amount: <strong>₹{(selectedReg.payment.totalAmount || 8000).toLocaleString('en-IN')}</strong> (Base ₹{selectedReg.payment.baseAmount} + Branding ₹{selectedReg.payment.brandingAmount})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedReg.payment.paymentStatus === 'VERIFIED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Verified Payment
                      </span>
                    )}
                    {selectedReg.payment.paymentStatus === 'PENDING_VERIFICATION' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold">
                        <Clock className="w-4 h-4" />
                        Verification Pending
                      </span>
                    )}
                    {selectedReg.payment.paymentStatus === 'PAYMENT_REJECTED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold">
                        <XCircle className="w-4 h-4" />
                        Payment Rejected
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between bg-[#070D24] p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-400">Payment Method:</span>
                      <strong className="text-white font-mono">{selectedReg.payment.method} ({selectedReg.payment.gateway || 'MANUAL'})</strong>
                    </div>

                    <div className="flex items-center justify-between bg-[#070D24] p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-400">UTR / Reference ID:</span>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-amber-400 font-mono">{selectedReg.payment.utrTransactionId || 'N/A'}</strong>
                        {selectedReg.payment.utrTransactionId && (
                          <button
                            onClick={() => copyToClipboard(selectedReg.payment.utrTransactionId, 'UTR')}
                            className="text-slate-500 hover:text-amber-400"
                            title="Copy UTR"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {selectedReg.payment.gatewayOrderId && (
                      <div className="flex items-center justify-between bg-[#070D24] p-2.5 rounded-lg border border-white/5">
                        <span className="text-slate-400">Cashfree Order ID:</span>
                        <strong className="text-slate-300 font-mono text-[11px]">{selectedReg.payment.gatewayOrderId}</strong>
                      </div>
                    )}

                    <div className="flex items-center justify-between bg-[#070D24] p-2.5 rounded-lg border border-white/5">
                      <span className="text-slate-400">Submitted / Paid At:</span>
                      <span className="text-slate-300 font-mono text-[11px]">
                        {selectedReg.payment.paidAt ? new Date(selectedReg.payment.paidAt).toLocaleString('en-IN') : 'N/A'}
                      </span>
                    </div>

                    {selectedReg.payment.verifiedBy && (
                      <div className="flex items-center justify-between bg-[#070D24] p-2.5 rounded-lg border border-white/5">
                        <span className="text-slate-400">Verified By / Notes:</span>
                        <span className="text-emerald-300 font-medium text-[11px]">{selectedReg.payment.verifiedBy}</span>
                      </div>
                    )}

                    {/* Admin Verification Actions */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleVerifyPayment(selectedReg.id)}
                        disabled={verifyingId === selectedReg.id || selectedReg.payment.paymentStatus === 'VERIFIED'}
                        className="gold-button px-4 py-2 rounded-xl text-xs font-bold text-[#070D24] flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        {verifyingId === selectedReg.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>{selectedReg.payment.paymentStatus === 'VERIFIED' ? 'Verified' : 'Verify Payment & Send Confirmation Email'}</span>
                      </button>

                      <button
                        onClick={() => handleResendEmails(selectedReg.id)}
                        disabled={resendingId === selectedReg.id}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-md transition-colors"
                        title="Resend official registration and payment emails to Association, Mentor, and Parents"
                      >
                        {resendingId === selectedReg.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                        <span>Resend All Emails</span>
                      </button>

                      {selectedReg.payment.paymentStatus !== 'PAYMENT_REJECTED' && (
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason (optional):', 'Screenshot unclear or UTR not found.');
                            if (reason !== null) {
                              setRejectReason(reason);
                              handleRejectPayment(selectedReg.id);
                            }
                          }}
                          disabled={rejectingId === selectedReg.id}
                          className="px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject Payment</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Payment Screenshot Proof */}
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-semibold block">
                      Uploaded Screenshot / Gateway Receipt:
                    </span>
                    {selectedReg.payment.paymentScreenshot && selectedReg.payment.paymentScreenshot !== 'CASHFREE_GATEWAY_VERIFIED' ? (
                      <div className="relative group/screenshot rounded-xl overflow-hidden border border-[#1A2C68] bg-[#070D24] max-h-56 flex items-center justify-center">
                        <img
                          src={selectedReg.payment.paymentScreenshot}
                          alt="Payment Proof"
                          className="max-h-56 w-auto object-contain rounded-xl"
                        />
                        <a
                          href={selectedReg.payment.paymentScreenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover/screenshot:opacity-100 flex flex-col items-center justify-center gap-1 text-white font-bold text-xs transition-opacity"
                        >
                          <ExternalLink className="w-5 h-5 text-amber-400" />
                          <span>Open Full Size Proof</span>
                        </a>
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl border border-emerald-500/20 bg-emerald-950/20 text-center text-emerald-400 text-xs space-y-1">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                        <div className="font-bold">Automated Gateway Verified</div>
                        <p className="text-[11px] text-slate-400">Cashfree payment webhook verified directly with bank reference.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#070D24] border-t border-[#1A2C68] flex items-center justify-between text-xs text-slate-400">
              <span>Created at: {new Date(selectedReg.createdAt).toLocaleString('en-IN')}</span>
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRINTABLE TEAM REGISTRATION DOSSIER (Rendered for Print) */}
      {/* ------------------------------------------------------------- */}
      {printingReg && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-6 z-[99999]">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .print\\:block, .print\\:block * {
                visibility: visible;
              }
              .print\\:block {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
                color: black !important;
              }
            }
          `}</style>

          <div className="max-w-4xl mx-auto border-2 border-black p-6 space-y-6">
            {/* Dossier Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-4">
              <div className="flex items-center gap-3">
                <BplLogo size={60} />
                <div>
                  <h1 className="text-xl font-black uppercase tracking-tight">BIDWAR PREMIER LEAGUE</h1>
                  <h2 className="text-sm font-bold text-gray-700">KIDS VERSION · SEASON 1 (VARANASI 2026)</h2>
                  <p className="text-[10px] text-gray-600">Official Tournament Team Registration Dossier</p>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-sm font-bold bg-black text-white px-2 py-0.5 inline-block rounded">
                  {printingReg.id}
                </div>
                <div className="text-xs font-bold mt-1">
                  Team Code: <span className="text-base font-black">{printingReg.teamCode}</span>
                </div>
                <div className="text-[10px] text-gray-600 uppercase font-bold">
                  {printingReg.category === 'class_4_5_6' ? 'Class 4–5–6 Division' : 'Class 7–8–9 Division'}
                </div>
              </div>
            </div>

            {/* Team & Association Info */}
            <div className="grid grid-cols-2 gap-4 border border-black p-3 text-xs">
              <div>
                <div className="font-bold text-sm uppercase">{printingReg.teamName}</div>
                <div>Association: <strong>{printingReg.association.associationName}</strong> ({printingReg.association.branch})</div>
                <div>Email: {printingReg.association.email} | Phone: {printingReg.association.mobile}</div>
                <div>City: {printingReg.association.city || 'Varanasi'} | Type: {printingReg.association.associationType || 'School'}</div>
              </div>
              <div>
                <div className="font-bold text-sm uppercase">Mentor: {printingReg.mentor.name}</div>
                <div>Designation: {printingReg.mentor.designation || 'Head Coach'}</div>
                <div>Mobile: <strong>{printingReg.mentor.mobile}</strong> {printingReg.mentor.secondMobile ? `| Alt: ${printingReg.mentor.secondMobile}` : ''}</div>
                <div>Email: {printingReg.mentor.email}</div>
              </div>
            </div>

            {/* Official 8-Player Grid with Photos */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2 border-b border-black pb-1">
                Official Playing Squad (Strictly 8 Players)
              </h3>
              <div className="grid grid-cols-4 gap-2.5">
                {printingReg.players.map((p, idx) => (
                  <div key={idx} className="border border-black p-2 text-[10px] flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={p.playerPhoto}
                        alt={p.playerName}
                        className="w-10 h-10 object-cover border border-black"
                      />
                      <div>
                        <div className="font-black text-xs">#{p.jerseyNumber}</div>
                        <div className="font-bold truncate max-w-[90px]">{p.playerName}</div>
                      </div>
                    </div>
                    <div className="border-t border-gray-300 pt-1 space-y-0.5">
                      <div>Class: <strong>{p.studentClass}</strong> | Size: {p.jerseySize}</div>
                      <div>Role: {p.cricketRole}</div>
                      <div>DOB: {p.dateOfBirth}</div>
                      <div className="truncate font-mono">P: {p.parentMobile}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Official Stamp */}
            <div className="border border-black p-3 text-xs grid grid-cols-3 gap-3 items-center">
              <div>
                <div className="font-bold uppercase text-[10px] text-gray-600">Payment Status</div>
                <div className="text-sm font-black uppercase mt-0.5">{printingReg.payment.paymentStatus}</div>
                <div>Amount: ₹{printingReg.payment.totalAmount} ({printingReg.payment.method})</div>
              </div>

              <div>
                <div className="font-bold uppercase text-[10px] text-gray-600">Transaction Reference / UTR</div>
                <div className="font-mono text-xs font-bold mt-0.5">{printingReg.payment.utrTransactionId || 'GATEWAY_VERIFIED'}</div>
                <div className="text-[10px] text-gray-600">Verified: {printingReg.payment.verifiedBy || 'Tournament Committee'}</div>
              </div>

              <div className="text-center border-l border-black pl-3">
                <div className="h-8 border-b border-dashed border-gray-400 mb-1" />
                <div className="text-[10px] font-bold uppercase">Authorized Tournament Official</div>
                <div className="text-[9px] text-gray-500">BidWar Premier League Committee</div>
              </div>
            </div>

            {/* Notice Footer */}
            <div className="text-[9px] text-gray-600 text-center border-t border-black pt-2">
              Tournament Venue: Varanasi Sports Arena | Match Dates: 3–4 October 2026 | Inquiries: bpl@bidwar.in | bidwar.in
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
