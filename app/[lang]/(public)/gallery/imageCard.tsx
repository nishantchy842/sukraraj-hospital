'use client';
import { type Locale } from '@/i18n';
import { type Gallery } from '@/models/gallery';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import fallback from '@/public/staticProfile.svg';

export default function ImageCard({
   data,
   lang,
   className,
}: {
   data: Gallery;
   lang: Locale;
   className?: string;
}) {
   return (
      <section className={classNames('image_card_wrapper ', className)}>
         <div className={classNames('image', ' relative size-full ')}>
            <Image
               className='relative !h-full  object-cover'
               src={
                  data?.coverImage
                     ? BASE_IMAGE_URL + data?.coverImage
                     : fallback
               }
               alt='cover-image'
               fill
               quality={100}
            />

            <div
               className={classNames(
                  'linear_gradient absolute top-0 size-full text-white '
               )}
            >
               <div className=' absolute bottom-[16px] left-[16px]  sm:bottom-[5px] sm:left-[6px]'>
                  <p className='text-[20px] font-semibold leading-[32px] text-white sm:text-[16px]'>
                     {lang === 'en'
                        ? data?.title_En
                        : data?.title_Np ?? data?.title_En}
                  </p>
               </div>
            </div>

            <div className='absolute top-0 flex gap-x-[5px] pl-[10px] pt-[10px] sm:pl-[6px] sm:pt-[6px]'>
               <div className='flex items-center gap-x-[3px] rounded-[2px] bg-[#0C62BB] px-[5px] sm:px-[3px] sm:py-0'>
                  <svg
                     className=' sm:size-2.5'
                     width='12'
                     height='12'
                     viewBox='0 0 12 12'
                     fill='none'
                     xmlns='http://www.w3.org/2000/svg'
                  >
                     <path
                        d='M1.91667 11.25C1.59583 11.25 1.32128 11.1359 1.093 10.9076C0.864722 10.6793 0.750389 10.4046 0.75 10.0833V1.91667C0.75 1.59583 0.864333 1.32128 1.093 1.093C1.32167 0.864722 1.59622 0.750389 1.91667 0.75H10.0833C10.4042 0.75 10.6789 0.864333 10.9076 1.093C11.1362 1.32167 11.2504 1.59622 11.25 1.91667V10.0833C11.25 10.4042 11.1359 10.6789 10.9076 10.9076C10.6793 11.1362 10.4046 11.2504 10.0833 11.25H1.91667ZM1.91667 10.0833H10.0833V1.91667H1.91667V10.0833ZM2.5 8.91667H9.5L7.3125 6L5.5625 8.33333L4.25 6.58333L2.5 8.91667Z'
                        fill='white'
                     />
                  </svg>

                  <p className='text-[14px] font-medium leading-[23px] text-white sm:text-[12px] sm:leading-[19px]'>
                     {data?.imagesCount} images
                  </p>
               </div>
               <div className=' flex items-center gap-x-[3px] rounded-[2px] bg-[#0C62BB] px-[5px]  sm:gap-x-[3px] sm:px-[3px] sm:py-0'>
                  <svg
                     className=' sm:size-2.5'
                     width='12'
                     height='12'
                     viewBox='0 0 12 12'
                     fill='none'
                     xmlns='http://www.w3.org/2000/svg'
                  >
                     <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M10.667 0.75C10.9613 0.749907 11.2448 0.86107 11.4606 1.06121C11.6765 1.26134 11.8087 1.53566 11.8307 1.82917L11.8337 1.91667V10.0833C11.8338 10.3777 11.7226 10.6612 11.5225 10.877C11.3223 11.0928 11.048 11.225 10.7545 11.2471L10.667 11.25H1.33366C1.03932 11.2501 0.755828 11.1389 0.540006 10.9388C0.324183 10.7387 0.191984 10.4643 0.169909 10.1708L0.166992 10.0833V1.91667C0.166899 1.62233 0.278063 1.33884 0.478199 1.12301C0.678335 0.907191 0.952652 0.774992 1.24616 0.752917L1.33366 0.75H10.667ZM10.667 1.91667H1.33366V10.0833H10.667V1.91667ZM5.03199 3.4555L5.33416 3.58967L5.53133 3.683L5.75708 3.79383L6.00791 3.921L6.28208 4.06683L6.57783 4.23017L6.73299 4.31883L7.03516 4.49675L7.31166 4.66708L7.56249 4.82633L7.78416 4.97392L8.06416 5.16642L8.27649 5.31983L8.33191 5.36067C8.42193 5.42765 8.49505 5.51476 8.54542 5.61503C8.5958 5.7153 8.62203 5.82595 8.62203 5.93817C8.62203 6.05038 8.5958 6.16104 8.54542 6.26131C8.49505 6.36158 8.42193 6.44868 8.33191 6.51567L8.14349 6.65275L7.88683 6.83242L7.67916 6.97183L7.44291 7.12525L7.17866 7.29033L6.88758 7.46533L6.57608 7.64558L6.27916 7.81008L6.00441 7.95592L5.75358 8.08425L5.52841 8.19392L5.16558 8.36192L5.03141 8.42025C4.92841 8.46464 4.81646 8.48434 4.70449 8.47779C4.59252 8.47123 4.48363 8.43861 4.38651 8.38251C4.28939 8.32641 4.20672 8.24839 4.14509 8.15468C4.08347 8.06097 4.0446 7.95415 4.03158 7.84275L3.99774 7.51317L3.97908 7.295L3.95458 6.90767L3.94116 6.61133L3.93241 6.28758C3.93137 6.23042 3.93059 6.17325 3.93008 6.11608L3.92891 5.93817C3.92891 5.81742 3.93008 5.70075 3.93241 5.58817L3.94116 5.26442L3.95458 4.96867L3.97033 4.70208L3.98783 4.46817L4.03158 4.03417C4.04452 3.92264 4.08335 3.81569 4.14497 3.72184C4.20659 3.62799 4.28929 3.54984 4.38648 3.49362C4.48366 3.43741 4.59264 3.40469 4.70472 3.39807C4.81679 3.39145 4.92887 3.41112 5.03199 3.4555ZM5.38841 4.91442L5.13408 4.78725L5.11716 5.07133L5.10433 5.39275L5.09674 5.74858L5.09558 5.93817L5.09674 6.12775L5.10433 6.483L5.11016 6.64808L5.12533 6.95142L5.13408 7.0885L5.38724 6.96133L5.67133 6.812L5.98341 6.6405L6.14908 6.546L6.47049 6.35583L6.75866 6.17733L7.01299 6.014L7.12733 5.93817L6.88991 5.78067L6.61808 5.60917C6.4634 5.51341 6.30724 5.42007 6.14966 5.32917L5.98458 5.23525L5.67308 5.06375L5.38841 4.91442Z'
                        fill='white'
                     />
                  </svg>

                  <p className=' text-[14px] font-medium leading-[23px] text-white sm:text-[12px] sm:leading-[19px]'>
                     {data?.videosCount} videos
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}
