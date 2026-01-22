'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { FormEvent } from 'react';
import { useRole } from '@/components/useRole';

export function InstallationsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { can } = useRole();

  const handleFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const status = formData.get('status') as string;

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    router.push(`/installations?${params.toString()}`);
  };

  return (
    <PageHeader
      title="Instalaciones"
      breadcrumb={['Instalaciones']}
      actionLabel={can('create') ? 'Nueva Instalación' : undefined}
      onAction={can('create') ? () => router.push('/installations/new') : undefined}
    />
  );
}
