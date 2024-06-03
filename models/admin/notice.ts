import { type User } from './user';
import { type NoticeCategory } from './notice-category';
import { type NOTICE_STATUS } from '@/enums/notice';

export type Notice = {
   id: number;
   title_En: string;
   slug: string;
   isPopup: boolean;
   status?: NOTICE_STATUS;
   createdAt: Date;
   updatedAt: Date;
   noticeCategory?: NoticeCategory;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
   previewImage: string;
   downloadFile: string;
   content_En: string;
   content_Np: string;
   redirectLink: string;
   date: Date;
}>;
