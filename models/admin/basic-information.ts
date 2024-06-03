import { type User } from './user';

export type BasicInformation = {
   id: number;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   openingHours: string[];
   emergencyHotlines: string[];
   generalInquiries: string[];
   emails: string[];
   opdSchedules: string[];
}>;
