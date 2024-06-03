'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { type ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, Upload, type UploadFile } from 'antd';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { serviceApi } from '@/api/admin/service';
import { withPrivilege } from '@/auth';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { SERVICE } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Service } from '@/models/admin/service';
import { type Locale } from '@/i18n';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      slug?: string;
   };
};

const CreateService: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const slug = searchParams.slug;

   const [form] = Form.useForm<Service>();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: service } = useQuery({
      queryFn: () => (slug ? serviceApi[getRole()]?.getService(slug) : null),
      queryKey: queryKeys(SERVICE).detail(slug as string),
      enabled: Boolean(slug),
   });

   useEffect(() => {
      if (service) {
         form.setFieldsValue({
            ...service,
            tags_En: service?.tags_En ?? undefined,
            tags_Np: service?.tags_Np ?? undefined,
         });

         if (service?.image)
            setImageFileList([
               {
                  uid: '1',
                  name: service?.image,
                  status: 'done',
                  url: BASE_IMAGE_PATH + service?.image,
               },
            ]);
      }
   }, [service]);

   const handleCreateService = useMutation(
      serviceApi[getRole()]?.createService,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(SERVICE).all);
            router.push(`/${params.lang}/admin/services`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateService = useMutation(
      serviceApi[getRole()]?.updateService,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(SERVICE).all);
            router.push(`/${params.lang}/admin/services`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleFormSubmit = async (values: Service) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as Service;

      slug
         ? handleUpdateService.mutate({
              ...data,
              slug,
           })
         : handleCreateService.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'services' },
               {
                  title: slug ? 'Update Service' : 'Create New',
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
               className='col-span-full'
               label='Image: (Maximum Dimension: 700 * 500 | Image ratio: 7:5)'
               name='image'
            >
               <Dragger
                  {...uploadProps('image', getRole())}
                  fileList={imageFileList}
                  listType='picture-card'
                  maxCount={1}
                  multiple={false}
                  onChange={({ file, fileList }) => {
                     setImageFileList(() =>
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
               <Form.Item label='Tags:' name='tags_En'>
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='tag-dropdown'
                     getPopupContainer={() =>
                        document.getElementById('admin') as HTMLElement
                     }
                     mode='tags'
                     open={false}
                     placeholder='Enter tags'
                     suffixIcon={null}
                  />
               </Form.Item>

               <Form.Item label='Tags (Nepali):' name='tags_Np'>
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='tag-dropdown'
                     getPopupContainer={() =>
                        document.getElementById('admin') as HTMLElement
                     }
                     mode='tags'
                     open={false}
                     placeholder='Enter tags (Nepali)'
                     suffixIcon={null}
                  />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Content:' name='content_En'>
                  <Editor
                     initialValue={service?.content_En}
                     setValue={(value) => {
                        form.setFieldsValue({ content_En: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>

               <Form.Item label='Content (Nepali):' name='content_Np'>
                  <Editor
                     initialValue={service?.content_Np}
                     setValue={(value) => {
                        form.setFieldsValue({ content_Np: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>
            </div>

            <div className='mb-[30px] grid grid-cols-2 gap-x-[30px]'>
               <Form.Item
                  label='Priority:'
                  name='priority'
                  getValueFromEvent={(e: ChangeEvent<HTMLInputElement>) =>
                     Number(e.target?.value)
                  }
               >
                  <Input type='number' placeholder='Enter priority' />
               </Form.Item>
            </div>

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  htmlType='submit'
                  type='primary'
                  loading={
                     imageFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) ||
                     (slug
                        ? handleUpdateService.isLoading
                        : handleCreateService.isLoading)
                  }
                  onClick={async () => {
                     form.setFieldsValue({
                        image:
                           imageFileList?.[0]?.response?.data?.path ??
                           imageFileList?.[0]?.name,
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

export default withPrivilege(CreateService, PRIVILEGE_NAME.SERVICE);
