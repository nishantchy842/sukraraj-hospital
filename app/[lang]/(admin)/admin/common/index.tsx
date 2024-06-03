import { type ChangeEvent } from 'react';
import { Form, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from '@/utils';

export const getColumnSearchProps = (
   dataIndex: string,
   debounceFn: (e: HTMLInputElement['value']) => void
) => {
   const debounceSearch = debounce<ChangeEvent<HTMLInputElement>>((e) => {
      debounceFn(e.target.value);
   }, 300);

   return {
      filterDropdown: () => (
         <div
            id='admin'
            className='p-[8px]'
            onKeyDown={(e) => {
               e.stopPropagation();
            }}
         >
            <Form layout='vertical'>
               <Form.Item>
                  <Input
                     placeholder={`Search ${dataIndex}`}
                     onChange={debounceSearch}
                  />
               </Form.Item>
            </Form>
         </div>
      ),
      filterIcon: () => <SearchOutlined />,
   };
};
