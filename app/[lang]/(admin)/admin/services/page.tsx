'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Pagination, Tabs, Tag } from 'antd';
import { capitalize } from 'lodash';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
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
import { SERVICE_STATUS } from '@/enums/service';
import { ROLE_NAME } from '@/enums/role';
import { type Locale } from '@/i18n';
import { type Service } from '@/models/admin/service';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';

type ServiceCardProps = {
   data: Service;
   lang: Locale;
   role: ROLE_NAME;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ data, lang, role }) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const handleArchiveService = useMutation(
      (slug: Service['slug']) =>
         serviceApi[role]?.updateService({
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
      <div className='flex gap-[20px] rounded-[10px] border-[1px] border-[rgba(230,237,239,1)] bg-white p-[20px]'>
         {data?.image && (
            <div className='relative h-[80px] w-[110px]'>
               <Image
                  alt={data?.slug}
                  src={BASE_IMAGE_PATH + data?.image}
                  fill
               />
            </div>
         )}

         <div className='flex flex-1 flex-col gap-[10px]'>
            <span className='text-[18px] font-[500] leading-[26px] text-[#303030]'>
               {data?.[`title_${capitalize(lang) as 'En' | 'Np'}`]}
            </span>

            <div className='flex flex-wrap gap-[5px]'>
               {data?.[`tags_${capitalize(lang) as 'En' | 'Np'}`]?.map(
                  (tag) => (
                     <Tag
                        key={tag}
                        className='rounded-[5px] border-none bg-[#F5F6F8] p-[7px] text-[16px] font-[400] leading-[22px] text-[#505050]'
                     >
                        {tag}
                     </Tag>
                  )
               )}
            </div>

            <span className='text-[16px] font-[500] leading-[24px] text-[#3A3C5C]'>
               Priority:{' '}
               <span className='text-[#34C38F]'>{data?.priority}</span>
            </span>

            <div className='flex items-center justify-between'>
               <div className='flex gap-[20px]'>
                  <span
                     className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#0C62BB] underline'
                     onClick={() => {
                        router.push(`/${lang}/admin/services/${data?.slug}`);
                     }}
                  >
                     View details
                  </span>

                  <span
                     className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#FF9901] underline'
                     onClick={() => {
                        router.push(
                           `/${lang}/admin/services/create?slug=${data?.slug}`
                        );
                     }}
                  >
                     Edit
                  </span>
               </div>

               <span
                  className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === SERVICE_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     data?.status === SERVICE_STATUS.ACTIVE
                        ? handleArchiveService.mutate(data?.slug)
                        : handleUnarchiveService.mutate(data?.slug);
                  }}
               >
                  {data?.status === SERVICE_STATUS.ACTIVE
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
   status: SERVICE_STATUS.ACTIVE,
};

const Services: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const { authUser } = useAuth();

   const [config, setConfig] = useState(initialConfig);

   const { data: services } = useQuery({
      queryFn: () => serviceApi[getRole()]?.getServices(config),
      queryKey: queryKeys(SERVICE).list(config),
   });

   const tabItems = [
      {
         key: SERVICE_STATUS.ACTIVE,
         label: 'Active Service',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {services?.result?.map((service) => (
                  <ServiceCard
                     key={service.id}
                     data={service}
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
         key: SERVICE_STATUS.ACTIVE,
         label: 'Active Service',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {services?.result?.map((service) => (
                  <ServiceCard
                     key={service.id}
                     data={service}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
      {
         key: SERVICE_STATUS.ARCHIVED,
         label: 'Archived Service',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {services?.result?.map((service) => (
                  <ServiceCard
                     key={service.id}
                     data={service}
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
            <Breadcrumb items={[{ path: 'services' }, {}]} />

            <div className='flex gap-[15px]'>
               <Search
                  placeholder='Search services'
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
                     router.push(`/${params.lang}/admin/services/create`);
                  }}
               >
                  + Add Service
               </Button>
            </div>
         </div>

         {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
            <Tabs
               items={superAdminTabItems}
               onTabClick={(key) => {
                  setConfig((prev) => ({
                     ...prev,
                     status: key as SERVICE_STATUS,
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
            total={services?.count}
            onChange={(page, size) => {
               setConfig((prev) => ({ ...prev, page, size }));
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(Services, PRIVILEGE_NAME.SERVICE);
