'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';
import { type IAuthContext } from '@/interface';
import { type PRIVILEGE_NAME } from '@/enums/privilege';

export const AuthContext = createContext<IAuthContext>({});

export const useAuth = () => useContext(AuthContext);

export const withPrivilege = <T extends object>(
   Component: React.FC<T>,
   privilege: PRIVILEGE_NAME
): React.FC<T> => {
   return function RC(props) {
      const router = useRouter();

      const { authUser } = useAuth();

      useEffect(() => {
         if (authUser) {
            if (
               !authUser?.privileges
                  ?.map(({ name }) => name)
                  .includes(privilege)
            ) {
               router.push('/admin/profile');
            }
         }
      }, [authUser]);

      return <Component {...props} />;
   };
};
