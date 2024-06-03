import { fetch } from '.';
import type { User } from '@/models/user';
import type { IMessage } from '@/interface';

export const getProfile = async (): Promise<User> => {
   const res = await fetch('/auth/profile');

   const { data } = res.data;

   return data as User;
};

export const login = async (data: {
   email: string;
   password: string;
}): Promise<{
   token: string;
}> => {
   const res = await fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-store',
      credentials:
         process.env.NODE_ENV === 'production' ? 'include' : undefined,
   });

   const { d } = res.data;

   return d as { token: string };
};

export const updateProfile: Patch<
   Partial<Pick<User, 'name' | 'image'>>
> = async ({ name, image }) => {
   const res = await fetch('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name, image }),
      credentials:
         process.env.NODE_ENV === 'production' ? 'include' : undefined,
   });

   return res?.data as IMessage;
};

export const changePassword: Patch<{
   oldPassword: string;
   newPassword: string;
}> = async ({ oldPassword, newPassword }) => {
   const res = await fetch('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({
         oldPassword,
         newPassword,
      }),
      credentials:
         process.env.NODE_ENV === 'production' ? 'include' : undefined,
   });

   return res?.data as IMessage;
};

export const logout: Delete<unknown> = async () => {
   const res = await fetch('/auth/logout', {
      method: 'DELETE',
      credentials:
         process.env.NODE_ENV === 'production' ? 'include' : undefined,
   });

   return res?.data as IMessage;
};

export const getBoardMessage = async () => {
   // const res = await fetch(`/message`, {
   //    cache: 'no-store',
   //    credentials:
   //       process.env.NODE_ENV === 'production' ? 'include' : undefined, // credentials: 'include',
   // });

   // const { data } = res.data;

   return [
      {
         imageUrl: 'https://picsum.photos/200',
         name: 'DR. basudev pandey',
         role: 'Director',
         message:
            'Lorem ipsum dolor sit amet consectetur. Tellus vitae in amet condimentum gravida proin porta euismod. Eu semper tortor facilisis senectus. Vitae placerat in enim consectetur tortor et scelerisque. Platea amet sollicitudin molestie viverra viverra aliquam morbi sed pellentesque. Lorem ipsum dolor sit amet consectetur. Tellus vitae in amet condimentum gravida proin porta euismod. Eu semper tortor facilisis senectus. Vitae placerat in enim consectetur tortor et scelerisque. Platea amet sollicitudin molestie viverra viverra aliquam morbi sed pellentesque. Lorem ipsum dolor sit amet consectetur.   Tellus vitae in amet condimentum gravida proin porta euismod. Eu semper tortor facilisis senectus. Vitae placerat in enim consectetur tortor et scelerisque. Platea amet sollicitudin molestie viverra viverra aliquam morbi sed pellentesque. ',

         facebookUrl: '',
         twitterUrl: '',
         viberUrl: '',
      },
      {
         imageUrl: 'https://picsum.photos/200',
         name: 'Professor basudev pandey',
         role: 'Director',
         facebookUrl: '',
         twitterUrl: '',
         message:
            'Lorem ipsum dolor sit amet consectetur. Tellus vitae in amet condimentum gravida proin porta euismod. Eu semper tortor facilisis senectus. Vitae placerat in enim consectetur tortor et scelerisque. Platea amet sollicitudin molestie viverra viverra aliquam morbi sed pellentesque. Lorem ipsum dolor sit amet consectetur. Tellus vitae in amet condimentum gravida proin porta euismod. Eu semper tortor facilisis senectus. Vitae placerat in enim consectetur tortor et scelerisque. Platea amet sollicitudin molestie viverra viverra aliquam morbi sed pellentesque. Lorem ipsum dolor sit amet consectetur.   Tellus vitae in amet condimentum gravida proin porta euismod. Eu semper tortor facilisis senectus. Vitae placerat in enim consectetur tortor et scelerisque. Platea amet sollicitudin molestie viverra viverra aliquam morbi sed pellentesque. ',
         viberUrl: '',
      },
   ];
};
