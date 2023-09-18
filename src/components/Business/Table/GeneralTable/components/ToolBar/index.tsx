import * as React from 'react';
import classnames from 'classnames';
import type { IntlShape } from 'umi';
import { useIntl } from 'umi';
import { Divider, Tooltip } from 'antd';
import { icons } from '@/components/Library/Icon';

import './index.less';
import { isFn } from '@/utils';

import { FullScreen } from './components/FullScreen';
import { Density } from './components/Density';

import { ColumnSetting } from './components/ColumnSetting';

import type { TableActions } from '../../Container';

export type OptionConfig<T> = {
  density: boolean;
  fullScreen: boolean;
  reload: OptionsType<T>;
  setting: boolean;
};

export type OptionsType<T = unknown> =
  | ((e: React.MouseEvent<HTMLSpanElement>, actions: ToolBarProps<T>['actions']) => void)
  | boolean;

export type ToolBarProps<T> = {
  headerTitle?: React.ReactNode;
  toolBarRender?: (actions: ToolBarProps<T>['actions']) => React.ReactNode[];
  actions: TableActions;
  options?: OptionConfig<T> | false;
  selectedRowKeys?: (string | number)[];
  selectedRows?: T[];
  className?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getButtonOption = <T, _U = AnyObject>({
  intl,
}: OptionConfig<T> & {
  intl: IntlShape;
}) => ({
  fullScreen: {
    text: '',
    icon: FullScreen,
  },
  reload: {
    text: intl.formatMessage({ id: 'table.toolBar.reload' }),
    icon: <icons.ReloadOutlined />,
  },
  setting: {
    text: '',
    icon: ColumnSetting,
  },
  density: {
    text: '',
    icon: Density,
  },
});

/**
 * 渲染默认的 工具栏
 *
 * @param options
 * @param className
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderDefaultOption = <T, _U = AnyObject>(
  options: ToolBarProps<T>['options'],
  className: string,
  defaultOptions: OptionConfig<T> & {
    intl: IntlShape;
  },
) =>
  options &&
  Object.keys(options)
    .filter((item) => item)
    .map((key, index) => {
      const value = options[key];
      if (!value) {
        return null;
      }

      const optionItem = getButtonOption<T>(defaultOptions)[key as 'fullScreen'];
      if (!optionItem) {
        return null;
      }

      let RenderComponent = <Tooltip title={optionItem.text}>{optionItem.icon}</Tooltip>;
      let RenderComponentProps = {
        onClick: () => {
          if (isFn(value)) {
            value();
          } else if (isFn(defaultOptions[key])) {
            defaultOptions[key]();
          }
        },
      } as Record<string, any>;
      if (['fullScreen', 'density', 'setting'].includes(key)) {
        RenderComponentProps = {};
        RenderComponent = <optionItem.icon {...{ ...defaultOptions, className }} />;
      }

      // 只是简单的点击操作组件
      return (
        <span
          key={key}
          style={{
            marginLeft: index === 0 ? 8 : 16,
          }}
          className={className}
          {...RenderComponentProps}
        >
          {RenderComponent}
        </span>
      );
    })
    .filter((item) => item);

const prefixCls = 'general-table-toolbar';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Main = <T, _U = AnyObject>({
  toolBarRender,
  actions,
  options = {
    fullScreen: true,
    density: true,
    reload: true,
    setting: true,
  },
  className,
}: ToolBarProps<T>) => {
  const intl = useIntl();
  const optionDom =
    renderDefaultOption<T>(options, `${prefixCls}-item-icon`, {
      fullScreen: true,
      reload: () => actions.reload(),
      density: true,
      setting: true,
      intl,
    }) || null;

  const renderExtraToolBars = toolBarRender ? toolBarRender(actions) : [];

  return (
    <div className={classnames(prefixCls, className)}>
      <div className={`${prefixCls}-option`}>
        {/* 拓展渲染新的工具组件 */}
        {renderExtraToolBars
          .filter((item) => item)
          .map((node, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`${prefixCls}-item`}
            >
              {node}
            </div>
          ))}

        <div className={`${prefixCls}-default-option`}>
          {optionDom && renderExtraToolBars.length > 0 && <Divider type="vertical" />}
          {optionDom}
        </div>
      </div>
    </div>
  );
};

export const ToolBar = React.memo(Main);
