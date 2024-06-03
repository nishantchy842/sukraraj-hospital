import { withHydration } from '@/providers/withHydration';
import CitizenCharter from '.';
import { queryKeys } from '@/utils';
import { ABOUTUS } from '@/constants/querykeys';
import { getAboutUs } from '@/api/aboutUs';
import type { Metadata } from 'next';
import { translate } from '@/utils/commonRule';
import { BASE_URL } from '@/utils/apiUrl';
import SEO_IMAGE from '@/public/seo_image.png';
import { type Locale } from '@/i18n';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: translate(lang, 'Citizen charter', 'नागरिक बडापत्र'),
      openGraph: {
         title: translate(lang, 'Citizen charter', 'नागरिक बडापत्र'),
         description: translate(lang, 'Citizen charter', 'नागरिक बडापत्र'),
         url: BASE_URL + 'about-us/citizen-charter',
         images: [SEO_IMAGE.src],
      },
   };
}

export default withHydration(CitizenCharter, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAboutUs(),
      queryKey: queryKeys(ABOUTUS).lists(),
   });
   return queryClient;
});
