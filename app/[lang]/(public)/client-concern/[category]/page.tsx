import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { CLIENT_CONCERN, CLIENT_CONCERN_CATEGORY } from '@/constants/querykeys';
import ClientConcern from '.';
import {
   getAllClientConcern,
   getAllClientConcernCategory,
   getSingleClientConcernCategory,
} from '@/api/clientConcent';
import { clientConcernConfig } from './config';

export default withHydration(
   ClientConcern,
   async (queryClient, { params: { category } }) => {
      await queryClient.prefetchQuery({
         queryFn: () =>
            getAllClientConcern({
               ...clientConcernConfig,
               clientConcernCategorySlug: category,
            }),
         queryKey: queryKeys(CLIENT_CONCERN).list(clientConcernConfig),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getSingleClientConcernCategory(category),
         queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).detail(category),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getAllClientConcernCategory({ pagination: false }),
         queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).lists(),
      });
      return queryClient;
   }
);
