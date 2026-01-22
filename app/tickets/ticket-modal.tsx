'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import { ticketRepository, installationRepository, technicianRepository } from '@/data/repositories';
import type { Ticket } from '@/domain/types';
import { translateStatus, translatePriority, translateType } from '@/lib/translations';
import Link from 'next/link';
import { TicketDetailClient } from './[id]/ticket-detail-client';

interface TicketModalProps {
  ticketId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketModal({ ticketId, isOpen, onClose }: TicketModalProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [installation, setInstallation] = useState<any>(null);
  const [technician, setTechnician] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchTicketData = async () => {
    if (!ticketId) return;
    setLoading(true);
    const ticketData = await ticketRepository.getById(ticketId);
    if (ticketData) {
      setTicket(ticketData);
      
      const installationData = await installationRepository.getById(ticketData.installationId);
      setInstallation(installationData);

      if (ticketData.assignedTechnicianId) {
        const technicianData = await technicianRepository.getById(ticketData.assignedTechnicianId);
        setTechnician(technicianData);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (ticketId && isOpen) {
      fetchTicketData();
    }
  }, [ticketId, isOpen]);

  // Expose refresh function for TicketDetailClient
  useEffect(() => {
    if (ticket && isOpen) {
      // Refresh when ticket status might have changed
      const handleRefresh = () => {
        fetchTicketData();
      };
      window.addEventListener('ticket-updated', handleRefresh);
      return () => window.removeEventListener('ticket-updated', handleRefresh);
    }
  }, [ticket, isOpen]);

  if (!ticketId || !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={loading ? 'Cargando...' : ticket?.title || 'Detalles del Ticket'}
      size="xl"
    >
      {loading ? (
        <div className="text-center py-12 text-gray-500">Cargando...</div>
      ) : ticket ? (
        <div className="space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información</CardTitle>
                <TicketDetailClient ticket={ticket} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Tipo</div>
                  <Badge variant="info" className="mt-1">{translateType(ticket.type)}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Prioridad</div>
                  <Badge
                    variant={
                      ticket.priority === 'urgent' || ticket.priority === 'high'
                        ? 'danger'
                        : ticket.priority === 'medium'
                        ? 'warning'
                        : 'default'
                    }
                    className="mt-1"
                  >
                    {translatePriority(ticket.priority)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <Badge
                    variant={
                      ticket.status === 'resolved'
                        ? 'success'
                        : ticket.status === 'in_progress'
                        ? 'warning'
                        : 'default'
                    }
                    className="mt-1"
                  >
                    {translateStatus(ticket.status)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Creado</div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {formatDateTime(ticket.createdAt)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">Descripción</div>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {installation && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Instalación</div>
                  <Link
                    href={`/installations/${installation.id}`}
                    className="text-sm text-[#14B8A6] hover:underline font-medium"
                    onClick={() => onClose()}
                  >
                    {installation.clientName} - {installation.siteName} →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                    <div className="w-px h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="text-sm font-medium text-gray-900">Ticket creado</div>
                    <div className="text-xs text-gray-500 mt-1">{formatRelativeTime(ticket.createdAt)}</div>
                  </div>
                </div>

                {ticket.updatedAt !== ticket.createdAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div className="w-px h-full bg-gray-200 mt-1"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm font-medium text-gray-900">Ticket actualizado</div>
                      <div className="text-xs text-gray-500 mt-1">{formatRelativeTime(ticket.updatedAt)}</div>
                    </div>
                  </div>
                )}

                {ticket.resolvedAt && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Ticket resuelto</div>
                      <div className="text-xs text-gray-500 mt-1">{formatRelativeTime(ticket.resolvedAt)}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          {ticket.internalNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Notas Internas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ticket.internalNotes.map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900">Nota</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(note.createdAt)}</div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parts Used */}
          {ticket.partsUsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Partes Utilizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticket.partsUsed.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        <div className="text-xs text-gray-500">Cantidad: {part.qty}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${part.cost.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${ticket.partsUsed.reduce((sum, part) => sum + part.cost, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assigned Technician */}
          {technician && (
            <Card>
              <CardHeader>
                <CardTitle>Técnico Asignado</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="font-medium text-gray-900">{technician.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{technician.email}</div>
                  <div className="text-sm text-gray-500">{technician.phone}</div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No se encontró el ticket</div>
      )}
    </Modal>
  );
}
