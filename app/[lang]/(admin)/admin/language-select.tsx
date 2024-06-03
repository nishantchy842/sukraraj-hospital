import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image, { type StaticImageData } from 'next/image';
import { Dropdown, Space } from 'antd';
import { MdArrowDropDown } from 'react-icons/md';
import { i18n, type Locale } from '@/i18n';

type Props = {
   lang: Locale;
   flags: Map<Locale, StaticImageData>;
};

export default function LanguageSelect({ lang, flags }: Props) {
   const router = useRouter();

   const pathname = usePathname();

   const searchParams = useSearchParams();

   const localeMenu = i18n.locales.map((locale) => ({
      key: locale,
      label: (
         <div className='flex items-center justify-start gap-x-[5px]'>
            <Image
               src={flags.get(locale) as StaticImageData}
               alt='/'
               quality={100}
               width={15}
               height={20}
            />
            <span>
               {new Intl.DisplayNames(['en'], {
                  type: 'language',
               }).of(locale)}
            </span>
         </div>
      ),
      onClick: () => {
         const path = pathname.split('/');

         path.shift();

         path.shift();

         path.unshift('', locale);

         path.push('?' + searchParams.toString());

         router.push(path.join('/'));
      },
   }));

   return (
      <div className='flex flex-col'>
         <label className='text-[12px] font-[500] leading-[20px] text-[rgba(58,60,92,1)]'>
            Language:
         </label>
         <Dropdown
            menu={{
               items: localeMenu,
            }}
         >
            <Space>
               <a className='text-[14px] font-[500] leading-[24px] text-[rgba(184,36,50,1)]'>
                  {new Intl.DisplayNames(['en'], {
                     type: 'language',
                  }).of(lang.toUpperCase())}
               </a>
               <MdArrowDropDown />
            </Space>
         </Dropdown>
      </div>
   );
}
