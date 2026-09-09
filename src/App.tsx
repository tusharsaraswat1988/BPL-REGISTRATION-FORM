import React, { useState, useEffect } from 'react';
import { useRouter } from './hooks/useRouter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { RegisterPage } from './components/pages/RegisterPage';
import { VerifyPage } from './components/pages/VerifyPage';
import { TeamsPage } from './components/pages/TeamsPage';
import { RulesPage } from './components/pages/RulesPage';
import { LegalPage, LegalTab } from './components/pages/LegalPage';
import { AdminPage } from './components/pages/AdminPage';
import { TournamentCategory, PublicTeamDTO, RegistrationConfirmationDTO } from './types';

const defaultCategories: TournamentCategory[] = [
  {
    id: 'class_4_5_6',
    name: 'Class 4–5–6 Division',
    classes: 'Class 4, 5, 6',
    ageEligibility: '8 Years to 11 Years 11 Months 29 Days',
    description: 'Fast-action box cricket for students currently enrolled in classes 4th, 5th, and 6th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 8,
    totalSlots: 8
  },
  {
    id: 'class_7_8_9',
    name: 'Class 7–8–9 Division',
    classes: 'Class 7, 8, 9',
    ageEligibility: '12 Years to 14 Years 11 Months 29 Days',
    description: 'Competitive youth box cricket for students currently enrolled in classes 7th, 8th, and 9th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 8,
    totalSlots: 8
  }
];

export default function App() {
  const { currentPath, navigate } = useRouter();
  const [categories, setCategories] = useState<TournamentCategory[]>(defaultCategories);
  const [teams, setTeams] = useState<PublicTeamDTO[]>([]);

  // Load tournament info & public teams from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [tournRes, teamsRes] = await Promise.all([
          fetch('/api/tournament-info').catch(() => null),
          fetch('/api/public/teams').catch(() => null)
        ]);

        if (tournRes && tournRes.ok) {
          const tournData = await tournRes.json();
          if (tournData.categories && Array.isArray(tournData.categories)) {
            setCategories(tournData.categories);
          }
        }

        if (teamsRes && teamsRes.ok) {
          const teamsData = await teamsRes.json();
          if (teamsData.teams && Array.isArray(teamsData.teams)) {
            setTeams(teamsData.teams);
          }
        }
      } catch (err) {
        console.warn('Backend API fetch error, using default categories:', err);
      }
    }

    loadData();
  }, []);

  const handleRegistrationSuccess = async (newRecord: RegistrationConfirmationDTO) => {
    // Refresh public registered teams list from backend API
    try {
      const teamsRes = await fetch('/api/public/teams');
      if (teamsRes && teamsRes.ok) {
        const teamsData = await teamsRes.json();
        if (teamsData.teams && Array.isArray(teamsData.teams)) {
          setTeams(teamsData.teams);
        }
      }
    } catch (err) {
      console.warn('Could not refresh teams list:', err);
    }

    // Update category slots remaining
    if (newRecord?.category) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === newRecord.category && (cat.slotsRemaining ?? 0) > 0
            ? { ...cat, slotsRemaining: (cat.slotsRemaining ?? 1) - 1 }
            : cat
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Official Sticky Sports Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        registeredCount={teams.length}
      />

      {/* Main Routed Content Area */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage
            categories={categories}
            teams={teams}
            onNavigate={navigate}
          />
        )}

        {currentPath === '/register' && (
          <RegisterPage
            categories={categories}
            onRegistrationSuccess={handleRegistrationSuccess}
            onNavigate={navigate}
          />
        )}

        {currentPath === '/verify' && (
          <VerifyPage
            onNavigate={navigate}
          />
        )}

        {currentPath === '/teams' && (
          <TeamsPage
            teams={teams}
          />
        )}

        {currentPath === '/rules' && (
          <RulesPage onNavigate={navigate} />
        )}

        {currentPath === '/terms' && (
          <LegalPage initialTab="terms" onNavigate={navigate} />
        )}

        {currentPath === '/privacy' && (
          <LegalPage initialTab="privacy" onNavigate={navigate} />
        )}

        {currentPath === '/refunds' && (
          <LegalPage initialTab="refunds" onNavigate={navigate} />
        )}

        {currentPath === '/contact' && (
          <LegalPage initialTab="contact" onNavigate={navigate} />
        )}

        {currentPath === '/admin' && (
          <AdminPage onNavigate={navigate} />
        )}
      </main>

      {/* Footer (Omitted on Admin Panel) */}
      {currentPath !== '/admin' && (
        <Footer onNavigate={navigate} />
      )}
    </div>
  );
}
