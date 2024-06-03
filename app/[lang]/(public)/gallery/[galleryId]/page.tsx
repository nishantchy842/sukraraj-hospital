import { withHydration } from '@/providers/withHydration';
import GalleryDetails from '.';
import { queryKeys } from '@/utils';
import { GALLERY } from '@/constants/querykeys';
import { getGalleryDetails } from '@/api/gallery';

export default withHydration(
   GalleryDetails,
   async (queryClient, { params: { galleryId } }) => {
      await queryClient.prefetchQuery({
         queryFn: () => getGalleryDetails(galleryId),
         queryKey: queryKeys(GALLERY).detail(galleryId),
      });
      return queryClient;
   }
);
