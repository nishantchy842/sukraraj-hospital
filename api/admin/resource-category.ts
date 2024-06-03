import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { ResourceCategory } from '@/models/admin/resource-category';

type ResourceCategoryApi = {
   ADMIN: {
      getResourceCategories: GetAll<
         IQueryParamaters & { title?: string },
         ResourceCategory
      >;
      getResourceCategory: Get<ResourceCategory['slug'], ResourceCategory>;
      createResourceCategory: Post<ResourceCategory>;
      updateResourceCategory: Patch<
         Partial<ResourceCategory> & Pick<ResourceCategory, 'slug'>
      >;
   };
   SUPER_ADMIN: {
      getResourceCategories: GetAll<
         IQueryParamaters &
            Partial<Pick<ResourceCategory, 'status'>> & { title?: string },
         ResourceCategory
      >;
      getResourceCategory: Get<ResourceCategory['slug'], ResourceCategory>;
      createResourceCategory: Post<ResourceCategory>;
      updateResourceCategory: Patch<
         Partial<ResourceCategory> & Pick<ResourceCategory, 'slug'>
      >;
   };
};

export const resourceCategoryApi: ResourceCategoryApi = {
   [ROLE_NAME.ADMIN]: {
      getResourceCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/resource-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`
         );

         return res.data as IGetAll<ResourceCategory>;
      },
      getResourceCategory: async (slug) => {
         const res = await fetch(`admin/resource-category/${slug}`);

         const { data } = res.data;

         return data as ResourceCategory;
      },
      createResourceCategory: async (data) => {
         const res = await fetch(`admin/resource-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResourceCategory: async ({ slug, ...data }) => {
         const res = await fetch(`admin/resource-category/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getResourceCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/resource-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&title=${title}`
         );

         return res.data as IGetAll<ResourceCategory>;
      },
      getResourceCategory: async (slug) => {
         const res = await fetch(`super-admin/resource-category/${slug}`);

         const { data } = res.data;

         return data as ResourceCategory;
      },
      createResourceCategory: async (data) => {
         const res = await fetch(`super-admin/resource-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResourceCategory: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/resource-category/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
