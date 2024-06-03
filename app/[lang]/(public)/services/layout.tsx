import { type Locale } from '@/i18n';
import { BASE_URL } from '@/utils/apiUrl';
import { translate } from '@/utils/commonRule';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import SEO_IMAGE from '@/public/seo_image.png';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: {
         default: translate(lang, 'Services', 'सेवाहरू'),
         template: `%s | ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
      },
      description: translate(
         lang,
         'Services | Sukraraj Tropical & Infectious Disease Hospital',
         'सेवाहरू | शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
      ),
      openGraph: {
         title: ` ${translate(lang, 'Services', 'सेवाहरू')} 
            |
            ${translate(
               lang,
               'Sukraraj Tropical & Infectious Disease Hospital',
               'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
            )}`,
         description: translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         ),
         url: BASE_URL + 'services',
         images: [SEO_IMAGE?.src],
      },
   };
}

export default async function ServicesLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   if (!children) {
      notFound();
   }
   return (
      <section>
         <main>{children}</main>
      </section>
   );
}
