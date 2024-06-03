import { getSingleClientConcernCategory } from '@/api/clientConcent';
import { type Locale } from '@/i18n';
import { translate } from '@/utils/commonRule';
import type { Metadata } from 'next';
import React from 'react';
import SEO_IMAGE from '@/public/seo_image.png';
import { BASE_URL } from '@/utils/apiUrl';
import { InqueryCard } from './@sidebar';

type Props = {
   params: { category: string; lang: Locale };
   sidebar: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const id = params.category;

   const lang = params.lang;

   const product = await getSingleClientConcernCategory(id);

   return {
      title: lang === 'en' ? product.title_En : product.title_Np,
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
         url: `${BASE_URL}/client-concern/${product.slug}`,
         publishedTime: product.createdAt.toString(),
         modifiedTime: product.updatedAt.toString(),
      },
   };
}

export default function ClientConcernLayout({
   children,
}: {
   children: React.ReactNode;
   sidebar: React.ReactNode;
}) {
   return (
      <div>
         <main className='w-full'>{children}</main>
         <div className='hidden md:hidden sm:mt-[33px] sm:block sm:px-[20px]'>
            <InqueryCard />
         </div>
      </div>
   );
}
