'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useState, type Key } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Pagination, Select, Tabs } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { capitalize } from 'lodash';
import he from 'he';
import moment from 'moment';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import Search from '@/app/[lang]/(admin)/admin/common/Search';
import { useAuth, withPrivilege } from '@/auth';
import { researchApi } from '@/api/admin/research';
import { researchCategoryApi } from '@/api/admin/research-category';
import {
   errorNotification,
   getRole,
   queryKeys,
   replaceUUID,
   successNotification,
} from '@/utils';
import { RESEARCH, RESEARCH_CATEGORY } from '@/constants/admin/queryKeys';
import { RESEARCH_STATUS } from '@/enums/research';
import { ROLE_NAME } from '@/enums/role';
import { type Locale } from '@/i18n';
import { type Research } from '@/models/admin/research';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { PRIVILEGE_NAME } from '@/enums/privilege';

type ResearchCardProps = {
   data: Research;
   lang: Locale;
   role: ROLE_NAME;
};

const ResearchCard: React.FC<ResearchCardProps> = ({ data, lang, role }) => {
   const router = useRouter();

   const queryClient = useQueryClient();

   const handleArchiveResearch = useMutation(
      (slug: Research['slug']) =>
         researchApi[role]?.updateResearch({
            slug,
            status: RESEARCH_STATUS.ARCHIVED,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESEARCH).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   const handleUnarchiveResearch = useMutation(
      (slug: Research['slug']) =>
         researchApi.SUPER_ADMIN.updateResearch({
            slug,
            status: RESEARCH_STATUS.ACTIVE,
         }),
      {
         onSuccess: async (res) => {
            successNotification(res.message);
            await queryClient.refetchQueries(queryKeys(RESEARCH).all);
         },
         onError: (err: FetchError) => errorNotification(err?.message),
      }
   );

   return (
      <div className='flex gap-[20px] rounded-[10px] border-[1px] border-[rgba(230,237,239,1)] bg-white p-[20px]'>
         {data?.previewImage && (
            <div className='relative size-[80px]'>
               <Image
                  alt={data?.slug}
                  src={BASE_IMAGE_PATH + data?.previewImage}
                  fill
               />
            </div>
         )}

         <div className='flex flex-1 flex-col gap-[10px]'>
            <div className='flex items-center justify-between'>
               <span className='text-[18px] font-[500] leading-[26px] text-[#303030]'>
                  {data?.[`title_${capitalize(lang) as 'En' | 'Np'}`]}
               </span>

               <span className='text-[14px] font-[500] leading-[24px] text-[#808080]'>
                  {moment(data?.createdAt).format('ll')}
               </span>
            </div>

            <Paragraph
               className='!mb-0 text-[18px] font-[400] leading-[34px] text-[#505050]'
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
               {he.decode(
                  data?.[`content_${capitalize(lang) as 'En' | 'Np'}`]?.replace(
                     /<[^>]+>/g,
                     ''
                  ) ?? ''
               )}
            </Paragraph>

            <div className='flex items-center justify-between'>
               <div className='flex gap-[30px]'>
                  <div className='flex gap-[5px] text-[16px] font-[500] leading-[27px]'>
                     <span className='text-[#505050]'>Category:</span>
                     <span className='text-[#0C62BB]'>
                        {
                           data?.researchCategory?.[
                              `title_${capitalize(lang) as 'En' | 'Np'}`
                           ]
                        }
                     </span>
                  </div>

                  {data?.downloadFile && (
                     <div className='flex gap-[5px] text-[16px] font-[500] leading-[27px]'>
                        <span className='text-[#505050]'>Attachment:</span>
                        <span className='text-[#0C62BB]'>
                           {replaceUUID(data?.downloadFile, '').replaceAll(
                              'upload/file/',
                              ''
                           )}
                        </span>
                     </div>
                  )}
               </div>

               <div className='flex gap-[20px]'>
                  {data?.downloadFile && (
                     <Link
                        href={BASE_IMAGE_PATH + data?.downloadFile}
                        target='_blank'
                     >
                        <span className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#0C62BB] underline'>
                           View file
                        </span>
                     </Link>
                  )}

                  <span
                     className='cursor-pointer text-[16px] font-[500] leading-[30px] text-[#FF9901] underline'
                     onClick={() => {
                        router.push(
                           `/${lang}/admin/research/list/create?slug=${data?.slug}`
                        );
                     }}
                  >
                     Edit
                  </span>

                  <span
                     className={`cursor-pointer text-[16px] font-[500] leading-[30px] underline ${data?.status === RESEARCH_STATUS.ACTIVE ? 'text-[#B82432]' : 'text-[#34C38F]'}`}
                     onClick={() => {
                        data?.status === RESEARCH_STATUS.ACTIVE
                           ? handleArchiveResearch.mutate(data?.slug)
                           : handleUnarchiveResearch.mutate(data?.slug);
                     }}
                  >
                     {data?.status === RESEARCH_STATUS.ACTIVE
                        ? 'Archive'
                        : 'Active'}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
};

type Props = {
   params: { lang: Locale };
};

const initialConfig = {
   pagination: true,
   page: 1,
   size: 10,
   title: '',
   sort: 'updatedAt' as Key | readonly Key[],
   order: 'DESC' as const,
   researchCategoryId: undefined,
   status: RESEARCH_STATUS.ACTIVE,
};

const Researches: React.FC<Props> = ({ params }) => {
   const router = useRouter();

   const [config, setConfig] = useState(initialConfig);

   const { authUser } = useAuth();

   const { data: researches } = useQuery({
      queryFn: () => researchApi[getRole()]?.getResearches(config),
      queryKey: queryKeys(RESEARCH).list(config),
   });

   const { data: researchCategories, isLoading } = useQuery({
      queryFn: () =>
         researchCategoryApi[getRole()]?.getResearchCategories({
            pagination: false,
         }),
      queryKey: queryKeys(RESEARCH_CATEGORY).list({ pagination: false }),
   });

   const tabItems = [
      {
         key: RESEARCH_STATUS.ACTIVE,
         label: 'Active Research',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {researches?.result?.map((research) => (
                  <ResearchCard
                     key={research.id}
                     data={research}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
   ];

   const superAdminTabItems = [
      {
         key: RESEARCH_STATUS.ACTIVE,
         label: 'Active Research',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {researches?.result?.map((research) => (
                  <ResearchCard
                     key={research.id}
                     data={research}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
      {
         key: RESEARCH_STATUS.ARCHIVED,
         label: 'Archived Research',
         children: (
            <div className='flex flex-col gap-[20px]'>
               {researches?.result?.map((research) => (
                  <ResearchCard
                     key={research.id}
                     data={research}
                     lang={params.lang}
                     role={getRole()}
                  />
               ))}
            </div>
         ),
      },
   ];

   return (
      <Fragment>
         <div className='flex items-center justify-between'>
            <Breadcrumb items={[{ path: 'research/list' }, {}]} />

            <div className='flex gap-[15px]'>
               <Search
                  placeholder='Search researches'
                  onChange={(e) => {
                     setConfig((prev) => ({
                        ...prev,
                        page: 1,
                        title: e.target.value,
                     }));
                  }}
               />

               <Button
                  className='admin-primary-btn'
                  type='primary'
                  onClick={() => {
                     router.push(`/${params.lang}/admin/research/list/create`);
                  }}
               >
                  + Add Research
               </Button>
            </div>
         </div>

         <Form colon={false} layout='vertical'>
            <Form.Item className='w-[200px]'>
               <Select
                  allowClear
                  showSearch
                  // eslint-disable-next-line tailwindcss/no-custom-classname
                  className='form-dropdown'
                  filterOption={(input, option) =>
                     (option?.label?.toLowerCase() ?? '').includes(
                        input.toLowerCase()
                     )
                  }
                  loading={isLoading}
                  options={researchCategories?.result?.map((category) => ({
                     value: category.id,
                     label: category?.[
                        `title_${capitalize(params.lang) as 'En' | 'Np'}`
                     ],
                  }))}
                  placeholder='Filter by Category'
                  onChange={(researchCategoryId) => {
                     setConfig((prev) => ({ ...prev, researchCategoryId }));
                  }}
               />
            </Form.Item>
         </Form>

         {authUser?.role?.name === ROLE_NAME.SUPER_ADMIN ? (
            <Tabs
               items={superAdminTabItems}
               onTabClick={(key) => {
                  setConfig((prev) => ({
                     ...prev,
                     status: key as RESEARCH_STATUS,
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
            total={researches?.count}
            onChange={(page, size) => {
               setConfig((prev) => ({ ...prev, page, size }));
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(Researches, PRIVILEGE_NAME.RESEARCH);
