import { type Locale } from '@/i18n';
import React from 'react';
import { Space, Tooltip } from 'antd';
import Image from 'next/image';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { type Resource } from '@/models/downloadResource';
import fallback from '@/public/staticProfile.svg';
import { converAdToBs } from '@/utils/commonRule';
import Link from 'next/link';

export default function ResourceCard({
   data,
   lang,
}: {
   data: Partial<Resource>;
   lang: Locale;
}) {
   return (
      <div className='grid h-[145px] grid-cols-[2fr_0.5fr] items-start rounded-[5px] border bg-[#F5F6F8] p-[10px] md:grid-cols-[2fr_1fr]  md:gap-x-[10px] md:p-[10px] sm:gap-x-[10px] sm:p-[10px]'>
         <div>
            {lang === 'en' ? (
               (data?.title_En ?? '')?.length > 60 ? (
                  <Tooltip title={data.title_En}>
                     <p className='line-clamp-2 text-[18px] font-medium leading-[29.9px] text-grey30 md:text-[16px] md:leading-[26px] sm:text-[16px] sm:leading-[26px]'>
                        {data.title_En}
                     </p>
                  </Tooltip>
               ) : (
                  <p className=' text-[18px] font-medium leading-[29.9px] text-grey30 md:text-[16px] md:leading-[26px] sm:text-[16px] sm:leading-[26px]'>
                     {data.title_En}
                  </p>
               )
            ) : (data?.title_Np ?? '')?.length > 60 ? (
               <Tooltip title={data.title_En}>
                  <p className='line-clamp-2 text-[18px] font-medium leading-[29.9px] text-grey30 md:text-[16px] md:leading-[26px] sm:text-[16px] sm:leading-[26px]'>
                     {data.title_Np}
                  </p>
               </Tooltip>
            ) : (
               <p className=' text-[18px] font-medium leading-[29.9px] text-grey30 md:text-[16px] md:leading-[26px] sm:text-[16px] sm:leading-[26px]'>
                  {data.title_Np}
               </p>
            )}
            {data.createdAt && (
               <div className=' mt-[5px] flex items-center gap-x-[4.26px]'>
                  <svg
                     width='14'
                     height='15'
                     viewBox='0 0 14 15'
                     fill='none'
                     xmlns='http://www.w3.org/2000/svg'
                  >
                     <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M3.15744 0.549721C3.02195 0.613131 2.91023 0.741401 2.87266 0.87667C2.85713 0.932588 2.84436 1.10321 2.84427 1.25579L2.84411 1.53319L2.30407 1.54539C1.69961 1.55901 1.54203 1.59231 1.20349 1.77789C0.930814 1.92738 0.609361 2.26642 0.46917 2.55241C0.241642 3.01657 0.260127 2.53307 0.260127 8.01938C0.260127 12.5875 0.263189 12.9116 0.308115 13.078C0.478084 13.7075 0.946099 14.2092 1.54717 14.4061L1.79138 14.4862H7.01403H12.2367L12.4554 14.4092C13.0698 14.1929 13.5233 13.7049 13.6926 13.078C13.7375 12.9116 13.7406 12.5875 13.7406 8.01938C13.7406 2.53151 13.7592 3.01689 13.5307 2.55063C13.3701 2.22286 13.0444 1.89821 12.7152 1.73756C12.3946 1.5811 12.1596 1.53891 11.6089 1.53891H11.1566L11.1564 1.25864C11.1563 0.925725 11.127 0.803717 11.0171 0.67862C10.7805 0.40912 10.3288 0.463616 10.1755 0.78012C10.1266 0.881237 10.1175 0.949733 10.1175 1.21942V1.53891H7.00036H3.88317V1.21942C3.88317 0.953971 3.87377 0.880471 3.82753 0.784959C3.71126 0.544799 3.4008 0.435807 3.15744 0.549721ZM1.85621 2.61833C1.62062 2.70504 1.46024 2.86076 1.34871 3.11117C1.30619 3.20669 1.29881 3.32722 1.29069 4.06137L1.28133 4.90219H7.00036H12.7194L12.7104 4.06137L12.7015 3.22055L12.629 3.06592C12.5351 2.86555 12.367 2.70424 12.1789 2.63386C12.0516 2.5862 11.9657 2.57797 11.596 2.57797H11.1624L11.1517 2.89926C11.1394 3.2731 11.0977 3.38871 10.9322 3.50862C10.7331 3.65283 10.4798 3.63866 10.2909 3.47277C10.1442 3.34401 10.1175 3.25484 10.1175 2.8933V2.57797H7.00036H3.88317V2.8933C3.88317 3.25484 3.85651 3.34401 3.70987 3.47277C3.52092 3.63866 3.26758 3.65283 3.06852 3.50862C2.90063 3.38699 2.85937 3.27264 2.8487 2.89926L2.83954 2.57797L2.39748 2.57989C2.10099 2.5812 1.92276 2.59386 1.85621 2.61833ZM1.29774 5.9762C1.29033 5.9955 1.28762 7.54283 1.29172 9.41476L1.29919 12.8182L1.37064 12.9686C1.45625 13.1488 1.60374 13.3008 1.77497 13.3851L1.90075 13.4471H7.00036H12.1L12.2258 13.3851C12.397 13.3008 12.5445 13.1488 12.6301 12.9686L12.7015 12.8182V9.38657V5.95492L7.00638 5.94803C2.39253 5.94243 1.30865 5.94779 1.29774 5.9762Z'
                        fill='#808080'
                     />
                  </svg>

                  <p className='  text-[16px] font-normal leading-[22px] text-[#808080]'>
                     {converAdToBs(data.createdAt, 'DD MMMM, YYYY')}
                  </p>
               </div>
            )}
            <div className='mt-[16px] flex items-start gap-x-[40px] md:justify-start md:gap-x-0 sm:justify-between sm:gap-x-0'>
               {data.previewImage && (
                  <a
                     href={BASE_IMAGE_URL + data.previewImage}
                     rel='noreferrer'
                     target='_blank'
                  >
                     <Space>
                        <svg
                           width='24'
                           height='24'
                           viewBox='0 0 24 24'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              d='M23.2047 11.745C22.3226 9.46324 20.7912 7.48996 18.7998 6.06906C16.8084 4.64817 14.4443 3.84193 11.9997 3.75C9.55507 3.84193 7.19097 4.64817 5.19958 6.06906C3.20819 7.48996 1.6768 9.46324 0.794681 11.745C0.735106 11.9098 0.735106 12.0902 0.794681 12.255C1.6768 14.5368 3.20819 16.51 5.19958 17.9309C7.19097 19.3518 9.55507 20.1581 11.9997 20.25C14.4443 20.1581 16.8084 19.3518 18.7998 17.9309C20.7912 16.51 22.3226 14.5368 23.2047 12.255C23.2643 12.0902 23.2643 11.9098 23.2047 11.745ZM11.9997 18.75C8.02468 18.75 3.82468 15.8025 2.30218 12C3.82468 8.1975 8.02468 5.25 11.9997 5.25C15.9747 5.25 20.1747 8.1975 21.6972 12C20.1747 15.8025 15.9747 18.75 11.9997 18.75Z'
                              fill='#0C62BB'
                           />
                           <path
                              d='M12 7.5C11.11 7.5 10.24 7.76392 9.49994 8.25839C8.75991 8.75285 8.18314 9.45566 7.84254 10.2779C7.50195 11.1002 7.41283 12.005 7.58647 12.8779C7.7601 13.7508 8.18869 14.5526 8.81802 15.182C9.44736 15.8113 10.2492 16.2399 11.1221 16.4135C11.995 16.5872 12.8998 16.4981 13.7221 16.1575C14.5443 15.8169 15.2471 15.2401 15.7416 14.5001C16.2361 13.76 16.5 12.89 16.5 12C16.5 10.8065 16.0259 9.66193 15.182 8.81802C14.3381 7.97411 13.1935 7.5 12 7.5ZM12 15C11.4067 15 10.8266 14.8241 10.3333 14.4944C9.83994 14.1648 9.45543 13.6962 9.22836 13.148C9.0013 12.5999 8.94189 11.9967 9.05765 11.4147C9.1734 10.8328 9.45912 10.2982 9.87868 9.87868C10.2982 9.45912 10.8328 9.1734 11.4147 9.05764C11.9967 8.94189 12.5999 9.0013 13.1481 9.22836C13.6962 9.45542 14.1648 9.83994 14.4944 10.3333C14.8241 10.8266 15 11.4067 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7957 15 12 15Z'
                              fill='#0C62BB'
                           />
                        </svg>

                        <p className=' text-[18px] font-medium leading-[25px] text-primary md:text-[16px] md:leading-[22px] sm:text-[16px] sm:leading-[22px]'>
                           Preview
                        </p>
                     </Space>
                  </a>
               )}
               {data.downloadFile && (
                  <Link
                     href={BASE_IMAGE_URL + data.downloadFile}
                     download={data.title_En}
                     target='_blank'
                  >
                     <Space>
                        <svg
                           width='16'
                           height='16'
                           viewBox='0 0 16 16'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              d='M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196666 15.0217 0.000666667 14.5507 0 14V11H2V14H14V11H16V14C16 14.55 15.8043 15.021 15.413 15.413C15.0217 15.805 14.5507 16.0007 14 16H2Z'
                              fill='#0C62BB'
                           />
                        </svg>

                        <p className=' text-[18px] font-medium leading-[25px] text-primary md:text-[16px] md:leading-[22px] sm:text-[16px] sm:leading-[22px]'>
                           Download
                        </p>
                     </Space>
                  </Link>
               )}
            </div>
         </div>
         <div className='relative h-[125px] w-[113px] md:h-full'>
            <Image
               className='!size-full  rounded-[2px] object-cover'
               src={
                  data.previewImage
                     ? BASE_IMAGE_URL + data.previewImage
                     : fallback
               }
               alt={'/'}
               fill
               sizes='100%'
               quality={100}
            />
         </div>
      </div>
   );
}
