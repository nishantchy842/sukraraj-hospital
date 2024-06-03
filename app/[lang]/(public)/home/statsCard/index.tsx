import React from 'react';

type PropsType = {
   count: number | string;
   label: string;
};

export default function StatsCard({ data }: { data: PropsType }) {
   return (
      <div className='flex h-[188px] w-[195px] flex-col items-center justify-center rounded-[10px] bg-[#F5F6F8] md:h-[145px] sm:h-[95px] sm:w-full'>
         <p className=' text-[40px] font-bold leading-[66px] text-[#B82432] md:text-[36px] md:leading-[60px] sm:text-[28px] sm:leading-[46px]'>
            {data.count}
         </p>
         <p className=' text-[18px] font-semibold leading-[30px] text-grey30 sm:text-[16px] sm:leading-[26px]'>
            {data.label}
         </p>
      </div>
   );
}
