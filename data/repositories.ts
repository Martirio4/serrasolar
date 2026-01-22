// Mock repository implementations
// TODO: Replace with Firebase implementations

import type {
  InstallationRepository,
  TicketRepository,
  TechnicianRepository,
  ActivityRepository,
} from '@/domain/repositories';
import type { Installation, Ticket, Technician, Activity } from '@/domain/types';
import { seedInstallations, seedTickets, seedTechnicians } from './seed';

// In-memory storage (will be replaced with Firebase)
let installations: Installation[] = [...seedInstallations];
let tickets: Ticket[] = [...seedTickets];
let technicians: Technician[] = [...seedTechnicians];
let activities: Activity[] = [];

// Generate activities from existing tickets
tickets.forEach((ticket) => {
  activities.push({
    id: `act-${ticket.id}`,
    type: 'ticket_created',
    entityId: ticket.id,
    entityType: 'ticket',
    description: `Ticket "${ticket.title}" creado`,
    userId: ticket.assignedTechnicianId || 'system',
    userName: ticket.assignedTechnicianId
      ? technicians.find((t) => t.id === ticket.assignedTechnicianId)?.name || 'Desconocido'
      : 'Sistema',
    createdAt: ticket.createdAt,
  });

  if (ticket.updatedAt !== ticket.createdAt) {
    activities.push({
      id: `act-${ticket.id}-update`,
      type: 'ticket_updated',
      entityId: ticket.id,
      entityType: 'ticket',
      description: `Ticket "${ticket.title}" actualizado`,
      userId: ticket.assignedTechnicianId || 'system',
      userName: ticket.assignedTechnicianId
        ? technicians.find((t) => t.id === ticket.assignedTechnicianId)?.name || 'Desconocido'
        : 'Sistema',
      createdAt: ticket.updatedAt,
    });
  }
});

// Generate activities from installations
installations.forEach((installation) => {
  activities.push({
    id: `act-inst-${installation.id}`,
    type: 'installation_created',
    entityId: installation.id,
    entityType: 'installation',
    description: `Instalación "${installation.siteName}" creada`,
    userId: installation.assignedTechnicianId || 'system',
    userName: installation.assignedTechnicianId
      ? technicians.find((t) => t.id === installation.assignedTechnicianId)?.name || 'Desconocido'
      : 'Sistema',
    createdAt: installation.installedAt,
  });
});

export const installationRepository: InstallationRepository = {
  async getAll() {
    return [...installations];
  },

  async getById(id: string) {
    return installations.find((inst) => inst.id === id) || null;
  },

  async getByTechnicianId(technicianId: string) {
    return installations.filter((inst) => inst.assignedTechnicianId === technicianId);
  },

  async create(data) {
    const newInstallation: Installation = {
      ...data,
      id: `inst-${Date.now()}`,
    };
    installations.push(newInstallation);
    return newInstallation;
  },

  async update(id: string, data: Partial<Installation>) {
    const index = installations.findIndex((inst) => inst.id === id);
    if (index === -1) throw new Error('Installation not found');
    installations[index] = { ...installations[index], ...data };
    return installations[index];
  },

  async search(query: string) {
    const lowerQuery = query.toLowerCase();
    return installations.filter(
      (inst) =>
        inst.clientName.toLowerCase().includes(lowerQuery) ||
        inst.siteName.toLowerCase().includes(lowerQuery) ||
        inst.address.toLowerCase().includes(lowerQuery) ||
        inst.city.toLowerCase().includes(lowerQuery)
    );
  },
};

export const ticketRepository: TicketRepository = {
  async getAll() {
    return [...tickets];
  },

  async getById(id: string) {
    return tickets.find((ticket) => ticket.id === id) || null;
  },

  async getByInstallationId(installationId: string) {
    return tickets.filter((ticket) => ticket.installationId === installationId);
  },

  async getByTechnicianId(technicianId: string) {
    return tickets.filter((ticket) => ticket.assignedTechnicianId === technicianId);
  },

  async create(data) {
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      ...data,
      id: `ticket-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      internalNotes: [],
      partsUsed: [],
    };
    tickets.push(newTicket);
    return newTicket;
  },

  async update(id: string, data: Partial<Ticket>) {
    const index = tickets.findIndex((ticket) => ticket.id === id);
    if (index === -1) throw new Error('Ticket not found');
    tickets[index] = {
      ...tickets[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return tickets[index];
  },

  async addNote(ticketId: string, note: Ticket['internalNotes'][0]) {
    const ticket = await this.getById(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    ticket.internalNotes.push(note);
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  },

  async addPart(ticketId: string, part: Ticket['partsUsed'][0]) {
    const ticket = await this.getById(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    ticket.partsUsed.push(part);
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  },
};

export const technicianRepository: TechnicianRepository = {
  async getAll() {
    return [...technicians];
  },

  async getById(id: string) {
    return technicians.find((tech) => tech.id === id) || null;
  },

  async getActive() {
    return technicians.filter((tech) => tech.active);
  },
};

export const activityRepository: ActivityRepository = {
  async getRecent(limit = 20) {
    return [...activities]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  async getByEntityId(entityId: string, entityType: 'ticket' | 'installation') {
    return activities.filter(
      (act) => act.entityId === entityId && act.entityType === entityType
    );
  },

  async create(activity: Omit<Activity, 'id'>) {
    const newActivity: Activity = {
      ...activity,
      id: `act-${Date.now()}`,
    };
    activities.push(newActivity);
    return newActivity;
  },
};
