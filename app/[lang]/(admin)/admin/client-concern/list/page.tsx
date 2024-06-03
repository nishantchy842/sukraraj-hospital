'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Select, Table, Tabs } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { capitalize } from 'lodash';
import parse from 'html-react-parser';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
import { useAuth, withPrivilege } from '@/auth';
import { clientConcernApi } from '@/api/admin/client-concern';
import { clientConcernCategoryApi } from '@/api/admin/client-concern-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import {
   CLIENT_CONCERN,
   CLIENT_CONCERN_CATEGORY,
} from '@/constants/admin/queryKeys';
import { CLIENT_CONCERN_STATUS } from '@/enums/client-concern';
import { type Locale } from '@/i18n';
import { type ClientConcern } from '@/models/admin/client-concern';
import { ROLE_NAME } from '@/enums/role';
import { PRIVILEGE_NAME } from '@/enums/privilege';

type Props = {
   params: { lang: Locale };
};

const initialConfig = {
   pagination: true,
   page: 1,
   size: 10,
   question: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as 'ASC' | 'DESC',
   clientConcernCategoryId: undefined,
   status: CLIENT_CONCERN_STATUS.ACTIVE,
};

const ClientConcerns: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const { authUser } = useAuth();

   const [config, setConfig] = useState(initialConfig);

   const { data: clientConcerns, isLoading } = useQuery({
      queryFn: () => clientConcernApi[getRole()]?.getClientConcerns(config),
      queryKey: queryKeys(CLIENT_CONCERN).list(config),
   });

   const { data: clientConcernCategories, isLoading: isCategoryLoading } =
      useQuery({
         queryFn: () =>
            clientConcernCategoryApi[getRole()]?.getClientConcernCategories({
               pagination: false,
            }),
         queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).list({
            pagination: false,
         }),
      });

   const handleArchiveClientConcern = useMutation(
      (slug: ClientConcern['slug']) =>
         clientConcernApi[getRole()]?.updateClientConcern({
            slug,
            status: CLIENT_CONCERN_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(CLIENT_CONCERN).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveClientConcern = useMutation(
      (slug: ClientConcern['slug']) =>
         clientConcernApi.SUPER_ADMIN.updateClientConcern({
            slug,
            status: CLIENT_CONCERN_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(CLIENT_CONCERN).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const column = [
      {
         key: 'index',
         title: 'S.N.',
         render: (_: string, __: ClientConcern, index: number) =>
            (config.page - 1) * config.size + (index + 1),
         width: '5%',
      },
      {
         key: 'question',
         title: 'Question',
         width: '30%',
         render: (_: string, record: ClientConcern) => (
            <span>
               {record?.[`question_${capitalize(params.lang) as 'En' | 'Np'}`]}
            </span>
         ),
      },
      {
         key: 'answer',
         title: 'Answer',
         width: '40%',
         render: (_: string, record: ClientConcern) => (
            <Paragraph
               className='prose !mb-0 min-w-full text-[16px] font-[500] leading-[27px] text-[#495057]'
               ellipsis={{
                  rows: 3,
                  expandable: true,
                  symbol: (
                     <div className='flex items-center gap-[5px] text-[16px] font-[500] leading-[27px] text-[#0C62BB]'>
                        See more <IoIosArrowDropdownCircle />
                     </div>
                  ),
               }}
            >
               {parse(
                  record?.[
                     `answer_${capitalize(params.lang) as 'En' | 'Np'}`
                  ] ?? ''
               )}
            </Paragraph>
         ),
      },
      {
         key: 'category',
         title: 'Category',
         width: '15%',
         render: (_: string, record: ClientConcern) =>
            record?.clientConcernCategories

               ?.map(
                  (category) =>
                     category?.[
                        `title_${capitalize(params.lang) as 'En' | 'Np'}`
                     ]
               )
               .join(', ')
               .toString(),
      },
      {
         key: 'action',
         title: 'Action',
         render: (_: string, record: ClientConcern) => (
            <div className='flex gap-[15px] [&>*]:cursor-pointer [&>*]:text-[13px] [&>*]:font-[400] [&>*]:leading-[19px]'>
               <span
                  className='cursor-pointer !text-[16px] !font-[500] !leading-[30px] text-[#FF9901] underline'
                  onClick={() => {
                     router.push(
                        `/${params.lang}/admin/client-concern/list/create?slug=${record?.slug}`
                     );
                  }}
               >
                  Edit
               </span>

               <span
                  className={`cursor-pointer !text-[16px] !font-[500] !leading-[30px] underline ${record?.status === CLIENT_CONCERN_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     record?.status === CLIENT_CONCERN_STATUS.ACTIVE
                        ? handleArchiveClientConcern.mutate(record?.slug)
                        : handleUnarchiveClientConcern.mutate(record?.slug);
                  }}
               >
                  {record?.status === CLIENT_CONCERN_STATUS.ACTIVE
                     ? 'Archive'
                     : 'Active'}
               </span>
            </div>
         ),
      },
   ];

   const tabItems = [
      {
         key: CLIENT_CONCERN_STATUS.ACTIVE,
         label: 'Active Client Concern',
         children: (
            <div className='rounded-[10px] bg-white p-[20px]'>
               <Table<ClientConcern>
                  columns={column}
                  dataSource={clientConcerns?.result}
                  loading={isLoading}
                  pagination={{
                     current: config.page,
                     pageSize: config.size,
                     total: clientConcerns?.count,
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
                              order: order
                                 .replaceAll('end', '')
                                 .toUpperCase() as 'ASC' | 'DESC',
                           }));
                        }
                     }
                  }}
               />
            </div>
         ),
      },
   ];

   const superAdminTabItems = [
      {
         key: CLIENT_CONCERN_STATUS.ACTIVE,
         label: 'Active Client Concern',
         children: (
            <div className='rounded-[10px] bg-white p-[20px]'>
               <Table<ClientConcern>
                  columns={column}
                  dataSource={clientConcerns?.result}
                  loading={isLoading}
                  pagination={{
                     current: config.page,
                     pageSize: config.size,
                     total: clientConcerns?.count,
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
                              order: order
                                 .replaceAll('end', '')
                                 .toUpperCase() as 'ASC' | 'DESC',
                           }));
                        }
                     }
                  }}
               />
            </div>
         ),
      },
      {
         key: CLIENT_CONCERN_STATUS.ARCHIVED,
         label: 'Archived Client Concern',
         children: (
            <div className='rounded-[10px] bg-white p-[20px]'>
               <Table<ClientConcern>
                  columns={column}
                  dataSource={clientConcerns?.result}
                  loading={isLoading}
                  pagination={{
                     current: config.page,
                     pageSize: config.size,
                     total: clientConcerns?.count,
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
                              order: order
                                 .replaceAll('end', '')
                                 .toUpperCase() as 'ASC' | 'DESC',
                           }));
                        }
                     }
                  }}
               />
            </div>
         ),
      },
   ];

   return (
      <Fragment>
         <div className='flex items-center justify-between'>
            <Breadcrumb items={[{ path: 'client-concern/list' }, {}]} />

            <div className='flex gap-[15px]'>
               <Search
                  placeholder='Search client concerns'
                  onChange={(e) => {
                     setConfig((prev) => ({
                        ...prev,
                        page: 1,
                        question: e.target.value,
                     }));
                  }}
               />

               <Button
                  className='admin-primary-btn'
                  type='primary'
                  onClick={() => {
                     router.push(
                        `/${params.lang}/admin/client-concern/list/create`
                     );
                  }}
               >
                  + Add Client Concern
               </Button>
            </div>
         </div>

         <Form colon={false} layout='vertical'>
            <Form.Item className='w-[200px]'>
               <Select
                  allowClear
                  showSearch
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className='form-dropdown'
                  filterOption={(input, option) =>
                     (option?.label?.toLowerCase() ?? '').includes(
                        input.toLowerCase()
                     )
                  }
                  loading={isCategoryLoading}
                  options={clientConcernCategories?.result?.map((category) => ({
                     value: category.id,
                     label: category?.[
                        `title_${capitalize(params.lang) as 'En' | 'Np'}`
                     ],
                  }))}
                  placeholder='Filter by Category'
                  onChange={(clientConcernCategoryId) => {
                     setConfig((prev) => ({
                        ...prev,
                        clientConcernCategoryId,
                     }));
                  }}
               />
            </Form.Item>
         </Form>

         {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
            <Tabs
               items={superAdminTabItems}
               onTabClick={(key) => {
                  setConfig((prev) => ({
                     ...prev,
                     status: key as CLIENT_CONCERN_STATUS,
                  }));
               }}
            />
         ) : (
            <Tabs items={tabItems} />
         )}
      </Fragment>
   );
};

export default withPrivilege(ClientConcerns, PRIVILEGE_NAME.CLIENT_CONCERN);
