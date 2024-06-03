import { withHydration } from '@/providers/withHydration';
import Home from './home';
import { queryKeys } from '@/utils';
import {
   ABOUTUS,
   BANNER,
   BASICINFO,
   BOARD_MESSAGE,
   DAILY_CAPACITY,
   DEPARTMENT,
   GALLERY,
   NOTICE,
   NOTICE_CATEGORY,
   SERVICES,
   TEAM_MEMBER,
} from '@/constants/querykeys';
import { getAboutUs } from '@/api/aboutUs';
import { getAllDepartments } from '@/api/departments';
import { getAllNotice, getAllNoticeCategory } from '@/api/notice';
// import { noticeConfig } from './notices/[category]/config';
import { serviceConfig } from './services/config';
import { getAllServices } from '@/api/services';
import {
   getAllBanners,
   getBasicInformation,
   getDailyCapacity,
} from '@/api/home';
import { getAllMember } from '@/api/member';
import { getAllGallery } from '@/api/gallery';
import { MEMBER } from '@/enums/privilege';

export default withHydration(Home, async (queryClient) => {
   const queryKey1 = queryKeys(BOARD_MESSAGE).detail(MEMBER.BOARD_MEMBER);

   const teamMemberKey = queryKeys(TEAM_MEMBER).detail(MEMBER.TEAM_MEMBER);

   const queryKey2 = queryKeys(ABOUTUS).lists();

   const queryKey3 = queryKeys(DEPARTMENT).lists();

   const noticeCategoryKey = queryKeys(NOTICE_CATEGORY).list({
      home: 'home',
   });

   const noticeListKey = queryKeys(NOTICE).list({ isPopup: true });

   const servicesListKey = queryKeys(SERVICES).list(serviceConfig);

   const bannerListKey = queryKeys(BANNER).lists();

   const basicInfoKey = queryKeys(BASICINFO).lists();

   const dailyCapacityKey = queryKeys(DAILY_CAPACITY).lists();

   const galleryKey = queryKeys(GALLERY).list({ size: 5 });

   await Promise.all([
      queryClient.prefetchQuery({
         queryKey: queryKey1,
         queryFn: () =>
            getAllMember({ type: MEMBER.BOARD_MEMBER, pagination: false }),
      }),

      queryClient.prefetchQuery({
         queryKey: teamMemberKey,
         queryFn: () =>
            getAllMember({ type: MEMBER.TEAM_MEMBER, pagination: false }),
      }),

      queryClient.prefetchQuery({
         queryKey: queryKey2,
         queryFn: () => getAboutUs(),
      }),

      queryClient.prefetchQuery({
         queryKey: queryKey3,
         queryFn: () => getAllDepartments({ size: 8 }),
      }),

      queryClient.prefetchQuery({
         queryKey: noticeCategoryKey,
         queryFn: () => getAllNoticeCategory({ pagination: false }),
      }),

      queryClient.prefetchQuery({
         queryKey: noticeListKey,
         queryFn: () => getAllNotice({ pagination: false, isPopup: true }),
      }),

      queryClient.prefetchQuery({
         queryKey: servicesListKey,
         queryFn: () => getAllServices(serviceConfig),
      }),
      queryClient.prefetchQuery({
         queryKey: bannerListKey,
         queryFn: () => getAllBanners({}),
      }),

      queryClient.prefetchQuery({
         queryKey: basicInfoKey,
         queryFn: () => getBasicInformation(),
      }),

      queryClient.prefetchQuery({
         queryKey: dailyCapacityKey,
         queryFn: () => getDailyCapacity(),
      }),

      queryClient.prefetchQuery({
         queryKey: galleryKey,
         queryFn: () =>
            getAllGallery({
               pagination: true,
               size: 5,
               order: 'DESC',
               sort: 'updatedAt',
            }),
      }),
   ]);

   return queryClient;
});
