import * as React from 'react';
import classnames from 'classnames';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { AvatarDropdown as Avatar } from './AvatarDropdown';
import { SelectLang } from './SelectLang';

import styles from './index.less';

export type SiderTheme = 'light' | 'dark';
export type GlobalHeaderRightProps = {
  theme?: SiderTheme;
  layout?: 'sidemenu' | 'topmenu';
};

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = () => {
  const { setting } = useStoreState('setting');

  const { navTheme: theme, layout } = setting;

  return (
    <div
      className={classnames(styles.right, {
        [styles.dark]: theme === 'dark' && layout === 'topmenu',
      })}
    >
      <Avatar />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default GlobalHeaderRight;
