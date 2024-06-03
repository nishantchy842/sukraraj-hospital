import { type User } from './user';
import { type Notice } from './notice';
import { type NOTICE_CATEGORY_STATUS } from '@/enums/notice-category';

export type NoticeCategory = {
   id: number;
   title_En: string;
   slug: string;
   status?: NOTICE_CATEGORY_STATUS;
   createdAt: Date;
   updatedAt: Date;
   notices?: Notice[];
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
}>;
