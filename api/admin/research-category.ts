import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { ResearchCategory } from '@/models/admin/research-category';

type ResearchCategoryApi = {
   ADMIN: {
      getResearchCategories: GetAll<
         IQueryParamaters & { title?: string },
         ResearchCategory
      >;
      getResearchCategory: Get<ResearchCategory['slug'], ResearchCategory>;
      createResearchCategory: Post<ResearchCategory>;
      updateResearchCategory: Patch<
         Partial<ResearchCategory> & Pick<ResearchCategory, 'slug'>
      >;
   };
   SUPER_ADMIN: {
      getResearchCategories: GetAll<
         IQueryParamaters &
            Partial<Pick<ResearchCategory, 'status'>> & { title?: string },
         ResearchCategory
      >;
      getResearchCategory: Get<ResearchCategory['slug'], ResearchCategory>;
      createResearchCategory: Post<ResearchCategory>;
      updateResearchCategory: Patch<
         Partial<ResearchCategory> & Pick<ResearchCategory, 'slug'>
      >;
   };
};

export const researchCategoryApi: ResearchCategoryApi = {
   [ROLE_NAME.ADMIN]: {
      getResearchCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/research-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`
         );

         return res.data as IGetAll<ResearchCategory>;
      },
      getResearchCategory: async (slug) => {
         const res = await fetch(`admin/research-category/${slug}`);

         const { data } = res.data;

         return data as ResearchCategory;
      },
      createResearchCategory: async (data) => {
         const res = await fetch(`admin/research-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResearchCategory: async ({ slug, ...data }) => {
         const res = await fetch(`admin/research-category/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getResearchCategories: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/research-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&title=${title}`
         );

         return res.data as IGetAll<ResearchCategory>;
      },
      getResearchCategory: async (slug) => {
         const res = await fetch(`super-admin/research-category/${slug}`);

         const { data } = res.data;

         return data as ResearchCategory;
      },
      createResearchCategory: async (data) => {
         const res = await fetch(`super-admin/research-category`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResearchCategory: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/research-category/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
