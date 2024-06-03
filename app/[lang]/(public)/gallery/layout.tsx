import React from 'react';
import { type Locale } from '@/i18n';
import type { Metadata } from 'next';

import { translate } from '@/utils/commonRule';
import SEO_IMAGE from '@/public/seo_image.png';
import { BASE_URL } from '@/utils/apiUrl';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: {
         default: translate(lang, 'Gallery', 'ग्यालेरी'),
         template: `%s | ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
      },
      description: translate(lang, 'Gallery', 'ग्यालेरी'),
      openGraph: {
         title: translate(lang, 'Gallery', 'ग्यालेरी'),
         description: translate(lang, 'Gallery', 'ग्यालेरी'),
         images: [SEO_IMAGE.src],
         url: BASE_URL + 'gallery',
      },
   };
}

export default async function GalleyLayout({
   children,
}: {
   children: React.ReactNode;
   params: { lang: Locale };
}) {
   return (
      <section>
         <main>{children}</main>
      </section>
   );
}
