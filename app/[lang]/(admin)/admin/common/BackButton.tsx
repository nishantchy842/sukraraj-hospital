import { useRouter } from 'next/navigation';
import { MdOutlineArrowBack } from 'react-icons/md';

export default function BackButton() {
   const router = useRouter();
   return (
      <div
         className='absolute top-[32px] flex w-max cursor-pointer items-center gap-[4px] text-[14px] font-[600] leading-[0px] text-[#0C62BB]'
         onClick={() => {
            router.back();
         }}
      >
         <MdOutlineArrowBack />
         Go Back
      </div>
   );
}
