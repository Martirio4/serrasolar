import { TicketsClient } from './tickets-client';
import { TicketsFilters } from './tickets-filters';
import { getFilteredTickets } from './tickets-server';
import { TicketsContent } from './tickets-content';

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; type?: string; installationId?: string; technicianId?: string }>;
}) {
  const params = await searchParams;
  const tickets = await getFilteredTickets(params);

  return (
    <div>
      <TicketsClient />
      <TicketsFilters searchParams={params} />
      <TicketsContent tickets={tickets} />
    </div>
  );
}
