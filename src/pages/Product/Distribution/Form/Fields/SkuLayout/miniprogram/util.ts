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
  storeSupplyPrice: {
    title: '店铺供货价 (元)',
    required: true,
    question: '平台下店铺代售该商品的拿货价',
  },
  salePrice: {
    title: '零售价 (元)',
    required: true,
    question: 'C 端小程序商城售卖的零售价',
  },
  orignPrice: {
    title: '销售原价 (元)',
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

    storeSupplyPrice: numberFieldProps(`请输入${expandColumnsMaps.storeSupplyPrice.title}`),
    salePrice: numberFieldProps(`请输入${expandColumnsMaps.salePrice.title}`),
    orignPrice: numberFieldProps(`请输入${expandColumnsMaps.orignPrice.title}`),
    stock: stockFieldProps(`请输入${expandColumnsMaps.stock.title}`),
  };
};

export const expandColumnsFieldMap = () => {
  const expandColumnsFieldPropsMaps = expandColumnsFieldPropsMap();

  const orignPrice = getNumberField(expandColumnsFieldPropsMaps.orignPrice);
  delete orignPrice.required;

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

    storeSupplyPrice: {
      ...getNumberField(expandColumnsFieldPropsMaps.storeSupplyPrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.storeSupplyPrice.placeholder,
      },
    },
    salePrice: {
      ...getNumberField(expandColumnsFieldPropsMaps.salePrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.salePrice.placeholder,
      },
    },
    orignPrice,
    stock: {
      ...getNumberField(expandColumnsFieldPropsMaps.stock),
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
