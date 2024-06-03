import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { User } from '@/models/admin/user';
import { type IMessage } from '@/interface';

type AuthApi = {
   ADMIN: {
      getProfile: Get<undefined, User>;
      login: (data: {
         email: string;
         password: string;
      }) => Promise<{ token: string; user: User }>;
      changePassword: Post<{ oldPassword: string; newPassword: string }>;
      updateProfile: Patch<{ name?: string; image?: string }>;
   };
   SUPER_ADMIN: {
      getProfile: Get<undefined, User>;
      login: (data: {
         email: string;
         password: string;
      }) => Promise<{ token: string; user: User }>;
      changePassword: Post<{ oldPassword: string; newPassword: string }>;
      updateProfile: Patch<{ name?: string; image?: string }>;
   };
};

export const authApi: AuthApi = {
   [ROLE_NAME.ADMIN]: {
      getProfile: async () => {
         const res = await fetch('admin/auth/profile');

         const { data } = res.data;

         return data as User;
      },

      login: async (data) => {
         const res = await fetch('admin/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
         });

         const { data: d } = res.data;

         return d as { token: string; user: User };
      },
      changePassword: async (data) => {
         const res = await fetch('admin/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
         });

         return res.data as IMessage;
      },
      updateProfile: async (data) => {
         const res = await fetch('admin/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
            cache: 'no-store',
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getProfile: async () => {
         const res = await fetch('super-admin/auth/profile');

         const { data } = res.data;

         return data as User;
      },

      login: async (data) => {
         const res = await fetch('super-admin/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
         });

         const { data: d } = res.data;

         return d as { token: string; user: User };
      },
      changePassword: async (data) => {
         const res = await fetch('super-admin/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(data),
            cache: 'no-store',
         });

         return res.data as IMessage;
      },
      updateProfile: async (data) => {
         const res = await fetch('super-admin/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
            cache: 'no-store',
         });

         return res.data as IMessage;
      },
   },
};
