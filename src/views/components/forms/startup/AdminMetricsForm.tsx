"use client";

import BaseMetricsForm from "./shared/BaseMetricsForm";

interface AdminMetricsFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  startupId?: string;
  onCancel?: () => void;
}

export default function AdminMetricsForm({ 
  onSubmit, 
  initialData, 
  startupId,
  onCancel 
}: AdminMetricsFormProps) {
  return (
    <BaseMetricsForm
      onSubmit={onSubmit}
      initialData={initialData}
      startupId={startupId}
      mode="admin"
      title="Editar Métricas de Startup"
      submitButtonText="Actualizar Métricas"
      onCancel={onCancel}
      showCancelButton={true}
    />
  );
} 