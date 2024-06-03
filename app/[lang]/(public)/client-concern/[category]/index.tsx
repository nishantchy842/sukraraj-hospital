'use client';

import {
   getAllClientConcern,
   getSingleClientConcernCategory,
} from '@/api/clientConcent';
import { CLIENT_CONCERN, CLIENT_CONCERN_CATEGORY } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { type Locale } from '@/i18n';
import { Collapse, Pagination, type CollapseProps, Input, Empty } from 'antd';
import { clientConcernConfig } from './config';
import Breakcrumb from '@/app/components/common/breadcrumb';
import ClientConcernSidebar from './@sidebar';
import { translate } from '@/utils/commonRule';
import parse from 'html-react-parser';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

export default function ClientConcern({
   params: { lang, category },
}: {
   params: { lang: Locale; category: string };
}) {
   const [config, setConfig] = useState(clientConcernConfig);

   const { data } = useQuery({
      queryFn: () =>
         getAllClientConcern({
            ...config,
            clientConcernCategorySlug: category,
         }),
      queryKey: queryKeys(CLIENT_CONCERN).list(config),
   });

   const { data: clientCategoryDetails } = useQuery({
      queryFn: () => getSingleClientConcernCategory(category),
      queryKey: queryKeys(CLIENT_CONCERN_CATEGORY).detail(category),
   });

   const items: CollapseProps['items'] = data?.result.map((item) => ({
      key: item.id,
      label: lang === 'en' ? item.question_En ?? '' : item.question_Np ?? '',
      children: parse(
         lang === 'en' ? item.answer_En ?? '' : item.answer_Np ?? ''
      ),
   }));

   return (
      <div id={'client_concern'}>
         <section className=' bg-[#F2F2F2] px-[60px] py-[12px] md:px-[50px] sm:px-[20px]'>
            <div className=' mx-auto max-w-[1440px]  '>
               <span className=' flex   items-center  justify-between sm:flex-col sm:items-start sm:justify-start'>
                  <Breakcrumb
                     title={translate(
                        lang,
                        clientCategoryDetails?.title_En ?? '-',
                        clientCategoryDetails?.title_Np ?? '-'
                     )}
                  />
                  <div className='w-[358px] sm:mt-[16px] sm:w-full'>
                     <Input
                        className='h-[50px] '
                        suffix={
                           <svg
                              width='24'
                              height='24'
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                           >
                              <path
                                 d='M10.7702 18.3002C9.28094 18.3002 7.8251 17.8586 6.58679 17.0312C5.34849 16.2038 4.38335 15.0278 3.81342 13.6518C3.2435 12.2759 3.09438 10.7619 3.38492 9.30121C3.67547 7.84053 4.39263 6.49881 5.44572 5.44572C6.49881 4.39263 7.84053 3.67547 9.30121 3.38492C10.7619 3.09438 12.2759 3.2435 13.6518 3.81342C15.0278 4.38335 16.2038 5.34849 17.0312 6.58679C17.8586 7.8251 18.3002 9.28094 18.3002 10.7702C18.3002 11.7591 18.1055 12.7383 17.727 13.6518C17.3486 14.5654 16.794 15.3955 16.0948 16.0948C15.3955 16.794 14.5654 17.3486 13.6518 17.727C12.7383 18.1055 11.7591 18.3002 10.7702 18.3002ZM10.7702 4.75024C9.58355 4.75024 8.42351 5.10213 7.43682 5.76142C6.45012 6.42071 5.68109 7.35778 5.22696 8.45414C4.77283 9.55049 4.65401 10.7569 4.88553 11.9208C5.11704 13.0847 5.68848 14.1538 6.5276 14.9929C7.36671 15.832 8.43581 16.4034 9.5997 16.6349C10.7636 16.8665 11.97 16.7476 13.0663 16.2935C14.1627 15.8394 15.0998 15.0704 15.7591 14.0837C16.4183 13.097 16.7702 11.9369 16.7702 10.7502C16.7702 9.15894 16.1381 7.63282 15.0129 6.5076C13.8877 5.38238 12.3615 4.75024 10.7702 4.75024Z'
                                 fill='#303030'
                              />
                              <path
                                 d='M20 20.75C19.9014 20.7504 19.8038 20.7312 19.7128 20.6934C19.6218 20.6557 19.5392 20.6001 19.47 20.53L15.34 16.4C15.2075 16.2578 15.1354 16.0697 15.1388 15.8754C15.1422 15.6811 15.2209 15.4958 15.3583 15.3583C15.4958 15.2209 15.6811 15.1422 15.8754 15.1388C16.0697 15.1354 16.2578 15.2075 16.4 15.34L20.53 19.47C20.6704 19.6106 20.7493 19.8012 20.7493 20C20.7493 20.1987 20.6704 20.3893 20.53 20.53C20.4607 20.6001 20.3782 20.6557 20.2872 20.6934C20.1961 20.7312 20.0985 20.7504 20 20.75Z'
                                 fill='#303030'
                              />
                           </svg>
                        }
                        placeholder='Search'
                        onChange={(value) => {
                           setConfig((prev) => ({
                              ...prev,
                              question: value.target.value,
                           }));
                        }}
                     />
                  </div>
               </span>
            </div>
         </section>

         <section className='px-[60px] md:px-[50px] sm:px-[20px]'>
            <article className='mx-auto mt-[30px] grid max-w-[1440px] grid-cols-[309px_1fr] gap-x-[31px] md:grid-cols-[189px_1fr]  md:gap-x-[20px] sm:mt-[15px]  sm:grid-cols-1  '>
               <div className=' '>
                  <ClientConcernSidebar params={{ lang, category }} />
               </div>
               {isEmpty(items) ? (
                  <Empty className='py-[10px]' />
               ) : (
                  <div className=' '>
                     <Collapse
                        expandIconPosition={'end'}
                        items={items}
                        bordered={false}
                        expandIcon={({ isActive }) => {
                           return (
                              <svg
                                 width='12'
                                 height='8'
                                 viewBox='0 0 12 8'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                                 className={classNames(
                                    !isActive && ' rotate-180 duration-75'
                                 )}
                              >
                                 <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M5.11724 0.616677C5.35161 0.382593 5.66932 0.25111 6.00057 0.25111C6.33182 0.25111 6.64953 0.382593 6.88391 0.616677L11.5989 5.33001C11.8333 5.56451 11.9649 5.88251 11.9648 6.21406C11.9648 6.5456 11.833 6.86354 11.5985 7.09793C11.364 7.33231 11.046 7.46395 10.7144 7.46387C10.3829 7.46379 10.065 7.33201 9.83057 7.09751L6.00057 3.26751L2.17057 7.09751C1.93493 7.32532 1.61923 7.45147 1.29148 7.44877C0.963734 7.44608 0.650154 7.31477 0.418283 7.08312C0.186414 6.85146 0.0548039 6.53801 0.0518027 6.21026C0.0488016 5.88252 0.174647 5.5667 0.402237 5.33084L5.1164 0.615843L5.11724 0.616677Z'
                                    fill='#303030'
                                 />
                              </svg>
                           );
                        }}
                     />
                     <section className='mx-auto mt-[30px] flex max-w-[1440px] items-center justify-end pb-[108px] sm:justify-center sm:pb-[30px]'>
                        <Pagination
                           current={config?.page}
                           pageSize={config.size}
                           total={data?.count}
                           hideOnSinglePage
                           onChange={(page) => {
                              setConfig((prev) => ({
                                 ...prev,
                                 page,
                              }));
                           }}
                        />
                     </section>
                  </div>
               )}
            </article>
         </section>
      </div>
   );
}
