import { withHydration } from '@/providers/withHydration';
import { getAllServices } from '@/api/services';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { queryKeys } from '@/utils';
import { SERVICES } from '@/constants/querykeys';
import ServiceSidebar from '.';

export default withHydration(ServiceSidebar, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllServices({ pagination: false }),
      queryKey: queryKeys(SERVICES).list({ pagination: false }),
   });
   return queryClient;
});
