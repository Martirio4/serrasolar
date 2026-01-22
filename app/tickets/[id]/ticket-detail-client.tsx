'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ticketRepository } from '@/data/repositories';
import type { Ticket, TicketStatus } from '@/domain/types';
import { useRole } from '@/components/useRole';

export function TicketDetailClient({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const { can } = useRole();
  const [status, setStatus] = useState(ticket.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await ticketRepository.update(ticket.id, {
        status: newStatus as TicketStatus,
        resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : ticket.resolvedAt,
      });
      setStatus(newStatus as TicketStatus);
      router.refresh();
      // Dispatch event to refresh modal if open
      window.dispatchEvent(new Event('ticket-updated'));
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Error al actualizar el estado del ticket');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: Array<{ value: string; label: string }> = [
    { value: 'open', label: 'Abierto' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resuelto' },
    { value: 'closed', label: 'Cerrado' },
  ];

  if (!can('update_status')) {
    return null;
  }

  return (
    <Select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      options={statusOptions}
      disabled={loading}
      className="w-40"
    />
  );
}
