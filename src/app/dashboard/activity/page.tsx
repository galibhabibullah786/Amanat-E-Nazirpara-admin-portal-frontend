'use client';

import { useState, useEffect } from 'react';
import { Activity, Filter, Download, Search, ChevronRight, User, DollarSign, Image, Users, Settings, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Avatar, Select } from '@/components/ui';
import { activityApi } from '@/lib/api';
import { getRelativeTime, formatDateTime } from '@/lib/utils';
import type { ActivityLog } from '@/lib/types';

const typeIcons: Record<string, React.ElementType> = {
  contribution: DollarSign,
  committee: Users,
  gallery: Image,
  settings: Settings,
  user: User,
  delete: Trash2,
};

const typeColors: Record<string, string> = {
  contribution: 'bg-emerald-100 text-emerald-600',
  committee: 'bg-blue-100 text-blue-600',
  gallery: 'bg-purple-100 text-purple-600',
  settings: 'bg-gray-100 text-gray-600',
  user: 'bg-amber-100 text-amber-600',
  delete: 'bg-red-100 text-red-600',
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  // Fetch activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activityApi.getAll({ limit: 100 });
        setActivities((response as { data: ActivityLog[] }).data || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.action.toLowerCase().includes(search.toLowerCase()) ||
      activity.user.toLowerCase().includes(search.toLowerCase()) ||
      activity.details?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityLog[]>);

  const activityTypes = [...new Set(activities.map((a) => a.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500 mt-1">Track all actions in the admin panel</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={activityTypes.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
            placeholder="All types"
            className="w-48"
          />
          {(search || typeFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setTypeFilter('');
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Activity List */}
      {Object.keys(groupedActivities).length === 0 ? (
        <Card className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No activity found</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">{date}</h3>
              <Card padding="none">
                <div className="divide-y divide-gray-100">
                  {dateActivities.map((activity, index) => {
                    const Icon = typeIcons[activity.type] || Activity;
                    const colorClass = typeColors[activity.type] || 'bg-gray-100 text-gray-600';

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setExpanded(expanded === activity.id ? null : activity.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-gray-900">{activity.action}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Avatar name={activity.user} size="xs" />
                                  <span className="text-sm text-gray-600">{activity.user}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-sm text-gray-500">{getRelativeTime(activity.timestamp)}</span>
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-5 h-5 text-gray-400 transition-transform ${expanded === activity.id ? 'rotate-90' : ''}`}
                              />
                            </div>

                            {expanded === activity.id && activity.details && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="mt-3 pt-3 border-t border-gray-100"
                              >
                                <p className="text-sm text-gray-600">{activity.details}</p>
                                <p className="text-xs text-gray-400 mt-2">{formatDateTime(activity.timestamp)}</p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
