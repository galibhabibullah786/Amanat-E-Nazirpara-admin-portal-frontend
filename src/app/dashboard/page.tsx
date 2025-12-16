'use client';

import { StatsGrid, ContributionChart, TypeBreakdownChart, RecentActivity, RecentContributions } from '@/components/dashboard';
import { mockStats, mockChartData, mockActivity, mockContributions } from '@/lib/mock-data';

const typeData = [
  { name: 'Cash', value: 1800000, color: '#10b981' },
  { name: 'Land', value: 500000, color: '#f59e0b' },
  { name: 'Material', value: 200000, color: '#3b82f6' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your project.</p>
      </div>

      {/* Stats */}
      <StatsGrid stats={mockStats} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContributionChart data={mockChartData} />
        </div>
        <div>
          <TypeBreakdownChart data={typeData} />
        </div>
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentContributions contributions={mockContributions} />
        <RecentActivity activities={mockActivity} />
      </div>
    </div>
  );
}
