'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Shield, ShieldCheck, ShieldX, Search, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Avatar, Input } from '@/components/ui';
import { ConfirmModal } from '@/components/ui/Modal';
import { UserFormModal } from '@/components/forms';
import { mockUsers } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';
import type { AdminUser } from '@/lib/types';
import { useToast, useAuth } from '@/lib/context';

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<AdminUser | null>(null);
  const { addToast } = useToast();
  const { user: currentUser } = useAuth();

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Partial<AdminUser>) => {
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u))
      );
      addToast({ type: 'success', title: 'User updated successfully' });
    } else {
      const newUser: AdminUser = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'viewer',
        avatar: data.avatar,
        phone: data.phone,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
        lastLogin: undefined,
      };
      setUsers((prev) => [newUser, ...prev]);
      addToast({ type: 'success', title: 'User created successfully' });
    }
    setFormOpen(false);
    setEditingUser(null);
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      if (deleteConfirm.id === currentUser?.id) {
        addToast({ type: 'error', title: "You can't delete yourself" });
        setDeleteConfirm(null);
        return;
      }
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
      addToast({ type: 'success', title: 'User deleted' });
      setDeleteConfirm(null);
    }
  };

  const toggleStatus = (user: AdminUser) => {
    if (user.id === currentUser?.id) {
      addToast({ type: 'error', title: "You can't deactivate yourself" });
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
    );
    addToast({
      type: 'success',
      title: user.isActive ? 'User deactivated' : 'User activated',
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'editor':
        return <Shield className="w-4 h-4" />;
      default:
        return <ShieldX className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'danger';
      case 'admin':
        return 'warning';
      case 'editor':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      default:
        return 'Viewer';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">Manage admin users and permissions</p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </Card>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No users found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className={`relative ${!user.isActive ? 'opacity-60' : ''}`}>
                {user.id === currentUser?.id && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="info" size="sm">You</Badge>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <Avatar name={user.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getRoleColor(user.role) as 'default' | 'success' | 'danger' | 'warning' | 'info'} size="sm">
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{getRoleLabel(user.role)}</span>
                      </Badge>
                      {!user.isActive && (
                        <Badge variant="danger" size="sm">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>

                {user.lastLogin && (
                  <p className="text-xs text-gray-500 mt-3">
                    Last login: {formatDateTime(user.lastLogin)}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleStatus(user)}
                    disabled={user.id === currentUser?.id}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setFormOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(user)}
                    disabled={user.id === currentUser?.id}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <UserFormModal
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? They will no longer have access to the admin panel.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
