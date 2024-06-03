import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { ClientConcernCategory } from '@/models/admin/client-concern-category';

type ClientConcernCategoryApi = {
   ADMIN: {
      getClientConcernCategories: GetAll<
         IQueryParamaters & { title?: string },
         ClientConcernCategory
      >;
      getClientConcernCategory: Get<
         ClientConcernCategory['slug'],
         ClientConcernCategory
      >;
      createClientConcernCategory: Post<ClientConcernCategory>;
      updateClientConcernCategory: Patch<
         Partial<ClientConcernCategory> & Pick<ClientConcernCategory, 'slug'>
      >;
   };
   SUPER_ADMIN: {
      getClientConcernCategories: GetAll<
         IQueryParamaters &
            Partial<Pick<ClientConcernCategory, 'status'>> & { title?: string },
         ClientConcernCategory
      >;
      getClientConcernCategory: Get<
         ClientConcernCategory['slug'],
         ClientConcernCategory
      >;
      createClientConcernCategory: Post<ClientConcernCategory>;
      updateClientConcernCategory: Patch<
         Partial<ClientConcernCategory> & Pick<ClientConcernCategory, 'slug'>
      >;
   };
};

export const clientConcernCategoryApi: ClientConcernCategoryApi = {
   [ROLE_NAME.ADMIN]: {
      getClientConcernCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/client-concern-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`
         );

         return res.data as IGetAll<ClientConcernCategory>;
      },
      getClientConcernCategory: async (slug) => {
         const res = await fetch(`admin/client-concern-category/${slug}`);

         const { data } = res.data;

         return data as ClientConcernCategory;
      },
      createClientConcernCategory: async (data) => {
         const res = await fetch(`admin/client-concern-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateClientConcernCategory: async ({ slug, ...data }) => {
         const res = await fetch(`admin/client-concern-category/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getClientConcernCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/client-concern-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&title=${title}`
         );

         return res.data as IGetAll<ClientConcernCategory>;
      },
      getClientConcernCategory: async (slug) => {
         const res = await fetch(`super-admin/client-concern-category/${slug}`);

         const { data } = res.data;

         return data as ClientConcernCategory;
      },
      createClientConcernCategory: async (data) => {
         const res = await fetch(`super-admin/client-concern-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateClientConcernCategory: async ({ slug, ...data }) => {
         const res = await fetch(
            `super-admin/client-concern-category/${slug}`,
            {
               method: 'PATCH',
               body: JSON.stringify(data),
            }
         );

         return res.data as IMessage;
      },
   },
};
