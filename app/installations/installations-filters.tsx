'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormEvent, useEffect, useState } from 'react';

export function InstallationsFilters({ searchParams }: { searchParams: { search?: string; status?: string } }) {
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.search || '');
  const [status, setStatus] = useState(searchParams.status || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const queryString = params.toString();
      router.push(`/installations${queryString ? `?${queryString}` : ''}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, router]);

  const statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'maintenance', label: 'Mantenimiento' },
  ];

  return (
    <>
      {/* Filters - Desktop */}
      <div className="hidden lg:flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por cliente, sitio o dirección..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Filters - Mobile */}
      <div className="lg:hidden flex flex-col gap-4 mb-6">
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>
    </>
  );
}
