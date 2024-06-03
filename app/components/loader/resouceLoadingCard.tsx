import { Skeleton } from 'antd';
import React from 'react';

export default function ResouceLoadingCard() {
   return (
      <div className='flex  h-[145px] w-full justify-between'>
         <div className='grid gap-y-[9px]'>
            <Skeleton.Input active={true} className='!w-[50%]' />
            <Skeleton.Input active={true} />

            <Skeleton.Input active={true} />
         </div>
         <div>
            <Skeleton.Image className='size-[145px]' active={true} />
         </div>
      </div>
   );
}
