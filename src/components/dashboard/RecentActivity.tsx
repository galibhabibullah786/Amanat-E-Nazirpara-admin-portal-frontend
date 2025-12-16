'use client';

import { motion } from 'framer-motion';
import { Card, Avatar, Badge } from '@/components/ui';
import { getRelativeTime } from '@/lib/utils';
import type { ActivityLog, Contribution } from '@/lib/types';
import { formatCurrency, getStatusColor, getTypeColor } from '@/lib/utils';

interface RecentActivityProps {
  activities: ActivityLog[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return '💰';
      case 'committee':
        return '👥';
      case 'gallery':
        return '🖼️';
      case 'land_donor':
        return '🏞️';
      case 'settings':
        return '⚙️';
      default:
        return '📝';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all
          </button>
        </div>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity, i) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.details}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">by {activity.user}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">
                    {activity.timestamp ? getRelativeTime(activity.timestamp) : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

interface RecentContributionsProps {
  contributions: Contribution[];
}

export function RecentContributions({ contributions }: RecentContributionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Contributions</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Contributor</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contributions.slice(0, 5).map((contribution) => (
                <tr key={contribution.id} className="text-sm">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={contribution.anonymous ? '?' : contribution.contributorName}
                        size="sm"
                      />
                      <span className={contribution.anonymous ? 'text-gray-400 italic' : 'text-gray-900'}>
                        {contribution.anonymous ? 'Anonymous' : contribution.contributorName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        contribution.type === 'Cash'
                          ? 'success'
                          : contribution.type === 'Land'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {contribution.type}
                    </Badge>
                  </td>
                  <td className="py-3 font-medium text-gray-900">
                    {formatCurrency(contribution.amount)}
                  </td>
                  <td className="py-3">
                    <Badge
                      variant={
                        contribution.status === 'verified'
                          ? 'success'
                          : contribution.status === 'pending'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {contribution.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
