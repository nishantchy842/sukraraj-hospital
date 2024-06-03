/* eslint-disable @typescript-eslint/no-unsafe-argument */
'use client';
import { getAllDepartments } from '@/api/departments';
import { DEPARTMENT } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { Select, Table, type TableProps } from 'antd';
import React, { useState, type Key } from 'react';
import dayjs from 'dayjs';
import Breakcrumb from '@/app/components/common/breadcrumb';
import { translate, translateWeekDays } from '@/utils/commonRule';
import { type DepartmentDetails } from '@/models/departments';

const opdScheduleConfig = {
   pagination: false,
   page: 1,
   sort: 'updatedAt' as Key,
   order: 'DESC' as const,
   name: '',
};

export default function OpdSchedule({
   params: { lang },
}: {
   params: { lang: Locale };
}) {
   const { data: opdSchedule } = useQuery({
      queryFn: () => getAllDepartments(opdScheduleConfig),
      queryKey: queryKeys(DEPARTMENT).list(opdScheduleConfig),
   });

   const [tableData, setTableData] = useState(opdSchedule?.result ?? []);

   const handleChange = (value: string) => {
      if (value) {
         const filter = opdSchedule?.result?.filter(
            (item) => item.slug === value
         );
         setTableData(filter ?? []);
      } else {
         setTableData(opdSchedule?.result ?? []);
      }
   };

   const columns: TableProps<DepartmentDetails>['columns'] = [
      {
         title: 'Department',
         dataIndex: 'name_En',
         key: 'name_En',
         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
         render: (text, record) => translate(lang, text, record.name_Np ?? '-'),
      },
      {
         title: 'Room no/ OPD Floor',
         dataIndex: 'roomNo',
         key: 'roomNo',
         render: (text, record) => (
            <div>
               {text}/{record.opdFloor}
            </div>
         ),
      },
      {
         title: 'OPD Days',
         dataIndex: 'opdDaysStart',
         key: 'address',
         render: (value, record) => (
            <p>
               {translateWeekDays(lang, value)} -{' '}
               {translateWeekDays(lang, record.opdDaysEnd ?? '')}
            </p>
         ),
      },
      {
         title: 'Morning',
         dataIndex: 'morningScheduleStart',
         render: (_, record) => (
            <p>
               {record.morningScheduleStart &&
                  dayjs(record.morningScheduleStart).format('hh:mm A')}{' '}
               -
               {record.morningScheduleEnd &&
                  dayjs(record.morningScheduleEnd).format('hh:mm A')}
            </p>
         ),
      },
      {
         title: 'Afternoon',
         dataIndex: 'afternoon',
         key: 'afternoon',
         render: (_, record) => (
            <p>
               {record.afternoonScheduleStart &&
                  dayjs(record.afternoonScheduleStart).format('hh:mm A')}{' '}
               -{' '}
               {record.afternoonScheduleEnd &&
                  dayjs(record.afternoonScheduleEnd).format('hh:mm A')}
            </p>
         ),
      },
   ];

   return (
      <div id='opd_sechedule'>
         <div className='  bg-[#F2F2F2] px-[60px] py-[12px] md:px-[50px]  sm:px-[20px]'>
            <div className='mx-auto flex max-w-[1440px] items-center justify-between    sm:flex-col  sm:items-start sm:justify-start '>
               <Breakcrumb
                  title={translate(lang, 'OPD Schedule', 'ओपीडी तालिका')}
               />
               <div className=' h-[50px] w-[256px] sm:mt-[16px] sm:w-full'>
                  <Select
                     allowClear
                     className='!size-full'
                     onChange={handleChange}
                     options={opdSchedule?.result.map((item) => ({
                        value: item.slug,
                        label: translate(
                           lang,
                           item.name_En,
                           item.name_Np ?? ''
                        ),
                     }))}
                     placeholder={'All Departments'}
                     popupClassName='opd_dropdown'
                     suffixIcon={
                        <svg
                           width='12'
                           height='8'
                           viewBox='0 0 12 8'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M6.88667 7.38332C6.65229 7.61741 6.33459 7.74889 6.00333 7.74889C5.67208 7.74889 5.35438 7.61741 5.12 7.38332L0.405002 2.66999C0.170617 2.43549 0.0389844 2.11749 0.0390625 1.78594C0.0391407 1.4544 0.170923 1.13646 0.405418 0.902072C0.639914 0.667687 0.957914 0.536055 1.28946 0.536133C1.62101 0.536211 1.93895 0.667993 2.17333 0.902489L6.00333 4.73249L9.83334 0.902489C10.069 0.674678 10.3847 0.548534 10.7124 0.551226C11.0402 0.553919 11.3538 0.685232 11.5856 0.916884C11.8175 1.14854 11.9491 1.46199 11.9521 1.78974C11.9551 2.11748 11.8293 2.4333 11.6017 2.66916L6.8875 7.38416L6.88667 7.38332Z'
                              fill='#A9A9A9'
                           />
                        </svg>
                     }
                  />
               </div>
            </div>
         </div>

         <section className='px-[60px]  md:px-[50px] sm:px-[20px]'>
            <article className='mx-auto mt-[28px]   max-w-[1440px] '>
               <div className='flex items-center gap-x-[16px] sm:flex-col sm:items-start'>
                  <p className=' text-[24px] font-semibold leading-[40px] text-grey30 sm:text-[20px] sm:leading-[33px]'>
                     {translate(lang, 'OPD Timings', 'ओपीडी समय')}
                  </p>
                  <div className='flex items-center gap-x-[5px] sm:flex-col sm:items-start'>
                     <p className=' text-[20px] font-normal leading-[33px] text-grey50 sm:leading-[26px]'>
                        ({translate(lang, 'Morning', 'बिहान')} :{' '}
                        <span className=' text-primary'>
                           9:00 AM - 2:00 PM{' '}
                        </span>{' '}
                     </p>
                     <span className='sm:hidden'>|</span>
                     <p className=' text-[20px] font-normal leading-[33px] text-grey50 sm:leading-[26px]'>
                        {translate(lang, 'Afternoon', 'दिउँसो')} :{' '}
                        <span className=' text-primary'>
                           2:30 PM - 4:30 PM{' '}
                        </span>
                        )
                     </p>
                  </div>
               </div>
               {lang === 'en' ? (
                  <p className=' mt-[9px] text-[20px] font-normal leading-[33px] text-grey50 sm:text-[16px] sm:leading-[26px]'>
                     <span className=' text-[#F12525]'> *</span> Note: On public
                     holidays, OPD Service available for every department from{' '}
                     <span className=' text-primary'> 9:00 AM - 11:00 AM</span>{' '}
                     except Saturday{' '}
                  </p>
               ) : (
                  <p className=' mt-[9px] text-[20px] font-normal leading-[33px] text-grey50 sm:text-[16px] sm:leading-[26px]'>
                     <span className=' text-[#F12525]'> *</span>नोट: सार्वजनिक
                     बिदाका दिनमा र शनिबार बाहेक बिहान{' '}
                     <span className=' text-primary'> 9:00 AM - 11:00 AM </span>{' '}
                     बजेसम्म प्रत्येक विभागमा ओपीडी सेवा उपलब्ध छ।
                  </p>
               )}
            </article>
            <article className='mx-auto mt-[28px]  max-w-[1440px] md:overflow-x-auto  sm:overflow-x-auto  '>
               <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={{
                     hideOnSinglePage: true,
                  }}
                  scroll={{ x: 1300 }}
               />
            </article>
         </section>
      </div>
   );
}
