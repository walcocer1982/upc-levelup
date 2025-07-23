"use client";

import BaseProfileForm from "./shared/BaseProfileForm";

interface StartupProfileFormProps {
  onSubmit: (data: any) => void;
  startupData?: any;
  startupId?: string;
}

export default function StartupProfileForm({
  onSubmit,
  startupData,
  startupId
}: StartupProfileFormProps) {
  return (
    <BaseProfileForm
      onSubmit={onSubmit}
      startupData={startupData}
      startupId={startupId}
      mode="user"
      title="Perfil de Startup"
      submitButtonText="Guardar Perfil"
    />
  );
}