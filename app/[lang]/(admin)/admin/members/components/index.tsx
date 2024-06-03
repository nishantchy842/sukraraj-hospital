import Image from 'next/image';
import Paragraph from 'antd/es/typography/Paragraph';
import { capitalize, startCase } from 'lodash';
import parse from 'html-react-parser';
import { BsTelephone } from 'react-icons/bs';
import { GoMail } from 'react-icons/go';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { MEMBER_EXTRA_TYPE, MEMBER_STATUS, MEMBER_TYPE } from '@/enums/member';
import { type Member } from '@/models/admin/member';
import { type Locale } from '@/i18n';
import { ConfigProvider, Switch } from 'antd';

type Props = {
   data: Member;
   lang: Locale;
   onArchive: (id: Member['id']) => void;
   onUnarchive: (id: Member['id']) => void;
   onEdit: (id: Member['id']) => void;
   onSetExtraType: (id: Member['id']) => void;
   onUnsetExtraType: (id: Member['id']) => void;
};

export const MemberCard: React.FC<Props> = ({
   data,
   lang,
   onArchive,
   onUnarchive,
   onSetExtraType,
   onUnsetExtraType,
   onEdit,
}) => {
   return (
      <div className='flex flex-col gap-[20px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
         <div className='flex gap-[20px]'>
            {data?.image && (
               <div className='relative size-[60px]'>
                  <Image
                     alt={data?.name_En}
                     className='rounded-[5px]'
                     src={BASE_IMAGE_PATH + data?.image}
                     fill
                  />
               </div>
            )}

            <div className='flex flex-1 flex-col'>
               <span className='text-[18px] font-[600] leading-[27px] text-[#505050]'>
                  {data?.[`name_${capitalize(lang) as 'En' | 'Np'}`]}
               </span>

               <span className='text-[16px] font-[600] leading-[27px] text-[#808080]'>
                  Position:{' '}
                  {data?.[`position_${capitalize(lang) as 'En' | 'Np'}`]}
               </span>

               <span className='text-[16px] font-[600] leading-[27px] text-[#808080]'>
                  Branch: {data?.[`branch_${capitalize(lang) as 'En' | 'Np'}`]}
               </span>

               <span className='text-[16px] font-[500] leading-[24px] text-[#3A3C5C]'>
                  Priority:{' '}
                  <span className='text-[#34C38F]'>{data?.priority}</span>
               </span>
            </div>
         </div>

         {(data?.phoneNumbers ?? data?.emails) && (
            <div className='flex flex-col gap-[5px]'>
               <span className='flex items-center gap-[8px] text-[16px] font-[500] leading-[27px] text-[#505050]'>
                  <BsTelephone />
                  {data?.phoneNumbers?.join(', ').toString()}
               </span>

               <span className='flex items-center gap-[8px] text-[16px] font-[500] leading-[27px] text-[#505050]'>
                  <GoMail />
                  {data?.emails?.join(', ').toString()}
               </span>
            </div>
         )}

         {data?.type === MEMBER_TYPE.STAFF && (
            <div className='flex items-center gap-[5px]'>
               <span className='text-[14px] font-[500] leading-[24px] text-[#3A3C5C]'>
                  {startCase(
                     MEMBER_EXTRA_TYPE.INFORMATION_OFFICER.toLowerCase()
                  )}
                  :
               </span>

               <ConfigProvider
                  theme={{
                     components: {
                        Switch: {
                           colorPrimary: '#34C38F',
                           colorPrimaryHover: '#34C38F',
                        },
                     },
                  }}
               >
                  <Switch
                     checked={
                        data?.extraType ===
                        MEMBER_EXTRA_TYPE.INFORMATION_OFFICER
                     }
                     size='small'
                     onChange={(active) => {
                        active
                           ? onSetExtraType(data?.id)
                           : onUnsetExtraType(data?.id);
                     }}
                  />
               </ConfigProvider>
            </div>
         )}

         <div className='flex items-center justify-between'>
            <span
               className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#FF9901] underline'
               onClick={() => {
                  onEdit(data?.id);
               }}
            >
               Edit
            </span>

            <span
               className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === MEMBER_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
               onClick={() => {
                  data?.status === MEMBER_STATUS.ACTIVE
                     ? onArchive(data?.id)
                     : onUnarchive(data?.id);
               }}
            >
               {data?.status === MEMBER_STATUS.ACTIVE ? 'Archive' : 'Active'}
            </span>
         </div>
      </div>
   );
};

export const BoardMemberCard: React.FC<Props> = ({
   data,
   lang,
   onArchive,
   onUnarchive,
   onSetExtraType,
   onUnsetExtraType,
   onEdit,
}) => {
   return (
      <div className='flex gap-[20px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
         {data?.image && (
            <div className='relative size-[80px]'>
               <Image
                  alt={data?.name_En}
                  className='rounded-[5px]'
                  src={BASE_IMAGE_PATH + data?.image}
                  fill
               />
            </div>
         )}

         <div className='flex flex-1 flex-col gap-[10px]'>
            <span className='text-[18px] font-[600] leading-[27px] text-[#505050]'>
               {data?.[`name_${capitalize(lang) as 'En' | 'Np'}`]}{' '}
               {data?.[`position_${capitalize(lang) as 'En' | 'Np'}`] && (
                  <span className='text-[#808080]'>
                     | {data?.[`position_${capitalize(lang) as 'En' | 'Np'}`]}
                  </span>
               )}{' '}
               {data?.[`branch_${capitalize(lang) as 'En' | 'Np'}`] && (
                  <span className='text-[#808080]'>
                     | {data?.[`branch_${capitalize(lang) as 'En' | 'Np'}`]}
                  </span>
               )}
            </span>

            <Paragraph
               className='prose !mb-0 min-w-full text-[16px] font-[500] leading-[27px] text-[#495057]'
               ellipsis={{
                  rows: 3,
                  expandable: true,
                  symbol: (
                     <div className='flex items-center gap-[5px] text-[16px] font-[500] leading-[27px] text-[#0C62BB]'>
                        See more <IoIosArrowDropdownCircle />
                     </div>
                  ),
               }}
            >
               {parse(
                  data?.[`message_${capitalize(lang) as 'En' | 'Np'}`] ?? ''
               )}
            </Paragraph>

            <span className='text-[16px] font-[500] leading-[24px] text-[#3A3C5C]'>
               Priority:{' '}
               <span className='text-[#34C38F]'>{data?.priority}</span>
            </span>

            <div className='flex items-center gap-[5px]'>
               <span className='text-[14px] font-[500] leading-[24px] text-[#3A3C5C]'>
                  {startCase(
                     MEMBER_EXTRA_TYPE.DEVELOPMENT_COMMITTEE.toLowerCase()
                  )}
                  :
               </span>

               <ConfigProvider
                  theme={{
                     components: {
                        Switch: {
                           colorPrimary: '#34C38F',
                           colorPrimaryHover: '#34C38F',
                        },
                     },
                  }}
               >
                  <Switch
                     checked={
                        data?.extraType ===
                        MEMBER_EXTRA_TYPE.DEVELOPMENT_COMMITTEE
                     }
                     size='small'
                     onChange={(active) => {
                        active
                           ? onSetExtraType(data?.id)
                           : onUnsetExtraType(data?.id);
                     }}
                  />
               </ConfigProvider>
            </div>

            <div className='flex items-center justify-between'>
               <span
                  className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#FF9901] underline'
                  onClick={() => {
                     onEdit(data?.id);
                  }}
               >
                  Edit
               </span>

               <span
                  className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === MEMBER_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                  onClick={() => {
                     data?.status === MEMBER_STATUS.ACTIVE
                        ? onArchive(data?.id)
                        : onUnarchive(data?.id);
                  }}
               >
                  {data?.status === MEMBER_STATUS.ACTIVE ? 'Archive' : 'Active'}
               </span>
            </div>
         </div>
      </div>
   );
};
