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
import { withPrivilege } from '@/auth';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { researchApi } from '@/api/admin/research';
import { researchCategoryApi } from '@/api/admin/research-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { RESEARCH, RESEARCH_CATEGORY } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Research } from '@/models/admin/research';
import { type Locale } from '@/i18n';
import { type ResearchCategory } from '@/models/admin/research-category';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      slug?: string;
      researchCategoryId?: string;
   };
};

const CreateResearch: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const researchCategoryId = searchParams.researchCategoryId;

   const slug = searchParams.slug;

   const [form] = Form.useForm<Research & { researchCategoryId: number }>();

   const [categoryForm] = Form.useForm();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [previewFileList, setPreviewFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const [downloadFileList, setDownloadFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: research } = useQuery({
      queryFn: () => (slug ? researchApi[getRole()]?.getResearch(slug) : null),
      queryKey: queryKeys(RESEARCH).detail(slug as string),
      enabled: Boolean(slug),
   });

   const { data: researchCategories, isLoading } = useQuery({
      queryFn: () =>
         researchCategoryApi[getRole()]?.getResearchCategories({
            pagination: false,
            sort: 'updatedAt',
            order: 'DESC',
         }),
      queryKey: queryKeys(RESEARCH_CATEGORY).list({
         pagination: false,
         sort: 'updatedAt',
         order: 'DESC',
      }),
   });

   useEffect(() => {
      if (research) {
         form.setFieldsValue({
            ...research,
            researchCategoryId: research?.researchCategory?.id,
         });

         if (research?.previewImage)
            setPreviewFileList([
               {
                  uid: '1',
                  name: research?.previewImage,
                  status: 'done',
                  url: BASE_IMAGE_PATH + research?.previewImage,
               },
            ]);

         if (research?.downloadFile)
            setDownloadFileList([
               {
                  uid: '1',
                  name: research?.downloadFile,
                  status: 'done',
                  url: BASE_IMAGE_PATH + research?.downloadFile,
               },
            ]);
      }

      if (researchCategoryId) {
         form.setFieldsValue({
            researchCategoryId: Number(researchCategoryId),
         });
      }
   }, [research]);

   const handleCreateResearch = useMutation(
      researchApi[getRole()]?.createResearch,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(RESEARCH).all);
            router.push(`/${params.lang}/admin/research/list`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateResearch = useMutation(
      researchApi[getRole()]?.updateResearch,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(RESEARCH).all);
            router.push(`/${params.lang}/admin/research/list`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleCreateResearchCategory = useMutation(
      researchCategoryApi[getRole()]?.createResearchCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            categoryForm.resetFields();
            await queryClient.refetchQueries(queryKeys(RESEARCH_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleFormSubmit = async (values: Research) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as Research;

      slug
         ? handleUpdateResearch.mutate({
              ...data,
              slug,
           })
         : handleCreateResearch.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'research/list' },
               {
                  title: slug ? 'Update Research' : 'Create New',
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
               label='Research Category:'
               name='researchCategoryId'
               rules={[
                  { required: true, message: 'Research category is required' },
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
                  options={researchCategories?.result?.map((category) => ({
                     value: category.id,
                     label: category?.[
                        `title_${capitalize(params.lang) as 'En' | 'Np'}`
                     ],
                  }))}
                  placeholder='Select research category'
                  dropdownRender={(menu) => (
                     <Fragment>
                        <Form
                           className='mt-[10px] px-[10px] py-[20px]'
                           colon={false}
                           form={categoryForm}
                           layout='vertical'
                           onFinish={(values: ResearchCategory) => {
                              const data = Object.fromEntries(
                                 Object.entries(values).filter(
                                    ([_, v]) => v !== null
                                 )
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
                                    handleCreateResearchCategory.isLoading
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
                     initialValue={research?.content_En}
                     setValue={(value) => {
                        form.setFieldsValue({ content_En: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>

               <Form.Item label='Content (Nepali):' name='content_Np'>
                  <Editor
                     initialValue={research?.content_Np}
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
                        ? handleUpdateResearch.isLoading
                        : handleCreateResearch.isLoading)
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

export default withPrivilege(CreateResearch, PRIVILEGE_NAME.RESEARCH);
