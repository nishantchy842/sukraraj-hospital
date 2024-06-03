import { type User } from './user';
import { type Research } from './research';
import { type RESEARCH_CATEGORY_STATUS } from '@/enums/research-category';

export type ResearchCategory = {
   id: number;
   title_En: string;
   slug: string;
   status?: RESEARCH_CATEGORY_STATUS;
   createdAt: Date;
   updatedAt: Date;
   researches?: Research[];
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
}>;
