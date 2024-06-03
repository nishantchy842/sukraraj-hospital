import { getSingleResearchCategory } from '@/api/research';
import { type Locale } from '@/i18n';
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

   const product = await getSingleResearchCategory(id);

   return {
      title: {
         default: lang === 'en' ? product.title_En : product.title_Np,
         template: `%s - ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
      },
      description: translate(lang, product.title_En, product.title_Np ?? ''),
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
         url: `${BASE_URL}/research/${product.slug}`,
         publishedTime: product.createdAt.toString(),
         modifiedTime: product.updatedAt.toString(),
      },
   };
}

export default function ResearchLayout({
   children,
}: {
   children: React.ReactNode;
   sidebar: React.ReactNode;
}) {
   return <main className='mb-[40px] w-full'>{children}</main>;
}
