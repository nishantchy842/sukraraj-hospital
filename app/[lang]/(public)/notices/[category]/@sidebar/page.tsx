import { withHydration } from '@/providers/withHydration';
import NoticeCategorySideBar from '.';
import { getAllNoticeCategory } from '@/api/notice';
import { queryKeys } from '@/utils';
import { NOTICE_CATEGORY } from '@/constants/querykeys';

export default withHydration(NoticeCategorySideBar, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllNoticeCategory({ pagination: false }),
      queryKey: queryKeys(NOTICE_CATEGORY).lists(),
   });
   return queryClient;
});
