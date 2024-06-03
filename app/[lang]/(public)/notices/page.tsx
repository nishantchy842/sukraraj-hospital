import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { NOTICE_CATEGORY } from '@/constants/querykeys';
import React from 'react';
import { redirect } from 'next/navigation';
import { getAllNoticeCategory } from '@/api/notice';

export default withHydration(
   // eslint-disable-next-line react/jsx-no-useless-fragment
   () => <React.Fragment></React.Fragment>,
   async (queryClient) => {
      await queryClient.prefetchQuery({
         queryFn: () => getAllNoticeCategory({ pagination: true, size: 1 }),
         queryKey: queryKeys(NOTICE_CATEGORY).list({ notice: 'notice' }),
      });

      const data: Awaited<ReturnType<typeof getAllNoticeCategory>> | undefined =
         queryClient.getQueryData(
            queryKeys(NOTICE_CATEGORY).list({ notice: 'notice' })
         );

      redirect(`/notices/${data?.result[0]?.slug}`);
   }
);
