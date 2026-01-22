'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/Table';
import { ListCard } from '@/components/ui/ListCard';
import type { Technician } from '@/domain/types';

interface TechniciansContentProps {
  technicians: Technician[];
}

export function TechniciansContent({ technicians }: TechniciansContentProps) {
  const router = useRouter();

  const handleTechnicianClick = (technicianId: string) => {
    router.push(`/technicians/${technicianId}`);
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Especialidades</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No se encontraron técnicos
                  </TableCell>
                </TableRow>
              ) : (
                technicians.map((technician) => (
                  <TableRow
                    key={technician.id}
                    className="cursor-pointer"
                    onClick={() => handleTechnicianClick(technician.id)}
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">{technician.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{technician.email}</div>
                        <div className="text-gray-500">{technician.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {technician.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="info" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {technician.specialties.length > 2 && (
                          <Badge variant="default" className="text-xs">
                            +{technician.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={technician.active ? 'success' : 'default'}>
                        {technician.active ? 'Activo' : 'Inactivo'}
                      </Badge>
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
        {technicians.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No se encontraron técnicos
            </CardContent>
          </Card>
        ) : (
          technicians.map((technician) => (
            <ListCard
              key={technician.id}
              onClick={() => handleTechnicianClick(technician.id)}
              className="cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{technician.name}</h3>
                  <p className="text-sm text-gray-500">{technician.email}</p>
                </div>
                <Badge variant={technician.active ? 'success' : 'default'}>
                  {technician.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div>{technician.phone}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {technician.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="info" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {technician.specialties.length > 3 && (
                    <Badge variant="default" className="text-xs">
                      +{technician.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </ListCard>
          ))
        )}
      </div>
    </>
  );
}
