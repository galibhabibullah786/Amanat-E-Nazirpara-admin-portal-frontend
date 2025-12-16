'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Select, Textarea } from '@/components/ui';
import { DESIGNATIONS } from '@/lib/constants';
import type { CommitteeMember } from '@/lib/types';
import { useToast } from '@/lib/context';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: CommitteeMember | null;
  committeeId: number;
  onSave: (data: Partial<CommitteeMember>) => void;
}

type FormState = {
  name: string;
  designation: 'president' | 'vice-president' | 'secretary' | 'treasurer' | 'member';
  designationLabel: string;
  photo: string;
  phone: string;
  email: string;
  bio: string;
  order: number;
};

const initialState: FormState = {
  name: '',
  designation: 'member',
  designationLabel: 'Executive Member',
  photo: '',
  phone: '',
  email: '',
  bio: '',
  order: 1,
};

export function MemberFormModal({
  isOpen,
  onClose,
  member,
  committeeId,
  onSave,
}: MemberFormModalProps) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        designation: member.designation,
        designationLabel: member.designationLabel,
        photo: member.photo,
        phone: member.phone || '',
        email: member.email || '',
        bio: member.bio || '',
        order: member.order,
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [member, isOpen]);

  const handleDesignationChange = (value: string) => {
    const designation = DESIGNATIONS.find((d) => d.value === value);
    setForm((f) => ({
      ...f,
      designation: value as typeof f.designation,
      designationLabel: designation?.label || 'Executive Member',
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSave({ ...form, committeeId });
      addToast({
        type: 'success',
        title: member ? 'Member updated' : 'Member added',
        message: 'The committee member has been saved successfully.',
      });
      onClose();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save member. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Edit Committee Member' : 'Add Committee Member'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {member ? 'Update' : 'Add'} Member
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Designation"
            value={form.designation}
            onChange={(e) => handleDesignationChange(e.target.value)}
            options={DESIGNATIONS.map((d) => ({ value: d.value, label: d.label }))}
            required
          />
          <Input
            label="Display Order"
            type="number"
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            min={1}
          />
        </div>

        <Input
          label="Photo URL"
          value={form.photo}
          onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
          placeholder="/images/members/name.jpg"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+880 1XXX-XXXXXX"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={errors.email}
            placeholder="email@example.com"
          />
        </div>

        <Textarea
          label="Bio"
          value={form.bio}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          placeholder="Brief biography..."
        />
      </div>
    </Modal>
  );
}
