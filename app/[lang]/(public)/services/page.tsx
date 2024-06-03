import { withHydration } from '@/providers/withHydration';
import Services from '.';
import { getAllServices } from '@/api/services';
import { serviceConfig } from './config';
import { queryKeys } from '@/utils';
import { SERVICES } from '@/constants/querykeys';
// import { getAllDepartments } from '@/api/departments';

export default withHydration(Services, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllServices(serviceConfig),
      queryKey: queryKeys(SERVICES).list(serviceConfig),
   });
   return queryClient;
});
