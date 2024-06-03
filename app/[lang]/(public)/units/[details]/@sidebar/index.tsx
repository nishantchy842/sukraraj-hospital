'use client';
import { getAllDepartments } from '@/api/departments';
import { type Locale } from '@/i18n';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { departmentConfig } from '../../config';
import { DEPARTMENT } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { translate } from '@/utils/commonRule';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { EmergencyCard } from '../../../services/[slug]/@sidebar';
import { Dropdown, type MenuProps } from 'antd';

export default function Sidebar({
   params: { lang, details },
}: {
   params: { lang: Locale; details: string };
}) {
   const { data: allDepartment } = useQuery({
      queryFn: () => getAllDepartments(departmentConfig),
      queryKey: queryKeys(DEPARTMENT).list(departmentConfig),
      enabled: Boolean(details),
   });

   const items: MenuProps['items'] = allDepartment?.result.map((unit) => ({
      key: unit.slug,
      label: (
         <Link href={unit.slug}>
            {translate(lang, unit.name_En, unit.name_Np ?? '')}
         </Link>
      ),
   }));

   const filterCategorySlug = allDepartment?.result.filter(
      (service) => service.slug === details
   )[0];

   return (
      <div className={classNames('sm:px-[20px]')}>
         <section className='md:w-[189px] sm:w-full '>
            <article
               className={classNames(
                  'sidebar_scollbar',
                  'h-fit max-h-[668px] w-[307px] overflow-y-auto bg-primary px-[20px] pb-[100px] pt-[20px] md:w-[189px] sm:hidden'
               )}
            >
               <p className=' text-[24px] font-medium leading-[40px] text-white md:text-[20px] md:leading-[33px]'>
                  {translate(lang, ' All Units', 'सबै एकाइहरू')}
               </p>
               <div className='mt-[20px] flex flex-col gap-y-[15px]'>
                  {allDepartment?.result?.map((item) => (
                     <Link key={item.slug} href={`${item?.slug}?id=${item.id}`}>
                        <div
                           className={classNames(
                              'flex items-center justify-between'
                           )}
                        >
                           <p
                              className={classNames(
                                 item.slug === details
                                    ? 'font-medium text-[#FFFFFF]'
                                    : 'font-normal text-[#FFFFFFB2]',
                                 'w-[238px] text-[18px]  leading-[33px] hover:text-white md:text-[18px] md:leading-[30px]'
                              )}
                           >
                              {lang === 'en'
                                 ? item?.name_En
                                 : item?.name_Np ?? item?.name_En}
                           </p>
                        </div>
                     </Link>
                  ))}
               </div>
            </article>

            <Dropdown
               overlayClassName='common_dropdown'
               className=' hidden px-[10px] md:hidden sm:mb-[15px] sm:flex  '
               menu={{
                  items,

                  activeKey: filterCategorySlug?.slug,
               }}
               getPopupContainer={(triggerNode: HTMLElement) => {
                  return triggerNode.parentNode as HTMLElement;
               }}
            >
               <div className='flex h-[50px] items-center justify-between  rounded-[4px] border-[1px] border-[#C4C4C4]'>
                  <p className=' text-[16px] font-normal leading-[26.59px] text-[#909090]'>
                     {translate(
                        lang,
                        filterCategorySlug?.name_En ?? '',
                        filterCategorySlug?.name_Np ?? ''
                     )}
                  </p>
                  <svg
                     width='14'
                     height='9'
                     viewBox='0 0 14 9'
                     fill='none'
                     xmlns='http://www.w3.org/2000/svg'
                  >
                     <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M7.6088 8.27632C7.3588 8.52601 7.01991 8.66626 6.66658 8.66626C6.31324 8.66626 5.97436 8.52601 5.72436 8.27632L0.695023 3.24877C0.445012 2.99864 0.304604 2.65944 0.304688 2.30579C0.304771 1.95214 0.445338 1.613 0.695467 1.36299C0.945595 1.11298 1.2848 0.972573 1.63845 0.972656C1.9921 0.97274 2.33123 1.11331 2.58124 1.36344L6.66658 5.44877L10.7519 1.36344C11.0033 1.12044 11.34 0.985884 11.6896 0.988756C12.0392 0.991628 12.3737 1.1317 12.621 1.37879C12.8683 1.62589 13.0087 1.96024 13.0119 2.30983C13.0151 2.65943 12.8809 2.9963 12.6381 3.24788L7.60969 8.27722L7.6088 8.27632Z'
                        fill='#909090'
                     />
                  </svg>
               </div>
            </Dropdown>

            <div className='mt-[36px] sm:hidden'>
               <EmergencyCard />
            </div>
         </section>
      </div>
   );
}
