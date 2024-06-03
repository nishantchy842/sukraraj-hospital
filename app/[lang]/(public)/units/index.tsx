'use client';

import React, { useState } from 'react';
import { type Locale } from '@/i18n';
import { useQuery } from '@tanstack/react-query';
import { getAllDepartments } from '@/api/departments';
import { Avatar, Empty, Input, Pagination } from 'antd';
import Breakcrumb from '@/app/components/common/breadcrumb';
import Link from 'next/link';
import { DEPARTMENT } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { departmentConfig } from './config';
import ServiceCardLoader from '@/app/components/loader/serviceCardLoader';
import { translate } from '@/utils/commonRule';
import { isEmpty } from 'lodash';

export default function Departments({
   params: { lang },
}: {
   params: { lang: Locale };
}) {
   const [config, setConfig] = useState(departmentConfig);
   const { data, isLoading, isSuccess } = useQuery({
      queryFn: () => getAllDepartments(config),
      queryKey: queryKeys(DEPARTMENT).list(config),
   });

   return (
      <div className=''>
         <section className='  bg-[#F2F2F2] px-[60px] py-[12px] md:px-[50px] sm:px-[20px]'>
            <article className='mx-auto flex max-w-[1440px]  items-center  justify-between sm:flex-col sm:items-start sm:justify-start'>
               <Breakcrumb title={translate(lang, 'Units', 'एकाइहरू')} />
               <div className=' w-[358px] sm:mt-[15px] sm:w-full'>
                  <Input
                     className='h-[50px]'
                     suffix={
                        <svg
                           width='24'
                           height='24'
                           viewBox='0 0 24 24'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              d='M10.7702 18.3002C9.28094 18.3002 7.8251 17.8586 6.58679 17.0312C5.34849 16.2038 4.38335 15.0278 3.81342 13.6518C3.2435 12.2759 3.09438 10.7619 3.38492 9.30121C3.67547 7.84053 4.39263 6.49881 5.44572 5.44572C6.49881 4.39263 7.84053 3.67547 9.30121 3.38492C10.7619 3.09438 12.2759 3.2435 13.6518 3.81342C15.0278 4.38335 16.2038 5.34849 17.0312 6.58679C17.8586 7.8251 18.3002 9.28094 18.3002 10.7702C18.3002 11.7591 18.1055 12.7383 17.727 13.6518C17.3486 14.5654 16.794 15.3955 16.0948 16.0948C15.3955 16.794 14.5654 17.3486 13.6518 17.727C12.7383 18.1055 11.7591 18.3002 10.7702 18.3002ZM10.7702 4.75024C9.58355 4.75024 8.42351 5.10213 7.43682 5.76142C6.45012 6.42071 5.68109 7.35778 5.22696 8.45414C4.77283 9.55049 4.65401 10.7569 4.88553 11.9208C5.11704 13.0847 5.68848 14.1538 6.5276 14.9929C7.36671 15.832 8.43581 16.4034 9.5997 16.6349C10.7636 16.8665 11.97 16.7476 13.0663 16.2935C14.1627 15.8394 15.0998 15.0704 15.7591 14.0837C16.4183 13.097 16.7702 11.9369 16.7702 10.7502C16.7702 9.15894 16.1381 7.63282 15.0129 6.5076C13.8877 5.38238 12.3615 4.75024 10.7702 4.75024Z'
                              fill='#303030'
                           />
                           <path
                              d='M20 20.75C19.9014 20.7504 19.8038 20.7312 19.7128 20.6934C19.6218 20.6557 19.5392 20.6001 19.47 20.53L15.34 16.4C15.2075 16.2578 15.1354 16.0697 15.1388 15.8754C15.1422 15.6811 15.2209 15.4958 15.3583 15.3583C15.4958 15.2209 15.6811 15.1422 15.8754 15.1388C16.0697 15.1354 16.2578 15.2075 16.4 15.34L20.53 19.47C20.6704 19.6106 20.7493 19.8012 20.7493 20C20.7493 20.1987 20.6704 20.3893 20.53 20.53C20.4607 20.6001 20.3782 20.6557 20.2872 20.6934C20.1961 20.7312 20.0985 20.7504 20 20.75Z'
                              fill='#303030'
                           />
                        </svg>
                     }
                     onChange={(value) => {
                        setConfig((prev) => ({
                           ...prev,
                           name: value.target.value,
                           page: 1,
                        }));
                     }}
                     placeholder='Search department'
                  />
               </div>
            </article>
         </section>
         {isLoading ? (
            <section className='mt-[30px] px-[60px] md:px-[50px] sm:px-[20px]'>
               <article className='mx-auto grid max-w-[1440px] grid-cols-4 gap-x-[30px] gap-y-[34px] md:grid-cols-3 sm:grid-cols-2 sm:gap-[10px]'>
                  {[1, 2, 3, 4].map((item) => (
                     <ServiceCardLoader key={item} />
                  ))}
               </article>
            </section>
         ) : (
            <section className=' px-[60px] pb-[72px] pt-[30px] md:px-[50px] sm:px-[20px] sm:pb-[40px] sm:pt-[20px]'>
               {isEmpty(data?.result) ? (
                  <Empty />
               ) : (
                  <article className='mx-auto grid max-w-[1440px] grid-cols-4 items-center justify-center  gap-[30px] md:gap-x-[20px] sm:grid-cols-2 sm:gap-[10px]'>
                     {data?.result.map((item) => (
                        <Link
                           key={item.slug}
                           href={`/${lang}/units/${item.slug}?id=${item.id}`}
                        >
                           <div className=' h-[233px] w-full  cursor-pointer   gap-y-[15px] rounded-[10px] border bg-[#F5F6F8] px-[17px] py-[20px] hover:border-secondary hover:delay-75 md:h-[169px] md:px-[15px] sm:h-[169px] sm:px-[8px]'>
                              <div className='flex items-center justify-center'>
                                 {item.image ? (
                                    <Avatar
                                       src={BASE_IMAGE_URL + item.image}
                                       className=' !size-[60px] sm:!size-[40px]'
                                       shape='square'
                                    />
                                 ) : (
                                    <Avatar
                                       className=' !size-[60px] sm:!size-[40px] '
                                       shape='square'
                                    >
                                       {item.name_En.charAt(0)}
                                    </Avatar>
                                 )}
                              </div>
                              <p className='my-[15px]  text-center text-[20px] font-medium text-[#303030] md:mb-[6px] md:mt-[4px] sm:mb-[6px] sm:mt-[4px] sm:text-[16px]'>
                                 {lang === 'en' ? item?.name_En : item?.name_Np}
                              </p>

                              <p className='line-clamp-2 text-center text-[16px] font-normal leading-[30px] text-[#808080] md:h-[50px]  md:leading-[23px] sm:h-[50px]  sm:text-[14px] sm:leading-[23px]'>
                                 {lang === 'en'
                                    ? item?.description_En ?? ''
                                    : item?.description_Np ?? ''}
                              </p>
                           </div>
                        </Link>
                     ))}
                  </article>
               )}
            </section>
         )}
         <section className='mx-auto flex max-w-[1440px] items-center justify-center  '>
            <Pagination
               current={config?.page}
               pageSize={config.size}
               total={data?.count}
               hideOnSinglePage
               onChange={(page) => {
                  setConfig((prev) => ({
                     ...prev,
                     page,
                  }));
                  if (isSuccess) {
                     scrollTo({
                        top: 0,
                        behavior: 'smooth',
                     });
                  }
               }}
            />
         </section>
      </div>
   );
}
