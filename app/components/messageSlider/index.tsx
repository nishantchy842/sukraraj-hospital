'use client';
import type { Member } from '@/models/about';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { Modal, Space } from 'antd';
import classNames from 'classnames';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import parse from 'html-react-parser';
import React, { useState } from 'react';
import fallback from '@/public/staticProfile.svg';
import { type Locale } from '@/i18n';
import { capitalize } from 'lodash';

export default function MessageFromBoardSlider({
   data,
   lang,
}: {
   data: Member;
   lang: Locale;
}) {
   const pathname = usePathname();
   const lastPath = () => {
      const path = pathname.split('/');
      return path[path.length - 1];
   };

   const [isModalOpen, setIsModalOpen] = useState(false);

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleOk = () => {
      setIsModalOpen(false);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };
   return (
      <div className='flex gap-x-[14px] rounded-[5px]  bg-[#F5F6F8] p-[20px] md:grid md:grid-cols-1 md:gap-y-[14px] sm:grid sm:grid-cols-1 sm:gap-y-[14px]'>
         <section className='w-fit md:flex md:gap-x-[24px] sm:flex sm:gap-x-[10px]'>
            <div className='relative size-[120px] md:size-[120px] sm:size-[60px]'>
               <Image
                  className='!h-full !w-full rounded-[2px] object-cover'
                  src={data?.image ? BASE_IMAGE_URL + data?.image : fallback}
                  alt='image'
                  fill={true}
                  quality={100}
               />
            </div>
            <div className='mt-[8px] hidden md:block sm:mt-0 sm:block'>
               <p className='mb-[2px] text-[18px] font-semibold leading-[33px] text-grey30 '>
                  {data?.[
                     `name_${capitalize(lang) as 'En' | 'Np'}`
                  ]?.toUpperCase()}
               </p>
               <p className=' text-[16px] font-medium leading-[29px] text-secondary'>
                  {data?.[`position_${capitalize(lang) as 'En' | 'Np'}`]}
               </p>
            </div>
         </section>
         <div className='w-[100%]'>
            <div className='mb-[8px]  md:hidden sm:hidden'>
               <p className=' mb-[2px] text-[20px] font-semibold leading-[33px] text-grey30'>
                  {data?.[
                     `name_${capitalize(lang) as 'En' | 'Np'}`
                  ]?.toUpperCase()}
               </p>
               <p className=' text-[18px] font-medium leading-[29px] text-secondary'>
                  {data?.[`position_${capitalize(lang) as 'En' | 'Np'}`]}
               </p>
            </div>
            <div className='prose max-w-full text-[18px] font-[400] leading-[34px] text-grey50 sm:text-[16px] sm:leading-[28px]'>
               {lastPath() === 'en' || lastPath() === 'np'
                  ? (data?.[`message_${capitalize(lang) as 'En' | 'Np'}`]
                       ?.length ?? 0) > 150
                     ? parse(
                          data?.[
                             `message_${capitalize(lang) as 'En' | 'Np'}`
                          ]?.slice(0, 150) + '...'
                       )
                     : parse(
                          data?.[
                             `message_${capitalize(lang) as 'En' | 'Np'}`
                          ] ?? ''
                       )
                  : parse(
                       data?.[`message_${capitalize(lang) as 'En' | 'Np'}`] ??
                          ''
                    )}
            </div>
            <div className='mt-[3px] text-[16px] font-medium leading-[27px] text-primary'>
               {lastPath() === 'en' || lastPath() === 'np'
                  ? (data?.[`message_${capitalize(lang) as 'En' | 'Np'}`]
                       ?.length ?? 0) > 400 && (
                       <Space className='  cursor-pointer' onClick={showModal}>
                          <p>Read more</p>
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
                       </Space>
                    )
                  : ''}
            </div>
         </div>
         <Modal
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            footer={null}
            className={classNames('read_more_modal', '!w-[831px]')}
            closeIcon={
               <svg
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <circle
                     cx='16'
                     cy='16'
                     r='15'
                     fill='#B82432'
                     stroke='white'
                     strokeWidth='2'
                  />
                  <path
                     d='M10.7773 21.2244L20.5733 11.4285M20.5733 21.2244L10.7773 11.4285'
                     stroke='white'
                     strokeWidth='2'
                     strokeLinecap='round'
                  />
               </svg>
            }
         >
            <section className='flex w-full gap-x-[15px]'>
               <div className='relative size-[115px]'>
                  <Image
                     className='!h-full !w-full rounded-[2px] object-cover'
                     src={BASE_IMAGE_URL + data?.image}
                     alt='image'
                     fill
                     quality={100}
                  />
               </div>
               <div>
                  <p className='text-[20px] font-semibold leading-[33px] text-grey30'>
                     {data?.[
                        `name_${capitalize(lang) as 'En' | 'Np'}`
                     ]?.toUpperCase()}
                  </p>
                  <p className=' text-[18px] font-medium leading-[29px] text-secondary'>
                     {data?.[`position_${capitalize(lang) as 'En' | 'Np'}`]}
                  </p>
               </div>
            </section>
            <div className='mt-[23px] w-[100%]'>
               <div className='prose max-w-full text-[18px] font-[400] leading-[34px] text-grey50'>
                  {parse(
                     lastPath() === 'en'
                        ? data?.message_En ?? ''
                        : data.message_Np ?? ''
                  )}
               </div>
            </div>
         </Modal>
      </div>
   );
}
