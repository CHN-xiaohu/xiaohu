/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useIntl } from 'umi';
import { Checkbox, Tooltip } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { Icons } from '@app_components/Library/Icon';

import type { UseTableStoreState } from '../../../../../Container';
import { Container } from '../../../../../Container';

import '../index.less';

const ToolTipIcon: React.FC<{
  title: string;
  show: boolean;
  onClick: (e: React.MouseEvent<HTMLSpanElement>) => void;
}> = ({ title, show, onClick, children }) => {
  if (!show) {
    return null;
  }

  return (
    <Tooltip title={title}>
      <span onClick={onClick}>{children}</span>
    </Tooltip>
  );
};

export type CheckboxListItemProps = {
  className?: string;
  dataSource: UseTableStoreState['tableColumns'][0];
};

export const CheckboxListItem: React.FC<CheckboxListItemProps> = ({ className, dataSource }) => {
  const intl = useIntl();
  const { show, title, fixed } = dataSource;
  const columnKey = dataSource.key || String(dataSource.dataIndex);
  const { setState } = Container.useContainer();

  const handleCheckboxChange = React.useCallback(
    (e: CheckboxChangeEvent) => {
      setState((draft) => {
        draft.tableColumns[dataSource.index].show = e.target.checked;
      });
    },
    [dataSource.index],
  );

  const handleCheckboxFixed = React.useCallback(
    (fixedValue?: 'left' | 'right') => () => {
      setState((draft) => {
        draft.tableColumns[dataSource.index].fixed = fixedValue;
      });
    },
    [dataSource.index],
  );

  return (
    <span className={`${className}-list-item`} key={columnKey}>
      <Checkbox onChange={handleCheckboxChange} checked={show}>
        {title}
      </Checkbox>
      <span className={`${className}-list-item-option`}>
        <ToolTipIcon
          title={intl.formatMessage({ id: 'table.toolBar.leftPin', defaultMessage: '固定到左边' })}
          show={fixed !== 'left'}
          onClick={handleCheckboxFixed('left')}
        >
          <Icons
            type="PushpinOutlined"
            style={{
              transform: 'rotate(-90deg)',
            }}
          />
        </ToolTipIcon>
        <ToolTipIcon
          title={intl.formatMessage({ id: 'table.toolBar.noPin', defaultMessage: '取消固定' })}
          show={!!fixed}
          onClick={handleCheckboxFixed(undefined)}
        >
          <Icons type="VerticalAlignMiddleOutlined" />
        </ToolTipIcon>
        <ToolTipIcon
          title={intl.formatMessage({ id: 'table.toolBar.rightPin', defaultMessage: '固定到右边' })}
          show={fixed !== 'right'}
          onClick={handleCheckboxFixed('right')}
        >
          <Icons type="PushpinOutlined" />
        </ToolTipIcon>
      </span>
    </span>
  );
};
