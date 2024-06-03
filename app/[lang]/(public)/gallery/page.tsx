import { withHydration } from '@/providers/withHydration';
import Galley from '.';
import { getAllGallery } from '@/api/gallery';
import { queryKeys } from '@/utils';
import { GALLERY } from '@/constants/querykeys';
import { galleryConfig } from './config';

export default withHydration(Galley, async (queryClient) => {
   await queryClient.prefetchQuery({
      queryFn: () => getAllGallery(galleryConfig),
      queryKey: queryKeys(GALLERY).list(galleryConfig),
   });
   return queryClient;
});
