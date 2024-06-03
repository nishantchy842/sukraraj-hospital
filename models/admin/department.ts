import { type User } from './user';
import { type Member } from './member';
import { type DEPARTMENT_STATUS } from '@/enums/department';

export type Department = {
   id: number;
   name_En: string;
   slug: string;
   status?: DEPARTMENT_STATUS;
   members?: Member[];
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   name_Np: string;
   description_En: string;
   description_Np: string;
   image: string;
   content_En: string;
   content_Np: string;
   roomNo: number;
   opdFloor: string;
   morningScheduleStart: Date;
   afternoonScheduleStart: Date;
   morningScheduleEnd: Date;
   afternoonScheduleEnd: Date;
   opdDaysStart: string;
   opdDaysEnd: string;
   priority: number;
}>;
