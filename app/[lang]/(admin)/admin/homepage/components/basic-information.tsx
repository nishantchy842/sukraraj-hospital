import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Select } from 'antd';
import { basicInformationApi } from '@/api/admin/basic-information';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { BASIC_INFORMATION } from '@/constants/admin/queryKeys';
import { type BasicInformation as BasicInformationModel } from '@/models/admin/basic-information';

export const BasicInformation = () => {
   const [form] = Form.useForm();

   const queryClient = useQueryClient();

   const { data: basicInformation } = useQuery({
      queryFn: () =>
         basicInformationApi[getRole()]?.getBasicInformation(undefined),
      queryKey: queryKeys(BASIC_INFORMATION).details(),
   });

   useEffect(() => {
      if (basicInformation) {
         form.setFieldsValue(basicInformation);
      }
   }, [basicInformation]);

   const handleUpdateBasicInformation = useMutation(
      basicInformationApi[getRole()]?.updateBasicInformation,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(BASIC_INFORMATION).all);
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
         onFinish={(values: BasicInformationModel) => {
            const data = Object.fromEntries(
               Object.entries(values).filter(([_, v]) => v !== null)
            ) as BasicInformationModel;

            handleUpdateBasicInformation.mutate(data);
         }}
      >
         <div className='grid grid-cols-2 gap-x-[30px]'>
            <Form.Item label='General Inquiries:' name='generalInquiries'>
               <Select
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className='tag-dropdown'
                  getPopupContainer={() =>
                     document.getElementById('admin') as HTMLElement
                  }
                  mode='tags'
                  open={false}
                  placeholder='Enter general inquiries'
                  suffixIcon={null}
               />
            </Form.Item>

            <Form.Item label='Emergency Hotlines:' name='emergencyHotlines'>
               <Select
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className='tag-dropdown'
                  getPopupContainer={() =>
                     document.getElementById('admin') as HTMLElement
                  }
                  mode='tags'
                  open={false}
                  placeholder='Enter emergency hotlines'
                  suffixIcon={null}
               />
            </Form.Item>
         </div>

         <div className='grid grid-cols-2 gap-x-[30px]'>
            <Form.Item label='Opening Hours:' name='openingHours'>
               <Select
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className='tag-dropdown'
                  getPopupContainer={() =>
                     document.getElementById('admin') as HTMLElement
                  }
                  mode='tags'
                  open={false}
                  placeholder='Enter opening hours'
                  suffixIcon={null}
               />
            </Form.Item>

            <Form.Item label='Emails:' name='emails'>
               <Select
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className='tag-dropdown'
                  getPopupContainer={() =>
                     document.getElementById('admin') as HTMLElement
                  }
                  mode='tags'
                  open={false}
                  placeholder='Enter emails'
                  suffixIcon={null}
               />
            </Form.Item>
         </div>

         <Form.Item label='OPD Schedules:' name='opdSchedules'>
            <Select
               // eslint-disable-next-line tailwindcss/no-custom-classname
               className='tag-dropdown'
               getPopupContainer={() =>
                  document.getElementById('admin') as HTMLElement
               }
               mode='tags'
               open={false}
               placeholder='Enter opd schedules'
               suffixIcon={null}
            />
         </Form.Item>

         <Form.Item>
            <Button
               className='admin-primary-btn'
               htmlType='submit'
               type='primary'
               loading={handleUpdateBasicInformation.isLoading}
            >
               Submit
            </Button>
         </Form.Item>
      </Form>
   );
};
