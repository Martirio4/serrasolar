// Repository interfaces - these will be replaced with Firebase implementations later

import type { Installation, Ticket, Technician, Activity } from './types';

export interface InstallationRepository {
  getAll(): Promise<Installation[]>;
  getById(id: string): Promise<Installation | null>;
  getByTechnicianId(technicianId: string): Promise<Installation[]>;
  create(data: Omit<Installation, 'id'>): Promise<Installation>;
  update(id: string, data: Partial<Installation>): Promise<Installation>;
  search(query: string): Promise<Installation[]>;
}

export interface TicketRepository {
  getAll(): Promise<Ticket[]>;
  getById(id: string): Promise<Ticket | null>;
  getByInstallationId(installationId: string): Promise<Ticket[]>;
  getByTechnicianId(technicianId: string): Promise<Ticket[]>;
  create(data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'internalNotes' | 'partsUsed'>): Promise<Ticket>;
  update(id: string, data: Partial<Ticket>): Promise<Ticket>;
  addNote(ticketId: string, note: Ticket['internalNotes'][0]): Promise<Ticket>;
  addPart(ticketId: string, part: Ticket['partsUsed'][0]): Promise<Ticket>;
}

export interface TechnicianRepository {
  getAll(): Promise<Technician[]>;
  getById(id: string): Promise<Technician | null>;
  getActive(): Promise<Technician[]>;
}

export interface ActivityRepository {
  getRecent(limit?: number): Promise<Activity[]>;
  getByEntityId(entityId: string, entityType: 'ticket' | 'installation'): Promise<Activity[]>;
  create(activity: Omit<Activity, 'id'>): Promise<Activity>;
}
