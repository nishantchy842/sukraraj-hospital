import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Privilege } from '@/models/admin/privilege';

type PrivilegeApi = {
   SUPER_ADMIN: {
      getPrivileges: GetAll<
         IQueryParamaters &
            Partial<Pick<Privilege, 'name'>> & { name?: string },
         Privilege
      >;
      getPrivilege: Get<Privilege['name'], Privilege>;
      createPrivilege: Post<Privilege>;
      updatePrivilege: Patch<Partial<Privilege> & Pick<Privilege, 'name'>>;
   };
};

export const privilegeApi: PrivilegeApi = {
   [ROLE_NAME.SUPER_ADMIN]: {
      getPrivileges: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         name = '',
      }) => {
         const res = await fetch(
            `super-admin/privilege?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&name=${name}`
         );

         return res.data as IGetAll<Privilege>;
      },
      getPrivilege: async (name) => {
         const res = await fetch(`super-admin/privilege/${name}`);

         const { data } = res.data;

         return data as Privilege;
      },
      createPrivilege: async (data) => {
         const res = await fetch(`super-admin/privilege`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updatePrivilege: async ({ name, ...data }) => {
         const res = await fetch(`super-admin/privilege/${name}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
