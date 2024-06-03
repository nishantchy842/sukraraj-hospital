import { withHydration } from '@/providers/withHydration';
import Organogram from '.';
import { getAboutUs } from '@/api/aboutUs';
import { queryKeys } from '@/utils';
import { ABOUTUS } from '@/constants/querykeys';
import type { Metadata } from 'next';
import { type Locale } from '@/i18n';
import { translate } from '@/utils/commonRule';
import { BASE_URL } from '@/utils/apiUrl';
import SEO_IMAGE from '@/public/seo_image.png';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: translate(lang, 'Organogram', 'अर्गानोग्राम'),
      openGraph: {
         title: translate(lang, 'Organogram', 'अर्गानोग्राम'),
         description: translate(lang, 'Organogram', 'अर्गानोग्राम'),
         url: BASE_URL + 'about-us/organogram',
         images: [SEO_IMAGE.src],
      },
   };
}

export default withHydration(Organogram, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: getAboutUs,
      queryKey: queryKeys(ABOUTUS).lists(),
   });
   return queryClient;
});
