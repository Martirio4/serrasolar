'use client';

import { getCurrentRole, setCurrentRole } from '@/lib/auth';
import type { UserRole } from '@/domain/types';
import { Select } from '@/components/ui/Select';
import { useEffect, useState } from 'react';
import { SunIcon } from '@heroicons/react/24/outline';

export function TopBar() {
  const [role, setRole] = useState<UserRole>('admin');

  useEffect(() => {
    setRole(getCurrentRole());
  }, []);

  const handleRoleChange = (newRole: string) => {
    const roleValue = newRole as UserRole;
    setCurrentRole(roleValue);
    setRole(roleValue);
    // Trigger a re-render by reloading (simple approach for demo)
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <SunIcon className="h-12 w-12 text-[#14B8A6]" />
            <h1 className="text-xl font-semibold text-gray-900">Gestor de Servicios Solares</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Acceso Demo:</span>
              <Select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                options={[
                  { value: 'admin', label: 'Administrador' },
                  { value: 'dispatcher', label: 'Despachador' },
                  { value: 'technician', label: 'Técnico' },
                ]}
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
