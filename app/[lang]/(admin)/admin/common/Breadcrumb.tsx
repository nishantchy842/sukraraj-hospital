import Link from 'next/link';
import { Breadcrumb as AntdBreadcrumb } from 'antd';
import { startCase } from 'lodash';
import { type Path } from '@/app/[lang]/(admin)/admin/config';

type Props = {
   items: [{ path: Path; title?: string }, { title?: string }];
};

const Breadcrumb: React.FC<Props> = ({ items }) => {
   return (
      <AntdBreadcrumb
         items={[
            {
               title: (
                  <div className='flex items-center gap-[7px]'>
                     <Link
                        className={`text-[24px] font-[700] leading-[40px] ${items?.[1]?.title ? '!text-[#808080]' : '!text-[#303030]'}`}
                        href={`/admin/${items[0].path}`}
                     >
                        {startCase(items[0].path.replaceAll('-', ' '))}
                     </Link>

                     {items[0]?.title && (
                        <p className='text-[24px] font-[700] leading-[40px] text-[#0C62BB]'>
                           #{items[0]?.title}
                        </p>
                     )}
                  </div>
               ),
            },
            {
               title: (
                  <p className='text-[24px] font-[700] leading-[40px] text-[#0C62BB]'>
                     {items[1]?.title}
                  </p>
               ),
            },
         ]}
         separator={
            items[1]?.title ? (
               <span className='text-[24px] font-[700] leading-[40px] text-[#303030]'>
                  /
               </span>
            ) : null
         }
      />
   );
};

export default Breadcrumb;
