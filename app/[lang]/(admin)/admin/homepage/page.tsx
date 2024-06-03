'use client';

import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { Tabs } from 'antd';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import { withPrivilege } from '@/auth';
import { Banners } from './components/banners';
import { DailyCapacityStat } from './components/daily-capacity-stat';
import { BasicInformation } from './components/basic-information';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Locale } from '@/i18n';

type Props = {
   params: { lang: Locale };
   searchParams: {
      tab?: string;
   };
};

const Homepage: React.FC<Props> = ({ params, searchParams }) => {
   const router = useRouter();

   return (
      <Fragment>
         <Breadcrumb items={[{ path: 'homepage' }, {}]} />

         <Tabs
            activeKey={searchParams.tab}
            items={[
               {
                  key: 'banners',
                  label: 'Banners',
                  children: <Banners lang={params.lang} />,
               },
               {
                  key: 'daily-capacity-stat',
                  label: 'Daily Capacity Stat',
                  children: <DailyCapacityStat lang={params.lang} />,
               },
               {
                  key: 'basic-information',
                  label: 'Basic Information',
                  children: <BasicInformation />,
               },
            ]}
            onTabClick={(key) => {
               router.push(`/${params.lang}/admin/homepage?tab=${key}`);
            }}
         />
      </Fragment>
   );
};

export default withPrivilege(Homepage, PRIVILEGE_NAME.HOMEPAGE);
