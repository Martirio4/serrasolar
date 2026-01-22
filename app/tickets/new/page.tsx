import { PageHeader } from '@/components/ui/PageHeader';
import { TicketForm } from './ticket-form';
import { installationRepository } from '@/data/repositories';

async function getInstallations() {
  return await installationRepository.getAll();
}

export default async function NewTicketPage() {
  const installations = await getInstallations();

  return (
    <div>
      <PageHeader
        title="Nuevo Ticket"
        breadcrumb={['Tickets', 'Nuevo']}
      />

      <div className="max-w-4xl">
        <TicketForm installations={installations} />
      </div>
    </div>
  );
}
