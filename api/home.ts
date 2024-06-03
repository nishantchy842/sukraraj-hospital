import { type IGetAll, type IQueryParamaters } from '@/interface';
import { type DailyCapacity, type BasicInfo } from '@/models/todo';
import { fetch } from '.';

//banners

type Banner = {
   id: number;
   image: string;
   createdAt: Date;
   updatedAt: Date;
   priority: number;
};
export const getAllBanners: GetAll<IQueryParamaters, Banner> = async ({
   pagination = true,
   page = 1,
   size = 10,
   sort = 'updatedAt',
   order = 'DESC',
}) => {
   const url = `banner?pagination=${pagination}&page=${page}&size=${size}&sort=${sort.toString()}&order=${order}`;

   try {
      const res = await fetch(url, {
         cache: 'no-store',
      });
      const data = res.data;

      return data as IGetAll<Banner>;
   } catch (error) {
      // Handle error
      console.error('Error fetching banners:', error);
      throw error;
   }
};

//basic information
export const getBasicInformation = async (): Promise<BasicInfo> => {
   try {
      const url = `basic-information`;
      const res = await fetch(url, {
         cache: 'no-store',
      });
      const { data } = res.data;
      return data as BasicInfo;
   } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
   }
};

//daily capacity
export const getDailyCapacity = async (): Promise<DailyCapacity[]> => {
   try {
      const url = 'daily-capacity';
      const res = await fetch(url, {
         cache: 'no-store',
      });
      const { data } = res.data;
      return data as DailyCapacity[];
   } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
   }
};
