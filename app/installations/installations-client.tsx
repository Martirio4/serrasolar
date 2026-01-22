'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { useRole } from '@/components/useRole';

export function InstallationsClient() {
  const router = useRouter();
  const { can } = useRole();

  return (
    <PageHeader
      title="Instalaciones"
      breadcrumb={['Instalaciones']}
      actionLabel={can('create') ? 'Nueva Instalación' : undefined}
      onAction={can('create') ? () => router.push('/installations/new') : undefined}
    />
  );
}
