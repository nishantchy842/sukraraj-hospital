import { Skeleton } from 'antd';
import React from 'react';

export default function ServiceCardLoader() {
   return (
      <div className='grid gap-y-[10px]'>
         <Skeleton.Image className='!h-[219px] !w-full' active={true} />
         <Skeleton.Input active={true} className='!w-[50%]' block={false} />
         <Skeleton.Input active={true} />

         <Skeleton.Input active={true} />
      </div>
   );
}
