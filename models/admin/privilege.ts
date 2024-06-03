import { type User } from './user';

export type Privilege = {
   id: number;
   name: string;
   createdAt: Date;
   updatedAt: Date;
   users?: User[];
   createdBy: User;
   updatedBy: User;
};
