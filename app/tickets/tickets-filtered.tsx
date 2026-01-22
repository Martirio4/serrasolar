'use client';

import { useRole } from '@/components/useRole';
import { useMemo } from 'react';
import type { Ticket } from '@/domain/types';

export function useFilteredTickets(tickets: Ticket[]) {
  const { role } = useRole();

  return useMemo(() => {
    if (role === 'technician') {
      // Technicians only see their assigned tickets
      // For demo, we'll use tech-1 as the current technician
      // In a real app, this would come from auth
      return tickets.filter((t) => t.assignedTechnicianId === 'tech-1');
    }
    return tickets;
  }, [tickets, role]);
}
