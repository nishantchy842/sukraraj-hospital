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
import { memberApi } from '@/api/admin/member';
import { withPrivilege } from '@/auth';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { MEMBER } from '@/constants/admin/queryKeys';
import { BRANCHES, MEMBER_TYPE, POSITIONS } from '@/enums/member';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Member } from '@/models/admin/member';
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

const CreateMember: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const id = searchParams.id;

   const [memberType, setMemberType] = useState<MEMBER_TYPE | undefined>(
      undefined
   );

   const [form] = Form.useForm<Member>();

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: member } = useQuery({
      queryFn: () => (id ? memberApi[getRole()]?.getMember(id) : null),
      queryKey: queryKeys(MEMBER).detail(id as string),
      enabled: Boolean(id),
   });

   useEffect(() => {
      if (member) {
         form.setFieldsValue({
            ...member,
            phoneNumbers: member?.phoneNumbers ?? undefined,
            emails: member?.emails ?? undefined,
            department: undefined,
         });

         setMemberType(member?.type);

         if (member?.image)
            setImageFileList([
               {
                  uid: '1',
                  name: member?.image,
                  status: 'done',
                  url: BASE_IMAGE_PATH + member?.image,
               },
            ]);
      }
   }, [member]);

   const handleCreateMember = useMutation(memberApi[getRole()]?.createMember, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(MEMBER).all);
         router.push(`/${params.lang}/admin/members`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleUpdateMember = useMutation(memberApi[getRole()]?.updateMember, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(MEMBER).all);
         router.push(`/${params.lang}/admin/members`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleFormSubmit = async (values: Member) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as Member;

      id
         ? handleUpdateMember.mutate({ ...data, id })
         : handleCreateMember.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'members' },
               {
                  title: id ? 'Update Member' : 'Create New',
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
                  label='Name:'
                  name='name_En'
                  rules={[
                     {
                        required: true,
                        message: 'Name is required',
                     },
                  ]}
               >
                  <Input placeholder='Enter name' />
               </Form.Item>

               <Form.Item label='Name (Nepali):' name='name_Np'>
                  <Input placeholder='Enter name (Nepali)' />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Position:' name='position_En'>
                  <Input placeholder='Enter position' />
               </Form.Item>

               <Form.Item label='Position (Nepali):' name='position_Np'>
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='form-dropdown'
                     mode='tags'
                     options={POSITIONS.map((position) => ({
                        value: position,
                        label: position,
                     }))}
                     placeholder='Select position (Nepali)'
                     onChange={(value: string[]) => {
                        form.setFieldValue(
                           'position_Np',
                           value?.[value?.length - 1]
                        );
                     }}
                  />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Branch:' name='branch_En'>
                  <Input placeholder='Enter branch' />
               </Form.Item>

               <Form.Item label='Branch (Nepali):' name='branch_Np'>
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='form-dropdown'
                     mode='tags'
                     options={BRANCHES.map((branch) => ({
                        value: branch,
                        label: branch,
                     }))}
                     placeholder='Select branch (Nepali)'
                     onChange={(value: string[]) => {
                        form.setFieldValue(
                           'branch_Np',
                           value?.[value?.length - 1]
                        );
                     }}
                  />
               </Form.Item>
            </div>

            <Form.Item
               className='col-span-full'
               label='Image (Minimum Dimension 500*500 | Image ratio: 1:1):'
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
               <Form.Item
                  label='Member Type:'
                  name='type'
                  rules={[
                     { required: true, message: 'Member type is required' },
                  ]}
               >
                  <Select
                     // eslint-disable-next-line tailwindcss/no-custom-classname
                     className='form-dropdown'
                     disabled={Boolean(id)}
                     options={Object.values(MEMBER_TYPE)
                        .map((type) => ({
                           value: type,
                           label: type,
                        }))
                        .filter(
                           ({ value }) =>
                              value !== MEMBER_TYPE.INFORMATION_OFFICER
                        )}
                     placeholder='Select member type'
                     onChange={(type: MEMBER_TYPE) => {
                        setMemberType(type);
                     }}
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

            {memberType === MEMBER_TYPE.BOARD_MEMBER && (
               <div className='grid grid-cols-2 gap-x-[30px]'>
                  <Form.Item label='Message:' name='message_En'>
                     <Editor
                        initialValue={member?.message_En}
                        setValue={(value) => {
                           form.setFieldsValue({ message_En: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>

                  <Form.Item label='Message (Nepali):' name='message_Np'>
                     <Editor
                        initialValue={member?.message_Np}
                        setValue={(value) => {
                           form.setFieldsValue({ message_Np: value });
                        }}
                        role={getRole()}
                     />
                  </Form.Item>
               </div>
            )}

            {memberType === MEMBER_TYPE.STAFF && (
               <div className='grid grid-cols-2 gap-x-[30px]'>
                  <Form.Item label='Phone Numbers:' name='phoneNumbers'>
                     <Select
                        // eslint-disable-next-line tailwindcss/no-custom-classname
                        className='tag-dropdown'
                        getPopupContainer={() =>
                           document.getElementById('admin') as HTMLElement
                        }
                        mode='tags'
                        open={false}
                        placeholder='Enter phone numbers'
                        suffixIcon={null}
                     />
                  </Form.Item>

                  <Form.Item label='Email Address:' name='emails'>
                     <Select
                        // eslint-disable-next-line tailwindcss/no-custom-classname
                        className='tag-dropdown'
                        getPopupContainer={() =>
                           document.getElementById('admin') as HTMLElement
                        }
                        mode='tags'
                        open={false}
                        placeholder='Enter email address'
                        suffixIcon={null}
                     />
                  </Form.Item>
               </div>
            )}

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
                        ? handleUpdateMember.isLoading
                        : handleCreateMember.isLoading)
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

export default withPrivilege(CreateMember, PRIVILEGE_NAME.MEMBER);
