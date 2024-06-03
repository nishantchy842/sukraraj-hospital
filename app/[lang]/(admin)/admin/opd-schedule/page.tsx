'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { capitalize } from 'lodash';
import moment from 'moment';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
import { departmentApi } from '@/api/admin/department';
import { withPrivilege } from '@/auth';
import { getRole, queryKeys } from '@/utils';
import { DEPARTMENT } from '@/constants/admin/queryKeys';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';
import { type Department } from '@/models/admin/department';

type Props = {
   params: { lang: Locale };
};

const initialConfig = {
   pagination: true,
   page: 1,
   size: 10,
   name: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as 'ASC' | 'DESC',
};

const OPDSchedule: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const [config, setConfig] = useState(initialConfig);

   const { data: departments, isLoading } = useQuery({
      queryFn: () => departmentApi[getRole()]?.getDepartments(config),
      queryKey: queryKeys(DEPARTMENT).list(config),
   });

   const column = [
      {
         key: 'unit',
         title: 'Unit',
         render: (_: string, record: Department) => (
            <span
               className='cursor-pointer text-[#0C62BB]'
               onClick={() => {
                  router.push(`/${params.lang}/admin/units/${record?.slug}`);
               }}
            >
               {record?.[`name_${capitalize(params.lang) as 'En' | 'Np'}`]}
            </span>
         ),
      },
      {
         key: 'roomNo',
         title: 'Room No / OPD Floor',
         render: (_: string, record: Department) => (
            <span>
               {record?.roomNo} / {record?.opdFloor}
            </span>
         ),
      },
      {
         key: 'opdDays',
         title: 'OPD Days',
         render: (_: string, record: Department) =>
            `${record?.opdDaysStart ?? ''} - ${record?.opdDaysEnd ?? ''}`,
      },
      {
         key: 'morningSchedule',
         title: 'Morning Schedule',
         render: (_: string, record: Department) =>
            `${record?.morningScheduleStart ? moment(record?.morningScheduleStart).format('hh:mm A') : ''} - ${record?.morningScheduleEnd ? moment(record?.morningScheduleEnd).format('hh:mm A') : ''}`,
      },
      {
         key: 'afternoonSchedule',
         title: 'Afternoon Schedule',
         render: (_: string, record: Department) =>
            `${record?.afternoonScheduleStart ? moment(record?.afternoonScheduleStart).format('hh:mm A') : ''} - ${record?.afternoonScheduleEnd ? moment(record?.afternoonScheduleEnd).format('hh:mm A') : ''}`,
      },
      {
         key: 'action',
         title: 'Action',
         render: (_: string, record: Department) => (
            <span
               className='cursor-pointer !text-[16px] !font-[500] !leading-[30px] text-[#FF9901] underline'
               onClick={() => {
                  router.push(
                     `/${params.lang}/admin/units/create?slug=${record?.slug}`
                  );
               }}
            >
               Edit
            </span>
         ),
      },
   ];

   return (
      <Fragment>
         <div className='flex justify-between'>
            <Breadcrumb items={[{ path: 'opd-schedule' }, {}]} />

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
         </div>

         <div className='rounded-[10px] bg-white p-[20px]'>
            <Table<Department>
               columns={column}
               dataSource={departments?.result}
               loading={isLoading}
               pagination={{
                  current: config.page,
                  pageSize: config.size,
                  total: departments?.count,
                  onChange: (page, size) => {
                     setConfig((prev) => ({ ...prev, page, size }));
                  },
                  showTotal: (total) => `Total ${total} items`,
                  showSizeChanger: true,
               }}
               rowKey={(record) => record.id}
               onChange={(_, __, sorter) => {
                  if (!Array.isArray(sorter)) {
                     const { field, order } = sorter;

                     if (!field || !order) {
                        setConfig((prev) => ({
                           ...prev,
                           sort: 'updatedAt',
                           order: 'DESC',
                        }));
                     } else {
                        setConfig((prev) => ({
                           ...prev,
                           sort: field,
                           order: order.replaceAll('end', '').toUpperCase() as
                              | 'ASC'
                              | 'DESC',
                        }));
                     }
                  }
               }}
            />
         </div>
      </Fragment>
   );
};

export default withPrivilege(OPDSchedule, PRIVILEGE_NAME.OPD_SCHEDULE);
