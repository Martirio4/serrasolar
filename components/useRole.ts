'use client';

import { getCurrentRole, hasPermission } from '@/lib/auth';
import { useEffect, useState } from 'react';
import type { UserRole } from '@/domain/types';

export function useRole() {
  const [role, setRole] = useState<UserRole>('admin');

  useEffect(() => {
    setRole(getCurrentRole());
  }, []);

  const can = (action: string) => hasPermission(role, action);

  return { role, can };
}
