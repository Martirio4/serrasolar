import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { Button } from '@/components/ui/Button';
import { InstallationForm } from './installation-form';

export default function NewInstallationPage() {
  return (
    <div>
      <PageHeader
        title="Nueva Instalación"
        breadcrumb={['Instalaciones', 'Nueva']}
      />

      <div className="max-w-4xl">
        <InstallationForm />
      </div>
    </div>
  );
}
