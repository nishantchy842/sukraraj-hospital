import { Button, Form, Input } from 'antd';
import React from 'react';
const { TextArea } = Input;
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import styles from '../style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { contactUs } from '@/api/contact-us';
import { errorNotification, successNotification } from '@/utils';
import { type Contact } from '@/models/contact';
import { type Locale } from '@/i18n';
import { translate } from '@/utils/commonRule';

export default function ContactForm({ lang }: { lang: Locale }) {
   const [form] = Form.useForm();
   const { mutate } = useMutation(contactUs, {
      onSuccess: async (res) => {
         successNotification(res.message);
         form.resetFields();
      },
      onError: (err: FetchError) => errorNotification(err.message),
   });

   const onFinish = (
      values: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
   ) => {
      const fullName = values.name + ' ' + values.lastName;
      values = {
         name: fullName,
         phone: values?.phone,
         email: values.email,
         subject: values.subject,
         message: values.message,
      };
      mutate(values);
   };

   return (
      <div className={styles.contact_form_container}>
         <Form
            form={form}
            onFinish={onFinish}
            autoComplete='off'
            scrollToFirstError
         >
            <div className='grid grid-cols-2 gap-x-[30px] sm:grid-cols-1'>
               <Form.Item
                  name='name'
                  rules={[
                     {
                        required: true,
                        message: 'Please provide your first name',
                     },
                  ]}
               >
                  <Input
                     prefix={
                        <svg
                           width='16'
                           height='18'
                           viewBox='0 0 16 18'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              d='M8 7.33317C9.41667 7.33317 10.55 6.20817 10.55 4.83317C10.55 3.45817 9.41667 2.33317 8 2.33317C6.58333 2.33317 5.45 3.45817 5.45 4.83317C5.45 6.20817 6.58333 7.33317 8 7.33317ZM8 8.99984C5.66667 8.99984 3.78333 7.13317 3.78333 4.83317C3.78333 2.53317 5.66667 0.666504 8 0.666504C10.3333 0.666504 12.2167 2.53317 12.2167 4.83317C12.2167 7.13317 10.3333 8.99984 8 8.99984ZM2.16667 15.6665H13.8333V14.5582C13.8333 13.0998 11.9083 11.5915 8 11.5915C4.09167 11.5915 2.16667 13.0998 2.16667 14.5582V15.6665ZM8 9.92484C13.55 9.92484 15.5 12.6998 15.5 14.5582V17.3332H0.5V14.5582C0.5 12.6998 2.45 9.92484 8 9.92484Z'
                              fill='#A9A9A9'
                           />
                        </svg>
                     }
                     placeholder={translate(
                        lang,
                        'Your First Name',
                        'तपाईंको पहिलो नाम'
                     )}
                  />
               </Form.Item>

               <Form.Item
                  name='lastName'
                  rules={[
                     {
                        required: true,
                        message: 'Please provide your last name',
                     },
                  ]}
               >
                  <Input
                     prefix={
                        <svg
                           width='16'
                           height='18'
                           viewBox='0 0 16 18'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              d='M8 7.33317C9.41667 7.33317 10.55 6.20817 10.55 4.83317C10.55 3.45817 9.41667 2.33317 8 2.33317C6.58333 2.33317 5.45 3.45817 5.45 4.83317C5.45 6.20817 6.58333 7.33317 8 7.33317ZM8 8.99984C5.66667 8.99984 3.78333 7.13317 3.78333 4.83317C3.78333 2.53317 5.66667 0.666504 8 0.666504C10.3333 0.666504 12.2167 2.53317 12.2167 4.83317C12.2167 7.13317 10.3333 8.99984 8 8.99984ZM2.16667 15.6665H13.8333V14.5582C13.8333 13.0998 11.9083 11.5915 8 11.5915C4.09167 11.5915 2.16667 13.0998 2.16667 14.5582V15.6665ZM8 9.92484C13.55 9.92484 15.5 12.6998 15.5 14.5582V17.3332H0.5V14.5582C0.5 12.6998 2.45 9.92484 8 9.92484Z'
                              fill='#A9A9A9'
                           />
                        </svg>
                     }
                     placeholder={translate(
                        lang,
                        'Your Last Name',
                        'तपाईंको थर'
                     )}
                  />
               </Form.Item>
               <Form.Item
                  name='phone'
                  rules={[
                     {
                        required: true,
                        message: 'Please provide your phone number',
                     },
                     ({}) => ({
                        validator(_, value) {
                           // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                           if (value.length === 10) {
                              return Promise.resolve();
                           }
                           return Promise.reject(
                              'Please enter valid phone number'
                           );
                        },
                     }),
                  ]}
               >
                  <Input
                     type='number'
                     prefix={
                        <svg
                           width='18'
                           height='18'
                           viewBox='0 0 18 18'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M3.07673 0.110698C2.45255 0.252456 2.0352 0.497456 1.47536 1.05078C0.674463 1.8423 0.273057 2.6307 0.110166 3.7321C-0.0370216 4.72749 0.163135 6.08882 0.621181 7.20746C1.43395 9.19249 2.8404 11.2 4.77997 13.1435C6.81403 15.1816 8.91181 16.6442 10.9398 17.438C12.281 17.9629 13.8102 18.0871 14.9375 17.7626C16.0984 17.4285 17.1124 16.5792 17.6342 15.5039C18.1011 14.5419 18.0287 13.5503 17.4443 12.9003C17.2728 12.7096 14.607 10.7885 14.0357 10.4439C13.628 10.198 13.2926 10.0937 12.9095 10.0937C12.2945 10.0937 11.8648 10.318 11.0942 11.0412L10.6464 11.4614L10.2978 11.2282C9.41013 10.6344 7.6345 8.87996 6.84485 7.81636C6.47294 7.31542 6.46751 7.38648 6.91411 6.9091C7.63622 6.13722 7.85763 5.75378 7.89474 5.21093C7.91974 4.84535 7.84106 4.5221 7.62849 4.11718C7.4581 3.79257 5.45478 0.947338 5.22079 0.697573C5.01478 0.477729 4.74981 0.303549 4.43981 0.184174C4.11352 0.0585494 3.46122 0.023354 3.07673 0.110698ZM3.16661 1.3857C2.86532 1.48933 2.66544 1.61921 2.36466 1.90683C1.9079 2.34355 1.58634 2.88749 1.41587 3.51171C1.29161 3.96675 1.2913 4.89585 1.41521 5.51671C1.72403 7.06433 2.7295 8.88995 4.33876 10.8251C5.91376 12.7189 8.03036 14.5259 9.87888 15.5548C10.4242 15.8583 11.3927 16.3085 11.7734 16.4354C12.9295 16.8209 14.3355 16.7625 15.2269 16.292C15.8363 15.9703 16.4477 15.27 16.6229 14.6928C16.7199 14.3738 16.7067 14.0353 16.5896 13.8342C16.5386 13.7466 16.0481 13.3747 15.0136 12.6393C13.5673 11.6111 13.0824 11.3047 12.9017 11.3047C12.7127 11.3047 12.4402 11.498 11.9234 11.9985C11.2968 12.6054 11.1192 12.71 10.7139 12.7105C10.4015 12.711 10.2194 12.6507 9.82622 12.4165C8.7452 11.7726 6.49017 9.54285 5.65985 8.29687C5.3531 7.83652 5.23384 7.50628 5.26161 7.1939C5.29165 6.85605 5.39907 6.68429 5.92915 6.12671C6.67669 5.34035 6.75583 5.16999 6.56337 4.76171C6.47114 4.56601 4.51122 1.77472 4.31771 1.56343C4.07849 1.30226 3.61657 1.23093 3.16661 1.3857Z'
                              fill='#A9A9A9'
                           />
                        </svg>
                     }
                     min={10}
                     placeholder={translate(lang, 'Phone number', 'फोन नम्बर')}
                  />
               </Form.Item>
               <Form.Item
                  name='email'
                  rules={[
                     {
                        type: 'email',
                        required: true,
                        message: 'Please provide your email',
                     },
                  ]}
               >
                  <Input
                     prefix={
                        <svg
                           width='20'
                           height='16'
                           viewBox='0 0 20 16'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              d='M2.17079 0.5H17.8305C18.5684 0.5 19.1673 1.172 19.1673 2V14C19.1673 14.3978 19.0265 14.7794 18.7758 15.0607C18.5251 15.342 18.1851 15.5 17.8305 15.5H2.17079C1.81625 15.5 1.47623 15.342 1.22553 15.0607C0.974826 14.7794 0.833984 14.3978 0.833984 14V2C0.833984 1.172 1.43287 0.5 2.17079 0.5ZM1.97982 4.28171V14C1.97982 14.1183 2.06537 14.2143 2.17079 14.2143H17.8305C17.8812 14.2143 17.9297 14.1917 17.9655 14.1515C18.0014 14.1113 18.0215 14.0568 18.0215 14V4.28171L10.7493 9.79571C10.297 10.1386 9.70426 10.1386 9.25204 9.79571L1.97982 4.28171ZM1.97982 2V2.73029L9.89371 8.73029C9.92529 8.75424 9.96253 8.76704 10.0007 8.76704C10.0388 8.76704 10.076 8.75424 10.1076 8.73029L18.0215 2.73029V2C18.0215 1.94317 18.0014 1.88866 17.9655 1.84848C17.9297 1.80829 17.8812 1.78571 17.8305 1.78571H2.17079C2.12014 1.78571 2.07157 1.80829 2.03575 1.84848C1.99994 1.88866 1.97982 1.94317 1.97982 2Z'
                              fill='#A9A9A9'
                           />
                        </svg>
                     }
                     placeholder={translate(lang, 'Email Address', 'इमेल')}
                  />
               </Form.Item>
            </div>
            <Form.Item
               name='subject'
               rules={[
                  {
                     required: true,
                     message: 'Please enter subject',
                  },
               ]}
            >
               <Input
                  placeholder={translate(lang, 'Subject', 'विषय')}
                  className='h-[50px]'
               />
            </Form.Item>
            <Form.Item
               name='message'
               rules={[
                  {
                     required: true,
                     message: 'Please enter message',
                  },
               ]}
            >
               <TextArea
                  rows={4}
                  placeholder={translate(
                     lang,
                     'Enter message',
                     'सन्देश प्रविष्ट गर्नुहोस्'
                  )}
               />
            </Form.Item>

            <Form.Item>
               <Button
                  type='primary'
                  htmlType='submit'
                  className='!h-[50px] w-[113px] !bg-[#0C62BB] !text-[16px] font-medium sm:w-full'
               >
                  {translate(lang, 'Submit', 'पेश गर्नुहोस्')}
               </Button>
            </Form.Item>
         </Form>
      </div>
   );
}
