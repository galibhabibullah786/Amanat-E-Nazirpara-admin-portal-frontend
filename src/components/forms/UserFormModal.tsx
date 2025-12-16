'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, Input, Select, Checkbox } from '@/components/ui';
import { USER_ROLES } from '@/lib/constants';
import type { AdminUser } from '@/lib/types';
import { useToast } from '@/lib/context';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: AdminUser | null;
  onSave: (data: Partial<AdminUser & { password?: string }>) => void;
}

type FormState = {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  isActive: boolean;
};

const initialState: FormState = {
  name: '',
  email: '',
  password: '',
  role: 'viewer',
  isActive: true,
};

export function UserFormModal({
  isOpen,
  onClose,
  user,
  onSave,
}: UserFormModalProps) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!user && !form.password) {
      newErrors.password = 'Password is required for new users';
    } else if (form.password && form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const data: Partial<AdminUser & { password?: string }> = {
        name: form.name,
        email: form.email,
        role: form.role,
        isActive: form.isActive,
      };
      if (form.password) {
        data.password = form.password;
      }
      onSave(data);
      addToast({
        type: 'success',
        title: user ? 'User updated' : 'User created',
        message: 'The user account has been saved successfully.',
      });
      onClose();
    } catch {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save user. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Create User'}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {user ? 'Update' : 'Create'} User
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

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
          required
        />

        <Input
          label={user ? 'New Password (leave blank to keep current)' : 'Password'}
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
          required={!user}
          helperText={user ? 'Leave blank to keep current password' : undefined}
        />

        <Select
          label="Role"
          value={form.role}
          onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as typeof form.role }))}
          options={USER_ROLES.map((r) => ({ value: r.value, label: r.label }))}
          required
        />

        <Checkbox
          label="Account is active"
          checked={form.isActive}
          onChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
        />
      </div>
    </Modal>
  );
}
