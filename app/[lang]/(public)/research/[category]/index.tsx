'use client';
import { getAllResearch, getSingleResearchCategory } from '@/api/research';
import { RESEARCH, RESEARCH_CATEGORY } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { researchConfig } from './rearchConfig';
import { Empty, Input, Pagination, Space } from 'antd';
import Link from 'next/link';
import { isEmpty } from 'lodash';
import Breakcrumb from '@/app/components/common/breadcrumb';
import ResearchSidebar from './@sidebar';
import { converAdToBs, translate } from '@/utils/commonRule';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';

export default function Research({
   params: { lang, category },
}: {
   params: { lang: Locale; category: string };
}) {
   const [config, setConfig] = useState(researchConfig);
   const { data } = useQuery({
      queryFn: () =>
         getAllResearch({
            ...config,
            researchCategorySlug: category,
         }),
      queryKey: queryKeys(RESEARCH).list(config),
   });

   const { data: categoryDetails } = useQuery({
      queryFn: () => getSingleResearchCategory(category),
      queryKey: queryKeys(RESEARCH_CATEGORY).detail(category),
   });

   return (
      <div className=''>
         <section className=' bg-[#F2F2F2] px-[60px] py-[12px] md:px-[50px] sm:px-[20px]'>
            <div className=' mx-auto max-w-[1440px]  '>
               <div className='mx-auto flex max-w-[1440px]  items-center  justify-between sm:flex-col sm:items-start sm:justify-center'>
                  <Breakcrumb
                     title={translate(
                        lang,
                        categoryDetails?.title_En ?? '',
                        categoryDetails?.title_Np ?? ''
                     )}
                  />
                  <div className='w-[358px] sm:mt-[16px] sm:w-full'>
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
                        placeholder='Search'
                        onChange={(value) => {
                           setConfig((prev) => ({
                              ...prev,
                              title: value.target.value,
                              page: 1,
                           }));
                        }}
                     />
                  </div>
               </div>
            </div>
         </section>

         <section className='px-[60px] md:px-[50px] sm:px-[20px]'>
            <article className='mx-auto mt-[30px] flex max-w-[1440px] gap-x-[31px] md:flex-col  sm:mb-[40px]  sm:mt-[15px] sm:flex-col '>
               <ResearchSidebar params={{ lang, category }} />
               <article className='w-full md:mt-[30px]'>
                  {isEmpty(data?.result) ? (
                     <Empty className='w-full' />
                  ) : (
                     <article className=' w-full border '>
                        {data?.result?.map((notice) => (
                           <div
                              key={notice.id}
                              className='flex items-center justify-between gap-x-[15px] pb-[13px]  pr-[27px] pt-[19px] even:bg-[#F2F2F2] sm:py-[10px] sm:pr-[13px]'
                           >
                              <div className='shrink border-r pl-[27px] pr-[25px] sm:px-[15px]'>
                                 <div className=' flex h-fit w-[70px] flex-col gap-y-[9px]   text-[#808080]   '>
                                    <p className=' w-full text-center text-[16px]  font-normal leading-[22px]'>
                                       {lang === 'en'
                                          ? converAdToBs(
                                               notice?.updatedAt,
                                               'DD MMM'
                                            )
                                          : converAdToBs(
                                               notice?.updatedAt,
                                               'DD MMMM'
                                            )}
                                    </p>
                                    <p className=' w-full text-center text-[16px] font-normal leading-[22px]'>
                                       {converAdToBs(notice?.updatedAt, 'YYYY')}
                                    </p>
                                 </div>
                              </div>
                              <div className='flex flex-auto items-center justify-between  sm:flex-1'>
                                 <Space direction='vertical' size={7}>
                                    <p className=' text-[18px] font-medium leading-[25px] text-grey30 sm:text-[16px] sm:leading-[22px]'>
                                       {lang === 'en'
                                          ? notice.title_En.slice(0, 100)
                                          : notice.title_Np.slice(0, 100)}
                                    </p>
                                    <div className='flex items-center gap-x-[25px]'>
                                       <Link
                                          href={`/${lang}/research/${category}/${notice.slug}`}
                                       >
                                          <p className='flex items-center gap-x-[9px] text-[16px] font-medium leading-[27px] text-primary'>
                                             Read more
                                             <span>
                                                <svg
                                                   width='6'
                                                   height='11'
                                                   viewBox='0 0 6 11'
                                                   fill='none'
                                                   xmlns='http://www.w3.org/2000/svg'
                                                >
                                                   <path
                                                      fillRule='evenodd'
                                                      clipRule='evenodd'
                                                      d='M5.70627 4.7934C5.89353 4.9809 5.99872 5.23507 5.99872 5.50007C5.99872 5.76507 5.89353 6.01923 5.70627 6.20673L1.9356 9.97873C1.748 10.1662 1.4936 10.2715 1.22836 10.2715C0.963126 10.2714 0.708775 10.166 0.521267 9.9784C0.333759 9.7908 0.228453 9.5364 0.228516 9.27116C0.228578 9.00592 0.334004 8.75157 0.5216 8.56407L3.5856 5.50007L0.5216 2.43607C0.339351 2.24755 0.238436 1.99499 0.24059 1.7328C0.242744 1.4706 0.347794 1.21973 0.533116 1.03424C0.718437 0.848741 0.969201 0.743453 1.2314 0.741052C1.49359 0.73865 1.74625 0.839328 1.93493 1.0214L5.70693 4.79273L5.70627 4.7934Z'
                                                      fill='#0C62BB'
                                                   />
                                                </svg>
                                             </span>
                                          </p>
                                       </Link>
                                       {notice.downloadFile && (
                                          <Link
                                             href={
                                                BASE_IMAGE_URL +
                                                notice.downloadFile
                                             }
                                             download={notice.title_En}
                                             className=' sm:block'
                                             target='_blank'
                                          >
                                             <button
                                                type='button'
                                                className='flex items-center gap-x-[7px]'
                                             >
                                                <svg
                                                   width='13'
                                                   height='13'
                                                   viewBox='0 0 16 16'
                                                   fill='none'
                                                   xmlns='http://www.w3.org/2000/svg'
                                                >
                                                   <path
                                                      d='M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196666 15.0217 0.000666667 14.5507 0 14V11H2V14H14V11H16V14C16 14.55 15.8043 15.021 15.413 15.413C15.0217 15.805 14.5507 16.0007 14 16H2Z'
                                                      fill='#0C62BB'
                                                   />
                                                </svg>
                                                <p className='text-[16px] font-medium leading-[27px] text-primary'>
                                                   Download
                                                </p>
                                             </button>
                                          </Link>
                                       )}
                                    </div>
                                 </Space>
                              </div>
                           </div>
                        ))}
                     </article>
                  )}

                  <section className='mx-auto mt-[23px] flex max-w-[1440px] items-center justify-end pb-[108px] md:pb-0 sm:my-[20px] sm:pb-0'>
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
                        }}
                     />
                  </section>
               </article>
            </article>
         </section>
      </div>
   );
}
