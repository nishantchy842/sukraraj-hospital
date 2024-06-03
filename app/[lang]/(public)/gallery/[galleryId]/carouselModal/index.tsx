'use client';
import { type Locale } from '@/i18n';
import { type Image as imageType } from '@/models/gallery';
import Image from 'next/image';
import React, { type RefObject, useEffect } from 'react';
import { Carousel } from 'antd';
import { type CarouselRef } from 'antd/es/carousel';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import ReactPlayer from 'react-player';
import { converAdToBs, translate } from '@/utils/commonRule';
import parse from 'html-react-parser';
import { VIDEO_UPLOAD_TYPE } from '@/enums/gallery';
import classNames from 'classnames';

// eslint-disable-next-line react/display-name
export const CarouselModal = React.forwardRef(
   (
      props: {
         setModalOpen: (open: boolean) => void;
         data: imageType[];
         lang: Locale;
         currentIndex: number;
      },
      ref
   ) => {
      const prevSlide = () => {
         (ref as RefObject<CarouselRef>)?.current?.prev();
      };

      const nextSlide = () => {
         (ref as RefObject<CarouselRef>)?.current?.next();
      };

      useEffect(() => {
         document.body.style.overflowY = 'hidden';
         (ref as RefObject<CarouselRef>)?.current?.goTo(
            props.currentIndex,
            true
         );
         return () => {
            document.body.style.overflowY = 'scroll';
         };
      }, []);

      return (
         <div>
            <section>
               <div className=' fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-[#505050]/90'>
                  <div
                     className=' absolute z-[-1] size-full'
                     onClick={() => {
                        props.setModalOpen(false);
                     }}
                  ></div>
                  <div className='sm:w-full'>
                     <button
                        type='button'
                        onClick={prevSlide}
                        className=' absolute left-[4%] top-[50%] z-40 translate-x-[-0] translate-y-[-50%] cursor-pointer   p-2 text-2xl text-white sm:left-0  sm:top-[40%] sm:p-0'
                     >
                        <svg
                           className='sm:hidden'
                           width='8'
                           height='12'
                           viewBox='0 0 8 12'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M0.615701 6.88276C0.381617 6.64839 0.250134 6.33068 0.250134 5.99943C0.250134 5.66818 0.381617 5.35047 0.615701 5.11609L5.32903 0.401095C5.56353 0.16671 5.88153 0.0350781 6.21308 0.0351562C6.54463 0.0352344 6.86257 0.167016 7.09695 0.401512C7.33134 0.636007 7.46297 0.954008 7.46289 1.28556C7.46281 1.61711 7.33103 1.93504 7.09653 2.16943L3.26653 5.99943L7.09653 9.82943C7.32435 10.0651 7.45049 10.3808 7.4478 10.7085C7.4451 11.0363 7.31379 11.3498 7.08214 11.5817C6.85049 11.8136 6.53703 11.9452 6.20929 11.9482C5.88154 11.9512 5.56573 11.8254 5.32987 11.5978L0.614867 6.8836L0.615701 6.88276Z'
                              fill='white'
                           />
                        </svg>

                        <svg
                           className='hidden md:hidden sm:block'
                           width='40'
                           height='40'
                           viewBox='0 0 40 40'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <rect
                              x='40'
                              y='40'
                              width='40'
                              height='40'
                              transform='rotate(-180 40 40)'
                              fill='black'
                              fillOpacity='0.3'
                           />
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M16.6157 20.8828C16.3816 20.6484 16.2501 20.3307 16.2501 19.9994C16.2501 19.6682 16.3816 19.3505 16.6157 19.1161L21.329 14.4011C21.5635 14.1667 21.8815 14.0351 22.2131 14.0352C22.5446 14.0352 22.8626 14.167 23.097 14.4015C23.3313 14.636 23.463 14.954 23.4629 15.2856C23.4628 15.6171 23.331 15.935 23.0965 16.1694L19.2665 19.9994L23.0965 23.8294C23.3243 24.0651 23.4505 24.3808 23.4478 24.7085C23.4451 25.0363 23.3138 25.3498 23.0821 25.5817C22.8505 25.8136 22.537 25.9452 22.2093 25.9482C21.8815 25.9512 21.5657 25.8254 21.3299 25.5978L16.6149 20.8836L16.6157 20.8828Z'
                              fill='white'
                           />
                        </svg>
                     </button>
                     <div className='  w-[902px]   md:h-[450px] md:w-[360px] sm:h-[450px] sm:w-full'>
                        <Carousel
                           ref={
                              ref as React.MutableRefObject<CarouselRef | null>
                           }
                           dots={false}
                           className=' w-full'
                        >
                           {props.data?.map((mess) => (
                              <div
                                 key={mess.link}
                                 className={classNames(
                                    'galleryImage',
                                    ' h-screen overflow-y-auto bg-white  sm:h-fit sm:w-full'
                                 )}
                              >
                                 <div className={`relative aspect-[14/9] `}>
                                    {!mess.type ? (
                                       <Image
                                          className='!h-full !w-full  object-cover '
                                          src={BASE_IMAGE_URL + mess.link}
                                          alt='/'
                                          quality={100}
                                          sizes='100%'
                                          fill
                                       />
                                    ) : (
                                       <ReactPlayer
                                          width={'100%'}
                                          height={'100%'}
                                          url={
                                             mess.type === VIDEO_UPLOAD_TYPE.URL
                                                ? mess.link
                                                : BASE_IMAGE_URL + mess.link
                                          }
                                          controls
                                       />
                                    )}
                                 </div>
                                 <div className='flex flex-col justify-between px-[26px] py-[17px] sm:px-[10px] sm:pb-0'>
                                    <article className='prose mb-[20px] max-w-full text-[20px] font-normal leading-[32px] text-[#505050] sm:text-[16px] sm:leading-[26px]'>
                                       {parse(
                                          translate(
                                             props.lang,
                                             mess.description_En,
                                             mess.description_Np
                                          )
                                       )}
                                    </article>
                                    <p className=' w-full text-right text-[20px] font-normal leading-[32px]  text-[#808080] sm:text-[13px] sm:font-[300] sm:leading-[32px]'>
                                       {props.lang === 'en'
                                          ? ' Published on'
                                          : 'प्रकाशित'}
                                       :{' '}
                                       {converAdToBs(
                                          mess?.publishedDate,
                                          'DD MMMM, YYYY'
                                       )}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </Carousel>
                     </div>

                     <button
                        type='button'
                        onClick={nextSlide}
                        className=' absolute  right-[4%] top-[50%] z-40 translate-x-[-0] translate-y-[-50%] cursor-pointer  p-2 text-2xl text-white sm:right-0 sm:top-[40%] sm:p-0'
                     >
                        <svg
                           className='sm:hidden'
                           width='8'
                           height='12'
                           viewBox='0 0 8 12'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M7.3843 5.11724C7.61838 5.35161 7.74987 5.66932 7.74987 6.00057C7.74987 6.33182 7.61838 6.64953 7.3843 6.8839L2.67097 11.5989C2.43647 11.8333 2.11847 11.9649 1.78692 11.9648C1.45537 11.9648 1.13743 11.833 0.903049 11.5985C0.668664 11.364 0.537031 11.046 0.537109 10.7144C0.537187 10.3829 0.66897 10.065 0.903465 9.83057L4.73346 6.00057L0.903465 2.17057C0.675654 1.93493 0.54951 1.61923 0.552202 1.29148C0.554895 0.963734 0.686208 0.650154 0.91786 0.418283C1.14951 0.186414 1.46297 0.0548038 1.79071 0.0518026C2.11846 0.0488014 2.43427 0.174647 2.67013 0.402237L7.38513 5.1164L7.3843 5.11724Z'
                              fill='white'
                           />
                        </svg>

                        <svg
                           className='hidden md:hidden sm:block'
                           width='40'
                           height='40'
                           viewBox='0 0 40 40'
                           fill='none'
                           xmlns='http://www.w3.org/2000/svg'
                        >
                           <rect
                              width='40'
                              height='40'
                              fill='black'
                              fillOpacity='0.3'
                           />
                           <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M23.3843 19.1172C23.6184 19.3516 23.7499 19.6693 23.7499 20.0006C23.7499 20.3318 23.6184 20.6495 23.3843 20.8839L18.671 25.5989C18.4365 25.8333 18.1185 25.9649 17.7869 25.9648C17.4554 25.9648 17.1374 25.833 16.903 25.5985C16.6687 25.364 16.537 25.046 16.5371 24.7144C16.5372 24.3829 16.669 24.065 16.9035 23.8306L20.7335 20.0006L16.9035 16.1706C16.6757 15.9349 16.5495 15.6192 16.5522 15.2915C16.5549 14.9637 16.6862 14.6502 16.9179 14.4183C17.1495 14.1864 17.463 14.0548 17.7907 14.0518C18.1185 14.0488 18.4343 14.1746 18.6701 14.4022L23.3851 19.1164L23.3843 19.1172Z'
                              fill='white'
                           />
                        </svg>
                     </button>
                  </div>
               </div>
            </section>
         </div>
      );
   }
);
