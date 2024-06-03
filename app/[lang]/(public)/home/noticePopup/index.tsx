import { getAllNotice } from '@/api/notice';
import { NOTICE } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { translate } from '@/utils/commonRule';
import { useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect } from 'react';
const { confirm } = Modal;

function NoticePopup({ lang }: { lang: Locale }) {
   const { data: noticeData } = useQuery({
      queryFn: () => getAllNotice({ pagination: false, isPopup: true }),
      queryKey: queryKeys(NOTICE).list({ isPopup: true }),
   });

   const showConfirm = useCallback(() => {
      noticeData?.result.map((item, i) => {
         setTimeout(() => {
            confirm({
               className: 'notice_popup',
               closable: true,
               maskClosable: true,
               closeIcon: (
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
                        d='M10.7754 21.2246L20.5713 11.4287M20.5713 21.2246L10.7754 11.4287'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                     />
                  </svg>
               ),
               centered: true,
               content: (
                  <section>
                     <Link
                        href={`notices/${item?.noticeCategory.slug}/${item.slug}`}
                     >
                        <div className='border-b px-[25px] pb-[16px] pt-[20px]'>
                           <p className='   text-[24px] font-normal leading-[40px] text-[#000000]'>
                              {translate(lang, item.title_En, item.title_Np)}
                           </p>
                        </div>
                        <div className='w-full px-[25px] pb-[25px] pt-[18px]'>
                           <Image
                              alt='/'
                              src={BASE_IMAGE_URL + item.previewImage}
                              width={781}
                              height={863}
                              layout='responsive'
                              quality={100}
                           />
                        </div>
                     </Link>
                  </section>
               ),

               footer: null,
            });
         }, i * 500);
      });
   }, []);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         showConfirm();
      }, 200);

      return () => {
         clearTimeout(timeoutId);
      };
   }, []);

   return null;
}
export default React.memo(NoticePopup);
