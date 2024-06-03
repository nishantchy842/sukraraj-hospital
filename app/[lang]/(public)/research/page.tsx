import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { RESEARCH_CATEGORY } from '@/constants/querykeys';
import { getAllResearchCategory } from '@/api/research';
import React from 'react';
import { redirect } from 'next/navigation';

export default withHydration(
   // eslint-disable-next-line react/jsx-no-useless-fragment
   () => <React.Fragment></React.Fragment>,
   async (queryClient) => {
      await queryClient.prefetchQuery({
         queryFn: () => getAllResearchCategory({ pagination: false }),
         queryKey: queryKeys(RESEARCH_CATEGORY).lists(),
      });
      const data:
         | Awaited<ReturnType<typeof getAllResearchCategory>>
         | undefined = queryClient.getQueryData(
         queryKeys(RESEARCH_CATEGORY).lists()
      );
      redirect(`/research/${data?.result[0]?.slug}`);
   }
);
