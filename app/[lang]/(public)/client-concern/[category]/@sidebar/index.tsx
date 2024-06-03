/* eslint-disable no-use-before-define */
'use client';
import { getAllClientConcernCategory } from '@/api/clientConcent';
import { getBasicInformation } from '@/api/home';
import { BASIC_INFORMATION } from '@/constants/admin/queryKeys';
import { CLIENT_CONCERN_CATEGORY } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { redirectedPathName, translate } from '@/utils/commonRule';
import { useQuery } from '@tanstack/react-query';
import { Dropdown, Space, Tooltip, type MenuProps } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import Link from 'next/link';
import React from 'react';

export default function ClientConcernSidebar({
   params: { lang, category },
}: {
   params: { lang: Locale; category: string };
}) {
   const { data } = useQuery({
      queryFn: () => getAllClientConcernCategory({ pagination: false }),
      queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).lists(),
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
      <div className=''>
         <section>
            <article className='flex max-h-[668px] min-h-[100px] flex-col  gap-y-[20px] overflow-y-auto bg-primary p-[20px] md:w-full sm:hidden'>
               {data?.result.map((item) => (
                  <Link
                     href={redirectedPathName(
                        lang,
                        `/client-concern/${item.slug}`
                     )}
                     key={item.id}
                  >
                     <p
                        className={classNames(
                           category === item.slug
                              ? 'font-medium text-white'
                              : 'font-normal text-[#FFFFFFB2]',
                           ' text-[20px]  leading-[30px] hover:text-white md:text-[18px] md:leading-[26px]'
                        )}
                     >
                        {lang === 'en'
                           ? _.upperFirst(item.title_En)
                           : item.title_Np}
                     </p>
                  </Link>
               ))}
            </article>

            <div className='mt-[30px] sm:hidden'>
               <InqueryCard />
            </div>

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

export const InqueryCard = () => {
   const { data: basicInfo } = useQuery({
      queryFn: () => getBasicInformation(),
      queryKey: queryKeys(BASIC_INFORMATION).lists(),
   });
   return (
      <section className=' bg-[#F5F6F8] p-[20px] md:w-full md:p-[5px]'>
         <p className=' text-[18px] font-medium leading-[27px] text-[#000000] md:text-[16px] md:leading-[23px]'>
            Have any other queries for us?
         </p>
         <p className='mb-[12px] mt-[4px] text-[16px] font-normal leading-[24px] text-[#808080] md:text-[14px] md:leading-[20px]'>
            We are ready to help. Do not hesitate to contact us.
         </p>

         <div className='mb-[10px] flex items-start gap-x-[5px]'>
            <div>
               <svg
                  width='18'
                  height='19'
                  viewBox='0 0 18 19'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <path
                     fillRule='evenodd'
                     clipRule='evenodd'
                     d='M3.07673 0.610759C2.45255 0.752517 2.0352 0.997517 1.47536 1.55084C0.674463 2.34236 0.273057 3.13076 0.110166 4.23217C-0.0370216 5.22756 0.163135 6.58888 0.621181 7.70752C1.43395 9.69256 2.8404 11.7 4.77997 13.6435C6.81403 15.6817 8.91181 17.1442 10.9398 17.938C12.281 18.4629 13.8102 18.5872 14.9375 18.2627C16.0984 17.9285 17.1124 17.0792 17.6342 16.004C18.1011 15.042 18.0287 14.0504 17.4443 13.4004C17.2728 13.2097 14.607 11.2886 14.0357 10.944C13.628 10.6981 13.2926 10.5938 12.9095 10.5938C12.2945 10.5938 11.8648 10.8181 11.0942 11.5413L10.6464 11.9615L10.2978 11.7283C9.41013 11.1345 7.6345 9.38002 6.84485 8.31642C6.47294 7.81549 6.46751 7.88654 6.91411 7.40916C7.63622 6.63728 7.85763 6.25384 7.89474 5.71099C7.91974 5.34541 7.84106 5.02217 7.62849 4.61724C7.4581 4.29263 5.45478 1.4474 5.22079 1.19763C5.01478 0.97779 4.74981 0.80361 4.43981 0.684235C4.11352 0.55861 3.46122 0.523415 3.07673 0.610759ZM3.16661 1.88576C2.86532 1.98939 2.66544 2.11927 2.36466 2.40689C1.9079 2.84361 1.58634 3.38756 1.41587 4.01177C1.29161 4.46681 1.2913 5.39592 1.41521 6.01677C1.72403 7.56439 2.7295 9.39002 4.33876 11.3251C5.91376 13.219 8.03036 15.026 9.87888 16.0548C10.4242 16.3583 11.3927 16.8086 11.7734 16.9355C12.9295 17.321 14.3355 17.2626 15.2269 16.792C15.8363 16.4704 16.4477 15.7701 16.6229 15.1929C16.7199 14.8739 16.7067 14.5354 16.5896 14.3343C16.5386 14.2467 16.0481 13.8748 15.0136 13.1394C13.5673 12.1111 13.0824 11.8047 12.9017 11.8047C12.7127 11.8047 12.4402 11.998 11.9234 12.4986C11.2968 13.1054 11.1192 13.21 10.7139 13.2106C10.4015 13.2111 10.2194 13.1508 9.82622 12.9165C8.7452 12.2726 6.49017 10.0429 5.65985 8.79693C5.3531 8.33658 5.23384 8.00634 5.26161 7.69396C5.29165 7.35611 5.39907 7.18435 5.92915 6.62677C6.67669 5.84041 6.75583 5.67006 6.56337 5.26177C6.47114 5.06607 4.51122 2.27478 4.31771 2.06349C4.07849 1.80232 3.61657 1.73099 3.16661 1.88576Z'
                     fill='#0C62BB'
                  />
               </svg>
            </div>

            <Space split={','} wrap>
               {basicInfo?.generalInquiries.map((item) => (
                  <Tooltip
                     title={<a href={`tel:${item}`}>{item}</a>}
                     key={item}
                  >
                     <a href={`tel:${item}`}>
                        <p className=' text-[16px] font-medium leading-[27px] text-grey50'>
                           {/* {item.length < 18 ? item : item.slice(0, 18) + '...'} */}
                           {item}
                        </p>
                     </a>
                  </Tooltip>
               ))}
            </Space>
         </div>
         <div className='mb-[3px] flex items-start gap-x-[5px]'>
            <div>
               <svg
                  width='20'
                  height='16'
                  viewBox='0 0 20 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <path
                     d='M2.16884 0.5H17.8286C18.5665 0.5 19.1654 1.172 19.1654 2V14C19.1654 14.3978 19.0245 14.7794 18.7738 15.0607C18.5231 15.342 18.1831 15.5 17.8286 15.5H2.16884C1.81429 15.5 1.47427 15.342 1.22357 15.0607C0.972873 14.7794 0.832031 14.3978 0.832031 14V2C0.832031 1.172 1.43092 0.5 2.16884 0.5ZM1.97786 4.28171V14C1.97786 14.1183 2.06342 14.2143 2.16884 14.2143H17.8286C17.8792 14.2143 17.9278 14.1917 17.9636 14.1515C17.9994 14.1113 18.0195 14.0568 18.0195 14V4.28171L10.7473 9.79571C10.2951 10.1386 9.70231 10.1386 9.25009 9.79571L1.97786 4.28171ZM1.97786 2V2.73029L9.89175 8.73029C9.92333 8.75424 9.96058 8.76704 9.9987 8.76704C10.0368 8.76704 10.0741 8.75424 10.1056 8.73029L18.0195 2.73029V2C18.0195 1.94317 17.9994 1.88866 17.9636 1.84848C17.9278 1.80829 17.8792 1.78571 17.8286 1.78571H2.16884C2.11819 1.78571 2.06961 1.80829 2.0338 1.84848C1.99798 1.88866 1.97786 1.94317 1.97786 2Z'
                     fill='#0C62BB'
                  />
               </svg>
            </div>

            <Space split={','} wrap>
               {basicInfo?.emails.map((item) => (
                  <Tooltip
                     title={<a href={`mailto:${item}`}>{item}</a>}
                     key={item}
                  >
                     <a href={`mailto:${item}`}>
                        <p className=' text-[16px] font-medium leading-[27px] text-grey50'>
                           {/* {item.length < 18 ? item : item.slice(0, 18) + '...'} */}
                           {item}
                        </p>
                     </a>
                  </Tooltip>
               ))}
            </Space>
         </div>
         <div>
            <Link href={'/contact-us'}>
               <Space className='mt-[21px]'>
                  <p className=' text-[16px] font-medium leading-[27px] text-primary'>
                     Contact Us
                  </p>
                  <svg
                     width='6'
                     height='10'
                     viewBox='0 0 6 10'
                     fill='none'
                     xmlns='http://www.w3.org/2000/svg'
                  >
                     <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M5.70822 4.16834C5.89549 4.35584 6.00067 4.61 6.00067 4.875C6.00067 5.14001 5.89549 5.39417 5.70822 5.58167L1.93755 9.35367C1.74996 9.54118 1.49556 9.64649 1.23032 9.64642C0.965079 9.64636 0.710728 9.54094 0.52322 9.35334C0.335712 9.16574 0.230406 8.91134 0.230469 8.6461C0.230531 8.38086 0.335957 8.12651 0.523553 7.93901L3.58755 4.87501L0.523553 1.811C0.341304 1.62249 0.240389 1.36993 0.242543 1.10773C0.244697 0.845535 0.349748 0.594672 0.535069 0.409176C0.720391 0.22368 0.971154 0.118392 1.23335 0.115991C1.49555 0.113589 1.7482 0.214267 1.93689 0.396337L5.70889 4.16767L5.70822 4.16834Z'
                        fill='#0C62BB'
                     />
                  </svg>
               </Space>
            </Link>
         </div>
      </section>
   );
};
