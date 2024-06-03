import React, { type ReactNode } from 'react';
import { type Locale } from '@/i18n';
import Breakcrumb from '@/app/components/common/breadcrumb';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { getDepartmentDetails } from '@/api/departments';
import { translate } from '@/utils/commonRule';
import type { Metadata } from 'next';
import { BASE_IMAGE_URL, BASE_URL } from '@/utils/apiUrl';
import he from 'he';
import SEO_IMAGE from '@/public/seo_image.png';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { EmergencyCard } from '../../services/[slug]/@sidebar';

type Props = {
   params: { details: string; lang: Locale };
   sidebar: ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const id = params.details;

   const lang = params.lang;

   const product = await getDepartmentDetails(id);

   return {
      title: lang === 'en' ? product.name_En : product.name_Np,
      description: translate(
         lang,
         he.decode((product.content_En ?? '')?.replace(/<[^>]+>/g, '')),
         he.decode((product.content_Np ?? '')?.replace(/<[^>]+>/g, ''))
      ),
      openGraph: {
         title: `${translate(
            lang,
            product.name_En,
            product.name_En ?? product.name_En
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
         images: [BASE_IMAGE_URL + product.image ?? '', SEO_IMAGE.src],
         url: `${BASE_URL}/units/${product.slug}`,
         publishedTime: product.createdAt.toString(),
         modifiedTime: product.updatedAt.toString(),
      },
   };
}

async function getData(slug: string) {
   const res = await getDepartmentDetails(slug);
   return res;
}

export default async function DepartmentLayout({
   children,
   params: { lang, details },
   sidebar,
}: {
   children: React.ReactNode;
   params: { lang: Locale; details: string };
   sidebar: ReactNode;
}) {
   const dictionary = await getDictionary(lang);
   const detailsData = await getData(details);

   return (
      <section>
         <div className='  bg-[#F2F2F2] px-[60px] py-[12px] md:px-[50px] sm:px-[20px]'>
            <span className='mx-auto flex max-w-[1440px]  items-center  justify-between'>
               <Breakcrumb
                  title={translate(
                     lang,
                     detailsData.name_En ?? '-',
                     detailsData.name_Np ?? detailsData.name_En
                  )}
                  extra={{
                     title: dictionary.navList.departments,
                     pathname: 'departments',
                  }}
               />
            </span>
         </div>
         <section className=' mt-[40px] px-[60px] md:mt-[23px] md:px-[50px] sm:mb-[40px] sm:mt-[15px] sm:p-0'>
            <article className='mx-auto  flex max-w-[1440px] gap-x-[31px] md:grid md:grid-cols-[190px_1fr] md:gap-x-[20px] sm:flex-col sm:gap-x-[20px]'>
               {sidebar}
               <main className='w-full sm:mb-[20px]'>{children}</main>
               <div className='hidden md:hidden sm:block sm:px-[20px]'>
                  <EmergencyCard />
               </div>
            </article>
         </section>
      </section>
   );
}
