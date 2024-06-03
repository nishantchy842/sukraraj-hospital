'use client';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/utils';
import { getAllNoticeCategory } from '@/api/notice';
import {
   CLIENT_CONCERN_CATEGORY,
   NOTICE_CATEGORY,
   RESEARCH_CATEGORY,
   RESOURCE_CATEGORY,
} from '@/constants/querykeys';
import { getAllResourceCategory } from '@/api/downloadResource';
import { type Locale } from '@/i18n';
import { getAllResearchCategory } from '@/api/research';
import { type ChildrenList, type NavMenu } from '@/models/header';
import { getAllClientConcernCategory } from '@/api/clientConcent';
import _, { isEmpty } from 'lodash';
import { translate } from '@/utils/commonRule';

export default function SubHeader({
   navList,
   lang,
}: {
   navList: NavMenu;
   lang: Locale;
}) {
   const {
      about,
      contact,
      departments,
      gallery,
      services,
      opdSchedule,
      research,
      noticeBoard,
      downloads,
      // dailyCensus,
      clientConcern,
   } = navList;

   const pathname = usePathname();

   const router = useRouter();

   const [activeKey, setActiveKey] = useState(pathname.split('/')[2]);

   useEffect(() => {
      setActiveKey(pathname.split('/')[2]);
   }, [pathname]);

   const { data: noticeCategory } = useQuery({
      queryKey: queryKeys(NOTICE_CATEGORY).lists(),
      queryFn: () => getAllNoticeCategory({ pagination: false }),
   });

   const { data: downloadCategory } = useQuery({
      queryKey: queryKeys(RESOURCE_CATEGORY).lists(),
      queryFn: () => getAllResourceCategory({ pagination: false }),
   });

   const { data: researchCategory } = useQuery({
      queryKey: queryKeys(RESEARCH_CATEGORY).lists(),
      queryFn: () => getAllResearchCategory({ pagination: false }),
   });

   const { data: clientConcernCategory } = useQuery({
      queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).detail('header'),
      queryFn: () => getAllClientConcernCategory({ pagination: true, size: 1 }),
   });

   const noticeChildren = noticeCategory?.result.map((item) => ({
      label: _.upperFirst(lang === 'en' ? item.title_En : item.title_Np),
      key: item.slug,
      id: item.id,
   }));

   const downlaodChildren = downloadCategory?.result.map((item) => ({
      label: _.upperFirst(
         lang === 'en' ? item.title_En ?? '' : item.title_Np ?? ''
      ),
      key: item.slug,
   }));

   const researchChildren = researchCategory?.result?.map((item) => ({
      label: _.upperFirst(lang === 'en' ? item.title_En : item.title_Np),
      key: item.slug,
   }));

   const items: ChildrenList[] = [
      {
         label: about,
         key: 'about-us',
         icon: (
            <svg
               width='10'
               height='6'
               viewBox='0 0 10 6'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M5.7066 5.70676C5.5191 5.89402 5.26493 5.99921 4.99993 5.99921C4.73493 5.99921 4.48077 5.89402 4.29327 5.70676L0.521267 1.93609C0.333759 1.74849 0.228453 1.49409 0.228516 1.22885C0.228578 0.963614 0.334004 0.709264 0.5216 0.521756C0.709197 0.334247 0.963597 0.228941 1.22884 0.229004C1.49408 0.229066 1.74843 0.334492 1.93593 0.522089L4.99993 3.58609L8.06393 0.522089C8.25245 0.33984 8.50501 0.238925 8.7672 0.241079C9.0294 0.243233 9.28027 0.348283 9.46576 0.533605C9.65126 0.718926 9.75655 0.96969 9.75895 1.23189C9.76135 1.49408 9.66067 1.74673 9.4786 1.93542L5.70727 5.70742L5.7066 5.70676Z'
                  fill={activeKey === 'about-us' ? 'white' : '#FFFFFFCC'}
               />
            </svg>
         ),
         children: [
            {
               label: translate(lang, 'Introduction', 'परिचय'),
               key: '/',
            },
            {
               label: translate(lang, 'Staff details', 'कर्मचारी विवरण'),
               key: 'staff-details',
            },
            {
               label: translate(lang, 'Ward Incharge', 'वार्ड इन्चार्ज'),
               key: 'ward-incharge',
            },
            {
               label: translate(
                  lang,
                  'Development Committee',
                  'विकास समितिहरु               '
               ),
               key: 'development-committee',
            },
            {
               label: translate(lang, 'Organogram', 'संगठनात्मक संरचना'),
               key: 'organogram',
            },

            {
               label: translate(lang, 'Citizen Charter', 'नागरिक बडापत्र'),
               key: 'citizen-charter',
            },

            {
               label: translate(lang, 'Future Plans', 'भविष्यका योजनाहरू'),
               key: 'future-plans',
            },
         ],
      },
      {
         label: services,
         key: 'services',
      },
      {
         label: departments,
         key: 'units',
      },
      {
         label: clientConcern,
         key: !isEmpty(clientConcernCategory?.result)
            ? `client-concern/${clientConcernCategory?.result[0]?.slug}`
            : 'client-concern',
      },
      {
         label: opdSchedule,

         key: 'opd-schedule',
      },
      {
         label: research,

         key: 'research',
         icon: (
            <svg
               width='10'
               height='6'
               viewBox='0 0 10 6'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M5.7066 5.70676C5.5191 5.89402 5.26493 5.99921 4.99993 5.99921C4.73493 5.99921 4.48077 5.89402 4.29327 5.70676L0.521267 1.93609C0.333759 1.74849 0.228453 1.49409 0.228516 1.22885C0.228578 0.963614 0.334004 0.709264 0.5216 0.521756C0.709197 0.334247 0.963597 0.228941 1.22884 0.229004C1.49408 0.229066 1.74843 0.334492 1.93593 0.522089L4.99993 3.58609L8.06393 0.522089C8.25245 0.33984 8.50501 0.238925 8.7672 0.241079C9.0294 0.243233 9.28027 0.348283 9.46576 0.533605C9.65126 0.718926 9.75655 0.96969 9.75895 1.23189C9.76135 1.49408 9.66067 1.74673 9.4786 1.93542L5.70727 5.70742L5.7066 5.70676Z'
                  fill={activeKey === 'research' ? 'white' : '#FFFFFFCC'}
               />
            </svg>
         ),
         children: researchChildren,
      },
      {
         label: noticeBoard,
         key: 'notices',
         icon: (
            <svg
               width='10'
               height='6'
               viewBox='0 0 10 6'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M5.7066 5.70676C5.5191 5.89402 5.26493 5.99921 4.99993 5.99921C4.73493 5.99921 4.48077 5.89402 4.29327 5.70676L0.521267 1.93609C0.333759 1.74849 0.228453 1.49409 0.228516 1.22885C0.228578 0.963614 0.334004 0.709264 0.5216 0.521756C0.709197 0.334247 0.963597 0.228941 1.22884 0.229004C1.49408 0.229066 1.74843 0.334492 1.93593 0.522089L4.99993 3.58609L8.06393 0.522089C8.25245 0.33984 8.50501 0.238925 8.7672 0.241079C9.0294 0.243233 9.28027 0.348283 9.46576 0.533605C9.65126 0.718926 9.75655 0.96969 9.75895 1.23189C9.76135 1.49408 9.66067 1.74673 9.4786 1.93542L5.70727 5.70742L5.7066 5.70676Z'
                  fill={activeKey === 'notices' ? 'white' : '#FFFFFFCC'}
               />
            </svg>
         ),
         children: noticeChildren,
      },
      {
         label: downloads,

         key: 'downloads',
         icon: (
            <svg
               width='10'
               height='6'
               viewBox='0 0 10 6'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M5.7066 5.70676C5.5191 5.89402 5.26493 5.99921 4.99993 5.99921C4.73493 5.99921 4.48077 5.89402 4.29327 5.70676L0.521267 1.93609C0.333759 1.74849 0.228453 1.49409 0.228516 1.22885C0.228578 0.963614 0.334004 0.709264 0.5216 0.521756C0.709197 0.334247 0.963597 0.228941 1.22884 0.229004C1.49408 0.229066 1.74843 0.334492 1.93593 0.522089L4.99993 3.58609L8.06393 0.522089C8.25245 0.33984 8.50501 0.238925 8.7672 0.241079C9.0294 0.243233 9.28027 0.348283 9.46576 0.533605C9.65126 0.718926 9.75655 0.96969 9.75895 1.23189C9.76135 1.49408 9.66067 1.74673 9.4786 1.93542L5.70727 5.70742L5.7066 5.70676Z'
                  fill={activeKey === 'downloads' ? 'white' : '#FFFFFFCC'}
               />
            </svg>
         ),
         children: downlaodChildren,
      },
      {
         label: gallery,
         key: 'gallery',
      },
      // {
      //    label: dailyCensus,
      //    key: 'dailyCensus',
      // },
      {
         label: contact,
         key: 'contact-us',
      },
   ];

   return (
      <div
         className={
            ' sticky top-0 z-50 overflow-x-auto overflow-y-hidden bg-primary md:hidden sm:hidden'
         }
         id='navbar'
      >
         <section className='  px-[60px]'>
            <article className='mx-auto flex max-w-[1440px] items-center justify-between gap-x-[24px] py-[10px]'>
               {items.map(({ label, key, icon, children }) => (
                  <section
                     key={key}
                     className={classNames(
                        'area h-full ',
                        key.split('/')[0] === activeKey
                           ? '  sub_header_menu_active  text-white'
                           : 'text-[#FFFFFFCC]'
                     )}
                  >
                     <Dropdown
                        overlayClassName='children_dropdown'
                        menu={{
                           items: children && children,
                           onClick: ({ key: childrenKey }) => {
                              router.push(
                                 `/${pathname.split('/')[1]}/${key}/${childrenKey}`
                              );
                           },
                        }}
                        disabled={!children}
                        // open={children && true}
                        // getPopupContainer={() =>
                        //    document.querySelector('.area') as HTMLElement
                        // }
                     >
                        {!children ? (
                           <Link href={`/${pathname.split('/')[1]}/${key}`}>
                              <div className='flex h-full items-center gap-x-[5px] text-[18px] font-medium leading-[30px] hover:text-[white]'>
                                 <p>{label}</p>
                                 {icon && icon}
                              </div>
                           </Link>
                        ) : (
                           <div className='flex h-full cursor-pointer items-center gap-x-[5px] text-[18px] font-medium leading-[30px] hover:text-[white]'>
                              <p>{label}</p>
                              {icon && icon}
                           </div>
                        )}
                     </Dropdown>
                  </section>
               ))}
            </article>
         </section>
      </div>
   );
}
