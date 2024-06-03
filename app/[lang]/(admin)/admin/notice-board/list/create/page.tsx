'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Button,
   ConfigProvider,
   DatePicker,
   Form,
   Input,
   Select,
   Switch,
   Upload,
   type UploadFile,
} from 'antd';
import { capitalize } from 'lodash';
import dayjs from 'dayjs';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { noticeApi } from '@/api/admin/notice';
import { withPrivilege } from '@/auth';
import { noticeCategoryApi } from '@/api/admin/notice-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { NOTICE, NOTICE_CATEGORY } from '@/constants/admin/queryKeys';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { type Notice } from '@/models/admin/notice';
import { type Locale } from '@/i18n';
import { type NoticeCategory } from '@/models/admin/notice-category';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      slug?: string;
      noticeCategoryId?: string;
   };
};

const CreateNotice: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const noticeCategoryId = searchParams.noticeCategoryId;

   const slug = searchParams.slug;

   const [form] = Form.useForm<Notice & { noticeCategoryId: number }>();

   const [categoryForm] = Form.useForm();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [previewFileList, setPreviewFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const [downloadFileList, setDownloadFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: notice } = useQuery({
      queryFn: () => (slug ? noticeApi[getRole()]?.getNotice(slug) : null),
      queryKey: queryKeys(NOTICE).detail(slug as string),
      enabled: Boolean(slug),
   });

   const { data: noticeCategories, isLoading } = useQuery({
      queryFn: () =>
         noticeCategoryApi[getRole()]?.getNoticeCategories({
            pagination: false,
            sort: 'updatedAt',
            order: 'DESC',
         }),
      queryKey: queryKeys(NOTICE_CATEGORY).list({
         pagination: false,
         sort: 'updatedAt',
         order: 'DESC',
      }),
   });

   useEffect(() => {
      if (notice) {
         form.setFieldsValue({
            ...notice,
            date: notice?.date ? dayjs(notice?.date) : undefined,
            noticeCategoryId: notice?.noticeCategory?.id,
         });

         if (notice?.previewImage)
            setPreviewFileList([
               {
                  uid: '1',
                  name: notice?.previewImage,
                  status: 'done',
                  url: BASE_IMAGE_PATH + notice?.previewImage,
               },
            ]);

         if (notice?.downloadFile)
            setDownloadFileList([
               {
                  uid: '1',
                  name: notice?.downloadFile,
                  status: 'done',
                  url: BASE_IMAGE_PATH + notice?.downloadFile,
               },
            ]);
      }

      if (noticeCategoryId) {
         form.setFieldsValue({ noticeCategoryId: Number(noticeCategoryId) });
      }
   }, [notice]);

   const handleCreateNotice = useMutation(noticeApi[getRole()]?.createNotice, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(NOTICE).all);
         router.push(`/${params.lang}/admin/notice-board/list`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleUpdateNotice = useMutation(noticeApi[getRole()]?.updateNotice, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(NOTICE).all);
         router.push(`/${params.lang}/admin/notice-board/list`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleCreateNoticeCategory = useMutation(
      noticeCategoryApi[getRole()]?.createNoticeCategory,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            categoryForm.resetFields();
            await queryClient.refetchQueries(queryKeys(NOTICE_CATEGORY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleFormSubmit = async (values: Notice) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as Notice;

      slug
         ? handleUpdateNotice.mutate({
              ...data,
              slug,
           })
         : handleCreateNotice.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'notice-board/list' },
               {
                  title: slug ? 'Update Notice' : 'Create New',
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

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item
                  label='Notice Category:'
                  name='noticeCategoryId'
                  rules={[
                     { required: true, message: 'Notice category is required' },
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
                     options={noticeCategories?.result?.map((category) => ({
                        value: category.id,
                        label: category?.[
                           `title_${capitalize(params.lang) as 'En' | 'Np'}`
                        ],
                     }))}
                     placeholder='Select notice category'
                     dropdownRender={(menu) => (
                        <Fragment>
                           <Form
                              className='mt-[10px] px-[10px] py-[20px]'
                              colon={false}
                              form={categoryForm}
                              layout='vertical'
                              onFinish={(values: NoticeCategory) => {
                                 const data = Object.fromEntries(
                                    Object.entries(values).filter(
                                       ([_, v]) => v !== null
                                    )
                                 ) as NoticeCategory;

                                 handleCreateNoticeCategory.mutate(data);
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
                                       handleCreateNoticeCategory.isLoading
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
                  name='date'
                  label='Date:'
                  initialValue={dayjs(new Date())}
               >
                  <DatePicker className='w-full' />
               </Form.Item>
            </div>

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
                     initialValue={notice?.content_En}
                     setValue={(value) => {
                        form.setFieldsValue({ content_En: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>

               <Form.Item label='Content (Nepali):' name='content_Np'>
                  <Editor
                     initialValue={notice?.content_Np}
                     setValue={(value) => {
                        form.setFieldsValue({ content_Np: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>
            </div>

            <div className='mb-[20px] flex items-center gap-[10px]'>
               <span className='text-[16px] font-[500] leading-[27px] text-[#303030]'>
                  Do you want this content to be a popup on the homepage?
               </span>

               <ConfigProvider
                  theme={{
                     components: {
                        Switch: {
                           colorPrimary: '#34C38F',
                           colorPrimaryHover: '#34C38F',
                        },
                     },
                  }}
               >
                  <Form.Item
                     initialValue={true}
                     name='isPopup'
                     valuePropName='checked'
                  >
                     <Switch defaultChecked size='small' />
                  </Form.Item>
               </ConfigProvider>
            </div>

            <Form.Item label='Redirect Link:' name='redirectLink'>
               <Input placeholder='https://facebook.com' />
            </Form.Item>

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
                        ? handleUpdateNotice.isLoading
                        : handleCreateNotice.isLoading)
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

export default withPrivilege(CreateNotice, PRIVILEGE_NAME.NOTICE);
