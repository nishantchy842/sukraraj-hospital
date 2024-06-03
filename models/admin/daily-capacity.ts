import { type User } from './user';
import { type DAILY_CAPACITY_STATUS } from '@/enums/daily-capacity';

export type DailyCapacity = {
   id: number;
   key_En: string;
   key_Np: string;
   value: number;
   status?: DAILY_CAPACITY_STATUS;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
};
