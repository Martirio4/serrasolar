'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { installationRepository } from '@/data/repositories';

export function InstallationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [panels, setPanels] = useState([{ brand: '', model: '', wattage: 0, qty: 0 }]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Collect panel data
    const panelData = panels.map((panel) => ({
      brand: panel.brand,
      model: panel.model,
      wattage: Number(panel.wattage),
      qty: Number(panel.qty),
    })).filter((p) => p.brand && p.model && p.wattage > 0 && p.qty > 0);

    const installationData = {
      companyId: formData.get('companyId') as string,
      clientName: formData.get('clientName') as string,
      siteName: formData.get('siteName') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      lat: Number(formData.get('lat')),
      lng: Number(formData.get('lng')),
      systemType: formData.get('systemType') as 'on-grid' | 'off-grid' | 'hybrid',
      panels: panelData,
      inverter: {
        brand: formData.get('inverterBrand') as string,
        model: formData.get('inverterModel') as string,
        serial: formData.get('inverterSerial') as string,
      },
      installedAt: new Date().toISOString(),
      status: 'active' as const,
      assignedTechnicianId: null,
    };

    try {
      await installationRepository.create(installationData);
      router.push('/installations');
    } catch (error) {
      console.error('Error creating installation:', error);
      alert('Error al crear la instalación');
    } finally {
      setLoading(false);
    }
  };

  const addPanel = () => {
    setPanels([...panels, { brand: '', model: '', wattage: 0, qty: 0 }]);
  };

  const removePanel = (index: number) => {
    setPanels(panels.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="ID de Empresa" name="companyId" required />
          <Input label="Nombre del Cliente" name="clientName" required />
          <Input label="Nombre del Sitio" name="siteName" required />
          <Input label="Ciudad" name="city" required />
          <div className="md:col-span-2">
            <Input label="Dirección" name="address" required />
          </div>
          <Input label="Latitud" name="lat" type="number" step="any" required />
          <Input label="Longitud" name="lng" type="number" step="any" required />
          <div className="md:col-span-2">
            <Select
              label="Tipo de Sistema"
              name="systemType"
              options={[
                { value: 'on-grid', label: 'Conectado a Red' },
                { value: 'off-grid', label: 'Aislado' },
                { value: 'hybrid', label: 'Híbrido' },
              ]}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Paneles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {panels.map((panel, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
              <Input
                label="Marca"
                value={panel.brand}
                onChange={(e) => {
                  const newPanels = [...panels];
                  newPanels[index].brand = e.target.value;
                  setPanels(newPanels);
                }}
                required
              />
              <Input
                label="Modelo"
                value={panel.model}
                onChange={(e) => {
                  const newPanels = [...panels];
                  newPanels[index].model = e.target.value;
                  setPanels(newPanels);
                }}
                required
              />
              <Input
                label="Potencia (W)"
                type="number"
                value={panel.wattage}
                onChange={(e) => {
                  const newPanels = [...panels];
                  newPanels[index].wattage = Number(e.target.value);
                  setPanels(newPanels);
                }}
                required
              />
              <div className="flex items-end gap-2">
                <Input
                  label="Cantidad"
                  type="number"
                  value={panel.qty}
                  onChange={(e) => {
                    const newPanels = [...panels];
                    newPanels[index].qty = Number(e.target.value);
                    setPanels(newPanels);
                  }}
                  required
                />
                {panels.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePanel(index)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addPanel}>
            Agregar Panel
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Inversor</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Marca" name="inverterBrand" required />
          <Input label="Modelo" name="inverterModel" required />
          <Input label="Número de Serie" name="inverterSerial" required />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Instalación'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
