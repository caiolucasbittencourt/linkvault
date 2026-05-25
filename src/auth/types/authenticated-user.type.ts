import { Role } from '@prisma/client';

export type AuthenticatedUser = {
  userId: number;
  email: string;
  role: Role;
};
