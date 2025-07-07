import { Role } from '@/lib/permissions/roles';

export interface IUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  startupId?: string;
}
