import { fetch } from '..';
import Cookie from 'js-cookie';
import { ROLE_NAME } from '@/enums/role';

type UploadApi = {
   ADMIN: {
      upload: (
         data: FormData
      ) => Promise<{ message: string; data: { path: string } }>;
   };
   SUPER_ADMIN: {
      upload: (
         data: FormData
      ) => Promise<{ message: string; data: { path: string } }>;
   };
};

export const uploadApi: UploadApi = {
   [ROLE_NAME.ADMIN]: {
      upload: async (data) => {
         const res = await fetch(`admin/upload`, {
            method: 'POST',
            headers: {
               ['Authorization']: `Bearer ${Cookie.get('token')}`,
            },
            body: data,
         });

         return res.data as {
            message: string;
            data: {
               path: string;
            };
         };
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      upload: async (data) => {
         const res = await fetch(`super-admin/upload`, {
            method: 'POST',
            headers: {
               ['Authorization']: `Bearer ${Cookie.get('token')}`,
            },
            body: data,
         });

         return res.data as {
            message: string;
            data: {
               path: string;
            };
         };
      },
   },
};
