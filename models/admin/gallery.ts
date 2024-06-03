import { type User } from './user';
import { type VIDEO_UPLOAD_TYPE, type GALLERY_STATUS } from '@/enums/gallery';

export type Image = {
   link: string;
   type?: VIDEO_UPLOAD_TYPE;
   description_En: string;
   description_Np: string;
   publishedDate: Date;
};

export type Video = {
   link: string;
   type: VIDEO_UPLOAD_TYPE;
   description_En: string;
   description_Np: string;
   publishedDate: Date;
};

export type Gallery = {
   id: number;
   title_En: string;
   slug: string;
   status?: GALLERY_STATUS;
   createdAt: Date;
   updatedAt: Date;
   createdBy?: User;
   updatedBy?: User;
} & Nullable<{
   title_Np: string;
   coverImage: string;
   images: Image[];
   imagesCount: number;
   videos: Video[];
   videosCount: number;
}>;
