import { type User } from './user';
import { type Resource } from './resource';
import { type RESOURCE_CATEGORY_STATUS } from '@/enums/resource-category';

export type ResourceCategory = {
   id: number;
   title_En: string;
   slug: string;
   status?: RESOURCE_CATEGORY_STATUS;
   createdAt: Date;
   updatedAt: Date;
   resources?: Resource[];
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
}>;
