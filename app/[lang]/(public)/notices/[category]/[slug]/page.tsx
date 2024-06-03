import { withHydration } from '@/providers/withHydration';
import NoticeDetails from '.';
import { getAllNotice, getSingleNoticeDetails } from '@/api/notice';
import { queryKeys } from '@/utils';
import { NOTICE } from '@/constants/querykeys';
import type { Metadata, ResolvingMetadata } from 'next';
import type { Locale } from '@/i18n';
import { translate } from '@/utils/commonRule';
import { BASE_IMAGE_URL, BASE_URL } from '@/utils/apiUrl';
import he from 'he';

type Props = {
   params: { slug: string; lang: Locale };
};

export async function generateMetadata(
   { params }: Props,
   parent: ResolvingMetadata
): Promise<Metadata> {
   const id = params.slug;

   const lang = params.lang;

   const product = await getSingleNoticeDetails(id);

   const previousImages = (await parent).openGraph?.images ?? [];

   return {
      title: lang === 'en' ? product.title_En : product.title_Np,
      description: translate(
         lang,
         he.decode((product.content_En ?? '')?.replace(/<[^>]+>/g, '')),
         he.decode((product.content_Np ?? '')?.replace(/<[^>]+>/g, ''))
      ),
      openGraph: {
         title: `${translate(
            lang,
            product.title_En,
            product.title_Np ?? product.title_En
         )} | ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
         description: translate(
            lang,
            he.decode((product.content_En ?? '')?.replace(/<[^>]+>/g, '')),
            he.decode((product.content_Np ?? '')?.replace(/<[^>]+>/g, ''))
         ),
         images: [
            BASE_IMAGE_URL + product.previewImage ?? '',
            ...previousImages,
         ],
         url: `${BASE_URL}/research/${product.slug}`,
         publishedTime: product.createdAt.toString(),
         modifiedTime: product.updatedAt.toString(),
      },
   };
}

export default withHydration(
   NoticeDetails,
   async (queryClient, { params: { slug } }) => {
      await queryClient.prefetchQuery({
         queryFn: () => getSingleNoticeDetails(slug),
         queryKey: queryKeys(NOTICE).detail(slug),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getAllNotice({ pagination: false }),
         queryKey: queryKeys(NOTICE).detail('OTHER_NOTICE'),
      });
      return queryClient;
   }
);
