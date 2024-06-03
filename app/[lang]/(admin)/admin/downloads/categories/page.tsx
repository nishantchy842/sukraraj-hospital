'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key, useEffect } from 'react';
import { Button, Form, Input, Popover, Table } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capitalize } from 'lodash';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { getColumnSearchProps } from '@/app/[lang]/(admin)/admin/common/';
import { resourceCategoryApi } from '@/api/admin/resource-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { RESOURCE_CATEGORY } from '@/constants/admin/queryKeys';
import { RESOURCE_CATEGORY_STATUS } from '@/enums/resource-category';
import { type Locale } from '@/i18n';
import { type ResourceCategory } from '@/models/admin/resource-category';

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

const ResourceCategories: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const [form] = Form.useForm();

   const [isPopupOpen, setIsPopupOpen] = useState(new Map());

   const [config, setConfig] = useState(initialConfig);

   const { data: resourceCategories, isLoading } = useQuery({
      queryFn: () =>
         resourceCategoryApi[getRole()]?.getResourceCategories(config),
      queryKey: queryKeys(RESOURCE_CATEGORY).list(config),
   });

   const handleCreateResourceCategory = useMutation(
      resourceCategoryApi[getRole()]?.createResourceCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(RESOURCE_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateResourceCategory = useMutation(
      resourceCategoryApi[getRole()]?.updateResourceCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESOURCE_CATEGORY).all);
            setIsPopupOpen(
               (prev) =>
                  new Map(
                     prev.set(handleUpdateResourceCategory.variables?.id, false)
                  )
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleArchiveResourceCategory = useMutation(
      (slug: ResourceCategory['slug']) =>
         resourceCategoryApi[getRole()]?.updateResourceCategory({
            slug,
            status: RESOURCE_CATEGORY_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESOURCE_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveResourceCategory = useMutation(
      (slug: ResourceCategory['slug']) =>
         resourceCategoryApi.SUPER_ADMIN.updateResourceCategory({
            slug,
            status: RESOURCE_CATEGORY_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESOURCE_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   useEffect(() => {
      if (resourceCategories) {
         const popupState = new Map();
         resourceCategories?.result?.forEach((category) =>
            popupState.set(category.id, false)
         );
         setIsPopupOpen(popupState);
      }
   }, [resourceCategories]);

   const column = [
      {
         key: 'index',
         title: 'S.N.',
         render: (_: string, __: ResourceCategory, index: number) =>
            (config.page - 1) * config.size + (index + 1),
         width: '10%',
      },
      {
         key: 'title',
         title: 'Title',
         render: (_: string, record: ResourceCategory) => (
            <span>
               {record?.[`title_${capitalize(params.lang) as 'En' | 'Np'}`]}
            </span>
         ),
         width: '60%',
         ...getColumnSearchProps('title', (title) => {
            setConfig((prev) => ({ ...prev, page: 1, title }));
         }),
      },
      {
         key: 'action',
         title: 'Action',
         render: (_: string, record: ResourceCategory) => (
            <div className='flex gap-[15px] [&>*]:cursor-pointer [&>*]:text-[13px] [&>*]:font-[400] [&>*]:leading-[19px]'>
               <span
                  className='cursor-pointer !text-[16px] !font-[500] !leading-[30px] text-[#0C62BB] underline'
                  onClick={() => {
                     router.push(
                        `/${params.lang}/admin/downloads/list/create?resourceCategoryId=${record?.id}`
                     );
                  }}
               >
                  Add to category
               </span>

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
                        onFinish={(values: ResourceCategory) => {
                           const data = Object.fromEntries(
                              Object.entries(values).filter(
                                 ([_, v]) => v !== null
                              )
                           ) as ResourceCategory;

                           handleUpdateResourceCategory.mutate({
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
                              loading={handleUpdateResourceCategory.isLoading}
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
                  className={`cursor-pointer !text-[16px] !font-[500] !leading-[30px] underline ${record?.status === RESOURCE_CATEGORY_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     record?.status === RESOURCE_CATEGORY_STATUS.ACTIVE
                        ? handleArchiveResourceCategory.mutate(record?.slug)
                        : handleUnarchiveResourceCategory.mutate(record?.slug);
                  }}
               >
                  {record?.status === RESOURCE_CATEGORY_STATUS.ACTIVE
                     ? 'Archive'
                     : 'Active'}
               </span>
            </div>
         ),
      },
   ];

   return (
      <Fragment>
         <Breadcrumb items={[{ path: 'downloads/categories' }, {}]} />

         <div className='flex flex-col gap-[20px] rounded-[10px] bg-white p-[20px]'>
            <Form
               colon={false}
               form={form}
               layout='vertical'
               onFinish={(values: ResourceCategory) => {
                  const data = Object.fromEntries(
                     Object.entries(values).filter(([_, v]) => v !== null)
                  ) as ResourceCategory;

                  handleCreateResourceCategory.mutate(data);
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
                     loading={handleCreateResourceCategory.isLoading}
                  >
                     Submit
                  </Button>
               </Form.Item>
            </Form>
         </div>

         <div className='rounded-[10px] bg-white p-[20px]'>
            <Table<ResourceCategory>
               columns={column}
               dataSource={resourceCategories?.result}
               loading={isLoading}
               pagination={{
                  current: config.page,
                  pageSize: config.size,
                  total: resourceCategories?.count,
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

export default ResourceCategories;
