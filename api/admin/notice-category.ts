import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { NoticeCategory } from '@/models/admin/notice-category';

type NoticeCategoryApi = {
   ADMIN: {
      getNoticeCategories: GetAll<
         IQueryParamaters & { title?: string },
         NoticeCategory
      >;
      getNoticeCategory: Get<NoticeCategory['slug'], NoticeCategory>;
      createNoticeCategory: Post<NoticeCategory>;
      updateNoticeCategory: Patch<
         Partial<NoticeCategory> & Pick<NoticeCategory, 'slug'>
      >;
   };
   SUPER_ADMIN: {
      getNoticeCategories: GetAll<
         IQueryParamaters &
            Partial<Pick<NoticeCategory, 'status'>> & { title?: string },
         NoticeCategory
      >;
      getNoticeCategory: Get<NoticeCategory['slug'], NoticeCategory>;
      createNoticeCategory: Post<NoticeCategory>;
      updateNoticeCategory: Patch<
         Partial<NoticeCategory> & Pick<NoticeCategory, 'slug'>
      >;
   };
};

export const noticeCategoryApi: NoticeCategoryApi = {
   [ROLE_NAME.ADMIN]: {
      getNoticeCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/notice-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`
         );

         return res.data as IGetAll<NoticeCategory>;
      },
      getNoticeCategory: async (slug) => {
         const res = await fetch(`admin/notice-category/${slug}`);

         const { data } = res.data;

         return data as NoticeCategory;
      },
      createNoticeCategory: async (data) => {
         const res = await fetch(`admin/notice-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateNoticeCategory: async ({ slug, ...data }) => {
         const res = await fetch(`admin/notice-category/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getNoticeCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/notice-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&title=${title}`
         );

         return res.data as IGetAll<NoticeCategory>;
      },
      getNoticeCategory: async (slug) => {
         const res = await fetch(`super-admin/notice-category/${slug}`);

         const { data } = res.data;

         return data as NoticeCategory;
      },
      createNoticeCategory: async (data) => {
         const res = await fetch(`super-admin/notice-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateNoticeCategory: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/notice-category/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
