import { type Role } from './role';
import { type Privilege } from './privilege';

export type User = {
   id: string;
   name: string;
   email: string;
   password: string;
   image: string;
   createdAt: Date;
   updatedAt: Date;
   role: Role;
   privileges: Privilege[];
   createdBy?: User;
   updatedBy?: User;
};
