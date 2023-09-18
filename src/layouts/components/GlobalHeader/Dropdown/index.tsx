import * as React from 'react';
import classNames from 'classnames';
import type { DropDownProps } from 'antd/es/dropdown';
import { Dropdown } from 'antd';

import styles from './index.less';

// declare type OverlayFunc = () => React.ReactNode;

export type HeaderDropdownProps = {
  overlayClassName?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
} & DropDownProps;

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => <Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />;
