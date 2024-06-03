'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, Upload, type UploadFile } from 'antd';
import { capitalize } from 'lodash';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { withPrivilege } from '@/auth';
import { resourceApi } from '@/api/admin/resource';
import { resourceCategoryApi } from '@/api/admin/resource-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { RESOURCE, RESOURCE_CATEGORY } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Resource } from '@/models/admin/resource';
import { type Locale } from '@/i18n';
import { type ResourceCategory } from '@/models/admin/resource-category';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      slug?: string;
      resourceCategoryId?: string;
   };
};

const CreateResource: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const resourceCategoryId = searchParams.resourceCategoryId;

   const slug = searchParams.slug;

   const [form] = Form.useForm<Resource & { resourceCategoryId: number }>();

   const [categoryForm] = Form.useForm();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [previewFileList, setPreviewFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const [downloadFileList, setDownloadFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: resource } = useQuery({
      queryFn: () => (slug ? resourceApi[getRole()]?.getResource(slug) : null),
      queryKey: queryKeys(RESOURCE).detail(slug as string),
      enabled: Boolean(slug),
   });

   const { data: resourceCategories, isLoading } = useQuery({
      queryFn: () =>
         resourceCategoryApi[getRole()]?.getResourceCategories({
            pagination: false,
            sort: 'updatedAt',
            order: 'DESC',
         }),
      queryKey: queryKeys(RESOURCE_CATEGORY).list({
         pagination: false,
         sort: 'updatedAt',
         order: 'DESC',
      }),
   });

   useEffect(() => {
      if (resource) {
         form.setFieldsValue({
            ...resource,
            resourceCategoryId: resource?.resourceCategory?.id,
         });

         if (resource?.previewImage)
            setPreviewFileList([
               {
                  uid: '1',
                  name: resource?.previewImage,
                  status: 'done',
                  url: BASE_IMAGE_PATH + resource?.previewImage,
               },
            ]);

         if (resource?.downloadFile)
            setDownloadFileList([
               {
                  uid: '1',
                  name: resource?.downloadFile,
                  status: 'done',
                  url: BASE_IMAGE_PATH + resource?.downloadFile,
               },
            ]);
      }

      if (resourceCategoryId) {
         form.setFieldsValue({
            resourceCategoryId: Number(resourceCategoryId),
         });
      }
   }, [resource]);

   const handleCreateResource = useMutation(
      resourceApi[getRole()]?.createResource,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(RESOURCE).all);
            router.push(`/${params.lang}/admin/downloads/list`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateResource = useMutation(
      resourceApi[getRole()]?.updateResource,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(RESOURCE).all);
            router.push(`/${params.lang}/admin/downloads/list`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleCreateResourceCategory = useMutation(
      resourceCategoryApi[getRole()]?.createResourceCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            categoryForm.resetFields();
            await queryClient.refetchQueries(queryKeys(RESOURCE_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleFormSubmit = async (values: Resource) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as Resource;

      slug
         ? handleUpdateResource.mutate({
              ...data,
              slug,
           })
         : handleCreateResource.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'downloads/list' },
               {
                  title: slug ? 'Update Download' : 'Create New',
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
                  <Input placeholder='Enter title' />
               </Form.Item>

               <Form.Item label='Title (Nepali):' name='title_Np'>
                  <Input placeholder='Enter title (Nepali)' />
               </Form.Item>
            </div>

            <Form.Item
               label='Resource Category:'
               name='resourceCategoryId'
               rules={[
                  { required: true, message: 'Resource category is required' },
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
                  options={resourceCategories?.result?.map((category) => ({
                     value: category.id,
                     label: category?.[
                        `title_${capitalize(params.lang) as 'En' | 'Np'}`
                     ],
                  }))}
                  placeholder='Select resource category'
                  dropdownRender={(menu) => (
                     <Fragment>
                        <Form
                           className='mt-[10px] px-[10px] py-[20px]'
                           colon={false}
                           form={categoryForm}
                           layout='vertical'
                           onFinish={(values: ResourceCategory) => {
                              const data = Object.fromEntries(
                                 Object.entries(values).filter(
                                    ([_, v]) => v !== null
                                 )
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
                                    handleCreateResourceCategory.isLoading
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

            <Form.Item
               className='col-span-full'
               label='Preview Image: (Maximum Dimension: 700 * 500 | Image ratio: 7:5)'
               name='previewImage'
            >
               <Dragger
                  {...uploadProps('image', getRole())}
                  fileList={previewFileList}
                  listType='picture-card'
                  maxCount={1}
                  multiple={false}
                  onChange={({ file, fileList }) => {
                     setPreviewFileList(() =>
                        file.status === 'error'
                           ? fileList.filter((f) => f.uid !== file.uid)
                           : fileList
                     );
                  }}
                  onPreview={handlePreview}
               >
                  <div className='flex size-full flex-col items-center py-[40px]'>
                     {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                     <div className='ant-upload-drag-icon'>
                        <Image alt='upload-image' src={UPLOAD_IMAGE} fill />
                     </div>

                     {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                     <p className='ant-upload-text'>
                        Select an image to upload
                     </p>

                     {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                     <p className='ant-upload-hint'>or drag and drop it here</p>
                  </div>
               </Dragger>
            </Form.Item>

            <Form.Item
               className='col-span-full'
               label='Download File: (Maximum Dimension: 700 * 500 | Image ratio: 7:5)'
               name='downloadFile'
            >
               <Dragger
                  {...uploadProps('file', getRole())}
                  fileList={downloadFileList}
                  listType='picture-card'
                  maxCount={1}
                  multiple={false}
                  onChange={({ file, fileList }) => {
                     setDownloadFileList(() =>
                        file.status === 'error'
                           ? fileList.filter((f) => f.uid !== file.uid)
                           : fileList
                     );
                  }}
                  onPreview={handlePreview}
               >
                  <div className='flex size-full flex-col items-center py-[40px]'>
                     {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                     <div className='ant-upload-drag-icon'>
                        <Image alt='upload-image' src={UPLOAD_IMAGE} fill />
                     </div>

                     {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                     <p className='ant-upload-text'>
                        Select an image to upload
                     </p>

                     {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                     <p className='ant-upload-hint'>or drag and drop it here</p>
                  </div>
               </Dragger>
            </Form.Item>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Content:' name='content_En'>
                  <Editor
                     initialValue={resource?.content_En}
                     setValue={(value) => {
                        form.setFieldsValue({ content_En: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>

               <Form.Item label='Content (Nepali):' name='content_Np'>
                  <Editor
                     initialValue={resource?.content_Np}
                     setValue={(value) => {
                        form.setFieldsValue({ content_Np: value });
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
                     previewFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) ||
                     downloadFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) ||
                     (slug
                        ? handleUpdateResource.isLoading
                        : handleCreateResource.isLoading)
                  }
                  onClick={async () => {
                     form.setFieldsValue({
                        previewImage:
                           previewFileList?.[0]?.response?.data?.path ??
                           previewFileList?.[0]?.name,
                        downloadFile:
                           downloadFileList?.[0]?.response?.data?.path ??
                           downloadFileList?.[0]?.name,
                     });
                  }}
               >
                  Submit
               </Button>
            </Form.Item>
         </Form>

         <Preview />
      </Fragment>
   );
};

export default withPrivilege(CreateResource, PRIVILEGE_NAME.RESOURCE);
