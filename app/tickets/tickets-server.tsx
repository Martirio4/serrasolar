import { ticketRepository } from '@/data/repositories';

export async function getFilteredTickets(searchParams: {
  status?: string;
  priority?: string;
  type?: string;
  installationId?: string;
  technicianId?: string;
}) {
  let tickets = await ticketRepository.getAll();

  if (searchParams.status) {
    tickets = tickets.filter((t) => t.status === searchParams.status);
  }

  if (searchParams.priority) {
    tickets = tickets.filter((t) => t.priority === searchParams.priority);
  }

  if (searchParams.type) {
    tickets = tickets.filter((t) => t.type === searchParams.type);
  }

  if (searchParams.installationId) {
    tickets = tickets.filter((t) => t.installationId === searchParams.installationId);
  }

  if (searchParams.technicianId) {
    tickets = tickets.filter((t) => t.assignedTechnicianId === searchParams.technicianId);
  }

  return tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
