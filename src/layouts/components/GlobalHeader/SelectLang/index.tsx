import * as React from 'react';
import { Menu } from 'antd';
import type { ClickParam } from 'antd/es/menu';

import { setLocale, getLocale } from 'umi';
import classNames from 'classnames';

import { Icons } from '@app_components/Library/Icon';

import styles from './index.less';

import { HeaderDropdown } from '../Dropdown';

type SelectLangProps = {
  className?: string;
};

export const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { className } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }: ClickParam): void => setLocale(key);

  const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR'];
  const languageLabels = {
    'zh-CN': '简体中文',
    'en-US': 'English',
  };
  const languageIcons = {
    'zh-CN': '🇨🇳',
    'en-US': '🇺🇸',
  };

  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map((locale) => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <Icons type="GlobalOutlined" />
      </span>
    </HeaderDropdown>
  );
};
