'use client';

import Link from 'next/link';
import { Fragment, useState, type Key } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from 'antd';
import moment from 'moment';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { contactApi } from '@/api/admin/contact';
import { getRole, queryKeys } from '@/utils';
import { withPrivilege } from '@/auth';
import { CONTACT } from '@/constants/admin/queryKeys';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';

type Props = {
   params: { lang: Locale };
};

const initialConfig = {
   pagination: true,
   page: 1,
   size: 10,
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as const,
};

const Contacts: React.FC<Props> = () => {
   const [config, setConfig] = useState(initialConfig);

   const { data: contacts } = useQuery({
      queryFn: () => contactApi[getRole()]?.getContacts(config),
      queryKey: queryKeys(CONTACT).list(config),
   });

   return (
      <Fragment>
         <Breadcrumb items={[{ path: 'contact-us' }, {}]} />

         <div className='flex flex-col gap-[20px]'>
            {contacts?.result?.map((contact) => (
               <div
                  key={contact?.id}
                  className='flex flex-col gap-[10px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'
               >
                  <span className='text-[18px] font-[500] leading-[30px] text-[#495057]'>
                     Subject:{' '}
                     <span className='font-[600]'>{contact?.subject}</span>
                  </span>

                  <span className='text-[16px] font-[400] leading-[24px] text-[#505050]'>
                     {contact?.message}
                  </span>

                  <div className='relative flex items-center gap-[50px]'>
                     <span className='text-[16px] font-[500] leading-[27px] text-[#505050]'>
                        Name:{' '}
                        <span className='font-[600]'>{contact?.name}</span>
                     </span>

                     <span className='text-[16px] font-[500] leading-[27px] text-[#505050]'>
                        Email:{' '}
                        <Link
                           className='text-[#34C38F]'
                           href={`mailto:${contact?.email}`}
                        >
                           {contact?.email}
                        </Link>
                     </span>

                     <span className='text-[16px] font-[500] leading-[27px] text-[#505050]'>
                        Phone Number:{' '}
                        <Link
                           className='font-[600]'
                           href={`tel:${contact?.phone}`}
                        >
                           {contact?.phone}
                        </Link>
                     </span>

                     <span className='absolute right-0 text-[14px] font-[500] leading-[24px] text-[#808080]'>
                        {moment(contact?.createdAt).format('ll')}
                     </span>
                  </div>
               </div>
            ))}
         </div>

         <Pagination
            className='flex w-full justify-between'
            current={config.page}
            pageSize={config.size}
            showTotal={(total) => `Total ${total} items`}
            total={contacts?.count}
            onChange={(page, size) => {
               setConfig((prev) => ({ ...prev, page, size }));
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(Contacts, PRIVILEGE_NAME.CONTACT);
