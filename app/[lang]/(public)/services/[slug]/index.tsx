'use client';
import { getSevivesDetails } from '@/api/services';
import { SERVICES } from '@/constants/querykeys';
import type { Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { Empty, Space, Tag } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import parse from 'html-react-parser';
import { notFound } from 'next/navigation';
import classNames from 'classnames';

export default function ServiceDetails({
   params: { lang, slug },
}: {
   params: { lang: Locale; slug: string };
}) {
   const { data: serviceDetails, isError } = useQuery({
      queryFn: () => getSevivesDetails(slug),
      queryKey: queryKeys(SERVICES).detail(slug),
   });

   if (isError) {
      notFound();
   }

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   }, []);

   return (
      <div>
         <section>
            <article>
               {lang === 'en'
                  ? serviceDetails?.title_En && (
                       <p className='relative text-[28px] font-medium leading-[46px] text-[#000000] before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px] before:bg-secondary'>
                          {serviceDetails?.title_En}
                       </p>
                    )
                  : serviceDetails?.title_Np && (
                       <p className='relative text-[28px] font-medium leading-[46px] text-[#000000] before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px] before:bg-secondary'>
                          {serviceDetails?.title_Np}
                       </p>
                    )}
               <Space
                  wrap
                  className={classNames('our_services mb-[25px] mt-[19px]')}
               >
                  {lang === 'en'
                     ? (serviceDetails?.tags_En ?? []).map((tag) => (
                          <Tag
                             bordered={false}
                             key={tag}
                             className=' !bg-[#F5F6F8] !px-[8px] !py-[4px] '
                          >
                             <p className='!text-[16px] !font-normal !leading-[22px] !text-grey50'>
                                {_.upperFirst(tag)}
                             </p>
                          </Tag>
                       ))
                     : (serviceDetails?.tags_Np ?? []).map((tag) => (
                          <Tag
                             bordered={false}
                             key={tag}
                             className=' !bg-[#F5F6F8] !px-[8px] !py-[4px] '
                          >
                             <p className='!text-[16px] !font-normal !leading-[22px]  !text-[#505050]'>
                                {tag}
                             </p>
                          </Tag>
                       ))}
               </Space>

               {lang === 'en' ? (
                  serviceDetails?.content_En ? (
                     <article className='prose max-w-full text-[18px] font-normal leading-[30px]  text-[#505050]'>
                        {parse(serviceDetails?.content_En)}
                     </article>
                  ) : (
                     <Empty description='No content' />
                  )
               ) : serviceDetails?.content_Np ? (
                  <article className='prose max-w-full text-[18px] font-normal leading-[30px]  text-[#505050]'>
                     {parse(serviceDetails?.content_Np)}
                  </article>
               ) : (
                  <Empty description='No content' />
               )}
            </article>
         </section>
      </div>
   );
}
