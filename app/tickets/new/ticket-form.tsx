'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import type { Installation } from '@/domain/types';

export function TicketForm({ installations }: { installations: Installation[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const ticketData = {
      installationId: formData.get('installationId') as string,
      type: formData.get('type') as any,
      priority: formData.get('priority') as any,
      status: 'open' as const,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      assignedTechnicianId: null,
    };

    try {
      console.log('Creando ticket con datos:', ticketData);
      
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el ticket');
      }

      const ticket = await response.json();
      console.log('Ticket creado exitosamente:', ticket);
      
      // Forzar una recarga completa de la página para mostrar el nuevo ticket
      window.location.href = '/tickets';
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error al crear el ticket: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      setLoading(false);
    }
  };

  const installationOptions = [
    { value: '', label: 'Seleccionar instalación...' },
    ...installations.map((inst) => ({
      value: inst.id,
      label: `${inst.clientName} - ${inst.siteName}`,
    })),
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Información del Ticket</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select
            label="Instalación"
            name="installationId"
            options={installationOptions}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Tipo"
              name="type"
              options={[
                { value: 'maintenance', label: 'Mantenimiento' },
                { value: 'repair', label: 'Reparación' },
                { value: 'inspection', label: 'Inspección' },
                { value: 'installation', label: 'Instalación' },
                { value: 'other', label: 'Otro' },
              ]}
              required
            />

            <Select
              label="Prioridad"
              name="priority"
              options={[
                { value: 'low', label: 'Baja' },
                { value: 'medium', label: 'Media' },
                { value: 'high', label: 'Alta' },
                { value: 'urgent', label: 'Urgente' },
              ]}
              required
            />
          </div>

          <Input label="Título" name="title" required />

          <TextArea
            label="Descripción"
            name="description"
            rows={6}
            required
          />
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Ticket'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
