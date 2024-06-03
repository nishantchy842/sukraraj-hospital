import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Resource } from '@/models/admin/resource';

type ResourceApi = {
   ADMIN: {
      getResources: GetAll<
         IQueryParamaters & {
            resourceCategoryId?: number;
            title?: string;
         },
         Resource
      >;
      getResource: Get<Resource['slug'], Resource>;
      createResource: Post<Resource>;
      updateResource: Patch<Partial<Resource> & Pick<Resource, 'slug'>>;
   };
   SUPER_ADMIN: {
      getResources: GetAll<
         IQueryParamaters &
            Partial<Pick<Resource, 'status'>> & {
               resourceCategoryId?: number;
               title?: string;
            },
         Resource
      >;
      getResource: Get<Resource['slug'], Resource>;
      createResource: Post<Resource>;
      updateResource: Patch<Partial<Resource> & Pick<Resource, 'slug'>>;
   };
};

export const resourceApi: ResourceApi = {
   [ROLE_NAME.ADMIN]: {
      getResources: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         resourceCategoryId = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/resource?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&resourceCategoryId=${resourceCategoryId}&title=${title}`
         );

         return res.data as IGetAll<Resource>;
      },
      getResource: async (slug) => {
         const res = await fetch(`admin/resource/${slug}`);

         const { data } = res.data;

         return data as Resource;
      },
      createResource: async (data) => {
         const res = await fetch(`admin/resource`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResource: async ({ slug, ...data }) => {
         const res = await fetch(`admin/resource/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getResources: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         resourceCategoryId = '',
         title = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/resource?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&resourceCategoryId=${resourceCategoryId}&title=${title}`
         );

         return res.data as IGetAll<Resource>;
      },
      getResource: async (slug) => {
         const res = await fetch(`super-admin/resource/${slug}`);

         const { data } = res.data;

         return data as Resource;
      },
      createResource: async (data) => {
         const res = await fetch(`super-admin/resource`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResource: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/resource/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
