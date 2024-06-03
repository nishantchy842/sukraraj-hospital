'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Upload, type UploadFile, Input } from 'antd';
import { LinkOutlined, UploadOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { withPrivilege } from '@/auth';
import { aboutUsApi } from '@/api/admin/about-us';
import {
   errorNotification,
   getRole,
   queryKeys,
   replaceUUID,
   successNotification,
   uploadProps,
} from '@/utils';
import { ABOUT_US } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type AboutUs } from '@/models/admin/about-us';
import { type Locale } from '@/i18n';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
};

const UpdateIntroduction: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const [form] = Form.useForm<AboutUs>();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const [organogramFileList, setOrganogramFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const [citizenCharterFileList, setCitizenCharterFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: aboutUs } = useQuery({
      queryFn: () => aboutUsApi[getRole()]?.getAboutUs(undefined),
      queryKey: queryKeys(ABOUT_US).details(),
   });

   const handleUpdateAboutUs = useMutation(
      aboutUsApi[getRole()]?.updateAboutUs,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(ABOUT_US).all);
            router.push(`/${params.lang}/admin/about-us`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   useEffect(() => {
      if (aboutUs) {
         form.setFieldsValue({ ...aboutUs, images: undefined });

         if (aboutUs?.images && Array.isArray(aboutUs?.images))
            setImageFileList(
               aboutUs?.images?.map((image: string, index) => ({
                  uid: String(index),
                  name: image,
                  status: 'done',
                  url: BASE_IMAGE_PATH + image,
               }))
            );

         if (aboutUs?.citizenCharterFileLink)
            setCitizenCharterFileList([
               {
                  uid: aboutUs.citizenCharterFileLink,
                  name: aboutUs.citizenCharterFileLink,
                  status: 'done',
                  url: BASE_IMAGE_PATH + aboutUs.citizenCharterFileLink,
               },
            ]);

         if (aboutUs?.organogramFileLink)
            setOrganogramFileList([
               {
                  uid: aboutUs.organogramFileLink,
                  name: aboutUs.organogramFileLink,
                  status: 'done',
                  url: BASE_IMAGE_PATH + aboutUs.organogramFileLink,
               },
            ]);
      }
   }, [aboutUs]);

   const handleFormSubmit = async (values: AboutUs) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as AboutUs;

      handleUpdateAboutUs.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[{ path: 'about-us' }, { title: 'Edit About Us' }]}
         />

         <Form
            className='flex flex-col gap-[30px]'
            colon={false}
            form={form}
            layout='vertical'
            scrollToFirstError
            onFinish={handleFormSubmit}
         >
            <div className='rounded-[10px] bg-white py-[20px]'>
               <p className='px-[25px] text-[18px] font-[500] leading-[30px] text-[#303030]'>
                  Introduction
               </p>

               <div className='my-[20px] border-b-[1px] border-[#E4E4E4]' />

               <div className='grid grid-cols-2 gap-x-[30px] px-[25px]'>
                  <Form.Item label='History:' name='history_En'>
                     <Editor
                        initialValue={aboutUs?.history_En}
                        setValue={(value) => {
                           form.setFieldsValue({ history_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='History (Nepali):' name='history_Np'>
                     <Editor
                        initialValue={aboutUs?.history_Np}
                        setValue={(value) => {
                           form.setFieldsValue({ history_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item
                     className='col-span-full'
                     label='Image: (Maximum Dimension: 1440 * 900)'
                     name='images'
                  >
                     <Dragger
                        {...uploadProps('image', getRole())}
                        fileList={imageFileList}
                        listType='picture-card'
                        multiple
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
                              <Image
                                 alt='upload-image'
                                 src={UPLOAD_IMAGE}
                                 fill
                              />
                           </div>

                           {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                           <p className='ant-upload-text'>
                              Select an image to upload
                           </p>

                           {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                           <p className='ant-upload-hint'>
                              or drag and drop it here
                           </p>
                        </div>
                     </Dragger>
                  </Form.Item>

                  <Form.Item label='Mission:' name='mission_En'>
                     <Editor
                        initialValue={aboutUs?.mission_En}
                        setValue={(value) => {
                           form.setFieldsValue({ mission_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Mission (Nepali):' name='mission_Np'>
                     <Editor
                        initialValue={aboutUs?.mission_Np}
                        setValue={(value) => {
                           form.setFieldsValue({ mission_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Vision:' name='vision_En'>
                     <Editor
                        initialValue={aboutUs?.vision_En}
                        setValue={(value) => {
                           form.setFieldsValue({ vision_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Vision (Nepali):' name='vision_Np'>
                     <Editor
                        initialValue={aboutUs?.vision_Np}
                        setValue={(value) => {
                           form.setFieldsValue({ vision_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Values:' name='value_En'>
                     <Editor
                        initialValue={aboutUs?.value_En}
                        setValue={(value) => {
                           form.setFieldsValue({ value_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Values (Nepali):' name='value_Np'>
                     <Editor
                        initialValue={aboutUs?.value_Np}
                        setValue={(value) => {
                           form.setFieldsValue({ value_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Objectives:' name='objectives_En'>
                     <Editor
                        initialValue={aboutUs?.objectives_En}
                        setValue={(value) => {
                           form.setFieldsValue({ objectives_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Objectives (Nepali):' name='objectives_Np'>
                     <Editor
                        initialValue={aboutUs?.objectives_Np}
                        setValue={(value) => {
                           form.setFieldsValue({ objectives_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>
               </div>
            </div>

            <div className='rounded-[10px] bg-white py-[20px]'>
               <p className='px-[25px] text-[18px] font-[500] leading-[30px] text-[#303030]'>
                  Citizen Charter
               </p>

               <div className='my-[20px] border-b-[1px] border-[#E4E4E4]' />

               <div className='grid grid-cols-2 gap-x-[30px] px-[25px]'>
                  <Form.Item label='File name:' name='citizenCharterFileName'>
                     <Input placeholder='Enter file name' />
                  </Form.Item>

                  <Form.Item
                     label='Citizen charter image:'
                     name='citizenCharterFileLink'
                  >
                     <div className='flex items-center gap-[20px]'>
                        <Upload
                           {...uploadProps('image', getRole())}
                           className='w-fit'
                           fileList={citizenCharterFileList}
                           maxCount={1}
                           multiple={false}
                           onChange={({ file, fileList }) => {
                              setCitizenCharterFileList(() =>
                                 file.status === 'error'
                                    ? fileList.filter((f) => f.uid !== file.uid)
                                    : fileList
                              );
                           }}
                           onPreview={handlePreview}
                           showUploadList={false}
                        >
                           <Button
                              className='admin-primary-btn h-[44px] self-start border-[#0C62BB] bg-white text-[#0C62BB] hover:!bg-[#0C62BB]'
                              icon={<UploadOutlined />}
                              type='primary'
                           >
                              Upload File
                           </Button>
                        </Upload>

                        <div
                           className='flex cursor-pointer items-center gap-[10px] rounded-[5px] p-[2px] px-[4px] text-[14px] font-[500] leading-[18px] text-[#696969] transition-all hover:bg-[rgba(0,0,0,0.1)]'
                           onClick={() => {
                              handlePreview(citizenCharterFileList?.[0]);
                           }}
                        >
                           <LinkOutlined />

                           <span>
                              {citizenCharterFileList?.[0]?.name &&
                                 replaceUUID(
                                    citizenCharterFileList?.[0]?.name?.replaceAll(
                                       'upload/image/',
                                       ''
                                    ),
                                    ''
                                 )}
                           </span>
                        </div>
                     </div>
                  </Form.Item>
               </div>
            </div>

            <div className='rounded-[10px] bg-white py-[20px]'>
               <p className='px-[25px] text-[18px] font-[500] leading-[30px] text-[#303030]'>
                  Organogram
               </p>

               <div className='my-[20px] border-b-[1px] border-[#E4E4E4]' />

               <div className='px-[25px]'>
                  <Form.Item
                     className='col-span-full'
                     label='Organogram: (Maximum Dimension: 700 * 500 | Image ratio: 7:5)'
                     name='organogramFileLink'
                  >
                     <Dragger
                        {...uploadProps('image', getRole())}
                        fileList={organogramFileList}
                        listType='picture-card'
                        maxCount={1}
                        multiple={false}
                        onChange={({ file, fileList }) => {
                           setOrganogramFileList(() =>
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
                              <Image
                                 alt='upload-image'
                                 src={UPLOAD_IMAGE}
                                 fill
                              />
                           </div>

                           {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                           <p className='ant-upload-text'>
                              Select an image to upload
                           </p>

                           {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                           <p className='ant-upload-hint'>
                              or drag and drop it here
                           </p>
                        </div>
                     </Dragger>
                  </Form.Item>
               </div>
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
                     organogramFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) ||
                     handleUpdateAboutUs.isLoading
                  }
                  onClick={() => {
                     form.setFieldsValue({
                        images: !isEmpty(imageFileList)
                           ? imageFileList?.map(
                                (file) =>
                                   file?.response?.data?.path ?? file?.name
                             )
                           : undefined,
                        citizenCharterFileLink:
                           citizenCharterFileList?.[0]?.response?.data?.path ??
                           citizenCharterFileList?.[0]?.name,
                        organogramFileLink:
                           organogramFileList?.[0]?.response?.data?.path ??
                           organogramFileList?.[0]?.name,
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

export default withPrivilege(UpdateIntroduction, PRIVILEGE_NAME.ABOUT_US);
