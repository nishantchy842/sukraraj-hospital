import { useState } from 'react';
import { Image, type UploadFile } from 'antd';

export const usePreview = () => {
   const [config, setConfig] = useState({
      isOpen: false,
      url: '',
   });

   return {
      handlePreview: (file: UploadFile) => {
         setConfig({
            isOpen: true,
            url: file.url ?? URL.createObjectURL(file.originFileObj as Blob),
         });
      },
      Preview: () => (
         <Image
            alt='image'
            preview={{
               visible: config.isOpen,
               src: config.url,
               onVisibleChange: (value) => {
                  setConfig({ isOpen: value, url: '' });
               },
            }}
            style={{ display: 'none' }}
         />
      ),
   };
};
