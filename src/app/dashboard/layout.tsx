'use client';

import { AdminProviders } from '@/lib/context';
import { DashboardLayout } from '@/components/layout';
import { ToastContainer } from '@/components/ui/Toast';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      <DashboardLayout>{children}</DashboardLayout>
      <ToastContainer />
    </AdminProviders>
  );
}
