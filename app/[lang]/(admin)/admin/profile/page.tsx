'use client';

import { Fragment } from 'react';
import { Tabs } from 'antd';
import Breadcrumb from '@/app/[lang]/(admin)/admin/common/Breadcrumb';
import ProfileSettings from './components/profile-settings';
import ChangePassword from './components/change-password';

const UpdateProfile = () => {
   return (
      <Fragment>
         <Breadcrumb items={[{ path: 'profile' }, {}]} />

         <Tabs
            items={[
               {
                  key: 'profile-settings',
                  label: 'Profile Settings',
                  children: <ProfileSettings />,
               },
               {
                  key: 'change-password',
                  label: 'Change Password',
                  children: <ChangePassword />,
               },
            ]}
         />
      </Fragment>
   );
};

export default UpdateProfile;
