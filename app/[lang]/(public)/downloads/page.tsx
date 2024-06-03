import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { RESOURCE_CATEGORY } from '@/constants/querykeys';
import { redirect } from 'next/navigation';
import React from 'react';
import { getAllResourceCategory } from '@/api/downloadResource';
import { resourceConfig } from './[category]/resourseConfig';

export default withHydration(
   // eslint-disable-next-line react/jsx-no-useless-fragment
   () => <React.Fragment></React.Fragment>,
   async (queryClient) => {
      await queryClient.prefetchQuery({
         queryFn: () => getAllResourceCategory(resourceConfig),
         queryKey: queryKeys(RESOURCE_CATEGORY).list(resourceConfig),
      });
      const data:
         | Awaited<ReturnType<typeof getAllResourceCategory>>
         | undefined = queryClient.getQueryData(
         queryKeys(RESOURCE_CATEGORY).lists()
      );
      if (data) {
         redirect(`/downloads/${data.result[0]?.slug}`);
      }
      return queryClient;
   }
);
