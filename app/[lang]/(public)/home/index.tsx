/* eslint-disable @typescript-eslint/no-restricted-imports */
'use client';

import { Avatar, Carousel, Image as AntImage, Empty } from 'antd';
import Image from 'next/image';
import React, { useRef, type ReactElement } from 'react';
import styles from './style.module.scss';
import { useQuery } from '@tanstack/react-query';
import MessageFromBoardSlider from '@/app/components/messageSlider';
import {
   HotLineIcon,
   OPDScheduleIcon,
   OpeningHourIcon,
} from '@/app/components/commonIcon/scheduleIcon';
import { useRouter } from 'next/navigation';
import { queryKeys } from '@/utils';
import {
   ABOUTUS,
   BANNER,
   BASICINFO,
   BOARD_MESSAGE,
   DAILY_CAPACITY,
   DEPARTMENT,
   TEAM_MEMBER,
} from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { getAboutUs } from '@/api/aboutUs';
import StatsCard from './statsCard';
import { getAllDepartments } from '@/api/departments';
import Link from 'next/link';
import quickLink from './quickLink.json';
import NoticePopup from './noticePopup';
import ServiceSection from './serviceSection';
import {
   getAllBanners,
   getBasicInformation,
   getDailyCapacity,
} from '@/api/home';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { getAllMember } from '@/api/member';
import NoticeSection from './noticeSection';
import GallerySection from './gallerySection';
import parse from 'html-react-parser';
import { MEMBER } from '@/enums/privilege';
import { type CarouselRef } from 'antd/es/carousel';
import { isEmpty } from 'lodash';
import staticImage from '@/public/staticProfile.svg';
import { translate } from '@/utils/commonRule';

type Schedule = {
   icon: ReactElement;
   title: string;
   extra: ReactElement;
};

export default function Home({
   params: { lang },
}: {
   params: { lang: Locale };
}) {
   const router = useRouter();

   //banner
   const { data: bannerList } = useQuery({
      queryFn: () => getAllBanners({}),
      queryKey: queryKeys(BANNER).lists(),
   });

   const bannerFilterByPriority =
      bannerList?.result.sort((a, b) => a.priority - b.priority) ?? [];

   const { data: boardMessage } = useQuery({
      queryFn: () =>
         getAllMember({ type: MEMBER.BOARD_MEMBER, pagination: false }),
      queryKey: queryKeys(BOARD_MESSAGE).detail(MEMBER.BOARD_MEMBER),
   });

   const { data: teamMembers } = useQuery({
      queryFn: () =>
         getAllMember({ type: MEMBER.TEAM_MEMBER, pagination: false }),
      queryKey: queryKeys(TEAM_MEMBER).detail(MEMBER.TEAM_MEMBER),
   });

   const { data: aboutUsData } = useQuery({
      queryFn: () => getAboutUs(),
      queryKey: queryKeys(ABOUTUS).lists(),
   });

   const { data: departmentData } = useQuery({
      queryFn: () =>
         getAllDepartments({
            size: 8,
         }),
      queryKey: queryKeys(DEPARTMENT).lists(),
   });

   const { data: basicInfo } = useQuery({
      queryFn: () => getBasicInformation(),
      queryKey: queryKeys(BASICINFO).lists(),
   });

   const { data: dailyCapacity } = useQuery({
      queryFn: () => getDailyCapacity(),
      queryKey: queryKeys(DAILY_CAPACITY).lists(),
   });

   const openingSchedule: Schedule[] = [
      {
         icon: <OpeningHourIcon />,
         title: 'Emergency and Inpatient',
         extra: (
            <p className=' text-[20px] font-normal leading-[33px] text-grey50 md:text-center md:text-[18px] md:leading-[30px] sm:text-[16px] sm:leading-[24px]'>
               24 hour service available
            </p>
         ),
      },
      {
         icon: <HotLineIcon />,
         title: 'Emergency Hotline',
         extra: (
            <div>
               {!isEmpty(basicInfo?.emergencyHotlines)
                  ? basicInfo?.emergencyHotlines.map((emg) => (
                       <p
                          key={emg}
                          className=' text-[20px] font-normal text-grey50 md:text-center md:text-[18px] md:leading-[30px] sm:text-[16px] sm:leading-[24px]'
                       >
                          {emg}
                       </p>
                    ))
                  : '-'}
            </div>
         ),
      },
      {
         icon: <OPDScheduleIcon />,
         title: 'OPD Schedule',
         extra: (
            <div>
               {!isEmpty(basicInfo?.opdSchedules)
                  ? basicInfo?.opdSchedules.map((item) => (
                       <p
                          key={item}
                          className=' text-[20px] font-normal text-grey50 md:text-center md:text-[18px] md:leading-[30px] sm:text-[16px] sm:leading-[24px]'
                       >
                          {item}
                       </p>
                    ))
                  : '-'}
            </div>
         ),
      },
   ];

   const bannerRef = useRef<CarouselRef>(null);

   return (
      <div className={styles.home_container}>
         <NoticePopup lang={lang} />
         <section className='px-[60px] pt-[24px] md:px-[50px] sm:px-[0px] sm:pt-0'>
            <div className='hidden h-[363px] w-[870px] md:hidden sm:mb-[12px] sm:block sm:h-[204px] sm:w-full'>
               <Carousel ref={bannerRef} autoplay autoplaySpeed={4000}>
                  {bannerFilterByPriority.map((banner) => (
                     <div
                        className='relative h-[363px] w-full md:h-[px] sm:h-[203px] '
                        key={banner.id}
                     >
                        <Image
                           className='!h-full !w-full object-cover'
                           src={BASE_IMAGE_URL + banner.image}
                           alt='/'
                           fill={true}
                           sizes='100%'
                           quality={100}
                        />
                     </div>
                  ))}
               </Carousel>
            </div>
            <section className='mx-auto flex h-[363px] max-w-[1440px] gap-x-[30px] sm:grid sm:h-auto'>
               <article className=' w-[870px]  sm:w-[363px]'>
                  {isEmpty(bannerFilterByPriority) ? (
                     <Empty
                        description='No banner'
                        className='flex h-[363px] flex-col items-center justify-center'
                     />
                  ) : (
                     <article className='relative sm:hidden'>
                        <svg
                           className=' absolute right-0 top-[50%] z-10 translate-y-[-50%]  cursor-pointer sm:hidden'
                           width='48'
                           height='48'
                           viewBox='0 0 48 48'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                           onClick={() => {
                              bannerRef?.current?.next();
                           }}
                        >
                           <rect
                              width='48'
                              height='48'
                              fill='black'
                              fillOpacity='0.2'
                           />
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M28.0604 22.9401C28.3413 23.2213 28.4991 23.6026 28.4991 24.0001C28.4991 24.3976 28.3413 24.7788 28.0604 25.0601L22.4044 30.7181C22.123 30.9994 21.7414 31.1573 21.3435 31.1572C20.9457 31.1571 20.5641 30.999 20.2829 30.7176C20.0016 30.4362 19.8437 30.0546 19.8437 29.6567C19.8438 29.2589 20.002 28.8774 20.2834 28.5961L24.8794 24.0001L20.2834 19.4041C20.01 19.1213 19.8586 18.7425 19.8619 18.3492C19.8651 17.9559 20.0227 17.5796 20.3007 17.3014C20.5786 17.0231 20.9548 16.8652 21.3481 16.8616C21.7414 16.858 22.1203 17.009 22.4034 17.2821L28.0614 22.9391L28.0604 22.9401Z'
                              fill='white'
                           />
                        </svg>

                        <svg
                           className=' absolute left-0 top-[50%] z-10 translate-y-[-50%]  cursor-pointer sm:hidden'
                           onClick={() => {
                              bannerRef?.current?.prev();
                           }}
                           width='48'
                           height='48'
                           viewBox='0 0 48 48'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <rect
                              x='48'
                              y='48'
                              width='48'
                              height='48'
                              transform='rotate(-180 48 48)'
                              fill='black'
                              fillOpacity='0.2'
                           />
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M19.9396 25.0599C19.6587 24.7786 19.5009 24.3974 19.5009 23.9999C19.5009 23.6024 19.6587 23.2212 19.9396 22.9399L25.5956 17.2819C25.877 17.0006 26.2586 16.8427 26.6565 16.8428C27.0543 16.8429 27.4359 17.001 27.7171 17.2824C27.9984 17.5638 28.1563 17.9454 28.1562 18.3433C28.1562 18.7411 27.998 19.1226 27.7166 19.4039L23.1206 23.9999L27.7166 28.5959C27.99 28.8787 28.1414 29.2575 28.1381 29.6508C28.1349 30.0441 27.9773 30.4204 27.6993 30.6986C27.4214 30.9769 27.0452 31.1348 26.6519 31.1384C26.2586 31.142 25.8797 30.991 25.5966 30.7179L19.9386 25.0609L19.9396 25.0599Z'
                              fill='white'
                           />
                        </svg>

                        <div className='h-[363px] w-[870px] sm:h-[204px] sm:w-full'>
                           <Carousel
                              ref={bannerRef}
                              autoplay
                              autoplaySpeed={4000}
                           >
                              {bannerFilterByPriority.map((banner) => (
                                 <div
                                    className='relative h-[363px] w-full md:h-[px] sm:h-[203px] '
                                    key={banner.id}
                                 >
                                    <Image
                                       className='!h-full !w-full object-cover'
                                       src={BASE_IMAGE_URL + banner.image}
                                       alt='/'
                                       fill={true}
                                       sizes='100%'
                                       quality={100}
                                    />
                                 </div>
                              ))}
                           </Carousel>
                        </div>
                     </article>
                  )}
               </article>
               <article className='size-full overflow-y-auto sm:h-[250px] sm:px-[20px]'>
                  <p className='relative text-[28px] font-medium leading-[53px] text-grey30 before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px] before:bg-secondary md:text-[28px] md:leading-[53px] sm:text-[26px] sm:leading-[43px]'>
                     {lang === 'np'
                        ? 'हाम्रो टोलीका सदस्यहरू'
                        : 'Meet Our Team'}
                  </p>
                  <div className=' mt-[17px] bg-[#F5F6F8] px-[15px]'>
                     {teamMembers?.result.map((item) => (
                        <div
                           key={item.id}
                           className='flex gap-x-[10px] border-b py-[15px]'
                        >
                           <Avatar
                              src={BASE_IMAGE_URL + item.image}
                              className=' !size-[64px] sm:!size-[48px]'
                              shape='square'
                           />
                           <div>
                              <p className=' text-[18px] font-medium leading-[24px] text-[#303030]'>
                                 {translate(
                                    lang,
                                    item.name_En,
                                    item.name_Np ?? ''
                                 )}
                              </p>
                              <p className=' text-[16px] font-medium leading-[26.59px] text-[#B82432]'>
                                 {translate(
                                    lang,
                                    item.position_En ?? '',
                                    item.position_Np ?? ''
                                 )}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </article>
            </section>
         </section>
         <section className=' px-[60px] pb-[60px] pt-[35px] md:px-[50px] sm:px-[20px]'>
            <article className='mx-auto  grid max-w-[1440px] grid-cols-[2fr_1fr] gap-x-[32px] md:flex md:flex-col-reverse md:gap-y-[50px] sm:flex sm:flex-col-reverse sm:gap-y-[30px]'>
               <div className='w-full md:w-full sm:w-full'>
                  <p className=' relative text-[28px] font-medium leading-[53px] text-grey30 before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px] before:bg-secondary md:text-[28px] md:leading-[53px] sm:text-[26px] sm:leading-[43px]'>
                     {lang === 'en' ? 'About' : 'बारेमा'}
                  </p>
                  {lang === 'en' ? (
                     <div className='mb-[14px] mt-[20px] !text-[18px] font-[400] leading-[34px] text-grey50'>
                        {aboutUsData?.history_En ? (
                           parse(aboutUsData?.history_En ?? '')
                        ) : (
                           <Empty />
                        )}
                     </div>
                  ) : (
                     <div className=' mb-[14px] mt-[20px] line-clamp-6 text-[18px] font-[400] leading-[34px] text-grey50'>
                        {aboutUsData?.history_Np ? (
                           parse(aboutUsData?.history_Np ?? '')
                        ) : (
                           <Empty />
                        )}
                     </div>
                  )}
                  <button
                     type='button'
                     className='flex items-center justify-center gap-x-[7px] rounded-[5px] bg-primary px-[20px] py-[11.5px] text-[16px] font-medium leading-[26px] text-white sm:w-full'
                     onClick={() => {
                        router.push('/about-us');
                     }}
                  >
                     <div className='flex items-center gap-x-[7px]'>
                        <span>Read more</span>
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
                              d='M5.70675 4.2934C5.89402 4.4809 5.99921 4.73507 5.99921 5.00007C5.99921 5.26507 5.89402 5.51923 5.70675 5.70673L1.93609 9.47873C1.74849 9.66624 1.49409 9.77155 1.22885 9.77148C0.963614 9.77142 0.709264 9.666 0.521756 9.4784C0.334247 9.2908 0.228941 9.0364 0.229004 8.77116C0.229066 8.50592 0.334492 8.25157 0.522089 8.06407L3.58609 5.00007L0.522088 1.93607C0.339839 1.74755 0.238924 1.49499 0.241078 1.2328C0.243232 0.970596 0.348283 0.719733 0.533604 0.534237C0.718926 0.348741 0.96969 0.243453 1.23189 0.241052C1.49408 0.23865 1.74673 0.339328 1.93542 0.521398L5.70742 4.29273L5.70675 4.2934Z'
                              fill='white'
                           />
                        </svg>
                     </div>
                  </button>
               </div>
               <div className='flex flex-col gap-y-[30px] md:flex-row md:justify-between md:gap-x-[16px] sm:gap-y-[20px]'>
                  {openingSchedule?.map((item: Schedule) => (
                     <div
                        key={item?.title}
                        className='flex items-center gap-x-[20px] md:flex-col'
                     >
                        {item?.icon}
                        <div className='flex flex-col md:items-center md:justify-center'>
                           <p className='text-[20px] font-semibold text-grey30 md:text-center md:text-[18px] md:leading-[30px] sm:text-[18px] sm:leading-[27px]'>
                              {item?.title}
                           </p>
                           {item?.extra}
                        </div>
                     </div>
                  ))}
               </div>
            </article>
         </section>

         <section className='px-[60px] pb-[60px] md:px-[50px] sm:px-[20px]'>
            <section className='mx-auto grid max-w-[1440px] grid-cols-2 gap-x-[56px] md:grid-cols-1  sm:grid-cols-1  sm:gap-y-[30px] '>
               <article className=''>
                  <p className='relative  text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:left-[0] before:h-[2px] before:w-[40px]  before:rounded-[5px] before:bg-secondary md:text-[32px] md:leading-[53px] sm:text-[26px] sm:leading-[43px] '>
                     {lang === 'en' ? 'Organogram' : 'संगठनात्मक संरचना'}
                  </p>

                  <div className='relative mt-[20px] h-[378px] w-full  md:h-[430px] sm:h-[187px]'>
                     {aboutUsData?.organogramFileLink ? (
                        <AntImage
                           className='!h-full object-contain'
                           src={
                              aboutUsData?.organogramFileLink
                                 ? BASE_IMAGE_URL +
                                   aboutUsData?.organogramFileLink
                                 : '/staticProfile.svg'
                           }
                           alt='/'
                           fallback='/staticProfile.svg'
                        />
                     ) : (
                        <Image src={staticImage} fill alt='/' sizes='100%' />
                     )}
                  </div>
               </article>
               <article className=''>
                  <p className='relative mb-[19px] text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px] before:bg-secondary md:text-[32px] md:leading-[53px] sm:mb-[17px] sm:text-[26px]  sm:leading-[43px]   '>
                     {lang === 'en'
                        ? 'Message from the board'
                        : 'बोर्डबाट सन्देश'}
                  </p>

                  <div className='grid max-h-[470px] gap-y-[19px] overflow-y-auto'>
                     {boardMessage?.result.map((item) => (
                        <MessageFromBoardSlider
                           key={item.id}
                           lang={lang}
                           data={item}
                        />
                     ))}
                  </div>
               </article>
            </section>
         </section>
         {!isEmpty(dailyCapacity) && (
            <section className=' px-[60px] md:px-[50px] sm:px-[20px]'>
               <article className=' mx-auto max-w-[1440px]'>
                  <p className='relative text-center text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:left-[50%] before:h-[2px] before:w-[40px] before:translate-x-[-50%] before:rounded-[5px] before:bg-secondary md:text-[32px]  md:leading-[53px] sm:text-[26px] sm:leading-[43px] sm:before:left-[50%] sm:before:translate-x-[-50%]'>
                     {lang === 'en' ? 'Daily capacity' : 'दैनिक क्षमता'}
                  </p>
                  <div className='mt-[35px] grid grid-cols-6 gap-[30px] md:grid-cols-3 md:gap-[20px] sm:grid-cols-2 sm:gap-[20px]'>
                     {dailyCapacity?.map((daily) => (
                        <StatsCard
                           key={daily?.key_En}
                           data={{
                              count: daily.value,
                              label:
                                 lang === 'en' ? daily.key_En : daily.key_Np,
                           }}
                        />
                     ))}
                  </div>
               </article>
            </section>
         )}

         <ServiceSection lang={lang} />

         {!isEmpty(departmentData?.result) && (
            <section className=' mb-[60px]  px-[60px] md:px-[50px] sm:mb-0 sm:px-[20px]'>
               <article className=' mx-auto max-w-[1440px]'>
                  <div className='mb-[30px] '>
                     <p className='relative text-center text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:left-[50%] before:h-[2px] before:w-[40px] before:translate-x-[-50%] before:rounded-[5px] before:bg-secondary md:text-[32px] md:leading-[53px] sm:text-[26px] sm:leading-[43px]'>
                        {lang === 'en' ? 'Our Units' : 'हाम्रो एकाइहरू'}
                     </p>
                  </div>
                  <article className='mx-auto grid max-w-[1440px] grid-cols-4 gap-[30px] md:gap-[20px] sm:grid-cols-2 sm:gap-[10px]'>
                     {departmentData?.result.map((item) => (
                        <Link
                           key={item.slug}
                           href={`/${lang}/units/${item.slug}`}
                        >
                           <div className='flex h-[233px] cursor-pointer flex-col  items-center justify-start rounded-[10px] border bg-[#F5F6F8] px-[17px] pb-[6px] pt-[25px] hover:border-secondary hover:delay-75 md:px-[15px]  sm:h-[155px] sm:w-full sm:px-[8px]'>
                              <div className='size-[60px] md:size-[40px] sm:size-[40px]'>
                                 {item.image ? (
                                    <Avatar
                                       src={BASE_IMAGE_URL + item.image}
                                       className='!size-full'
                                       shape='square'
                                    />
                                 ) : (
                                    <Avatar
                                       className='!size-full'
                                       shape='square'
                                    >
                                       {item.name_En.charAt(0)}
                                    </Avatar>
                                 )}
                              </div>
                              <p className=' mb-[12px] mt-[15px] text-center text-[20px] font-medium text-[#303030] md:text-[16px] md:leading-[23px] sm:mb-[6px] sm:mt-[4px] sm:text-[16px] sm:leading-[23px]'>
                                 {lang === 'en' ? item?.name_En : item?.name_Np}
                              </p>

                              <p className='line-clamp-2 text-center text-[16px] font-normal leading-[30px] text-[#808080] md:text-[14px] md:leading-[23px] sm:h-[47px] sm:overflow-hidden sm:text-[14px] sm:leading-[23px]'>
                                 {lang === 'en'
                                    ? item?.description_En ?? ''
                                    : item?.description_Np ?? ''}
                              </p>
                           </div>
                        </Link>
                     ))}
                  </article>
                  <div className='mt-[40px] flex items-center justify-center sm:w-full'>
                     <button
                        type='button'
                        className=' flex items-center justify-center rounded-[5px] bg-primary px-[20px] py-[11.5px] text-[16px] font-medium leading-[26px] text-white sm:w-full'
                        onClick={() => {
                           router.push('/units');
                        }}
                     >
                        <div className='flex items-center justify-between gap-x-[7px]'>
                           <span>View all Units</span>
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
                                 d='M5.70675 4.2934C5.89402 4.4809 5.99921 4.73507 5.99921 5.00007C5.99921 5.26507 5.89402 5.51923 5.70675 5.70673L1.93609 9.47873C1.74849 9.66624 1.49409 9.77155 1.22885 9.77148C0.963614 9.77142 0.709264 9.666 0.521756 9.4784C0.334247 9.2908 0.228941 9.0364 0.229004 8.77116C0.229066 8.50592 0.334492 8.25157 0.522089 8.06407L3.58609 5.00007L0.522088 1.93607C0.339839 1.74755 0.238924 1.49499 0.241078 1.2328C0.243232 0.970596 0.348283 0.719733 0.533604 0.534237C0.718926 0.348741 0.96969 0.243453 1.23189 0.241052C1.49408 0.23865 1.74673 0.339328 1.93542 0.521398L5.70742 4.29273L5.70675 4.2934Z'
                                 fill='white'
                              />
                           </svg>
                        </div>
                     </button>
                  </div>
               </article>
            </section>
         )}

         <NoticeSection lang={lang} />

         <GallerySection lang={lang} />

         <section className=' px-[60px] pt-[60px] md:px-[50px] md:pb-[57px] sm:px-[20px] sm:pb-[29px] sm:pt-[30px]'>
            <article className='mx-auto grid max-w-[1440px]  grid-cols-[2fr_1fr] gap-x-[56px] md:grid-cols-1 md:gap-y-[50px] sm:grid-cols-1 sm:gap-y-[30px]'>
               <div>
                  <p className='relative  text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px]  before:bg-secondary md:text-[32px] md:leading-[53px] sm:text-center  sm:text-[26px] sm:leading-[43px] sm:before:left-[50%] sm:before:translate-x-[-50%]'>
                     {lang === 'en' ? ' Quick links' : 'द्रुत लिङ्कहरू'}
                  </p>
                  <div className='mt-[30px] grid grid-cols-3 gap-[20px] sm:grid-cols-2'>
                     {quickLink.links.map((link) => (
                        <Link key={link.url} href={link.url}>
                           <div className='flex  h-full items-center justify-center rounded-[10px] border bg-[#F5F6F8] py-[19px] text-grey30 hover:bg-primary hover:text-white'>
                              <p className=' text-center text-[20px] font-medium leading-[33px]   sm:text-[16px] sm:leading-[26px]'>
                                 {lang === 'en' ? link.title_En : link.title_Np}
                              </p>
                           </div>
                        </Link>
                     ))}
                  </div>
               </div>
               <div className='w-full'>
                  <p className='relative  text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:h-[2px] before:w-[40px]  before:rounded-[5px] before:bg-secondary  md:text-[32px] md:leading-[53px] sm:text-center  sm:text-[26px] sm:leading-[43px] sm:before:left-[50%] sm:before:translate-x-[-50%]'>
                     {lang === 'en' ? 'Follow us on facebook' : 'फेसबुक'}
                  </p>
                  <div className='mt-[30px]'>
                     <iframe
                        title='Facebook Plugin'
                        src='https://www.facebook.com/plugins/page.php?href=https://www.facebook.com/STIDHNepal&tabs=timeline&width=1000&height=300&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true'
                        width='100%'
                        height='300'
                        scrolling='no'
                        frameBorder='0'
                        allowFullScreen={true}
                        allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
                     ></iframe>
                  </div>
               </div>
            </article>
         </section>
      </div>
   );
}
