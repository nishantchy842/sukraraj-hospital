import { withHydration } from '@/providers/withHydration';
import FuturePlans from '.';
import { getAboutUs } from '@/api/aboutUs';
import { queryKeys } from '@/utils';
import { ABOUTUS } from '@/constants/querykeys';
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
      title: translate(lang, 'Future plans', 'भविष्यका योजनाहरू'),
      openGraph: {
         title: translate(lang, 'Future plans', 'भविष्यका योजनाहरू'),
         description: translate(lang, 'Future plans', 'भविष्यका योजनाहरू'),
         url: BASE_URL + 'about-us/future-plans',
         images: [SEO_IMAGE.src],
      },
   };
}

export default withHydration(FuturePlans, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAboutUs(),
      queryKey: queryKeys(ABOUTUS).lists(),
   });
   return queryClient;
});
