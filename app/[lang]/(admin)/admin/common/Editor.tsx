import dynamic from 'next/dynamic';
import katex from 'katex';
import { uploadApi } from '@/api/admin/upload';
import { BASE_IMAGE_PATH } from '@/constants/config';
import { type ROLE_NAME } from '@/enums/role';
import { errorNotification } from '@/utils';
import type {
   UploadBeforeHandler,
   UploadBeforeReturn,
} from 'suneditor-react/dist/types/upload';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

type Props = {
   initialValue?: string | null;
   setValue: (val: string) => void;
   role: ROLE_NAME;
};

const Editor: React.FC<Props> = ({ initialValue, setValue, role }) => {
   function onImageUploadBefore(
      files: File[],
      _info: object,
      uploadHandler: UploadBeforeHandler
   ): UploadBeforeReturn {
      const formData = new FormData();

      formData.append('file', files[0], files[0]?.name);

      uploadApi[role]
         .upload(formData)
         .then((res) => {
            const location = BASE_IMAGE_PATH + res?.data?.path;

            uploadHandler({
               result: [
                  {
                     url: location,
                     name: files[0]?.name,
                     size: files[0]?.size,
                  },
               ],
            });
         })
         .catch((error) => {
            if (error instanceof Error) errorNotification(error.message);
         });

      return undefined;
   }

   return (
      <SunEditor
         defaultValue={initialValue ?? undefined}
         height='450px'
         onImageUploadBefore={onImageUploadBefore}
         setOptions={{
            katex,
            buttonList: [
               ['undo', 'redo'],
               [
                  ':p-More Paragraph-default.more_paragraph',
                  'fontSize',
                  'formatBlock',
                  'paragraphStyle',
                  'blockquote',
               ],
               [
                  'bold',
                  'underline',
                  'italic',
                  'strike',
                  'subscript',
                  'superscript',
               ],
               ['fontColor', 'hiliteColor', 'textStyle'],
               ['removeFormat'],
               ['outdent', 'indent'],
               ['align', 'horizontalRule', 'list', 'lineHeight'],
               ['-right', 'image', 'table', 'math'],
            ],
            imageUrlInput: false,
         }}
         onChange={setValue}
      />
   );
};

export default Editor;
