import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { RESOURCE_CATEGORY } from '@/constants/querykeys';
import DownloadRescourceCategory from '.';
import { getAllResourceCategory } from '@/api/downloadResource';

export default withHydration(DownloadRescourceCategory, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllResourceCategory({ pagination: false }),
      queryKey: queryKeys(RESOURCE_CATEGORY).lists(),
   });
   return queryClient;
});
