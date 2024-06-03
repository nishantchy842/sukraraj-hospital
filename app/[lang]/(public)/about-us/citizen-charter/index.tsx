'use client';
import { getAboutUs } from '@/api/aboutUs';
import { ABOUTUS } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import ResourceCard from '../../downloads/resourceCard';
import { type Locale } from '@/i18n';

export default function CitizenCharter({
   params: { lang },
}: {
   params: { lang: Locale };
}) {
   const { data } = useQuery({
      queryFn: () => getAboutUs(),
      queryKey: queryKeys(ABOUTUS).lists(),
      // enabled: Boolean(params.todoId),
   });

   return (
      <div className='sm:px-[20px]'>
         {data?.citizenCharterFileName && (
            <section className='grid grid-cols-2 gap-[30px] sm:grid-cols-1'>
               <ResourceCard
                  data={{
                     title_En: data?.citizenCharterFileName ?? '',
                     title_Np: data?.citizenCharterFileName ?? '',
                     previewImage: data?.citizenCharterFileLink ?? '',
                     downloadFile: data?.citizenCharterFileLink ?? '',
                  }}
                  lang={lang}
               />
            </section>
         )}
      </div>
   );
}
