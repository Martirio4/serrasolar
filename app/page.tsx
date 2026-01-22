import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { activityRepository, ticketRepository, installationRepository } from '@/data/repositories';
import { DashboardClient } from './page-client';
import { ActivityList } from './activity-list';

async function getDashboardData() {
  const [tickets, installations, activities] = await Promise.all([
    ticketRepository.getAll(),
    installationRepository.getAll(),
    activityRepository.getRecent(10),
  ]);

  const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress');
  const scheduledVisits = tickets.filter((t) => {
    const created = new Date(t.createdAt);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return created <= sevenDaysFromNow && (t.status === 'open' || t.status === 'in_progress');
  });
  const activeInstallations = installations.filter((inst) => inst.status === 'active');

  // Calculate average resolution time
  const resolvedTickets = tickets.filter((t) => t.resolvedAt);
  const avgResolutionTime = resolvedTickets.length > 0
    ? resolvedTickets.reduce((acc, ticket) => {
        if (!ticket.resolvedAt) return acc;
        const created = new Date(ticket.createdAt).getTime();
        const resolved = new Date(ticket.resolvedAt).getTime();
        return acc + (resolved - created);
      }, 0) / resolvedTickets.length / (1000 * 60 * 60 * 24) // Convert to days
    : 0;

  return {
    openTickets: openTickets.length,
    scheduledVisits: scheduledVisits.length,
    activeInstallations: activeInstallations.length,
    avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    activities,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <DashboardClient />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#14B8A6]/5 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Tickets Abiertos</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-gray-900">{data.openTickets}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#14B8A6]/5 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Visitas Programadas</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Próximos 7 días</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-gray-900">{data.scheduledVisits}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#14B8A6]/5 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Instalaciones Activas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-gray-900">{data.activeInstallations}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#14B8A6]/5 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Tiempo Promedio</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">Resolución</p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-gray-900">{data.avgResolutionTime}</div>
              <div className="text-sm font-medium text-gray-500">días</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityList activities={data.activities} />
        </CardContent>
      </Card>
    </div>
  );
}
