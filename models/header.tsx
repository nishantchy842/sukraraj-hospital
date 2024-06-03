import { type ReactElement } from 'react';

export type NavMenu = {
   home: string;
   about: string;
   contact: string;
   departments: string;
   gallery: string;
   opdSchedule: string;
   research: string;
   noticeBoard: string;
   downloads: string;
   dailyCensus: string;
   clientConcern: string;
   services: string;
};

export type ChildrenList = {
   label: string;
   key: string;
   icon?: ReactElement;
   children?: Array<{
      label: string;
      key: string | number;
      id?: string | number;
   }>;
};
