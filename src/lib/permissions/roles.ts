export enum Role {
  ADMIN = 'admin',
  FUNDADOR = 'fundador',
  MIEMBRO = 'miembro',
}

export const roleDescriptions = {
  [Role.ADMIN]: 'Administrador StartUPC',
  [Role.FUNDADOR]: 'Emprendedor/Fundador',
  [Role.MIEMBRO]: 'Miembro del Equipo',
};

export const rolePermissions = {
  [Role.ADMIN]: {
    canCreateConvocatoria: true,
    canManageConvocatorias: true,
    canConfigureCriterios: true,
    canViewPostulaciones: true,
    canEvaluatePostulaciones: true,
    canViewAIInsights: true,
    canConsolidateResults: true,
  },
  [Role.FUNDADOR]: {
    canRegisterStartup: true,
    canManageStartup: true,
    canManageTeam: true,
    canCreatePostulacion: true,
    canCompletePostulacion: true,
    canReviewPostulacion: true,
    canViewPostulacionStatus: true,
    canViewFeedback: true,
  },
  [Role.MIEMBRO]: {
    canViewStartupInfo: true,
  },
};
