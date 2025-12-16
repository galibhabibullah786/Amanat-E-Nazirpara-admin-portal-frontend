'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Badge, Avatar } from '@/components/ui';
import { ConfirmModal } from '@/components/ui/Modal';
import { CommitteeFormModal, MemberFormModal } from '@/components/forms';
import { mockCommittees, mockMembers } from '@/lib/mock-data';
import type { Committee, CommitteeMember } from '@/lib/types';
import { useToast } from '@/lib/context';

export default function CommitteesPage() {
  const [committees, setCommittees] = useState(mockCommittees);
  const [expandedCommittee, setExpandedCommittee] = useState<number | null>(4);
  const [committeeFormOpen, setCommitteeFormOpen] = useState(false);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<Committee | null>(null);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<number>(4);
  const [deleteCommitteeConfirm, setDeleteCommitteeConfirm] = useState<Committee | null>(null);
  const [deleteMemberConfirm, setDeleteMemberConfirm] = useState<CommitteeMember | null>(null);
  const { addToast } = useToast();

  const handleSaveCommittee = (data: Partial<Committee>) => {
    if (editingCommittee) {
      setCommittees((prev) =>
        prev.map((c) => (c.id === editingCommittee.id ? { ...c, ...data } : c))
      );
    } else {
      const newCommittee: Committee = {
        id: Math.max(...committees.map((c) => c.id)) + 1,
        name: data.name || '',
        term: data.term || '',
        description: data.description || '',
        image: data.image || '',
        type: data.type || 'past',
        members: [],
        isActive: data.isActive || false,
      };
      setCommittees((prev) => [...prev, newCommittee]);
    }
    setCommitteeFormOpen(false);
    setEditingCommittee(null);
  };

  const handleSaveMember = (data: Partial<CommitteeMember>) => {
    setCommittees((prev) =>
      prev.map((committee) => {
        if (committee.id === selectedCommitteeId) {
          if (editingMember) {
            return {
              ...committee,
              members: committee.members.map((m) =>
                m.id === editingMember.id ? { ...m, ...data } : m
              ),
            };
          } else {
            const newMember: CommitteeMember = {
              id: Math.max(0, ...committee.members.map((m) => m.id)) + 1,
              name: data.name || '',
              designation: data.designation || 'member',
              designationLabel: data.designationLabel || 'Executive Member',
              photo: data.photo || '',
              phone: data.phone,
              email: data.email,
              bio: data.bio,
              committeeId: selectedCommitteeId,
              order: data.order || committee.members.length + 1,
            };
            return { ...committee, members: [...committee.members, newMember] };
          }
        }
        return committee;
      })
    );
    setMemberFormOpen(false);
    setEditingMember(null);
  };

  const handleDeleteCommittee = () => {
    if (deleteCommitteeConfirm) {
      setCommittees((prev) => prev.filter((c) => c.id !== deleteCommitteeConfirm.id));
      addToast({ type: 'success', title: 'Committee deleted' });
      setDeleteCommitteeConfirm(null);
    }
  };

  const handleDeleteMember = () => {
    if (deleteMemberConfirm) {
      setCommittees((prev) =>
        prev.map((committee) => ({
          ...committee,
          members: committee.members.filter((m) => m.id !== deleteMemberConfirm.id),
        }))
      );
      addToast({ type: 'success', title: 'Member removed' });
      setDeleteMemberConfirm(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Committees</h1>
          <p className="text-gray-500 mt-1">Manage committee history and members</p>
        </div>
        <Button
          onClick={() => {
            setEditingCommittee(null);
            setCommitteeFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          Add Committee
        </Button>
      </div>

      {/* Committees List */}
      <div className="space-y-4">
        {committees.map((committee) => (
          <Card key={committee.id} padding="none" className="overflow-hidden">
            {/* Committee Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedCommittee(expandedCommittee === committee.id ? null : committee.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{committee.name}</h3>
                    <Badge variant={committee.type === 'current' ? 'success' : 'default'}>
                      {committee.type === 'current' ? 'Current' : 'Past'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{committee.term} • {committee.members.length} members</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCommittee(committee);
                    setCommitteeFormOpen(true);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteCommitteeConfirm(committee);
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedCommittee === committee.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            {/* Members Section */}
            <AnimatePresence>
              {expandedCommittee === committee.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-t border-gray-100"
                >
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Committee Members</h4>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCommitteeId(committee.id);
                          setEditingMember(null);
                          setMemberFormOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add Member
                      </Button>
                    </div>

                    {committee.members.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">No members added yet</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {committee.members
                          .sort((a, b) => a.order - b.order)
                          .map((member) => (
                            <div
                              key={member.id}
                              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <Avatar name={member.name} size="lg" />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-gray-900 truncate">{member.name}</h5>
                                  <p className="text-sm text-primary-600">{member.designationLabel}</p>
                                  {member.phone && (
                                    <p className="text-xs text-gray-500 mt-1">{member.phone}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedCommitteeId(committee.id);
                                      setEditingMember(member);
                                      setMemberFormOpen(true);
                                    }}
                                    className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteMemberConfirm(member)}
                                    className="p-1.5 rounded hover:bg-red-50 text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {/* Committee Form Modal */}
      <CommitteeFormModal
        isOpen={committeeFormOpen}
        onClose={() => {
          setCommitteeFormOpen(false);
          setEditingCommittee(null);
        }}
        committee={editingCommittee}
        onSave={handleSaveCommittee}
      />

      {/* Member Form Modal */}
      <MemberFormModal
        isOpen={memberFormOpen}
        onClose={() => {
          setMemberFormOpen(false);
          setEditingMember(null);
        }}
        member={editingMember}
        committeeId={selectedCommitteeId}
        onSave={handleSaveMember}
      />

      {/* Delete Committee Confirmation */}
      <ConfirmModal
        isOpen={!!deleteCommitteeConfirm}
        onClose={() => setDeleteCommitteeConfirm(null)}
        onConfirm={handleDeleteCommittee}
        title="Delete Committee"
        message={`Are you sure you want to delete "${deleteCommitteeConfirm?.name}"? All members will also be removed.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Delete Member Confirmation */}
      <ConfirmModal
        isOpen={!!deleteMemberConfirm}
        onClose={() => setDeleteMemberConfirm(null)}
        onConfirm={handleDeleteMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${deleteMemberConfirm?.name} from the committee?`}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}
