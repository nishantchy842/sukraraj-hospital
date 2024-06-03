import Cookie from 'js-cookie';
import { BASE_API } from '@/constants/config';

export class FetchError extends Error {
   constructor(
      public readonly message: string,
      public readonly status: number
   ) {
      super(message);
   }
}

const fetcher = async (url: string, config?: RequestInit) => {
   const res = await fetch(`${BASE_API}${url}`, {
      headers: {
         ['Authorization']: `Bearer ${Cookie.get('token')}`,
         ['Content-Type']: 'application/json',
      },
      ...config,
   });

   const data = await res.json();

   if (res.ok) return { data, ...res };

   const { message = 'Something went wrong' } = data;

   throw new FetchError(message as string, res.status);
};

export { fetcher as fetch };
