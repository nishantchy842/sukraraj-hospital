'use client';
import { ABOUTUS_STAFF_DETAILS } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import profileImage from '@/public/staticProfile.svg';
import Image from 'next/image';
import classNames from 'classnames';
import { Button, Carousel, Empty, Space } from 'antd';
import MessageFromBoardSlider from '@/app/components/messageSlider';
import { type Locale } from '@/i18n';
import { type CarouselRef } from 'antd/es/carousel';
import { MEMBER } from '@/enums/privilege';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { getAllMember } from '@/api/member';
import { customCombineArray, translate } from '@/utils/commonRule';
import { isEmpty } from 'lodash';

export default function DevelopmentCommittee({
   params: { lang },
}: {
   params: { lang: Locale };
}) {
   const { data } = useQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).detail(
         MEMBER.DEVELOPMENT_COMMITTEE
      ),
      queryFn: () =>
         getAllMember({
            type: MEMBER.DEVELOPMENT_COMMITTEE,
            pagination: false,
         }),
   });

   const { data: messageFromBoardMemeber } = useQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).detail(MEMBER.BOARD_MEMBER),
      queryFn: () =>
         getAllMember({ type: MEMBER.BOARD_MEMBER, pagination: false }),
   });

   const boardMemberPriority = messageFromBoardMemeber?.result.sort(
      (a, b) => a.priority - b.priority
   );

   const messageref = useRef<CarouselRef>(null);

   const [currentIndex, setCurrentIndex] = useState<number>(0);

   const priorityFilter = data?.result.sort((a, b) => a.priority - b.priority);

   const remainingItem = priorityFilter?.slice(1, priorityFilter?.length) ?? [];

   const combineData = customCombineArray(remainingItem, 5);

   return (
      <div className=' grid grid-cols-1'>
         {isEmpty(data?.result) ? (
            <Empty />
         ) : (
            <section className=' rounded-[5px] bg-[#F5F6F8] py-[21px]'>
               <p className=' text-center text-[24px] font-semibold leading-[40px] text-grey30 sm:text-[20px] sm:leading-[33px] '>
                  {translate(
                     lang,
                     'Development committee',
                     'अस्पताल विकास समिति'
                  )}
               </p>
               <article
                  className={classNames(
                     'mt-[30px] grid place-items-center gap-y-[50px] sm:mt-[15px] sm:gap-y-[20px]'
                  )}
               >
                  <div className='flex flex-col items-center justify-center'>
                     <div className='relative size-[140px] md:size-[120px] sm:size-[80px]'>
                        <Image
                           className='!size-full rounded-[2px] object-cover'
                           src={
                              profileImage
                                 ? BASE_IMAGE_URL + data?.result[0]?.image
                                 : profileImage
                           }
                           alt='/'
                           fill
                           sizes='100%'
                           quality={100}
                        />
                     </div>
                     <p className='mt-[26px] text-center text-[20px] font-semibold leading-[24px] text-grey30 sm:mt-[8px] sm:text-[16px] sm:leading-[20px]'>
                        {translate(
                           lang,
                           data?.result[0]?.name_En ?? '',
                           data?.result[0]?.name_Np ?? ''
                        )}
                     </p>
                     <p className='text-center text-[18px] font-medium leading-[30px] text-secondary sm:text-[16px] sm:leading-[20px]'>
                        {translate(
                           lang,
                           data?.result[0]?.position_En ?? '',
                           data?.result[0]?.position_Np ?? ''
                        )}
                     </p>
                  </div>
                  <div className='flex w-full flex-col gap-y-[40px] sm:gap-y-[20px]'>
                     {combineData?.map((com, id) => (
                        <div
                           key={id}
                           className={classNames(
                              'grid w-full gap-y-[40px] sm:gap-y-[20px]'
                           )}
                        >
                           <div className=' grid w-full grid-cols-3 justify-between'>
                              {com.slice(0, 3).map((item) => (
                                 <div
                                    key={item.id}
                                    className='flex flex-col items-center justify-start'
                                 >
                                    <div className='size-[140px]  md:size-[120px] sm:size-[80px]'>
                                       <Image
                                          className='!size-full rounded-[2px] object-cover'
                                          src={
                                             item.image
                                                ? BASE_IMAGE_URL + item.image
                                                : profileImage
                                          }
                                          alt='/'
                                          width={158}
                                          height={158}
                                          layout='responsive'
                                       />
                                    </div>
                                    <p className='mt-[26px] text-center text-[20px] font-semibold leading-[24px] text-grey30 sm:mt-[8px] sm:text-[16px] sm:leading-[20px]'>
                                       {translate(
                                          lang,
                                          item.name_En ?? '',
                                          item.name_Np ?? ''
                                       )}
                                    </p>
                                    <p className='text-center text-[18px] font-medium leading-[30px] text-secondary sm:text-[16px] sm:leading-[20px]'>
                                       {translate(
                                          lang,
                                          item.position_En ?? '',
                                          item.position_Np ?? ''
                                       )}
                                    </p>
                                 </div>
                              ))}
                           </div>
                           <div className=' grid w-full grid-cols-2 justify-between'>
                              {com.slice(3, 5).map((item) => (
                                 <div
                                    key={item.id}
                                    className='flex flex-col items-center justify-center'
                                 >
                                    <div className='size-[140px]  md:size-[120px] sm:size-[80px]'>
                                       <Image
                                          className='!size-full rounded-[2px] object-cover'
                                          src={
                                             item.image
                                                ? BASE_IMAGE_URL + item.image
                                                : profileImage
                                          }
                                          alt='/'
                                          width={158}
                                          height={158}
                                          layout='responsive'
                                       />
                                    </div>
                                    <p className='mt-[26px] text-center text-[20px] font-semibold leading-[24px] text-grey30 sm:mt-[8px] sm:text-[16px] sm:leading-[20px]'>
                                       {translate(
                                          lang,
                                          item.name_En ?? '',
                                          item.name_Np ?? ''
                                       )}
                                    </p>
                                    <p className='text-center text-[18px] font-medium leading-[30px] text-secondary sm:text-[16px] sm:leading-[20px]'>
                                       {translate(
                                          lang,
                                          item.position_En ?? '',
                                          item.position_Np ?? ''
                                       )}
                                    </p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </article>
            </section>
         )}
         {!isEmpty(messageFromBoardMemeber?.result) && (
            <section className='mt-[50px] sm:px-[20px]'>
               <div className='flex items-center justify-between sm:flex sm:items-center sm:justify-between sm:gap-y-[20px]'>
                  <p className='relative text-[24px] font-medium leading-[50px] text-grey30 before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px] before:bg-secondary sm:text-[20px] sm:leading-[33px]'>
                     Message from the board
                  </p>
                  <div className=''>
                     <Space>
                        <div className=' size-[40px] sm:size-[30px]'>
                           <Button
                              className='!flex !size-full !items-center !justify-center !rounded-[5px] !border !p-0'
                              onClick={() => {
                                 messageref?.current?.prev();
                                 setCurrentIndex(currentIndex - 1);
                              }}
                              disabled={currentIndex === 0}
                           >
                              <svg
                                 width='8'
                                 height='14'
                                 viewBox='0 0 8 14'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                              >
                                 <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M0.391644 7.9423C0.141954 7.6923 0.00170535 7.35341 0.00170537 7.00007C0.00170538 6.64674 0.141954 6.30785 0.391644 6.05785L5.4192 1.02852C5.66933 0.778508 6.00853 0.6381 6.36218 0.638184C6.71583 0.638267 7.05497 0.778834 7.30498 1.02896C7.55499 1.27909 7.6954 1.61829 7.69531 1.97194C7.69523 2.3256 7.55466 2.66473 7.30453 2.91474L3.2192 7.00007L7.30453 11.0854C7.54753 11.3368 7.68208 11.6735 7.67921 12.0231C7.67634 12.3727 7.53627 12.7072 7.28918 12.9545C7.04208 13.2018 6.70773 13.3422 6.35813 13.3454C6.00854 13.3486 5.67167 13.2144 5.42009 12.9716L0.390753 7.94319L0.391644 7.9423Z'
                                    fill='#303030'
                                 />
                              </svg>
                           </Button>
                        </div>
                        <div className=' size-[40px] sm:size-[30px]'>
                           <Button
                              // type='button'
                              className='!flex !size-full !items-center !justify-center !rounded-[5px] !border !p-0'
                              onClick={() => {
                                 messageref?.current?.next();
                                 setCurrentIndex(currentIndex + 1);
                              }}
                              disabled={
                                 currentIndex ===
                                 Number(boardMemberPriority?.length) - 1
                              }
                           >
                              <svg
                                 width='8'
                                 height='14'
                                 viewBox='0 0 8 14'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                              >
                                 <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M7.60836 6.0577C7.85805 6.3077 7.99829 6.64659 7.99829 6.99992C7.99829 7.35326 7.85805 7.69215 7.60836 7.94215L2.5808 12.9715C2.33067 13.2215 1.99147 13.3619 1.63782 13.3618C1.28417 13.3617 0.945034 13.2212 0.695023 12.971C0.445012 12.7209 0.304604 12.3817 0.304687 12.0281C0.304771 11.6744 0.445339 11.3353 0.695467 11.0853L4.7808 6.99992L0.695467 2.91459C0.452468 2.66324 0.317915 2.3265 0.320787 1.9769C0.323659 1.6273 0.463726 1.29281 0.710821 1.04549C0.957917 0.798157 1.29227 0.657774 1.64186 0.654572C1.99146 0.651371 2.32833 0.785607 2.57991 1.02837L7.60925 6.05681L7.60836 6.0577Z'
                                    fill='#303030'
                                 />
                              </svg>
                           </Button>
                        </div>
                     </Space>
                  </div>
               </div>
               <div className='mt-[19px]'>
                  <Carousel
                     ref={messageref}
                     dots={false}
                     infinite={false}
                     afterChange={(current) => {
                        if (
                           current !==
                           Number(boardMemberPriority?.length) - 1
                        ) {
                           setCurrentIndex(current);
                        }
                     }}
                     beforeChange={(current, next) => {
                        if (next !== 0) setCurrentIndex(next);
                     }}
                  >
                     {boardMemberPriority?.map((mess) => (
                        <div key={mess.id}>
                           <MessageFromBoardSlider
                              key={mess.id}
                              lang={lang}
                              data={mess}
                           />
                        </div>
                     ))}
                  </Carousel>
               </div>
               {/* <div className='hidden items-center justify-center md:hidden sm:mt-[15px] sm:flex'>
                  <Space size={20}>
                     <Button
                        className='flex !size-[40px] items-center justify-center rounded-[5px] border'
                        onClick={() => {
                           messageref?.current?.prev();
                           setCurrentIndex(currentIndex - 1);
                        }}
                        disabled={currentIndex === 0}
                     >
                        <svg
                           width='8'
                           height='14'
                           viewBox='0 0 8 14'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M0.391644 7.9423C0.141954 7.6923 0.00170535 7.35341 0.00170537 7.00007C0.00170538 6.64674 0.141954 6.30785 0.391644 6.05785L5.4192 1.02852C5.66933 0.778508 6.00853 0.6381 6.36218 0.638184C6.71583 0.638267 7.05497 0.778834 7.30498 1.02896C7.55499 1.27909 7.6954 1.61829 7.69531 1.97194C7.69523 2.3256 7.55466 2.66473 7.30453 2.91474L3.2192 7.00007L7.30453 11.0854C7.54753 11.3368 7.68208 11.6735 7.67921 12.0231C7.67634 12.3727 7.53627 12.7072 7.28918 12.9545C7.04208 13.2018 6.70773 13.3422 6.35813 13.3454C6.00854 13.3486 5.67167 13.2144 5.42009 12.9716L0.390753 7.94319L0.391644 7.9423Z'
                              fill='#303030'
                           />
                        </svg>
                     </Button>
                     <Button
                        // type='button'
                        className='flex !size-[40px] items-center justify-center rounded-[5px] border'
                        onClick={() => {
                           messageref?.current?.next();
                           setCurrentIndex(currentIndex + 1);
                        }}
                        disabled={
                           currentIndex ===
                           Number(boardMemberPriority?.length) - 1
                        }
                     >
                        <svg
                           width='8'
                           height='14'
                           viewBox='0 0 8 14'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M7.60836 6.0577C7.85805 6.3077 7.99829 6.64659 7.99829 6.99992C7.99829 7.35326 7.85805 7.69215 7.60836 7.94215L2.5808 12.9715C2.33067 13.2215 1.99147 13.3619 1.63782 13.3618C1.28417 13.3617 0.945034 13.2212 0.695023 12.971C0.445012 12.7209 0.304604 12.3817 0.304687 12.0281C0.304771 11.6744 0.445339 11.3353 0.695467 11.0853L4.7808 6.99992L0.695467 2.91459C0.452468 2.66324 0.317915 2.3265 0.320787 1.9769C0.323659 1.6273 0.463726 1.29281 0.710821 1.04549C0.957917 0.798157 1.29227 0.657774 1.64186 0.654572C1.99146 0.651371 2.32833 0.785607 2.57991 1.02837L7.60925 6.05681L7.60836 6.0577Z'
                              fill='#303030'
                           />
                        </svg>
                     </Button>
                  </Space>
               </div> */}
            </section>
         )}
      </div>
   );
}
