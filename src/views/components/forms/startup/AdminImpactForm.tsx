"use client";

import BaseImpactForm from "./shared/BaseImpactForm";

interface AdminImpactFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  startupId?: string;
  onCancel?: () => void;
}

export default function AdminImpactForm({ 
  onSubmit, 
  initialData, 
  startupId,
  onCancel 
}: AdminImpactFormProps) {
  return (
    <BaseImpactForm
      onSubmit={onSubmit}
      initialData={initialData}
      startupId={startupId}
      mode="admin"
      title="Editar Impacto de Startup"
      submitButtonText="Actualizar Impacto"
      onCancel={onCancel}
      showCancelButton={true}
    />
  );
} 