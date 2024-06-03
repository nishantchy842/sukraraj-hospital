'use client';

import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Upload, type UploadFile } from 'antd';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { useAuth } from '@/auth';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { authApi } from '@/api/admin/auth';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { AUTH } from '@/constants/admin/queryKeys';
import { type User } from '@/models/admin/user';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

export default function ProfileSettings() {
   const [form] = Form.useForm();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { authUser } = useAuth();

   useEffect(() => {
      if (authUser) {
         form.setFieldsValue(authUser);

         if (authUser.image)
            setImageFileList([
               {
                  uid: '1',
                  name: authUser.image,
                  status: 'done',
                  url: BASE_IMAGE_PATH + authUser.image,
               },
            ]);
      }
   }, [authUser]);

   const handleUpdateProfile = useMutation(authApi[getRole()]?.updateProfile, {
      onSuccess: async (res) => {
         successNotification(res.message);
         await queryClient.refetchQueries(queryKeys(AUTH).details());
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleFormSubmit = (values: User) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as User;

      handleUpdateProfile.mutate(data);
   };

   return (
      <Fragment>
         <Form
            className='!grid grid-cols-2 gap-x-[30px] rounded-[10px] bg-white !py-[20px] px-[25px]'
            colon={false}
            form={form}
            layout='vertical'
            scrollToFirstError
            onFinish={handleFormSubmit}
         >
            <Form.Item
               label='Name:'
               name='name'
               rules={[
                  {
                     required: true,
                     message: 'Name is required',
                  },
               ]}
            >
               <Input placeholder='Enter Name' />
            </Form.Item>

            <Form.Item
               label='Email Address:'
               name='email'
               rules={[
                  {
                     required: true,
                     message: 'Email address is required',
                  },
                  {
                     type: 'email',
                     message: 'Please enter a valid email',
                  },
               ]}
            >
               <Input placeholder='Enter Email Address' disabled />
            </Form.Item>

            <Form.Item
               className='col-span-full'
               label='Image: (Image ratio: 1:1)'
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

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  type='primary'
                  htmlType='submit'
                  loading={
                     imageFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) || handleUpdateProfile.isLoading
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
}
