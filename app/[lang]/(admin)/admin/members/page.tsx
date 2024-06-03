'use client';

import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Pagination, Tabs } from 'antd';
import { startCase } from 'lodash';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
import { BoardMemberCard, MemberCard } from './components';
import { useAuth, withPrivilege } from '@/auth';
import { memberApi } from '@/api/admin/member';
import {
   errorNotification,
   getRole,
   queryKeys,
   successNotification,
} from '@/utils';
import { MEMBER } from '@/constants/admin/queryKeys';
import { MEMBER_EXTRA_TYPE, MEMBER_STATUS, MEMBER_TYPE } from '@/enums/member';
import { ROLE_NAME } from '@/enums/role';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';
import { type Member } from '@/models/admin/member';

type MemberTabProps = {
   data: Member[];
   lang: Locale;
   role: ROLE_NAME;
   activeTab: MEMBER_TYPE;
};

const MemberTab: React.FC<MemberTabProps> = ({
   data,
   lang,
   role,
   activeTab,
}) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const handleArchiveMember = useMutation(
      (id: Member['id']) =>
         memberApi[role]?.updateMember({
            id,
            status: MEMBER_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(MEMBER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveMember = useMutation(
      (id: Member['id']) =>
         memberApi.SUPER_ADMIN.updateMember({
            id,
            status: MEMBER_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(MEMBER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleSetBoardMemberExtraType = useMutation(
      (id: Member['id']) =>
         memberApi[role]?.updateMember({
            id,
            extraType: MEMBER_EXTRA_TYPE.DEVELOPMENT_COMMITTEE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(MEMBER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnsetBoardMemberExtraType = useMutation(
      (id: Member['id']) =>
         memberApi[role]?.updateMember({
            id,
            extraType: null,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(MEMBER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleSetStaffMemberExtraType = useMutation(
      (id: Member['id']) =>
         memberApi[role]?.updateMember({
            id,
            extraType: MEMBER_EXTRA_TYPE.INFORMATION_OFFICER,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(MEMBER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnsetStaffMemberExtraType = useMutation(
      (id: Member['id']) =>
         memberApi[role]?.updateMember({
            id,
            extraType: null,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(MEMBER).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <div className='mt-[20px] flex flex-col gap-[20px]'>
         <div className='flex gap-[30px] text-[16px] font-[500] leading-[27px] text-[#808080]'>
            {Object.values(MEMBER_TYPE)
               .reverse()
               .map((type) => (
                  <span
                     key={type}
                     className={`cursor-pointer ${type === activeTab && 'text-[#0C62BB]'}`}
                     onClick={() => {
                        router.push(`/${lang}/admin/members?tab=${type}`);
                     }}
                  >
                     {startCase(type.toLowerCase())}
                  </span>
               ))}
         </div>

         {activeTab === MEMBER_TYPE.BOARD_MEMBER ? (
            <div className='flex flex-col gap-[20px]'>
               {data?.map((member) => (
                  <BoardMemberCard
                     key={member?.id}
                     data={member}
                     lang={lang}
                     onArchive={handleArchiveMember.mutate}
                     onUnarchive={handleUnarchiveMember.mutate}
                     onSetExtraType={handleSetBoardMemberExtraType.mutate}
                     onUnsetExtraType={handleUnsetBoardMemberExtraType.mutate}
                     onEdit={(id) => {
                        router.push(`/${lang}/admin/members/create?id=${id}`);
                     }}
                  />
               ))}
            </div>
         ) : (
            <div className='grid grid-cols-4 gap-[20px]'>
               {data?.map((member) => (
                  <MemberCard
                     key={member?.id}
                     data={member}
                     lang={lang}
                     onArchive={handleArchiveMember.mutate}
                     onUnarchive={handleUnarchiveMember.mutate}
                     onSetExtraType={handleSetStaffMemberExtraType.mutate}
                     onUnsetExtraType={handleUnsetStaffMemberExtraType.mutate}
                     onEdit={(id) => {
                        router.push(`/${lang}/admin/members/create?id=${id}`);
                     }}
                  />
               ))}
            </div>
         )}
      </div>
   );
};

type Props = {
   params: {
      lang: Locale;
   };
   searchParams: {
      tab?: MEMBER_TYPE;
   };
};

const initialConfig = {
   pagination: true,
   page: 1,
   size: 10,
   name: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as const,
   status: MEMBER_STATUS.ACTIVE,
   type: MEMBER_TYPE.BOARD_MEMBER,
};

const Members: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const { authUser } = useAuth();

   const activeTab =
      searchParams?.tab &&
      Object.values(MEMBER_TYPE).includes(searchParams?.tab)
         ? searchParams.tab
         : MEMBER_TYPE.BOARD_MEMBER;

   const [config, setConfig] = useState(initialConfig);

   const { data: members } = useQuery({
      queryFn: () => memberApi[getRole()]?.getMembers(config),
      queryKey: queryKeys(MEMBER).list(config),
   });

   const tabItems = [
      {
         key: MEMBER_STATUS.ACTIVE,
         label: 'Active Member',
         children: (
            <MemberTab
               activeTab={activeTab}
               data={members?.result ?? []}
               lang={params.lang}
               role={getRole()}
            />
         ),
      },
   ];

   const superAdminTabItems = [
      {
         key: MEMBER_STATUS.ACTIVE,
         label: 'Active Member',
         children: (
            <MemberTab
               activeTab={activeTab}
               data={members?.result ?? []}
               lang={params.lang}
               role={getRole()}
            />
         ),
      },
      {
         key: MEMBER_STATUS.ARCHIVED,
         label: 'Archived Member',
         children: (
            <MemberTab
               activeTab={activeTab}
               data={members?.result ?? []}
               lang={params.lang}
               role={getRole()}
            />
         ),
      },
   ];

   useEffect(() => {
      setConfig((prev) => ({
         ...prev,
         type: activeTab,
      }));
   }, [activeTab]);

   return (
      <Fragment>
         <div className='flex items-center justify-between'>
            <Breadcrumb items={[{ path: 'members' }, {}]} />

            <div className='flex gap-[15px]'>
               <Search
                  placeholder='Search members'
                  onChange={(e) => {
                     setConfig((prev) => ({
                        ...prev,
                        page: 1,
                        name: e.target.value,
                     }));
                  }}
               />

               <Button
                  className='admin-primary-btn'
                  type='primary'
                  onClick={() => {
                     router.push(`/${params.lang}/admin/members/create`);
                  }}
               >
                  + Add Member
               </Button>
            </div>
         </div>

         {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
            <Tabs
               items={superAdminTabItems}
               onTabClick={(key) => {
                  setConfig((prev) => ({
                     ...prev,
                     status: key as MEMBER_STATUS,
                  }));
               }}
            />
         ) : (
            <Tabs items={tabItems} />
         )}

         <Pagination
            className='flex w-full justify-between'
            current={config.page}
            pageSize={config.size}
            showTotal={(total) => `Total ${total} items`}
            total={members?.count}
            onChange={(page, size) => {
               setConfig((prev) => ({ ...prev, page, size }));
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(Members, PRIVILEGE_NAME.MEMBER);
