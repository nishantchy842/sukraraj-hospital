import { Button, Space } from 'antd';
import React, { type ReactElement } from 'react';
import styles from './style.module.scss';
import classNames from 'classnames';

type Props = {
   title: string;
   icon?: ReactElement;
   onClick?: () => void;
   background?: string;
   color?: string;
   htmlType?: string;
   height?: string;
   width?: string;
   border?: string;
   disabled?: boolean;
   loading?: boolean;
   className?: string;
   rightIcon?: ReactElement;
};

export default function CustomButton({
   title,
   icon,
   onClick,
   background,
   color,
   height,
   width,
   border,
   disabled,
   loading,
   className,
   rightIcon,
}: Props) {
   return (
      <div className={styles.customButton}>
         <Button
            onClick={onClick}
            disabled={disabled}
            loading={loading}
            className={classNames(
               'small_body_semibold ',
               height
                  ? `h-[${height}] sm:h-[${height}] md:h-[${height}]`
                  : '!h-[50px] md:h-[50px] sm:h-[50px]',
               width ? `w-[${width}] md:w-[${width}] sm:w-[${width}]` : 'w-fit',
               className
            )}
            style={{
               background,
               color,
               border,
            }}
            icon={icon}
         >
            <Space>
               {title}
               {rightIcon}
            </Space>
         </Button>
      </div>
   );
}
