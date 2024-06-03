import { type User } from './user';
import { type SERVICE_STATUS } from '@/enums/service';

export type Service = {
   id: number;
   title_En: string;
   slug: string;
   status?: SERVICE_STATUS;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
   image: string;
   content_En: string;
   content_Np: string;
   tags_En: string[];
   tags_Np: string[];
   priority: number;
}>;
