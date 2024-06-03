import { type IMessage } from '@/interface';
import { fetch } from '.';
import { type Contact } from '@/models/contact';

export const contactUs: Post<
   Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
> = async (data) => {
   const res = await fetch(`contact`, {
      method: 'POST',
      body: JSON.stringify(data),
      // credentials: 'include',
   });

   return res.data as IMessage;
};
