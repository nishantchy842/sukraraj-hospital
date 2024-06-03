import type {
   MEMBER_EXTRA_TYPE,
   MEMBER_STATUS,
   MEMBER_TYPE,
} from '@/enums/member';
import { type DepartmentDetails } from './departments';
import { type User } from './user';

export type boardMessage = {
   imageUrl: string;
   name: string;
   role: string;
   facebookUrl?: string;
   twitterUrl?: string;
   viberUrl?: string;
   message: string | null;
};

export type AboutUsObjective = boardMessage & {
   objectiveSpecificProperty?: string;
};

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

export type AdminAboutUs = Omit<AboutUs, 'status' | ''>;

export type Member = {
   id: string;
   name_En: string;
   type: MEMBER_TYPE;
   status?: MEMBER_STATUS;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
   priority: number;
} & Nullable<{
   name_Np: string;
   position_En: string;
   position_Np: string;
   image: string;
   message_En: string;
   message_Np: string;
   phoneNumbers: string[];
   emails: string[];
   extraType: MEMBER_EXTRA_TYPE;
   department?: DepartmentDetails;
}>;
