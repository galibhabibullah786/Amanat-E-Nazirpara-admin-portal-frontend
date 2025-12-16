'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Select, Textarea, Checkbox } from '@/components/ui';
import type { LandDonor } from '@/lib/types';
import { useToast } from '@/lib/context';

interface LandDonorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor?: LandDonor | null;
  onSave: (data: Partial<LandDonor>) => void;
}

type FormState = {
  name: string;
  landAmount: number;
  landType: 'Agricultural' | 'Residential';
  location: string;
  quote: string;
  date: string;
  documentNumber: string;
  notes: string;
  verified: boolean;
  photo: string;
};

const initialState: FormState = {
  name: '',
  landAmount: 0,
  landType: 'Agricultural',
  location: '',
  quote: '',
  date: new Date().toISOString().split('T')[0],
  documentNumber: '',
  notes: '',
  verified: false,
  photo: '',
};

export function LandDonorFormModal({
  isOpen,
  onClose,
  donor,
  onSave,
}: LandDonorFormModalProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (donor) {
      setForm({
        name: donor.name,
        landAmount: donor.landAmount,
        landType: donor.landType,
        location: donor.location || '',
        quote: donor.quote || '',
        date: donor.date,
        documentNumber: donor.documentNumber || '',
        notes: donor.notes || '',
        verified: donor.verified,
        photo: donor.photo || '',
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [donor, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Donor name is required';
    }
    if (form.landAmount <= 0) {
      newErrors.landAmount = 'Land amount must be greater than 0';
    }
    if (!form.date) {
      newErrors.date = 'Donation date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSave(form);
      addToast({
        type: 'success',
        title: donor ? 'Land donor updated' : 'Land donor added',
        message: 'The land donor record has been saved successfully.',
      });
      onClose();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save record. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={donor ? 'Edit Land Donor' : 'Add Land Donor'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {donor ? 'Update' : 'Add'} Land Donor
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Donor Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
          placeholder="Full name of the donor"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Land Amount (Decimals)"
            type="number"
            value={form.landAmount}
            onChange={(e) => setForm((f) => ({ ...f, landAmount: parseFloat(e.target.value) || 0 }))}
            error={errors.landAmount}
            placeholder="e.g., 5"
            required
          />
          <Select
            label="Land Type"
            value={form.landType}
            onChange={(e) => setForm((f) => ({ ...f, landType: e.target.value as 'Agricultural' | 'Residential' }))}
            options={[
              { value: 'Agricultural', label: 'Agricultural' },
              { value: 'Residential', label: 'Residential' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Location"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="e.g., Plot A, Nazirpara"
          />
          <Input
            label="Donation Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            error={errors.date}
            required
          />
        </div>

        <Input
          label="Document Number"
          value={form.documentNumber}
          onChange={(e) => setForm((f) => ({ ...f, documentNumber: e.target.value }))}
          placeholder="e.g., DOC-2024-001"
        />

        <Input
          label="Photo URL"
          value={form.photo}
          onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
          placeholder="/images/donors/name.jpg"
        />

        <Textarea
          label="Quote"
          value={form.quote}
          onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
          placeholder="Donor's message or motivation for the donation..."
        />

        <Checkbox
          label="Mark as verified"
          checked={form.verified}
          onChange={(checked) => setForm((f) => ({ ...f, verified: checked }))}
        />
      </div>
    </Modal>
  );
}
