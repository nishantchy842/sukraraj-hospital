import React, { useEffect, useState } from 'react';
import { Collapse, Drawer } from 'antd';
import { type ChildrenList, type NavMenu } from '@/models/header';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/utils';
import {
   CLIENT_CONCERN_CATEGORY,
   NOTICE_CATEGORY,
   RESEARCH_CATEGORY,
   RESOURCE_CATEGORY,
} from '@/constants/querykeys';
import { getAllNoticeCategory } from '@/api/notice';
import { getAllResourceCategory } from '@/api/downloadResource';
import { getAllResearchCategory } from '@/api/research';
import _ from 'lodash';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import classNames from 'classnames';
import { redirectedPathName, translate } from '@/utils/commonRule';
import { getAllClientConcernCategory } from '@/api/clientConcent';

const SideDrawer = ({
   onClose,
   open,
   navList,
   lang,
}: {
   onClose: () => void;
   open: boolean;
   navList: NavMenu;
   lang: Locale;
}) => {
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

   const { data: clientConcernCategory } = useQuery({
      queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).details(),
      queryFn: () => getAllClientConcernCategory({ pagination: true }),
   });

   const { data: downloadCategory } = useQuery({
      queryKey: queryKeys(RESOURCE_CATEGORY).lists(),
      queryFn: () => getAllResourceCategory({ pagination: false }),
   });

   const { data: researchCategory } = useQuery({
      queryKey: queryKeys(RESEARCH_CATEGORY).lists(),
      queryFn: () => getAllResearchCategory({ pagination: false }),
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
                  fill='white'
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
         key: `client-concern/${clientConcernCategory?.result[0]?.slug}`,
      },
      {
         label: opdSchedule,

         key: 'opd-schedule',
      },
      {
         label: research,

         key: 'research',

         children: researchChildren,
      },
      {
         label: noticeBoard,
         key: 'notices',

         children: noticeChildren,
      },
      {
         label: downloads,

         key: 'downloads',

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
      <Drawer
         closable={false}
         onClose={onClose}
         open={open}
         className={classNames('side_menu_drawer', ' !bg-primary')}
         placement={'right'}
      >
         <div>
            {items.map(({ label, key, children }) => (
               <div key={key} className='w-full'>
                  {!children ? (
                     <Link
                        href={redirectedPathName(lang, `/${key}`)}
                        onClick={() => {
                           onClose();
                        }}
                     >
                        <div className='flex items-center justify-between gap-x-[5px] py-[7px] '>
                           <p
                              className={classNames(
                                 'text-[16px] font-medium leading-[27px] ',
                                 key.split('/')[0] === activeKey
                                    ? 'text-white'
                                    : 'text-[#FFFFFFCC]'
                              )}
                           >
                              {label}
                           </p>
                        </div>
                     </Link>
                  ) : (
                     <div className='flex w-full cursor-pointer  items-center  justify-between gap-x-[5px]  '>
                        <Collapse
                           ghost
                           expandIconPosition='end'
                           className={classNames('side_bar_menu', 'w-full')}
                           expandIcon={() => (
                              <svg
                                 width='10'
                                 height='7'
                                 viewBox='0 0 10 7'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                              >
                                 <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M5.7066 6.20627C5.5191 6.39353 5.26493 6.49872 4.99993 6.49872C4.73493 6.49872 4.48077 6.39353 4.29327 6.20627L0.521267 2.4356C0.333759 2.248 0.228453 1.9936 0.228516 1.72836C0.228578 1.46313 0.334004 1.20878 0.5216 1.02127C0.709197 0.833759 0.963597 0.728453 1.22884 0.728516C1.49408 0.728578 1.74843 0.834004 1.93593 1.0216L4.99993 4.0856L8.06393 1.0216C8.25245 0.839351 8.50501 0.738436 8.7672 0.74059C9.0294 0.742744 9.28027 0.847795 9.46576 1.03312C9.65126 1.21844 9.75655 1.4692 9.75895 1.7314C9.76135 1.9936 9.66067 2.24625 9.4786 2.43493L5.70727 6.20693L5.7066 6.20627Z'
                                    fill={
                                       key === activeKey ? 'white' : '#FFFFFFCC'
                                    }
                                 />
                              </svg>
                           )}
                        >
                           <Collapse.Panel
                              header={
                                 <p
                                    className={classNames(
                                       'py-[7px] text-[16px] font-medium leading-[30px] ',
                                       key === activeKey
                                          ? 'text-white'
                                          : 'text-[#FFFFFFCC]'
                                    )}
                                 >
                                    {label}
                                 </p>
                              }
                              key={key}
                           >
                              {children.map((child) => (
                                 <p
                                    key={child.key}
                                    className={classNames(
                                       'border-b border-[#FFFFFF33] px-[8px]  py-[14px] text-[14px] font-medium text-white hover:bg-[#FFFFFF4D]',
                                       child.key === pathname.split('/')[3]
                                          ? 'bg-[#FFFFFF4D]'
                                          : ''
                                    )}
                                    onClick={() => {
                                       router.push(
                                          `/${pathname.split('/')[1]}/${key}/${child.key}`
                                       );
                                       onClose();
                                    }}
                                 >
                                    {child.label}
                                 </p>
                              ))}
                           </Collapse.Panel>
                        </Collapse>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </Drawer>
   );
};

export default SideDrawer;
