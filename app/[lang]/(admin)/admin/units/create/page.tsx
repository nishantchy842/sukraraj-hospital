'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Fragment, useEffect, useState, type ChangeEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Button,
   Form,
   Input,
   Select,
   TimePicker,
   Upload,
   type UploadFile,
} from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import moment from 'moment';
import { capitalize } from 'lodash';
import { withPrivilege } from '@/auth';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { departmentApi } from '@/api/admin/department';
import { memberApi } from '@/api/admin/member';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { DEPARTMENT, MEMBER } from '@/constants/admin/queryKeys';
import { MEMBER_TYPE } from '@/enums/member';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Department } from '@/models/admin/department';
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

const CreateDepartment: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const slug = searchParams.slug;

   const [form] = Form.useForm<
      Department & {
         morningSchedule: [Dayjs, Dayjs];
         afternoonSchedule: [Dayjs, Dayjs];
         memberIds: string[];
      }
   >();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: department } = useQuery({
      queryFn: () =>
         slug ? departmentApi[getRole()]?.getDepartment(slug) : null,
      queryKey: queryKeys(DEPARTMENT).detail(slug as string),
      enabled: Boolean(slug),
   });

   const { data: doctors, isLoading: isDoctorsLoading } = useQuery({
      queryFn: () =>
         memberApi[getRole()]?.getMembers({
            pagination: false,
            type: MEMBER_TYPE.DOCTOR,
         }),
      queryKey: queryKeys(MEMBER).list({
         pagination: false,
         type: MEMBER_TYPE.DOCTOR,
      }),
   });

   useEffect(() => {
      if (department) {
         form.setFieldsValue({
            ...department,
            morningSchedule: [
               department?.morningScheduleStart
                  ? dayjs(department?.morningScheduleStart)
                  : undefined,
               department?.morningScheduleEnd
                  ? dayjs(department?.morningScheduleEnd)
                  : undefined,
            ] as [Dayjs, Dayjs],
            afternoonSchedule: [
               department?.afternoonScheduleStart
                  ? dayjs(department?.afternoonScheduleStart)
                  : undefined,
               department?.afternoonScheduleEnd
                  ? dayjs(department?.afternoonScheduleEnd)
                  : undefined,
            ] as [Dayjs, Dayjs],
            memberIds: doctors?.result
               ?.filter((doctor) => doctor?.department?.slug === slug)
               ?.map((doctor) => doctor?.id),
            members: undefined,
         });

         if (department?.image)
            setImageFileList([
               {
                  uid: '1',
                  name: department?.image,
                  status: 'done',
                  url: BASE_IMAGE_PATH + department?.image,
               },
            ]);
      }
   }, [department]);

   const handleCreateDepartment = useMutation(
      departmentApi[getRole()]?.createDepartment,
      {
         onSuccess: async () => {
            successNotification('Unit created');
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(DEPARTMENT).all);
            router.push(`/${params.lang}/admin/units`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateDepartment = useMutation(
      departmentApi[getRole()]?.updateDepartment,
      {
         onSuccess: async () => {
            successNotification('Unit updated');
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(DEPARTMENT).all);
            router.push(`/${params.lang}/admin/units`);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleFormSubmit = async (
      values: Department & {
         morningSchedule: [Dayjs, Dayjs];
         afternoonSchedule: [Dayjs, Dayjs];
      }
   ) => {
      const v = {
         ...values,
         morningScheduleStart: values?.morningSchedule?.[0]?.isValid()
            ? values?.morningSchedule?.[0]
            : undefined,
         morningScheduleEnd: values?.morningSchedule?.[1]?.isValid()
            ? values?.morningSchedule?.[1]
            : undefined,
         afternoonScheduleStart: values?.afternoonSchedule?.[0]?.isValid()
            ? values?.afternoonSchedule?.[0]
            : undefined,
         afternoonScheduleEnd: values?.afternoonSchedule?.[1]?.isValid()
            ? values?.afternoonSchedule?.[1]
            : undefined,
      };

      const data = Object.fromEntries(
         Object.entries(v).filter(([_, v]) => v !== null)
      ) as Department;

      slug
         ? handleUpdateDepartment.mutate({
              ...data,
              slug,
           })
         : handleCreateDepartment.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'units' },
               {
                  title: slug ? 'Update Unit' : 'Create New',
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
                  label='Unit Name:'
                  name='name_En'
                  rules={[
                     {
                        required: true,
                        message: 'Unit is required',
                     },
                  ]}
               >
                  <Input placeholder='Enter unit name' />
               </Form.Item>

               <Form.Item label='Unit Name (Nepali):' name='name_Np'>
                  <Input placeholder='Enter unit name (Nepali)' />
               </Form.Item>
            </div>

            <Form.Item className='col-span-full' label='Image:' name='image'>
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
               <Form.Item label='Description:' name='description_En'>
                  <Input.TextArea placeholder='Enter description' />
               </Form.Item>

               <Form.Item label='Description (Nepali):' name='description_Np'>
                  <Input.TextArea placeholder='Enter description (Nepali)' />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Content:' name='content_En'>
                  <Editor
                     initialValue={department?.content_En}
                     setValue={(value) => {
                        form.setFieldValue('content_En', value);
                     }}
                     role={getRole()}
                  />
               </Form.Item>

               <Form.Item label='Content (Nepali):' name='content_Np'>
                  <Editor
                     initialValue={department?.content_Np}
                     setValue={(value) => {
                        form.setFieldValue('content_Np', value);
                     }}
                     role={getRole()}
                  />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item
                  label='Room No:'
                  name='roomNo'
                  getValueFromEvent={(e: ChangeEvent<HTMLInputElement>) =>
                     Number(e.target.value)
                  }
               >
                  <Input type='number' placeholder='Enter room no' />
               </Form.Item>

               <Form.Item label='OPD Floor:' name='opdFloor'>
                  <Input placeholder='Enter OPD floor' />
               </Form.Item>
            </div>

            <div className='grid grid-cols-4 gap-x-[30px]'>
               <Form.Item label='OPD Days Start:' name='opdDaysStart'>
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='form-dropdown'
                     options={moment
                        .weekdays()
                        .map((v) => ({ value: v, label: v }))}
                     placeholder='Select OPD day start'
                  />
               </Form.Item>

               <Form.Item label='OPD Days End:' name='opdDaysEnd'>
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='form-dropdown'
                     options={moment
                        .weekdays()
                        .map((v) => ({ value: v, label: v }))}
                     placeholder='Select OPD day end'
                  />
               </Form.Item>

               <Form.Item label='Morning Schedule:' name='morningSchedule'>
                  <TimePicker.RangePicker
                     className='w-full'
                     format='HH:mm:ss A'
                     getPopupContainer={() =>
                        document.getElementById('admin') as HTMLElement
                     }
                  />
               </Form.Item>

               <Form.Item label='Afternoon Schedule:' name='afternoonSchedule'>
                  <TimePicker.RangePicker
                     className='w-full'
                     format='HH:mm:ss A'
                     getPopupContainer={() =>
                        document.getElementById('admin') as HTMLElement
                     }
                  />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Doctors:' name='memberIds'>
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='form-dropdown'
                     loading={isDoctorsLoading}
                     mode='multiple'
                     filterOption={(input, option) =>
                        (option?.name?.toLowerCase() ?? '').includes(
                           input?.toLowerCase()
                        )
                     }
                     options={doctors?.result?.map((doctor) => ({
                        value: doctor.id,
                        name: doctor?.[
                           `name_${capitalize(params.lang) as 'En' | 'Np'}`
                        ],
                        label: (
                           <div className='flex items-center gap-[10px]'>
                              {doctor?.image && (
                                 <div className='relative size-[30px]'>
                                    <Image
                                       alt=''
                                       src={BASE_IMAGE_PATH + doctor?.image}
                                       fill
                                    />
                                 </div>
                              )}

                              <span className='text-[16px] font-[400] leading-[27px] text-[#303030]'>
                                 {
                                    doctor?.[
                                       `name_${capitalize(params.lang) as 'En' | 'Np'}`
                                    ]
                                 }
                              </span>
                           </div>
                        ),
                     }))}
                     placeholder='Select doctors'
                  />
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
                        ? handleUpdateDepartment.isLoading
                        : handleCreateDepartment.isLoading)
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

export default withPrivilege(CreateDepartment, PRIVILEGE_NAME.DEPARTMENT);
