'use client';

import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { useEffect, useState } from 'react';

export function TicketsFilters({ searchParams }: { searchParams: { status?: string; priority?: string; type?: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState(searchParams.status || '');
  const [priority, setPriority] = useState(searchParams.priority || '');
  const [type, setType] = useState(searchParams.type || '');

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (priority) params.set('priority', priority);
    if (type) params.set('type', type);
    const queryString = params.toString();
    router.push(`/tickets${queryString ? `?${queryString}` : ''}`);
  }, [status, priority, type, router]);

  const statusOptions = [
    { value: '', label: 'Todos los Estados' },
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' },
  ];

  const priorityOptions = [
    { value: '', label: 'Todas las Prioridades' },
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' },
  ];

  const typeOptions = [
    { value: '', label: 'Todos los Tipos' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'repair', label: 'Reparación' },
    { value: 'inspection', label: 'Inspección' },
    { value: 'installation', label: 'Instalación' },
    { value: 'other', label: 'Otro' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Select
        options={statusOptions}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Select
        options={priorityOptions}
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      />
      <Select
        options={typeOptions}
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
    </div>
  );
}
