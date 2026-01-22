// Spanish translations for Argentina

export const translations = {
  status: {
    active: 'Activo',
    inactive: 'Inactivo',
    maintenance: 'Mantenimiento',
    open: 'Abierto',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado',
  },
  priority: {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    urgent: 'Urgente',
  },
  type: {
    maintenance: 'Mantenimiento',
    repair: 'Reparación',
    inspection: 'Inspección',
    installation: 'Instalación',
    other: 'Otro',
  },
  systemType: {
    'on-grid': 'Conectado a Red',
    'off-grid': 'Aislado',
    'hybrid': 'Híbrido',
  },
};

export function translateStatus(status: string): string {
  return translations.status[status as keyof typeof translations.status] || status;
}

export function translatePriority(priority: string): string {
  return translations.priority[priority as keyof typeof translations.priority] || priority;
}

export function translateType(type: string): string {
  return translations.type[type as keyof typeof translations.type] || type;
}

export function translateSystemType(systemType: string): string {
  return translations.systemType[systemType as keyof typeof translations.systemType] || systemType;
}
