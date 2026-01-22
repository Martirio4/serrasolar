import { technicianRepository, installationRepository, ticketRepository } from '@/data/repositories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/Table';
import { ListCard } from '@/components/ui/ListCard';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { translateStatus, translatePriority, translateType } from '@/lib/translations';

async function getTechnicianData(id: string) {
  const technician = await technicianRepository.getById(id);
  if (!technician) return null;

  const installations = await installationRepository.getByTechnicianId(id);
  const tickets = await ticketRepository.getByTechnicianId(id);
  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress');

  return { technician, installations, openTickets };
}

export default async function TechnicianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getTechnicianData(id);

  if (!data) {
    notFound();
  }

  const { technician, installations, openTickets } = data;

  return (
    <div>
      <PageHeader
        title={technician.name}
        breadcrumb={['Técnicos', technician.name]}
      />

      {/* Technician Header Card */}
      <Card className="mb-6">
        <CardContent className="!p-8 !pt-8">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <img
                src={`https://i.pravatar.cc/150?img=${parseInt(technician.id.replace('tech-', '')) || 1}`}
                alt={technician.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-[#14B8A6]/20"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{technician.name}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span>{technician.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-700">Teléfono:</span>
                  <span>{technician.phone}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={technician.active ? 'success' : 'default'}>
                  {technician.active ? 'Activo' : 'Inactivo'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {installations.length} instalaciones • {openTickets.length} tickets abiertos
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Technician Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">Especialidades</div>
                <div className="flex flex-wrap gap-2">
                  {technician.specialties.map((specialty, index) => (
                    <Badge key={index} variant="info">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Installations */}
          <Card>
            <CardHeader>
              <CardTitle>Instalaciones Asignadas ({installations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {installations.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No hay instalaciones asignadas</p>
              ) : (
                <div className="space-y-3">
                  {installations.map((installation) => (
                    <Link
                      key={installation.id}
                      href={`/installations/${installation.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{installation.clientName}</div>
                          <div className="text-xs text-gray-500">{installation.siteName}</div>
                        </div>
                        <Badge
                          variant={
                            installation.status === 'active'
                              ? 'success'
                              : installation.status === 'maintenance'
                              ? 'warning'
                              : 'default'
                          }
                          className="ml-2 shrink-0"
                        >
                          {translateStatus(installation.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {installation.city} • Instalado {formatDate(installation.installedAt)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Open Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets Abiertos ({openTickets.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {openTickets.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No hay tickets abiertos</p>
              ) : (
                <div className="space-y-3">
                  {openTickets.slice(0, 5).map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/tickets/${ticket.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {ticket.title}
                        </div>
                        <Badge
                          variant={
                            ticket.priority === 'urgent' || ticket.priority === 'high'
                              ? 'danger'
                              : ticket.priority === 'medium'
                              ? 'warning'
                              : 'default'
                          }
                          className="ml-2 shrink-0"
                        >
                          {translatePriority(ticket.priority)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {translateType(ticket.type)} • {formatDate(ticket.createdAt)}
                      </div>
                    </Link>
                  ))}
                  {openTickets.length > 5 && (
                    <Link
                      href={`/tickets?technicianId=${technician.id}`}
                      className="block text-sm text-center text-[#14B8A6] hover:underline pt-2"
                    >
                      Ver todos los {openTickets.length} tickets →
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
