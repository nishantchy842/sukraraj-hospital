import { withHydration } from '@/providers/withHydration';
import Departments from '.';
import { getAllDepartments } from '@/api/departments';
import { queryKeys } from '@/utils';
import { DEPARTMENT } from '@/constants/querykeys';
import { departmentConfig } from './config';
// import { getBoardMessage } from '@/api/auth';

export default withHydration(Departments, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllDepartments(departmentConfig),
      queryKey: queryKeys(DEPARTMENT).list(departmentConfig),
   });
   return queryClient;
});
