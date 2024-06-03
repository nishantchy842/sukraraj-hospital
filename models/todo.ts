export type Todo = {
   id: number;
   title: string;
   completed: boolean;
   userId: number;
};

export type BasicInfo = {
   id: number;
   openingHours: string[];
   emergencyHotlines: string[];
   generalInquiries: string[];
   emails: string[];
   opdSchedules: string[];
   createdAt: Date;
   updatedAt: Date;
};

export type DailyCapacity = {
   value: string | number;
   id: number;
   key_En: string;
   key_Np: string;
   createdAt: Date;
   updatedAt: Date;
};
