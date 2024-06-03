import { type Locale } from '@/i18n';
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import ServiceCard from '../../services/serviceCard';
import { Button, Carousel } from 'antd';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { type CarouselRef } from 'antd/es/carousel';
import { useQuery } from '@tanstack/react-query';
import { getAllServices } from '@/api/services';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { serviceConfig } from '../../services/config';
import { queryKeys } from '@/utils';
import { SERVICES } from '@/constants/querykeys';
import { isEmpty } from 'lodash';

export default function ServiceSection({ lang }: { lang: Locale }) {
   const { data } = useQuery({
      queryFn: () => getAllServices(serviceConfig),
      queryKey: queryKeys(SERVICES).list(serviceConfig),
   });

   const { result = [] } = data ?? {};

   const router = useRouter();

   const ref = useRef<CarouselRef>(null);

   const [currentIndex, setCurrentIndex] = useState<number>(0);

   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
   const slideToshow = ref.current?.innerSlider.props.slidesToShow;

   const [mobileViews, setMobileViews] = useState(false);

   useEffect(() => {
      if (
         window.matchMedia(
            'only screen and (max-width: 575px) and (min-width: 300px)'
         ).matches
      ) {
         setMobileViews(true);
      } else {
         setMobileViews(false);
      }
   }, []);

   if (isEmpty(result)) {
      return <div></div>;
   }

   if (mobileViews) {
      return (
         <section className=' py-[60px]'>
            <article
               className={classNames('px-[60px] md:px-[50px] sm:px-[20px] ')}
            >
               <div className='mx-auto max-w-[1440px] '>
                  <p className='relative text-center text-[32px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:left-[50%] before:h-[2px] before:w-[40px] before:translate-x-[-50%] before:rounded-[5px] before:bg-secondary md:text-[32px] md:leading-[53px] sm:text-[26px] sm:leading-[43px]'>
                     {lang === 'en' ? 'Our services' : 'हाम्रा सेवाहरू'}
                  </p>
               </div>
            </article>
            <article className={classNames('our_services  ')}>
               <div className='mt-[32px] '>
                  <div className=' '>
                     <section className='px-[60px] md:px-[50px] sm:px-[0px]'>
                        <article className='  '>
                           <div className=''>
                              <Carousel
                                 ref={ref}
                                 dots={false}
                                 slidesToShow={1}
                                 slidesToScroll={1}
                                 centerMode
                                 centerPadding='20px'
                                 className={classNames(
                                    'home_services mx-auto max-w-[1440px] '
                                 )}
                                 afterChange={(current) => {
                                    if (current !== result?.length - 1) {
                                       setCurrentIndex(current);
                                    }
                                 }}
                                 beforeChange={(current, next) => {
                                    if (next !== 0) {
                                       setCurrentIndex(next);
                                    }
                                 }}
                                 infinite={false}
                              >
                                 {result?.map((item) => {
                                    return (
                                       <ServiceCard
                                          key={item.id}
                                          data={item}
                                          lang={lang}
                                       />
                                    );
                                 })}
                              </Carousel>
                           </div>
                        </article>
                        <div className='mt-[20px] flex w-full items-center justify-center px-[20px]'>
                           <button
                              type='button'
                              className=' flex w-full items-center justify-center gap-x-[7px] rounded-[5px] bg-primary px-[20px] py-[11.5px] text-[16px] font-medium leading-[26px] text-white'
                              onClick={() => {
                                 router.push('/services');
                              }}
                           >
                              <span>View all Services</span>
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
                           </button>
                        </div>
                     </section>
                  </div>
               </div>
            </article>
         </section>
      );
   }

   return (
      <section className=' py-[60px]'>
         <article
            className={classNames('px-[60px] md:px-[50px] sm:px-[20px] ')}
         >
            <div className='mx-auto max-w-[1440px] '>
               <p className='relative text-center text-[32px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:left-[50%] before:h-[2px] before:w-[40px] before:translate-x-[-50%] before:rounded-[5px] before:bg-secondary md:text-[32px] md:leading-[53px] sm:text-[26px] sm:leading-[43px]'>
                  {lang === 'en' ? 'Our services' : 'हाम्रा सेवाहरू'}
               </p>
            </div>
         </article>
         <article className={classNames('our_services  ')}>
            <div className='mt-[32px] '>
               <div className=' '>
                  <section>
                     <article className=' relative mx-auto max-w-[1600px] '>
                        <Button
                           className='!absolute left-[60px] top-[50%] z-10 flex !size-[40px] translate-y-[-50%] items-center justify-center rounded-[5px] border !bg-white md:left-[50px] sm:left-[15px]'
                           onClick={() => {
                              ref?.current?.prev();
                              setCurrentIndex(currentIndex - 1);
                           }}
                           disabled={currentIndex === 0}
                        >
                           <svg
                              width='8'
                              height='14'
                              viewBox='0 0 8 14'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                           >
                              <path
                                 fillRule='evenodd'
                                 clipRule='evenodd'
                                 d='M0.391644 7.9423C0.141954 7.6923 0.00170535 7.35341 0.00170537 7.00007C0.00170538 6.64674 0.141954 6.30785 0.391644 6.05785L5.4192 1.02852C5.66933 0.778508 6.00853 0.6381 6.36218 0.638184C6.71583 0.638267 7.05497 0.778834 7.30498 1.02896C7.55499 1.27909 7.6954 1.61829 7.69531 1.97194C7.69523 2.3256 7.55466 2.66473 7.30453 2.91474L3.2192 7.00007L7.30453 11.0854C7.54753 11.3368 7.68208 11.6735 7.67921 12.0231C7.67634 12.3727 7.53627 12.7072 7.28918 12.9545C7.04208 13.2018 6.70773 13.3422 6.35813 13.3454C6.00854 13.3486 5.67167 13.2144 5.42009 12.9716L0.390753 7.94319L0.391644 7.9423Z'
                                 fill='#303030'
                              />
                           </svg>
                        </Button>
                        <div className='px-[60px] md:px-[50px] sm:px-[20px]'>
                           <Carousel
                              ref={ref}
                              dots={false}
                              slidesToShow={4}
                              slidesToScroll={4}
                              className={classNames(
                                 'home_services mx-auto max-w-[1440px] '
                              )}
                              infinite={false}
                              responsive={[
                                 {
                                    breakpoint: 767,
                                    settings: {
                                       slidesToShow: 3,
                                       slidesToScroll: 3,
                                    },
                                 },
                                 {
                                    breakpoint: 575,
                                    settings: {
                                       slidesToShow: 1,
                                       slidesToScroll: 1,
                                    },
                                 },
                              ]}
                           >
                              {result.map((item) => {
                                 return (
                                    <ServiceCard
                                       key={item.id}
                                       data={item}
                                       lang={lang}
                                    />
                                 );
                              })}
                           </Carousel>
                        </div>

                        <Button
                           className='!absolute right-[60px] top-[50%] z-10  flex !size-[40px] translate-y-[-50%] items-center justify-center rounded-[5px] border !bg-white md:right-[50px] sm:right-[15px]'
                           onClick={() => {
                              ref?.current?.next();
                              setCurrentIndex(currentIndex + 1);
                           }}
                           disabled={
                              currentIndex ===
                              Number(result?.length) / slideToshow - 1
                           }
                        >
                           <svg
                              width='8'
                              height='14'
                              viewBox='0 0 8 14'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                           >
                              <path
                                 fillRule='evenodd'
                                 clipRule='evenodd'
                                 d='M7.60836 6.0577C7.85805 6.3077 7.99829 6.64659 7.99829 6.99992C7.99829 7.35326 7.85805 7.69215 7.60836 7.94215L2.5808 12.9715C2.33067 13.2215 1.99147 13.3619 1.63782 13.3618C1.28417 13.3617 0.945034 13.2212 0.695023 12.971C0.445012 12.7209 0.304604 12.3817 0.304687 12.0281C0.304771 11.6744 0.445339 11.3353 0.695467 11.0853L4.7808 6.99992L0.695467 2.91459C0.452468 2.66324 0.317915 2.3265 0.320787 1.9769C0.323659 1.6273 0.463726 1.29281 0.710821 1.04549C0.957917 0.798157 1.29227 0.657774 1.64186 0.654572C1.99146 0.651371 2.32833 0.785607 2.57991 1.02837L7.60925 6.05681L7.60836 6.0577Z'
                                 fill='#303030'
                              />
                           </svg>
                        </Button>
                     </article>
                  </section>
                  <div className='mt-[40px] flex items-center justify-center'>
                     <button
                        type='button'
                        className='mt-[15px] flex items-center justify-between gap-x-[7px] rounded-[5px] bg-primary px-[20px] py-[11.5px] text-[16px] font-medium leading-[26px] text-white'
                        onClick={() => {
                           router.push('/services');
                        }}
                     >
                        <span>View all Services</span>
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
                     </button>
                  </div>
               </div>
            </div>
         </article>
      </section>
   );
}
