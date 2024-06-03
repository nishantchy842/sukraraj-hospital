import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { RESOURCE, RESOURCE_CATEGORY } from '@/constants/querykeys';
import { resourceConfig } from './resourseConfig';
import {
   getAllResourceCategory,
   getAllResources,
   getSingleResourceCategory,
} from '@/api/downloadResource';
import DownlaodResource from '.';

export default withHydration(
   DownlaodResource,
   async (queryClient, { params: { category } }) => {
      await queryClient.prefetchQuery({
         queryFn: () =>
            getAllResources({
               ...resourceConfig,
               resourceCategorySlug: category,
            }),
         queryKey: queryKeys(RESOURCE).list(resourceConfig),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getSingleResourceCategory(category),
         queryKey: queryKeys(RESOURCE_CATEGORY).list({ category }),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getAllResourceCategory({ pagination: false }),
         queryKey: queryKeys(RESOURCE_CATEGORY).lists(),
      });
      return queryClient;
   }
);
