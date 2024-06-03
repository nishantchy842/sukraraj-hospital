import type { Metadata } from 'next';
import React from 'react';

import SEO_IMAGE from '@/public/seo_image.png';
import { type Locale } from '@/i18n';
import { translate } from '@/utils/commonRule';
import { BASE_URL } from '@/utils/apiUrl';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: {
         default: translate(lang, 'Units', 'एकाइहरू'),
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
         title: ` ${translate(lang, 'Units', 'एकाइहरू')} 
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
         url: BASE_URL + 'units',
         images: [SEO_IMAGE?.src],
      },
   };
}

export default async function DepartmentLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <section>
         <main>{children}</main>
      </section>
   );
}
