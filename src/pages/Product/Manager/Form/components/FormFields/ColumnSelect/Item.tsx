import * as React from 'react';
import classNames from 'classnames';

import { FixedSizeList as VirtualListContainer, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { Input, Empty } from 'antd';
import type { SearchProps as AntdSearchProps } from 'antd/es/input/Search';
import { Icons } from '@/components/Library/Icon';

import { useDebounceByMemo } from '@/foundations/hooks';

import styles from './index.less';

type Props = {
  dataSource: any[];
  showSearch?: boolean;
  valueField: string;
  labelField: string;
  childrenField: string;
  checkValues: string[];
  searchProps?: Omit<AntdSearchProps, 'onSearch' | 'onChange'>;
  optionFilterProp?: string;
  onClickColumnItem?: (index: number, value: string | number) => void;
};

const { Search } = Input;

const Main: React.FC<Props> = (
  {
    dataSource = [],
    showSearch = false,
    searchProps,
    checkValues,
    valueField,
    labelField,
    childrenField,
    optionFilterProp = 'value',
    onClickColumnItem,
  },
  ref,
) => {
  const [renderItems, setRenderItems] = React.useState<any[]>([]);

  const handleClickColumnItem = React.useCallback(
    (index, value) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      onClickColumnItem?.(index, value);
    },
    [onClickColumnItem],
  );

  const matchFilter = React.useCallback(
    (text: string, item: any) => {
      // const { filterOption } = props;
      // if (filterOption) {
      //   return filterOption(filterValue, item);
      // }

      const keyName = optionFilterProp === 'value' ? valueField : labelField;

      return item[keyName].indexOf(text) >= 0;
    },
    [optionFilterProp, valueField, labelField],
  );

  const filterDataSource = (value: string) => {
    const realValue = value.trim();

    const getRenderItems = !realValue
      ? []
      : dataSource.filter((item) => matchFilter(realValue, item));

    setRenderItems(getRenderItems);
  };

  const filterDataSourceDebounce = useDebounceByMemo(filterDataSource, { deps: [dataSource] });

  const handleSearch = React.useCallback(
    (value: string) => {
      filterDataSourceDebounce(value);
    },
    [filterDataSourceDebounce],
  );

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filterDataSourceDebounce(e.target.value);
    },
    [filterDataSourceDebounce],
  );

  const Row = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = renderItems.length ? renderItems[index] : dataSource[index];

    return (
      <li
        key={item[valueField]}
        onClick={handleClickColumnItem(index, item[valueField])}
        style={style}
        className={classNames(styles.columnListItem, {
          [styles.columnListItemActive]: checkValues.includes(item[valueField]),
        })}
      >
        {item[labelField]}

        {item[childrenField]?.length && <Icons type="RightOutlined" />}
      </li>
    );
  });

  const renderBody = (
    <>
      {showSearch && (
        <Search
          style={{
            margin: '15px',
            width: 'calc(100% - 30px)',
          }}
          {...(searchProps || {})}
          className={styles.search}
          onSearch={handleSearch}
          onChange={handleSearchChange}
        />
      )}

      <ul
        className={styles.columnList}
        style={{
          height: searchProps ? 'calc(100% - 62px)' : '100%',
        }}
      >
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <VirtualListContainer
              ref={ref}
              itemCount={renderItems.length || dataSource.length}
              itemSize={45}
              height={height}
              width={width}
            >
              {Row}
            </VirtualListContainer>
          )}
        </AutoSizer>
      </ul>
    </>
  );

  return !dataSource.length ? (
    <Empty style={{ marginTop: '35%' }} description="暂无分类数据" />
  ) : (
    renderBody
  );
};

export const ColumnSelectItem = React.memo(
  React.forwardRef<any, Props>((props, ref) => Main(props, ref)),
  areEqual,
);
