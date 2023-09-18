import { memo } from 'react';
import type { IntlShape } from 'umi';
import { Tooltip } from 'antd';

import { icons } from '@app_components/Library/Icon';

import { GroupCheckboxListPopover } from './GroupCheckboxList';

import './index.less';

type ColumnSettingProps = {
  intl: IntlShape;
};

const Main = (props: ColumnSettingProps) => (
  <GroupCheckboxListPopover className="general-table-column-setting" intl={props.intl}>
    <Tooltip title={props.intl.formatMessage({ id: 'table.toolBar.columnSetting' })}>
      <icons.SettingOutlined />
    </Tooltip>
  </GroupCheckboxListPopover>
);

export const ColumnSetting = memo(Main);
