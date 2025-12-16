'use client';

import { useState } from 'react';
import { Plus, Download, Edit, Trash2, MapPin, Ruler, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Avatar } from '@/components/ui';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmModal } from '@/components/ui/Modal';
import { LandDonorFormModal } from '@/components/forms';
import { mockLandDonors } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import type { LandDonor } from '@/lib/types';
import { useToast } from '@/lib/context';

export default function LandDonorsPage() {
  const [donors, setDonors] = useState(mockLandDonors);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<LandDonor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LandDonor | null>(null);
  const { addToast } = useToast();

  // Calculate stats
  const totalLand = donors.reduce((sum, d) => sum + d.landAmount, 0);
  const verifiedDonors = donors.filter((d) => d.verified).length;

  const handleSave = (data: Partial<LandDonor>) => {
    if (editingDonor) {
      setDonors((prev) =>
        prev.map((d) => (d.id === editingDonor.id ? { ...d, ...data } : d))
      );
    } else {
      const newDonor: LandDonor = {
        id: Math.max(...donors.map((d) => d.id)) + 1,
        name: data.name || '',
        landAmount: data.landAmount || 0,
        landType: data.landType || 'Agricultural',
        location: data.location || '',
        date: data.date || new Date().toISOString(),
        notes: data.notes,
        verified: data.verified || false,
        documentNumber: data.documentNumber,
      };
      setDonors((prev) => [newDonor, ...prev]);
    }
    setFormOpen(false);
    setEditingDonor(null);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      setDonors((prev) => prev.filter((d) => d.id !== deleteConfirm.id));
      addToast({ type: 'success', title: 'Land donor deleted' });
      setDeleteConfirm(null);
    }
  };

  const toggleVerified = (donor: LandDonor) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === donor.id ? { ...d, verified: !d.verified } : d))
    );
    addToast({
      type: 'success',
      title: donor.verified ? 'Verification removed' : 'Donor verified',
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Donor',
      sortable: true,
      render: (_: unknown, row: LandDonor) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            {row.documentNumber && (
              <p className="text-xs text-gray-500">Doc: {row.documentNumber}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'landAmount',
      label: 'Land Amount',
      sortable: true,
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-900">{String(value)} decimal</span>
        </div>
      ),
    },
    {
      key: 'landType',
      label: 'Type',
      sortable: true,
      render: (value: unknown) => (
        <Badge variant={value === 'Agricultural' ? 'success' : 'info'}>
          {value as string}
        </Badge>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: unknown) => (
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate max-w-[200px]">{value as string}</span>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Donation Date',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-gray-600">{formatDate(value as string)}</span>
      ),
    },
    {
      key: 'verified',
      label: 'Status',
      sortable: true,
      render: (value: unknown, row: LandDonor) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleVerified(row);
          }}
          className="focus:outline-none"
        >
          <Badge variant={value ? 'success' : 'warning'}>
            {value ? 'Verified' : 'Pending'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-20',
      render: (_: unknown, row: LandDonor) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingDonor(row);
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
          <h1 className="text-2xl font-bold text-gray-900">Land Donors</h1>
          <p className="text-gray-500 mt-1">Manage land donation records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditingDonor(null);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Donor
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{donors.length}</p>
              <p className="text-sm text-gray-600">Total Donors</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalLand.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Decimals</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{verifiedDonors}</p>
              <p className="text-sm text-gray-600">Verified Records</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        data={donors}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyMessage="No land donors found"
      />

      {/* Form Modal */}
      <LandDonorFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingDonor(null);
        }}
        donor={editingDonor}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Land Donor"
        message={`Are you sure you want to delete ${deleteConfirm?.name}'s donation record? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
