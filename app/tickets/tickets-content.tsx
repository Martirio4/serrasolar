'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/Table';
import { ListCard } from '@/components/ui/ListCard';
import { formatRelativeTime } from '@/lib/utils';
import { useFilteredTickets } from './tickets-filtered';
import type { Ticket } from '@/domain/types';
import { TicketModal } from './ticket-modal';

interface TicketsContentProps {
  tickets: Ticket[];
}

export function TicketsContent({ tickets }: TicketsContentProps) {
  const filteredTickets = useFilteredTickets(tickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No se encontraron tickets
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow 
                    key={ticket.id}
                    className="cursor-pointer"
                    onClick={() => handleTicketClick(ticket.id)}
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">{ticket.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{ticket.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">{ticket.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === 'urgent' || ticket.priority === 'high'
                            ? 'danger'
                            : ticket.priority === 'medium'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === 'resolved'
                            ? 'success'
                            : ticket.status === 'in_progress'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatRelativeTime(ticket.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-[#14B8A6] font-medium">
                        Ver →
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No se encontraron tickets
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <ListCard
              key={ticket.id}
              onClick={() => handleTicketClick(ticket.id)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex-1">{ticket.title}</h3>
                <Badge
                  variant={
                    ticket.status === 'resolved'
                      ? 'success'
                      : ticket.status === 'in_progress'
                      ? 'warning'
                      : 'default'
                  }
                  className="ml-2"
                >
                  {ticket.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="info" className="text-xs">{ticket.type}</Badge>
                <Badge
                  variant={
                    ticket.priority === 'urgent' || ticket.priority === 'high'
                      ? 'danger'
                      : ticket.priority === 'medium'
                      ? 'warning'
                      : 'default'
                  }
                  className="text-xs"
                >
                  {ticket.priority}
                </Badge>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{formatRelativeTime(ticket.createdAt)}</span>
              </div>
            </ListCard>
          ))
        )}
      </div>

      <TicketModal
        ticketId={selectedTicketId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicketId(null);
        }}
      />
    </>
  );
}
