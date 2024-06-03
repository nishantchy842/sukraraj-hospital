import { type IGetAll, type IQueryParamaters } from '@/interface';

import { type IRC, type IRCCategory } from '@/models/research';
import { fetch } from '.';

export const getAllResearchCategory: GetAll<
   IQueryParamaters & { title?: string },
   IRCCategory
> = async ({
   pagination = true,
   page = 1,
   size = 10,
   sort = 'updatedAt',
   order = 'DESC',
   title = '',
}) => {
   const url = `research-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`;
   const res = await fetch(url);
   const { data } = res;

   return data as IGetAll<IRCCategory>;
};

export const getSingleResearchCategory: Get<string, IRCCategory> = async (
   slug
) => {
   const res = await fetch(`research-category/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as IRCCategory;
};

export const getAllResearch: GetAll<
   IQueryParamaters & {
      researchCategoryId?: number;
      title?: string;
      researchCategorySlug?: string;
   },
   IRC
> = async ({
   pagination = true,
   page = 1,
   size = 16,
   sort = 'updatedAt',
   order = 'DESC',
   researchCategoryId = '',
   title = '',
   researchCategorySlug = '',
}) => {
   researchCategorySlug = researchCategorySlug
      ? `&researchCategorySlug=${researchCategorySlug}`
      : '';

   const url = `research?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}${researchCategorySlug}&researchCategoryId=${researchCategoryId}&title=${title}`;

   const res = await fetch(url);

   const { data } = res;

   return data as IGetAll<IRC>;
};

export const getResearchDetails: Get<string, IRC> = async (slug) => {
   const res = await fetch(`research/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as IRC;
};
