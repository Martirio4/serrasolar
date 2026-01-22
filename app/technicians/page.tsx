import { technicianRepository } from '@/data/repositories';
import { PageHeader } from '@/components/ui/PageHeader';
import { TechniciansContent } from './technicians-content';

async function getTechnicians() {
  return await technicianRepository.getAll();
}

export default async function TechniciansPage() {
  const technicians = await getTechnicians();

  return (
    <div>
      <PageHeader
        title="Técnicos"
        breadcrumb={['Técnicos']}
      />

      <TechniciansContent technicians={technicians} />
    </div>
  );
}
