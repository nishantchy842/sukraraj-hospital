'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form } from 'antd';
import BackButton from '@/app/[lang]/(admin)/admin/common/BackButton';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Editor from '@/app/[lang]/(admin)/admin/common/Editor';
import { withPrivilege } from '@/auth';
import { aboutUsApi } from '@/api/admin/about-us';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { ABOUT_US } from '@/constants/admin/queryKeys';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type AboutUs } from '@/models/admin/about-us';
import { type Locale } from '@/i18n';

type Props = {
   params: {
      lang: Locale;
   };
};

const UpdateFuturePlans: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const [form] = Form.useForm<AboutUs>();

   const queryClient = useQueryClient();

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
      }
   }, [aboutUs]);

   return (
      <Fragment>
         <BackButton />

         <Breadcrumb
            items={[{ path: 'about-us' }, { title: 'Edit Future Plans' }]}
         />

         <Form
            className='rounded-[10px] bg-white !py-[20px] px-[25px]'
            colon={false}
            form={form}
            layout='vertical'
            scrollToFirstError
            onFinish={(values: AboutUs) => {
               const data = Object.fromEntries(
                  Object.entries(values).filter(([_, v]) => v !== null)
               ) as AboutUs;
               handleUpdateAboutUs.mutate(data);
            }}
         >
            <div className='grid grid-cols-2 gap-x-[30px]'>
               <Form.Item label='Future Plans:' name='futurePlan_En'>
                  <Editor
                     initialValue={aboutUs?.futurePlan_En}
                     setValue={(value) => {
                        form.setFieldsValue({ futurePlan_En: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>

               <Form.Item label='Future Plans (Nepali):' name='futurePlan_Np'>
                  <Editor
                     initialValue={aboutUs?.futurePlan_Np}
                     setValue={(value) => {
                        form.setFieldsValue({ futurePlan_Np: value });
                     }}
                     role={getRole()}
                  />
               </Form.Item>
            </div>

            <Form.Item>
               <Button
                  className='admin-primary-btn'
                  htmlType='submit'
                  type='primary'
                  loading={handleUpdateAboutUs.isLoading}
               >
                  Submit
               </Button>
            </Form.Item>
         </Form>
      </Fragment>
   );
};

export default withPrivilege(UpdateFuturePlans, PRIVILEGE_NAME.ABOUT_US);
