import { type IGetAll, type IQueryParamaters } from '@/interface';
import {
   type Resource,
   type ResourceCategory,
} from '@/models/downloadResource';
import { fetch } from '.';

export const getAllResourceCategory: GetAll<
   IQueryParamaters & { title?: string },
   ResourceCategory
> = async ({
   pagination = true,
   page = 1,
   size = 10,
   sort = 'updatedAt',
   order = 'DESC',
   title = '',
}) => {
   const url = `resource-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`;
   const res = await fetch(url, {
      cache: 'no-store',
   });
   const { data } = res;

   return data as IGetAll<ResourceCategory>;
};

export const getSingleResourceCategory: Get<string, ResourceCategory> = async (
   slug
) => {
   const res = await fetch(`resource-category/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as ResourceCategory;
};

export const getAllResources: GetAll<
   IQueryParamaters & {
      resourceCategoryId?: number;
      resourceCategorySlug?: string;
      title?: string;
   },
   Resource
> = async ({
   pagination = true,
   page = 1,
   size = 8,
   sort = 'updatedAt',
   order = 'DESC',
   resourceCategoryId = '',
   resourceCategorySlug = '',
   title = '',
}) => {
   resourceCategoryId = resourceCategoryId
      ? `&resourceCategoryId=${resourceCategoryId}`
      : '';

   title = title ? `&title=${title}` : '';

   resourceCategorySlug = resourceCategorySlug
      ? `&resourceCategorySlug=${resourceCategorySlug}`
      : '';

   const url = `resource?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}${resourceCategorySlug}${resourceCategoryId}${title}`;

   const res = await fetch(url, {
      cache: 'no-store',
   });

   const { data } = res;

   return data as IGetAll<Resource>;
};

export const getResourceDetails: Get<string, Resource> = async (slug) => {
   const res = await fetch(`resource/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as Resource;
};
