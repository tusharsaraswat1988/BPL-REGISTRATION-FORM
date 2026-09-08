import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AssociationDetails, MentorDetails, PlayerDetails, 
  PaymentInfo, TournamentCategory, RegistrationRecord, CategoryId 
} from '../types';
import { StepCategoryAssociation } from './steps/StepCategoryAssociation';
import { StepMentor } from './steps/StepMentor';
import { StepTeamBranding } from './steps/StepTeamBranding';
import { StepPlayersRoster } from './steps/StepPlayersRoster';
import { StepReviewPayment } from './steps/StepReviewPayment';
import confetti from 'canvas-confetti';
import { 
  Check, ArrowRight, ArrowLeft, Trophy, RefreshCw, AlertCircle,
  Loader2, CheckCircle2, Lock, MessageCircle, ExternalLink, Copy
} from 'lucide-react';
import { TOURNAMENT_CONFIG } from '../config/tournamentConfig';

interface WizardProps {
  categories: TournamentCategory[];
  onRegistrationSuccess: (record: RegistrationRecord) => void;
  onNavigateToLookup: () => void;
}

const stepsList = [
  { title: 'Category & Association', shortTitle: 'Association' },
  { title: 'Mentor In-Charge', shortTitle: 'Mentor' },
  { title: 'Team Identity & Tier', shortTitle: 'Branding' },
  { title: '8-Player Squad', shortTitle: 'Players' },
  { title: 'Review & Payment', shortTitle: 'Payment' },
];

const LOCAL_STORAGE_DRAFT_KEY = 'bpl_kids_draft_id';

export const RegistrationWizard: React.FC<WizardProps> = ({
  categories,
  onRegistrationSuccess,
  onNavigateToLookup
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<RegistrationRecord | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-Save State (subtle, non-intrusive)
  const [draftId, setDraftId] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Category & Association State
  const [category, setCategory] = useState<CategoryId>('class_4_5_6');
  const [association, setAssociation] = useState<AssociationDetails>({
    associationName: '',
    branch: '',
    email: '',
    mobile: '',
    associationLogo: ''
  });

  // 2. Mentor In-Charge State (Exactly ONE per team)
  const [mentor, setMentor] = useState<MentorDetails>({
    name: '',
    mobile: '',
    secondMobile: '',
    email: '',
    photo: '',
    designation: 'Head Cricket Coach'
  });

  // 3. Team Branding & Options State (NO KIT COLORS)
  const [teamName, setTeamName] = useState('');
  const [includeBranding, setIncludeBranding] = useState(false);
  const [teamTagline, setTeamTagline] = useState('');

  // 4. Exactly 8 Players
  const initialPlayers: PlayerDetails[] = [
    {
      id: 'p-1',
      playerName: '',
      studentClass: 5,
      dateOfBirth: '2015-05-12',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 7,
      jerseySize: '32',
      cricketRole: 'All Rounder',
      battingStyle: 'Right Hand',
      bowlingStyle: 'Right Arm Medium'
    },
    {
      id: 'p-2',
      playerName: '',
      studentClass: 5,
      dateOfBirth: '2015-06-18',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 18,
      jerseySize: '32',
      cricketRole: 'Batsman',
      battingStyle: 'Right Hand'
    },
    {
      id: 'p-3',
      playerName: '',
      studentClass: 4,
      dateOfBirth: '2016-02-14',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 99,
      jerseySize: '30',
      cricketRole: 'Bowler',
      bowlingStyle: 'Right Arm Spin'
    },
    {
      id: 'p-4',
      playerName: '',
      studentClass: 4,
      dateOfBirth: '2016-04-20',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 10,
      jerseySize: '30',
      cricketRole: 'Wicket Keeper',
      battingStyle: 'Left Hand'
    },
    {
      id: 'p-5',
      playerName: '',
      studentClass: 5,
      dateOfBirth: '2015-09-08',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 45,
      jerseySize: '32',
      cricketRole: 'Bowler',
      bowlingStyle: 'Left Arm Spin'
    },
    {
      id: 'p-6',
      playerName: '',
      studentClass: 6,
      dateOfBirth: '2014-11-22',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 24,
      jerseySize: '34',
      cricketRole: 'All Rounder',
      battingStyle: 'Right Hand',
      bowlingStyle: 'Right Arm Fast'
    },
    {
      id: 'p-7',
      playerName: '',
      studentClass: 4,
      dateOfBirth: '2016-07-30',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 11,
      jerseySize: '30',
      cricketRole: 'Batsman',
      battingStyle: 'Right Hand'
    },
    {
      id: 'p-8',
      playerName: '',
      studentClass: 5,
      dateOfBirth: '2015-03-10',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: '',
      jerseyNumber: 8,
      jerseySize: '32',
      cricketRole: 'Bowler',
      bowlingStyle: 'Right Arm Spin'
    }
  ];

  const [players, setPlayers] = useState<PlayerDetails[]>(initialPlayers);

  // 5. Payment Details
  const [payment, setPayment] = useState<PaymentInfo>({
    method: 'UPI',
    transactionReference: `BPL-${Math.floor(100000000 + Math.random() * 900000000)}`,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentProofUrl: ''
  });

  // Restore draft from backend on mount if one exists
  useEffect(() => {
    const existingDraftId = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
    if (!existingDraftId) return;

    fetch(`/api/drafts/${encodeURIComponent(existingDraftId)}`)
      .then(res => {
        if (!res.ok) throw new Error('Draft not found');
        return res.json();
      })
      .then(data => {
        if (data.success && data.draft) {
          const d = data.draft;
          if (d.category) setCategory(d.category);
          if (d.association) setAssociation(prev => ({ ...prev, ...d.association }));
          if (d.mentor) setMentor(prev => ({ ...prev, ...d.mentor }));
          if (d.teamName) setTeamName(d.teamName);
          if (typeof d.includeBranding === 'boolean') setIncludeBranding(d.includeBranding);
          if (d.teamTagline) setTeamTagline(d.teamTagline);
          if (Array.isArray(d.players) && d.players.length === 8) setPlayers(d.players);
          if (d.payment) setPayment(prev => ({ ...prev, ...d.payment }));
          if (typeof d.currentStep === 'number' && d.currentStep >= 0 && d.currentStep < stepsList.length) {
            setCurrentStep(d.currentStep);
          }
          setSaveStatus('saved');
          setLastSavedTime(new Date(d.updatedAt || Date.now()));
        }
      })
      .catch(() => {
        // Stale or invalid draft ID, clean up
        localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
        setDraftId(null);
      });
  }, []);

  // Server-Side Auto-Save Function
  const persistDraftToServer = useCallback(async (stepToSave = currentStep) => {
    setSaveStatus('saving');

    const payload = {
      draftId,
      currentStep: stepToSave,
      category,
      association,
      mentor,
      teamName,
      includeBranding,
      teamTagline,
      players,
      payment,
      status: 'DRAFT'
    };

    try {
      const res = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.draftId) {
          setDraftId(data.draftId);
          localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, data.draftId);
        }
        setSaveStatus('saved');
        setLastSavedTime(new Date());

        // Subtle auto-fade after 3 seconds
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } else {
        setSaveStatus('idle');
      }
    } catch (err) {
      console.warn('Auto-save network error:', err);
      setSaveStatus('idle');
    }
  }, [
    draftId, currentStep, category, association, 
    mentor, teamName, includeBranding, teamTagline, 
    players, payment
  ]);

  // Debounced auto-save on form edits (1.5 seconds)
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      // Only auto-save if at least some details have been entered
      if (association.associationName || mentor.name || teamName) {
        persistDraftToServer(currentStep);
      }
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [
    category, association, mentor, teamName, 
    includeBranding, teamTagline, players, payment, 
    currentStep, persistDraftToServer
  ]);

  // Keep player classes consistent when category changes
  const handleCategoryChange = (newCat: CategoryId) => {
    setCategory(newCat);
    const validClasses = newCat === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];
    setPlayers(prev =>
      prev.map(p => {
        if (!validClasses.includes(p.studentClass)) {
          return { ...p, studentClass: validClasses[0] };
        }
        return p;
      })
    );
  };

  // Step Validation logic
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!category) newErrors.category = 'Please select a tournament category.';
      if (!association.associationName.trim()) newErrors.associationName = 'Association Name is required.';
      if (!association.branch.trim()) newErrors.branch = 'Branch is required.';
      if (!association.email.trim() || !association.email.includes('@')) newErrors.email = 'Valid Association Email is required.';
      if (!association.mobile.trim() || association.mobile.length < 8) newErrors.mobile = 'Valid Association Mobile is required.';
      if (!association.associationLogo.trim()) newErrors.associationLogo = 'Association Logo is required.';
    } else if (stepIndex === 1) {
      if (!mentor.name.trim()) newErrors.mentorName = 'Mentor Name is required.';
      if (!mentor.mobile.trim() || mentor.mobile.length < 8) newErrors.mentorMobile = 'Valid Mentor Mobile is required.';
      if (!mentor.email.trim() || !mentor.email.includes('@')) newErrors.mentorEmail = 'Valid Mentor Email is required.';
      if (!mentor.photo.trim()) newErrors.mentorPhoto = 'Mentor Photo is required.';
    } else if (stepIndex === 2) {
      if (!teamName.trim()) newErrors.teamName = 'Team Name is required.';
    } else if (stepIndex === 3) {
      if (players.length !== 8) {
        newErrors.players = `Exactly 8 players are required. Current: ${players.length}.`;
      }
      const allowedClasses = category === 'class_4_5_6' ? [4, 5, 6] : [7, 8, 9];
      const numbersSet = new Set<number>();

      for (let i = 0; i < players.length; i++) {
        const p = players[i];
        if (!p.playerName?.trim()) {
          newErrors.players = `Player #${i + 1} is missing a full name.`;
          break;
        }
        if (!allowedClasses.includes(p.studentClass)) {
          newErrors.players = `Player #${i + 1} must be in Class ${allowedClasses.join(', ')}.`;
          break;
        }
        if (!p.dateOfBirth?.trim()) {
          newErrors.players = `Player #${i + 1} is missing a Date of Birth.`;
          break;
        }
        if (!p.parentMobile?.trim()) {
          newErrors.players = `Player #${i + 1} is missing a Parent Mobile number.`;
          break;
        }
        if (!p.parentEmail?.trim()) {
          newErrors.players = `Player #${i + 1} is missing a Parent Email.`;
          break;
        }
        if (!p.playerPhoto?.trim()) {
          newErrors.players = `Player #${i + 1} is missing a Photo.`;
          break;
        }
        if (!p.jerseyNumber || p.jerseyNumber < 1 || p.jerseyNumber > 99) {
          newErrors.players = `Player #${i + 1} requires a jersey number between 1 and 99.`;
          break;
        }
        if (numbersSet.has(p.jerseyNumber)) {
          newErrors.players = `Jersey number ${p.jerseyNumber} is assigned to more than one player. Numbers must be unique.`;
          break;
        }
        numbersSet.add(p.jerseyNumber);

        if (!p.jerseySize) {
          newErrors.players = `Player #${i + 1} is missing a Jersey Size.`;
          break;
        }
        if (!p.cricketRole) {
          newErrors.players = `Player #${i + 1} is missing a Cricket Role.`;
          break;
        }
      }
    } else if (stepIndex === 4) {
      // Validate payment
      if (!payment.transactionReference?.trim()) {
        newErrors.payment = 'UTR / Transaction Reference number is required.';
      }
      if (!payment.paymentProofUrl?.trim()) {
        newErrors.payment = 'Payment receipt / screenshot is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = Math.min(currentStep + 1, stepsList.length - 1);
      setCurrentStep(nextStep);
      persistDraftToServer(nextStep);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    persistDraftToServer(prevStep);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // FINAL REGISTRATION SUBMISSION (Explicit Action: Transitions from DRAFT to SUBMITTED)
  const handleSubmit = async () => {
    // Thoroughly validate every single section
    for (let s = 0; s < stepsList.length; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        draftId,
        category,
        association,
        mentor,
        teamName,
        includeBranding,
        teamTagline,
        players,
        payment
      };

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubmissionSuccess(data.registration);
        onRegistrationSuccess(data.registration);

        // Clean up draft from local storage
        localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
        setDraftId(null);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.message || 'Failed to submit registration. Please verify required fields.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      alert('Network error connecting to tournament server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForNewTeam = () => {
    setSubmissionSuccess(null);
    setCurrentStep(0);
    setTeamName('');
    setIncludeBranding(false);
    setDraftId(null);
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
  };

  const handleCopyCommunityLink = () => {
    navigator.clipboard?.writeText(TOURNAMENT_CONFIG.WHATSAPP_COMMUNITY_URL);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Render Confirmation Screen when successful
  if (submissionSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0A1230] border border-[#1A2C68] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#FFB800]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FFB800] text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-[#FFB800]/30">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-[#FFB800] uppercase font-mono-sport">
                BIDWAR PREMIER LEAGUE — REGISTRATION SUBMITTED
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
                Registration Confirmed!
              </h2>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Your team <strong className="text-white">{submissionSuccess.branding.teamName}</strong> has been successfully submitted to the official tournament roster.
              </p>
            </div>

            {/* Official Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto py-2">
              <div className="p-4 rounded-2xl bg-[#070D24] border border-[#1A2C68] text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono-sport">
                  Official Team Code (4-Digit)
                </span>
                <span className="text-3xl font-black text-[#FFB800] font-mono-sport tracking-widest">
                  {submissionSuccess.teamCode}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">4-digit numeric code for fixtures & scoreboard lookups</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070D24] border border-[#1A2C68] text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono-sport">
                  Registration ID
                </span>
                <span className="text-2xl font-black text-white font-mono-sport tracking-wider">
                  {submissionSuccess.id}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Official tournament pass reference</p>
              </div>
            </div>

            {/* Submission Details Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto text-xs">
              <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68] text-left">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Division</span>
                <strong className="text-white font-mono-sport">
                  {submissionSuccess.category === 'class_4_5_6' ? 'Class 4–5–6' : 'Class 7–8–9'}
                </strong>
              </div>
              <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68] text-left">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Roster</span>
                <strong className="text-white">8 Players (Exact)</strong>
              </div>
              <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68] text-left">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Mentor</span>
                <strong className="text-white truncate block">{submissionSuccess.mentor.name}</strong>
              </div>
              <div className="bg-[#070D24] p-3 rounded-xl border border-[#1A2C68] text-left">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Fee Paid</span>
                <strong className="text-[#FFB800] font-mono">₹{submissionSuccess.payment.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Official Tournament WhatsApp Community Link Banner */}
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-left space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-heading">
                  Official Tournament WhatsApp Community
                </h4>
              </div>
              <p className="text-xs text-slate-300">
                Join the official mentors and captains WhatsApp group for fixture announcements, toss timings, match rules, and live box-cricket schedule updates.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <a
                  href={TOURNAMENT_CONFIG.WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer select-none"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join WhatsApp Community</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyCommunityLink}
                  className="px-4 py-2.5 rounded-xl bg-[#0A1230] border border-[#1A2C68] hover:border-slate-600 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Group Link'}</span>
                </button>
              </div>
            </div>

            {/* TEAM PASS: EXPLICITLY COMING SOON - NOT ACTIVE */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[#070D24] border border-[#1A2C68] text-left space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono-sport">
                  Team Pass — Coming Soon
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Team Passes are generated after registration is verified by the tournament committee. You will receive an alert on WhatsApp once your credentials and match passes are ready.
              </p>
              <div className="pt-2">
                <button
                  disabled
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold flex items-center gap-2 cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Team Pass Download Unavailable (Verification Pending)</span>
                </button>
              </div>
            </div>

            {/* Register Another Team */}
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleResetForNewTeam}
                className="px-6 py-3 rounded-xl bg-[#0E1B48] hover:bg-[#1A2C68] text-slate-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border border-[#1A2C68]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Register Another Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header Row with Subtle Auto-Save Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-widest font-mono-sport">
            Official Registration Portal
          </span>
          <h2 className="text-xl font-bold text-white font-heading">
            Team Entry Flow
          </h2>
        </div>

        {/* Subtle Auto-Save Status Chip */}
        <div className="flex items-center gap-2 text-xs">
          {saveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A2C68] text-[#FFB800] text-[11px] font-medium border border-[#FFB800]/30 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Saving draft...</span>
            </span>
          )}

          {saveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 transition-opacity duration-300">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Saved ✓</span>
            </span>
          )}

          {saveStatus === 'idle' && lastSavedTime && (
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Draft synced ({lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          )}
        </div>
      </div>

      {/* Step Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stepsList.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <React.Fragment key={step.title}>
                <div
                  onClick={() => {
                    if (index < currentStep) {
                      setCurrentStep(index);
                      persistDraftToServer(index);
                    }
                  }}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer ${
                    index < currentStep ? 'group' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-all font-mono-sport ${
                      isCompleted
                        ? 'bg-[#FFB800] text-slate-950 shadow-md shadow-[#FFB800]/20'
                        : isCurrent
                        ? 'bg-[#0A1230] text-[#FFB800] border-2 border-[#FFB800] ring-2 ring-[#FFB800]/20 shadow-lg'
                        : 'bg-[#0A1230] text-slate-500 border border-[#1A2C68]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 text-slate-950 stroke-[3]" /> : index + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold hidden md:inline text-center max-w-[100px] leading-tight ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span
                    className={`text-[10px] font-semibold md:hidden ${
                      isCurrent ? 'text-[#FFB800] font-bold' : 'text-slate-500'
                    }`}
                  >
                    {step.shortTitle}
                  </span>
                </div>

                {index < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                      index < currentStep ? 'bg-[#FFB800]' : 'bg-[#1A2C68]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-[#0A1230] border border-[#1A2C68] rounded-2xl p-6 sm:p-8 shadow-xl relative">
        {currentStep === 0 && (
          <StepCategoryAssociation
            category={category}
            setCategory={handleCategoryChange}
            association={association}
            setAssociation={setAssociation}
            categories={categories}
            errors={errors}
          />
        )}

        {currentStep === 1 && (
          <StepMentor
            mentor={mentor}
            setMentor={setMentor}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <StepTeamBranding
            teamName={teamName}
            setTeamName={setTeamName}
            includeBranding={includeBranding}
            setIncludeBranding={setIncludeBranding}
            teamTagline={teamTagline}
            setTeamTagline={setTeamTagline}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <StepPlayersRoster
            players={players}
            setPlayers={setPlayers}
            category={category}
            errors={errors}
          />
        )}

        {currentStep === 4 && (
          <StepReviewPayment
            category={category}
            association={association}
            mentor={mentor}
            teamName={teamName}
            includeBranding={includeBranding}
            players={players}
            payment={payment}
            setPayment={setPayment}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onBackToStep={idx => {
              setCurrentStep(idx);
              persistDraftToServer(idx);
            }}
          />
        )}

        {/* Wizard Footer Controls (Steps 0 through 3) */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#1A2C68]">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handlePrev}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-[#0E1B48] text-slate-300 hover:text-white hover:bg-[#1A2C68] border border-[#1A2C68]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-xl bg-[#FFB800] hover:bg-[#FBBF24] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-[#FFB800]/20 transition-all flex items-center gap-2 cursor-pointer font-heading active:scale-95 select-none"
            >
              <span>Continue to Next Step</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
