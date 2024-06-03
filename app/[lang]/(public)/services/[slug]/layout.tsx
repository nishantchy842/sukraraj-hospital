import React, { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { type Locale } from '@/i18n';
import Breakcrumb from '@/app/components/common/breadcrumb';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { getSevivesDetails } from '@/api/services';
import { translate } from '@/utils/commonRule';
import { BASE_IMAGE_URL, BASE_URL } from '@/utils/apiUrl';
import SEO_IMAGE from '@/public/seo_image.png';
import he from 'he';
import { EmergencyCard } from './@sidebar';

type Props = {
   params: { slug: string; lang: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const id = params.slug;

   const lang = params.lang;

   const product = await getSevivesDetails(id);

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
         images: [BASE_IMAGE_URL + product.image ?? SEO_IMAGE],
         url: `${BASE_URL}/services/${product.slug}`,
         publishedTime: product.createdAt.toString(),
         modifiedTime: product.updatedAt.toString(),
      },
   };
}

async function getData(slug: string) {
   const res = await getSevivesDetails(slug);
   return res;
}

export default async function DepartmentLayout({
   children,
   params: { lang, slug },
   sidebar,
}: {
   children: React.ReactNode;
   params: { lang: Locale; slug: string };
   sidebar: ReactNode;
}) {
   const dictionary = await getDictionary(lang);
   const detailsData = await getData(slug);

   return (
      <section>
         <div className='  bg-[#F2F2F2] px-[60px] py-[12px] sm:px-[20px]'>
            <span className='mx-auto flex max-w-[1440px]  items-center  justify-between'>
               <Breakcrumb
                  title={
                     lang === 'en'
                        ? detailsData?.title_En
                        : detailsData?.title_Np ?? detailsData?.title_En
                  }
                  extra={{
                     title: dictionary.navList.services,
                     pathname: 'services',
                  }}
               />
            </span>
         </div>
         <section className='  mt-[40px] px-[60px] md:px-[50px] sm:mb-[23px] sm:mt-[15px] sm:px-[20px]'>
            <article className='mx-auto  flex max-w-[1440px] gap-x-[31px] md:gap-x-[20px] sm:flex-col'>
               {sidebar}
               <div className='w-full'>
                  <main className='w-full sm:mb-[31px]'>{children}</main>
                  <div className='hidden md:hidden sm:block'>
                     <EmergencyCard />
                  </div>
               </div>
            </article>
         </section>
      </section>
   );
}
