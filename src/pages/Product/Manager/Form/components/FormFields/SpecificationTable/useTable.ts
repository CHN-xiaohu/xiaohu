import { useMemo, useState, useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { toArr } from '@formily/shared';

import type { ProductModelState } from 'umi';
import type { ColumnProps } from 'antd/lib/table';
import { getArrayLastItem } from '@/utils';
import { message } from 'antd';
import { usePersistFn } from 'ahooks';

import type { skuCacheManage as skuCacheManageTypes } from '../../../Utils/Specification';
import {
  getIdAndIndexFromTabelDataSourceId,
  generateTabelDataSourceIdByIdAndIndex,
  joinColumnValueJoinLabelMark,
} from '../../../Utils/Specification';
import { columnsIdsBubbleSort } from '../../../Utils';

type IFilteredMap = Record<string, string[] | undefined>;

const verifySelectedRowKeys = (verifyData: string[]) => {
  if (!verifyData.length) {
    throw new Error('请先勾选需要批量设置的规格项');
  }
};

const verifyBatchSettingValue = (verifyData: object) => {
  const canBatchSetting = Object.keys(verifyData).filter((k) => verifyData[k] !== undefined).length;

  if (!canBatchSetting) {
    throw new Error('请输入批量设置的值');
  }
};

type Props = {
  value: any;
  columns: ColumnProps<any>[];
  initialValue: ProductModelState['initialValues']['products'];
  skuCacheManage: typeof skuCacheManageTypes;
  editable?: boolean;
  onBatchSetting?: (values: AnyObject, selectedRowIndexs: string[]) => void;
};

export const useSpecificationTable = ({
  value,
  initialValue,
  skuCacheManage,
  columns,
  editable,
  onBatchSetting,
}: Props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [filteredValueMap, setFilteredValueMap] = useState<IFilteredMap>({});

  const dataSource = useMemo(() => {
    const valueArr = toArr(value) as ProductModelState['initialValues']['products'];

    // 匹配旧的 sku 项
    if (!initialValue?.length) {
      return valueArr;
    }

    return valueArr.map((v: any) => {
      const hitValue = initialValue.find(
        (iv: any) =>
          (iv.salePropValIds || iv.sku_value_map).join('') ===
          (v.salePropValIds || v.sku_value_map).join(''),
      );

      if (hitValue) {
        // 从旧的数据跟新的数据进行组合
        const [, newIndex] = getIdAndIndexFromTabelDataSourceId(v.id);
        const [oldId] = getIdAndIndexFromTabelDataSourceId(hitValue.id);

        hitValue.id = generateTabelDataSourceIdByIdAndIndex(oldId, newIndex);
      }

      return hitValue ? { ...v, ...hitValue } : v;
    });
  }, [value, initialValue]);

  const columnsIdsBubbleSortResult = useMemo(() => columnsIdsBubbleSort(skuCacheManage), [
    dataSource.length,
    skuCacheManage.cacheCheckAttributesByIdResultMap.size,
  ]);

  const newColumns = useMemo(
    () =>
      columnsIdsBubbleSortResult.map((id) => {
        const { filters, ...lastColumnItem } =
          columns.find((column) => column.dataIndex === id) || ({} as AnyObject);

        // 非预览模式时，不展示过滤筛选
        if (editable) {
          lastColumnItem.filters = filters;
        }

        return {
          ...lastColumnItem,
          // filters: readOnly ? undefined : currentColumnItem?.filters,
          // 受控过滤值
          filteredValue: !editable ? undefined : filteredValueMap[id] || null,
        };
      }),
    [columns],
  );

  const resetBatchSettingRelatedState = useCallback(() => {
    // 重置
    setSelectedRowKeys([]);
    setFilteredValueMap({});
  }, []);

  const handleSelectChange = useCallback((keys) => {
    setSelectedRowKeys(keys);
  }, []);

  const handleBatchSettingByHooks = usePersistFn((columnInputValues) => {
    try {
      verifySelectedRowKeys(selectedRowKeys);

      verifyBatchSettingValue(columnInputValues);

      const selectedRowIndexs = selectedRowKeys.map(
        (key: string) => getArrayLastItem(getIdAndIndexFromTabelDataSourceId(key)) as string,
      );

      if (onBatchSetting) {
        onBatchSetting(columnInputValues, selectedRowIndexs);
      }

      // 重置
      requestAnimationFrame(() => {
        resetBatchSettingRelatedState();
      });
    } catch (error) {
      message.warning((error as Error).message);

      return Promise.reject();
    }

    return Promise.resolve();
  });

  const handleTableChange = useCallback(
    (_pagination: any, filters: IFilteredMap) => {
      setFilteredValueMap(filters);

      const selectedRowKeysResult: string[] = [];

      dataSource.forEach((item) => {
        const columnKeys = Object.keys(item);
        columnKeys.forEach((key) => {
          const currentFilter = filters[key];
          if (currentFilter && item[key]) {
            if (
              currentFilter.some((v: string) =>
                String(item[key]).includes(joinColumnValueJoinLabelMark(v)),
              )
            ) {
              selectedRowKeysResult.push(item.id);
            }
          }
        });
      });

      const result = selectedRowKeysResult.length
        ? [...new Set(selectedRowKeysResult)]
        : selectedRowKeysResult;

      setSelectedRowKeys(result);
    },
    [columns, dataSource],
  );

  const rowSelection = !editable
    ? undefined
    : {
        selectedRowKeys,
        onChange: handleSelectChange,
      };

  return {
    dataSource,
    newColumns,
    selectedRowKeys,
    columnsIdsBubbleSortResult,
    rowSelection,
    setSelectedRowKeys,
    setFilteredValueMap,
    resetBatchSettingRelatedState,
    handleSelectChange,
    handleTableChange,
    handleBatchSettingByHooks,
  };
};
