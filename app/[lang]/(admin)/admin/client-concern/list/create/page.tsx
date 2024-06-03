'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select } from 'antd';
import { capitalize } from 'lodash';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { withPrivilege } from '@/auth';
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
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type ClientConcern } from '@/models/admin/client-concern';
import { type ClientConcernCategory } from '@/models/admin/client-concern-category';
import { type Locale } from '@/i18n';

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      slug?: string;
   };
};

const CreateClientConcern: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const slug = searchParams.slug;

   const [form] = Form.useForm<
      ClientConcern & { clientConcernCategoryIds: number[] }
   >();

   const [categoryForm] = Form.useForm();

   const queryClient = useQueryClient();

   const { data: clientConcern } = useQuery({
      queryFn: () =>
         slug ? clientConcernApi[getRole()]?.getClientConcern(slug) : null,
      queryKey: queryKeys(CLIENT_CONCERN).detail(slug as string),
      enabled: Boolean(slug),
   });

   const { data: clientConcernCategories, isLoading } = useQuery({
      queryFn: () =>
         clientConcernCategoryApi[getRole()]?.getClientConcernCategories({
            pagination: false,
            sort: 'updatedAt',
            order: 'DESC',
         }),
      queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).list({
         pagination: false,
         sort: 'updatedAt',
         order: 'DESC',
      }),
   });

   useEffect(() => {
      if (clientConcern) {
         form.setFieldsValue({
            ...clientConcern,
            clientConcernCategoryIds:
               clientConcern?.clientConcernCategories?.map(({ id }) => id),
         });
      }
   }, [clientConcern]);

   const handleCreateClientConcern = useMutation(
      clientConcernApi[getRole()]?.createClientConcern,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(CLIENT_CONCERN).all);
            router.push(`/${params.lang}/admin/client-concern/list`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateClientConcern = useMutation(
      clientConcernApi[getRole()]?.updateClientConcern,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(CLIENT_CONCERN).all);
            router.push(`/${params.lang}/admin/client-concern/list`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleCreateClientConcernCategory = useMutation(
      clientConcernCategoryApi[getRole()]?.createClientConcernCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            categoryForm.resetFields();
            await queryClient.refetchQueries(
               queryKeys(CLIENT_CONCERN_CATEGORY).all
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleFormSubmit = async (values: ClientConcern) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as ClientConcern;

      slug
         ? handleUpdateClientConcern.mutate({
              ...data,
              slug,
           })
         : handleCreateClientConcern.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'client-concern/list' },
               {
                  title: slug ? 'Update Client Concern' : 'Create New',
               },
            ]}
         />

         <Form
            className='rounded-[10px] bg-white !py-[20px] px-[25px]'
            colon={false}
            form={form}
            layout='vertical'
            scrollToFirstError
            onFinish={handleFormSubmit}
         >
            <Form.Item
               label='Client Concern Category:'
               name='clientConcernCategoryIds'
               rules={[
                  {
                     required: true,
                     message: 'Client concern category is required',
                  },
               ]}
            >
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
                  getPopupContainer={() =>
                     document.getElementById('admin') as HTMLElement
                  }
                  loading={isLoading}
                  mode='multiple'
                  options={clientConcernCategories?.result?.map((category) => ({
                     value: category.id,
                     label: category?.[
                        `title_${capitalize(params.lang) as 'En' | 'Np'}`
                     ],
                  }))}
                  placeholder='Select client concern category'
                  dropdownRender={(menu) => (
                     <Fragment>
                        <Form
                           className='mt-[10px] px-[10px] py-[20px]'
                           colon={false}
                           form={categoryForm}
                           layout='vertical'
                           onFinish={(values: ClientConcernCategory) => {
                              const data = Object.fromEntries(
                                 Object.entries(values).filter(
                                    ([_, v]) => v !== null
                                 )
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

                              <Form.Item
                                 label='Title (Nepali):'
                                 name='title_Np'
                              >
                                 <Input placeholder='Title (Nepali)' />
                              </Form.Item>
                           </div>

                           <Form.Item>
                              <Button
                                 className='admin-primary-btn'
                                 htmlType='submit'
                                 type='primary'
                                 loading={
                                    handleCreateClientConcernCategory.isLoading
                                 }
                              >
                                 + Add new Category
                              </Button>
                           </Form.Item>
                        </Form>

                        {menu}
                     </Fragment>
                  )}
               />
            </Form.Item>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item
                  label='Question:'
                  name='question_En'
                  rules={[
                     {
                        required: true,
                        message: 'Question is required',
                     },
                  ]}
               >
                  <Input.TextArea placeholder='Enter Qestion' />
               </Form.Item>

               <Form.Item label='Question (Nepali):' name='question_Np'>
                  <Input.TextArea placeholder='Enter question (Nepali)' />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Answer:' name='answer_En'>
                  <Editor
                     initialValue={clientConcern?.answer_En}
                     setValue={(value) => {
                        form.setFieldsValue({ answer_En: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>

               <Form.Item label='Answer (Nepali):' name='answer_Np'>
                  <Editor
                     initialValue={clientConcern?.answer_Np}
                     setValue={(value) => {
                        form.setFieldsValue({ answer_Np: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>
            </div>

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  htmlType='submit'
                  type='primary'
                  loading={
                     slug
                        ? handleUpdateClientConcern.isLoading
                        : handleCreateClientConcern.isLoading
                  }
               >
                  Submit
               </Button>
            </Form.Item>
         </Form>
      </Fragment>
   );
};

export default withPrivilege(
   CreateClientConcern,
   PRIVILEGE_NAME.CLIENT_CONCERN
);
