'use client';
import React, { useEffect, useState } from 'react';
import { type Locale } from '@/i18n';
import { type TabsProps } from 'antd';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import dayjs from 'dayjs';
import {
   scrollToDefineId,
   translate,
   translateWeekDays,
} from '@/utils/commonRule';
import { getDepartmentDetails } from '@/api/departments';
import { queryKeys } from '@/utils';
import { ABOUTUS_STAFF_DETAILS, DEPARTMENT } from '@/constants/querykeys';

import { MEMBER } from '@/enums/privilege';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import profileFallback from '@/public/staticProfile.svg';
import classNames from 'classnames';
import { getAllMember } from '@/api/member';
import { isEmpty } from 'lodash';
import parse from 'html-react-parser';

export default function DepartmentDetails({
   params: { lang, details },
}: {
   params: { lang: Locale; details: string };
   searchParams: { id: number };
}) {
   const [activeKey, setActiveKey] = useState<string | null>('introduction');

   const { data: departmentDetails } = useQuery({
      queryFn: () => getDepartmentDetails(details),
      queryKey: queryKeys(DEPARTMENT).detail(details),
   });

   const { data: doctors } = useQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).lists(),
      queryFn: () =>
         getAllMember({
            type: MEMBER.DOCTOR,
            departmentId: departmentDetails?.id,
         }),
   });

   const onChange = (key: string) => {
      setActiveKey(key);
      scrollToDefineId(key);
   };

   const items: TabsProps['items'] = [
      {
         key: 'introduction',
         label: translate(lang, 'Introduction', 'परिचय'),
      },
      {
         key: 'schedule',
         label: translate(lang, 'Schedule', 'तालिका'),
      },
      {
         key: 'doctors',
         label: translate(lang, 'Our Doctors', 'हाम्रा डाक्टरहरू'),
      },
   ];

   useEffect(() => {
      const handleScroll = () => {
         const sectionOffsets: Record<string, number> = {};
         const sections = document.querySelectorAll('section');
         sections.forEach((section: HTMLElement) => {
            sectionOffsets[section.id] = section.offsetTop;
         });

         let activeSection = null;
         for (const [id, offset] of Object.entries(sectionOffsets)) {
            if (
               window.scrollY >= offset &&
               window.scrollY < offset + window.innerHeight
            ) {
               activeSection = id;
               break;
            }
         }

         if (
            activeSection === 'introduction' ||
            activeSection === 'schedule' ||
            activeSection === 'doctors'
         ) {
            setActiveKey(activeSection);
         } else {
            setActiveKey('introduction');
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   return (
      <div id={'unit_section'}>
         <article className='sticky top-[50px] z-10 bg-white  md:top-0 sm:top-0 sm:px-[20px]'>
            <div
               className={classNames(
                  '  mb-[25px] flex items-center gap-x-[15px] border-b border-[#E4E4E4] bg-white'
               )}
            >
               {items.map((tab) => (
                  <p
                     className={classNames(
                        tab.key === activeKey &&
                           'h-full border-b-2 border-primary py-[10px] text-primary',
                        ' cursor-pointer text-[18px] font-medium leading-[30px] text-[#808080] '
                     )}
                     key={tab.key}
                     onClick={() => {
                        onChange(tab.key);
                     }}
                  >
                     {tab.label}
                  </p>
               ))}
            </div>
         </article>
         <section className='mb-[20px] sm:px-[20px]' id='introduction'>
            <article>
               <div className='prose min-w-full'>
                  {parse(
                     translate(
                        lang,
                        departmentDetails?.content_En ?? '',
                        departmentDetails?.content_Np ?? ''
                     )
                  )}
               </div>
            </article>
         </section>

         <section
            className={classNames(
               'mb-[58px] mt-[13px] sm:mb-[20px] sm:px-[20px]'
            )}
            id='schedule'
         >
            <article>
               <p className=' text-[20px] font-medium leading-[33px] text-[#000000]'>
                  {translate(lang, 'OPD Days', 'ओपीडी दिनहरू')}
               </p>
               <table className='mt-[13px] w-full table-auto'>
                  <thead className='bg-primary py-[15px]'>
                     <tr>
                        <th className='py-[15px] pl-[22px] text-start text-[18px] font-medium leading-[23px] text-white'>
                           {translate(lang, 'Days', 'दिनहरू')}
                        </th>
                        <th className='py-[15px] pl-[22px] text-start text-[18px] font-medium leading-[23px] text-white'>
                           {translate(lang, 'Morning', 'बिहान')}
                        </th>
                        <th className='py-[15px] pl-[22px] text-start text-[18px] font-medium leading-[23px] text-white'>
                           {translate(lang, 'Afternoon', 'दिउँसो')}
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className='border'>
                        <td className='py-[15px] pl-[22px] text-start text-[18px] font-medium leading-[23px] text-[#505050]'>
                           {translateWeekDays(
                              lang,
                              departmentDetails?.opdDaysStart ?? ''
                           )}{' '}
                           -{' '}
                           {translateWeekDays(
                              lang,
                              departmentDetails?.opdDaysEnd ?? ''
                           )}
                        </td>
                        <td className='py-[15px] pl-[22px] text-start text-[18px] font-medium leading-[23px] text-[#505050]'>
                           {departmentDetails?.morningScheduleStart &&
                              dayjs(
                                 departmentDetails?.morningScheduleStart
                              ).format('hh:mm A')}{' '}
                           -{' '}
                           {departmentDetails?.morningScheduleEnd &&
                              dayjs(
                                 departmentDetails?.morningScheduleEnd
                              ).format('hh:mm A')}
                        </td>
                        <td className='py-[15px] pl-[22px] text-start text-[18px] font-medium leading-[23px] text-[#505050]'>
                           {departmentDetails?.afternoonScheduleStart &&
                              dayjs(
                                 departmentDetails?.afternoonScheduleStart
                              ).format('hh:mm A')}{' '}
                           -{' '}
                           {departmentDetails?.afternoonScheduleEnd &&
                              dayjs(
                                 departmentDetails?.afternoonScheduleEnd
                              ).format('hh:mm A')}
                        </td>
                     </tr>
                  </tbody>
               </table>
               {lang === 'en' ? (
                  <p className=' mt-[19px] text-[18px] font-normal leading-[30px] text-[#505050]'>
                     <span className='text-[#F12525]'> *</span> Note: On public
                     holidays, OPD Service available from{' '}
                     <span className='text-[#0C62BB]'> 9:00 AM - 11:00 </span>AM
                     except Saturday
                  </p>
               ) : (
                  <p className=' mt-[19px] text-[18px] font-normal leading-[30px] text-[#505050]'>
                     <span className='text-[#F12525]'> *</span> नोट: सार्वजनिक
                     बिदाहरूमा, शनिबार बाहेक बिहान{' '}
                     <span className='text-[#0C62BB]'> 9:00 देखि 11:00 </span>{' '}
                     बजे सम्म ओपीडी सेवा उपलब्ध छ।
                  </p>
               )}
            </article>
         </section>
         {!isEmpty(doctors?.result) && (
            <section className='' id='doctors'>
               <article>
                  <p className=' mb-[13px] text-[20px] font-medium leading-[33px] text-[#000000] sm:px-[20px]'>
                     {translate(lang, 'Our Doctors', 'हाम्रा डाक्टरहरू')}
                  </p>

                  <div className='grid grid-cols-4 gap-x-[51px] gap-y-[30px] bg-[#F5F6F8] px-[24px] py-[29px] md:grid-cols-3 md:gap-x-[15px] md:px-[20px] sm:grid-cols-2 sm:gap-x-[15px] sm:p-[20px]'>
                     {doctors?.result.map((mem) => {
                        return (
                           <div key={mem.id} className='w-full'>
                              <div className='relative h-[180px] w-full  object-cover md:h-[150px] sm:h-[150px]'>
                                 <Image
                                    className=' !h-full rounded-[5px] object-cover'
                                    src={
                                       BASE_IMAGE_URL + mem.image ??
                                       profileFallback
                                    }
                                    alt={'/doctor image'}
                                    fill
                                    sizes={'100%'}
                                    quality={100}
                                 />
                              </div>
                              <p className=' mt-[9px] overflow-hidden text-[18px] font-medium leading-[30px] text-grey30 sm:text-[16px] sm:leading-[26px]'>
                                 {lang === 'en' ? mem.name_En : mem.name_Np}
                              </p>
                              <p className=' text-[16px] font-normal leading-[26px] text-[#808080] sm:text-[14px] sm:leading-[23.27px]'>
                                 {lang === 'en'
                                    ? mem.position_En
                                    : mem.position_Np}
                              </p>
                           </div>
                        );
                     })}
                  </div>
               </article>
            </section>
         )}
      </div>
   );
}
