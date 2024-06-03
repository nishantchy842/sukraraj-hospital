'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Form, Input } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookie from 'js-cookie';
import { ToastContainer } from 'react-toastify';
import { authApi } from '@/api/admin/auth';
import { errorNotification, queryKeys, successNotification } from '@/utils';
import { AUTH } from '@/constants/querykeys';
import 'react-toastify/dist/ReactToastify.css';
import BRAND_LOGO from '@/public/admin/assets/brand-logo.svg';

export default function Login() {
   const router = useRouter();

   const [form] = Form.useForm();

   const queryClient = useQueryClient();

   const handleLogin = useMutation(authApi.ADMIN.login, {
      onSuccess: async (data) => {
         successNotification('Login Successful');
         await queryClient.refetchQueries(queryKeys(AUTH).details());
         Cookie.set('token', data.token);
         Cookie.set('role', data.user?.role?.name);
         router.push('/admin/about-us');
      },
      onError: (err: FetchError) => errorNotification(err?.message),
   });

   return (
      <div id='admin' className='flex items-center justify-center p-[100px]'>
         <ToastContainer />

         <div className='flex flex-col items-center gap-[50px]'>
            <div className='relative h-[120px] w-[480px]'>
               <Image alt='brand-logo' src={BRAND_LOGO} fill />
            </div>

            <Form
               className='w-full'
               form={form}
               initialValues={{
                  remember: true,
               }}
               layout='vertical'
               name='normal_login'
               onFinish={handleLogin.mutate}
            >
               <Form.Item
                  className='mb-[25px]'
                  label='Email Address'
                  name='email'
                  rules={[
                     {
                        required: true,
                        message: 'Enter your Email Address!',
                     },
                     {
                        type: 'email',
                        message: 'Invalid email format',
                     },
                  ]}
               >
                  <Input placeholder='Enter your Email Address' />
               </Form.Item>
               <Form.Item
                  className='mb-[25px]'
                  label='Password'
                  name='password'
                  rules={[
                     {
                        required: true,
                        message: 'Please input your Password!',
                     },
                  ]}
               >
                  <Input.Password placeholder='Password' />
               </Form.Item>

               <Button
                  className='admin-primary-btn !w-full'
                  htmlType='submit'
                  loading={handleLogin.isLoading}
                  type='primary'
               >
                  Login
               </Button>
            </Form>
         </div>
      </div>
   );
}
