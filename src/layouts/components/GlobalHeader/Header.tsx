import { memo } from 'react';

// import { Icons } from '@/components/Library/Icon';

import styles from './index.less';

import { Breadcrumb } from './Breadcrumb';
import GlobalHeaderRight from './RightContent';

export const Header = memo(() => (
  <div className="ant-pro-global-header" id="globalHeader">
    <div className={styles.left}>
      <Breadcrumb />
    </div>

    <GlobalHeaderRight />
  </div>
));
