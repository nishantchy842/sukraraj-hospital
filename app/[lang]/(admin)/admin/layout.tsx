'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image, { type StaticImageData } from 'next/image';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type MenuProps, Menu, Popconfirm } from 'antd';
import Cookie from 'js-cookie';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LanguageSelect from './language-select';
import { AuthContext } from '@/auth';
import { authApi } from '@/api/admin/auth';
import { queryKeys } from '@/utils';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { AUTH } from '@/constants/querykeys';
import { PRIVILEGE_NAME } from '@/enums/privilege';
import { type Path } from './config';
import { type Locale } from '@/i18n';
import BRAND_LOGO from '@/public/admin/assets/brand-logo.png';
import ADMIN_FALLBACK_IMAGE from '@/public/admin/assets/admin.png';
import NEPAL_FLAG from '@/public/nepalFlag.png';
import ENGLISH_FLAG from '@/public/englishFlag.png';

type Props = {
   params: { lang: Locale };
   children: React.ReactNode;
};

export default function RootLayout({ children, params }: Props) {
   const router = useRouter();

   const pathname = usePathname();

   const { data: authUser } = useQuery({
      queryFn: () => authApi.ADMIN.getProfile(undefined),
      queryKey: queryKeys(AUTH).details(),
      onError: (err: FetchError) => {
         if (err?.status === 401) {
            router.push('/auth/login');
         }
      },
   });

   const handleLogout = () => {
      Cookie.remove('token');
      Cookie.remove('role');
      router.push('/auth/login');
   };

   type ArrElement<ArrType> =
      ArrType extends ReadonlyArray<infer ElementType> ? ElementType : never;

   function getItem(
      privilege: PRIVILEGE_NAME | null,
      key: Path,
      label: string,
      icon?: StaticImageData,
      children?: Array<ArrElement<MenuProps['items']>>
   ): ArrElement<MenuProps['items']> & { privilege: PRIVILEGE_NAME | null } {
      return {
         key,
         privilege,
         icon: icon && (
            <div className='relative size-[25px]'>
               <Image alt='icon' src={icon} fill />
            </div>
         ),
         children,
         label,
      };
   }

   const items = [
      getItem(PRIVILEGE_NAME.HOMEPAGE, 'homepage', 'Home Page'),
      getItem(PRIVILEGE_NAME.ABOUT_US, 'about-us', 'About Us'),
      getItem(
         PRIVILEGE_NAME.NOTICE,
         'notice-board/list',
         'Notice Board'
         // undefined, [
         //    getItem('notice-board/list', 'List'),
         // ]
      ),
      getItem(PRIVILEGE_NAME.MEMBER, 'members', 'Members'),
      getItem(PRIVILEGE_NAME.SERVICE, 'services', 'Services'),
      getItem(PRIVILEGE_NAME.DEPARTMENT, 'units', 'Units'),
      getItem(PRIVILEGE_NAME.OPD_SCHEDULE, 'opd-schedule', 'OPD Schedule'),
      getItem(PRIVILEGE_NAME.GALLERY, 'gallery', 'Gallery'),
      getItem(
         PRIVILEGE_NAME.RESOURCE,
         'downloads/list',
         'Downloads / Resources'
         // undefined, [
         //    getItem('downloads/categories', 'Categories'),
         //    getItem('downloads/list', 'List'),
         // ]
      ),
      getItem(
         PRIVILEGE_NAME.RESEARCH,
         'research/list',
         'Research & Academics'
         // undefined, [
         //   getItem('research/categories', 'Categories'),
         //   getItem('research/list', 'List'),
         // ]
      ),
      getItem(
         PRIVILEGE_NAME.CLIENT_CONCERN,
         'client-concern/list',
         'Client Concern'
         // undefined, [
         //    getItem('client-concern/categories', 'Categories'),
         //    getItem('client-concern/list', 'List'),
         // ]
      ),
      getItem(PRIVILEGE_NAME.CONTACT, 'contact-us', 'Contact Us'),
      getItem(PRIVILEGE_NAME.USER, 'users', 'Users'),
      getItem(null, 'profile', 'Profile'),
   ];

   const flags = new Map<Locale, StaticImageData>([
      ['np', NEPAL_FLAG],
      ['en', ENGLISH_FLAG],
   ]);

   return (
      <AuthContext.Provider value={{ authUser }}>
         <ToastContainer />

         <div className='flex w-full overflow-x-hidden' id='admin'>
            <main className='size-full pl-[263px]'>
               <aside className='fixed inset-y-0 left-0 min-h-screen min-w-[263px] overflow-auto border-r-[1px] border-solid border-r-[#E6EDEF] bg-white'>
                  <div className='flex flex-col border-b-[1px] border-solid border-[#E6EDEF] px-[18px] py-[7px] shadow-[1px_4px_20px_#E6EDEF]'>
                     <div className='relative h-[68px] w-[82px]'>
                        <Image alt='logo' src={BRAND_LOGO} fill />
                     </div>

                     <span className='text-[12px] font-[600] leading-[23px] text-[#A94442]'>
                        Government of Nepal
                     </span>

                     <span className='text-[13px] font-[600] leading-[25px] text-[#A94442]'>
                        Ministry of Health and Population
                     </span>

                     <span className='text-[14px] font-[600] leading-[27px] text-[#A94442]'>
                        Sukraraj Tropical & Infectious Diseases
                     </span>
                  </div>

                  {authUser && (
                     <Menu
                        expandIcon={<MdKeyboardArrowDown />}
                        items={[
                           ...items?.filter(({ privilege }) =>
                              authUser?.privileges
                                 ?.map(({ name }) => name)
                                 .includes(privilege ?? '')
                           ),
                           ...items?.filter(
                              ({ privilege }) => privilege === null
                           ),
                        ]}
                        mode='inline'
                        selectedKeys={[
                           pathname.replaceAll(`/${params.lang}/admin/`, ''),
                           pathname
                              .replaceAll(`/${params.lang}/admin/`, '')
                              .split('/')?.[0],
                        ]}
                        theme='light'
                        onClick={(e) => {
                           router.push(`/${params.lang}/admin/${e.key}`);
                        }}
                     />
                  )}
               </aside>

               <header className='flex h-[79px] items-center justify-end gap-[50px] border-b-[1px] border-b-[#e5e5e5] bg-white px-[30px]'>
                  <div className='flex items-center gap-[20px]'>
                     <div className='relative size-[24px]'>
                        <Image
                           alt={params.lang}
                           className='object-contain'
                           src={flags.get(params.lang) as StaticImageData}
                           fill
                        />
                     </div>

                     <Suspense>
                        <LanguageSelect lang={params.lang} flags={flags} />
                     </Suspense>
                  </div>

                  <div className='flex items-center gap-[12px] bg-[#f8f8f8] p-[20px]'>
                     <Popconfirm
                        cancelText='No'
                        className='cursor-pointer'
                        okText='Yes'
                        placement='bottomRight'
                        title='Are you want to logout？'
                        trigger={['hover', 'click']}
                        onConfirm={handleLogout}
                        getPopupContainer={() =>
                           document.getElementById('admin') as HTMLElement
                        }
                     >
                        <div className='relative flex size-[38px] items-start justify-center'>
                           <Image
                              alt='avatar'
                              src={
                                 authUser?.image
                                    ? BASE_IMAGE_PATH + authUser?.image
                                    : ADMIN_FALLBACK_IMAGE
                              }
                              fill
                           />
                        </div>
                     </Popconfirm>
                     <div className='flex flex-col gap-[2px]'>
                        <h1 className='mb-[2px] text-[12px] font-[500] leading-[14px] text-[#495057]'>
                           Welcome!
                        </h1>
                        <h1 className='mb-0 text-[16px] font-[600] leading-[19px] text-[#495057]'>
                           {authUser?.name}
                        </h1>
                     </div>
                  </div>
               </header>

               <section className='flex min-h-[calc(100vh-79px)] flex-col gap-[20px] bg-[#F1F5F9] p-[30px]'>
                  {children}
               </section>
            </main>
         </div>
      </AuthContext.Provider>
   );
}
