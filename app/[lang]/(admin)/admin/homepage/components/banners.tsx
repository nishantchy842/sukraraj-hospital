import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type Key } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Tabs } from 'antd';
import { bannerApi } from '@/api/admin/banner';
import { useAuth } from '@/auth';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { BANNER_STATUS } from '@/enums/banner';
import { BANNER } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { type Banner } from '@/models/admin/banner';
import { type Locale } from '@/i18n';
import { ROLE_NAME } from '@/enums/role';

type BannerCardProps = {
   data: Banner;
   role: ROLE_NAME;
   lang: Locale;
};

const BannerCard: React.FC<BannerCardProps> = ({ data, role, lang }) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const handleArchiveBanner = useMutation(
      (id: Banner['id']) =>
         bannerApi[role]?.updateBanner({
            id,
            status: BANNER_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(BANNER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveBanner = useMutation(
      (id: Banner['id']) =>
         bannerApi.SUPER_ADMIN.updateBanner({
            id,
            status: BANNER_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(BANNER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <div className='flex gap-[15px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
         <div className='relative size-[80px]'>
            <Image
               alt='banner image'
               className='rounded-[5px]'
               src={BASE_IMAGE_PATH + data?.image}
               fill
            />
         </div>

         <div className='flex flex-1 flex-col justify-center gap-[15px]'>
            <span className='text-[16px] font-[500] leading-[24px] text-[#3A3C5C]'>
               Priority:{' '}
               <span className='text-[#34C38F]'>{data?.priority}</span>
            </span>

            <div className='flex justify-between'>
               <span
                  className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#FF9901] underline'
                  onClick={() => {
                     router.push(
                        `/${lang}/admin/homepage/banner/create?id=${data?.id}`
                     );
                  }}
               >
                  Edit Banner
               </span>

               <span
                  className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === BANNER_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     data?.status === BANNER_STATUS.ACTIVE
                        ? handleArchiveBanner.mutate(data?.id)
                        : handleUnarchiveBanner.mutate(data?.id);
                  }}
               >
                  {data?.status === BANNER_STATUS.ACTIVE ? 'Archive' : 'Active'}
               </span>
            </div>
         </div>
      </div>
   );
};

type Props = {
   lang: Locale;
};

const initialBannerConfig = {
   pagination: true,
   page: 1,
   size: 10,
   title: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as const,
   status: BANNER_STATUS.ACTIVE,
};

export const Banners: React.FC<Props> = ({ lang }) => {
   const { authUser } = useAuth();

   const [config, setConfig] = useState(initialBannerConfig);

   const { data: banners } = useQuery({
      queryFn: () => bannerApi[getRole()]?.getBanners(config),
      queryKey: queryKeys(BANNER).list(config),
   });

   const tabItems = [
      {
         key: BANNER_STATUS.ACTIVE,
         label: 'Active Banner',
         children: (
            <div className='grid grid-cols-3 gap-[20px]'>
               {banners?.result?.map((banner) => (
                  <BannerCard
                     key={banner?.id}
                     data={banner}
                     role={getRole()}
                     lang={lang}
                  />
               ))}
            </div>
         ),
      },
   ];

   const superAdminTabItems = [
      {
         key: BANNER_STATUS.ACTIVE,
         label: 'Active Banner',
         children: (
            <div className='grid grid-cols-3 gap-[20px]'>
               {banners?.result?.map((banner) => (
                  <BannerCard
                     key={banner?.id}
                     data={banner}
                     role={getRole()}
                     lang={lang}
                  />
               ))}
            </div>
         ),
      },
      {
         key: BANNER_STATUS.ARCHIVED,
         label: 'Archived Banner',
         children: (
            <div className='grid grid-cols-3 gap-[20px]'>
               {banners?.result?.map((banner) => (
                  <BannerCard
                     key={banner?.id}
                     data={banner}
                     role={getRole()}
                     lang={lang}
                  />
               ))}
            </div>
         ),
      },
   ];

   return (
      <div className='flex flex-col gap-[20px]'>
         <div className='flex items-center justify-between'>
            <span className='text-[18px] font-[600] leading-[30px] text-[#303030]'>
               List of Banner
            </span>

            <Link href={`/${lang}/admin/homepage/banner/create`}>
               <Button className='admin-primary-btn w-fit' type='primary'>
                  + Add Banner
               </Button>
            </Link>
         </div>

         {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
            <Tabs
               items={superAdminTabItems}
               onTabClick={(key) => {
                  setConfig((prev) => ({
                     ...prev,
                     status: key as BANNER_STATUS,
                  }));
               }}
            />
         ) : (
            <Tabs items={tabItems} />
         )}
      </div>
   );
};
