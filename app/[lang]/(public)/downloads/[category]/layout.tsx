import { getSingleResourceCategory } from '@/api/downloadResource';
import type { Locale } from '@/i18n';
import { translate } from '@/utils/commonRule';
import type { Metadata } from 'next';
import React, { type ReactNode } from 'react';
import SEO_IMAGE from '@/public/seo_image.png';
import { BASE_URL } from '@/utils/apiUrl';

type Props = {
   params: { category: string; lang: Locale };
   sidebar: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const id = params.category;

   const lang = params.lang;

   const product = await getSingleResourceCategory(id);

   return {
      title: {
         default: lang === 'en' ? product.title_En : product.title_Np ?? '',
         template: '%s | Sukraraj Tropical & Infectious Disease Hospital',
      },
      openGraph: {
         title: `${translate(
            lang,
            product.title_En,
            product.title_Np ?? product.title_En
         )} | ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
         description: translate(
            lang,
            product.title_En ?? '',
            product.title_Np ?? ''
         ),
         images: [SEO_IMAGE.src],
         url: `${BASE_URL}/downloads/${product.slug}`,
         publishedTime: product.createdAt.toString(),
         modifiedTime: product.updatedAt.toString(),
      },
   };
}

export default function DownloadResourceLayout({
   children,
}: {
   children: React.ReactNode;
   sidebar: React.ReactNode;
}) {
   return <main className='w-full'>{children}</main>;
}
