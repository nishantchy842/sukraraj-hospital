import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Role } from '@/models/admin/role';

type RoleApi = {
   SUPER_ADMIN: {
      getRoles: GetAll<
         IQueryParamaters & Partial<Pick<Role, 'name'>> & { name?: string },
         Role
      >;
      getRole: Get<Role['name'], Role>;
      createRole: Post<Role>;
      updateRole: Patch<Partial<Role> & Pick<Role, 'name'>>;
   };
};

export const roleApi: RoleApi = {
   [ROLE_NAME.SUPER_ADMIN]: {
      getRoles: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         name = '',
      }) => {
         const res = await fetch(
            `super-admin/role?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&name=${name}`
         );

         return res.data as IGetAll<Role>;
      },
      getRole: async (name) => {
         const res = await fetch(`super-admin/role/${name}`);

         const { data } = res.data;

         return data as Role;
      },
      createRole: async (data) => {
         const res = await fetch(`super-admin/role`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateRole: async ({ name, ...data }) => {
         const res = await fetch(`super-admin/role/${name}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
