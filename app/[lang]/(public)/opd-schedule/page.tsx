import { withHydration } from '@/providers/withHydration';
import OpdSchedule from '.';
import { type Key } from 'react';

import { queryKeys } from '@/utils';
import { DEPARTMENT } from '@/constants/querykeys';
import { getAllDepartments } from '@/api/departments';

const opdScheduleConfig = {
   pagination: false,
   page: 1,
   sort: 'updatedAt' as Key,
   order: 'DESC' as const,
   name: '',
};

export default withHydration(OpdSchedule, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllDepartments(opdScheduleConfig),
      queryKey: queryKeys(DEPARTMENT).list(opdScheduleConfig),
   });
   return queryClient;
});
