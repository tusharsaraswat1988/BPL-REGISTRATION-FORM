import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TournamentHero } from './components/TournamentHero';
import { RegistrationWizard } from './components/RegistrationWizard';
import { LookupRegistration } from './components/LookupRegistration';
import { TeamsDirectory } from './components/TeamsDirectory';
import { RulesAndFaq } from './components/RulesAndFaq';
import { Footer } from './components/Footer';
import { RegistrationRecord, TournamentCategory } from './types';

const defaultCategories: TournamentCategory[] = [
  {
    id: 'class_4_5_6',
    name: 'Class 4–5–6 Division',
    classes: 'Class 4, 5, 6',
    description: 'Fast-action box cricket for students currently enrolled in classes 4th, 5th, and 6th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 6,
    totalSlots: 16
  },
  {
    id: 'class_7_8_9',
    name: 'Class 7–8–9 Division',
    classes: 'Class 7, 8, 9',
    description: 'Competitive youth box cricket for students currently enrolled in classes 7th, 8th, and 9th.',
    exactSquadSize: 8,
    baseEntryFee: 8000,
    brandingPackageFee: 5000,
    slotsRemaining: 4,
    totalSlots: 16
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'lookup' | 'teams' | 'rules'>('register');
  const [categories, setCategories] = useState<TournamentCategory[]>(defaultCategories);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tournament info & existing registrations from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [tournRes, regRes] = await Promise.all([
          fetch('/api/tournament-info').catch(() => null),
          fetch('/api/registrations').catch(() => null)
        ]);

        if (tournRes && tournRes.ok) {
          const tournData = await tournRes.json();
          if (tournData.categories && Array.isArray(tournData.categories)) {
            setCategories(tournData.categories);
          }
        }

        if (regRes && regRes.ok) {
          const regData = await regRes.json();
          if (regData.registrations && Array.isArray(regData.registrations)) {
            setRegistrations(regData.registrations);
          }
        }
      } catch (err) {
        console.warn('Backend API fetch error, using default categories:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleRegistrationSuccess = (newRecord: RegistrationRecord) => {
    setRegistrations(prev => [newRecord, ...prev]);
    // update category slots remaining
    setCategories(prev =>
      prev.map(cat =>
        cat.id === newRecord.category && cat.slotsRemaining > 0
          ? { ...cat, slotsRemaining: cat.slotsRemaining - 1 }
          : cat
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Official Sticky Sports Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        registeredCount={registrations.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'register' && (
          <div>
            <TournamentHero
              onStartRegistration={() => {
                const el = document.getElementById('registration-flow');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onCheckStatus={() => setActiveTab('lookup')}
            />
            <div id="registration-flow">
              <RegistrationWizard
                categories={categories}
                onRegistrationSuccess={handleRegistrationSuccess}
                onNavigateToLookup={() => setActiveTab('lookup')}
              />
            </div>
          </div>
        )}

        {activeTab === 'lookup' && (
          <LookupRegistration />
        )}

        {activeTab === 'teams' && (
          <TeamsDirectory registrations={registrations} />
        )}

        {activeTab === 'rules' && (
          <RulesAndFaq />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />
    </div>
  );
}
