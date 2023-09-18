import React from 'react';
import type { EllipsisProps } from '@/components/Library/Ellipsis';
import { Ellipsis } from '@/components/Library/Ellipsis';
import type { ColumnProps } from 'antd/lib/table';
import dayjs from 'dayjs';

import { isObj, isStr, isNum, isFn, isBool } from '@/utils';

import type { MoneyTextProps } from '@/components/Library/MoneyText';
import { MoneyText } from '@/components/Library/MoneyText';

import type { ButtonListProps } from '@/components/Library/ButtonList';
import { ButtonList } from '@/components/Library/ButtonList';

import type { SwitchPlusProps } from '@/components/Library/Switch';
import { SwitchPlus } from '@/components/Library/Switch';

import type { ImageProps } from '../Image';
import { Image } from '../Image';

type TSwitchProps<C> = Partial<
  Omit<SwitchPlusProps, 'value' | 'onChange' | 'modalProps' | 'checkCanSwitch'>
> & {
  modalProps?:
    | ((dataSource: SwitchOnChangeParams<C>['dataSource']) => SwitchPlusProps<C>['modalProps'])
    | SwitchPlusProps<C>['modalProps'];
  onChange?: (params: SwitchOnChangeParams<C>) => Promise<any>;
  checkCanSwitch?: (dataSource: SwitchOnChangeParams<C>['dataSource']) => void;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface TableColumnsProps<C> extends ColumnProps<C> {
  /**
   * 是否缩略
   */
  ellipsisProps?: true | Omit<EllipsisProps, 'copyable'>;
  /**
   * 是否拷贝
   */
  copyable?: true;
  /**
   * 是否拷贝
   */
  image?: boolean | ImageProps;

  /**
   * switch 状态切换
   */
  switchProps?: TSwitchProps<C>;

  /**
   * 空的时候的占位符
   */
  placeholder?: string | React.ReactNode | true;

  /**
   * 格式数据
   */
  formatterValue?: (dataSource: ColumRenderProps<C>) => React.ReactNode | React.ReactText;

  /**
   * 格式化日期
   * true => 格式化 YYYY-MM-DD HH:mm:ss
   * string => 格式化为 YYYY-DD-MM
   * number => 转化为时间戳
   */
  dateFormatter?:
    | 'string'
    | 'number'
    | true
    | ((
        dayjsIn: typeof dayjs,
        dataSource: SwitchOnChangeParams<C>['dataSource'],
      ) => React.ReactText | React.ReactNode);

  /**
   * 格式化金钱
   */
  moneyFormatter?: true | MoneyTextProps;

  /**
   * 按钮组
   */
  buttonListProps?: Omit<ButtonListProps, 'list'> & {
    list: (dataSource: ColumRenderProps<C>) => ButtonListProps['list'];
  };

  visible?: boolean;
}

export type SwitchOnChangeParams<C, V = any> = {
  dataSource: ColumRenderProps<C>;
  value: V;
};

export type ColumRenderProps<T> = {
  column: TableColumnsProps<T>;
  value: any;
  row: T;
  index: number;
  defaultPlaceholder?: string | React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dateFormatter = <T, _U = AnyObject>(dataSource: ColumRenderProps<T>) => {
  const { column, value } = dataSource;

  if (column.dateFormatter === true) {
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
  }

  if (isStr(column.dateFormatter)) {
    return dayjs(value).format('YYYY-MM-DD');
  }

  if (isNum(column.dateFormatter)) {
    return dayjs(value).unix();
  }

  if (isFn(column.dateFormatter)) {
    return column.dateFormatter(dayjs, dataSource);
  }

  return value;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const columRender = <T, _U = AnyObject>(dataSource: ColumRenderProps<T>): any => {
  const { column, value: originalValue } = dataSource;
  const value = isFn(column.formatterValue) ? column.formatterValue(dataSource) : originalValue;

  // 省略
  if (column.ellipsisProps || column.copyable) {
    const ellipsisProps = isObj(column.ellipsisProps)
      ? column.ellipsisProps
      : { ellipsis: Boolean(column.ellipsisProps) };

    return <Ellipsis {...{ copyable: column.copyable, ...ellipsisProps }}>{value}</Ellipsis>;
  }

  // switch
  if (isObj(column.switchProps)) {
    const tableSwitchProps = {
      field: String(column.dataIndex || ''),
      value,
      ...column.switchProps,
      modalProps: isFn(column.switchProps.modalProps)
        ? column.switchProps.modalProps(dataSource)
        : column.switchProps.modalProps,
      onChange: (v: any) => column.switchProps?.onChange!({ dataSource, value: v }),
    };

    if (column.switchProps.checkCanSwitch) {
      tableSwitchProps.checkCanSwitch = () => column.switchProps?.checkCanSwitch!(dataSource);
    }

    return <SwitchPlus {...(tableSwitchProps as SwitchPlusProps)} />;
  }

  // 图片显示
  if (column.image) {
    return value ? <Image src={value} {...(isObj(column.image) ? column.image : {})} /> : null;
  }

  if (column.dateFormatter) {
    return dateFormatter(dataSource);
  }

  if (column.moneyFormatter) {
    const moneyFormatterProps = isObj(column.moneyFormatter) ? column.moneyFormatter : {};

    return <MoneyText {...moneyFormatterProps}>{value}</MoneyText>;
  }

  if (column.buttonListProps) {
    return (
      <ButtonList
        {...{
          isLink: true,
          ...column.buttonListProps,
          list: column.buttonListProps?.list(dataSource),
        }}
      />
    );
  }

  // 默认值
  if (column.placeholder !== undefined) {
    return (
      value || (isBool(column.placeholder) ? dataSource.defaultPlaceholder : column.placeholder)
    );
  }

  return value;
};
