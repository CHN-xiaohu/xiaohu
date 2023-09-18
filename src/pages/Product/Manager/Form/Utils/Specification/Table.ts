/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 处理多规格 table 数据
|
*/
import { cloneDeep } from 'lodash';
import { strRandom } from '@/utils';

import type { TSchema } from '@/components/Business/Formily';

import type { ICacheCheckAttributesByIdResult } from './BasicInformation';
import {
  generateColumnRowItemData,
  skuCacheManage,
  isEqualByColumnRowItem,
} from './BasicInformation';

import { parsingToGenerateTableColumns, generateColumnToFormField } from './TableColumns';

import { descarte } from '../index';

import type { ISpecificationOption } from '../../Fields/SkuLayout';

const {
  cacheDescarteItemRowSpanResultMap,
  cacheCheckAttributesByIdResultMap,
  cacheTableColumnsResultMap,
} = skuCacheManage;

// 计算合并表格行
export const calcMergeTableRows = (isEqual: boolean, pk: string, rowIndex: number) => {
  const currentRowSpans = cacheDescarteItemRowSpanResultMap.get(pk) || {};

  if (isEqual) {
    const keys = Object.keys(currentRowSpans);
    const lastKey = keys[keys.length - 1];

    // 如果一致，那么就代表着该项是重复项，那么就将重复项的最后 +1 (即合并行数 +1)
    currentRowSpans[lastKey] += 1;
  } else {
    // 如果上一项跟下一项不一致，那么就储存该项为重复项的第一项
    // if (!cacheDescarteItemRowSpanResultMap[pk]) {
    //   cacheDescarteItemRowSpanResultMap[pk] = {}
    // }

    // currentIndex 起始项的索引标记
    // 1: // 合并行总计
    currentRowSpans[rowIndex] = 1;
  }

  cacheDescarteItemRowSpanResultMap.set(pk, currentRowSpans);
};

export type IDescarteTableDataSourceItem = {
  id: string;
  sku_parent_name_map: string[];
  sku_parent_value_map: string[];
  sku_value_map: string[];
  sku_name_map: string[];

  // 后端返回的
  salePropValIds?: string[];
  salePropValNames?: string[];
} & ISpecificationOption;

export const generateTabelDataSourceIdByIdAndIndex = (id: string, index: string | number) =>
  `${id}__${index}`;

export const generateTabelDataSourceIdByIndex = (index: string | number) =>
  generateTabelDataSourceIdByIdAndIndex(`internal_${strRandom(8)}`, index);

export const getIdAndIndexFromTabelDataSourceId = (str: string) => str.split('__');

export const formatDescarteDataToTabelDataSource = (
  dataSource: ISpecificationOption[][],
  selectDescarteItemCallback: (descarteItem: ISpecificationOption) => void,
  handleCacheSpecificationTableChildren: (
    index: number,
    dataSourceItem: IDescarteTableDataSourceItem,
  ) => void,
) => {
  cacheDescarteItemRowSpanResultMap.clear();

  const tableDataSource = descarte(dataSource)
    // 用 reduce 而不是 map 是为了能跟上一次 item 做比较，用于计算合并行处理
    .reduce((previousDataSource, currentValue, currentIndex) => {
      const getPreviousDataSourceItem = previousDataSource[currentIndex - 1] || {};

      /**
       * 将
       *
       * [
       *  { label: 'red', value: '123', parent_name: '颜色', parent_id: '1'  },
       *  { label: '15.4寸', value: '456', parent_name: '尺寸', parent_id: '2'  },
       * ]
       *
       * ====>
       *
       * [ { 1: 'red', 2: '15.4寸', .....  } ]
       */
      const formatDescarteItemToTabelDataSource = currentValue.reduce(
        (previousValue, descarteItem) => {
          const { value, label, parent_id, parent_name } = descarteItem;

          if (value && label) {
            selectDescarteItemCallback(descarteItem);

            previousValue[parent_id] = generateColumnRowItemData(value, label);

            // 合并所有重复项 [ 多项合并 ]
            calcMergeTableRows(
              isEqualByColumnRowItem(
                getPreviousDataSourceItem[parent_id],
                previousValue[parent_id],
              ),
              value,
              currentIndex,
            );

            previousValue.sku_parent_name_map.push(parent_name);
            previousValue.sku_parent_value_map.push(parent_id);
            previousValue.sku_name_map.push(label);
            previousValue.sku_value_map.push(value);
          }

          return previousValue;
        },
        {
          id: generateTabelDataSourceIdByIndex(currentIndex),
          sku_parent_name_map: [], // 储存上级组成的规格项 name : [ '颜色', '尺寸']
          sku_parent_value_map: [], // 储存上级组成的规格项 id : [ '111', '222']
          sku_name_map: [], // 储存组成的规格值 : [ 'red', '15.4寸']
          sku_value_map: [], // 储存组成的规格属性 id : [1, 2]
        },
      );

      previousDataSource.push(formatDescarteItemToTabelDataSource);

      handleCacheSpecificationTableChildren(currentIndex, formatDescarteItemToTabelDataSource);

      return previousDataSource;
    }, []);

  return tableDataSource;
};

export const generateDescarteDataToTabelDataSourceByCheckSpecificationAttribute = (
  specificationItem: { id: string; name: string },
  checkAttributeValues: ICacheCheckAttributesByIdResult[0],
  generateColumnToFormFieldFC = generateColumnToFormField,
) => {
  if (checkAttributeValues.length) {
    cacheCheckAttributesByIdResultMap.set(specificationItem.id, checkAttributeValues);
  } else {
    cacheCheckAttributesByIdResultMap.delete(specificationItem.id);
  }

  // ==== 储存 table 对应 column 的 filters 数据集合  =====
  const tableColumnsFilters = {} as Record<string, Record<string, string>>;
  const handleCacheTableColumnsFiltersByColumnPk = (
    columnPk: string,
    label: string,
    value: string,
  ) => {
    if (!tableColumnsFilters[columnPk]) {
      tableColumnsFilters[columnPk] = {};
    }

    tableColumnsFilters[columnPk][value] = label;
  };

  // ==== 储存生成的 tabel schema children 数据  =====
  let cacheSpecificationTableChildren = {} as Record<string, TSchema>;

  const dataSource = [...cacheCheckAttributesByIdResultMap.values()].filter(
    (arrItem) => arrItem?.length,
  );

  // ==== 生成 笛卡尔积，并格式化为 antd table dataSource 所需的数据格式  =====
  const descarteToTabelDataSource = !dataSource.length
    ? []
    : formatDescarteDataToTabelDataSource(
        dataSource,
        ({ parent_id, label, value }) =>
          handleCacheTableColumnsFiltersByColumnPk(parent_id, label, value),
        (index) => {
          cacheSpecificationTableChildren = {
            ...cacheSpecificationTableChildren,
            ...generateColumnToFormFieldFC(index),
          };
        },
      );

  // ==== 解析对应数据并生成所需的 antd table columns 的数据  =====
  parsingToGenerateTableColumns({
    columnData: specificationItem,
    checkValues: checkAttributeValues,
    formatFiltersCallBack: () =>
      Object.keys(tableColumnsFilters[specificationItem.id] || {}).map((value) => ({
        text: tableColumnsFilters[specificationItem.id][value],
        value,
      })),
  });

  return {
    dataSource: descarteToTabelDataSource,
    columns: [...cacheTableColumnsResultMap.values()] as never[],
    specificationTableChildren: cloneDeep(cacheSpecificationTableChildren),
    cacheCheckAttributesByIdResult: [...cacheCheckAttributesByIdResultMap.values()],
  };
};

export const formatTabelDataSourceToDescarteData = <T extends any>(
  descarteData: T[],
  // 相当于上面的 sku_parent_value_map，只是这是键值对，{ '111': '颜色', '222': '尺寸' }
  specificationKeyValuePairs: Record<string, string>,
  generateColumnToFormFieldFC = generateColumnToFormField,
) => {
  const dataSource = cloneDeep(descarteData);
  // ==== 储存 table 对应 column 的 filters 数据集合  =====
  const tableColumnsFilters = {} as Record<string, Record<string, string>>;

  const specificationKeys = Object.keys(specificationKeyValuePairs);
  specificationKeys.forEach((id) => {
    cacheCheckAttributesByIdResultMap.set(id, []);
    tableColumnsFilters[id] = {};
  });

  // 储存生成的 tabel schema children 数据
  let cacheSpecificationTableChildren = {} as Record<string, TSchema>;
  dataSource.forEach((item: any, index) => {
    // 生成 tabel schema children 数据
    cacheSpecificationTableChildren = {
      ...cacheSpecificationTableChildren,
      ...generateColumnToFormFieldFC(index, (fieldName, field) => {
        field.default = item[fieldName] || (fieldName === 'image' ? '' : 0);
      }),
    };

    item.id = item.id
      ? generateTabelDataSourceIdByIdAndIndex(item.id, index)
      : generateTabelDataSourceIdByIndex(index);

    item.salePropValIds.forEach((id: string, idx: number) => {
      const currentParentId = specificationKeys[idx];
      const currentParentName = specificationKeyValuePairs[currentParentId];
      const currentId = id;
      const currentName = item.salePropValNames[idx];
      const currentItemValue = dataSource[index - 1]?.[currentParentId];

      if (!tableColumnsFilters?.[currentParentId]?.[id]) {
        tableColumnsFilters[currentParentId][id] = item.salePropValNames[idx];
      }

      // 调整为跟 tabel column dataIndex 一致的数据
      item[currentParentId] = generateColumnRowItemData(item.salePropValIds[idx], currentName);

      // 计算合并重复项
      calcMergeTableRows(
        isEqualByColumnRowItem(currentItemValue, item[currentParentId]),
        currentId,
        index,
      );

      // 重复项时，无需添加
      if (currentItemValue !== item[currentParentId]) {
        const currentAttributes = cacheCheckAttributesByIdResultMap.get(currentParentId) || [];

        // 确保是唯一的
        if (!currentAttributes.some((v) => v.value === currentId)) {
          // 缓存当前勾选的 sku 属性组
          cacheCheckAttributesByIdResultMap.set(
            currentParentId,
            currentAttributes.concat({
              label: currentName,
              value: currentId,
              parent_id: currentParentId,
              parent_name: currentParentName,
            }),
          );
        }
      }
    });
  });

  [...cacheCheckAttributesByIdResultMap.keys()].forEach((id) => {
    const checkValues = cacheCheckAttributesByIdResultMap.get(id) || [];

    // ==== 解析对应数据并生成所需的 antd table columns 的数据  =====
    parsingToGenerateTableColumns({
      columnData: { id, name: specificationKeyValuePairs[id] },
      checkValues,
      formatFiltersCallBack: () =>
        Object.keys(tableColumnsFilters[id] || {}).map((value) => ({
          text: tableColumnsFilters[id][value],
          value,
        })),
    });
  });

  return {
    dataSource,
    columns: [...cacheTableColumnsResultMap.values()] as never[],
    cacheSpecificationTableChildren: cloneDeep(cacheSpecificationTableChildren),
    cacheCheckAttributesByIdResult: [...cacheCheckAttributesByIdResultMap.values()],
  };
};
