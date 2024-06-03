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
         default: translate(lang, 'OPD Schedule', 'ओपीडी तालिका '),
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
         title: ` ${translate(lang, 'OPD Schedule', 'ओपीडी तालिका ')} 
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
         url: BASE_URL + 'opd-schedule',
         images: [SEO_IMAGE?.src],
      },
   };
}
export default function NoticeLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <main className='w-full'>{children}</main>;
}
