export enum UserRole {
  ADMIN = 'ADMIN',
  FUNDADOR = 'FUNDADOR',
  MIEMBRO = 'MIEMBRO',
}

export const roleDescriptions = {
  [UserRole.ADMIN]: 'Administrador StartUPC',
  [UserRole.FUNDADOR]: 'Emprendedor/Fundador',
  [UserRole.MIEMBRO]: 'Miembro del Equipo',
};

export const rolePermissions = {
  [UserRole.ADMIN]: {
    canCreateConvocatoria: true,
    canManageConvocatorias: true,
    canConfigureCriterios: true,
    canViewPostulaciones: true,
    canEvaluatePostulaciones: true,
    canViewAIInsights: true,
    canConsolidateResults: true,
    canManageUsers: true,
    canViewAllStartups: true,
  },
  [UserRole.FUNDADOR]: {
    canRegisterStartup: true,
    canManageStartup: true,
    canManageTeam: true,
    canCreatePostulacion: true,
    canCompletePostulacion: true,
    canReviewPostulacion: true,
    canViewPostulacionStatus: true,
    canViewFeedback: true,
    canEditPostulacion: true,
  },
  [UserRole.MIEMBRO]: {
    canViewStartupInfo: true,
    canViewConvocatorias: true,
    canViewPostulaciones: true,
  },
}; 