export interface ITeamMember {
  id: string;
  userId: string;
  startupId: string;
  position: string;
  role: TeamMemberRole;
  joinedAt: Date;
  status: TeamMemberStatus;
}

export enum TeamMemberRole {
  FOUNDER = 'founder',
  COFOUNDER = 'cofounder',
  EMPLOYEE = 'employee',
  ADVISOR = 'advisor',
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  INVITED = 'invited',
}
