import { type IGetAll, type IQueryParamaters } from '@/interface';
import { type ServiceDetails, type Service } from '@/models/services';
import { type Key } from 'react';
import { fetch } from '.';

export const getAllServices: GetAll<
   IQueryParamaters & { title?: string },
   Service
> = async ({
   pagination = true,
   page = 1,
   size = 8,
   sort = 'updatedAt' as Key,
   order = 'DESC',
   title = '',
}) => {
   const url = `service?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`;

   const res = await fetch(url, {
      cache: 'no-store',
   });

   const { data } = res;
   return data as IGetAll<Service>;
};

export const getSevivesDetails: Get<string, ServiceDetails> = async (slug) => {
   const res = await fetch(`service/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as ServiceDetails;
};
