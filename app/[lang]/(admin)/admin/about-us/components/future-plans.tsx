import Link from 'next/link';
import { Button } from 'antd';
import { capitalize } from 'lodash';
import parse from 'html-react-parser';
import { type AboutUs } from '@/models/admin/about-us';
import { type Locale } from '@/i18n';

type Props = {
   lang: Locale;
   data: AboutUs;
};

export const FuturePlans: React.FC<Props> = ({ data, lang }) => {
   return (
      <div className='flex flex-col gap-[20px]'>
         <Link
            href={`/${lang}/admin/about-us/update/future-plans`}
            className='self-end'
         >
            <Button className='admin-primary-btn w-fit' type='primary'>
               Add / Edit Future Plans
            </Button>
         </Link>

         <div className='flex flex-col gap-[30px] rounded-[10px] border-[1px] border-[#E6EDEF] bg-white p-[20px]'>
            <div className='flex flex-col gap-[10px]'>
               <span className='text-[20px] font-[600] leading-[34px] text-[#303030]'>
                  Sukraraj Tropical & Infectious Diseases Future plans
               </span>

               <div className='prose min-w-full text-[18px] font-[400] leading-[35px] text-[#505050]'>
                  {parse(
                     data?.[`futurePlan_${capitalize(lang) as 'En' | 'Np'}`] ??
                        ''
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
