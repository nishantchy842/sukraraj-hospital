import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IGetAll, IQueryParamaters } from '@/interface';
import type { Contact } from '@/models/admin/contact';

type ContactApi = {
   ADMIN: {
      getContacts: GetAll<IQueryParamaters, Contact>;
   };
   SUPER_ADMIN: {
      getContacts: GetAll<IQueryParamaters, Contact>;
   };
};

export const contactApi: ContactApi = {
   [ROLE_NAME.ADMIN]: {
      getContacts: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
      }) => {
         const res = await fetch(
            `admin/contact?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}`
         );

         return res.data as IGetAll<Contact>;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getContacts: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
      }) => {
         const res = await fetch(
            `super-admin/contact?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}`
         );

         return res.data as IGetAll<Contact>;
      },
   },
};
