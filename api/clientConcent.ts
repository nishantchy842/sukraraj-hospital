import { type IGetAll, type IQueryParamaters } from '@/interface';
import {
   type ClientConcern,
   type ClientConcernCategory,
} from '@/models/clientConcern';
import { fetch } from '.';

export const getAllClientConcernCategory: GetAll<
   IQueryParamaters & { title?: string },
   ClientConcernCategory
> = async ({
   pagination = true,
   page = 1,
   size = 10,
   sort = 'updatedAt',
   order = 'DESC',
   title = '',
}) => {
   const url = `client-concern-category?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`;

   const res = await fetch(url);

   const { data } = res;

   return data as IGetAll<ClientConcernCategory>;
};

export const getSingleClientConcernCategory: Get<
   string,
   ClientConcernCategory
> = async (slug) => {
   const res = await fetch(`client-concern-category/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as ClientConcernCategory;
};

export const getAllClientConcern: GetAll<
   IQueryParamaters & {
      clientConcernCategoryId?: number;
      question?: string;
      clientConcernCategorySlug?: string;
   },
   ClientConcern
> = async ({
   pagination = true,
   page = 1,
   size = 16,
   sort = 'updatedAt',
   order = 'DESC',
   clientConcernCategoryId = '',
   clientConcernCategorySlug = '',
   question = '',
}) => {
   clientConcernCategoryId = clientConcernCategoryId
      ? `&clientConcernCategoryId=${clientConcernCategoryId}`
      : '';

   question = question ? `&question=${question}` : '';

   clientConcernCategorySlug = clientConcernCategorySlug
      ? `&clientConcernCategorySlug=${clientConcernCategorySlug}`
      : '';

   const url = `client-concern?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}${clientConcernCategoryId}${question}${clientConcernCategorySlug}`;

   const res = await fetch(url, {
      cache: 'no-store',
   });

   const { data } = res;

   return data as IGetAll<ClientConcern>;
};
