import { fetch } from '..';
import { ROLE_NAME } from '@/enums/role';
import { GALLERY_STATUS } from '@/enums/gallery';
import type { IGetAll, IMessage, IQueryParamaters } from '@/interface';
import type { Gallery } from '@/models/admin/gallery';

type GalleryApi = {
   ADMIN: {
      getGallerys: GetAll<IQueryParamaters & { title?: string }, Gallery>;
      getGallery: Get<Gallery['slug'], Gallery>;
      createGallery: Post<Gallery>;
      updateGallery: Patch<Partial<Gallery> & Pick<Gallery, 'slug'>>;
   };
   SUPER_ADMIN: {
      getGallerys: GetAll<
         IQueryParamaters &
            Partial<Pick<Gallery, 'status'>> & { title?: string },
         Gallery
      >;
      getGallery: Get<Gallery['slug'], Gallery>;
      createGallery: Post<Gallery>;
      updateGallery: Patch<Partial<Gallery> & Pick<Gallery, 'slug'>>;
   };
};

export const galleryApi: GalleryApi = {
   [ROLE_NAME.ADMIN]: {
      getGallerys: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
      }) => {
         const res = await fetch(
            `admin/gallery?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&title=${title}`
         );

         return res.data as IGetAll<Gallery>;
      },
      getGallery: async (slug) => {
         const res = await fetch(`admin/gallery/${slug}`);

         const { data } = res.data;

         return data as Gallery;
      },
      createGallery: async (data) => {
         const res = await fetch(`admin/gallery`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateGallery: async ({ slug, ...data }) => {
         const res = await fetch(`admin/gallery/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },

   [ROLE_NAME.SUPER_ADMIN]: {
      getGallerys: async ({
         pagination = true,
         page = 1,
         size = 10,
         sort = '',
         order = '',
         title = '',
         status = GALLERY_STATUS.ACTIVE,
      }) => {
         const res = await fetch(
            `super-admin/gallery?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}&status=${status}&title=${title}`
         );

         return res.data as IGetAll<Gallery>;
      },
      getGallery: async (slug) => {
         const res = await fetch(`super-admin/gallery/${slug}`);

         const { data } = res.data;

         return data as Gallery;
      },
      createGallery: async (data) => {
         const res = await fetch(`super-admin/gallery`, {
            method: 'POST',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
      updateGallery: async ({ slug, ...data }) => {
         const res = await fetch(`super-admin/gallery/${slug}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
         });

         return res.data as IMessage;
      },
   },
};
