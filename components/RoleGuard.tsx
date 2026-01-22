'use client';

import { getCurrentRole, hasPermission } from '@/lib/auth';
import type { UserRole } from '@/domain/types';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  action: string;
  fallback?: ReactNode;
}

export function RoleGuard({ children, action, fallback = null }: RoleGuardProps) {
  const role = getCurrentRole();
  
  if (!hasPermission(role, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
