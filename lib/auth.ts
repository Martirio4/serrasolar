// Mock authentication - uses localStorage
// TODO: Replace with Firebase Auth

import type { UserRole } from '@/domain/types';

const STORAGE_KEY = 'solar-service-role';

export function getCurrentRole(): UserRole {
  if (typeof window === 'undefined') return 'admin';
  const stored = localStorage.getItem(STORAGE_KEY);
  return (stored as UserRole) || 'admin';
}

export function setCurrentRole(role: UserRole) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, role);
}

export function hasPermission(role: UserRole, action: string): boolean {
  // Permission checks
  if (role === 'admin') return true;

  if (role === 'dispatcher') {
    return ['view', 'create', 'update', 'assign'].includes(action);
  }

  if (role === 'technician') {
    return ['view', 'update_status'].includes(action);
  }

  return false;
}
