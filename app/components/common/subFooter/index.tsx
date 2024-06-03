/* eslint-disable tailwindcss/no-custom-classname */
'use client';

import { getAllNotice } from '@/api/notice';
import { NOTICE } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { redirectedPathName, translate } from '@/utils/commonRule';
import { useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import Link from 'next/link';
import React from 'react';
import Marquee from 'react-fast-marquee';

export default function SubFooter({ lang }: { lang: Locale }) {
   const { data: news } = useQuery({
      queryFn: () => getAllNotice({ pagination: false, isPopup: true }),
      queryKey: queryKeys(NOTICE).list({ isPopup: true }),
   });

   const { result = [] } = news ?? {};

   if (!isEmpty(result)) {
      return (
         <div className='sub_footer_container sticky bottom-0 z-50   w-full    '>
            <section className='sub_footer grid   justify-between bg-[#EAEEF2]  '>
               <div className='flex h-full w-[118px] items-center justify-center bg-secondary py-[9px] sm:w-[93px]'>
                  <p className='  text-[14px] font-normal leading-[23px] text-white'>
                     {translate(lang, 'LATEST NEWS', 'ताजा समाचार')}
                  </p>
               </div>
               <div>
                  <Marquee className='h-full' pauseOnHover>
                     {result.map((item) => (
                        <Link
                           href={redirectedPathName(
                              lang,
                              `notices/${item?.noticeCategory.slug}/${item.slug}`
                           )}
                           key={item.slug}
                        >
                           <p className=' text-[18px] font-normal leading-[30px] text-grey30'>
                              {lang === 'en' ? item.title_En : item.title_Np}
                           </p>
                        </Link>
                     ))}
                  </Marquee>
               </div>
            </section>
         </div>
      );
   }
}
