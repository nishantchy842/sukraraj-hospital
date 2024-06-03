import { type User } from './user';

export type AboutUs = {
   id: number;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   history_En: string;
   history_Np: string;
   images: string[];
   mission_En: string;
   mission_Np: string;
   vision_En: string;
   vision_Np: string;
   value_En: string;
   value_Np: string;
   objectives_En: string;
   objectives_Np: string;
   citizenCharterFileName: string;
   citizenCharterFileLink: string;
   organogramFileLink: string;
   citizenCharter: string;
   futurePlan_En: string;
   futurePlan_Np: string;
}>;
