// Domain types and business rules

export type UserRole = 'admin' | 'dispatcher' | 'technician';

export type InstallationStatus = 'active' | 'inactive' | 'maintenance';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketType = 'maintenance' | 'repair' | 'inspection' | 'installation' | 'other';

export type SystemType = 'on-grid' | 'off-grid' | 'hybrid';

export interface Panel {
  brand: string;
  model: string;
  wattage: number;
  qty: number;
}

export interface Inverter {
  brand: string;
  model: string;
  serial: string;
}

export interface Installation {
  id: string;
  companyId: string;
  clientName: string;
  siteName: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  systemType: SystemType;
  panels: Panel[];
  inverter: Inverter;
  installedAt: string; // ISO date string
  status: InstallationStatus;
  assignedTechnicianId: string | null;
}

export interface Ticket {
  id: string;
  installationId: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  title: string;
  description: string;
  assignedTechnicianId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  resolvedAt: string | null;
  internalNotes: Array<{
    id: string;
    authorId: string;
    content: string;
    createdAt: string;
  }>;
  partsUsed: Array<{
    id: string;
    name: string;
    qty: number;
    cost: number;
  }>;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  active: boolean;
}

export interface Activity {
  id: string;
  type: 'ticket_created' | 'ticket_updated' | 'installation_created' | 'installation_updated';
  entityId: string;
  entityType: 'ticket' | 'installation';
  description: string;
  userId: string;
  userName: string;
  createdAt: string;
}
