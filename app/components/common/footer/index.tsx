'use client';
import Image from 'next/image';
import React, { type ReactElement } from 'react';
import officer from '@/public/seo_image.png';
import classNames from 'classnames';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getBasicInformation } from '@/api/home';
import { queryKeys } from '@/utils';
import { BASICINFO, INFORMATION_OFFICER } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { redirectedPathName, translate } from '@/utils/commonRule';
import { getAllMember } from '@/api/member';
import { MEMBER } from '@/enums/privilege';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import NepaliDate from 'nepali-date-converter';
import { Space } from 'antd';

type QuickLink = {
   key: string;
   title_Np: string;
   tittle_En: string;
   url: string;
};
type Contact = {
   icon: ReactElement;
   key: string;
   title: string;
   value?: string[] | string;
   url: string;
   type?: 'PHONE' | 'EMAIL';
};
export default function Footer({ lang }: { lang: Locale }) {
   const { data } = useQuery({
      queryFn: () => getBasicInformation(),
      queryKey: queryKeys(BASICINFO).lists(),
   });

   const { data: officerDetails } = useQuery({
      queryFn: () => getAllMember({ type: MEMBER.INFORMATION_OFFICER }),
      queryKey: queryKeys(INFORMATION_OFFICER).detail(INFORMATION_OFFICER),
   });

   const nepaliDate = new NepaliDate();

   const quickLinks: QuickLink[] = [
      {
         key: 'aboutus',
         tittle_En: 'About Us',
         title_Np: 'हाम्रोबारे ',
         url: '/about-us',
      },
      {
         key: 'services',
         tittle_En: 'Services',
         title_Np: 'सेवाहरू',
         url: '/services',
      },
      {
         key: 'units',
         tittle_En: 'Units',
         title_Np: 'एकाइहरू',
         url: '/units',
      },
      {
         key: 'schedule',
         tittle_En: 'OPD Schedule',
         title_Np: 'ओपीडी तालिका ',
         url: '/opd-schedule',
      },
      {
         key: 'gallery',
         tittle_En: 'Gallery',
         title_Np: 'ग्यालेरी',
         url: '/gallery',
      },
   ];
   const relatedLinks: QuickLink[] = [
      {
         key: 'home',
         tittle_En: 'National Public Health Laboratory',
         title_Np: 'राष्ट्रिय जनस्वास्थ्य प्रयोगशाला',
         url: 'https://nphl.gov.np/',
      },
      {
         key: 'aboutus',
         tittle_En: 'Nepal Health Research Council',
         title_Np: 'रास्ट्रिय स्वास्थ्य अनुसन्धान परिषद्',
         url: 'https://nhrc.gov.np/',
      },
      {
         key: 'services',
         tittle_En: 'Department of Health Services',
         title_Np: 'स्वास्थ्य सेवा विभाग',
         url: 'https://dohs.gov.np/',
      },
      {
         key: 'departments',
         tittle_En: 'Shahid Gangalal National Health Centre',
         title_Np: 'सहिद गंगालाल रास्ट्रिय मुटु केन्द्र',
         url: 'https://www.sgnhc.org.np/',
      },
      {
         key: 'schedule',
         tittle_En: 'स्वास्थ्य आपतकालीन सञ्चालन केन्द्र',
         title_Np: 'स्वास्थ्य आपतकालीन सञ्चालन केन्द्र',
         url: 'https://heoc.mohp.gov.np/',
      },
   ];

   const contact: Contact[] = [
      {
         key: 'location',
         title: translate(lang, 'Location :', 'स्थान :'),
         value: translate(lang, 'Teku, Kathmandu', 'टेकु, काठमाडौं'),
         url: '',
         icon: (
            <svg
               width='22'
               height='24'
               viewBox='0 0 18 24'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8.06384 0.0519071C7.12428 0.158266 6.23047 0.423813 5.32165 0.866595C3.57204 1.71902 2.29456 2.99566 1.42798 4.75778C0.0126375 7.63572 0.339731 10.7467 2.47831 14.7485C3.37179 16.4204 4.31389 17.8705 6.5854 21.0703C7.20767 21.9468 7.89847 22.9282 8.12047 23.251C8.54304 23.8654 8.70129 24 9.00134 24C9.30139 24 9.45964 23.8654 9.88222 23.251C10.1043 22.9282 10.8023 21.9363 11.4334 21.0468C13.8402 17.6549 14.9071 15.9853 15.7767 14.25C16.846 12.1162 17.3419 10.4695 17.4213 8.78903C17.563 5.78992 16.0379 2.9027 13.4523 1.27488C11.911 0.304657 9.88798 -0.15453 8.06384 0.0519071ZM8.32165 1.43383C7.71476 1.52088 7.22065 1.62766 6.81842 1.75867C5.09122 2.32117 3.61447 3.57841 2.77123 5.20417C1.59833 7.46556 1.72072 9.86256 3.16892 12.9919C3.93204 14.641 5.17142 16.6474 7.14542 19.4297C7.60273 20.0742 8.20212 20.9223 8.47742 21.3145C8.75267 21.7066 8.98845 22.0277 9.00134 22.0281C9.01423 22.0285 9.14459 21.8553 9.29103 21.6433C9.43747 21.4313 10.0143 20.6144 10.5729 19.8281C12.6845 16.8555 13.7083 15.2418 14.558 13.5468C15.8498 10.9698 16.2682 8.94508 15.8957 7.07331C15.3432 4.29747 13.151 2.10475 10.3655 1.54178C9.93233 1.45422 8.65119 1.38653 8.32165 1.43383ZM8.23887 4.28974C6.16311 4.68334 4.67961 6.56275 4.79834 8.64841C4.90597 10.5389 6.19404 12.0845 8.04842 12.5485C8.53189 12.6694 9.56183 12.6558 10.056 12.5219C11.574 12.1108 12.7295 10.9267 13.1119 9.39039C13.2213 8.95117 13.2213 7.92377 13.1119 7.48455C12.7291 5.94695 11.5573 4.74766 10.056 4.357C9.55943 4.22781 8.72783 4.19702 8.23887 4.28974ZM8.30768 5.71975C7.79459 5.85419 7.43131 6.06686 7.031 6.46713C6.62497 6.87316 6.41689 7.23278 6.28142 7.76228C6.11229 8.42364 6.20009 9.14275 6.52597 9.76469C6.72519 10.1449 7.29387 10.7136 7.67412 10.9128C8.29606 11.2387 9.01517 11.3265 9.67653 11.1574C10.206 11.0219 10.5657 10.8138 10.9717 10.4078C11.3777 10.0018 11.5858 9.64216 11.7213 9.11266C11.8904 8.4513 11.8026 7.73219 11.4767 7.11025C11.2775 6.73 10.7088 6.16131 10.3286 5.96209C9.70836 5.63716 8.96379 5.54786 8.30768 5.71975Z'
                  fill='white'
                  fillOpacity='0.8'
               />
            </svg>
         ),
      },
      {
         key: 'phone',
         title: translate(lang, 'Hotline :', 'हटलाइन :'),
         value: data?.emergencyHotlines,
         url: '',
         type: 'PHONE',
         icon: (
            <svg
               width='22'
               height='20'
               viewBox='0 0 20 20'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M4.07488 0.032959C3.33248 0.157884 2.45929 0.679653 1.65442 1.47929C1.0766 2.05332 0.723408 2.5157 0.429096 3.0834C0.102331 3.71362 0.00160406 4.06739 7.72978e-05 4.58971C-0.00109713 4.99676 0.00892466 5.05185 0.185324 5.60695C1.65712 10.2388 4.51944 14.1334 8.50067 16.9213C10.2743 18.1632 12.3658 19.1825 14.4779 19.8341C14.9838 19.9902 15.0575 20.003 15.437 19.9996C15.7706 19.9966 15.9107 19.9758 16.1808 19.889C17.7538 19.3837 19.4406 17.7252 19.9048 16.2274C20.0248 15.8404 20.0324 15.2592 19.9219 14.9223C19.6274 14.0247 18.3581 12.9349 16.9833 12.3994C16.3325 12.146 15.9336 12.0674 15.3 12.0678C14.812 12.0682 14.7172 12.0797 14.4356 12.1726C13.9898 12.3197 13.6933 12.5269 13.1085 13.1006L12.5988 13.6005L12.0703 13.269C9.89124 11.9019 8.09561 10.1072 6.73394 7.93527L6.40306 7.40748L6.93763 6.85656C7.51775 6.25865 7.69533 5.98302 7.83097 5.47002C7.92368 5.11934 7.92281 4.31282 7.82925 3.8659C7.60858 2.81195 7.03945 1.69201 6.3492 0.953292C5.63867 0.192901 4.90019 -0.105934 4.07488 0.032959ZM12.9703 0.119699C12.8991 0.168135 12.804 0.257418 12.759 0.31814C12.6799 0.424676 12.6767 0.478356 12.6654 1.85379L12.6538 3.27903H11.2521C9.85902 3.27903 9.84962 3.27957 9.71836 3.368C9.6457 3.4169 9.54619 3.51636 9.49725 3.58897C9.40851 3.72055 9.40823 3.72575 9.40823 5.2157C9.40823 6.70139 9.40878 6.71121 9.49632 6.83977C9.54478 6.9109 9.63412 7.00594 9.69487 7.05097C9.80151 7.12996 9.85487 7.13321 11.2296 7.14397L12.6538 7.15516L12.6655 8.57516L12.6771 9.99515L12.7868 10.1388C12.9893 10.4042 12.9584 10.3997 14.6227 10.3996C16.0398 10.3995 16.1289 10.3953 16.2472 10.3232C16.5156 10.1596 16.5114 10.1847 16.5331 8.6018L16.5527 7.17194L17.9885 7.15238C19.3615 7.13368 19.4292 7.1293 19.5325 7.05214C19.5919 7.00778 19.6768 6.92288 19.7212 6.86341C19.7995 6.75855 19.8019 6.70968 19.8019 5.21954V3.68369L19.6927 3.54058C19.6326 3.46186 19.5445 3.3752 19.4969 3.348C19.4335 3.31173 19.0302 3.29339 17.9816 3.27903L16.5527 3.25946L16.5331 1.82961C16.5114 0.246698 16.5156 0.271777 16.2472 0.108196C16.1289 0.0361281 16.0397 0.0319417 14.6109 0.0318244C13.108 0.0316679 13.099 0.0321374 12.9703 0.119699ZM4.08415 1.31602C3.57684 1.4857 3.05809 1.83606 2.51363 2.37689C1.75542 3.12988 1.22638 4.05147 1.22638 4.61917C1.22638 4.69163 1.31618 5.03154 1.42595 5.37455C2.01332 7.21005 2.92104 9.06469 4.00864 10.6514C6.56991 14.3882 10.3659 17.2176 14.6366 18.573C14.9822 18.6827 15.3257 18.772 15.3999 18.7715C15.6315 18.7699 15.8742 18.6971 16.2429 18.5187C17.4725 17.9237 18.7645 16.3902 18.7645 15.5257C18.7645 15.1574 18.2728 14.574 17.568 14.106C16.7385 13.5552 15.7983 13.2463 15.1384 13.3079C14.6795 13.3507 14.5256 13.4523 13.7378 14.2322C12.8087 15.152 12.8129 15.151 12 14.6843C10.0137 13.544 8.30122 12.0753 6.84438 10.2628C6.4163 9.73016 5.61322 8.54108 5.28109 7.94802C4.84374 7.16705 4.84252 7.1712 5.78492 6.21476C6.63717 5.34982 6.64973 5.32729 6.6457 4.66796C6.64363 4.32757 6.62088 4.1562 6.53691 3.84845C6.25634 2.81978 5.58868 1.77894 4.971 1.4073C4.69466 1.24102 4.39929 1.21065 4.08415 1.31602ZM13.9018 2.68844C13.8891 4.32871 13.9012 4.26724 13.5571 4.44299C13.3881 4.5293 13.358 4.53102 12.0228 4.53102H10.661V5.2143V5.89761L12.0832 5.90876L13.5054 5.91995L13.6485 6.02915C13.7273 6.0892 13.814 6.17724 13.8412 6.22477C13.8775 6.28819 13.8958 6.69126 13.9102 7.73925L13.9298 9.16731H14.6149H15.3L15.3195 7.73229C15.3382 6.3601 15.3426 6.29254 15.4198 6.18929C15.4642 6.12989 15.5492 6.04499 15.6086 6.00063C15.7124 5.92312 15.7726 5.91952 17.1427 5.90876L18.5688 5.89761V5.21613V4.53466L17.1427 4.52308C15.7729 4.51193 15.7123 4.50829 15.6086 4.43078C15.5492 4.38642 15.4642 4.30151 15.4198 4.24212C15.3426 4.13887 15.3382 4.0713 15.3195 2.69912L15.3 1.2641L14.6065 1.25342L13.913 1.24274L13.9018 2.68844Z'
                  fill='white'
                  fillOpacity='0.8'
               />
            </svg>
         ),
      },
      {
         key: 'enquiries',
         title: translate(lang, 'Enquiries :', 'सोधपुछको लागि :'),
         value: data?.generalInquiries,
         type: 'PHONE',
         url: '',
         icon: (
            <svg
               width='22'
               height='22'
               viewBox='0 0 22 22'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M3.89051 0.332813C3.1415 0.502922 2.64068 0.796922 1.96887 1.46091C1.00779 2.41073 0.526105 3.35681 0.330637 4.6785C0.154012 5.87297 0.394199 7.50656 0.943855 8.84892C1.91918 11.231 3.60692 13.6399 5.9344 15.9721C8.37528 18.4179 10.8926 20.173 13.3262 21.1255C14.9356 21.7554 16.7706 21.9045 18.1234 21.5151C19.5165 21.1141 20.7334 20.095 21.3595 18.8047C21.9197 17.6503 21.8329 16.4604 21.1316 15.6803C20.9258 15.4515 17.7269 13.1462 17.0412 12.7327C16.5521 12.4376 16.1495 12.3125 15.6898 12.3125C14.9518 12.3125 14.4362 12.5816 13.5114 13.4495L12.9741 13.9537L12.5558 13.6738C11.4906 12.9613 9.35984 10.8559 8.41226 9.57961C7.96596 8.97849 7.95945 9.06375 8.49537 8.49089C9.3619 7.56464 9.62759 7.10452 9.67212 6.45309C9.70212 6.01439 9.60771 5.6265 9.35262 5.14059C9.14815 4.75106 6.74417 1.33678 6.46339 1.03706C6.21617 0.77325 5.89821 0.564235 5.52621 0.420985C5.13467 0.270235 4.3519 0.228 3.89051 0.332813ZM3.99837 1.86281C3.63682 1.98717 3.39696 2.14303 3.03603 2.48817C2.48792 3.01223 2.10204 3.66497 1.89748 4.41403C1.74837 4.96008 1.748 6.075 1.89668 6.82003C2.26728 8.67717 3.47384 10.8679 5.40495 13.1901C7.29495 15.4627 9.83487 17.6311 12.0531 18.8657C12.7075 19.2299 13.8697 19.7702 14.3265 19.9225C15.7139 20.385 17.4011 20.315 18.4707 19.7504C19.202 19.3643 19.9356 18.524 20.146 17.8314C20.2623 17.4486 20.2465 17.0423 20.106 16.801C20.0448 16.6959 19.4562 16.2496 18.2148 15.3671C16.4792 14.1333 15.8974 13.7656 15.6805 13.7656C15.4537 13.7656 15.1266 13.9975 14.5065 14.5982C13.7546 15.3264 13.5414 15.4519 13.0551 15.4526C12.6803 15.4532 12.4617 15.3808 11.9899 15.0998C10.6927 14.3271 7.98664 11.6514 6.99026 10.1562C6.62215 9.6038 6.47904 9.20752 6.51237 8.83266C6.54842 8.42723 6.67732 8.22113 7.31342 7.55203C8.21046 6.60839 8.30543 6.40397 8.07448 5.91403C7.96381 5.67919 5.6119 2.32964 5.37968 2.07609C5.09262 1.76269 4.53832 1.67709 3.99837 1.86281Z'
                  fill='white'
                  fillOpacity='0.8'
               />
            </svg>
         ),
      },
      {
         key: 'email',
         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
         title: translate(lang, 'Mail :', 'मेल :'),
         value: data?.emails,
         type: 'EMAIL',
         url: '',
         icon: (
            <svg
               width='22'
               height='18'
               viewBox='0 0 22 18'
               fill='none'
               xmlns='http://www.w3.org/2000/svg'
            >
               <path
                  d='M1.60417 0H20.3958C21.2813 0 22 0.8064 22 1.8V16.2C22 16.6774 21.831 17.1352 21.5301 17.4728C21.2293 17.8104 20.8213 18 20.3958 18H1.60417C1.17872 18 0.770689 17.8104 0.469849 17.4728C0.16901 17.1352 0 16.6774 0 16.2L0 1.8C0 0.8064 0.718667 0 1.60417 0ZM1.375 4.53806V16.2C1.375 16.3419 1.47767 16.4571 1.60417 16.4571H20.3958C20.4566 16.4571 20.5149 16.4301 20.5579 16.3818C20.6009 16.3336 20.625 16.2682 20.625 16.2V4.53806L11.8983 11.1549C11.3557 11.5663 10.6443 11.5663 10.1017 11.1549L1.375 4.53806ZM1.375 1.8V2.67634L10.8717 9.87634C10.9096 9.90509 10.9543 9.92044 11 9.92044C11.0457 9.92044 11.0904 9.90509 11.1283 9.87634L20.625 2.67634V1.8C20.625 1.7318 20.6009 1.6664 20.5579 1.61817C20.5149 1.56995 20.4566 1.54286 20.3958 1.54286H1.60417C1.54339 1.54286 1.4851 1.56995 1.44212 1.61817C1.39914 1.6664 1.375 1.7318 1.375 1.8Z'
                  fill='white'
                  fillOpacity='0.8'
               />
            </svg>
         ),
      },
      {
         key: 'facebook',
         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
         title: '',
         value: '',
         type: 'EMAIL',
         url: '',
         icon: (
            <Link href={'https://www.facebook.com/STIDHNepal'} target='_blank'>
               <svg
                  width='40'
                  height='40'
                  viewBox='0 0 40 40'
                  fill='none'

                  // xmlns='http://www.w3.org/2000/svg'
               >
                  <rect
                     x='0.5'
                     y='0.5'
                     width='39'
                     height='39'
                     rx='19.5'
                     fill='white'
                     stroke='#E4E4E4'
                  />
                  <path
                     d='M21.6673 21.2498H23.7507L24.584 17.9165H21.6673V16.2498C21.6673 15.3915 21.6673 14.5832 23.334 14.5832H24.584V11.7832C24.3123 11.7473 23.2865 11.6665 22.2032 11.6665C19.9407 11.6665 18.334 13.0473 18.334 15.5832V17.9165H15.834V21.2498H18.334V28.3332H21.6673V21.2498Z'
                     fill='#0866FF'
                  />
               </svg>
            </Link>
         ),
      },
   ];
   return (
      <footer className=' overflow-hidden bg-[#0C62BB] px-[60px] md:px-[50px] sm:px-[20px]'>
         <section className='mx-auto max-w-[1440px]   pb-[29px] pt-[68px] md:pb-[13px] sm:pb-[8px]  sm:pt-[20px]'>
            <article
               className={classNames(
                  'footer_wrapper',
                  ' grid   items-start justify-between gap-[50px] border-b border-[#FFFFFF33]   pb-[55px] sm:gap-x-[34px] sm:gap-y-[20px] sm:pb-[20px]'
               )}
            >
               <div className={classNames('contact_address')}>
                  <p className='mb-[14px] text-[24px]  font-bold leading-[39px] text-white sm:mb-[6px] sm:text-[18px] sm:leading-[30px]'>
                     {translate(lang, 'Contact Address', 'सम्पर्क ठेगाना')}
                  </p>
                  <div className='flex  flex-col gap-y-[15px] sm:gap-y-[10px] '>
                     {contact?.map((item: Contact) => (
                        <div
                           key={item?.key}
                           className=' flex !items-start gap-x-[10px]'
                        >
                           <div className='mt-[5px]'>{item?.icon}</div>
                           {typeof item.value === 'string' ? (
                              <div className='flex flex-wrap items-start gap-x-[6px] '>
                                 <p className=' text-[18px] font-medium  leading-[27px] text-[#FFFFFFCC] sm:text-[16px] sm:leading-[26.56px]'>
                                    {item?.title}
                                 </p>
                                 <p className=' text-[18px] font-medium  leading-[27px] text-[#FFFFFFCC] sm:text-[16px] sm:leading-[26.56px]'>
                                    {item.value}
                                 </p>
                              </div>
                           ) : (
                              <Space split={','} wrap>
                                 <p className=' text-[18px] font-medium  leading-[27px] text-[#FFFFFFCC] sm:text-[16px] sm:leading-[26.56px]'>
                                    {item?.title}
                                 </p>
                                 {item.value?.map((value) => (
                                    <a
                                       href={
                                          item.type === 'PHONE'
                                             ? `tel:${value}`
                                             : `mailto:${value}`
                                       }
                                       key={value}
                                    >
                                       <p className=' text-[18px] font-medium  leading-[27px] text-[#FFFFFFCC] sm:text-[16px] sm:leading-[26.56px]'>
                                          {value}
                                       </p>
                                    </a>
                                 ))}
                              </Space>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
               <div className={classNames('quick_links')}>
                  <p className='mb-[14px] text-[24px] font-bold leading-[39px] text-white sm:mb-[6px] sm:text-[18px] sm:leading-[30px]'>
                     {translate(lang, 'Quick Links', 'द्रुत लिङ्कहरू')}
                  </p>
                  <div className='flex flex-col gap-y-[15px] sm:gap-y-[10px]'>
                     {quickLinks?.map((item: QuickLink) => (
                        <Link
                           href={`${redirectedPathName(lang, item.url)}`}
                           key={item?.url}
                        >
                           <p className=' text-[18px] font-medium leading-[29px] text-[#FFFFFFCC] sm:text-[16px] sm:leading-[26.56px]'>
                              {lang === 'en' ? item.tittle_En : item.title_Np}
                           </p>
                        </Link>
                     ))}
                  </div>
               </div>
               <div className={classNames('related_links')}>
                  <p className='mb-[14px] text-[24px] font-bold leading-[39px]  text-white sm:mb-[6px] sm:text-[18px] sm:leading-[30px]'>
                     {translate(lang, ' Related Links', 'सम्बन्धित लिङ्कहरू')}
                  </p>
                  <div className='flex flex-col gap-y-[10px]'>
                     {relatedLinks?.map((item: QuickLink) => (
                        <Link
                           key={item?.title_Np}
                           href={item.url}
                           target='_blank'
                        >
                           <p className=' text-[18px] font-medium leading-[29px] text-[#FFFFFFCC] sm:text-[16px] sm:leading-[26.56px]'>
                              {lang === 'en' ? item.tittle_En : item.title_Np}
                           </p>
                        </Link>
                     ))}
                  </div>
               </div>
               <div className={classNames('info sm:mt-[10px]')}>
                  <div className=' sm:grid sm:w-full sm:grid-cols-[80px_1fr] sm:gap-x-[15px]'>
                     <div className='relative z-30 size-[100px] sm:size-[80px]'>
                        <Image
                           className=' object-cover'
                           src={
                              officerDetails?.result[0]?.image
                                 ? BASE_IMAGE_URL +
                                   officerDetails?.result[0]?.image
                                 : officer
                           }
                           alt='/'
                           fill
                           sizes='100%'
                           quality={100}
                        />
                     </div>
                     <div>
                        <p className='mt-[9px] text-[20px] font-semibold leading-[33px] text-white sm:mt-0 sm:text-[18px] sm:leading-[29px]'>
                           {translate(
                              lang,
                              officerDetails?.result[0]?.name_En ?? '-',
                              officerDetails?.result[0]?.name_Np ?? '-'
                           )}
                        </p>
                        <p className=' text-[16px] font-medium leading-[26.59px] text-[#FFFFFFCC]'>
                           {translate(
                              lang,
                              officerDetails?.result[0]?.position_En ?? '-',
                              officerDetails?.result[0]?.position_Np ?? '-'
                           )}
                        </p>
                        <p className='text-[16px] font-medium leading-[26.59px] text-[#FFFFFFCC]'>
                           (
                           {officerDetails?.result[0]?.phoneNumbers ??
                              officerDetails?.result[0]?.phoneNumbers}{' '}
                           {officerDetails?.result[0]?.phoneNumbers &&
                           officerDetails?.result[0]?.emails
                              ? ' | '
                              : ''}
                           {officerDetails?.result[0]?.emails &&
                              officerDetails?.result[0]?.emails}
                           )
                        </p>
                     </div>
                  </div>
               </div>

               <div className={classNames('location')}>
                  <p className='mb-[14px] text-[24px]  font-bold leading-[39px] text-white sm:mb-[6px] sm:text-[18px] sm:leading-[30px]'>
                     {translate(lang, 'Location', 'स्थान')}
                  </p>
                  <div id='map' className=' mt-[18px] !h-[288px] sm:mt-0 '>
                     <iframe
                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.7044219958884!2d85.30629499999999!3d27.695529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1851ae40bd91%3A0xbd8552665e65d95b!2sSukraraj%20Tropical%20%26%20Infectious%20Disease%20Hospital!5e0!3m2!1sen!2snp!4v1708945994021!5m2!1sen!2snp'
                        width='600'
                        height='450'
                        loading='lazy'
                     ></iframe>
                  </div>
               </div>
            </article>
            <section className=''>
               <div className='mt-[23px] flex items-center justify-between md:block sm:grid sm:gap-y-[5px]'>
                  {lang === 'en' ? (
                     <p className=' text-[14px] font-medium leading-[23px] text-[#FFFFFFB2] md:leading-[26px] sm:text-[14px]'>
                        All rights reserved Sukraraj Tropical & Infectious
                        Disease Hospital © {new Date().getFullYear()}.
                     </p>
                  ) : (
                     <p className=' text-[14px] font-medium text-[#FFFFFFB2]  md:leading-[26px] sm:text-[14px]'>
                        सर्वाधिकार शुक्रराज ट्रपिकल तथा सरुवारोग अस्पतालमा
                        सुरक्षित © {nepaliDate.format('YYYY', 'np')}.
                     </p>
                  )}
                  <div className=' md:w-full md:text-center sm:w-full'>
                     <Link
                        href={'https://dallotech.com/'}
                        target='_blank'
                        className='mt-[5px]'
                     >
                        <p className=' text-[14px] font-normal leading-[23px] text-[#FFFFFFB2] md:text-[16px] md:leading-[26px] sm:text-[14px]'>
                           Made with ❤️ by{' '}
                           <span className=' hover:text-white/100'>
                              DalloTech{' '}
                           </span>
                        </p>
                     </Link>
                  </div>
               </div>
            </section>
         </section>
      </footer>
   );
}
