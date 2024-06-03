import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Notice } from '@/models/admin/notice';

type NoticeApi = {
   ADMIN: {
      getNotices: GetAll<
         IQueryParamaters & {
            noticeCategoryId?: number;
            title?: string;
         },
         Notice
      >;
      getNotice: Get<Notice['slug'], Notice>;
      createNotice: Post<Notice>;
      updateNotice: Patch<Partial<Notice> & Pick<Notice, 'slug'>>;
   };
   SUPER_ADMIN: {
      getNotices: GetAll<
         IQueryParamaters &
            Partial<Pick<Notice, 'status'>> & {
               noticeCategoryId?: number;
               title?: string;
            },
         Notice
      >;
      getNotice: Get<Notice['slug'], Notice>;
      createNotice: Post<Notice>;
      updateNotice: Patch<Partial<Notice> & Pick<Notice, 'slug'>>;
   };
};

export const noticeApi: NoticeApi = {
   [ROLE_NAME.ADMIN]: {
      getNotices: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         noticeCategoryId = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/notice?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&noticeCategoryId=${noticeCategoryId}&title=${title}`
         );

         return res.data as IGetAll<Notice>;
      },
      getNotice: async (slug) => {
         const res = await fetch(`admin/notice/${slug}`);

         const { data } = res.data;

         return data as Notice;
      },
      createNotice: async (data) => {
         const res = await fetch(`admin/notice`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateNotice: async ({ slug, ...data }) => {
         const res = await fetch(`admin/notice/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getNotices: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         noticeCategoryId = '',
         title = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/notice?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&noticeCategoryId=${noticeCategoryId}&title=${title}`
         );

         return res.data as IGetAll<Notice>;
      },
      getNotice: async (slug) => {
         const res = await fetch(`super-admin/notice/${slug}`);

         const { data } = res.data;

         return data as Notice;
      },
      createNotice: async (data) => {
         const res = await fetch(`super-admin/notice`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateNotice: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/notice/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
