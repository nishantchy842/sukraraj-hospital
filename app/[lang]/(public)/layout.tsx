import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StyledComponentsRegistry from '@/providers/AntRegistry';

import SubHeader from '@/app/components/common/subHeader';
import Footer from '@/app/components/common/footer';
import {
   FoatingButton,
   FoatingButtonBook,
} from '@/app/components/common/floatingButton';
import Topbar from '@/app/components/common/topBar';
import { type Locale } from '@/i18n';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { getDictionary } from '../dictionaries';
import GotoTop from '@/app/components/common/gotoTop';
import SubFooter from '@/app/components/common/subFooter';
import { withHydration } from '@/providers/withHydration';
import { getBasicInformation } from '@/api/home';
import {
   BASICINFO,
   CLIENT_CONCERN_CATEGORY,
   INFORMATION_OFFICER,
   NOTICE,
} from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { getAllNotice } from '@/api/notice';
import { type Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { translate } from '@/utils/commonRule';
import { BASE_URL } from '@/utils/apiUrl';
import SEO_IMAGE from '@/public/seo_image.png';
import { getAllMember } from '@/api/member';
import { MEMBER } from '@/enums/privilege';
import { getAllClientConcernCategory } from '@/api/clientConcent';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
   params: { lang },
}: {
   params: { lang: Locale };
}): Promise<Metadata> {
   return {
      title: {
         default: translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         ),
         template: `%s | ${translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         )}`,
      },
      description: translate(
         lang,
         'Sukraraj Tropical & Infectious Disease Hospital',
         'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
      ),
      openGraph: {
         title: translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         ),
         description: translate(
            lang,
            'Sukraraj Tropical & Infectious Disease Hospital',
            'शुक्रराज ट्रपिकल तथा सरुवारोग अस्पताल'
         ),
         url: BASE_URL,
         images: [SEO_IMAGE.src],
      },
   };
}

const RootLayout = async ({
   children,
   params: { lang },
}: {
   children: React.ReactNode;
   params: { lang: Locale };
}) => {
   const { navList, info } = await getDictionary(lang);
   return (
      <html lang={lang}>
         <body>
            <NextTopLoader />
            <section id={'main_layout'}>
               <StyledComponentsRegistry>
                  <ToastContainer />
                  <Topbar data={info} navList={navList} lang={lang} />
                  <SubHeader navList={navList} lang={lang} />
                  <FoatingButton />
                  <FoatingButtonBook />
                  <section className=' '>
                     <main className='mb-[60px] min-h-screen md:mb-[40px] sm:mb-[40px]'>
                        {children}
                     </main>
                  </section>
                  <Footer lang={lang as Locale} />
                  <GotoTop />
                  <SubFooter lang={lang} />
               </StyledComponentsRegistry>
            </section>
         </body>
      </html>
   );
};

export default withHydration(RootLayout, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getBasicInformation(),
      queryKey: queryKeys(BASICINFO).lists(),
   });

   await queryClient.prefetchQuery({
      queryFn: () => getAllNotice({ pagination: false, isPopup: true }),
      queryKey: queryKeys(NOTICE).list({ isPopup: true }),
   });

   await queryClient.prefetchQuery({
      queryFn: () => getAllMember({ type: MEMBER.INFORMATION_OFFICER }),
      queryKey: queryKeys(INFORMATION_OFFICER).detail(INFORMATION_OFFICER),
   });

   await queryClient.prefetchQuery({
      queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).detail('header'),
      queryFn: () => getAllClientConcernCategory({ pagination: true, size: 1 }),
   });

   return queryClient;
});
