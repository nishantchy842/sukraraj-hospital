import { type IGetAll, type IQueryParamaters } from '@/interface';
import { type GalleryDetails, type Gallery } from '@/models/gallery';
import { fetch } from '.';

export const getAllGallery: GetAll<
   IQueryParamaters & { title?: string },
   Gallery
> = async ({
   pagination = true,
   page = 1,
   size = 10,
   sort = 'updatedAt',
   order = 'DESC',
   title = '',
}) => {
   const res = await fetch(
      `gallery?pagination=${pagination}&page=${page}&size=${size}&sort=${String(sort)}&order=${order}&title=${title}`,
      {
         cache: 'no-store',
      }
   );
   const { data } = res;

   return data as IGetAll<Gallery>;
};

export const getGalleryDetails: Get<string, GalleryDetails> = async (slug) => {
   const res = await fetch(`gallery/${slug}`, {
      cache: 'no-store',
   });

   const { data } = res.data;

   return data as GalleryDetails;
};
