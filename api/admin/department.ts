import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Department } from '@/models/admin/department';

type DepartmentApi = {
   ADMIN: {
      getDepartments: GetAll<IQueryParamaters & { name?: string }, Department>;
      getDepartment: Get<Department['slug'], Department>;
      createDepartment: Post<Department>;
      updateDepartment: Patch<Partial<Department> & Pick<Department, 'slug'>>;
   };
   SUPER_ADMIN: {
      getDepartments: GetAll<
         IQueryParamaters &
            Partial<Pick<Department, 'status'>> & { name?: string },
         Department
      >;
      getDepartment: Get<Department['slug'], Department>;
      createDepartment: Post<Department>;
      updateDepartment: Patch<Partial<Department> & Pick<Department, 'slug'>>;
   };
};

export const departmentApi: DepartmentApi = {
   [ROLE_NAME.ADMIN]: {
      getDepartments: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         name = '',
      }) => {
         const res = await fetch(
            `admin/department?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&name=${name}`
         );

         return res.data as IGetAll<Department>;
      },
      getDepartment: async (slug) => {
         const res = await fetch(`admin/department/${slug}`);

         const { data } = res.data;

         return data as Department;
      },
      createDepartment: async (data) => {
         const res = await fetch(`admin/department`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateDepartment: async ({ slug, ...data }) => {
         const res = await fetch(`admin/department/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getDepartments: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         name = '',
         status = '',
      }) => {
         const res = await fetch(
            `super-admin/department?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&name=${name}`
         );

         return res.data as IGetAll<Department>;
      },
      getDepartment: async (slug) => {
         const res = await fetch(`super-admin/department/${slug}`);

         const { data } = res.data;

         return data as Department;
      },
      createDepartment: async (data) => {
         const res = await fetch(`super-admin/department`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateDepartment: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/department/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
