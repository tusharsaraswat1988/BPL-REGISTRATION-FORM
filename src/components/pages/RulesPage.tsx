import React from 'react';
import { RulesAndFaq } from '../RulesAndFaq';

interface RulesPageProps {
  onNavigate?: (path: string) => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-4">
      <RulesAndFaq onNavigate={onNavigate} />
    </div>
  );
};
