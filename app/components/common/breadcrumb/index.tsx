'use client';
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Breakcrumb({
   title,
   extra,
}: {
   title: string;
   extra?: { title: string; pathname: string };
}) {
   const pathname = usePathname();

   const local = pathname.split('/')[1];

   return (
      <section className=''>
         <p className=' text-[32px] font-medium leading-[53px] text-grey30 sm:text-[20px] sm:leading-[33px]'>
            {/* {title &&
               (title.split('')[0].toUpperCase() + title.slice(1)).replace(
                  /[^a-zA-Z0-9 ]/g,
                  ' '
               )} */}
            {title}
         </p>
         <Breadcrumb
            className=' text-[16px] font-medium leading-[26px]'
            separator='|'
            items={[
               {
                  title: (
                     <Link href={'/'}>
                        {local === 'en' ? 'Home' : 'गृहपृष्ठ'}
                     </Link>
                  ),
               },
               ...(extra
                  ? [
                       {
                          title: (
                             <Link href={`/${extra.pathname}`}>
                                {extra.title}
                             </Link>
                          ),
                       },
                    ]
                  : []),

               {
                  title: (
                     <p className='text-[#0C62BB]'>
                        {/* {title &&
                           (
                              title.split('')[0].toUpperCase() + title.slice(1)
                           ).replace(/[^a-zA-Z0-9 ]/g, ' ')} */}
                        {title}
                     </p>
                  ),
               },
            ]}
         />
      </section>
   );
}
