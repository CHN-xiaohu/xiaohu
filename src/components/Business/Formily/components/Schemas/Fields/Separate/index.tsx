import * as React from 'react';
import { createVirtualBox } from '@formily/antd';

import styles from './index.less';

type IProps = {
  // schema: {
  //   'x-props'?: {
  //     title?: string;
  //     style?: React.CSSProperties;
  //     rules?: boolean;
  //   };
  // };
} & React.PropsWithChildren<any>;

const FC = ({ style, title, children }: IProps) => (
  <>
    <div className={styles.warpper} style={style}>
      {title}
    </div>
    {children}
  </>
);

declare global {
  interface GlobalFormSchemaComponentType {
    separate: string;
  }
}

export const Separate = createVirtualBox('separate', FC);
