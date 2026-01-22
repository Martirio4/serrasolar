import { ticketRepository, installationRepository, technicianRepository } from '@/data/repositories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatDateTime, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TicketDetailClient } from './ticket-detail-client';

async function getTicketData(id: string) {
  const ticket = await ticketRepository.getById(id);
  if (!ticket) return null;

  const installation = await installationRepository.getById(ticket.installationId);
  const technician = ticket.assignedTechnicianId
    ? await technicianRepository.getById(ticket.assignedTechnicianId)
    : null;

  return { ticket, installation, technician };
}

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getTicketData(params.id);

  if (!data) {
    notFound();
  }

  const { ticket, installation, technician } = data;

  return (
    <div>
      <PageHeader
        title={ticket.title}
        breadcrumb={['Tickets', ticket.id]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Details</CardTitle>
                <TicketDetailClient ticket={ticket} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <Badge variant="info" className="mt-1">{ticket.type}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Priority</div>
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
                    {ticket.priority}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
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
                    {ticket.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-sm font-medium text-gray-900 mt-1">
                    {formatDateTime(ticket.createdAt)}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">Description</div>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {installation && (
                <div>
                  <div className="text-sm text-gray-500 mb-2">Installation</div>
                  <Link
                    href={`/installations/${installation.id}`}
                    className="text-sm text-[#14B8A6] hover:underline"
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
                    <div className="text-sm font-medium text-gray-900">Ticket created</div>
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
                      <div className="text-sm font-medium text-gray-900">Ticket updated</div>
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
                      <div className="text-sm font-medium text-gray-900">Ticket resolved</div>
                      <div className="text-xs text-gray-500 mt-1">{formatRelativeTime(ticket.resolvedAt)}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {ticket.internalNotes.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No notes</p>
              ) : (
                <div className="space-y-4">
                  {ticket.internalNotes.map((note) => (
                    <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-gray-900">Note</div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(note.createdAt)}</div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parts Used */}
          {ticket.partsUsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Parts Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticket.partsUsed.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        <div className="text-xs text-gray-500">Qty: {part.qty}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        €{part.cost.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Total</span>
                      <span className="text-lg font-semibold text-gray-900">
                        €{ticket.partsUsed.reduce((sum, part) => sum + part.cost, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {technician && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Technician</CardTitle>
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
      </div>
    </div>
  );
}
