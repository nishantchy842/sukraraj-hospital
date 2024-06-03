import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button, Image as AntdImage } from 'antd';
import { capitalize } from 'lodash';
import parse from 'html-react-parser';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { type AboutUs } from '@/models/admin/about-us';
import { type Locale } from '@/i18n';

type Props = {
   lang: Locale;
   data: AboutUs;
};

export const Introduction: React.FC<Props> = ({ data, lang }) => {
   const [preview, setPreview] = useState({
      isVisible: false,
      url: '',
   });

   return (
      <div className='flex flex-col gap-[20px]'>
         <Link
            href={`/${lang}/admin/about-us/update/introduction`}
            className='self-end'
         >
            <Button className='admin-primary-btn w-fit' type='primary'>
               Edit About Us
            </Button>
         </Link>

         <div className='flex flex-col gap-[30px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
            <div className='flex flex-col gap-[10px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Our History
               </span>

               <div className='prose min-w-full text-[18px] font-[400] leading-[35px] text-[#505050]'>
                  {parse(
                     data?.[`history_${capitalize(lang) as 'En' | 'Np'}`] ?? ''
                  )}
               </div>

               <div className='mt-[10px] flex flex-wrap gap-[20px]'>
                  {data?.images?.map((image) => (
                     <div key={image} className='relative size-[250px]'>
                        <Image
                           alt='image'
                           className='rounded-[5px]'
                           src={BASE_IMAGE_PATH + image}
                           fill
                        />
                     </div>
                  ))}
               </div>
            </div>

            <div className='flex flex-col gap-[10px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Our Mission
               </span>

               <div className='prose min-w-full text-[18px] font-[400] leading-[35px] text-[#505050]'>
                  {parse(
                     data?.[`mission_${capitalize(lang) as 'En' | 'Np'}`] ?? ''
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-[10px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Our Vision
               </span>

               <div className='prose min-w-full text-[18px] font-[400] leading-[35px] text-[#505050]'>
                  {parse(
                     data?.[`vision_${capitalize(lang) as 'En' | 'Np'}`] ?? ''
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-[10px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Our Values
               </span>

               <div className='prose min-w-full text-[18px] font-[400] leading-[35px] text-[#505050]'>
                  {parse(
                     data?.[`value_${capitalize(lang) as 'En' | 'Np'}`] ?? ''
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-[10px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Our Objectives
               </span>

               <div className='prose min-w-full text-[18px] font-[400] leading-[36px] text-[#505050]'>
                  {parse(
                     data?.[`objectives_${capitalize(lang) as 'En' | 'Np'}`] ??
                        ''
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-[20px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Citizen Charter
               </span>

               <div className='flex items-center gap-[20px]'>
                  <span className='text-[18px] font-[500] leading-[30px] text-[#505050]'>
                     {data?.citizenCharterFileName}
                  </span>

                  {data?.citizenCharterFileLink && (
                     <span
                        className='cursor-pointer text-[18px] font-[500] leading-[26px] text-[rgba(12,98,187,1)] transition-all hover:text-[rgba(12,98,187,0.7)]'
                        onClick={() => {
                           data?.citizenCharterFileLink &&
                              setPreview({
                                 isVisible: true,
                                 url:
                                    BASE_IMAGE_PATH +
                                    data?.citizenCharterFileLink,
                              });
                        }}
                     >
                        View file
                     </span>
                  )}
               </div>
            </div>

            <div className='flex flex-col gap-[20px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Organogram
               </span>

               {data?.organogramFileLink && (
                  <div className='relative h-[280px] w-[400px] rounded-[5px] border-[1px] border-[#E4E4E4]'>
                     <Image
                        alt='organogram'
                        src={BASE_IMAGE_PATH + data?.organogramFileLink}
                        fill
                     />
                  </div>
               )}
            </div>
         </div>

         <AntdImage
            style={{ display: 'none' }}
            preview={{
               visible: preview.isVisible,
               src: preview.url,
               onVisibleChange: (value) => {
                  setPreview((prev) => ({ ...prev, isVisible: value }));
               },
            }}
         />
      </div>
   );
};
