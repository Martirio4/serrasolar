import { installationRepository } from '@/data/repositories';
import { InstallationsClient } from './installations-client';
import { InstallationsFilters } from './installations-filters';
import { InstallationsContent } from './installations-content';

async function getInstallations(searchParams: { search?: string; status?: string }) {
  let installations = await installationRepository.getAll();

  if (searchParams.search) {
    installations = await installationRepository.search(searchParams.search);
  }

  if (searchParams.status) {
    installations = installations.filter((inst) => inst.status === searchParams.status);
  }

  return installations;
}

export default async function InstallationsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  const installations = await getInstallations(searchParams);

  return (
    <div>
      <InstallationsClient />
      <InstallationsFilters searchParams={searchParams} />
      <InstallationsContent installations={installations} />
    </div>
  );
}
