import { message } from 'antd';
import { type RcFile, type UploadProps } from 'antd/es/upload';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import Cookie from 'js-cookie';
import { kebabCase } from 'lodash';
import { type ROLE_NAME } from '@/enums/role';
import { BASE_API } from '@/constants/config';

export const getRole = () => {
   return Cookie.get('role') as ROLE_NAME;
};

export const successNotification = (message: string) =>
   toast.success(message, {
      autoClose: 1500,
      bodyClassName: 'align-baseline',
      style: {
         fontWeight: 500,
         fontFamily: 'Mukta',
      },
   });

export const errorNotification = (message: string) =>
   toast.error(message, {
      autoClose: 1500,
      bodyClassName: 'align-baseline',
      style: {
         fontWeight: 500,
         fontFamily: 'Mukta',
      },
   });

export const queryKeys = (key: string) => ({
   all: [key] as const,
   lists: () => [...queryKeys(key).all, 'list'] as const,
   list: (filters: object) => [...queryKeys(key).lists(), filters] as const,
   details: () => [...queryKeys(key).all, 'detail'] as const,
   detail: (id: string | number) => [...queryKeys(key).details(), id] as const,
});

export const getBase64 = (file: RcFile): Promise<string> =>
   new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
         resolve(reader.result as string);
      };
      reader.onerror = (error) => {
         reject(error);
      };
   });

export const uploadProps = (
   type: 'image' | 'video' | 'file',
   role: ROLE_NAME
): UploadProps => ({
   name: 'file',
   multiple: true,
   className: 'upload-list-inline cursor-pointer',
   // eslint-disable-next-line @typescript-eslint/no-misused-promises
   customRequest: async ({ file, onSuccess, onError, onProgress }) => {
      if (typeof file !== 'string' && onError) {
         switch (true) {
            case type === 'image' && !file.type.startsWith('image/'):
               void message.error('You can only upload images');
               onError(new Error('You can only upload images'));
               return;

            case type === 'video' && !file.type.startsWith('video/'):
               void message.error('You can only upload videos');
               onError(new Error('You can only upload videos'));
               return;
         }
      }

      const formData = new FormData();

      const config: AxiosRequestConfig = {
         headers: {
            'content-type': 'multipart/form-data',
            Authorization: `Bearer ${Cookie.get('token')}`,
         },
         onUploadProgress: (progressEvent) => {
            if (!progressEvent.total || !onProgress) return;

            const percentCompleted = Math.round(
               (progressEvent.loaded * 100) / progressEvent.total
            );

            onProgress({ percent: percentCompleted });
         },
      };

      formData.append('file', file);

      try {
         const res = await axios.post(
            `${BASE_API}${kebabCase(role)}/upload`,
            formData,
            config
         );

         if (onSuccess) onSuccess(res.data);
      } catch (err) {
         if (onError) {
            if (err instanceof AxiosError) {
               const { message = 'Something went wrong' } = err?.response?.data;
               onError(new Error(message as string), file);
            } else onError(new Error('Something went wrong'), file);
         }
      }
   },
});

export const debounce = <T>(fn: (v: T) => void, wait: number) => {
   let timeout: NodeJS.Timeout | null = null;

   return (v: T) => {
      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
         fn(v);
      }, wait);
   };
};

export const replaceUUID = (str: string, replaceValue: string) => {
   const uuid = str.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i
   );

   if (uuid === null) return str;

   const prefix = str.match(/^(file|image|video)\//);

   return str
      .replace(uuid[0], replaceValue)
      .replace(prefix === null ? '' : prefix[0], '');
};

export const videoThumbnail = (videoUrl: string) => {
   const video = document.createElement('video');

   const canvas = document.createElement('canvas');

   const ctx = canvas.getContext('2d');

   video.addEventListener('loadeddata', () => {
      video.currentTime = 5;

      canvas.width = video.videoWidth;

      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
   });

   video.src = videoUrl;

   video.load();

   return canvas.toDataURL('image/jpeg');
};
