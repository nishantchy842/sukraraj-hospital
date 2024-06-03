import { type Locale } from '@/i18n';
import { type Service } from '@/models/services';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { translate } from '@/utils/commonRule';
import { Tag } from 'antd';
import _ from 'lodash';
import Link from 'next/link';
import React from 'react';
import fallback from '@/public/staticProfile.svg';
import Image from 'next/image';

export default function ServiceCard({
   data,
   lang,
}: {
   data: Omit<Service, 'createdAt' | 'updatedAt'>;
   lang: Locale;
}) {
   const { tags_En = [], tags_Np = [] } = data;

   return (
      <Link href={`/${lang}/services/${data.slug}`}>
         <div className='relative h-[219px] w-full overflow-hidden md:h-[165px]'>
            <Image
               src={data.image ? BASE_IMAGE_URL + data.image : fallback}
               className='!h-full object-cover  transition-transform duration-300 hover:scale-[1.1]'
               fill
               alt='/'
               sizes='100%'
            />
         </div>
         <p className='my-[12px] border-b pb-[11px] text-[20px] font-semibold leading-[28px] text-grey30'>
            {translate(lang, data.title_En, data.title_Np ?? data.title_En)}
         </p>
         <div className='flex flex-wrap gap-[6px]'>
            {lang === 'en'
               ? tags_En?.map((tag) => (
                    <Tag
                       bordered={false}
                       key={tag}
                       className=' !bg-[#F5F6F8] !px-[8px] !py-[4px] !text-[16px] !font-normal !leading-[22px] !text-grey50'
                    >
                       {_.upperFirst(tag)}
                    </Tag>
                 ))
               : tags_Np?.map((tag) => (
                    <Tag
                       bordered={false}
                       key={tag}
                       className=' !bg-[#F5F6F8] !px-[8px] !py-[4px] !text-[16px] !font-normal !leading-[22px] !text-grey50'
                    >
                       {tag}
                    </Tag>
                 ))}
         </div>
      </Link>
   );
}
