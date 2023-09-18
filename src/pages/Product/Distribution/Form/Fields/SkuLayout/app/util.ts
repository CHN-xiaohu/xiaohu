// eslint-disable-next-line max-len
import { generateColumnToFormField as generateColumnToFormFieldByProduct } from '@/pages/Product/Manager/Form/Utils/Specification';
import { numberFieldProps, getNumberField } from '@/pages/Product/Supply/Form/Utils/TableColumns';
import type { TSchemas } from '@/components/Business/Formily';

import { filterMinimumSaleAndSupplyPriceField } from '../common';

export const expandColumnsMap = () => ({
  minimumSale: {
    title: '起售数量',
  },
  supplyPrice: {
    title: '集采供货价',
    question: '咋装云集采中心供货价',
  },
  purchasePrice: {
    title: '普通采购价 (元)',
    required: true,
    question: '采购 APP，普通商家采购的价格',
  },
  vipPurchasePrice: {
    title: '会员采购价 (元)',
    required: true,
    question: '采购 APP，金牌商家采购的价格',
  },
  stock: {
    title: '商品库存',
    required: true,
  },
});

const stockFieldProps = (placeholder?: string) => ({
  min: 0,
  max: 999999,
  precision: 0,
  placeholder,
});

export const expandColumnsFieldPropsMap = () => {
  const expandColumnsMaps = expandColumnsMap();

  return {
    minimumSale: {
      min: 0,
      max: 999999,
      placeholder: `请输入${expandColumnsMaps.minimumSale.title}`,
    },
    supplyPrice: numberFieldProps(`请输入${expandColumnsMaps.supplyPrice.title}`),

    purchasePrice: numberFieldProps(`请输入${expandColumnsMaps.purchasePrice.title}`),
    vipPurchasePrice: numberFieldProps(`请输入${expandColumnsMaps.vipPurchasePrice.title}`),
    stock: stockFieldProps(`请输入${expandColumnsMaps.stock.title}`),
  };
};

export const expandColumnsFieldMap = () => {
  const expandColumnsFieldPropsMaps = expandColumnsFieldPropsMap();

  return {
    minimumSale: {
      type: 'string',
      editable: false,
      'x-component-props': expandColumnsFieldPropsMaps.minimumSale,
    },
    supplyPrice: {
      ...getNumberField(expandColumnsFieldPropsMaps.supplyPrice),
      editable: false,
    },
    vipPurchasePrice: {
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
  } as TSchemas;
};

export const realExpandColumnsFieldPropsMap = () =>
  filterMinimumSaleAndSupplyPriceField(expandColumnsFieldPropsMap());

// 用于比对最小值
export const generateContrastTableInputMinimumValues = () =>
  Object.keys(realExpandColumnsFieldPropsMap());

export const generateColumnToFormField = (
  index: number,
  forEachItemCallback: ((fieldName: string, field: Record<string, any>) => void) | null = null,
) => generateColumnToFormFieldByProduct(index, forEachItemCallback, expandColumnsFieldMap);
