import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import type { IMessage } from '@/interface';
import type { DailyCapacity } from '@/models/admin/daily-capacity';

type DailyCapacityApi = {
   ADMIN: {
      getDailyCapacity: Get<undefined, DailyCapacity[]>;
      createDailyCapacity: Post<DailyCapacity>;
      updateDailyCapacity: Patch<
         Partial<DailyCapacity> & Pick<DailyCapacity, 'id'>
      >;
   };
   SUPER_ADMIN: {
      getDailyCapacity: Get<undefined, DailyCapacity[]>;
      createDailyCapacity: Post<DailyCapacity>;
      updateDailyCapacity: Patch<
         Partial<DailyCapacity> & Pick<DailyCapacity, 'id'>
      >;
   };
};

export const dailyCapacityApi: DailyCapacityApi = {
   [ROLE_NAME.ADMIN]: {
      getDailyCapacity: async () => {
         const res = await fetch(`admin/daily-capacity/`);

         const { data } = res.data;

         return data as DailyCapacity[];
      },
      createDailyCapacity: async (data) => {
         const res = await fetch(`admin/daily-capacity`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateDailyCapacity: async ({ id, ...data }) => {
         const res = await fetch(`admin/daily-capacity/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getDailyCapacity: async () => {
         const res = await fetch(`super-admin/daily-capacity`);

         const { data } = res.data;

         return data as DailyCapacity[];
      },
      createDailyCapacity: async (data) => {
         const res = await fetch(`super-admin/daily-capacity`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateDailyCapacity: async ({ id, ...data }) => {
         const res = await fetch(`super-admin/daily-capacity/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
