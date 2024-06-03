import { type User } from './user';
import { type ROLE_NAME } from '@/enums/role';

export type Role = {
   id: number;
   name: ROLE_NAME;
   createdAt: Date;
   updatedAt: Date;
   users?: User[];
   createdBy: User;
   updatedBy: User;
};
