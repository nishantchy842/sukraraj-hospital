'use client';

import { Fragment, useState, type Key, useEffect } from 'react';
import { Button, Form, Input, Popover, Table } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capitalize } from 'lodash';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { getColumnSearchProps } from '@/app/[lang]/(admin)/admin/common/';
import { clientConcernCategoryApi } from '@/api/admin/client-concern-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { CLIENT_CONCERN_CATEGORY } from '@/constants/admin/queryKeys';
import { CLIENT_CONCERN_CATEGORY_STATUS } from '@/enums/client-concern-category';
import { type Locale } from '@/i18n';
import { type ClientConcernCategory } from '@/models/admin/client-concern-category';

type Props = {
   params: {
      lang: Locale;
   };
};

const initialConfig = {
   pagination: true,
   page: 1,
   size: 10,
   title: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as 'ASC' | 'DESC',
   status: undefined,
};

const ClientCategories: React.FC<Props> = ({ params }) => {
   const queryClient = useQueryClient();

   const [form] = Form.useForm();

   const [isPopupOpen, setIsPopupOpen] = useState(new Map());

   const [config, setConfig] = useState(initialConfig);

   const { data: clientConcernCategories, isLoading } = useQuery({
      queryFn: () =>
         clientConcernCategoryApi[getRole()]?.getClientConcernCategories(
            config
         ),
      queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).list(config),
   });

   const handleCreateClientConcernCategory = useMutation(
      clientConcernCategoryApi[getRole()]?.createClientConcernCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(
               queryKeys(CLIENT_CONCERN_CATEGORY).all
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateClientConcernCategory = useMutation(
      clientConcernCategoryApi[getRole()]?.updateClientConcernCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(
               queryKeys(CLIENT_CONCERN_CATEGORY).all
            );
            setIsPopupOpen(
               (prev) =>
                  new Map(
                     prev.set(
                        handleUpdateClientConcernCategory.variables?.id,
                        false
                     )
                  )
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleArchiveClientConcernCategory = useMutation(
      (slug: ClientConcernCategory['slug']) =>
         clientConcernCategoryApi[getRole()]?.updateClientConcernCategory({
            slug,
            status: CLIENT_CONCERN_CATEGORY_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(
               queryKeys(CLIENT_CONCERN_CATEGORY).all
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveClientConcernCategory = useMutation(
      (slug: ClientConcernCategory['slug']) =>
         clientConcernCategoryApi.SUPER_ADMIN.updateClientConcernCategory({
            slug,
            status: CLIENT_CONCERN_CATEGORY_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(
               queryKeys(CLIENT_CONCERN_CATEGORY).all
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   useEffect(() => {
      if (clientConcernCategories) {
         const popupState = new Map();
         clientConcernCategories?.result?.forEach((category) =>
            popupState.set(category.id, false)
         );
         setIsPopupOpen(popupState);
      }
   }, [clientConcernCategories]);

   const column = [
      {
         key: 'index',
         title: 'S.N.',
         render: (_: string, __: ClientConcernCategory, index: number) =>
            (config.page - 1) * config.size + (index + 1),
         width: '10%',
      },
      {
         key: 'title',
         title: 'Title',
         render: (_: string, record: ClientConcernCategory) => (
            <span>
               {record?.[`title_${capitalize(params.lang) as 'En' | 'Np'}`]}
            </span>
         ),
         width: '65%',
         ...getColumnSearchProps('title', (title) => {
            setConfig((prev) => ({ ...prev, page: 1, title }));
         }),
      },
      {
         key: 'action',
         title: 'Action',
         render: (_: string, record: ClientConcernCategory) => (
            <div className='flex gap-[15px] [&>*]:cursor-pointer [&>*]:text-[13px] [&>*]:font-[400] [&>*]:leading-[19px]'>
               <Popover
                  content={
                     <Form
                        className='w-[300px]'
                        colon={false}
                        initialValues={{
                           title_En: record.title_En,
                           title_Np: record.title_Np,
                        }}
                        layout='vertical'
                        onFinish={(values: ClientConcernCategory) => {
                           const data = Object.fromEntries(
                              Object.entries(values).filter(
                                 ([_, v]) => v !== null
                              )
                           ) as ClientConcernCategory;

                           handleUpdateClientConcernCategory.mutate({
                              ...data,
                              slug: record.slug,
                           });
                        }}
                     >
                        <Form.Item
                           label='Title:'
                           name='title_En'
                           rules={[
                              {
                                 required: true,
                                 message: 'Title is required',
                              },
                           ]}
                        >
                           <Input placeholder='Title' />
                        </Form.Item>

                        <Form.Item label='Title (Nepali):' name='title_Np'>
                           <Input placeholder='Title (Nepali)' />
                        </Form.Item>

                        <Form.Item>
                           <Button
                              className='admin-primary-btn !w-full'
                              htmlType='submit'
                              type='primary'
                              loading={
                                 handleUpdateClientConcernCategory.isLoading
                              }
                           >
                              Submit
                           </Button>
                        </Form.Item>
                     </Form>
                  }
                  open={isPopupOpen.get(record.id)}
                  trigger='click'
                  getPopupContainer={() =>
                     document.getElementById('admin') as HTMLElement
                  }
                  onOpenChange={(isOpen) => {
                     setIsPopupOpen(
                        (prev) => new Map(prev.set(record.id, isOpen))
                     );
                  }}
               >
                  <span
                     className='cursor-pointer !text-[16px] !font-[500] !leading-[30px] text-[#FF9901] underline'
                     onClick={() => {
                        setIsPopupOpen(
                           (prev) => new Map(prev.set(record.id, true))
                        );
                     }}
                  >
                     Edit category
                  </span>
               </Popover>

               <span
                  className={`cursor-pointer !text-[16px] !font-[500] !leading-[30px] underline ${record?.status === CLIENT_CONCERN_CATEGORY_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     record?.status === CLIENT_CONCERN_CATEGORY_STATUS.ACTIVE
                        ? handleArchiveClientConcernCategory.mutate(
                             record?.slug
                          )
                        : handleUnarchiveClientConcernCategory.mutate(
                             record?.slug
                          );
                  }}
               >
                  {record?.status === CLIENT_CONCERN_CATEGORY_STATUS.ACTIVE
                     ? 'Archive'
                     : 'Active'}
               </span>
            </div>
         ),
      },
   ];

   return (
      <Fragment>
         <Breadcrumb items={[{ path: 'client-concern/categories' }, {}]} />

         <div className='flex flex-col gap-[20px] rounded-[10px] bg-white p-[20px]'>
            <Form
               colon={false}
               form={form}
               layout='vertical'
               onFinish={(values: ClientConcernCategory) => {
                  const data = Object.fromEntries(
                     Object.entries(values).filter(([_, v]) => v !== null)
                  ) as ClientConcernCategory;

                  handleCreateClientConcernCategory.mutate(data);
               }}
            >
               <div className='grid grid-cols-2 gap-x-[30px]'>
                  <Form.Item
                     label='Title:'
                     name='title_En'
                     rules={[
                        {
                           required: true,
                           message: 'Title is required',
                        },
                     ]}
                  >
                     <Input placeholder='Title' />
                  </Form.Item>

                  <Form.Item label='Title (Nepali):' name='title_Np'>
                     <Input placeholder='Title (Nepali)' />
                  </Form.Item>
               </div>

               <Form.Item>
                  <Button
                     className='admin-primary-btn'
                     htmlType='submit'
                     type='primary'
                     loading={handleCreateClientConcernCategory.isLoading}
                  >
                     Submit
                  </Button>
               </Form.Item>
            </Form>
         </div>

         <div className='rounded-[10px] bg-white p-[20px]'>
            <Table<ClientConcernCategory>
               columns={column}
               dataSource={clientConcernCategories?.result}
               loading={isLoading}
               pagination={{
                  current: config.page,
                  pageSize: config.size,
                  total: clientConcernCategories?.count,
                  onChange: (page) => {
                     setConfig((prev) => ({ ...prev, page }));
                  },
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

export default ClientCategories;
