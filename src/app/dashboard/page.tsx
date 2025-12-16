'use client';

import { useEffect, useState } from 'react';
import { StatsGrid, ContributionChart, TypeBreakdownChart, RecentActivity, RecentContributions } from '@/components/dashboard';
import { statisticsApi, activityApi, contributionsApi } from '@/lib/api';
import type { DashboardStats, ActivityLog, Contribution } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<{ month: string; amount: number }[]>([]);
  const [typeData, setTypeData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, activityRes, contributionsRes, monthlyRes] = await Promise.all([
          statisticsApi.getDashboard(),
          activityApi.getRecent(5),
          contributionsApi.getAll({ limit: 5, sortBy: 'date', sortOrder: 'desc' }),
          contributionsApi.getMonthlyData(),
        ]);

        // Dashboard stats
        const dashboardData = dashboardRes as { data: DashboardStats };
        setStats(dashboardData.data);

        // Activity log
        const activityData = activityRes as { data: ActivityLog[] };
        setActivities(activityData.data || []);

        // Recent contributions
        const contribData = contributionsRes as { data: Contribution[] };
        setContributions(contribData.data || []);

        // Monthly chart data
        const monthlyData = monthlyRes as { data: { month: string; amount: number }[] };
        setChartData(monthlyData.data || []);

        // Type breakdown (calculate from stats if available)
        if (dashboardData.data) {
          setTypeData([
            { name: 'Cash', value: dashboardData.data.totalFunds * 0.72, color: '#10b981' },
            { name: 'Land', value: dashboardData.data.totalFunds * 0.2, color: '#f59e0b' },
            { name: 'Material', value: dashboardData.data.totalFunds * 0.08, color: '#3b82f6' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-pulse bg-gray-100 rounded-xl h-80" />
          <div className="animate-pulse bg-gray-100 rounded-xl h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s an overview of your project.</p>
      </div>

      {/* Stats */}
      {stats && <StatsGrid stats={stats} />}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ContributionChart data={chartData} />
        </div>
        <div>
          <TypeBreakdownChart data={typeData} />
        </div>
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentContributions contributions={contributions} />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
