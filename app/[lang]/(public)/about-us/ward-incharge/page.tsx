import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { ABOUTUS_STAFF_DETAILS } from '@/constants/querykeys';
import { MEMBER } from '@/enums/privilege';
import { getAllMember } from '@/api/member';
import type { Metadata } from 'next';
import { translate } from '@/utils/commonRule';
import { type Locale } from '@/i18n';
import { BASE_URL } from '@/utils/apiUrl';
import SEO_IMAGE from '@/public/seo_image.png';
import WardInCharge from '.';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: translate(lang, 'Ward Incharge', 'वार्ड इन्चार्ज'),
      openGraph: {
         title: translate(lang, 'Ward Incharge', 'वार्ड इन्चार्ज'),
         description: translate(lang, '', 'वार्ड इन्चार्ज'),
         url: BASE_URL + 'ward-incharge',
         images: [SEO_IMAGE.src],
      },
   };
}

export default withHydration(WardInCharge, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).detail(MEMBER.WARD_INCHARGE),
      queryFn: () => getAllMember({ type: MEMBER.WARD_INCHARGE }),
   });
   return queryClient;
});
