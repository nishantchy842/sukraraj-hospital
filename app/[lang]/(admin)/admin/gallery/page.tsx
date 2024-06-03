'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Pagination, Tabs } from 'antd';
import { capitalize } from 'lodash';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { useAuth, withPrivilege } from '@/auth';
import { galleryApi } from '@/api/admin/gallery';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { GALLERY } from '@/constants/admin/queryKeys';
import { GALLERY_STATUS } from '@/enums/gallery';
import { ROLE_NAME } from '@/enums/role';
import { type Locale } from '@/i18n';
import { type Gallery } from '@/models/admin/gallery';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';

type GalleryCardProps = {
   data: Gallery;
   lang: Locale;
   role: ROLE_NAME;
};

const GalleryCard: React.FC<GalleryCardProps> = ({ data, lang, role }) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const handleArchiveGallery = useMutation(
      (slug: Gallery['slug']) =>
         galleryApi[role]?.updateGallery({
            slug,
            status: GALLERY_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(GALLERY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveGallery = useMutation(
      (slug: Gallery['slug']) =>
         galleryApi.SUPER_ADMIN.updateGallery({
            slug,
            status: GALLERY_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(GALLERY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <div className='flex gap-[20px] rounded-[10px] border-[1px] border-[rgba(230,237,239,1)] bg-white p-[25px]'>
         {data?.coverImage && (
            <div className='relative h-[95px] w-[130px]'>
               <Image
                  alt={data?.slug}
                  className='rounded-[5px]'
                  src={BASE_IMAGE_PATH + data?.coverImage}
                  fill
               />
            </div>
         )}

         <div className='flex flex-1 flex-col gap-[10px]'>
            <span className='text-[18px] font-[500] leading-[26px] text-[#303030]'>
               {data?.[`title_${capitalize(lang) as 'En' | 'Np'}`]}
            </span>

            <span className='text-[16px] font-[500] leading-[27px] text-[#505050]'>
               {data?.imagesCount} Images | {data?.videosCount} Videos
            </span>

            <div className='flex items-center justify-between'>
               <div className='flex gap-[20px]'>
                  <span
                     className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#0C62BB] underline'
                     onClick={() => {
                        router.push(`/${lang}/admin/gallery/${data?.slug}`);
                     }}
                  >
                     View details
                  </span>

                  <span
                     className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#FF9901] underline'
                     onClick={() => {
                        router.push(
                           `/${lang}/admin/gallery/create?slug=${data?.slug}`
                        );
                     }}
                  >
                     Edit
                  </span>
               </div>

               <span
                  className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === GALLERY_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     data?.status === GALLERY_STATUS.ACTIVE
                        ? handleArchiveGallery.mutate(data?.slug)
                        : handleUnarchiveGallery.mutate(data?.slug);
                  }}
               >
                  {data?.status === GALLERY_STATUS.ACTIVE
                     ? 'Archive'
                     : 'Active'}
               </span>
            </div>
         </div>
      </div>
   );
};

type Props = {
   params: { lang: Locale };
};

const initialConfig = {
   pagination: true,
   page: 1,
   size: 10,
   title: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as const,
   status: GALLERY_STATUS.ACTIVE,
};

const Galleries: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const { authUser } = useAuth();

   const [config, setConfig] = useState(initialConfig);

   const { data: galleries } = useQuery({
      queryFn: () => galleryApi[getRole()]?.getGallerys(config),
      queryKey: queryKeys(GALLERY).list(config),
   });

   const tabItems = [
      {
         key: GALLERY_STATUS.ACTIVE,
         label: 'Active Gallery',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {galleries?.result?.map((gallery) => (
                  <GalleryCard
                     key={gallery.id}
                     data={gallery}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
   ];

   const superAdminTabItems = [
      {
         key: GALLERY_STATUS.ACTIVE,
         label: 'Active Gallery',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {galleries?.result?.map((gallery) => (
                  <GalleryCard
                     key={gallery.id}
                     data={gallery}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
      {
         key: GALLERY_STATUS.ARCHIVED,
         label: 'Archived Gallery',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {galleries?.result?.map((gallery) => (
                  <GalleryCard
                     key={gallery.id}
                     data={gallery}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
   ];

   return (
      <Fragment>
         <div className='flex items-center justify-between'>
            <Breadcrumb items={[{ path: 'gallery' }, {}]} />

            <div className='flex gap-[15px]'>
               <Search
                  placeholder='Search galleries'
                  onChange={(e) => {
                     setConfig((prev) => ({
                        ...prev,
                        page: 1,
                        title: e.target.value,
                     }));
                  }}
               />

               <Button
                  className='admin-primary-btn'
                  type='primary'
                  onClick={() => {
                     router.push(`/${params.lang}/admin/gallery/create`);
                  }}
               >
                  + Add Gallery
               </Button>
            </div>
         </div>

         {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
            <Tabs
               items={superAdminTabItems}
               onTabClick={(key) => {
                  setConfig((prev) => ({
                     ...prev,
                     status: key as GALLERY_STATUS,
                  }));
               }}
            />
         ) : (
            <Tabs items={tabItems} />
         )}

         <Pagination
            className='flex w-full justify-between'
            current={config.page}
            pageSize={config.size}
            showTotal={(total) => `Total ${total} items`}
            total={galleries?.count}
            onChange={(page, size) => {
               setConfig((prev) => ({ ...prev, page, size }));
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(Galleries, PRIVILEGE_NAME.GALLERY);
