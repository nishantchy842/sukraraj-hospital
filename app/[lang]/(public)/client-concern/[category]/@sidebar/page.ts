import { withHydration } from '@/providers/withHydration';
// import { queryKeys } from '@/utils';
// import { CLIENT_CONCERN_CATEGORY } from '@/constants/querykeys';
// import { getAllClientConcernCategory } from '@/api/clientConcent';
import ClientConcernSidebar from '.';

export default withHydration(ClientConcernSidebar, async (queryClient) => {
   await queryClient.prefetchQuery({
      // queryFn: () => getAllClientConcernCategory({ pagination: false }),
      // queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).lists(),
   });
   return queryClient;
});
