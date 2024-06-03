import { type User } from './user';
import { type Department } from './department';
import type {
   MEMBER_EXTRA_TYPE,
   MEMBER_STATUS,
   MEMBER_TYPE,
} from '@/enums/member';

export type Member = {
   id: string;
   name_En: string;
   type: MEMBER_TYPE;
   status?: MEMBER_STATUS;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   name_Np: string;
   position_En: string;
   position_Np: string;
   branch_En: string;
   branch_Np: string;
   image: string;
   message_En: string;
   message_Np: string;
   phoneNumbers: string[];
   emails: string[];
   extraType: MEMBER_EXTRA_TYPE;
   priority: number;
   department?: Department;
}>;
