'use client';
import { ABOUTUS_STAFF_DETAILS } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import MemberDetailsCard from './memberDetailsCard';
import { type Locale } from '@/i18n';
import { MEMBER } from '@/enums/privilege';
import { getAllMember } from '@/api/member';
import { isEmpty } from 'lodash';
import { Empty } from 'antd';

export default function StaffDetails({
   params: { lang },
}: {
   params: { lang: Locale };
}) {
   const { data } = useQuery({
      queryKey: queryKeys(ABOUTUS_STAFF_DETAILS).detail(MEMBER.STAFF),
      queryFn: () => getAllMember({ type: MEMBER.STAFF }),
   });

   const priorityFilter = data?.result.sort((a, b) => a.priority - b.priority);

   return (
      <div className='sm:px-[20px]'>
         {isEmpty(priorityFilter) ? (
            <Empty />
         ) : (
            <section className='grid grid-cols-2 gap-x-[35px] gap-y-[30px] md:gap-[34px] sm:grid-cols-1 sm:gap-y-[15px]'>
               {priorityFilter?.map((mem) => (
                  <MemberDetailsCard key={mem.id} lang={lang} data={mem} />
               ))}
            </section>
         )}
      </div>
   );
}
