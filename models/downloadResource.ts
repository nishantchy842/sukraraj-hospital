import { type RESOURCE_STATUS } from '@/enums/resource';
import { type RESOURCE_CATEGORY_STATUS } from '@/enums/resource-category';
import { type User } from './user';

export type ResourceCategory = {
   id: number;
   title_En: string;
   slug: string;
   status?: RESOURCE_CATEGORY_STATUS;
   createdAt: Date;
   updatedAt: Date;
   // eslint-disable-next-line no-use-before-define
   resources?: Resource[];
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
}>;

export type Resource = {
   id: number;
   title_En: string;
   slug: string;
   status?: RESOURCE_STATUS;
   createdAt: Date;
   updatedAt: Date;
   resourceCategory?: ResourceCategory;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
   content_En: string;
   content_Np: string;
   previewImage: string;
   downloadFile: string;
}>;
