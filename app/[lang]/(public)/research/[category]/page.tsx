import { withHydration } from '@/providers/withHydration';
import { queryKeys } from '@/utils';
import { RESEARCH, RESEARCH_CATEGORY } from '@/constants/querykeys';
import Research from '.';
import {
   getAllResearch,
   getAllResearchCategory,
   getSingleResearchCategory,
} from '@/api/research';
import { researchConfig } from './rearchConfig';

export default withHydration(
   Research,
   async (queryClient, { params: { category } }) => {
      await queryClient.prefetchQuery({
         queryFn: () =>
            getAllResearch({
               ...researchConfig,
               researchCategorySlug: category,
            }),
         queryKey: queryKeys(RESEARCH).list(researchConfig),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getSingleResearchCategory(category),
         queryKey: queryKeys(RESEARCH_CATEGORY).detail(category),
      });

      await queryClient.prefetchQuery({
         queryFn: () => getAllResearchCategory({ pagination: false }),
         queryKey: queryKeys(RESEARCH_CATEGORY).lists(),
      });

      return queryClient;
   }
);
