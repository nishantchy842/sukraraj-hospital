import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import { SERVICE_STATUS } from '@/enums/service';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Service } from '@/models/admin/service';

type ServiceApi = {
   ADMIN: {
      getServices: GetAll<IQueryParamaters & { title?: string }, Service>;
      getService: Get<Service['slug'], Service>;
      createService: Post<Service>;
      updateService: Patch<Partial<Service> & Pick<Service, 'slug'>>;
   };
   SUPER_ADMIN: {
      getServices: GetAll<
         IQueryParamaters &
            Partial<Pick<Service, 'status'>> & { title?: string },
         Service
      >;
      getService: Get<Service['slug'], Service>;
      createService: Post<Service>;
      updateService: Patch<Partial<Service> & Pick<Service, 'slug'>>;
   };
};

export const serviceApi: ServiceApi = {
   [ROLE_NAME.ADMIN]: {
      getServices: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/service?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`
         );

         return res.data as IGetAll<Service>;
      },
      getService: async (slug) => {
         const res = await fetch(`admin/service/${slug}`);

         const { data } = res.data;

         return data as Service;
      },
      createService: async (data) => {
         const res = await fetch(`admin/service`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateService: async ({ slug, ...data }) => {
         const res = await fetch(`admin/service/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getServices: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
         status = SERVICE_STATUS.ACTIVE,
      }) => {
         const res = await fetch(
            `super-admin/service?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&title=${title}`
         );

         return res.data as IGetAll<Service>;
      },
      getService: async (slug) => {
         const res = await fetch(`super-admin/service/${slug}`);

         const { data } = res.data;

         return data as Service;
      },
      createService: async (data) => {
         const res = await fetch(`super-admin/service`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateService: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/service/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
