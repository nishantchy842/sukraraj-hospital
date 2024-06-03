import { type User } from './user';
import { type BANNER_STATUS } from '@/enums/banner';

export type Banner = {
   id: number;
   image: string;
   status?: BANNER_STATUS;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   priority: number;
}>;
