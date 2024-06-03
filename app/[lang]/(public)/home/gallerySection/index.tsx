import { getAllGallery } from '@/api/gallery';
import { GALLERY } from '@/constants/querykeys';
import { type Gallery } from '@/models/gallery';
import { queryKeys } from '@/utils';
import { customCombineArray } from '@/utils/commonRule';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import ImageCard from '../../gallery/imageCard';
import { type Locale } from '@/i18n';
import { useRouter } from 'next/navigation';
import { isEmpty } from 'lodash';
import { Empty } from 'antd';

export default function GallerySection({ lang }: { lang: Locale }) {
   const router = useRouter();

   const { data: galleryData } = useQuery({
      queryFn: () =>
         getAllGallery({
            pagination: true,
            size: 5,
            order: 'DESC',
            sort: 'updatedAt',
         }),
      queryKey: queryKeys(GALLERY).list({ size: 5 }),
   });

   const combinedData =
      galleryData && customCombineArray<Gallery>(galleryData.result, 5);

   if (!isEmpty(galleryData?.result)) {
      return (
         <section className=' border-y bg-[#FAFAFA] px-[60px] pb-[40px] pt-[51px] md:border-b md:px-[50px] sm:border-b sm:px-[20px]'>
            <article className='mx-auto max-w-[1440px]'>
               <p className='relative mb-[30px] text-center text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:left-[50%] before:h-[2px] before:w-[40px] before:translate-x-[-50%] before:rounded-[5px] before:bg-secondary md:text-[32px] md:leading-[53px] sm:text-[26px] sm:leading-[43px]'>
                  {lang === 'en' ? 'Our Gallery' : 'हाम्रो ग्यालेरी'}
               </p>
               <div>
                  <section>
                     {isEmpty(combinedData) ? (
                        <Empty />
                     ) : (
                        <article
                           className={classNames(
                              ' mx-auto  flex max-w-[1440px] flex-col gap-x-[20px] gap-y-[25px]'
                           )}
                        >
                           {combinedData?.map((item, id) => (
                              <section key={id}>
                                 <article className='grid w-full grid-cols-2 gap-x-[25px] md:grid-cols-1 md:gap-y-[20px] sm:grid-cols-1 sm:gap-y-[10px] '>
                                    {item[0] && (
                                       <Link href={`/gallery/${item[0]?.slug}`}>
                                          <ImageCard
                                             data={item[0]}
                                             className='h-[461px] w-full sm:h-[229px]'
                                             lang={lang}
                                          />
                                       </Link>
                                    )}
                                    <div className='grid w-full grid-cols-2 gap-x-[25px] gap-y-[15px] sm:gap-[10px]'>
                                       {item[1] && (
                                          <Link
                                             href={`/gallery/${item[1]?.slug}`}
                                          >
                                             <ImageCard
                                                className='h-[223px] w-full sm:h-[111px]'
                                                data={item[1]}
                                                lang={lang}
                                             />
                                          </Link>
                                       )}
                                       {item[2] && (
                                          <Link
                                             href={`/gallery/${item[2]?.slug}`}
                                          >
                                             <ImageCard
                                                className='h-[223px] w-full sm:h-[111px]'
                                                data={item[2]}
                                                lang={lang}
                                             />
                                          </Link>
                                       )}
                                       {item[3] && (
                                          <Link
                                             href={`/gallery/${item[3]?.slug}`}
                                          >
                                             <ImageCard
                                                className='h-[223px] w-full sm:h-[111px]'
                                                data={item[3]}
                                                lang={lang}
                                             />
                                          </Link>
                                       )}
                                       {item[4] && (
                                          <Link
                                             href={`/gallery/${item[4]?.slug}`}
                                          >
                                             <ImageCard
                                                className='h-[223px] w-full sm:h-[111px]'
                                                data={item[4]}
                                                lang={lang}
                                             />
                                          </Link>
                                       )}
                                    </div>
                                 </article>
                              </section>
                           ))}
                        </article>
                     )}
                     <div className='  mt-[40px] flex w-full items-center justify-center md:mt-[24px] sm:mt-[24px]  sm:flex sm:w-full sm:items-center sm:justify-center'>
                        <button
                           type='button'
                           className=' flex items-center justify-center rounded-[5px] bg-primary px-[38px] py-[11.5px] text-[16px] font-medium leading-[26px] text-white sm:w-full'
                           onClick={() => {
                              router.push('/gallery');
                           }}
                        >
                           <div className='flex items-center justify-between gap-x-[7px]'>
                              <span>View all</span>
                              <svg
                                 width='6'
                                 height='10'
                                 viewBox='0 0 6 10'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                              >
                                 <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M5.70675 4.2934C5.89402 4.4809 5.99921 4.73507 5.99921 5.00007C5.99921 5.26507 5.89402 5.51923 5.70675 5.70673L1.93609 9.47873C1.74849 9.66624 1.49409 9.77155 1.22885 9.77148C0.963614 9.77142 0.709264 9.666 0.521756 9.4784C0.334247 9.2908 0.228941 9.0364 0.229004 8.77116C0.229066 8.50592 0.334492 8.25157 0.522089 8.06407L3.58609 5.00007L0.522088 1.93607C0.339839 1.74755 0.238924 1.49499 0.241078 1.2328C0.243232 0.970596 0.348283 0.719733 0.533604 0.534237C0.718926 0.348741 0.96969 0.243453 1.23189 0.241052C1.49408 0.23865 1.74673 0.339328 1.93542 0.521398L5.70742 4.29273L5.70675 4.2934Z'
                                    fill='white'
                                 />
                              </svg>
                           </div>
                        </button>
                     </div>
                  </section>
               </div>
            </article>
         </section>
      );
   }
}
