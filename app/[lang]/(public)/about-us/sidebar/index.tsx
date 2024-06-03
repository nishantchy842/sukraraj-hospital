'use client';

import { type Locale } from '@/i18n';
import { redirectedPathName, translate } from '@/utils/commonRule';
import { Dropdown, type MenuProps } from 'antd';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

type sideMenuType = {
   label: string;
   key: string;
   label_Np: string;
   url: string;
};

export default function AboutUsSidebar({ lang }: { lang: Locale }) {
   const pathname = usePathname();

   const trackPathname = () => {
      const a = pathname.split('/');

      return a[a.length - 1];
   };

   const router = useRouter();

   const menu: sideMenuType[] = [
      {
         label: 'Introduction',
         key: 'about-us',
         url: '/about-us',
         label_Np: 'परिचय',
      },
      {
         label: 'Staff details',
         key: 'staff-details',
         url: '/about-us/staff-details',
         label_Np: 'कर्मचारी विवरण ',
      },
      {
         label: 'Ward Incharge',
         key: 'ward-incharge',
         url: '/about-us/ward-incharge',
         label_Np: 'वार्ड इन्चार्ज',
      },
      {
         label: 'Development committee',
         key: 'development-committee',
         url: '/about-us/development-committee',
         label_Np: 'विकास समिति',
      },
      {
         label: 'Organogram',
         key: 'organogram',
         url: '/about-us/organogram',
         label_Np: 'संगठनात्मक संरचना',
      },
      {
         label: 'Citizen charter',
         key: 'citizen-charter',
         url: '/about-us/citizen-charter',
         label_Np: 'नागरिक बडापत्र',
      },
      {
         label: 'Future plans',
         key: 'future-plans',
         url: '/about-us/future-plans',
         label_Np: 'भविष्यका योजनाहरू',
      },
   ];

   const filterPath = menu.filter((item) => item.key === trackPathname())[0];

   const items: MenuProps['items'] = menu.map((item) => ({
      key: item.key,
      label: translate(lang, item.label, item.label_Np),
   }));

   return (
      <div className='sm:w-full sm:px-[20px]'>
         <article className='flex w-[308px] flex-col gap-y-[10px] md:w-full md:flex-row md:flex-wrap md:gap-x-[15px] sm:hidden'>
            {menu?.map((item) => (
               <Link
                  key={item.key}
                  href={`${redirectedPathName(lang, item.url)}`}
               >
                  <div
                     className='flex w-full items-center justify-between px-[15px] py-[10px] md:gap-x-[20px]'
                     style={{
                        background:
                           item.key === trackPathname()
                              ? '#0C62BB'
                              : '#0C62BB0D',
                     }}
                  >
                     <p
                        className={classNames(
                           ' text-[18px] font-medium leading-[30px]',
                           item.key === trackPathname()
                              ? 'text-white '
                              : 'text-[#808080]'
                        )}
                     >
                        {lang === 'en'
                           ? item.label.toUpperCase()
                           : item.label_Np.toUpperCase()}
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
                              item.key === trackPathname()
                                 ? 'white '
                                 : '#808080'
                           }
                        />
                     </svg>
                  </div>
               </Link>
            ))}
         </article>

         <Dropdown
            overlayClassName='common_dropdown'
            className=' hidden px-[10px] md:hidden sm:mb-[15px] sm:flex '
            menu={{
               items,
               // eslint-disable-next-line consistent-return
               onClick: (slug) => {
                  if (!pathname) return '/';
                  const segments = pathname.split('/');
                  segments.length = 3;
                  segments[1] = lang;
                  segments[2] =
                     slug.key === 'about-us'
                        ? 'about-us'
                        : `about-us/${slug.key}`;
                  router.push(segments.join('/'));
               },
               activeKey: trackPathname(),
            }}
         >
            <div className='flex h-[50px] items-center justify-between  rounded-[4px] border-[1px] border-[#C4C4C4]'>
               <p className=' text-[16px] font-normal leading-[26.59px] text-[#909090]'>
                  {translate(lang, filterPath.label, filterPath.label_Np)}
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
      </div>
   );
}
