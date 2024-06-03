import { type User } from './user';
import { type ResearchCategory } from './research-category';
import { type RESEARCH_STATUS } from '@/enums/research';

export type Research = {
   id: number;
   title_En: string;
   slug: string;
   status?: RESEARCH_STATUS;
   createdAt: Date;
   updatedAt: Date;
   researchCategory?: ResearchCategory;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
   content_En: string;
   content_Np: string;
   previewImage: string;
   downloadFile: string;
}>;
