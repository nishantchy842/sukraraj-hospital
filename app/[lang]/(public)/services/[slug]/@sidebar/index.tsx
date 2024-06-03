/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
'use client';
import { type Locale } from '@/i18n';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import emergency from '@/public/emergency.svg';
import { getAllServices } from '@/api/services';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { queryKeys } from '@/utils';
import { SERVICES } from '@/constants/querykeys';
import { translate } from '@/utils/commonRule';
import { getBasicInformation } from '@/api/home';
import { BASIC_INFORMATION } from '@/constants/admin/queryKeys';
import { Dropdown, type MenuProps } from 'antd';

export default function ServiceSidebar({
   params: { lang, slug },
}: {
   params: { lang: Locale; slug: string };
}) {
   const { data: allServices } = useQuery({
      queryFn: () =>
         getAllServices({
            pagination: false,
         }),
      queryKey: queryKeys(SERVICES).list({ pagination: false }),
   });

   const items: MenuProps['items'] = allServices?.result.map((service) => ({
      key: service.slug,
      label: (
         <Link href={service.slug}>
            {translate(lang, service.title_En, service.title_Np ?? '')}
         </Link>
      ),
   }));

   const filterCategorySlug = allServices?.result.filter(
      (service) => service.slug === slug
   )[0];

   return (
      <div>
         <section className='md:w-[189px]'>
            <article className='max-h-[800px] w-[307px] overflow-y-auto bg-primary px-[20px] pb-[100px] pt-[20px] md:w-full sm:hidden'>
               <p className=' text-[24px] font-medium leading-[40px] text-white'>
                  {translate(lang, ' All Services', 'सबै सेवाहरू')}
               </p>
               <div className='mt-[31px] flex flex-col gap-y-[20px] md:gap-y-[20px]'>
                  {allServices?.result?.map((item) => (
                     <Link key={item.slug} href={`${item?.slug}`}>
                        <div
                           className={classNames(
                              'flex items-center justify-between hover:text-white',
                              item.slug == slug
                                 ? 'font-medium text-[#FFFFFF]'
                                 : 'font-normal text-[#FFFFFFB2]'
                           )}
                        >
                           <p className='w-[238px] text-[20px]  leading-[33px] md:text-[18px] md:leading-[30px]'>
                              {translate(
                                 lang,
                                 item.title_En,
                                 item.title_Np ?? item.title_En
                              )}
                           </p>
                           <svg
                              width='9'
                              height='14'
                              viewBox='0 0 9 14'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                           >
                              <path
                                 fillRule='evenodd'
                                 clipRule='evenodd'
                                 d='M8.27535 5.72469C8.52504 5.97469 8.66529 6.31358 8.66529 6.66692C8.66529 7.02025 8.52504 7.35914 8.27535 7.60914L3.24779 12.6385C2.99766 12.8885 2.65846 13.0289 2.30481 13.0288C1.95116 13.0287 1.61203 12.8882 1.36202 12.638C1.112 12.3879 0.971596 12.0487 0.97168 11.695C0.971763 11.3414 1.11233 11.0023 1.36246 10.7523L5.44779 6.66692L1.36246 2.58158C1.11946 2.33023 0.984907 1.99349 0.987779 1.64389C0.990651 1.29429 1.13072 0.959806 1.37781 0.712478C1.62491 0.465149 1.95926 0.324766 2.30886 0.321565C2.65845 0.318363 2.99532 0.452599 3.2469 0.695361L8.27624 5.72381L8.27535 5.72469Z'
                                 fill={
                                    item.slug == slug ? '#FFFFFF' : '#FFFFFFB2'
                                 }
                              />
                           </svg>
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
                        filterCategorySlug?.title_En ?? '',
                        filterCategorySlug?.title_Np ?? ''
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

export const EmergencyCard = () => {
   const { data: basicInfo } = useQuery({
      queryFn: () => getBasicInformation(),
      queryKey: queryKeys(BASIC_INFORMATION).lists(),
   });

   return (
      <article className=' flex w-[307px] flex-col items-center justify-center bg-[#F5F6F8] py-[16px] md:w-full sm:w-full'>
         <div className='size-[141px] md:size-[80px]'>
            <Image
               className='!size-full'
               src={emergency}
               alt='emergency'
               width={141}
               height={141}
               quality={100}
               layout='responsive'
            />
         </div>
         <p className='mt-[14px] text-[20px] font-semibold leading-[33px] text-[#B82432] md:text-[18px] md:leading-[30px]'>
            For Emergency cases
         </p>
         {basicInfo?.emergencyHotlines.map((item) => (
            <a key={item} href={`tel:${item}`}>
               <p className=' text-[20px] font-normal leading-[33px] text-grey50 md:text-[18px] md:leading-[30px]'>
                  {item}
               </p>
            </a>
         ))}
      </article>
   );
};
