import { withHydration } from '@/providers/withHydration';
import DevelopmentCommittee from '.';
import { queryKeys } from '@/utils';
import { ABOUTUS_STAFF_DETAILS } from '@/constants/querykeys';
import { MEMBER } from '@/enums/privilege';
import { getAllMember } from '@/api/member';
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
      title: translate(lang, 'Development committee', 'विकास समिति'),
      openGraph: {
         title: translate(lang, 'Development committee', 'विकास समिति'),
         description: translate(lang, 'Development committee', 'विकास समिति'),
         url: BASE_URL + 'about-us/development-committee',
         images: [SEO_IMAGE.src],
      },
   };
}
export default withHydration(DevelopmentCommittee, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).detail(
         MEMBER.DEVELOPMENT_COMMITTEE
      ),
      queryFn: () => getAllMember({ type: MEMBER.DEVELOPMENT_COMMITTEE }),
   });

   await queryClient.prefetchQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).detail(MEMBER.BOARD_MEMBER),
      queryFn: () => getAllMember({ type: MEMBER.BOARD_MEMBER }),
   });

   return queryClient;
});
