'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Select, Upload, type UploadFile } from 'antd';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { usePreview } from '@/app/[lang]/(admin)/admin/common/usePreview';
import { userApi } from '@/api/admin/user';
import { roleApi } from '@/api/admin/role';
import { privilegeApi } from '@/api/admin/privilege';
import { withPrivilege } from '@/auth';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
   uploadProps,
} from '@/utils';
import { PRIVILEGE, ROLE, USER } from '@/constants/admin/queryKeys';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { ROLE_NAME } from '@/enums/role';
import { type User } from '@/models/admin/user';
import { type Locale } from '@/i18n';
import UPLOAD_IMAGE from '@/public/admin/assets/upload.png';

const { Dragger } = Upload;

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      email?: string;
   };
};

const CreateUser: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const email = searchParams.email;

   const [form] = Form.useForm<
      User & {
         roleId: number;
         privilegeIds: number[];
      }
   >();

   const formEmail = Form.useWatch('email', form);

   const queryClient = useQueryClient();

   const { Preview, handlePreview } = usePreview();

   const [imageFileList, setImageFileList] = useState<
      Array<UploadFile<{ data: { path?: string } }>>
   >([]);

   const { data: user } = useQuery({
      queryFn: () => (email ? userApi.SUPER_ADMIN.getUser(email) : null),
      queryKey: queryKeys(USER).detail(email as string),
      enabled: Boolean(email),
   });

   const { isSuccess: userExists } = useQuery({
      queryFn: () => userApi.SUPER_ADMIN.getUser(formEmail),
      queryKey: queryKeys(USER).detail(formEmail),
      enabled: Boolean(formEmail),
   });

   const { data: roles, isLoading: isRolesLoading } = useQuery({
      queryFn: () =>
         roleApi.SUPER_ADMIN.getRoles({
            pagination: false,
         }),
      queryKey: queryKeys(ROLE).list({
         pagination: false,
      }),
   });

   const { data: privileges, isLoading: isPrivilegesLoading } = useQuery({
      queryFn: () =>
         privilegeApi.SUPER_ADMIN.getPrivileges({
            pagination: false,
         }),
      queryKey: queryKeys(PRIVILEGE).list({
         pagination: false,
      }),
   });

   useEffect(() => {
      if (user) {
         form.setFieldsValue({
            ...user,
            roleId: user?.role?.id,
            privilegeIds: user?.privileges?.map((privilege) => privilege.id),
         });

         if (user?.image)
            setImageFileList([
               {
                  uid: '1',
                  name: user?.image,
                  status: 'done',
                  url: BASE_IMAGE_PATH + user?.image,
               },
            ]);
      }
   }, [user]);

   useEffect(() => {
      if (userExists && !email)
         form.setFields([
            {
               name: 'email',
               errors: ['Email is already taken'],
            },
         ]);
   }, [userExists]);

   const handleCreateUser = useMutation(userApi.SUPER_ADMIN.createUser, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(USER).all);
         router.push(`/${params.lang}/admin/users`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleUpdateUser = useMutation(userApi.SUPER_ADMIN.updateUser, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
         await queryClient.refetchQueries(queryKeys(USER).all);
         router.push(`/${params.lang}/admin/users`);
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   const handleFormSubmit = async (values: User) => {
      const data = Object.fromEntries(
         Object.entries(values).filter(([_, v]) => v !== null)
      ) as User;

      email
         ? handleUpdateUser.mutate({
              ...data,
              email,
           })
         : handleCreateUser.mutate(data);
   };

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[
               { path: 'users' },
               {
                  title: email ? 'Update User' : 'Create New',
               },
            ]}
         />

         <Form
            className='rounded-[10px] bg-white !py-[20px] px-[25px]'
            colon={false}
            disabled={user?.role?.name === ROLE_NAME.SUPER_ADMIN}
            form={form}
            layout='vertical'
            scrollToFirstError
            onFinish={handleFormSubmit}
         >
            <div className='grid grid-cols-2 gap-x-[30px]'>
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
                  <Input placeholder='Enter name' />
               </Form.Item>

               <Form.Item
                  label='Role:'
                  name='roleId'
                  rules={[
                     {
                        required: true,
                        message: 'Role is required',
                     },
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
                     loading={isRolesLoading}
                     options={roles?.result?.map((role) => ({
                        value: role.id,
                        label: role.name,
                     }))}
                     placeholder='Select role'
                  />
               </Form.Item>
            </div>

            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item
                  label='Email:'
                  name='email'
                  rules={[
                     {
                        required: true,
                        message: 'Email is required',
                        type: 'email',
                     },
                  ]}
               >
                  <Input disabled={Boolean(email)} placeholder='Enter email' />
               </Form.Item>

               <Form.Item
                  label='Password:'
                  name='password'
                  rules={[
                     {
                        required: !Boolean(email),
                        message: 'Password is required',
                     },
                  ]}
               >
                  <Input type='password' placeholder='Enter password' />
               </Form.Item>
            </div>

            <Form.Item label='Privileges:' name='privilegeIds'>
               <Select
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className='form-dropdown'
                  loading={isPrivilegesLoading}
                  mode='multiple'
                  filterOption={(input, option) =>
                     (option?.label?.toLowerCase() ?? '').includes(
                        input?.toLowerCase()
                     )
                  }
                  options={privileges?.result?.map((privilege) => ({
                     value: privilege.id,
                     label: privilege.name,
                  }))}
                  placeholder='Select privileges'
               />
            </Form.Item>

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

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  htmlType='submit'
                  type='primary'
                  loading={
                     imageFileList?.some(
                        ({ status }) => status === 'uploading'
                     ) ||
                     (email
                        ? handleUpdateUser.isLoading
                        : handleCreateUser.isLoading)
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

export default withPrivilege(CreateUser, PRIVILEGE_NAME.USER);
