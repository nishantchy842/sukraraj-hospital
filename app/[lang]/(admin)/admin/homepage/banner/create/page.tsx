'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { type ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Upload, type UploadFile } from 'antd';
import { isEmpty } from 'lodash';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { bannerApi } from '@/api/admin/banner';
import { withPrivilege } from '@/auth';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { BANNER } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Banner } from '@/models/admin/banner';
import { type Locale } from '@/i18n';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      id?: string;
   };
};

const CreateBanner: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const id = searchParams.id;

   const [form] = Form.useForm();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: banner } = useQuery({
      queryFn: () => (id ? bannerApi[getRole()]?.getBanner(Number(id)) : null),
      queryKey: queryKeys(BANNER).detail(Number(id)),
      enabled: Boolean(id),
   });

   useEffect(() => {
      if (banner) {
         form.setFieldsValue(banner);

         setImageFileList([
            {
               uid: '1',
               name: banner?.image,
               status: 'done',
               url: BASE_IMAGE_PATH + banner?.image,
            },
         ]);
      }
   }, [banner]);

   const handleCreateBanner = useMutation(bannerApi[getRole()]?.createBanner, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(BANNER).all);
         router.push(`/${params.lang}/admin/homepage`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleUpdateBanner = useMutation(bannerApi[getRole()]?.updateBanner, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(BANNER).all);
         router.push(`/${params.lang}/admin/homepage`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleFormSubmit = async (values: Banner) => {
      if (isEmpty(imageFileList)) {
         errorNotification('Image is required');
         return;
      }

      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as Banner;

      id
         ? handleUpdateBanner.mutate({
              ...data,
              id: Number(id),
           })
         : handleCreateBanner.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'homepage' },
               {
                  title: id ? 'Update Banner' : 'Create Banner',
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
               className='col-span-full'
               label='Image: (Maximum Dimension: 1440 * 810 | Image ratio: 16:9)'
               name='image'
               rules={[
                  {
                     required: true,
                     message: 'Image is required',
                  },
               ]}
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

            <Form.Item
               label='Priority:'
               name='priority'
               getValueFromEvent={(e: ChangeEvent<HTMLInputElement>) =>
                  Number(e.target?.value)
               }
            >
               <Input type='number' placeholder='Enter priority' />
            </Form.Item>

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  htmlType='submit'
                  type='primary'
                  loading={
                     imageFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) ||
                     (id
                        ? handleUpdateBanner.isLoading
                        : handleCreateBanner.isLoading)
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

export default withPrivilege(CreateBanner, PRIVILEGE_NAME.HOMEPAGE);
