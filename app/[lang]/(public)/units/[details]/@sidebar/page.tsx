import { withHydration } from '@/providers/withHydration';
import Sidebar from '.';
import { getAllDepartments } from '@/api/departments';
import { queryKeys } from '@/utils';
import { DEPARTMENT } from '@/constants/querykeys';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { departmentConfig } from '../../config';

export default withHydration(Sidebar, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllDepartments(departmentConfig),
      queryKey: queryKeys(DEPARTMENT).list(departmentConfig),
   });
   return queryClient;
});
