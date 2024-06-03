import { type CLIENT_CONCERN_CATEGORY_STATUS } from '@/enums/client-concern-category';
import { type User } from './user';
import { type CLIENT_CONCERN_STATUS } from '@/enums/client-concern';

export type ClientConcern = {
   id: number;
   question_En: string;
   slug: string;
   status?: CLIENT_CONCERN_STATUS;
   // eslint-disable-next-line no-use-before-define
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
