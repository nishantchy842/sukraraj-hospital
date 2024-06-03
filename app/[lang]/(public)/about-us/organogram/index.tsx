'use client';
import { getAboutUs } from '@/api/aboutUs';
import { ABOUTUS } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { useQuery } from '@tanstack/react-query';
import { Empty, Image } from 'antd';
import React from 'react';

export default function Organogram() {
   const { data } = useQuery({
      queryFn: () => getAboutUs(),
      queryKey: queryKeys(ABOUTUS).lists(),
      // enabled: Boolean(params.todoId),
   });
   return (
      <div className='  sm:px-[20px]'>
         {data?.organogramFileLink ? (
            <Image
               src={BASE_IMAGE_URL + data?.organogramFileLink}
               alt='/'
               className=' object-cover'
            />
         ) : (
            <Empty />
         )}
      </div>
   );
}
