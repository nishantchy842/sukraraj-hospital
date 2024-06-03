import { getAllNotice, getAllNoticeCategory } from '@/api/notice';
import { NOTICE, NOTICE_CATEGORY } from '@/constants/querykeys';
import { type Locale } from '@/i18n';
import { queryKeys } from '@/utils';
import { BASE_IMAGE_URL } from '@/utils/apiUrl';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import Link from 'next/link';
import React, { useState } from 'react';
import { Dropdown, Empty, Space, type MenuProps } from 'antd';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';
import { type NoticeCategory } from '@/models/notices';
import { converAdToBs, translate } from '@/utils/commonRule';

export default function NoticeSection({ lang }: { lang: Locale }) {
   const router = useRouter();
   const { data } = useQuery({
      queryFn: () => getAllNoticeCategory({ pagination: false }),
      queryKey: queryKeys(NOTICE_CATEGORY).list({
         home: 'home',
      }),
   });

   const listCategoryHavingNotice = () => {
      const category = (data?.result ?? []).filter(
         (item) => item.notices?.length !== 0
      );

      return category as NoticeCategory[] | undefined;
   };

   const [activeKey, setActiveKey] = useState(
      (listCategoryHavingNotice() ?? [])[0]?.slug
   );

   const { data: allNotices } = useQuery({
      queryFn: () =>
         getAllNotice({
            pagination: true,
            size: 3,
            sort: 'date',
            order: 'DESC',
            noticeCategorySlug: activeKey,
         }),
      queryKey: queryKeys(NOTICE).list({ activeKey }),
   });

   const items: MenuProps['items'] = listCategoryHavingNotice()?.map(
      (category) => ({
         key: category.slug,
         label: translate(lang, category.title_En, category.title_Np),
      })
   );

   const dropdownActiveKey = listCategoryHavingNotice()?.filter(
      (c) => c.slug === activeKey
   )[0];

   if (!isEmpty(data?.result)) {
      return (
         <section className=' p-[60px] md:px-[50px] sm:px-[20px]'>
            <article className='mx-auto max-w-[1440px]'>
               <p className='relative text-[28px] font-medium leading-[60px] text-grey30 before:absolute before:bottom-0 before:h-[2px] before:w-[40px] before:rounded-[5px] before:bg-secondary md:text-[32px] md:leading-[53px] sm:text-[26px] sm:leading-[43px]'>
                  {lang === 'en' ? 'Notice Board' : 'सूचना पाटी'}
               </p>
               <div className='mt-[33px] flex gap-x-[31px]'>
                  <div className='flex w-full gap-x-[30px] md:flex-col md:gap-y-[20px] sm:flex-col sm:gap-y-[16px]'>
                     <div>
                        <article className='flex w-[308px] flex-col gap-y-[10px] md:w-full md:flex-row md:flex-wrap md:gap-x-[15px] sm:hidden'>
                           {listCategoryHavingNotice()
                              ?.slice(0, 5)
                              .map((item) => (
                                 <div
                                    key={item.slug}
                                    className='flex w-full cursor-pointer items-center justify-between px-[15px] py-[10px] md:w-fit md:gap-x-[20px]'
                                    style={{
                                       background:
                                          item.slug === activeKey
                                             ? '#0C62BB'
                                             : '#0C62BB0D',
                                    }}
                                    onClick={() => {
                                       setActiveKey(item.slug);
                                    }}
                                 >
                                    <p
                                       className={classNames(
                                          ' text-[18px] font-medium leading-[30px]',
                                          item.slug === activeKey
                                             ? 'text-white '
                                             : 'text-[#808080]'
                                       )}
                                    >
                                       {lang === 'en'
                                          ? item.title_En.toUpperCase()
                                          : (
                                               item.title_Np ?? item.title_En
                                            ).toUpperCase()}
                                    </p>
                                    <svg
                                       width='9'
                                       height='14'
                                       viewBox='0 0 9 14'
                                       fill='none'
                                       xmlns='http://www.w3.org/2000/svg'
                                    >
                                       <path
                                          fillRule='evenodd'
                                          clipRule='evenodd'
                                          d='M7.94234 6.0577C8.19203 6.3077 8.33228 6.64659 8.33228 6.99992C8.33228 7.35326 8.19203 7.69215 7.94234 7.94215L2.91479 12.9715C2.66466 13.2215 2.32546 13.3619 1.9718 13.3618C1.61815 13.3617 1.27902 13.2212 1.02901 12.971C0.778997 12.7209 0.638589 12.3817 0.638672 12.0281C0.638755 11.6744 0.779323 11.3353 1.02945 11.0853L5.11478 6.99992L1.02945 2.91459C0.786453 2.66324 0.651899 2.3265 0.654771 1.9769C0.657643 1.6273 0.79771 1.29281 1.04481 1.04549C1.2919 0.798157 1.62625 0.657774 1.97585 0.654572C2.32544 0.651371 2.66231 0.785607 2.9139 1.02837L7.94323 6.05681L7.94234 6.0577Z'
                                          fill={
                                             item.slug === activeKey
                                                ? 'white '
                                                : '#808080'
                                          }
                                       />
                                    </svg>
                                 </div>
                              ))}
                        </article>
                        <Dropdown
                           overlayClassName='common_dropdown'
                           className=' hidden px-[10px] md:hidden sm:flex'
                           menu={{
                              items,
                              onClick: (slug) => {
                                 setActiveKey(slug.key);
                              },
                              activeKey,
                           }}
                        >
                           <div className='flex h-[50px] items-center justify-between  rounded-[4px] border-[1px] border-[#C4C4C4]'>
                              <p className=' text-[16px] font-normal leading-[26.59px] text-[#909090]'>
                                 {dropdownActiveKey
                                    ? translate(
                                         lang,
                                         dropdownActiveKey.title_En,
                                         dropdownActiveKey.title_En
                                      )
                                    : ' News and Notices'}
                              </p>
                              <svg
                                 width='14'
                                 height='9'
                                 viewBox='0 0 14 9'
                                 fill='none'
                                 xmlns='http://www.w3.org/2000/svg'
                              >
                                 <path
                                    fillRule='evenodd'
                                    clipRule='evenodd'
                                    d='M7.6088 8.27632C7.3588 8.52601 7.01991 8.66626 6.66658 8.66626C6.31324 8.66626 5.97436 8.52601 5.72436 8.27632L0.695023 3.24877C0.445012 2.99864 0.304604 2.65944 0.304688 2.30579C0.304771 1.95214 0.445338 1.613 0.695467 1.36299C0.945595 1.11298 1.2848 0.972573 1.63845 0.972656C1.9921 0.97274 2.33123 1.11331 2.58124 1.36344L6.66658 5.44877L10.7519 1.36344C11.0033 1.12044 11.34 0.985884 11.6896 0.988756C12.0392 0.991628 12.3737 1.1317 12.621 1.37879C12.8683 1.62589 13.0087 1.96024 13.0119 2.30983C13.0151 2.65943 12.8809 2.9963 12.6381 3.24788L7.60969 8.27722L7.6088 8.27632Z'
                                    fill='#909090'
                                 />
                              </svg>
                           </div>
                        </Dropdown>
                     </div>
                     <div className='w-full'>
                        {isEmpty(allNotices?.result) ? (
                           <Empty />
                        ) : (
                           <article className=' w-full border '>
                              {allNotices?.result?.map((notice) => (
                                 <div
                                    key={notice.id}
                                    className='flex items-center  gap-x-[15px] pb-[13px] pr-[27px] pt-[19px] even:bg-[#F2F2F2] sm:py-[10px] sm:pr-[13px]'
                                 >
                                    <div className=' flex    flex-col items-center justify-center gap-y-[9px] border-r px-[15px]  text-[#808080]  sm:px-[10px]'>
                                       <div className='w-[70px] shrink items-center  justify-center  text-[16px]  font-normal leading-[22px]'>
                                          <p className='text-center'>
                                             {lang === 'en'
                                                ? converAdToBs(
                                                     notice.updatedAt,
                                                     'DD MMM'
                                                  )
                                                : converAdToBs(
                                                     notice.createdAt,
                                                     'DD MMMM'
                                                  )}
                                          </p>
                                          <p className='mt-[9px] text-center'>
                                             {converAdToBs(
                                                notice.createdAt,
                                                'YYYY'
                                             )}
                                          </p>
                                       </div>
                                    </div>
                                    <div className='flex w-full flex-auto items-center justify-between  sm:flex-1'>
                                       <Space
                                          direction='vertical'
                                          size={7}
                                          className='w-full'
                                       >
                                          <p className=' text-[18px] font-medium leading-[25px] text-grey30 sm:text-[16px] sm:leading-[22px]'>
                                             {lang === 'en'
                                                ? notice.title_En.slice(0, 100)
                                                : (notice.title_Np ?? '').slice(
                                                     0,
                                                     100
                                                  )}
                                          </p>
                                          <div className='flex w-full items-center gap-x-[25px]'>
                                             <Link
                                                href={`/${lang}/notice/${activeKey}/${notice?.slug}`}
                                             >
                                                <p className='flex items-center gap-x-[9px] text-[16px] font-medium leading-[27px] text-primary'>
                                                   Read more
                                                   <span>
                                                      <svg
                                                         width='6'
                                                         height='11'
                                                         viewBox='0 0 6 11'
                                                         fill='none'
                                                         xmlns='http://www.w3.org/2000/svg'
                                                      >
                                                         <path
                                                            fillRule='evenodd'
                                                            clipRule='evenodd'
                                                            d='M5.70627 4.7934C5.89353 4.9809 5.99872 5.23507 5.99872 5.50007C5.99872 5.76507 5.89353 6.01923 5.70627 6.20673L1.9356 9.97873C1.748 10.1662 1.4936 10.2715 1.22836 10.2715C0.963126 10.2714 0.708775 10.166 0.521267 9.9784C0.333759 9.7908 0.228453 9.5364 0.228516 9.27116C0.228578 9.00592 0.334004 8.75157 0.5216 8.56407L3.5856 5.50007L0.5216 2.43607C0.339351 2.24755 0.238436 1.99499 0.24059 1.7328C0.242744 1.4706 0.347794 1.21973 0.533116 1.03424C0.718437 0.848741 0.969201 0.743453 1.2314 0.741052C1.49359 0.73865 1.74625 0.839328 1.93493 1.0214L5.70693 4.79273L5.70627 4.7934Z'
                                                            fill='#0C62BB'
                                                         />
                                                      </svg>
                                                   </span>
                                                </p>
                                             </Link>
                                             {notice.downloadFile && (
                                                <Link
                                                   href={
                                                      BASE_IMAGE_URL +
                                                      notice.downloadFile
                                                   }
                                                   download={notice.title_En}
                                                   target='_blank'
                                                >
                                                   <button
                                                      type='button'
                                                      className='flex items-center gap-x-[7px]'
                                                   >
                                                      <svg
                                                         width='13'
                                                         height='13'
                                                         viewBox='0 0 16 16'
                                                         fill='none'
                                                         xmlns='http://www.w3.org/2000/svg'
                                                      >
                                                         <path
                                                            d='M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196666 15.0217 0.000666667 14.5507 0 14V11H2V14H14V11H16V14C16 14.55 15.8043 15.021 15.413 15.413C15.0217 15.805 14.5507 16.0007 14 16H2Z'
                                                            fill='#0C62BB'
                                                         />
                                                      </svg>
                                                      <p className='text-[16px] font-medium leading-[27px] text-primary'>
                                                         Download
                                                      </p>
                                                   </button>
                                                </Link>
                                             )}
                                          </div>
                                       </Space>
                                    </div>
                                 </div>
                              ))}
                           </article>
                        )}
                        <div className='py-[19px]  sm:w-full sm:pl-0'>
                           <button
                              type='button'
                              className=' flex items-center justify-between gap-x-[7px] rounded-[5px] bg-primary px-[20px] py-[11.5px] text-[16px] font-medium leading-[26px] text-white sm:w-full sm:justify-center'
                              onClick={() => {
                                 router.push(`/${lang}/notices/${activeKey}`);
                              }}
                           >
                              <span>View more</span>
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
               </div>
            </article>
         </section>
      );
   }
}
