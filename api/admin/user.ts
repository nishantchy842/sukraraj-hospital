import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { User } from '@/models/admin/user';

type UserApi = {
   SUPER_ADMIN: {
      getUsers: GetAll<IQueryParamaters & Partial<Pick<User, 'name'>>, User>;
      getUser: Get<User['email'], User>;
      createUser: Post<User>;
      updateUser: Patch<Partial<User> & Pick<User, 'email'>>;
   };
};

export const userApi: UserApi = {
   [ROLE_NAME.SUPER_ADMIN]: {
      getUsers: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         name = '',
      }) => {
         const res = await fetch(
            `super-admin/user?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&name=${name}`
         );

         return res.data as IGetAll<User>;
      },
      getUser: async (name) => {
         const res = await fetch(`super-admin/user/${name}`);

         const { data } = res.data;

         return data as User;
      },
      createUser: async (data) => {
         const res = await fetch(`super-admin/user`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateUser: async ({ email, ...data }) => {
         const res = await fetch(`super-admin/user/${email}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
