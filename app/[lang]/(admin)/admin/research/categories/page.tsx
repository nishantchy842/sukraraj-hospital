'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key, useEffect } from 'react';
import { Button, Form, Input, Popover, Table } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { capitalize } from 'lodash';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { getColumnSearchProps } from '@/app/[lang]/(admin)/admin/common/';
import { researchCategoryApi } from '@/api/admin/research-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { RESEARCH_CATEGORY } from '@/constants/admin/queryKeys';
import { RESEARCH_CATEGORY_STATUS } from '@/enums/research-category';
import { type Locale } from '@/i18n';
import { type ResearchCategory } from '@/models/admin/research-category';

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

const ResearchCategories: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const [form] = Form.useForm();

   const [isPopupOpen, setIsPopupOpen] = useState(new Map());

   const [config, setConfig] = useState(initialConfig);

   const { data: researchCategories, isLoading } = useQuery({
      queryFn: () =>
         researchCategoryApi[getRole()]?.getResearchCategories(config),
      queryKey: queryKeys(RESEARCH_CATEGORY).list(config),
   });

   const handleCreateResearchCategory = useMutation(
      researchCategoryApi[getRole()]?.createResearchCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(RESEARCH_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateResearchCategory = useMutation(
      researchCategoryApi[getRole()]?.updateResearchCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESEARCH_CATEGORY).all);
            setIsPopupOpen(
               (prev) =>
                  new Map(
                     prev.set(handleUpdateResearchCategory.variables?.id, false)
                  )
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleArchiveResearchCategory = useMutation(
      (slug: ResearchCategory['slug']) =>
         researchCategoryApi[getRole()]?.updateResearchCategory({
            slug,
            status: RESEARCH_CATEGORY_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESEARCH_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveResearchCategory = useMutation(
      (slug: ResearchCategory['slug']) =>
         researchCategoryApi.SUPER_ADMIN.updateResearchCategory({
            slug,
            status: RESEARCH_CATEGORY_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESEARCH_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   useEffect(() => {
      if (researchCategories) {
         const popupState = new Map();
         researchCategories?.result?.forEach((category) =>
            popupState.set(category.id, false)
         );
         setIsPopupOpen(popupState);
      }
   }, [researchCategories]);

   const column = [
      {
         key: 'index',
         title: 'S.N.',
         render: (_: string, __: ResearchCategory, index: number) =>
            (config.page - 1) * config.size + (index + 1),
         width: '10%',
      },
      {
         key: 'title',
         title: 'Title',
         render: (_: string, record: ResearchCategory) => (
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
         render: (_: string, record: ResearchCategory) => (
            <div className='flex gap-[15px] [&>*]:cursor-pointer [&>*]:text-[13px] [&>*]:font-[400] [&>*]:leading-[19px]'>
               <span
                  className='cursor-pointer !text-[16px] !font-[500] !leading-[30px] text-[#0C62BB] underline'
                  onClick={() => {
                     router.push(
                        `/${params.lang}/admin/research/list/create?researchCategoryId=${record?.id}`
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
                        onFinish={(values: ResearchCategory) => {
                           const data = Object.fromEntries(
                              Object.entries(values).filter(
                                 ([_, v]) => v !== null
                              )
                           ) as ResearchCategory;

                           handleUpdateResearchCategory.mutate({
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
                              loading={handleUpdateResearchCategory.isLoading}
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
                  className={`cursor-pointer !text-[16px] !font-[500] !leading-[30px] underline ${record?.status === RESEARCH_CATEGORY_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     record?.status === RESEARCH_CATEGORY_STATUS.ACTIVE
                        ? handleArchiveResearchCategory.mutate(record?.slug)
                        : handleUnarchiveResearchCategory.mutate(record?.slug);
                  }}
               >
                  {record?.status === RESEARCH_CATEGORY_STATUS.ACTIVE
                     ? 'Archive'
                     : 'Active'}
               </span>
            </div>
         ),
      },
   ];

   return (
      <Fragment>
         <Breadcrumb items={[{ path: 'research/categories' }, {}]} />

         <div className='flex flex-col gap-[20px] rounded-[10px] bg-white p-[20px]'>
            <Form
               colon={false}
               form={form}
               layout='vertical'
               onFinish={(values: ResearchCategory) => {
                  const data = Object.fromEntries(
                     Object.entries(values).filter(([_, v]) => v !== null)
                  ) as ResearchCategory;

                  handleCreateResearchCategory.mutate(data);
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
                     loading={handleCreateResearchCategory.isLoading}
                  >
                     Submit
                  </Button>
               </Form.Item>
            </Form>
         </div>

         <div className='rounded-[10px] bg-white p-[20px]'>
            <Table<ResearchCategory>
               columns={column}
               dataSource={researchCategories?.result}
               loading={isLoading}
               pagination={{
                  current: config.page,
                  pageSize: config.size,
                  total: researchCategories?.count,
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

export default ResearchCategories;
