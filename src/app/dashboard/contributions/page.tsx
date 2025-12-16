'use client';

import { useState, useEffect } from 'react';
import { Plus, Download, Filter, Search, MoreVertical, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Input, Select, Avatar } from '@/components/ui';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmModal } from '@/components/ui/Modal';
import { ContributionFormModal } from '@/components/forms';
import { contributionsApi } from '@/lib/api';
import { formatCurrency, formatDate, getStatusColor, getTypeColor } from '@/lib/utils';
import { CONTRIBUTION_TYPES, CONTRIBUTION_STATUS } from '@/lib/constants';
import type { Contribution } from '@/lib/types';
import { useToast } from '@/lib/context';

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Contribution | null>(null);
  const { addToast } = useToast();

  // Fetch contributions on mount
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await contributionsApi.getAll({ limit: 100 });
        setContributions((response as { data: Contribution[] }).data || []);
      } catch (error) {
        console.error('Failed to fetch contributions:', error);
        addToast({ type: 'error', title: 'Failed to load contributions' });
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, [addToast]);

  // Filter contributions
  const filteredContributions = contributions.filter((c) => {
    const matchesSearch = c.contributorName.toLowerCase().includes(search.toLowerCase()) ||
      c.purpose?.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || c.type === typeFilter;
    const matchesStatus = !statusFilter || c.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSave = (data: Partial<Contribution>) => {
    if (editingContribution) {
      setContributions((prev) =>
        prev.map((c) => (c.id === editingContribution.id ? { ...c, ...data } : c))
      );
    } else {
      const newContribution: Contribution = {
        id: Math.max(...contributions.map((c) => c.id)) + 1,
        contributorName: data.contributorName || '',
        type: data.type || 'Cash',
        amount: data.amount || 0,
        date: data.date || new Date().toISOString(),
        anonymous: data.anonymous || false,
        purpose: data.purpose,
        notes: data.notes,
        receiptNumber: data.receiptNumber,
        status: data.status || 'pending',
      };
      setContributions((prev) => [newContribution, ...prev]);
    }
    setFormOpen(false);
    setEditingContribution(null);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      setContributions((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
      addToast({ type: 'success', title: 'Contribution deleted' });
      setDeleteConfirm(null);
    }
  };

  const handleVerify = (contribution: Contribution) => {
    setContributions((prev) =>
      prev.map((c) => (c.id === contribution.id ? { ...c, status: 'verified' as const } : c))
    );
    addToast({ type: 'success', title: 'Contribution verified' });
  };

  const handleReject = (contribution: Contribution) => {
    setContributions((prev) =>
      prev.map((c) => (c.id === contribution.id ? { ...c, status: 'rejected' as const } : c))
    );
    addToast({ type: 'warning', title: 'Contribution rejected' });
  };

  const columns = [
    {
      key: 'contributorName',
      label: 'Contributor',
      sortable: true,
      render: (_: unknown, row: Contribution) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.anonymous ? '?' : row.contributorName} size="sm" />
          <div>
            <p className={`font-medium ${row.anonymous ? 'text-gray-400 italic' : 'text-gray-900'}`}>
              {row.anonymous ? 'Anonymous' : row.contributorName}
            </p>
            {row.purpose && <p className="text-xs text-gray-500">{row.purpose}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value: unknown) => (
        <Badge
          variant={
            value === 'Cash' ? 'success' : value === 'Land' ? 'warning' : 'info'
          }
        >
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value as number)}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: unknown) => <span className="text-gray-600">{formatDate(value as string)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: unknown) => (
        <Badge
          variant={
            value === 'verified' ? 'success' : value === 'pending' ? 'warning' : 'danger'
          }
        >
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (_: unknown, row: Contribution) => (
        <div className="flex items-center gap-1">
          {row.status === 'pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleVerify(row);
                }}
                className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600"
                title="Verify"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReject(row);
                }}
                className="p-1.5 rounded hover:bg-red-50 text-red-600"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingContribution(row);
              setFormOpen(true);
            }}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirm(row);
            }}
            className="p-1.5 rounded hover:bg-red-50 text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contributions</h1>
          <p className="text-gray-500 mt-1">Manage and track all contributions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditingContribution(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Contribution
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contributions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100"
          >
            <Select
              label="Type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={CONTRIBUTION_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              placeholder="All types"
            />
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={CONTRIBUTION_STATUS.map((s) => ({ value: s.value, label: s.label }))}
              placeholder="All statuses"
            />
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter('');
                  setStatusFilter('');
                  setSearch('');
                }}
              >
                Clear filters
              </Button>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Table */}
      <DataTable
        data={filteredContributions}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyMessage="No contributions found"
      />

      {/* Form Modal */}
      <ContributionFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingContribution(null);
        }}
        contribution={editingContribution}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Contribution"
        message={`Are you sure you want to delete this contribution from ${deleteConfirm?.contributorName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
