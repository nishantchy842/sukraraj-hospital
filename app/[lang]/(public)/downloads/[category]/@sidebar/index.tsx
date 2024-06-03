'use client';
import { getAllResourceCategory } from '@/api/downloadResource';
import { RESOURCE_CATEGORY } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { translate } from '@/utils/commonRule';
import { useQuery } from '@tanstack/react-query';
import { Dropdown, type MenuProps } from 'antd';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

export default function DownloadRescourceCategory({
   params: { lang, category },
}: {
   params: { lang: Locale; category: string };
}) {
   const { data } = useQuery({
      queryFn: () => getAllResourceCategory({ pagination: false }),
      queryKey: queryKeys(RESOURCE_CATEGORY).lists(),
   });

   const items: MenuProps['items'] = data?.result.map((unit) => ({
      key: unit.slug,
      label: (
         <Link href={unit.slug}>
            {translate(lang, unit.title_En, unit.title_Np ?? '')}
         </Link>
      ),
   }));

   const filterCategorySlug = data?.result.filter(
      (service) => service.slug === category
   )[0];

   return (
      <div>
         <section>
            <article className='flex h-fit max-h-[668px] w-[308px] flex-col gap-y-[10px] overflow-y-auto md:w-full md:flex-row md:flex-wrap md:gap-x-[15px] sm:hidden'>
               {data?.result.map((item) => (
                  <Link key={item.id} href={`${item.slug}`}>
                     <div
                        className='flex w-full items-center justify-between px-[15px] py-[10px] md:gap-x-[20px]'
                        style={{
                           background:
                              item.slug === category ? '#0C62BB' : '#0C62BB0D',
                        }}
                     >
                        <p
                           className={classNames(
                              ' text-[18px] font-medium leading-[30px]',
                              item.slug === category
                                 ? 'text-white '
                                 : 'text-[#808080]'
                           )}
                        >
                           {lang === 'en'
                              ? item.title_En.toUpperCase()
                              : (item.title_Np ?? '').toUpperCase()}
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
                              d='M7.94234 6.0577C8.19203 6.3077 8.33228 6.64659 8.33228 6.99992C8.33228 7.35326 8.19203 7.69215 7.94234 7.94215L2.91479 12.9715C2.66466 13.2215 2.32546 13.3619 1.9718 13.3618C1.61815 13.3617 1.27902 13.2212 1.02901 12.971C0.778997 12.7209 0.638589 12.3817 0.638672 12.0281C0.638755 11.6744 0.779323 11.3353 1.02945 11.0853L5.11478 6.99992L1.02945 2.91459C0.786453 2.66324 0.651899 2.3265 0.654771 1.9769C0.657643 1.6273 0.79771 1.29281 1.04481 1.04549C1.2919 0.798157 1.62625 0.657774 1.97585 0.654572C2.32544 0.651371 2.66231 0.785607 2.9139 1.02837L7.94323 6.05681L7.94234 6.0577Z'
                              fill={
                                 item.slug === category ? 'white ' : '#808080'
                              }
                           />
                        </svg>
                     </div>
                  </Link>
               ))}
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
         </section>
      </div>
   );
}
