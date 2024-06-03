import { type User } from './user';
import { type PRIVILEGE_NAME } from '@/enums/privilege';

export type Privilege = {
   id: number;
   name: PRIVILEGE_NAME;
   createdAt: Date;
   updatedAt: Date;
   users: User[];
};
