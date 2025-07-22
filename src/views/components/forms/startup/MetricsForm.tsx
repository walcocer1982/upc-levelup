"use client";

import BaseMetricsForm from "./shared/BaseMetricsForm";

interface MetricsFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  startupId?: string;
}

export default function MetricsForm({ onSubmit, initialData, startupId }: MetricsFormProps) {
  return (
    <BaseMetricsForm
      onSubmit={onSubmit}
      initialData={initialData}
      startupId={startupId}
      mode="user"
      title="Métricas de tu Startup"
      submitButtonText="Guardar Métricas"
    />
  );
}