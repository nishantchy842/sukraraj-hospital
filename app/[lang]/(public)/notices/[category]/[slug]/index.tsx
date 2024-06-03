'use client';
import { getAllNotice, getSingleNoticeDetails } from '@/api/notice';
import { NOTICE } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Image, Space } from 'antd';
import Link from 'next/link';
import Breakcrumb from '@/app/components/common/breadcrumb';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { converAdToBs, translate } from '@/utils/commonRule';
import parse from 'html-react-parser';

export default function NoticeDetails({
   params: { lang, category, slug },
}: {
   params: { lang: Locale; category: string; slug: string };
}) {
   const { data: otherNotices } = useQuery({
      queryFn: () => getAllNotice({ pagination: false, sort: 'date' }),
      queryKey: queryKeys(NOTICE).detail('OTHER_NOTICE'),
   });

   const { data: noticeDetails } = useQuery({
      queryFn: () => getSingleNoticeDetails(slug),
      queryKey: queryKeys(NOTICE).detail(slug),
   });

   return (
      <section>
         <section className=' bg-[#F2F2F2]  px-[60px] py-[12px] md:px-[50px] sm:px-[20px]'>
            <div className=' mx-auto max-w-[1440px] '>
               <span className='mx-auto flex max-w-[1440px]  items-center  justify-between'>
                  <Breakcrumb
                     title={translate(
                        lang,
                        noticeDetails?.title_En ?? '',
                        noticeDetails?.title_Np ?? ''
                     )}
                  />
               </span>
            </div>
         </section>

         <section className='px-[60px] md:px-[50px] sm:px-[20px]'>
            <section className='mx-auto mt-[41px] grid max-w-[1440px] grid-cols-[2fr_1fr] gap-x-[82px] md:mb-[45px]  md:grid-cols-1 sm:mb-[49px]  sm:mt-[18px]  sm:grid-cols-1 '>
               <article>
                  <article>
                     <div className='flex items-center justify-between border-b pb-[13px]  sm:items-start sm:justify-between sm:gap-x-[16px] '>
                        <div>
                           <p className=' text-[24px] font-medium leading-[40px] text-grey30 sm:text-[18px] sm:leading-[30px]'>
                              {lang === 'en'
                                 ? noticeDetails?.title_En
                                 : noticeDetails?.title_Np ?? ''}
                           </p>
                        </div>

                        {noticeDetails?.downloadFile && (
                           <Link
                              href={
                                 BASE_IMAGE_URL + noticeDetails?.downloadFile
                              }
                              download={noticeDetails?.title_En}
                              target='_blank'
                           >
                              <button
                                 type='button'
                                 className='flex items-center gap-x-[10px] rounded-[5px] !bg-primary px-[10px] py-[11.5px] sm:px-[14px] '
                              >
                                 <svg
                                    width='16'
                                    height='16'
                                    viewBox='0 0 16 16'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                 >
                                    <path
                                       d='M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196666 15.0217 0.000666667 14.5507 0 14V11H2V14H14V11H16V14C16 14.55 15.8043 15.021 15.413 15.413C15.0217 15.805 14.5507 16.0007 14 16H2Z'
                                       fill='white'
                                    />
                                 </svg>

                                 <p className=' text-[16px] font-medium leading-[27px] text-white sm:hidden'>
                                    Download
                                 </p>
                              </button>
                           </Link>
                        )}
                     </div>
                     {noticeDetails?.previewImage && (
                        <div className='mb-[20px] mt-[23px] h-[841px] w-full sm:h-[354px]'>
                           <Image
                              className='!h-full object-cover'
                              src={BASE_IMAGE_URL + noticeDetails?.previewImage}
                              // preview={false}
                              alt='/'
                           />
                        </div>
                     )}
                     <div className=' text-[18px] font-normal leading-[34px] text-grey50'>
                        {parse(
                           translate(
                              lang,
                              noticeDetails?.content_En ?? '',
                              noticeDetails?.content_Np ?? ''
                           )
                        )}
                     </div>
                  </article>
               </article>
               <article>
                  <p className=' mb-[12px] text-[20px] font-semibold leading-[33px] text-grey30 md:mt-[30px] sm:mt-[30px]'>
                     {translate(
                        lang,
                        'Other News and Notices',
                        'अन्य समाचार र सूचनाहरू'
                     )}
                  </p>
                  <article className=' h-fit max-h-[1000px] w-full overflow-y-auto border '>
                     {otherNotices?.result?.map((notice) => (
                        <div
                           key={notice.id}
                           className='grid grid-cols-[0.5fr_3fr] place-content-center gap-x-[15px] pb-[13px] pr-[27px] pt-[19px] even:bg-[#F2F2F2] sm:py-[10px] sm:pr-[13px]'
                        >
                           <div className=' flex size-full  flex-col items-center justify-center gap-y-[9px] border-r px-[15px]  text-[#808080]  sm:px-[10px]'>
                              <div className='w-[70px] shrink items-center  justify-center  text-[16px]  font-normal leading-[22px]'>
                                 <p className='text-center'>
                                    {lang === 'en'
                                       ? converAdToBs(notice.date, 'DD MMM')
                                       : converAdToBs(notice?.date, 'DD MMMM')}
                                 </p>
                                 <p className='mt-[9px] text-center'>
                                    {converAdToBs(notice?.date, 'YYYY')}
                                 </p>
                              </div>
                           </div>
                           <div className='flex w-full flex-auto items-center justify-between  sm:flex-1'>
                              <Space
                                 direction='vertical'
                                 size={7}
                                 className='w-full'
                              >
                                 <p className=' text-[18px] font-medium leading-[25px] text-grey30 sm:text-[16px] sm:leading-[22px]'>
                                    {lang === 'en'
                                       ? notice.title_En.slice(0, 100)
                                       : (notice.title_Np ?? '-').slice(0, 100)}
                                 </p>
                                 <div className='flex w-full items-center gap-x-[25px]'>
                                    <Link
                                       href={`/${lang}/notices/${category}/${notice.slug}`}
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
               </article>
            </section>
         </section>
      </section>
   );
}
