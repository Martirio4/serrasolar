import { installationRepository, ticketRepository } from '@/data/repositories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/Table';
import { ListCard } from '@/components/ui/ListCard';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { translateStatus, translateSystemType } from '@/lib/translations';

async function getInstallationData(id: string) {
  const installation = await installationRepository.getById(id);
  if (!installation) return null;

  const tickets = await ticketRepository.getByInstallationId(id);
  return { installation, tickets };
}

export default async function InstallationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getInstallationData(id);

  if (!data) {
    notFound();
  }

  const { installation, tickets } = data;

  const totalPanels = installation.panels.reduce((sum, panel) => sum + panel.qty, 0);
  const totalWattage = installation.panels.reduce(
    (sum, panel) => sum + panel.wattage * panel.qty,
    0
  );

  return (
    <div>
      <PageHeader
        title={installation.siteName}
        breadcrumb={['Instalaciones', installation.clientName]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Cliente</div>
                  <div className="font-medium text-gray-900">{installation.clientName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <Badge
                    variant={
                      installation.status === 'active'
                        ? 'success'
                        : installation.status === 'maintenance'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {translateStatus(installation.status)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Tipo de Sistema</div>
                  <Badge variant="info">{translateSystemType(installation.systemType)}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Instalado</div>
                  <div className="font-medium text-gray-900">{formatDate(installation.installedAt)}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dirección</div>
                <div className="font-medium text-gray-900">
                  {installation.address}, {installation.city}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Card */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Paneles</h4>
                <div className="space-y-3">
                  {installation.panels.map((panel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {panel.brand} {panel.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {panel.wattage}W × {panel.qty} paneles
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {(panel.wattage * panel.qty / 1000).toFixed(1)} kW
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {totalPanels} paneles • {(totalWattage / 1000).toFixed(1)} kW
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Inversor</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">
                    {installation.inverter.brand} {installation.inverter.model}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Serie: {installation.inverter.serial}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop',
                  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=400&fit=crop',
                  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
                ].map((imageUrl, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-200 group cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={imageUrl}
                      alt={`Foto de instalación ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets Relacionados</CardTitle>
            </CardHeader>
            <CardContent>
              {tickets.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">No hay tickets</p>
              ) : (
                <div className="space-y-3">
                  {tickets.slice(0, 5).map((ticket) => (
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
                            ticket.status === 'resolved'
                              ? 'success'
                              : ticket.status === 'in_progress'
                              ? 'warning'
                              : ticket.priority === 'urgent' || ticket.priority === 'high'
                              ? 'danger'
                              : 'default'
                          }
                          className="ml-2 shrink-0"
                        >
                          {translateStatus(ticket.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </div>
                    </Link>
                  ))}
                  {tickets.length > 5 && (
                    <Link
                      href={`/tickets?installationId=${installation.id}`}
                      className="block text-sm text-center text-[#14B8A6] hover:underline pt-2"
                    >
                      Ver todos los {tickets.length} tickets →
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
