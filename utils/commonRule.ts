import { type Locale } from '@/i18n';
import dayjs from 'dayjs';
import NepaliDate from 'nepali-date-converter';
import { usePathname } from 'next/navigation';
import he from 'he';

export const scrollToDefineId = (id: string) => {
   const section = document?.getElementById(id);
   if (section) {
      section?.scrollIntoView({
         behavior: 'smooth',
         block: 'start',
         inline: 'nearest',
      });
   }
};

export const customCombineArray = <T>(
   originalArray: T[],
   size: number
): T[][] => {
   const groupedArray: T[][] = [];
   for (let i = 0; i < originalArray.length; i += size) {
      const group = originalArray.slice(i, i + size);
      groupedArray.push(group);
   }
   return groupedArray;
};

export const firstLetterCapitalSingleWord = (string: string) => {
   if (!string) {
      return '';
   }
   if (/\s/.test(string)) {
      return string;
   }

   return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
};

export const translate = (lang: Locale, en: string, np: string) => {
   const t = lang === 'en' ? en : np ?? en;
   return t;
};

const videoExtensions = ['.mpg', '.mp2', '.mpeg', '.mpe', '.mpv', '.mp4'];

const imageExtensions = ['.gif', '.jpg', '.jpeg', '.png'];

export const isImage = (v: string) => {
   let status = false;
   imageExtensions.forEach((e) => {
      if (v.includes(e)) {
         status = true;
         return;
      }
   });
   return status;
};

export const isVideo = (v: string) => {
   let status = false;
   videoExtensions.forEach((e) => {
      if (v.includes(e)) {
         status = true;
         return;
      }
   });

   return status;
};

export const redirectedPathName = (locale: Locale, url: string) => {
   const pathName = usePathname();
   if (!pathName) return '/';
   const segments = pathName.split('/');
   segments.length = 3;
   segments[1] = locale;
   segments[2] = url;
   return segments.join('/');
};

export const converAdToBs = (date: Date, format?: string) => {
   if (date) {
      const pathName = usePathname();

      const locale = pathName.split('/')[1];

      const adDate = new Date(date);

      const nepali = new NepaliDate(adDate);

      const formating = nepali.getBS();

      const a = new NepaliDate(formating.year, formating.month, formating.date);

      const finaleDate =
         locale === 'en'
            ? dayjs(date).format(format)
            : a.format(format ?? 'YYYY MMMM DD', 'np');

      return finaleDate;
   } else {
      return '-';
   }
};

export const replaceTagRegex = (str: string) => {
   const data = he.decode(str).replace(/<[^>]+>/g, '');

   return data;
};

export const translateWeekDays = (lang: Locale, day: string) => {
   const week_En = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
   ];

   const week_Np = [
      'आइतबार',
      'सोमबार',
      'मंगलबार',
      'बुधबार',
      'बिहिबार',
      'शुक्रबार',
      'शनिबार',
   ];

   if (lang === 'en') {
      return day;
   } else {
      const index = week_En.indexOf(day);
      if (index !== -1) {
         return week_Np[index];
      } else {
         return null;
      }
   }
};
