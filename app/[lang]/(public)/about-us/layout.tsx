'use client';
import React, { type ReactNode } from 'react';
import { type Locale } from '@/i18n';
import Breakcrumb from '@/app/components/common/breadcrumb';
import AboutUsSidebar from './sidebar';
import { usePathname } from 'next/navigation';
import { translate } from '@/utils/commonRule';

export default function AboutUsLayout({
   children,
   params: { lang },
}: {
   children: ReactNode;
   params: { lang: Locale };
}) {
   const pathname = usePathname();

   const getPath = () => {
      const path = pathname.split('/');
      const last = path[path.length - 1];

      // if (last === 'about-us') {
      //    return lang === 'en' ? 'Introduction' : 'asfas';
      // } else {
      //    return last;
      // }

      switch (last) {
         case 'about-us':
            return lang === 'en' ? 'Introduction' : 'परिचय';
         case 'staff-details':
            return lang === 'en' ? 'Staff details' : 'कर्मचारी विवरण';
         case 'development-committee':
            return translate(lang, 'Development committee', 'विकास समिति');
         case 'organogram':
            return translate(lang, 'Organogram', 'संगठनात्मक संरचना');
         case 'citizen-charter':
            return translate(lang, 'Citizen charter', 'नागरिक बडापत्र');
         case 'future-plans':
            return translate(lang, 'Future plans', 'भविष्यका योजनाहरू');
         case 'ward-incharge':
            return translate(lang, 'Ward Incharge', 'वार्ड इन्चार्ज');
         default:
            return last;
      }
   };

   return (
      <section>
         <div className='bg-[#F2F2F2] px-[60px] py-[12px] md:px-[50px] sm:px-[20px]'>
            <span className='mx-auto flex max-w-[1440px]  items-center  justify-between'>
               <Breakcrumb title={getPath()} />
            </span>
         </div>
         <section className=' mt-[40px] px-[60px] md:mb-[40px] md:px-[50px]  sm:mt-[20px] sm:px-[0px]'>
            <article className='mx-auto  flex  max-w-[1440px] gap-x-[31px] md:flex-col sm:flex-col'>
               <AboutUsSidebar lang={lang} />
               <main className='w-full md:mt-[35px] '>{children}</main>
            </article>
         </section>
      </section>
   );
}
