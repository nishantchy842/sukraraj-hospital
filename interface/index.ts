import { type Key } from 'react';
import { type User } from '@/models/admin/user';

export type IAuthContext = {
   authUser?: User;
};

export type IGetAll<T> = {
   result: T[];
   currentPage: number;
   totalPage: number;
   count: number;
};

export type IQueryParamaters = {
   pagination?: boolean;
   page?: number;
   size?: number;
   sort?: Key | readonly Key[];
   order?: 'ASC' | 'DESC';
};

export type IMessage = {
   message: string;
};

declare global {
   type Get<T, V> = (args: T) => Promise<V>;

   type GetAll<T, V> = (args: T) => Promise<IGetAll<V>>;

   type Post<T> = (args: T) => Promise<IMessage>;

   type Patch<T> = (args: T) => Promise<IMessage>;

   type Delete<T> = (args: T) => Promise<IMessage>;

   type FetchError = { message: string; status: number };

   type Nullable<T> = {
      [P in keyof T]: T[P] | null;
   };
}
