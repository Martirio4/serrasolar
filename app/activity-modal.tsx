'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import { ticketRepository, installationRepository } from '@/data/repositories';
import type { Activity } from '@/domain/types';
import { translateStatus, translatePriority, translateType, translateSystemType } from '@/lib/translations';
import Link from 'next/link';

interface ActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityModal({ activity, isOpen, onClose }: ActivityModalProps) {
  const [entityData, setEntityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activity && isOpen) {
      setLoading(true);
      const fetchData = async () => {
        if (activity.entityType === 'ticket') {
          const ticket = await ticketRepository.getById(activity.entityId);
          setEntityData(ticket);
        } else if (activity.entityType === 'installation') {
          const installation = await installationRepository.getById(activity.entityId);
          setEntityData(installation);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [activity, isOpen]);

  if (!activity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Actividad"
      size="lg"
    >
      <div className="space-y-6">
        {/* Activity Info */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Actividad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Descripción</div>
              <div className="text-sm font-medium text-gray-900 mt-1">{activity.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Tipo</div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {activity.type === 'ticket_created' ? 'Ticket Creado' :
                   activity.type === 'ticket_updated' ? 'Ticket Actualizado' :
                   activity.type === 'installation_created' ? 'Instalación Creada' :
                   'Instalación Actualizada'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Fecha</div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {formatDateTime(activity.createdAt)}
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Usuario</div>
              <div className="text-sm font-medium text-gray-900 mt-1">{activity.userName}</div>
            </div>
          </CardContent>
        </Card>

        {/* Entity Details */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Cargando...</div>
        ) : entityData ? (
          <Card>
            <CardHeader>
              <CardTitle>
                {activity.entityType === 'ticket' ? 'Detalles del Ticket' : 'Detalles de la Instalación'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activity.entityType === 'ticket' ? (
                <>
                  <div>
                    <div className="text-sm text-gray-500">Título</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">{entityData.title}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Descripción</div>
                    <div className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{entityData.description}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Tipo</div>
                      <Badge variant="info" className="mt-1">{translateType(entityData.type)}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Prioridad</div>
                      <Badge
                        variant={
                          entityData.priority === 'urgent' || entityData.priority === 'high'
                            ? 'danger'
                            : entityData.priority === 'medium'
                            ? 'warning'
                            : 'default'
                        }
                        className="mt-1"
                      >
                        {translatePriority(entityData.priority)}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Estado</div>
                      <Badge
                        variant={
                          entityData.status === 'resolved'
                            ? 'success'
                            : entityData.status === 'in_progress'
                            ? 'warning'
                            : 'default'
                        }
                        className="mt-1"
                      >
                        {translateStatus(entityData.status)}
                      </Badge>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-sm text-gray-500">Cliente</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">{entityData.clientName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Sitio</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">{entityData.siteName}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Tipo de Sistema</div>
                      <Badge variant="info" className="mt-1">{translateSystemType(entityData.systemType)}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Estado</div>
                      <Badge
                        variant={
                          entityData.status === 'active'
                            ? 'success'
                            : entityData.status === 'maintenance'
                            ? 'warning'
                            : 'default'
                        }
                        className="mt-1"
                      >
                        {translateStatus(entityData.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href={`/installations/${entityData.id}`}
                      className="text-sm text-[#14B8A6] hover:underline"
                    >
                      Ver instalación completa →
                    </Link>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8 text-gray-500">No se encontró información</div>
        )}
      </div>
    </Modal>
  );
}
