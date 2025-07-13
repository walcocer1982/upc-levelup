import { ITeamMember } from './ITeamMember';

export interface IStartup {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  industry: string;
  foundedYear: number;
  founderId: string;
  status: StartupStatus;
  team: ITeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export enum StartupStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
