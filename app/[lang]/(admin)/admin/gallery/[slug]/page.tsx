'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Image as AntdImage, Pagination } from 'antd';
import { capitalize } from 'lodash';
import moment from 'moment';
import parse from 'html-react-parser';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
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
import { BASE_IMAGE_PATH } from '@/constants/config';
import { ROLE_NAME } from '@/enums/role';
import { GALLERY_STATUS, VIDEO_UPLOAD_TYPE } from '@/enums/gallery';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';
import { type Gallery } from '@/models/admin/gallery';
import PLAY_ICON from '@/public/admin/assets/play.svg';

type Props = {
   params: {
      lang: Locale;
      slug: string;
   };
};

const Gallery: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const { authUser } = useAuth();

   const queryClient = useQueryClient();

   const [config, setConfig] = useState({ page: 1, size: 10 });

   const { data: gallery } = useQuery({
      queryFn: () => galleryApi[getRole()]?.getGallery(params.slug),
      queryKey: queryKeys(GALLERY).detail(params.slug),
   });

   const handleArchiveGallery = useMutation(
      (slug: Gallery['slug']) =>
         galleryApi[getRole()].updateGallery({
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

   const list = Array.from([
      ...(gallery?.videos ?? []),
      ...(gallery?.images ?? []),
   ])?.sort((a, b) =>
      ('' + String(a?.publishedDate)).localeCompare(
         b?.publishedDate?.toString()
      )
   );

   return (
      <div className='flex flex-col gap-[20px]'>
         <div className='flex justify-between'>
            <BackButton />

            <Breadcrumb
               items={[
                  { path: 'gallery' },
                  {
                     title:
                        gallery?.[
                           `title_${capitalize(params.lang) as 'En' | 'Np'}`
                        ] ?? undefined,
                  },
               ]}
            />

            <div className='flex gap-[10px]'>
               {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN && (
                  <Button
                     className='admin-active-btn'
                     type='primary'
                     disabled={gallery?.status === GALLERY_STATUS.ACTIVE}
                     onClick={() => {
                        gallery && handleUnarchiveGallery.mutate(gallery?.slug);
                     }}
                     loading={handleUnarchiveGallery.isLoading}
                  >
                     Unarchive
                  </Button>
               )}

               <Button
                  className='admin-archive-btn'
                  type='primary'
                  disabled={gallery?.status === GALLERY_STATUS.ARCHIVED}
                  onClick={() => {
                     gallery && handleArchiveGallery.mutate(gallery?.slug);
                  }}
                  loading={handleArchiveGallery.isLoading}
               >
                  Archive
               </Button>

               <Button
                  className='admin-primary-btn bg-[#FF9901] hover:!bg-[#FF9901]'
                  type='primary'
                  onClick={() => {
                     router.push(
                        `/${params.lang}/admin/gallery/create?slug=${gallery?.slug}`
                     );
                  }}
               >
                  Edit Gallery
               </Button>
            </div>
         </div>

         {gallery && (
            <div className='flex flex-col gap-[20px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
               <span className='text-[16px] font-[500] leading-[27px] text-[#505050]'>
                  {gallery?.imagesCount} Images | {gallery?.videosCount} Videos
               </span>

               {list
                  ?.slice(
                     (config.page - 1) * config.size,
                     (config.page - 1) * config.size + config.size
                  )
                  ?.map((d) => (
                     <div
                        key={d?.publishedDate?.toString()}
                        className='flex gap-[20px]'
                     >
                        {d?.type ? (
                           <div className='relative flex h-[132px] w-[184px] items-center justify-center'>
                              <AntdImage
                                 className='!h-[132px] !w-[184px] opacity-0'
                                 preview={{
                                    imageRender: () => (
                                       <iframe
                                          className='h-[70vh] w-3/4'
                                          src={
                                             d?.type === VIDEO_UPLOAD_TYPE.URL
                                                ? d?.link
                                                : BASE_IMAGE_PATH + d?.link
                                          }
                                       />
                                    ),
                                 }}
                              />
                              {d?.type === VIDEO_UPLOAD_TYPE.LOCAL ? (
                                 <video
                                    className='pointer-events-none absolute left-0 top-0 size-full bg-white'
                                    src={BASE_IMAGE_PATH + d?.link}
                                 />
                              ) : (
                                 <iframe
                                    className='pointer-events-none absolute left-0 top-0 size-full'
                                    src={d?.link}
                                 />
                              )}
                              <div className='pointer-events-none absolute size-[60px] cursor-pointer'>
                                 <Image alt='play' src={PLAY_ICON} fill />
                              </div>
                           </div>
                        ) : (
                           <AntdImage
                              className='!h-[132px] !w-[184px]'
                              src={BASE_IMAGE_PATH + d?.link}
                              loading='lazy'
                           />
                        )}

                        <div className='flex flex-1 flex-col gap-[3px] py-[5px]'>
                           <span className='text-[16px] font-[500] leading-[32px] text-[#808080]'>
                              {moment(d?.publishedDate).format('ll')}
                           </span>

                           <div className='prose min-w-full text-[16px] font-[400] leading-[32px] text-[#505050]'>
                              {parse(
                                 d?.[
                                    `description_${capitalize(params.lang) as 'En' | 'Np'}`
                                 ]
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
            </div>
         )}

         <Pagination
            className='flex w-full justify-between'
            current={config.page}
            pageSize={config.size}
            showTotal={(total) => `Total ${total} items`}
            total={list?.length}
            onChange={(page, size) => {
               setConfig((prev) => ({ ...prev, page, size }));
            }}
         />
      </div>
   );
};

export default withPrivilege(Gallery, PRIVILEGE_NAME.GALLERY);
