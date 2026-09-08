import React from 'react';
import { TeamsDirectory } from '../TeamsDirectory';
import { PublicTeamDTO } from '../../types';

interface TeamsPageProps {
  teams: PublicTeamDTO[];
}

export const TeamsPage: React.FC<TeamsPageProps> = ({ teams }) => {
  return (
    <div className="py-4">
      <TeamsDirectory teams={teams} />
    </div>
  );
};
