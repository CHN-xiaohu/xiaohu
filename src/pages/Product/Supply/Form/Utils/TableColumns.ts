/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 处理多规格 table 的 columns 数据
|
*/

// eslint-disable-next-line max-len
import { generateColumnToFormField as generateColumnToFormFieldByProduct } from '@/pages/Product/Manager/Form/Utils/Specification';

import { expandColumnsMap } from '../components/FormFields/SpecificationTable';

export const getNumberField = (componentProps: object) => ({
  type: 'inputNumber' as 'inputNumber',
  required: true,
  'x-component-props': componentProps,
});

export const numberFieldProps = (placeholder?: string) => ({
  min: 0.01,
  max: 99999,
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

export const expandColumnsFieldPropsMap = () => {
  const expandColumnsMaps = expandColumnsMap();

  return {
    minimumSale: {
      min: 0,
      max: 999999,
      placeholder: `请输入${expandColumnsMaps.minimumSale}`,
    },
    supplyPrice: numberFieldProps(`请输入${expandColumnsMaps.supplyPrice}`),
    suggestSalePrice: numberFieldProps(`请输入${expandColumnsMaps.suggestSalePrice}`),
    lowerSalePrice: numberFieldProps(`请输入${expandColumnsMaps.lowerSalePrice}`),
    stock: stockFieldProps(`请输入${expandColumnsMaps.stock}`),
  };
};

export const expandColumnsFieldMap = () => {
  const expandColumnsFieldPropsMaps = expandColumnsFieldPropsMap();

  return {
    image: {
      type: 'specificationTableUploadImage' as 'string',
    },
    minimumSale: {
      type: 'number' as 'number',
      'x-component-props': expandColumnsFieldPropsMaps.minimumSale,
    },
    supplyPrice: {
      ...getNumberField(expandColumnsFieldPropsMaps.supplyPrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.supplyPrice.placeholder,
      },
    },
    suggestSalePrice: {
      ...getNumberField(expandColumnsFieldPropsMaps.suggestSalePrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.suggestSalePrice.placeholder,
      },
    },
    lowerSalePrice: {
      ...getNumberField(expandColumnsFieldPropsMaps.lowerSalePrice),
      'x-rules': {
        required: true,
        message: expandColumnsFieldPropsMaps.lowerSalePrice.placeholder,
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
};

export const generateColumnToFormField = (
  index: number,
  forEachItemCallback: ((fieldName: string, field: Record<string, any>) => void) | null = null,
) => generateColumnToFormFieldByProduct(index, forEachItemCallback, expandColumnsFieldMap);
