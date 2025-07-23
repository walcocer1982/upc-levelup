"use client";

import BaseProfileForm from "./shared/BaseProfileForm";

interface AdminProfileFormProps {
  onSubmit: (data: any) => void;
  startupData?: any;
  startupId?: string;
  onCancel?: () => void;
}

export default function AdminProfileForm({
  onSubmit,
  startupData,
  startupId,
  onCancel
}: AdminProfileFormProps) {
  return (
    <BaseProfileForm
      onSubmit={onSubmit}
      startupData={startupData}
      startupId={startupId}
      mode="admin"
      title="Editar Perfil de Startup"
      submitButtonText="Actualizar Perfil"
      onCancel={onCancel}
      showCancelButton={true}
    />
  );
} 