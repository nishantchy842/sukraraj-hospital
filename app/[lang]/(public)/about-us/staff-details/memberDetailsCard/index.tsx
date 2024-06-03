import { type Locale } from '@/i18n';
import { Image as AntImage, Tooltip } from 'antd';
import React from 'react';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { type Member } from '@/models/about';
import Image from 'next/image';
import prfileImage from '@/public/staticProfile.svg';
import _ from 'lodash';
import Link from 'next/link';

export default function MemberDetailsCard({
   data,
   lang,
}: {
   data: Member;
   lang: Locale;
}) {
   const {
      name_En,
      name_Np,
      position_En,
      position_Np,
      emails = [],
      phoneNumbers = [],
      image,
   } = data;
   return (
      <div className='grid grid-cols-[158px_1fr] gap-x-[13px] overflow-hidden rounded-[10px] bg-[#F5F6F8] p-[20px] md:grid-cols-[120px_1fr] md:p-[15px] sm:grid-cols-[100px_1fr] sm:p-[10px]'>
         <div className='relative size-[158px] bg-white  md:size-[120px] sm:size-[100px]'>
            {image ? (
               <AntImage
                  className='!h-full !w-full overflow-hidden rounded-[2px] object-cover'
                  src={BASE_IMAGE_URL + image}
                  fallback={prfileImage}
                  alt='Profile Image'
               />
            ) : (
               <Image
                  src={prfileImage}
                  fill={true}
                  alt='profileImage'
                  sizes='100%'
               />
            )}
         </div>
         <div>
            <p className=' text-[20px] font-semibold leading-[24px] text-grey30 md:text-[18px] md:leading-[24px] sm:text-[16px] sm:leading-[24px]'>
               {lang === 'en'
                  ? _.upperFirst(name_En)
                  : name_Np ?? _.upperFirst(name_En)}
            </p>
            <p className=' mb-[8px] mt-[4px] text-[18px] font-medium leading-[30px] text-[#808080] md:text-[16px] md:leading-[26px] sm:text-[14px] sm:leading-[23px]'>
               {lang === 'en' ? position_En : position_Np}
            </p>
            <div className='mb-[4px] flex items-center gap-x-[5px]'>
               <svg
                  width='20'
                  height='18'
                  viewBox='0 0 18 18'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <path
                     fillRule='evenodd'
                     clipRule='evenodd'
                     d='M3.07673 0.110759C2.45255 0.252517 2.0352 0.497517 1.47536 1.05084C0.674463 1.84236 0.273057 2.63076 0.110166 3.73217C-0.0370216 4.72756 0.163135 6.08888 0.621181 7.20752C1.43395 9.19256 2.8404 11.2 4.77997 13.1435C6.81403 15.1817 8.91181 16.6442 10.9398 17.438C12.281 17.9629 13.8102 18.0872 14.9375 17.7627C16.0984 17.4285 17.1124 16.5792 17.6342 15.504C18.1011 14.542 18.0287 13.5504 17.4443 12.9004C17.2728 12.7097 14.607 10.7886 14.0357 10.444C13.628 10.1981 13.2926 10.0938 12.9095 10.0938C12.2945 10.0938 11.8648 10.3181 11.0942 11.0413L10.6464 11.4615L10.2978 11.2283C9.41013 10.6345 7.6345 8.88002 6.84485 7.81642C6.47294 7.31549 6.46751 7.38654 6.91411 6.90916C7.63622 6.13728 7.85763 5.75384 7.89474 5.21099C7.91974 4.84541 7.84106 4.52217 7.62849 4.11724C7.4581 3.79263 5.45478 0.947399 5.22079 0.697634C5.01478 0.47779 4.74981 0.30361 4.43981 0.184235C4.11352 0.0586104 3.46122 0.0234151 3.07673 0.110759ZM3.16661 1.38576C2.86532 1.48939 2.66544 1.61927 2.36466 1.90689C1.9079 2.34361 1.58634 2.88756 1.41587 3.51177C1.29161 3.96681 1.2913 4.89592 1.41521 5.51677C1.72403 7.06439 2.7295 8.89002 4.33876 10.8251C5.91376 12.719 8.03036 14.526 9.87888 15.5548C10.4242 15.8583 11.3927 16.3086 11.7734 16.4355C12.9295 16.821 14.3355 16.7626 15.2269 16.292C15.8363 15.9704 16.4477 15.2701 16.6229 14.6929C16.7199 14.3739 16.7067 14.0354 16.5896 13.8343C16.5386 13.7467 16.0481 13.3748 15.0136 12.6394C13.5673 11.6111 13.0824 11.3047 12.9017 11.3047C12.7127 11.3047 12.4402 11.498 11.9234 11.9986C11.2968 12.6054 11.1192 12.71 10.7139 12.7106C10.4015 12.7111 10.2194 12.6508 9.82622 12.4165C8.7452 11.7726 6.49017 9.54291 5.65985 8.29693C5.3531 7.83658 5.23384 7.50634 5.26161 7.19396C5.29165 6.85611 5.39907 6.68435 5.92915 6.12677C6.67669 5.34041 6.75583 5.17006 6.56337 4.76177C6.47114 4.56607 4.51122 1.77478 4.31771 1.56349C4.07849 1.30232 3.61657 1.23099 3.16661 1.38576Z'
                     fill='#505050'
                  />
               </svg>

               <div>
                  <Tooltip
                     key={'phone number'}
                     placement='topLeft'
                     title={(phoneNumbers ?? []).map((item) => (
                        <Link key={item} href={`tel:${item}`}>
                           <p>{item}</p>
                        </Link>
                     ))}
                  >
                     <p className='text-[18px] font-medium leading-[30px] text-grey50 md:text-[16px]  md:leading-[26px] sm:text-[14px] sm:leading-[23px]'>
                        {(phoneNumbers ?? [])[0]}
                     </p>
                  </Tooltip>
               </div>
            </div>
            <div className='flex items-center gap-x-[5px]'>
               <svg
                  width='20'
                  height='16'
                  viewBox='0 0 20 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
               >
                  <path
                     d='M2.16884 0.5H17.8286C18.5665 0.5 19.1654 1.172 19.1654 2V14C19.1654 14.3978 19.0245 14.7794 18.7738 15.0607C18.5231 15.342 18.1831 15.5 17.8286 15.5H2.16884C1.81429 15.5 1.47427 15.342 1.22357 15.0607C0.972873 14.7794 0.832031 14.3978 0.832031 14V2C0.832031 1.172 1.43092 0.5 2.16884 0.5ZM1.97786 4.28171V14C1.97786 14.1183 2.06342 14.2143 2.16884 14.2143H17.8286C17.8792 14.2143 17.9278 14.1917 17.9636 14.1515C17.9994 14.1113 18.0195 14.0568 18.0195 14V4.28171L10.7473 9.79571C10.2951 10.1386 9.70231 10.1386 9.25009 9.79571L1.97786 4.28171ZM1.97786 2V2.73029L9.89175 8.73029C9.92333 8.75424 9.96058 8.76704 9.9987 8.76704C10.0368 8.76704 10.0741 8.75424 10.1056 8.73029L18.0195 2.73029V2C18.0195 1.94317 17.9994 1.88866 17.9636 1.84848C17.9278 1.80829 17.8792 1.78571 17.8286 1.78571H2.16884C2.11819 1.78571 2.06961 1.80829 2.0338 1.84848C1.99798 1.88866 1.97786 1.94317 1.97786 2Z'
                     fill='#505050'
                  />
               </svg>

               <div>
                  <Tooltip
                     key={'phone number'}
                     placement='topLeft'
                     title={(emails ?? []).map((item) => (
                        <Link key={item} href={`mailto:${item}`}>
                           <p>{item}</p>
                        </Link>
                     ))}
                  >
                     <p className=' text-[18px] font-medium  leading-[30px] text-grey50 md:text-[16px]  md:leading-[26px] sm:text-[14px] sm:leading-[23px]'>
                        {(emails ?? [])[0]}
                     </p>
                  </Tooltip>
               </div>
            </div>
         </div>
      </div>
   );
}
