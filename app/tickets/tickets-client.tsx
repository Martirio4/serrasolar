'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRole } from '@/components/useRole';

export function TicketsClient() {
  const router = useRouter();
  const { can } = useRole();

  return (
    <PageHeader
      title="Tickets"
      breadcrumb={['Tickets']}
      actionLabel={can('create') ? 'Nuevo Ticket' : undefined}
      onAction={can('create') ? () => router.push('/tickets/new') : undefined}
    />
  );
}
