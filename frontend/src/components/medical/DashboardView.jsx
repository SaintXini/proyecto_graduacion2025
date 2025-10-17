import React from 'react';
import { DashboardStats } from './DashboardStats';
import { HighRiskPatients } from './HighRiskPatients';
import { UpcomingVisits } from './UpcomingVisits';

export const DashboardView = () => {
  return (
    <div>
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HighRiskPatients />
        <UpcomingVisits />
      </div>
    </div>
  );
};
