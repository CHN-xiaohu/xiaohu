/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 处理多规格 table 的 columns 数据
|
*/

import { isFn } from '@/utils';

import type { ICacheCheckAttributesByIdResult } from './BasicInformation';
import { getValueAndLabelDataFromColumnRowItem, skuCacheManage } from './BasicInformation';

import { expandColumnsMap } from '../../components/FormFields/SpecificationTable';

const getNumberField = (componentProps: object) => ({
  type: 'number' as 'number',
  required: true,
  'x-component-props': componentProps,
});

const numberFieldProps = (placeholder?: string) => ({
  min: 0.01,
  max: 999999,
  precision: 2,
  step: 0.1,
  placeholder,
});

const stockFieldProps = (placeholder?: string) => ({
  min: 0,
  max: 999999,
  precision: 0,
  placeholder,
});

const vipPurchasePriceProps = (placeholder?: string) => ({
  min: 0,
  max: 999999,
  precision: 2,
  step: 0.1,
  placeholder,
});

export const expandColumnsFieldPropsMap = (isMiniprogramProduct?: boolean) => {
  const expandColumnsMaps = expandColumnsMap(isMiniprogramProduct);

  return {
    minimumSale: {
      min: 0,
      max: 999999,
      placeholder: `请输入${expandColumnsMaps.minimumSale}`,
    },
    factoryPrice: numberFieldProps(`请输入${expandColumnsMaps.factoryPrice}`),
    vipPurchasePrice: isMiniprogramProduct
      ? vipPurchasePriceProps(`请输入${expandColumnsMaps.vipPurchasePrice}`)
      : numberFieldProps(`请输入${expandColumnsMaps.vipPurchasePrice}`),
    purchasePrice: numberFieldProps(`请输入${expandColumnsMaps.purchasePrice}`),
    stock: stockFieldProps(`请输入${expandColumnsMaps.stock}`),
  };
};

export const expandColumnsFieldMap = (
  isImportFromProduct = false,
  isMiniprogramProduct = false,
  editable = true,
) => {
  const expandColumnsFieldPropsMaps = expandColumnsFieldPropsMap(isMiniprogramProduct);

  const result = {
    image: {
      type: 'specificationTableUploadImage' as 'string',
    },
    minimumSale: {
      type: 'number' as 'number',
      editable,
      'x-component-props': expandColumnsFieldPropsMaps.minimumSale,
    },
    factoryPrice: {
      editable,
      ...getNumberField(expandColumnsFieldPropsMaps.factoryPrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.factoryPrice.placeholder,
      },
    },
    vipPurchasePrice: {
      editable,
      ...getNumberField(expandColumnsFieldPropsMaps.vipPurchasePrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.vipPurchasePrice.placeholder,
      },
    },
    purchasePrice: {
      ...getNumberField(expandColumnsFieldPropsMaps.purchasePrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.purchasePrice.placeholder,
      },
    },
    stock: {
      ...getNumberField(expandColumnsFieldPropsMaps.stock),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.stock.placeholder,
      },
    },
  };

  if (isImportFromProduct) {
    delete result.image;
  }

  if (isMiniprogramProduct) {
    delete result.purchasePrice;

    result.vipPurchasePrice.required = false;
    delete result.vipPurchasePrice['x-rules'];
  }

  return result;
};

export const generateColumnToFormFieldKey = (index: number, fieldName: string) =>
  `${index}.${fieldName}`;

export const generateColumnToFormField = (
  index: number,
  forEachItemCallback: ((fieldName: string, field: Record<string, any>) => void) | null = null,
  expandColumnsFieldMapFC = expandColumnsFieldMap as () => AnyObject,
) => {
  const cloneMaps = expandColumnsFieldMapFC();

  Object.keys(cloneMaps).forEach((fieldName) => {
    forEachItemCallback?.(fieldName, cloneMaps[fieldName]);

    cloneMaps[generateColumnToFormFieldKey(index, fieldName)] = cloneMaps[fieldName];

    delete cloneMaps[fieldName];
  });

  return cloneMaps;
};

// 储存当前生成的 antd table columns 的数据
const { cacheTableColumnsResultMap } = skuCacheManage;

type TFilters = { text: string; value: any }[];
type ParsingToGenerateTableColumnsProps = {
  columnData: { id: string; name: string };
  checkValues: ICacheCheckAttributesByIdResult[0];
  formatFiltersCallBack?: TFilters | (() => TFilters);
  formatRowSpanCallBack?: number | ((rowId: string, index: number) => number | undefined);
};

export const generateTableDescarteColumns = (
  tableColumns: Map<any, any>,
  pk: string,
  checkValues: ParsingToGenerateTableColumnsProps['checkValues'],
  callback: () => object,
) => {
  if (tableColumns.has(pk) && !checkValues.length) {
    tableColumns.delete(pk);
    return;
  }

  tableColumns.set(pk, callback());
};

export const defaultFormatRowSpanCallBack = (rowId: string, rowIndex: number) => {
  const currentRowSpans = skuCacheManage.cacheDescarteItemRowSpanResultMap.get(rowId) || {};

  return currentRowSpans[rowIndex];
};

// 解析对应数据并生成所需的 antd table columns 的数据
export const parsingToGenerateTableColumns = ({
  columnData,
  checkValues,
  formatFiltersCallBack = [],
  formatRowSpanCallBack = defaultFormatRowSpanCallBack,
}: ParsingToGenerateTableColumnsProps) =>
  generateTableDescarteColumns(cacheTableColumnsResultMap, columnData.id, checkValues, () => ({
    title: columnData.name,
    dataIndex: columnData.id,
    align: 'center',
    // filtered: true,
    filters: isFn(formatFiltersCallBack) ? formatFiltersCallBack() : formatFiltersCallBack,
    sortDirections: ['descend'],
    render: (value: any, _record: any, index: number) => {
      const [id, name] = getValueAndLabelDataFromColumnRowItem(value);
      const rowSpan = isFn(formatRowSpanCallBack)
        ? formatRowSpanCallBack(id, index) || 0
        : formatRowSpanCallBack;

      return {
        children: name,
        props: {
          rowSpan,
        },
      };
    },
  }));
