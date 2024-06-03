import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Banner } from '@/models/admin/banner';

type BannerApi = {
   ADMIN: {
      getBanners: GetAll<IQueryParamaters, Banner>;
      getBanner: Get<Banner['id'], Banner>;
      createBanner: Post<Banner>;
      updateBanner: Patch<Partial<Banner> & Pick<Banner, 'id'>>;
   };
   SUPER_ADMIN: {
      getBanners: GetAll<
         IQueryParamaters & Partial<Pick<Banner, 'status'>>,
         Banner
      >;
      getBanner: Get<Banner['id'], Banner>;
      createBanner: Post<Banner>;
      updateBanner: Patch<Partial<Banner> & Pick<Banner, 'id'>>;
   };
};

export const bannerApi: BannerApi = {
   [ROLE_NAME.ADMIN]: {
      getBanners: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
      }) => {
         const res = await fetch(
            `admin/banner?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}`
         );

         return res.data as IGetAll<Banner>;
      },
      getBanner: async (slug) => {
         const res = await fetch(`admin/banner/${slug}`);

         const { data } = res.data;

         return data as Banner;
      },
      createBanner: async (data) => {
         const res = await fetch(`admin/banner`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateBanner: async ({ id, ...data }) => {
         const res = await fetch(`admin/banner/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getBanners: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/banner?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}`
         );

         return res.data as IGetAll<Banner>;
      },
      getBanner: async (slug) => {
         const res = await fetch(`super-admin/banner/${slug}`);

         const { data } = res.data;

         return data as Banner;
      },
      createBanner: async (data) => {
         const res = await fetch(`super-admin/banner`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateBanner: async ({ id, ...data }) => {
         const res = await fetch(`super-admin/banner/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
