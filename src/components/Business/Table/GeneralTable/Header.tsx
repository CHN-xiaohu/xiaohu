import type { ButtonListProps } from '@/components/Library/ButtonList';
import { ButtonList } from '@/components/Library/ButtonList';

import { useCallback, useMemo } from 'react';
import classNames from 'classnames';

import type { ToolBarProps } from './components/ToolBar';
import { ToolBar } from './components/ToolBar';

import styles from './index.less';
import type { TableActions } from './Container';
import type { TableAlertProps } from './components/Alert';
import { TableAlert } from './components/Alert';

export type TableHeaderProps<V> = {
  headerTitle?: React.ReactNode | string;
  actions: TableActions<V>;

  defaultAddOperationButtonListProps?: Partial<ButtonListProps['list'][0]>;
  operationButtonListProps?: ButtonListProps | false;

  toolBarProps?:
    | {
        toolBarRender?: ToolBarProps<V>['toolBarRender'];
        toolBarOptions?: ToolBarProps<V>['options'];
      }
    | false;

  alertProps?: TableAlertProps<V> | false | 'completelyHidden';
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Header = <V, U = any>({
  headerTitle,

  actions,

  toolBarProps = {},

  defaultAddOperationButtonListProps = {},
  operationButtonListProps,

  alertProps,
}: TableHeaderProps<V>) => {
  const renderOperationButtons = useCallback(() => {
    if (operationButtonListProps === false) {
      return null;
    }

    const BtnProps = operationButtonListProps || {
      list: [
        {
          text: '新增',
          type: 'primary',
          icon: 'PlusOutlined',
          ...defaultAddOperationButtonListProps,
        },
      ],
    };

    return <ButtonList {...BtnProps} />;
  }, [defaultAddOperationButtonListProps, operationButtonListProps]);

  const realToolBarRender = () => {
    if (!toolBarProps) {
      return () => [];
    }

    if (!headerTitle) {
      return toolBarProps.toolBarRender;
    }

    return (params: TableHeaderProps<V>['actions']) => {
      if (!toolBarProps.toolBarRender) {
        return [renderOperationButtons()];
      }

      return [renderOperationButtons(), toolBarProps.toolBarRender(params)];
    };
  };

  const isEmpty = useMemo(
    () => !headerTitle && !toolBarProps && !alertProps && !renderOperationButtons(),
    [headerTitle, toolBarProps, alertProps, renderOperationButtons],
  );

  const renderHeaderTitle =
    headerTitle || renderOperationButtons() ? (
      <div className={styles.headerLeft}>
        {headerTitle && <div className={styles.title}>{headerTitle}</div>}
        {!headerTitle && renderOperationButtons()}
      </div>
    ) : null;

  const renderTableAlert = () => {
    if (alertProps === 'completelyHidden') {
      return null;
    }

    if (alertProps) {
      return (
        <div className={styles.headerMiddle}>
          <TableAlert<V> {...alertProps} />
        </div>
      );
    }

    return <div className={styles.headerMiddle} />;
  };

  return (
    <div
      className={classNames('general-table--content-header', styles.headerWrapper, {
        'general-table--content-header--empty': isEmpty,
      })}
    >
      {renderHeaderTitle}

      {renderTableAlert()}

      <div className={styles.headerRight}>
        {toolBarProps && (
          <ToolBar
            actions={actions}
            options={toolBarProps.toolBarOptions}
            toolBarRender={realToolBarRender()}
          />
        )}
      </div>
    </div>
  );
};
