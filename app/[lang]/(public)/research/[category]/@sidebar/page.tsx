import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { RESEARCH_CATEGORY } from '@/constants/querykeys';
import { getAllResearchCategory } from '@/api/research';
import ResearchSidebar from '.';

export default withHydration(ResearchSidebar, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllResearchCategory({ pagination: false, title: '' }),
      queryKey: queryKeys(RESEARCH_CATEGORY).lists(),
   });
   return queryClient;
});
