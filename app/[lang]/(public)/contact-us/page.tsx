import { withHydration } from '@/providers/withHydration';
// import { getBoardMessage } from '@/api/auth';
import ContactUs from '.';
import { getBasicInformation } from '@/api/home';
import { queryKeys } from '@/utils';
import { BASICINFO } from '@/constants/querykeys';

export default withHydration(ContactUs, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getBasicInformation(),
      queryKey: queryKeys(BASICINFO).lists(),
   });
   return queryClient;
});
