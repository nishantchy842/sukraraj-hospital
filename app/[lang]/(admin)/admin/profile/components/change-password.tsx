import { authApi } from '@/api/admin/auth';
import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input } from 'antd';
import { errorNotification, getRole, successNotification } from '@/utils';

export default function ChangePassword() {
   const [form] = Form.useForm();

   const handleChangePassword = useMutation(
      authApi[getRole()]?.changePassword,
      {
         onSuccess: (res) => {
            successNotification(res.message);
            form.resetFields();
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <Form
         className='rounded-[10px] bg-white !py-[20px] px-[25px]'
         colon={false}
         form={form}
         layout='vertical'
         scrollToFirstError
         onFinish={handleChangePassword.mutate}
      >
         <Form.Item
            className='w-1/2'
            label='Current Password:'
            name='oldPassword'
            rules={[
               {
                  required: true,
                  message: 'Current Password is required',
               },
            ]}
         >
            <Input.Password placeholder='Enter Current Password' />
         </Form.Item>

         <Form.Item
            className='w-1/2'
            label='New Password:'
            name='newPassword'
            rules={[
               {
                  required: true,
                  message: 'New Password is required',
               },
            ]}
         >
            <Input.Password placeholder='Enter New Password' />
         </Form.Item>

         <Form.Item
            className='w-1/2'
            label='Confirm New Password:'
            name='confirmNewPassword'
            rules={[
               {
                  validator: (_, value) => {
                     if (!value)
                        return Promise.reject('New Password is required');

                     return value === form.getFieldValue('newPassword')
                        ? Promise.resolve()
                        : Promise.reject('Password does not match.');
                  },
               },
            ]}
         >
            <Input.Password placeholder='Confirm New Password' />
         </Form.Item>

         <Form.Item>
            <Button
               className='admin-primary-btn'
               type='primary'
               htmlType='submit'
               loading={handleChangePassword.isLoading}
            >
               Submit
            </Button>
         </Form.Item>
      </Form>
   );
}
