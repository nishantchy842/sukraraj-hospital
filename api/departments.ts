import type { IGetAll, IQueryParamaters } from '@/interface';
import { type DepartmentDetails } from '@/models/departments';
import { fetch } from '.';

export const getAllDepartments: GetAll<
   IQueryParamaters & { name?: string },
   DepartmentDetails
> = async ({
   pagination = true,
   page = 1,
   size = 16,
   sort = 'updatedAt',
   order = 'DESC',
   name = '',
}) => {
   const res = await fetch(
      `department?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&name=${name}`,
      {
         cache: 'no-store',
      }
   );
   const { data } = res;

   return data as IGetAll<DepartmentDetails>;
};

export const getDepartmentDetails: Get<string, DepartmentDetails> = async (
   slug
) => {
   const res = await fetch(`department/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as DepartmentDetails;
};
