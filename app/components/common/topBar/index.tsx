'use client';

import React, { useEffect, useState } from 'react';
import styles from './style.module.scss';
import Image from 'next/image';
import { Select, Space } from 'antd';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { LogoIcon } from '../../commonIcon/logoIcon';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import SideDrawer from './drawer';
import { type NavMenu } from '@/models/header';
import { type Locale } from '@/i18n';
import nepalFlag from '@/public/nepalFlag.svg';
import enlishFlag from '@/public/englishFlag.svg';
import classNames from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/ne';
import NepaliDate from 'nepali-date-converter';
import { redirectedPathName, translate } from '@/utils/commonRule';

export default function Topbar({
   data: { gov, min, title },
   navList,
   lang,
}: {
   data: { gov: string; min: string; title: string };
   navList: NavMenu;
   lang: Locale;
}) {
   const router = useRouter();

   const nepaliDate = new NepaliDate();

   const pathname = usePathname();

   const handleChange = (value: string) => {
      const pathSegments = pathname.split('/');
      pathSegments[1] = value;
      const newPath = pathSegments.join('/');
      router.push(newPath);
   };

   const date =
      lang === 'en'
         ? dayjs().format('dddd, DD MMM YYYY')
         : nepaliDate.format('ddd DD, MMMM YYYY', 'np');

   const [localeDate, setLocaleDate] = useState(date);

   const [currentTime, setCurrentTime] = useState(dayjs().format('hh:mm:ss A'));

   useEffect(() => {
      const intervalId = setInterval(() => {
         setCurrentTime(dayjs().format('hh:mm:ss A'));
         setLocaleDate(
            lang === 'en'
               ? dayjs().format('dddd, DD MMM YYYY')
               : nepaliDate.format('ddd DD, MMMM YYYY', 'np')
         );
      }, 1000);

      return () => {
         clearInterval(intervalId);
      };
   }, []);

   const [open, setOpen] = useState(false);

   const showDrawer = () => {
      setOpen(true);
   };

   const onClose = () => {
      setOpen(false);
   };

   return (
      <header
         className={classNames(
            styles.topbar_container,
            'px-[60px] sm:px-[20px]'
         )}
      >
         <SideDrawer
            onClose={onClose}
            open={open}
            navList={navList}
            lang={lang}
         />
         <section className=' mx-auto flex max-w-[1440px] items-center justify-between md:flex-col md:items-start sm:flex-col sm:items-start '>
            <div className='flex sm:w-full sm:justify-between '>
               <Link href={redirectedPathName(lang, '/')}>
                  <div className='flex gap-x-[4px] '>
                     <LogoIcon />
                     <div>
                        <p className='text-[16px] font-semibold leading-[26.59px] text-secondary sm:text-[11.42px] sm:leading-[13px]'>
                           {gov}
                        </p>
                        <p className=' text-[18px] font-semibold leading-[29.92px] text-secondary sm:my-[5px] sm:text-[11.42px] sm:leading-[13px]'>
                           {min}
                        </p>
                        <p className='text-[20px] font-semibold leading-[33.24px] text-secondary sm:text-[13.05px] sm:leading-[15.56px]'>
                           {title}
                        </p>
                        <p
                           className=' mt-[10px] hidden text-[16px] font-medium text-grey30 md:block sm:block sm:text-[11.42px] sm:leading-[18.56px] '
                           suppressHydrationWarning
                        >
                           {localeDate + ' | ' + currentTime}
                        </p>
                     </div>
                  </div>
               </Link>
               <div className='hidden  md:hidden  sm:flex sm:items-center sm:justify-center'>
                  <button
                     type='button'
                     className=' flex size-[40px] items-center justify-center rounded-[5px] bg-primary '
                     onClick={showDrawer}
                  >
                     <svg
                        width='18'
                        height='14'
                        viewBox='0 0 18 14'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                     >
                        <path
                           d='M1 1H17M1 7H17M1 13H8'
                           stroke='white'
                           strokeWidth='2'
                           strokeLinecap='round'
                           strokeLinejoin='round'
                        />
                     </svg>
                  </button>
               </div>
            </div>
            <article className='flex flex-col gap-y-[16px] sm:w-full'>
               <p
                  className='text-end text-[16px] font-medium text-grey30 md:hidden sm:hidden sm:text-[14px] sm:leading-[23px] '
                  suppressHydrationWarning
               >
                  {localeDate + ' | ' + currentTime}
               </p>
               <div className='flex justify-end  gap-x-[20px] md:mt-[24px] md:grid md:w-full md:grid-cols-[1.5fr_2fr_1fr_2fr] md:justify-between sm:mt-[8px] sm:grid sm:w-full  sm:grid-cols-[1.5fr_2fr_0.5fr] sm:justify-start sm:gap-x-[15px] sm:gap-y-[16px]'>
                  <button
                     type='button'
                     className=' flex h-[50px] items-center justify-center gap-x-[5px] rounded-[5px] bg-[#0C62BB] px-[10px] hover:bg-primary/80 sm:w-full  sm:px-[5px] '
                  >
                     <p className=' text-[16px] font-semibold leading-[23px]  text-[white] sm:text-[14px] sm:font-medium'>
                        {translate(lang, ' Online Ticketing', 'अनलाइन टिकट')}
                     </p>
                  </button>
                  <button
                     type='button'
                     className=' flex h-[50px] items-center justify-center gap-x-[5px] rounded-[5px] bg-[#0C62BB] px-[10px] hover:bg-primary/80 sm:w-full sm:px-[5px] sm:text-[14px] sm:leading-[23px]'
                  >
                     <p className=' text-[16px] font-semibold text-[white] sm:text-[14px] sm:font-medium'>
                        {translate(
                           lang,
                           'Book an Appointment',
                           'अपोइन्टमेन्ट बुक गर्नुहोस्'
                        )}
                     </p>
                  </button>
                  <Select
                     defaultValue={pathname.split('/')[1]}
                     onChange={handleChange}
                     className='!sm:w-[63px]'
                     options={[
                        {
                           value: 'np',
                           label: (
                              <div className='flex items-center justify-start gap-x-[5px]'>
                                 <Image
                                    src={nepalFlag}
                                    alt='/'
                                    quality={100}
                                    width={15}
                                    height={20}
                                 />
                                 <p className='sm:hidden'>नेपाली</p>
                              </div>
                           ),
                        },
                        {
                           value: 'en',
                           label: (
                              <Space>
                                 <div className=' relative h-[20px] w-[15px] sm:h-[24px] sm:w-[29px]'>
                                    <Image
                                       src={enlishFlag}
                                       alt='/'
                                       quality={100}
                                       fill
                                       sizes='100%'
                                    />
                                 </div>
                                 <p className='sm:hidden'>Eng</p>
                              </Space>
                           ),
                        },
                     ]}
                     suffixIcon={
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
                              d='M5.70855 5.70676C5.52105 5.89402 5.26689 5.99921 5.00189 5.99921C4.73689 5.99921 4.48272 5.89402 4.29522 5.70676L0.52322 1.93609C0.335712 1.74849 0.230406 1.49409 0.230469 1.22885C0.230531 0.963614 0.335957 0.709264 0.523553 0.521756C0.71115 0.334247 0.96555 0.228941 1.23079 0.229004C1.49603 0.229066 1.75038 0.334492 1.93789 0.522089L5.00189 3.58609L8.06589 0.522089C8.2544 0.33984 8.50696 0.238925 8.76916 0.241079C9.03136 0.243233 9.28222 0.348283 9.46772 0.533605C9.65321 0.718926 9.7585 0.96969 9.7609 1.23189C9.7633 1.49408 9.66263 1.74673 9.48055 1.93542L5.70922 5.70742L5.70855 5.70676Z'
                              fill='#303030'
                           />
                        </svg>
                     }
                  />
                  <div className='hidden md:flex md:items-end md:justify-end  sm:hidden '>
                     <button
                        type='button'
                        className=' size-[50px] rounded-[5px] bg-primary px-[17px] py-[19px] '
                        onClick={showDrawer}
                     >
                        <svg
                           width='18'
                           height='14'
                           viewBox='0 0 18 14'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              d='M1 1H17M1 7H17M1 13H8'
                              stroke='white'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                           />
                        </svg>
                     </button>
                  </div>
               </div>
            </article>
         </section>
      </header>
   );
}
