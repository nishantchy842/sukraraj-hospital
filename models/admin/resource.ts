import { type User } from './user';
import { type ResourceCategory } from './resource-category';
import { type RESOURCE_STATUS } from '@/enums/resource';

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
