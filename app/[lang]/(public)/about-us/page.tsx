import { withHydration } from '@/providers/withHydration';
import AboutUs from '.';
import { getAboutUs } from '@/api/aboutUs';
import { queryKeys } from '@/utils';
import { ABOUTUS } from '@/constants/querykeys';
import type { Metadata } from 'next';
import { type Locale } from '@/i18n';
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
         default: `${translate(lang, 'About us', 'हाम्रोबारे')}`,
         template: `%s | ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
      },
      description: translate(lang, 'About us', 'हाम्रोबारे'),
      openGraph: {
         title: ` ${translate(lang, 'About us', 'हाम्रोबारे')} 
         |
         ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
         description: translate(lang, 'About us', 'हाम्रोबारे'),
         images: [SEO_IMAGE.src],
         url: BASE_URL + 'about-us',
      },
   };
}

export default withHydration(AboutUs, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: getAboutUs,
      queryKey: queryKeys(ABOUTUS).lists(),
   });
   return queryClient;
});
