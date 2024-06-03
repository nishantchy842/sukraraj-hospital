'use client';

import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { Tabs } from 'antd';
import { useQuery } from '@tanstack/react-query';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { Introduction } from './components/introduction';
import { FuturePlans } from './components/future-plans';
import { withPrivilege } from '@/auth';
import { aboutUsApi } from '@/api/admin/about-us';
import { getRole, queryKeys } from '@/utils';
import { ABOUT_US } from '@/constants/admin/queryKeys';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';

type Props = {
   params: { lang: Locale };
   searchParams: {
      tab?: string;
   };
};

const AboutUs: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   const { data: aboutUs } = useQuery({
      queryFn: () => aboutUsApi[getRole()]?.getAboutUs(undefined),
      queryKey: queryKeys(ABOUT_US).details(),
   });

   return (
      <Fragment>
         <Breadcrumb items={[{ path: 'about-us' }, {}]} />

         <Tabs
            activeKey={searchParams?.tab}
            items={[
               {
                  key: 'introduction',
                  label: 'Introduction',
                  children: aboutUs && (
                     <Introduction data={aboutUs} lang={params.lang} />
                  ),
               },
               {
                  key: 'future-plans',
                  label: 'Future Plans',
                  children: aboutUs && (
                     <FuturePlans data={aboutUs} lang={params.lang} />
                  ),
               },
            ]}
            onTabClick={(key) => {
               router.push(`/${params.lang}/admin/about-us?tab=${key}`);
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(AboutUs, PRIVILEGE_NAME.ABOUT_US);
