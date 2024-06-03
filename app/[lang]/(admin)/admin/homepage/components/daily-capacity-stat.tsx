import { useState, type ChangeEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Input, Popover, Tabs } from 'antd';
import { capitalize } from 'lodash';
import { useAuth } from '@/auth';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { dailyCapacityApi } from '@/api/admin/daily-capacity';
import { DAILY_CAPACITY } from '@/constants/admin/queryKeys';
import { DAILY_CAPACITY_STATUS } from '@/enums/daily-capacity';
import { type DailyCapacity } from '@/models/admin/daily-capacity';
import { type Locale } from '@/i18n';
import { ROLE_NAME } from '@/enums/role';

type DailyCapacityCardProps = {
   data: DailyCapacity;
   role: ROLE_NAME;
   lang: Locale;
};

const DailyCapacityCard: React.FC<DailyCapacityCardProps> = ({
   data,
   role,
   lang,
}) => {
   const [isPopupOpen, setIsPopupOpen] = useState(new Map());

   const queryClient = useQueryClient();

   const handleArchiveDailyCapacity = useMutation(
      (id: DailyCapacity['id']) =>
         dailyCapacityApi[role]?.updateDailyCapacity({
            id,
            status: DAILY_CAPACITY_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(DAILY_CAPACITY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveDailyCapacity = useMutation(
      (id: DailyCapacity['id']) =>
         dailyCapacityApi.SUPER_ADMIN.updateDailyCapacity({
            id,
            status: DAILY_CAPACITY_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(DAILY_CAPACITY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUpdateDailyCapacity = useMutation(
      dailyCapacityApi[role]?.updateDailyCapacity,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(DAILY_CAPACITY).all);
            setIsPopupOpen(
               (prev) =>
                  new Map(
                     prev.set(handleUpdateDailyCapacity.variables?.id, false)
                  )
            );
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <div
         key={data?.id}
         className='rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'
      >
         <div className='flex flex-col gap-[20px]'>
            <div className='flex items-center gap-[10px]'>
               <span className='text-[18px] font-[600] leading-[30px] text-[#303030]'>
                  {data?.[`key_${capitalize(lang) as 'En' | 'Np'}`]}:
               </span>

               <span className='text-[24px] font-[500] leading-[40px] text-[#0C62BB]'>
                  {data?.value}
               </span>
            </div>

            <div className='flex gap-[30px]'>
               <Popover
                  content={
                     <Form
                        className='w-[300px]'
                        colon={false}
                        initialValues={{
                           key_En: data?.key_En,
                           key_Np: data?.key_Np,
                           value: data?.value,
                        }}
                        layout='vertical'
                        onFinish={(values: DailyCapacity) => {
                           handleUpdateDailyCapacity.mutate({
                              ...values,
                              id: data?.id,
                           });
                        }}
                     >
                        <Form.Item
                           label='Name:'
                           name='key_En'
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
                           label='Name (Nepali):'
                           name='key_Np'
                           rules={[
                              {
                                 required: true,
                                 message: 'Name (Nepali) is required',
                              },
                           ]}
                        >
                           <Input placeholder='Enter name (Nepali)' />
                        </Form.Item>

                        <Form.Item
                           label='Value:'
                           name='value'
                           rules={[
                              {
                                 required: true,
                                 message: 'Value is required',
                              },
                           ]}
                           getValueFromEvent={(
                              e: ChangeEvent<HTMLInputElement>
                           ) => Number(e.target?.value)}
                        >
                           <Input type='number' placeholder='Enter value' />
                        </Form.Item>

                        <Form.Item>
                           <Button
                              className='admin-primary-btn !w-full'
                              htmlType='submit'
                              type='primary'
                              loading={handleUpdateDailyCapacity.isLoading}
                           >
                              Submit
                           </Button>
                        </Form.Item>
                     </Form>
                  }
                  open={isPopupOpen.get(data?.id)}
                  trigger='click'
                  getPopupContainer={() =>
                     document.getElementById('admin') as HTMLElement
                  }
                  onOpenChange={(isOpen) => {
                     setIsPopupOpen(
                        (prev) => new Map(prev.set(data?.id, isOpen))
                     );
                  }}
               >
                  <span
                     className='cursor-pointer !text-[16px] !font-[500] !leading-[30px] text-[#FF9901] underline'
                     onClick={() => {
                        setIsPopupOpen(
                           (prev) => new Map(prev.set(data?.id, true))
                        );
                     }}
                  >
                     Edit Stat
                  </span>
               </Popover>

               <span
                  className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === DAILY_CAPACITY_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     data?.status === DAILY_CAPACITY_STATUS.ACTIVE
                        ? handleArchiveDailyCapacity.mutate(data?.id)
                        : handleUnarchiveDailyCapacity.mutate(data?.id);
                  }}
               >
                  {data?.status === DAILY_CAPACITY_STATUS.ACTIVE
                     ? 'Archive'
                     : 'Active'}
               </span>
            </div>
         </div>
      </div>
   );
};

type Props = {
   lang: Locale;
};

export const DailyCapacityStat: React.FC<Props> = ({ lang }) => {
   const [form] = Form.useForm();

   const queryClient = useQueryClient();

   const { authUser } = useAuth();

   const { data: dailyCapacity } = useQuery({
      queryFn: () => dailyCapacityApi[getRole()]?.getDailyCapacity(undefined),
      queryKey: queryKeys(DAILY_CAPACITY).details(),
   });

   const handleCreateDailyCapacity = useMutation(
      dailyCapacityApi[getRole()]?.createDailyCapacity,
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            form.resetFields();
            await queryClient.refetchQueries(queryKeys(DAILY_CAPACITY).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const tabItems = [
      {
         key: DAILY_CAPACITY_STATUS.ACTIVE,
         label: 'Active Stat',
         children: (
            <div className='grid flex-1 grid-cols-2 gap-[20px]'>
               {dailyCapacity
                  ?.filter((d) => d?.status === DAILY_CAPACITY_STATUS.ACTIVE)
                  ?.map((data) => (
                     <DailyCapacityCard
                        key={data?.id}
                        data={data}
                        role={getRole()}
                        lang={lang}
                     />
                  ))}
            </div>
         ),
      },
   ];

   const superAdminTabItems = [
      {
         key: DAILY_CAPACITY_STATUS.ACTIVE,
         label: 'Active Stat',
         children: (
            <div className='grid flex-1 grid-cols-2 gap-[20px]'>
               {dailyCapacity
                  ?.filter((d) => d?.status === DAILY_CAPACITY_STATUS.ACTIVE)
                  ?.map((data) => (
                     <DailyCapacityCard
                        key={data?.id}
                        data={data}
                        role={getRole()}
                        lang={lang}
                     />
                  ))}
            </div>
         ),
      },
      {
         key: DAILY_CAPACITY_STATUS.ARCHIVED,
         label: 'Archived Stat',
         children: (
            <div className='grid flex-1 grid-cols-2 gap-[20px]'>
               {dailyCapacity
                  ?.filter((d) => d?.status === DAILY_CAPACITY_STATUS.ARCHIVED)
                  ?.map((data) => (
                     <DailyCapacityCard
                        key={data?.id}
                        data={data}
                        role={getRole()}
                        lang={lang}
                     />
                  ))}
            </div>
         ),
      },
   ];

   return (
      <div className='flex gap-[40px]'>
         <Form
            className='h-fit basis-[25%] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white !p-[20px]'
            colon={false}
            form={form}
            layout='vertical'
            onFinish={handleCreateDailyCapacity.mutate}
         >
            <Form.Item
               label='Name:'
               name='key_En'
               rules={[{ required: true, message: 'Name is required' }]}
            >
               <Input placeholder='Enter name' />
            </Form.Item>

            <Form.Item
               label='Name (Nepali):'
               name='key_Np'
               rules={[
                  { required: true, message: 'Name (Nepali) is required' },
               ]}
            >
               <Input placeholder='Enter name (Nepali)' />
            </Form.Item>

            <Form.Item
               label='Value:'
               name='value'
               rules={[{ required: true, message: 'Value is required' }]}
               getValueFromEvent={(e: ChangeEvent<HTMLInputElement>) =>
                  Number(e.target?.value)
               }
            >
               <Input type='number' placeholder='Enter value' />
            </Form.Item>

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  htmlType='submit'
                  type='primary'
                  loading={handleCreateDailyCapacity.isLoading}
               >
                  Submit
               </Button>
            </Form.Item>
         </Form>

         <div className='flex-1'>
            {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
               <Tabs items={superAdminTabItems} />
            ) : (
               <Tabs items={tabItems} />
            )}
         </div>
      </div>
   );
};
