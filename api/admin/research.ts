import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Research } from '@/models/admin/research';

type ResearchApi = {
   ADMIN: {
      getResearches: GetAll<
         IQueryParamaters & {
            researchCategoryId?: number;
            title?: string;
         },
         Research
      >;
      getResearch: Get<Research['slug'], Research>;
      createResearch: Post<Research>;
      updateResearch: Patch<Partial<Research> & Pick<Research, 'slug'>>;
   };
   SUPER_ADMIN: {
      getResearches: GetAll<
         IQueryParamaters &
            Partial<Pick<Research, 'status'>> & {
               researchCategoryId?: number;
               title?: string;
            },
         Research
      >;
      getResearch: Get<Research['slug'], Research>;
      createResearch: Post<Research>;
      updateResearch: Patch<Partial<Research> & Pick<Research, 'slug'>>;
   };
};

export const researchApi: ResearchApi = {
   [ROLE_NAME.ADMIN]: {
      getResearches: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         researchCategoryId = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/research?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&researchCategoryId=${researchCategoryId}&title=${title}`
         );

         return res.data as IGetAll<Research>;
      },
      getResearch: async (slug) => {
         const res = await fetch(`admin/research/${slug}`);

         const { data } = res.data;

         return data as Research;
      },
      createResearch: async (data) => {
         const res = await fetch(`admin/research`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResearch: async ({ slug, ...data }) => {
         const res = await fetch(`admin/research/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getResearches: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         researchCategoryId = '',
         title = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/research?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&researchCategoryId=${researchCategoryId}&title=${title}`
         );

         return res.data as IGetAll<Research>;
      },
      getResearch: async (slug) => {
         const res = await fetch(`super-admin/research/${slug}`);

         const { data } = res.data;

         return data as Research;
      },
      createResearch: async (data) => {
         const res = await fetch(`super-admin/research`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateResearch: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/research/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
