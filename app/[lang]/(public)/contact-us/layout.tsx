import React from 'react';
import { type Locale } from '@/i18n';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { getDictionary } from '../../dictionaries';
import Breakcrumb from '@/app/components/common/breadcrumb';
import type { Metadata } from 'next';
import { translate } from '@/utils/commonRule';
import { BASE_URL } from '@/utils/apiUrl';
import SEO_IMAGE from '@/public/seo_image.png';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: {
         default: translate(
            lang,
            'Contact us | Sukraraj Tropical & Infectious Disease Hospital',
            'सम्पर्क गर्नुहोस | शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         ),
         template: `%s | ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
      },
      description: translate(
         lang,
         'Contact us | Sukraraj Tropical & Infectious Disease Hospital',
         'सम्पर्क गर्नुहोस | शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
      ),
      openGraph: {
         title: translate(
            lang,
            'Contact us | Sukraraj Tropical & Infectious Disease Hospital',
            'सम्पर्क गर्नुहोस | शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         ),
         description: translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         ),
         url: BASE_URL,
         images: [SEO_IMAGE.src],
      },
   };
}

export default async function ContactLayout({
   children,
   params: { lang },
}: {
   children: React.ReactNode;
   params: { lang: Locale };
}) {
   const dictionary = await getDictionary(lang);

   return (
      <section>
         <div className='  bg-[#F2F2F2] px-[60px] py-[12px] md:px-[50px] sm:px-[20px]'>
            <span className='mx-auto flex max-w-[1440px]  items-center  justify-between'>
               <Breakcrumb title={dictionary.navList.contact} />
            </span>
         </div>
         <section className='px-[60px] md:px-[50px] sm:px-[20px]'>
            <article className='mx-auto max-w-[1440px]'>
               <main>{children}</main>
            </article>
         </section>
      </section>
   );
}
