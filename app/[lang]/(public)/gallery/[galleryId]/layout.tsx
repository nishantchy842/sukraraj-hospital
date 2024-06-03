import { getGalleryDetails } from '@/api/gallery';
import { getDictionary } from '@/app/[lang]/dictionaries';
import Breakcrumb from '@/app/components/common/breadcrumb';
import { type Locale } from '@/i18n';
import { BASE_IMAGE_URL, BASE_URL } from '@/utils/apiUrl';
import { translate } from '@/utils/commonRule';
import type { Metadata } from 'next';
import SEO_image from '@/public/seo_image.png';
import React from 'react';

type Props = {
   params: { galleryId: string; lang: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const id = params.galleryId;

   const lang = params.lang;

   const product = await getGalleryDetails(id);

   return {
      title: lang === 'en' ? product.title_En : product.title_Np,
      openGraph: {
         title: translate(lang, product.title_En, product.title_Np ?? ''),
         images: [BASE_IMAGE_URL + product.coverImage, SEO_image.src],
         description: translate(lang, product.title_En, product.title_Np ?? ''),
         url: `${BASE_URL}/gallery/${product.slug}`,
         publishedTime: product.createdAt.toString(),
         modifiedTime: product.updatedAt.toString(),
      },
   };
}

async function getData(id: string) {
   const res = await getGalleryDetails(id);
   return res;
}

export default async function GalleryDetailsLayout({
   children,
   params: { lang, galleryId },
}: {
   children: React.ReactNode;
   params: { lang: Locale; galleryId: string };
}) {
   const dictionary = await getDictionary(lang);
   const detailsData = await getData(galleryId);

   return (
      <section>
         <div className='  bg-[#F2F2F2] px-[60px] py-[12px] sm:px-[20px]'>
            <span className='mx-auto flex max-w-[1440px]  items-center  justify-between'>
               <Breakcrumb
                  title={translate(
                     lang,
                     detailsData.title_En ?? '',
                     detailsData.title_Np ?? ''
                  )}
                  extra={{
                     title: dictionary.navList.gallery,
                     pathname: 'gallery',
                  }}
               />
            </span>
         </div>
         <main>{children}</main>
      </section>
   );
}
