'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
  Image,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { DashboardStats } from '@/lib/types';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: 'primary' | 'emerald' | 'amber' | 'blue' | 'red';
  delay?: number;
}

const colorClasses = {
  primary: 'from-primary-500 to-primary-600',
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  blue: 'from-blue-500 to-blue-600',
  red: 'from-red-500 to-red-600',
};

function StatCard({ title, value, change, icon, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(change)}% from last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white`}>
            {icon}
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorClasses[color]}`} />
      </Card>
    </motion.div>
  );
}

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatCard
        title="Total Funds"
        value={formatCurrency(stats.totalFunds)}
        change={stats.monthlyGrowth}
        icon={<DollarSign className="w-6 h-6" />}
        color="primary"
        delay={0}
      />
      <StatCard
        title="Total Contributors"
        value={stats.totalContributors}
        icon={<Users className="w-6 h-6" />}
        color="emerald"
        delay={0.1}
      />
      <StatCard
        title="Land Donated"
        value={`${stats.landDonated} Decimals`}
        icon={<MapPin className="w-6 h-6" />}
        color="amber"
        delay={0.2}
      />
      <StatCard
        title="Pending"
        value={stats.pendingContributions}
        icon={<Clock className="w-6 h-6" />}
        color="red"
        delay={0.3}
      />
    </div>
  );
}
