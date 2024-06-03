'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Tag } from 'antd';
import { capitalize } from 'lodash';
import parse from 'html-react-parser';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { useAuth, withPrivilege } from '@/auth';
import { serviceApi } from '@/api/admin/service';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { SERVICE } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { ROLE_NAME } from '@/enums/role';
import { SERVICE_STATUS } from '@/enums/service';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';
import { type Service } from '@/models/admin/service';

type Props = {
   params: {
      lang: Locale;
      slug: string;
   };
};

const Service: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const { authUser } = useAuth();

   const queryClient = useQueryClient();

   const { data: service } = useQuery({
      queryFn: () => serviceApi[getRole()]?.getService(params.slug),
      queryKey: queryKeys(SERVICE).detail(params.slug),
   });

   const handleArchiveService = useMutation(
      (slug: Service['slug']) =>
         serviceApi[getRole()].updateService({
            slug,
            status: SERVICE_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(SERVICE).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveService = useMutation(
      (slug: Service['slug']) =>
         serviceApi.SUPER_ADMIN.updateService({
            slug,
            status: SERVICE_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(SERVICE).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <div className='flex flex-col gap-[20px]'>
         <div className='flex justify-between'>
            <BackButton />

            <Breadcrumb
               items={[
                  { path: 'services' },
                  {
                     title:
                        service?.[
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
                     disabled={service?.status === SERVICE_STATUS.ACTIVE}
                     onClick={() => {
                        service && handleUnarchiveService.mutate(service?.slug);
                     }}
                     loading={handleUnarchiveService.isLoading}
                  >
                     Unarchive
                  </Button>
               )}

               <Button
                  className='admin-archive-btn'
                  type='primary'
                  disabled={service?.status === SERVICE_STATUS.ARCHIVED}
                  onClick={() => {
                     service && handleArchiveService.mutate(service?.slug);
                  }}
                  loading={handleArchiveService.isLoading}
               >
                  Archive
               </Button>

               <Button
                  className='admin-primary-btn bg-[#FF9901] hover:!bg-[#FF9901]'
                  type='primary'
                  onClick={() => {
                     router.push(
                        `/${params.lang}/admin/services/create?slug=${service?.slug}`
                     );
                  }}
               >
                  Edit Service
               </Button>
            </div>
         </div>

         {service && (
            <div className='flex flex-col gap-[30px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
               <div className='flex flex-wrap gap-[5px]'>
                  {service?.[
                     `tags_${capitalize(params?.lang) as 'En' | 'Np'}`
                  ]?.map((tag) => (
                     <Tag
                        key={tag}
                        className='rounded-[5px] border-none bg-[#F5F6F8] p-[7px] text-[16px] font-[400] leading-[22px] text-[#505050]'
                     >
                        {tag}
                     </Tag>
                  ))}
               </div>

               {service?.image && (
                  <div className='relative h-[220px] w-[300px]'>
                     <Image
                        alt='service image'
                        src={`${BASE_IMAGE_PATH}${service?.image}`}
                        fill
                     />
                  </div>
               )}

               <div className='prose min-w-full text-[18px] font-[400] leading-[30px] text-[#505050]'>
                  {parse(
                     service?.[
                        `content_${capitalize(params.lang) as 'En' | 'Np'}`
                     ] ?? ''
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default withPrivilege(Service, PRIVILEGE_NAME.SERVICE);
