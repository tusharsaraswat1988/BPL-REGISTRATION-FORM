import React, { useState } from 'react';
import { 
  AssociationDetails, MentorDetails, PlayerDetails, 
  PaymentInfo, TournamentCategory, RegistrationRecord, CategoryId 
} from '../types';
import { StepCategoryAssociation } from './steps/StepCategoryAssociation';
import { StepMentor } from './steps/StepMentor';
import { StepTeamBranding } from './steps/StepTeamBranding';
import { StepPlayersRoster } from './steps/StepPlayersRoster';
import { StepReviewPayment } from './steps/StepReviewPayment';
import { TeamPassModal } from './TeamPassModal';
import confetti from 'canvas-confetti';
import { 
  Check, ArrowRight, ArrowLeft, Trophy, Printer, RefreshCw, AlertCircle
} from 'lucide-react';

interface WizardProps {
  categories: TournamentCategory[];
  onRegistrationSuccess: (record: RegistrationRecord) => void;
  onNavigateToLookup: () => void;
}

const stepsList = [
  { title: 'Category & Association', shortTitle: 'Association' },
  { title: 'Mentor In-Charge', shortTitle: 'Mentor' },
  { title: 'Team Identity & Kit', shortTitle: 'Branding' },
  { title: '8-Player Squad', shortTitle: 'Players' },
  { title: 'Review & Payment', shortTitle: 'Payment' },
];

export const RegistrationWizard: React.FC<WizardProps> = ({
  categories,
  onRegistrationSuccess,
  onNavigateToLookup
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<RegistrationRecord | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 1. Category & Association State
  const [category, setCategory] = useState<CategoryId>('class_4_5_6');

  const [association, setAssociation] = useState<AssociationDetails>({
    associationName: '',
    branch: '',
    email: '',
    mobile: '',
    associationLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80'
  });

  // 2. Mentor In-Charge State (Exactly ONE per team)
  const [mentor, setMentor] = useState<MentorDetails>({
    name: '',
    mobile: '',
    secondMobile: '',
    email: '',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    designation: 'Head Cricket Coach'
  });

  // 3. Team Branding & Options State
  const [teamName, setTeamName] = useState('');
  const [includeBranding, setIncludeBranding] = useState(false);
  const [teamTagline, setTeamTagline] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0284c7');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');

  // 4. Exactly 8 Players
  const initialPlayers: PlayerDetails[] = [
    {
      id: 'p-1',
      playerName: '',
      studentClass: 5,
      dateOfBirth: '2015-05-12',
      parentMobile: '',
      parentEmail: '',
      playerPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
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
      playerPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
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
      playerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
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
      playerPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
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
      playerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
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
      playerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
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
      playerPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
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
      playerPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
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
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80'
  });

  // Keep player default classes consistent when category changes
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, stepsList.length - 1));
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        category,
        association,
        mentor,
        teamName,
        includeBranding,
        teamTagline,
        primaryColor,
        secondaryColor,
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
  };

  // Render Confirmation Screen when successful
  if (submissionSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase font-mono-sport">
                BIDWAR PREMIER LEAGUE — REGISTRATION CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
                Welcome to BPL Kids Season 1!
              </h2>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Your team <strong className="text-white">{submissionSuccess.branding.teamName}</strong> has been successfully registered.
              </p>
            </div>

            {/* Official Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto py-2">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official Team Code (4-Digit)
                </span>
                <span className="text-3xl font-black text-amber-400 font-mono-sport tracking-widest">
                  {submissionSuccess.teamCode}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">4-digit code for fixtures & scoreboard lookups</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Registration ID
                </span>
                <span className="text-2xl font-black text-white font-mono-sport tracking-wider">
                  {submissionSuccess.id}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Official tournament pass reference</p>
              </div>
            </div>

            {/* Inclusions & Fee Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 max-w-xl mx-auto text-xs text-slate-300 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Total Fee Verified</span>
                <strong className="text-amber-400 font-mono-sport text-sm">
                  ₹{submissionSuccess.payment.totalAmount.toLocaleString('en-IN')}
                </strong>
                <span className="text-[11px] text-slate-500 block">
                  ({submissionSuccess.branding.includeBranding ? 'Base ₹8,000 + Branding ₹5,000' : 'Base ₹8,000'})
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Tournament Dates</span>
                <strong className="text-white">3rd & 4th October 2026</strong>
                <span className="text-[11px] text-slate-400 block">Bidwar.in & KV TechMedia</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setShowPassModal(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer font-heading"
              >
                <Printer className="w-4 h-4" />
                <span>View & Print Official Team Pass</span>
              </button>

              <button
                onClick={handleResetForNewTeam}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Register Another Team</span>
              </button>
            </div>
          </div>
        </div>

        {showPassModal && (
          <TeamPassModal
            registration={submissionSuccess}
            onClose={() => setShowPassModal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    if (index < currentStep) setCurrentStep(index);
                  }}
                  className={`flex flex-col items-center gap-1.5 cursor-pointer ${
                    index < currentStep ? 'group' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-all font-mono-sport ${
                      isCompleted
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : isCurrent
                        ? 'bg-slate-900 text-amber-400 border-2 border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
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
                      isCurrent ? 'text-amber-400 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {step.shortTitle}
                  </span>
                </div>

                {index < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                      index < currentStep ? 'bg-amber-500' : 'bg-slate-800'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Form Container Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative backdrop-blur-sm">
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
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
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
            onBackToStep={idx => setCurrentStep(idx)}
          />
        )}

        {/* Wizard Footer Controls (Steps 0 through 3) */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-800">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handlePrev}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer font-heading active:scale-95"
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
