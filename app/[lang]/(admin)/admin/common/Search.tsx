import { debounce } from '@/utils';
import {
   type ChangeEvent,
   type DetailedHTMLProps,
   type InputHTMLAttributes,
} from 'react';
import { BiSearch } from 'react-icons/bi';

export default function Search({
   onChange,
   ...props
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
   return (
      <div className='flex min-h-[50px] items-center gap-[5px] rounded-[4px] border-[1px] border-[#E6EDEF] bg-white px-[15px]'>
         <input
            {...props}
            className='w-[300px] text-[14px] font-[400] leading-[24px] text-[#808080] outline-none'
            onChange={(event) => {
               debounce<ChangeEvent<HTMLInputElement>>(
                  (e) => onChange?.(e),
                  400
               )(event);
            }}
         />

         <BiSearch className='size-[20px] text-[#808080]' />
      </div>
   );
}
