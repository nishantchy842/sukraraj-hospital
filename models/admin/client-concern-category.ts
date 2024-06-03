import { type User } from './user';
import { type ClientConcern } from './client-concern';
import { type CLIENT_CONCERN_CATEGORY_STATUS } from '@/enums/client-concern-category';

export type ClientConcernCategory = {
   id: number;
   title_En: string;
   slug: string;
   status?: CLIENT_CONCERN_CATEGORY_STATUS;
   createdAt: Date;
   updatedAt: Date;
   clientConcerns?: ClientConcern[];
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
}>;
