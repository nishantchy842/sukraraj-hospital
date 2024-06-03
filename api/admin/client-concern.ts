import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { ClientConcern } from '@/models/admin/client-concern';

type ClientConcernApi = {
   ADMIN: {
      getClientConcerns: GetAll<
         IQueryParamaters & {
            clientConcernCategoryId?: number;
            question?: string;
         },
         ClientConcern
      >;
      getClientConcern: Get<ClientConcern['slug'], ClientConcern>;
      createClientConcern: Post<ClientConcern>;
      updateClientConcern: Patch<
         Partial<ClientConcern> & Pick<ClientConcern, 'slug'>
      >;
   };
   SUPER_ADMIN: {
      getClientConcerns: GetAll<
         IQueryParamaters &
            Partial<Pick<ClientConcern, 'status'>> & {
               clientConcernCategoryId?: number;
               question?: string;
            },
         ClientConcern
      >;
      getClientConcern: Get<ClientConcern['slug'], ClientConcern>;
      createClientConcern: Post<ClientConcern>;
      updateClientConcern: Patch<
         Partial<ClientConcern> & Pick<ClientConcern, 'slug'>
      >;
   };
};

export const clientConcernApi: ClientConcernApi = {
   [ROLE_NAME.ADMIN]: {
      getClientConcerns: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         clientConcernCategoryId = '',
         question = '',
      }) => {
         const res = await fetch(
            `admin/client-concern?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&clientConcernCategoryId=${clientConcernCategoryId}&question=${question}`
         );

         return res.data as IGetAll<ClientConcern>;
      },
      getClientConcern: async (slug) => {
         const res = await fetch(`admin/client-concern/${slug}`);

         const { data } = res.data;

         return data as ClientConcern;
      },
      createClientConcern: async (data) => {
         const res = await fetch(`admin/client-concern`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateClientConcern: async ({ slug, ...data }) => {
         const res = await fetch(`admin/client-concern/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getClientConcerns: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         clientConcernCategoryId = '',
         question = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/client-concern?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&clientConcernCategoryId=${clientConcernCategoryId}&question=${question}`
         );

         return res.data as IGetAll<ClientConcern>;
      },
      getClientConcern: async (slug) => {
         const res = await fetch(`super-admin/client-concern/${slug}`);

         const { data } = res.data;

         return data as ClientConcern;
      },
      createClientConcern: async (data) => {
         const res = await fetch(`super-admin/client-concern`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateClientConcern: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/client-concern/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
