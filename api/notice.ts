import { type IGetAll, type IQueryParamaters } from '@/interface';
import {
   type NoticeDetails,
   type Notice,
   type NoticeCategory,
} from '@/models/notices';
import { fetch } from '.';

export const getAllNoticeCategory: GetAll<
   IQueryParamaters & { title?: string },
   NoticeCategory
> = async ({
   pagination = true,
   page = 1,
   size = 10,
   sort = 'updatedAt',
   order = 'DESC',
   title = '',
}) => {
   const url = `notice-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`;
   const res = await fetch(url);
   const { data } = res;

   return data as IGetAll<NoticeCategory>;
};

export const getSingleNoticeCategory: Get<string, NoticeCategory> = async (
   slug
) => {
   const res = await fetch(`notice-category/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as NoticeCategory;
};

export const getAllNotice: GetAll<
   IQueryParamaters & {
      noticeCategorySlug?: string;
      noticeCategoryId?: number;
      title?: string;
      isPopup?: boolean;
   },
   Notice
> = async ({
   pagination = true,
   page = 1,
   size = 16,
   sort = 'updatedAt',
   order = 'DESC',
   noticeCategoryId = '',
   title = '',
   noticeCategorySlug = '',
   isPopup = '',
}) => {
   noticeCategoryId = noticeCategoryId
      ? `&noticeCategoryId=${noticeCategoryId}`
      : '';

   title = title ? `&title=${title}` : '';

   isPopup = isPopup ? `&isPopup=${isPopup}` : '';

   noticeCategorySlug = noticeCategorySlug
      ? `&noticeCategorySlug=${noticeCategorySlug}`
      : '';

   const url = `notice?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}${noticeCategoryId}${title}${noticeCategorySlug}${isPopup}`;

   const res = await fetch(url);

   const { data } = res;

   return data as IGetAll<Notice>;
};
//get notice details
export const getSingleNoticeDetails: Get<string, NoticeDetails> = async (
   slug
) => {
   const res = await fetch(`notice/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as NoticeDetails;
};
