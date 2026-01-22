'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/Table';
import { ListCard } from '@/components/ui/ListCard';
import { formatDate } from '@/lib/utils';
import type { Installation } from '@/domain/types';

interface InstallationsContentProps {
  installations: Installation[];
}

export function InstallationsContent({ installations }: InstallationsContentProps) {
  const router = useRouter();

  const handleInstallationClick = (installationId: string) => {
    router.push(`/installations/${installationId}`);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente / Sitio</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Tipo de Sistema</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Instalado</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No se encontraron instalaciones
                  </TableCell>
                </TableRow>
              ) : (
                installations.map((installation) => (
                  <TableRow
                    key={installation.id}
                    className="cursor-pointer"
                    onClick={() => handleInstallationClick(installation.id)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{installation.clientName}</div>
                        <div className="text-sm text-gray-500">{installation.siteName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{installation.address}</div>
                        <div className="text-gray-500">{installation.city}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info">{installation.systemType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          installation.status === 'active'
                            ? 'success'
                            : installation.status === 'maintenance'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {installation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(installation.installedAt)}
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
        {installations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No se encontraron instalaciones
            </CardContent>
          </Card>
        ) : (
          installations.map((installation) => (
            <ListCard
              key={installation.id}
              onClick={() => handleInstallationClick(installation.id)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{installation.clientName}</h3>
                  <p className="text-sm text-gray-500">{installation.siteName}</p>
                </div>
                <Badge
                  variant={
                    installation.status === 'active'
                      ? 'success'
                      : installation.status === 'maintenance'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {installation.status}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>{installation.address}, {installation.city}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="info" className="text-xs">{installation.systemType}</Badge>
                  <span className="text-gray-400">•</span>
                  <span>Instalado {formatDate(installation.installedAt)}</span>
                </div>
              </div>
            </ListCard>
          ))
        )}
      </div>
    </>
  );
}
