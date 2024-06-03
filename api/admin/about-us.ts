import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { AboutUs } from '@/models/admin/about-us';
import type { IMessage } from '@/interface';

type AboutUsApi = {
   ADMIN: {
      getAboutUs: Get<undefined, AboutUs>;
      updateAboutUs: Patch<Partial<AboutUs>>;
   };
   SUPER_ADMIN: {
      getAboutUs: Get<undefined, AboutUs>;
      updateAboutUs: Patch<Partial<AboutUs>>;
   };
};

export const aboutUsApi: AboutUsApi = {
   [ROLE_NAME.ADMIN]: {
      getAboutUs: async () => {
         const res = await fetch('admin/about-us');

         const { data } = res.data;

         return data as AboutUs;
      },
      updateAboutUs: async (data) => {
         const res = await fetch(`admin/about-us`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getAboutUs: async () => {
         const res = await fetch('super-admin/about-us');

         const { data } = res.data;

         return data as AboutUs;
      },
      updateAboutUs: async (data) => {
         const res = await fetch(`super-admin/about-us`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
