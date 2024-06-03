import { type User } from './user';
import { type ClientConcernCategory } from './client-concern-category';
import { type CLIENT_CONCERN_STATUS } from '@/enums/client-concern';

export type ClientConcern = {
   id: number;
   question_En: string;
   slug: string;
   status?: CLIENT_CONCERN_STATUS;
   clientConcernCategories?: ClientConcernCategory[];
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   question_Np: string;
   answer_En: string;
   answer_Np: string;
}>;
