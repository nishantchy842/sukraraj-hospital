import { type IGetAll, type IQueryParamaters } from '@/interface';
import { fetch } from '.';
import { type Member } from '@/models/about';

export const getAllMember: GetAll<
   IQueryParamaters & { type?: string; name?: string; departmentId?: number },
   Member
> = async ({
   pagination = true,
   page = 1,
   size = 10,
   sort = 'updatedAt',
   order = 'DESC',
   type = '',
   name = '',
   departmentId = '',
}) => {
   departmentId = departmentId ? `&departmentId=${departmentId}` : '';
   name = name ? `&name=${name}` : '';
   type = type ? `&type=${type}` : '';

   const url = `member?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}${type}${name}${departmentId}`;
   const res = await fetch(url);
   const data = res.data;

   return data as IGetAll<Member>;
};
