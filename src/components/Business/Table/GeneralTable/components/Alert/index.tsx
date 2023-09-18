import * as React from 'react';
import { Alert } from 'antd';

import type { IntlShape } from 'umi';
import { useIntl } from 'umi';

import styles from './index.less';

export type AlertOptionRenderProps = {
  intl: IntlShape;
  onCleanSelected: () => void;
  onDeleteSelected?: () => void;
};

export type TableAlertProps<T> = {
  selectedRowKeys: React.Key[];
  selectedRows: T[];
  alertInfoRender?: (selectedRowKeys: React.Key[], selectedRows: T[]) => React.ReactNode;
  onCleanSelected: AlertOptionRenderProps['onCleanSelected'];
  onDeleteSelected?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  alertOptionRender?: false | ((props: AlertOptionRenderProps) => React.ReactNode);
};

const defaultAlertOptionRender = (props: AlertOptionRenderProps) => {
  const { intl, onCleanSelected, onDeleteSelected } = props;

  return [
    <a onClick={() => onDeleteSelected && onDeleteSelected()} key="0">
      {intl.formatMessage({ id: 'table.alert.delete' })}
    </a>,
    <a onClick={onCleanSelected} key="1">
      {intl.formatMessage({ id: 'table.alert.clear' })}
    </a>,
  ];
};

const defaultAlertInfoRender = (selectedRowKeys: React.Key[]) => (
  <span>
    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
  </span>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TableAlert = <T, _U = AnyObject>({
  onCleanSelected,
  onDeleteSelected,
  selectedRows = [],
  selectedRowKeys = [],
  alertInfoRender = defaultAlertInfoRender,
  alertOptionRender = defaultAlertOptionRender,
}: TableAlertProps<T>) => {
  const intl = useIntl();

  const option =
    alertOptionRender &&
    alertOptionRender({
      intl,
      onCleanSelected,
      onDeleteSelected: () => onDeleteSelected && onDeleteSelected(selectedRowKeys, selectedRows),
    });

  const dom = alertInfoRender(selectedRowKeys, selectedRows);
  if (!dom) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <Alert
        message={
          <div className={styles.message}>
            <div className={styles.messageContent}>{dom}</div>
            {option && <div className={styles.options}>{option}</div>}
          </div>
        }
        type="info"
        showIcon
      />
    </div>
  );
};
