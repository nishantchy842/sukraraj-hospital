import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IMessage } from '@/interface';
import type { BasicInformation } from '@/models/admin/basic-information';

type BasicInformationApi = {
   ADMIN: {
      getBasicInformation: Get<undefined, BasicInformation>;
      updateBasicInformation: Patch<Partial<BasicInformation>>;
   };
   SUPER_ADMIN: {
      getBasicInformation: Get<undefined, BasicInformation>;
      updateBasicInformation: Patch<Partial<BasicInformation>>;
   };
};

export const basicInformationApi: BasicInformationApi = {
   [ROLE_NAME.ADMIN]: {
      getBasicInformation: async () => {
         const res = await fetch(`admin/basic-information`);

         const { data } = res.data;

         return data as BasicInformation;
      },
      updateBasicInformation: async (data) => {
         const res = await fetch(`admin/basic-information`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getBasicInformation: async () => {
         const res = await fetch(`super-admin/basic-information`);

         const { data } = res.data;

         return data as BasicInformation;
      },
      updateBasicInformation: async (data) => {
         const res = await fetch(`super-admin/basic-information`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
