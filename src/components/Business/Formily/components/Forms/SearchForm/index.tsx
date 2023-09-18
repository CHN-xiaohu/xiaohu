import { useMemo } from 'react';
import * as React from 'react';
import classNames from 'classnames';
import { createAsyncFormActions } from '@formily/antd';
import { Card } from 'antd';

import type { TSchema, SchemaFormProps } from '@app_components/Business/Formily/SchemaForm';
import { SchemaForm } from '@app_components/Business/Formily/SchemaForm';

import './index.less';

import { strRandom } from '@/utils';
import type { ActionButtonProps } from '@/components/Library/ButtonList';
import { ButtonList } from '@/components/Library/ButtonList';
import { useLoadingWrapper, useDebounceByMemo } from '@/foundations/hooks';
import type { CardProps } from 'antd/lib/card';

// 每一行的高度
const rowHeight = 44;

export type SearchFromProps<V = any> = {
  cardProps?: CardProps;
  items: Record<string, TSchema & { col?: number }>[];
  rows?: number;
  minItem?: number;
  moreNodes?: { open: React.ReactNode | string; close: React.ReactNode | string };
  onSearch?: (values: V) => Promise<any> | any;
  onReset?: () => void | Promise<void>;
  list?: ActionButtonProps[];
} & Omit<SchemaFormProps, 'schema'>;

const calcGridCol = (items: SearchFromProps['items'], maxItem: number) => {
  const { cols } = Object.keys(items).reduce(
    (previous, key) => {
      const currentNode = items[key];

      let currentCol = Math.floor(24 / maxItem);
      if (currentNode.col) {
        currentCol = currentNode.col;

        // delete currentNode.col;
      }

      const sun = previous.sun + currentCol;

      if (sun <= 24) {
        previous.cols.push(currentCol);
        previous.sun = sun;
      }

      return previous;
    },
    { sun: 0, cols: [] as number[] },
  );

  return cols;
};

export const formatGridLayoutSchema = <V extends any>(
  items: SearchFromProps<V>['items'],
  minItem?: number,
) => {
  const newSchema = {};

  // 最大项
  let maxItemNumber = Object.keys(items).reduce((previousValue, index) => {
    const itemNumber = Object.keys(items[index]).filter((k) => !k.includes('_inner_empty')).length;

    return previousValue > itemNumber ? previousValue : itemNumber;
  }, 0);

  if (minItem && maxItemNumber < minItem) {
    maxItemNumber = minItem;
  }

  items.forEach((item, i) => {
    const keys = Object.keys(item);
    let keysNumber = keys.length;

    // 判断最后一项 schema 有没有配置 col
    if (maxItemNumber > keysNumber) {
      [...Array(maxItemNumber - keysNumber)].forEach(() => {
        keysNumber += 1;
        keys.push('');

        item[`${strRandom(6)}_inner_empty`] = {
          type: 'emptyPlaceholder',
        };
      });
    }

    const cols = calcGridCol(item as any, maxItemNumber);

    newSchema[`formItemGrid${i}`] = {
      'x-component': 'grid',
      'x-component-props': {
        gutter: 24,
        cols: cols.filter((col) => col > 0),
      },
      properties: item,
    };
  });

  return newSchema;
};

export const Main = <V extends any>(props: SearchFromProps<V>) => {
  const {
    items,
    onSearch,
    onReset,
    rows = 2, // 行数
    minItem = 0, // 最小列数
    moreNodes,
    actions,
    cardProps = {},
    list = [],
    ...last
  } = props;
  const formActions = useMemo(() => actions || createAsyncFormActions(), [actions]);

  const { isLoading, runRequest } = useLoadingWrapper();

  const { open = '展开更多搜索条件', close = '关闭更多搜索条件' } = moreNodes || {};

  const [maxHeight, setMaxHeight] = React.useState(rows * rowHeight);

  // table 搜索表单布局
  const schema = useMemo(() => formatGridLayoutSchema<V>(items, minItem), [items, minItem]);

  const switchMaxHeight = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const height = maxHeight === rows * rowHeight ? items.length * rowHeight : rows * rowHeight;

    setMaxHeight(height);
  };

  const realRows = items.length;

  const renderMore = realRows > rows && (
    <div className="z-more-search-condition__button">
      <a onClick={switchMaxHeight}>{maxHeight === rows * rowHeight ? open : close}</a>
    </div>
  );

  const handleSubmit = React.useCallback(
    (values: any) => (onSearch ? runRequest(() => onSearch(values)) : undefined),
    [onSearch, runRequest],
  );

  const handleFormInputChange = React.useCallback(
    (formField) => {
      handleSubmit(JSON.parse(JSON.stringify(formField.values)));
    },
    [handleSubmit],
  );

  const handleFormInputChangeDebounce = useDebounceByMemo(handleFormInputChange, { delay: 160 });

  return (
    <Card
      {...{
        ...cardProps,
        className: classNames('table-search-from-layout', cardProps.className),
        style: {
          marginBottom: 10,
          ...(cardProps.style || {}),
        },
        bodyStyle: {
          padding: 0,
          ...(cardProps.bodyStyle || {}),
        },
      }}
    >
      <SchemaForm
        actions={formActions}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
        colon={false}
        schema={schema}
        onReset={onReset}
        style={{
          maxHeight,
        }}
        effects={($) => {
          $('onFormInputChange').subscribe(handleFormInputChangeDebounce);
        }}
        {...last}
      />

      <div className="z-search-card-form-line">
        {renderMore}

        <ButtonList
          isLoading={isLoading}
          list={[
            // {
            //   text: '搜索',
            //   icon: 'search',
            //   type: 'primary',
            //   onClick: () => formActions.submit(),
            // },

            {
              text: '重置',
              icon: 'ReloadOutlined',
              size: 'middle',
              onClick: () => formActions.reset(),
            },
            ...list,
          ]}
        />
      </div>
    </Card>
  );
};

export const SearchFrom = React.memo(Main);
