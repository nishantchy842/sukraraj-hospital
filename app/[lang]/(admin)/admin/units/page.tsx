'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Pagination, Tabs } from 'antd';
import { capitalize } from 'lodash';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
import { useAuth, withPrivilege } from '@/auth';
import { departmentApi } from '@/api/admin/department';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { DEPARTMENT } from '@/constants/admin/queryKeys';
import { DEPARTMENT_STATUS } from '@/enums/department';
import { ROLE_NAME } from '@/enums/role';
import { type Locale } from '@/i18n';
import { type Department } from '@/models/admin/department';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';

type DepartmentCardProps = {
   data: Department;
   lang: Locale;
   role: ROLE_NAME;
};

const DepartmentCard: React.FC<DepartmentCardProps> = ({
   data,
   lang,
   role,
}) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const handleArchiveDepartment = useMutation(
      (slug: Department['slug']) =>
         departmentApi[role]?.updateDepartment({
            slug,
            status: DEPARTMENT_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async () => {
            successNotification('Unit Archived');
            await queryClient.refetchQueries(queryKeys(DEPARTMENT).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveDepartment = useMutation(
      (slug: Department['slug']) =>
         departmentApi.SUPER_ADMIN.updateDepartment({
            slug,
            status: DEPARTMENT_STATUS.ACTIVE,
         }),
      {
         onSuccess: async () => {
            successNotification('Unit Activated');
            await queryClient.refetchQueries(queryKeys(DEPARTMENT).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <div className='flex gap-[20px] rounded-[10px] border-[1px] border-[rgba(230,237,239,1)] bg-white p-[20px]'>
         <div className='flex size-[80px] items-center justify-center rounded-[5px] bg-[#F5F6F8]'>
            {data?.image && (
               <div className='relative size-[60px]'>
                  <Image
                     alt={data?.slug}
                     src={BASE_IMAGE_PATH + data?.image}
                     fill
                  />
               </div>
            )}
         </div>

         <div className='flex flex-1 flex-col gap-[10px]'>
            <span className='text-[18px] font-[500] leading-[26px] text-[#303030]'>
               {data?.[`name_${capitalize(lang) as 'En' | 'Np'}`]}
            </span>

            <span className='text-[14px] font-[400] leading-[24px] text-[#505050]'>
               {data?.[`description_${capitalize(lang) as 'En' | 'Np'}`]}
            </span>

            <span className='text-[16px] font-[500] leading-[24px] text-[#3A3C5C]'>
               Priority:{' '}
               <span className='text-[#34C38F]'>{data?.priority}</span>
            </span>

            <div className='flex items-center justify-between'>
               <div className='flex gap-[20px]'>
                  <span
                     className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#0C62BB] underline'
                     onClick={() => {
                        router.push(`/${lang}/admin/units/${data?.slug}`);
                     }}
                  >
                     View details
                  </span>

                  <span
                     className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#FF9901] underline'
                     onClick={() => {
                        router.push(
                           `/${lang}/admin/units/create?slug=${data?.slug}`
                        );
                     }}
                  >
                     Edit
                  </span>
               </div>

               <span
                  className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === DEPARTMENT_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     data?.status === DEPARTMENT_STATUS.ACTIVE
                        ? handleArchiveDepartment.mutate(data?.slug)
                        : handleUnarchiveDepartment.mutate(data?.slug);
                  }}
               >
                  {data?.status === DEPARTMENT_STATUS.ACTIVE
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
   name: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as const,
   status: DEPARTMENT_STATUS.ACTIVE,
};

const Departments: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const { authUser } = useAuth();

   const [config, setConfig] = useState(initialConfig);

   const { data: departments } = useQuery({
      queryFn: () => departmentApi[getRole()]?.getDepartments(config),
      queryKey: queryKeys(DEPARTMENT).list(config),
   });

   const tabItems = [
      {
         key: DEPARTMENT_STATUS.ACTIVE,
         label: 'Active Unit',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {departments?.result?.map((department) => (
                  <DepartmentCard
                     key={department.id}
                     data={department}
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
         key: DEPARTMENT_STATUS.ACTIVE,
         label: 'Active Unit',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {departments?.result?.map((department) => (
                  <DepartmentCard
                     key={department.id}
                     data={department}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
      {
         key: DEPARTMENT_STATUS.ARCHIVED,
         label: 'Archived Unit',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {departments?.result?.map((department) => (
                  <DepartmentCard
                     key={department.id}
                     data={department}
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
            <Breadcrumb items={[{ path: 'units' }, {}]} />

            <div className='flex gap-[15px]'>
               <Search
                  placeholder='Search units'
                  onChange={(e) => {
                     setConfig((prev) => ({
                        ...prev,
                        page: 1,
                        name: e.target.value,
                     }));
                  }}
               />

               <Button
                  className='admin-primary-btn'
                  type='primary'
                  onClick={() => {
                     router.push(`/${params.lang}/admin/units/create`);
                  }}
               >
                  + Add Unit
               </Button>
            </div>
         </div>

         {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
            <Tabs
               items={superAdminTabItems}
               onTabClick={(key) => {
                  setConfig((prev) => ({
                     ...prev,
                     status: key as DEPARTMENT_STATUS,
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
            total={departments?.count}
            onChange={(page, size) => {
               setConfig((prev) => ({ ...prev, page, size }));
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(Departments, PRIVILEGE_NAME.DEPARTMENT);
