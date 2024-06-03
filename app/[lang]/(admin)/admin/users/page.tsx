'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd';
import moment from 'moment';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
import { userApi } from '@/api/admin/user';
import { withPrivilege } from '@/auth';
import { queryKeys } from '@/utils';
import { USER } from '@/constants/admin/queryKeys';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';
import { type User } from '@/models/admin/user';

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

const Users: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const [config, setConfig] = useState(initialConfig);

   const { data: users, isLoading } = useQuery({
      queryFn: () => userApi.SUPER_ADMIN.getUsers(config),
      queryKey: queryKeys(USER).list(config),
   });

   const column = [
      {
         key: 'index',
         title: 'S.N.',
         render: (_: string, __: User, index: number) =>
            (config.page - 1) * config.size + (index + 1),
         width: '5%',
      },
      {
         key: 'name',
         title: 'Name',
         dataIndex: 'name',
      },
      {
         key: 'email',
         title: 'Email',
         dataIndex: 'email',
      },
      {
         key: 'role',
         title: 'Role',
         dataIndex: 'role',
         render: (_: string, record: User) => record?.role?.name,
      },
      {
         key: 'createdAt',
         title: 'Created At',
         dataIndex: 'createdAt',
         render: (text: string) => moment(text).format('ll'),
      },
      {
         key: 'action',
         title: 'Action',
         render: (_: string, record: User) => (
            <span
               className='cursor-pointer !text-[16px] !font-[500] !leading-[30px] text-[#FF9901] underline'
               onClick={() => {
                  router.push(
                     `/${params.lang}/admin/users/create?email=${record?.email}`
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
            <Breadcrumb items={[{ path: 'users' }, {}]} />

            <div className='flex gap-[15px]'>
               <Search
                  placeholder='Search users'
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
                     router.push(`/${params.lang}/admin/users/create`);
                  }}
               >
                  + Add User
               </Button>
            </div>
         </div>

         <div className='rounded-[10px] bg-white p-[20px]'>
            <Table<User>
               columns={column}
               dataSource={users?.result}
               loading={isLoading}
               pagination={{
                  current: config.page,
                  pageSize: config.size,
                  total: users?.count,
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

export default withPrivilege(Users, PRIVILEGE_NAME.USER);
