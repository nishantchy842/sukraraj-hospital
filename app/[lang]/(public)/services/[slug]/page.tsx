import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { SERVICES } from '@/constants/querykeys';
import ServiceDetails from '.';
import { getAllServices, getSevivesDetails } from '@/api/services';
// import { getBoardMessage } from '@/api/auth';

export default withHydration(
   ServiceDetails,
   async (queryClient, { params }) => {
      await queryClient.prefetchQuery({
         queryFn: () => getSevivesDetails(params?.slug),
         queryKey: queryKeys(SERVICES).detail(params?.slug),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getAllServices({ pagination: false }),
         queryKey: queryKeys(SERVICES).list({ pagination: false }),
      });
      return queryClient;
   }
);
