import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { CLIENT_CONCERN_CATEGORY } from '@/constants/querykeys';
import { getAllClientConcernCategory } from '@/api/clientConcent';
import { redirect } from 'next/navigation';
import React from 'react';
import { Empty } from 'antd';
import { isEmpty } from 'lodash';

export default withHydration(
   // eslint-disable-next-line react/jsx-no-useless-fragment
   () => (
      <React.Fragment>
         <div></div>
         <Empty className=' m-[60px] p-[10px]' />
      </React.Fragment>
   ),
   async (queryClient) => {
      await queryClient.prefetchQuery({
         queryFn: () =>
            getAllClientConcernCategory({ pagination: true, size: 1 }),
         queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).detail('header'),
      });
      const data:
         | Awaited<ReturnType<typeof getAllClientConcernCategory>>
         | undefined = queryClient.getQueryData(
         queryKeys(CLIENT_CONCERN_CATEGORY).detail('header')
      );

      if (!isEmpty(data?.result)) {
         return redirect(`/client-concern/${data?.result[0].slug}`);
      } else {
         return queryClient;
      }
   }
);
