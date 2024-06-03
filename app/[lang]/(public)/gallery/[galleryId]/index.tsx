'use client';
import { getGalleryDetails } from '@/api/gallery';
import { GALLERY } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { useQuery } from '@tanstack/react-query';

import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CarouselModal } from './carouselModal';
import { type CarouselRef } from 'antd/es/carousel';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { VideoPlayerIcon } from '@/app/components/commonIcon/socialMediaIcon';
import Image from 'next/image';
import { VIDEO_UPLOAD_TYPE } from '@/enums/gallery';
import fallback from '@/public/staticProfile.svg';

export default function GalleryDetails({
   params: { lang, galleryId },
}: {
   params: { lang: Locale; galleryId: string };
}) {
   const { data } = useQuery({
      queryFn: () => getGalleryDetails(galleryId),
      queryKey: queryKeys(GALLERY).detail(galleryId),
   });

   const [modalOpen, setModalOpen] = useState(false);

   const [currentIndex, setCurrentIndex] = useState(0);

   const messageref = useRef<CarouselRef>(null);

   const { images = [], videos = [] } = data ?? {};

   const imageVideo = [...(images ?? []), ...(videos ?? [])];

   return (
      <div>
         <section className='mt-[30px]  px-[60px] sm:px-[20px]'>
            <article className='mx-auto max-w-[1440px]'>
               <p className=' mb-[20px] text-[28px] font-semibold leading-[32px] text-grey30'>
                  {lang === 'en' ? data?.title_En : data?.title_Np}
               </p>
               <div className='grid grid-cols-3 gap-[30px] md:grid-cols-2 sm:grid-cols-1'>
                  {imageVideo?.map((content, id) => (
                     <div
                        key={content.link}
                        className='h-[300px] w-full  cursor-pointer md:h-[254px]'
                        onClick={() => {
                           setModalOpen(() => true);
                           setCurrentIndex(id);
                        }}
                     >
                        <div className=' relative size-full'>
                           {content.type ? (
                              content.type === VIDEO_UPLOAD_TYPE.URL ? (
                                 <iframe
                                    className='pointer-events-none absolute left-0 top-0 size-full'
                                    src={content.link}
                                 />
                              ) : (
                                 <video
                                    className='pointer-events-none absolute left-0 top-0 size-full'
                                    src={BASE_IMAGE_URL + content.link}
                                    controls={false}
                                 />
                              )
                           ) : (
                              <Image
                                 className='!h-full !w-full object-cover'
                                 src={
                                    content.link
                                       ? BASE_IMAGE_URL + content.link
                                       : fallback
                                 }
                                 alt='image'
                                 fill
                                 sizes='100%'
                                 quality={100}
                              />
                           )}
                           {content.type && (
                              <div className=' absolute  left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50px]'>
                                 <VideoPlayerIcon />
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </article>
         </section>

         {modalOpen &&
            createPortal(
               <CarouselModal
                  setModalOpen={setModalOpen}
                  data={imageVideo}
                  lang={lang}
                  ref={messageref}
                  currentIndex={currentIndex}
               />,

               document.body
            )}
      </div>
   );
}
