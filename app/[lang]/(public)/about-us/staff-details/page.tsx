import { withHydration } from '@/providers/withHydration';
import StaffDetails from '.';
import { queryKeys } from '@/utils';
import { ABOUTUS_STAFF_DETAILS } from '@/constants/querykeys';
import { MEMBER } from '@/enums/privilege';
import { getAllMember } from '@/api/member';
import type { Metadata } from 'next';
import { translate } from '@/utils/commonRule';
import { type Locale } from '@/i18n';
import { BASE_URL } from '@/utils/apiUrl';
import SEO_IMAGE from '@/public/seo_image.png';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: translate(lang, 'Staff Details', 'कर्मचारी विवरण'),
      openGraph: {
         title: translate(lang, 'Staff Details', 'कर्मचारी विवरण'),
         description: translate(lang, 'Staff Details', 'कर्मचारी विवरण'),
         url: BASE_URL + 'staff-details',
         images: [SEO_IMAGE.src],
      },
   };
}

export default withHydration(StaffDetails, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).detail(MEMBER.STAFF),
      queryFn: () => getAllMember({ type: MEMBER.STAFF }),
   });
   return queryClient;
});
