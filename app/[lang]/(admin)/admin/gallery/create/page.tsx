'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Button,
   DatePicker,
   Form,
   Input,
   Upload,
   type UploadFile,
   Image as AntdImage,
   Radio,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import parse from 'html-react-parser';
import { capitalize, startCase } from 'lodash';
import { withPrivilege } from '@/auth';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { galleryApi } from '@/api/admin/gallery';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { GALLERY } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';
import { VIDEO_UPLOAD_TYPE } from '@/enums/gallery';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Gallery } from '@/models/admin/gallery';
import { type Locale } from '@/i18n';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      slug?: string;
   };
};

const CreateGallery: React.FC<Props> = ({ searchParams, params }) => {
   const router = useRouter();

   const slug = searchParams.slug;

   const [form] = Form.useForm();

   const queryClient = useQueryClient();

   const [images, setImages] = useState<Gallery['images']>(null);

   const [videos, setVideos] = useState<Gallery['videos']>(null);

   const [videoUploadType, setVideoUploadType] = useState<VIDEO_UPLOAD_TYPE>(
      VIDEO_UPLOAD_TYPE.LOCAL
   );

   const { Preview, handlePreview } = usePreview();

   const [coverImageFileList, setCoverImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const [videoFileList, setVideoFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: gallery } = useQuery({
      queryFn: () => (slug ? galleryApi[getRole()]?.getGallery(slug) : null),
      queryKey: queryKeys(GALLERY).detail(slug as string),
      enabled: Boolean(slug),
   });

   useEffect(() => {
      if (gallery) {
         form.setFieldsValue(gallery);

         if (gallery?.coverImage)
            setCoverImageFileList([
               {
                  uid: '1',
                  name: gallery?.coverImage,
                  status: 'done',
                  url: BASE_IMAGE_PATH + gallery?.coverImage,
               },
            ]);

         setImages(gallery?.images);

         setVideos(gallery?.videos);
      }
   }, [gallery]);

   const handleCreateGallery = useMutation(
      galleryApi[getRole()]?.createGallery,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(GALLERY).all);
            router.push(`/${params.lang}/admin/gallery`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateGallery = useMutation(
      galleryApi[getRole()]?.updateGallery,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(GALLERY).all);
            router.push(`/${params.lang}/admin/gallery`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleFormSubmit = async (values: Gallery) => {
      const data = Object.fromEntries(
         Object.entries({ ...values, images, videos }).filter(
            ([_, v]) => v !== null
         )
      ) as Gallery;

      slug
         ? handleUpdateGallery.mutate({ ...data, slug })
         : handleCreateGallery.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'gallery' },
               {
                  title: slug ? 'Update Gallery' : 'Create New',
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
               label='Cover Image: (Maximum Dimension: 700 * 500 | Image ratio: 7:5)'
               name='coverImage'
            >
               <Dragger
                  {...uploadProps('image', getRole())}
                  fileList={coverImageFileList}
                  listType='picture-card'
                  maxCount={1}
                  multiple={false}
                  onChange={({ file, fileList }) => {
                     setCoverImageFileList(() =>
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

            <div className='col-span-full mb-[30px] flex flex-col gap-[10px]'>
               <p className='text-[16px] font-[600] leading-[21px] text-[rgba(73,80,87,1)]'>
                  Images:
               </p>

               <div className='grid grid-cols-2 gap-x-[30px] rounded-[8px] bg-[#F8F8F8] !p-[20px]'>
                  <Form.Item
                     className='col-span-full'
                     label='Image: (Minimum Dimension: 700*500 | Image ratio: 7:5)'
                     name='imageLink'
                     rules={[
                        {
                           validator: () => Promise.resolve(),
                        },
                     ]}
                     required
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

                  <Form.Item
                     label='Description'
                     name='imageDescription_En'
                     rules={[
                        {
                           validator: () => Promise.resolve(),
                        },
                     ]}
                     required
                  >
                     <Editor
                        setValue={(value) => {
                           form.setFieldsValue({ imageDescription_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item
                     label='Description (Nepali):'
                     name='imageDescription_Np'
                     rules={[
                        {
                           validator: () => Promise.resolve(),
                        },
                     ]}
                     required
                  >
                     <Editor
                        setValue={(value) => {
                           form.setFieldsValue({ imageDescription_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item
                     label='Published Date:'
                     name='imagePublishedDate'
                     rules={[
                        {
                           validator: () => Promise.resolve(),
                        },
                     ]}
                  >
                     <DatePicker />
                  </Form.Item>

                  <div
                     className='col-span-full mt-[10px] flex cursor-pointer items-center justify-center rounded-[5px] border-[0.15vw] border-dotted border-[#17ABCA] py-[12px] text-[13px] font-[500] leading-[20px] text-[#17ABCA]'
                     onClick={() =>
                        form
                           .validateFields([
                              'imageLink',
                              'imageDescription_En',
                              'imageDescription_Np',
                              'imagePublishedDate',
                           ])
                           .then(
                              (values: {
                                 imageDescription_En: string;
                                 imageDescription_Np: string;
                                 imageLink: {
                                    fileList: Array<
                                       UploadFile<{ data: { path?: string } }>
                                    >;
                                 };
                                 imagePublishedDate: Date;
                              }) => {
                                 for (const [key, value] of Object.entries(
                                    values
                                 )) {
                                    if (!value) {
                                       form.setFields([
                                          {
                                             name: key,
                                             errors: [
                                                `${startCase(key)} is required`,
                                             ],
                                          },
                                       ]);

                                       return Promise.reject();
                                    }
                                 }

                                 setImages((prev) => [
                                    ...(prev ?? []),
                                    {
                                       description_En:
                                          values?.imageDescription_En,
                                       description_Np:
                                          values?.imageDescription_Np,
                                       link:
                                          values?.imageLink?.fileList?.[0]
                                             ?.response?.data?.path ??
                                          values?.imageLink?.fileList?.[0]
                                             ?.name,
                                       publishedDate:
                                          values?.imagePublishedDate,
                                    },
                                 ]);

                                 return Promise.resolve();
                              }
                           )
                           .then(() => {
                              form.resetFields([
                                 'imageDescription_En',
                                 'imageDescription_Np',
                                 'imageLink',
                                 'imagePublishedDate',
                              ]);
                              setImageFileList([]);
                           })
                     }
                  >
                     <PlusOutlined /> Add Image
                  </div>
               </div>
            </div>

            <div className='col-span-full mb-[30px] grid grid-cols-2 gap-[30px]'>
               {images?.map((image) => (
                  <div
                     key={image?.publishedDate?.toString()}
                     className='flex items-start gap-[15px] rounded-[5px] border-[0.15vw] border-dotted border-[#17ABCA] p-[10px]'
                  >
                     <AntdImage
                        className='!h-[95px] !w-[130px] rounded-[5px]'
                        src={BASE_IMAGE_PATH + image?.link}
                        loading='lazy'
                     />

                     <div className='flex flex-1 flex-col gap-[5px]'>
                        <p className='text-[16px] font-[500] text-[#808080]'>
                           {moment(image?.publishedDate).format('ll')}
                        </p>

                        <div className='text-[16px] font-[400] leading-[32px] text-[#505050]'>
                           {parse(
                              image?.[
                                 `description_${capitalize(params.lang) as 'En' | 'Np'}`
                              ] || ''
                           )}
                        </div>

                        <span
                           className='cursor-pointer text-[16px] font-[500] text-[#B82432]'
                           onClick={() => {
                              setImages((prev) =>
                                 (prev ?? []).filter(
                                    ({ publishedDate }) =>
                                       publishedDate !== image.publishedDate
                                 )
                              );
                           }}
                        >
                           Remove
                        </span>
                     </div>
                  </div>
               ))}
            </div>

            <div className='col-span-full mb-[30px] flex flex-col gap-[10px]'>
               <p className='text-[16px] font-[600] leading-[21px] text-[rgba(73,80,87,1)]'>
                  Videos:
               </p>

               <div className='grid grid-cols-2 gap-x-[30px] rounded-[8px] bg-[#F8F8F8] !p-[20px]'>
                  <Form.Item label='Select video upload type:'>
                     <Radio.Group
                        value={videoUploadType}
                        onChange={(e) => {
                           setVideoUploadType(
                              e.target.value as VIDEO_UPLOAD_TYPE
                           );
                        }}
                     >
                        <Radio value={VIDEO_UPLOAD_TYPE.LOCAL}>
                           Upload video from PC
                        </Radio>

                        <Radio value={VIDEO_UPLOAD_TYPE.URL}>
                           Paste URL of the video
                        </Radio>
                     </Radio.Group>
                  </Form.Item>

                  {videoUploadType === VIDEO_UPLOAD_TYPE.LOCAL ? (
                     <Form.Item
                        className='col-span-full'
                        label='Video: (Minimum Dimension: 700*500 | Image ratio: 7:5)'
                        name='videoLink'
                        rules={[
                           {
                              validator: () => Promise.resolve(),
                           },
                        ]}
                        required
                     >
                        <Dragger
                           {...uploadProps('video', getRole())}
                           accept='video/*'
                           fileList={videoFileList}
                           listType='picture-card'
                           maxCount={1}
                           multiple={false}
                           onChange={({ file, fileList }) => {
                              setVideoFileList(() =>
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
                                 Select a video upload
                              </p>

                              {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                              <p className='ant-upload-hint'>
                                 or drag and drop it here
                              </p>
                           </div>
                        </Dragger>
                     </Form.Item>
                  ) : (
                     <Form.Item
                        className='col-span-full'
                        label='URL'
                        name='videoUrl'
                        rules={[
                           {
                              validator: () => Promise.resolve(),
                           },
                        ]}
                        required
                     >
                        <Input placeholder='Enter URL' />
                     </Form.Item>
                  )}

                  <Form.Item
                     label='Description'
                     name='videoDescription_En'
                     rules={[
                        {
                           validator: () => Promise.resolve(),
                        },
                     ]}
                     required
                  >
                     <Editor
                        setValue={(value) => {
                           form.setFieldsValue({ videoDescription_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item
                     label='Description (Nepali):'
                     name='videoDescription_Np'
                     rules={[
                        {
                           validator: () => Promise.resolve(),
                        },
                     ]}
                     required
                  >
                     <Editor
                        setValue={(value) => {
                           form.setFieldsValue({ videoDescription_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item
                     label='Published Date:'
                     name='videoPublishedDate'
                     rules={[
                        {
                           validator: () => Promise.resolve(),
                        },
                     ]}
                  >
                     <DatePicker />
                  </Form.Item>

                  <div
                     className='col-span-full mt-[10px] flex cursor-pointer items-center justify-center rounded-[5px] border-[0.15vw] border-dotted border-[#17ABCA] py-[12px] text-[13px] font-[500] leading-[20px] text-[#17ABCA]'
                     onClick={() =>
                        form
                           .validateFields([
                              videoUploadType === VIDEO_UPLOAD_TYPE.LOCAL
                                 ? 'videoLink'
                                 : 'videoUrl',
                              'videoDescription_En',
                              'videoDescription_Np',
                              'videoPublishedDate',
                           ])
                           .then(
                              (values: {
                                 videoDescription_En: string;
                                 videoDescription_Np: string;
                                 videoLink: {
                                    fileList: Array<
                                       UploadFile<{ data: { path?: string } }>
                                    >;
                                 };
                                 videoUrl: string;
                                 videoPublishedDate: Date;
                              }) => {
                                 for (const [key, value] of Object.entries(
                                    values
                                 )) {
                                    if (!value) {
                                       form.setFields([
                                          {
                                             name: key,
                                             errors: [
                                                `${startCase(key)} is required`,
                                             ],
                                          },
                                       ]);

                                       return Promise.reject();
                                    }
                                 }

                                 setVideos((prev) => [
                                    ...(prev ?? []),
                                    {
                                       description_En:
                                          values?.videoDescription_En,
                                       description_Np:
                                          values?.videoDescription_Np,
                                       link:
                                          videoUploadType ===
                                          VIDEO_UPLOAD_TYPE.LOCAL
                                             ? values?.videoLink?.fileList?.[0]
                                                  ?.response?.data?.path ??
                                               values?.videoLink?.fileList?.[0]
                                                  ?.name
                                             : values?.videoUrl,
                                       publishedDate:
                                          values?.videoPublishedDate,
                                       type: videoUploadType,
                                    },
                                 ]);

                                 return Promise.resolve();
                              }
                           )
                           .then(() => {
                              form.resetFields([
                                 'videoDescription_En',
                                 'videoDescription_Np',
                                 'videoLink',
                                 'videoPublishedDate',
                                 'videoUrl',
                              ]);
                              setVideoFileList([]);
                           })
                     }
                  >
                     <PlusOutlined /> Add Video
                  </div>
               </div>
            </div>

            <div className='col-span-full mb-[30px] grid grid-cols-2 gap-[30px]'>
               {videos?.map((video) => (
                  <div
                     key={video?.publishedDate?.toString()}
                     className='flex items-start gap-[15px] rounded-[5px] border-[0.15vw] border-dotted border-[#17ABCA] p-[10px]'
                  >
                     <div className='relative h-[95px] w-[130px]'>
                        <AntdImage
                           className='!h-[95px] !w-[130px] opacity-0'
                           preview={{
                              imageRender: () => (
                                 <iframe
                                    className='h-[70vh] w-3/4'
                                    src={
                                       video?.type === VIDEO_UPLOAD_TYPE.URL
                                          ? video?.link
                                          : BASE_IMAGE_PATH + video?.link
                                    }
                                 />
                              ),
                           }}
                        />
                        {video?.type === VIDEO_UPLOAD_TYPE.LOCAL ? (
                           <video
                              className='pointer-events-none absolute left-0 top-0 size-full bg-white'
                              src={BASE_IMAGE_PATH + video?.link}
                           />
                        ) : (
                           <iframe
                              className='pointer-events-none absolute left-0 top-0 size-full'
                              src={video?.link}
                           />
                        )}
                     </div>

                     <div className='flex flex-1 flex-col gap-[5px]'>
                        <p className='text-[16px] font-[500] text-[#808080]'>
                           {moment(video?.publishedDate).format('ll')}
                        </p>

                        <div className='text-[16px] font-[400] leading-[32px] text-[#505050]'>
                           {parse(
                              video?.[
                                 `description_${capitalize(params.lang) as 'En' | 'Np'}`
                              ] || ''
                           )}
                        </div>

                        <span
                           className='cursor-pointer text-[16px] font-[500] text-[#B82432]'
                           onClick={() => {
                              setVideos((prev) =>
                                 (prev ?? []).filter(
                                    ({ publishedDate }) =>
                                       publishedDate !== video.publishedDate
                                 )
                              );
                           }}
                        >
                           Remove
                        </span>
                     </div>
                  </div>
               ))}
            </div>

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  htmlType='submit'
                  type='primary'
                  loading={
                     coverImageFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) ||
                     (slug
                        ? handleUpdateGallery.isLoading
                        : handleCreateGallery.isLoading)
                  }
                  onClick={async () => {
                     form.setFieldsValue({
                        coverImage:
                           coverImageFileList?.[0]?.response?.data?.path ??
                           coverImageFileList?.[0]?.name,
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

export default withPrivilege(CreateGallery, PRIVILEGE_NAME.GALLERY);
