import * as React from 'react';
import type { IntlShape } from 'umi';
import { Checkbox, Popover } from 'antd';

import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { GroupCheckboxList } from './GroupCheckboxList';

import { Container } from '../../../../../Container';

import '../index.less';

type ColumnSettingProps = {
  className: string;
  intl: IntlShape;
  children: React.ReactNode;
};

const Main = (props: ColumnSettingProps) => {
  const {
    state,
    setTableColumnsSelectAllOrCancelAll,
    resetTableColumnsValue,
  } = Container.useContainer();

  const { className } = props;

  const selectKeys = state.tableColumns.filter((item) => item.show);
  const selectAllChecked = selectKeys?.length === state.tableColumns.length;
  const indeterminate = selectKeys.length > 0 && selectKeys.length !== state.tableColumns.length;

  const handleCheckboxChange = React.useCallback(
    (e: CheckboxChangeEvent) => {
      setTableColumnsSelectAllOrCancelAll(e.target.checked);
    },
    [setTableColumnsSelectAllOrCancelAll],
  );

  const handleReset = React.useCallback(() => {
    resetTableColumnsValue();
  }, [resetTableColumnsValue]);

  return (
    <Popover
      arrowPointAtCenter
      title={
        <div className={`${className}-title`}>
          <Checkbox
            indeterminate={indeterminate}
            checked={selectAllChecked}
            onChange={handleCheckboxChange}
          >
            {props.intl.formatMessage({ id: 'table.toolBar.columnSetting.display' })}
          </Checkbox>

          <a onClick={handleReset}>
            {props.intl.formatMessage({ id: 'table.toolBar.columnSetting.reload' })}
          </a>
        </div>
      }
      trigger="click"
      placement="bottomRight"
      content={<GroupCheckboxList className={className} tableColumns={state.tableColumns} />}
    >
      <>{props.children}</>
    </Popover>
  );
};

export const GroupCheckboxListPopover = React.memo(Main);
