'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRole } from '@/components/useRole';

export function DashboardClient() {
  const router = useRouter();
  const { can } = useRole();

  return (
    <PageHeader
      title="Inicio"
      actionLabel={can('create') ? 'Crear Ticket' : undefined}
      onAction={can('create') ? () => router.push('/tickets/new') : undefined}
    />
  );
}
