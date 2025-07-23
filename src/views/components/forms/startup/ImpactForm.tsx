"use client";

import BaseImpactForm from "./shared/BaseImpactForm";

interface ImpactFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  startupId?: string;
}

export default function ImpactForm({ onSubmit, initialData, startupId }: ImpactFormProps) {
  return (
    <BaseImpactForm
      onSubmit={onSubmit}
      initialData={initialData}
      startupId={startupId}
      mode="user"
      title="Impacto de tu Startup"
      submitButtonText="Guardar Impacto"
    />
  );
}