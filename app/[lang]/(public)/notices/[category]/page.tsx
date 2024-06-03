import { withHydration } from '@/providers/withHydration';
import Notice from '.';
import {
   getAllNotice,
   getAllNoticeCategory,
   getSingleNoticeCategory,
} from '@/api/notice';
import { queryKeys } from '@/utils';
import {
   NOTICE,
   NOTICE_CATEGORY,
   NOTICE_CATEGORY_DETAILS,
} from '@/constants/querykeys';
import { noticeConfig } from './config';

export default withHydration(
   Notice,
   async (queryClient, { params: { category } }) => {
      await queryClient.prefetchQuery({
         queryFn: () =>
            getAllNotice({ ...noticeConfig, noticeCategorySlug: category }),
         queryKey: queryKeys(NOTICE).list(noticeConfig),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getSingleNoticeCategory(category),
         queryKey: queryKeys(NOTICE_CATEGORY_DETAILS).lists(),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getAllNoticeCategory({ pagination: false }),
         queryKey: queryKeys(NOTICE_CATEGORY).lists(),
      });
      return queryClient;
   }
);
