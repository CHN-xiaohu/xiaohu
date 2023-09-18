import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { logout } from '@/services/User';

import { Icons } from '@/components/Library/Icon';

import { useMemo } from 'react';
import { Avatar, Menu, Spin } from 'antd';
import type { ClickParam } from 'antd/es/menu';
import { history, useIntl } from 'umi';

import styles from '../index.less';

import { HeaderDropdown } from '../Dropdown';

type AvatarDropdownProps = {
  menu?: boolean;
};

export const AvatarDropdown = ({ menu = true }: AvatarDropdownProps) => {
  const { userInfo: currentUser } = useStoreState('user');
  const intl = useIntl();

  const onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      window.$fastDispatch((model) => model.user.logout);

      return;
    }

    history.push(`/account/${key}`);
  };

  const AvatarEl = useMemo(
    () => (
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser?.avatar} alt="avatar" />
        <span className={styles.name}>{currentUser?.name}</span>
      </span>
    ),
    [currentUser],
  );

  if (!menu) {
    return AvatarEl;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="password">
        <Icons type="UserOutlined" />
        {intl.formatMessage({ id: 'account.password', defaultMessage: 'account password' })}
      </Menu.Item>
      {currentUser.isSubAccount === 'YES' ? (
        <Menu.Item key="settings">
          <Icons type="SettingOutlined" />
          {intl.formatMessage({ id: 'account.settings', defaultMessage: 'account settings' })}
        </Menu.Item>
      ) : (
        ''
      )}

      <Menu.Divider />
      <Menu.Item key="logout" onClick={logout}>
        <Icons type="LogoutOutlined" />
        {intl.formatMessage({ id: 'account.logout', defaultMessage: 'logout' })}
      </Menu.Item>
    </Menu>
  );

  return currentUser?.name ? (
    <HeaderDropdown overlay={menuHeaderDropdown}>{AvatarEl}</HeaderDropdown>
  ) : (
    <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
  );
};
