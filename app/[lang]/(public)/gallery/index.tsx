'use client';
import { getAllGallery } from '@/api/gallery';
import Breakcrumb from '@/app/components/common/breadcrumb';
import { GALLERY } from '@/constants/querykeys';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { galleryConfig } from './config';
import { Empty, Pagination } from 'antd';
import ImageCard from './imageCard';
import { type Locale } from '@/i18n';
import Link from 'next/link';
import classNames from 'classnames';
import { customCombineArray, translate } from '@/utils/commonRule';
import { type Gallery } from '@/models/gallery';
import { isEmpty } from 'lodash';

export default function Galley({
   params: { lang },
}: {
   params: { lang: Locale };
}) {
   const [config, setConfig] = useState(galleryConfig);
   const { data: galleryData } = useQuery({
      queryFn: () => getAllGallery(config),
      queryKey: queryKeys(GALLERY).list(config),
   });

   const combinedData =
      galleryData && customCombineArray<Gallery>(galleryData.result, 5);

   return (
      <div>
         <div className='  bg-[#F2F2F2] px-[60px] py-[12px] sm:px-[20px]'>
            <span className='mx-auto flex max-w-[1440px]  items-center  justify-between'>
               <Breakcrumb title={translate(lang, 'Gallery', 'ग्यालेरी')} />
            </span>
         </div>
         <section className='mt-[30px] px-[60px] sm:px-[20px]'>
            {isEmpty(galleryData?.result) ? (
               <Empty />
            ) : (
               <article
                  className={classNames(
                     ' mx-auto  flex max-w-[1440px] flex-col gap-x-[20px] gap-y-[25px] sm:gap-[10px]'
                  )}
               >
                  {combinedData?.map((item, id) => (
                     <section key={id}>
                        <article className='grid w-full grid-cols-2 gap-x-[25px] gap-y-[10px] md:grid-cols-1 sm:grid-cols-1 sm:gap-x-[10px]'>
                           {item[0] && (
                              <Link href={`/gallery/${item[0]?.slug}`}>
                                 <ImageCard
                                    className='h-[461px] w-full sm:h-[229px]'
                                    data={item[0]}
                                    lang={lang}
                                 />
                              </Link>
                           )}
                           <div className='grid w-full grid-cols-2 gap-x-[25px] gap-y-[15px] sm:gap-[10px]'>
                              {item[1] && (
                                 <Link href={`/gallery/${item[1]?.slug}`}>
                                    <ImageCard
                                       className='h-[223px] w-full sm:h-[111px]'
                                       data={item[1]}
                                       lang={lang}
                                    />
                                 </Link>
                              )}
                              {item[2] && (
                                 <Link href={`/gallery/${item[2]?.slug}`}>
                                    <ImageCard
                                       className='h-[223px] w-full sm:h-[111px]'
                                       data={item[2]}
                                       lang={lang}
                                    />
                                 </Link>
                              )}
                              {item[3] && (
                                 <Link href={`/gallery/${item[3]?.slug}`}>
                                    <ImageCard
                                       className='h-[223px] w-full sm:h-[111px]'
                                       data={item[3]}
                                       lang={lang}
                                    />
                                 </Link>
                              )}
                              {item[4] && (
                                 <Link href={`/gallery/${item[4]?.slug}`}>
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
         </section>
         <section className=' mt-[60px] flex items-center justify-center md:my-[50px] sm:my-[40px] '>
            <Pagination
               current={config?.page}
               pageSize={config.size}
               total={galleryData?.count}
               hideOnSinglePage
               onChange={(page) => {
                  setConfig((prev) => ({
                     ...prev,
                     page,
                  }));
               }}
            />
         </section>
      </div>
   );
}
