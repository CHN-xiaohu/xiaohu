import * as React from 'react';
// import classNames from 'classnames';

import { useImmer } from 'use-immer';
import type { CascaderProps } from 'antd/es/cascader';
import type { FixedSizeList } from 'react-window';

import { useDebounceWatch } from '@/foundations/hooks';

import { isEqual } from 'lodash';

import styles from './index.less';
import { ColumnSelectItem } from './Item';

export const handleColumnSelectInitialDefaultValue = <T extends any>({
  defaultValue = [],
  options,
  judgeEqualCallback,
  parsingFullValueCallback,
}: {
  defaultValue: string[];
  options: T[];
  judgeEqualCallback: (option: T, value: string) => boolean;
  parsingFullValueCallback: (option: T) => { value: any; label: string };
}) => {
  const scrollToItemIndexs: number[] = [];
  const columnSelectOptions = [];
  const fullValues = [];

  let currentParentDataSource = options;
  for (let index = 0; index < defaultValue.length; index += 1) {
    const currentDataSource: any = currentParentDataSource.find((item, currentIndex) => {
      if (judgeEqualCallback(item, defaultValue[index])) {
        scrollToItemIndexs.push(currentIndex);
        return true;
      }

      return false;
    });

    if (currentDataSource) {
      columnSelectOptions[index] = currentParentDataSource;
      fullValues[index] = parsingFullValueCallback(currentDataSource);

      if (currentDataSource.children) {
        currentParentDataSource = currentDataSource.children;
      }
    } else if (index === 0) {
      // 当没有选中的时候，至少展示第一格的数据
      columnSelectOptions[index] = options;
    }
  }

  return {
    columnSelectOptions,
    fullValues,
    scrollToItemIndexs,
  };
};

type Props = {
  level: number;
  showSearch?: boolean;
  optionFilterProp?: string;
  labelInValue?: boolean;
  onCheckFullValuesChange?: (values: { label: string; value: string | number }[]) => void;
} & Omit<CascaderProps, 'showSearch'>;

export const ColumnSelect: React.FC<Props> = ({
  value,
  options,
  onChange,
  onCheckFullValuesChange,
  level = 3,
  showSearch,
  style,
  labelInValue = false,
  fieldNames = {},
  optionFilterProp = 'value',
}) => {
  const [state, setState] = useImmer({
    options: [] as any[],
    values: [] as any[],
    fullValues: [] as any[],
  });

  const reactWindowFixedSizeListRefs = React.useRef<FixedSizeList[]>([]);

  const childrenField = fieldNames.children || 'children';
  const valueField = fieldNames.value || 'value';
  const labelField = fieldNames.label || 'label';

  const parsingFullValue = React.useCallback(
    (data: Props['options'][0]) => ({
      value: data[valueField],
      label: data[labelField],
    }),
    [labelField, valueField],
  );

  const scrollToItemForDifferentColumn = React.useCallback((columnItemIndex: number[]) => {
    if (columnItemIndex.length) {
      requestAnimationFrame(() => {
        columnItemIndex.forEach((scrollToIndex, index) => {
          const reactWindowFixedSizeList = reactWindowFixedSizeListRefs.current[index];
          if (reactWindowFixedSizeList) {
            reactWindowFixedSizeList.scrollToItem(scrollToIndex, 'center');
          }
        });
      });
    }
  }, []);

  const handleInitDefaultValue = () => {
    setState((draft) => {
      draft.values = value || [];

      if (draft.values.length) {
        const {
          columnSelectOptions,
          fullValues,
          scrollToItemIndexs,
        } = handleColumnSelectInitialDefaultValue({
          defaultValue: draft.values,
          options,
          judgeEqualCallback: (item, defaultIdValue) => item[valueField] === defaultIdValue,
          parsingFullValueCallback: parsingFullValue,
        });

        draft.options = columnSelectOptions;
        draft.fullValues = fullValues;

        scrollToItemForDifferentColumn(scrollToItemIndexs);
      }
    });
  };

  useDebounceWatch(
    () => {
      setState((draft) => {
        draft.options[0] = options;
      });
    },
    [options],
    { ms: 60, immediate: true },
  );

  useDebounceWatch(
    () => {
      if (value?.length && !isEqual(value, state.values)) {
        handleInitDefaultValue();
      }
    },
    [value],
    { ms: 60, immediate: true },
  );

  useDebounceWatch(
    () => {
      const realFullValue = state.fullValues;
      const realValue = labelInValue ? state.fullValues : state.values;

      onChange?.(realValue);
      onCheckFullValuesChange?.(realFullValue);
    },
    [state.fullValues, state.values],
    { ms: 16 },
  );

  const setSelfValueToCheckValues = React.useCallback(
    (draft: typeof state, parentIndex: number, selfValue: string | number) => {
      const parentList: any[] = draft.options?.[parentIndex] || [];
      const selfIndex = parentList.findIndex((item) => item[valueField] === selfValue);

      // 将自身数据设置到选中值集合中
      const self = parentList?.[selfIndex];
      if (self) {
        draft.values = draft.values.slice(0, parentIndex);
        draft.values.push(self[valueField]);

        draft.fullValues = draft.fullValues.slice(0, parentIndex);
        draft.fullValues.push(parsingFullValue(self));
      }

      // 设置下级
      draft.options[parentIndex + 1] = self?.[childrenField] || [];
    },
    [childrenField, valueField, parsingFullValue],
  );

  const handleClickColumnItem = React.useCallback(
    (parentIndex: number) => (_: number, selfValue: string | number) => {
      setState((draft) => {
        if (parentIndex === 0) {
          draft.options = draft.options.slice(0, 1);

          const currentItem = draft.options[0][parentIndex];
          draft.values = [currentItem[valueField]];
          draft.fullValues = [parsingFullValue(currentItem)];
        }

        setSelfValueToCheckValues(draft, parentIndex, selfValue);
      });
    },
    [setState, setSelfValueToCheckValues, valueField, parsingFullValue],
  );

  return (
    <div style={style} className={styles.columnSelect}>
      {[...Array(level)].map((_, parentIndex) => {
        const dataSource: any[] = state.options?.[parentIndex] || [];

        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={parentIndex}
            className={styles.columnWrapper}
            style={{
              width: `calc(100% / ${level})`,
            }}
          >
            <ColumnSelectItem
              ref={(instance) => {
                reactWindowFixedSizeListRefs.current[parentIndex] = instance;
              }}
              dataSource={dataSource}
              valueField={String(valueField)}
              labelField={labelField}
              childrenField={childrenField}
              checkValues={state.values}
              optionFilterProp={optionFilterProp}
              showSearch={showSearch}
              searchProps={{
                placeholder: '请输入分类名称',
              }}
              onClickColumnItem={handleClickColumnItem(parentIndex)}
            />
          </div>
        );
      })}
    </div>
  );
};
