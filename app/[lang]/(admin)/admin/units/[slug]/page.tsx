'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { capitalize } from 'lodash';
import parse from 'html-react-parser';
import moment from 'moment';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { useAuth, withPrivilege } from '@/auth';
import { departmentApi } from '@/api/admin/department';
import { memberApi } from '@/api/admin/member';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { DEPARTMENT, MEMBER } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { ROLE_NAME } from '@/enums/role';
import { DEPARTMENT_STATUS } from '@/enums/department';
import { type Locale } from '@/i18n';
import { type Department } from '@/models/admin/department';
import { MEMBER_TYPE } from '@/enums/member';
import { PRIVILEGE_NAME } from '@/enums/privilege';

type Props = {
   params: {
      lang: Locale;
      slug: string;
   };
};

const Department: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const { authUser } = useAuth();

   const queryClient = useQueryClient();

   const { data: department } = useQuery({
      queryFn: () => departmentApi[getRole()]?.getDepartment(params.slug),
      queryKey: queryKeys(DEPARTMENT).detail(params.slug),
   });

   const { data: doctors } = useQuery({
      queryFn: () =>
         memberApi[getRole()]?.getMembers({
            pagination: false,
            type: MEMBER_TYPE.DOCTOR,
            departmentId: department?.id,
         }),
      queryKey: queryKeys(MEMBER).list({
         pagination: false,
         type: MEMBER_TYPE.DOCTOR,
         departmentId: department?.id,
      }),
      enabled: Boolean(department?.id),
   });

   const handleArchiveDepartment = useMutation(
      (slug: Department['slug']) =>
         departmentApi[getRole()].updateDepartment({
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
      <div className='flex flex-col gap-[20px]'>
         <div className='flex justify-between'>
            <BackButton />

            <Breadcrumb
               items={[
                  { path: 'units' },
                  {
                     title:
                        department?.[
                           `name_${capitalize(params.lang) as 'En' | 'Np'}`
                        ] ?? undefined,
                  },
               ]}
            />

            <div className='flex gap-[10px]'>
               {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN && (
                  <Button
                     className='admin-active-btn'
                     type='primary'
                     disabled={department?.status === DEPARTMENT_STATUS.ACTIVE}
                     onClick={() => {
                        department &&
                           handleUnarchiveDepartment.mutate(department?.slug);
                     }}
                     loading={handleUnarchiveDepartment.isLoading}
                  >
                     Unarchive
                  </Button>
               )}

               <Button
                  className='admin-archive-btn'
                  type='primary'
                  disabled={department?.status === DEPARTMENT_STATUS.ARCHIVED}
                  onClick={() => {
                     department &&
                        handleArchiveDepartment.mutate(department?.slug);
                  }}
                  loading={handleArchiveDepartment.isLoading}
               >
                  Archive
               </Button>

               <Button
                  className='admin-primary-btn bg-[#FF9901] hover:!bg-[#FF9901]'
                  type='primary'
                  onClick={() => {
                     router.push(
                        `/${params.lang}/admin/units/create?slug=${department?.slug}`
                     );
                  }}
               >
                  Edit Unit
               </Button>
            </div>
         </div>

         {department && (
            <div className='flex flex-col gap-[30px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
               <div className='prose min-w-full text-[18px] font-[400] leading-[30px] text-[#505050]'>
                  {parse(
                     department?.[
                        `content_${capitalize(params.lang) as 'En' | 'Np'}`
                     ] ?? ''
                  )}
               </div>

               <div className='flex flex-col gap-[15px]'>
                  <span className='text-[20px] font-[500] leading-[33px]'>
                     OPD Days
                  </span>

                  <table>
                     <thead className='bg-[#0C62BB] [&>*]:px-[25px] [&>*]:py-[15px] [&>*]:text-[18px] [&>*]:font-[500] [&>*]:leading-[30px] [&>*]:text-white'>
                        <th align='left'>Days</th>
                        <th>Morning Schedule</th>
                        <th>Afternoon Schedule</th>
                     </thead>

                     <tbody className='border-[1px] border-[#E4E4E4]'>
                        <tr className='[&>*]:px-[25px] [&>*]:py-[15px] [&>*]:text-[18px] [&>*]:font-[500] [&>*]:leading-[30px] [&>*]:text-[#505050]'>
                           <td>
                              {`${department?.opdDaysStart ?? ''} - ${department?.opdDaysEnd ?? ''}`}
                           </td>
                           <td align='center'>
                              {`${department?.morningScheduleStart ? moment(department?.morningScheduleStart).format('hh:mm A') : ''} - ${department?.morningScheduleEnd ? moment(department?.morningScheduleEnd).format('hh:mm A') : ''}`}
                           </td>
                           <td align='center'>
                              {`${department?.afternoonScheduleStart ? moment(department?.afternoonScheduleStart).format('hh:mm A') : ''} - ${department?.afternoonScheduleEnd ? moment(department?.afternoonScheduleEnd).format('hh:mm A') : ''}`}
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               <div className='flex flex-col gap-[15px]'>
                  <span className='text-[20px] font-[500] leading-[33px]'>
                     Our Doctors
                  </span>

                  <div className='flex flex-wrap gap-[50px] bg-[#F5F6F8] p-[30px]'>
                     {doctors?.result?.map((doctor) => (
                        <div
                           key={doctor?.id}
                           className='flex flex-col gap-[15px]'
                        >
                           {doctor?.image && (
                              <div className='relative h-[190px] w-[195px]'>
                                 <Image
                                    alt={doctor?.name_En}
                                    className='rounded-[5px]'
                                    src={BASE_IMAGE_PATH + doctor?.image}
                                    fill
                                 />
                              </div>
                           )}

                           <div className='flex flex-col gap-[5px]'>
                              <span className='text-[18px] font-[500] leading-[30px] text-[#303030]'>
                                 {
                                    doctor?.[
                                       `name_${capitalize(params.lang) as 'En' | 'Np'}`
                                    ]
                                 }
                              </span>

                              <span className='text-[16px] font-[400] leading-[27px] text-[#808080]'>
                                 {
                                    doctor?.[
                                       `position_${capitalize(params.lang) as 'En' | 'Np'}`
                                    ]
                                 }
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default withPrivilege(Department, PRIVILEGE_NAME.DEPARTMENT);
