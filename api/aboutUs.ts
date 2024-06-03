import type { AboutUs } from '@/models/about';
import { fetch } from '.';

export const getAboutUs = async (): Promise<AboutUs> => {
   const url = 'about-us';

   try {
      const res = await fetch(url, {
         cache: 'no-store',
      });

      const { data } = res.data;

      return data as AboutUs;
   } catch (error) {
      console.error('Error fetching banners:', error);

      throw error;
   }
};
