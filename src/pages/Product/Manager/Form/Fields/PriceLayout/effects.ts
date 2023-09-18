import { FormEffectHooks } from '@formily/antd';
import { debounce } from 'lodash';

import type { TCreateLinkageUtils } from '@/components/Business/Formily';
import { createLinkageUtils } from '@/components/Business/Formily';

import { specificationTableFormPath, onSKUTableDataSourceChange$ } from '../SkuLayout';

import { generateContrastTableInputMinimumValues } from '../../components/FormFields/SpecificationTable';

const { onFieldValueChange$ } = FormEffectHooks;

export const priceLayoutFormPath = 'formLayout.skuFullLayout.priceLayout.priceGrid';

// 处理 sku table 中相关的值变动后，更新商品价格模块的对应项的数据
export const handleSpecificationTableInputValueChange = async (
  linkage: TCreateLinkageUtils,
  containerFieldPath: string,
  contrastTableInputMinimumValuesFC = generateContrastTableInputMinimumValues as () => AnyObject,
) => {
  const values = (await linkage.getFieldValue(containerFieldPath)) as any[];
  const contrastTableInputMinimumValues = contrastTableInputMinimumValuesFC();
  const contrastTableInputMinimumValuesKeys = Object.keys(contrastTableInputMinimumValues);

  if (!values.length) {
    return;
  }

  for (let index = 0; index < values.length; index += 1) {
    const item = values[index];

    contrastTableInputMinimumValuesKeys.forEach((fieldName) => {
      if (
        contrastTableInputMinimumValues[fieldName] === 0 ||
        parseFloat(contrastTableInputMinimumValues[fieldName]) > parseFloat(item[fieldName])
      ) {
        contrastTableInputMinimumValues[fieldName] = item[fieldName];
      }
    });
  }

  // 批量设置商品价格模块相关数据的最小值
  contrastTableInputMinimumValuesKeys.forEach((fieldName) => {
    linkage.setFieldState(`*.*.priceLayout.*.${fieldName}`, (fieldState) => {
      fieldState.value = contrastTableInputMinimumValues[fieldName] ?? undefined;
      fieldState.ruleErrors = [];
    });

    setTimeout(() => {
      linkage.setFieldState(`*.*.priceLayout.*.${fieldName}`, (fieldState) => {
        fieldState.ruleErrors = [];
      });
    });

    // linkage.value(`*.*.priceLayout.*.${fieldName}`, contrastTableInputMinimumValues[fieldName] || undefined);
  });
};

export const handleSkuItemChange = ({
  linkage,
  dataSource,
  isImportFromProductRef,
}: {
  linkage: TCreateLinkageUtils;
  dataSource: any[];
  isImportFromProductRef?: AnyObject;
}) => {
  const disabled = !!dataSource.length;

  const skipFieldNames = [
    'skuFullLayout.takeThePrice',
    'skuFullLayout.stock',
    'skuFullLayout.warning',
  ];

  linkage.setFieldState(`*.*.priceLayout.*.*`, (fieldState) => {
    if (disabled) {
      fieldState.ruleErrors = [];
    }
    if (skipFieldNames.includes(fieldState.name) && isImportFromProductRef?.current) {
      fieldState.props['x-component-props']!.disabled = true;
      fieldState.editable = true;
      return;
    }

    if (fieldState.name === 'skuFullLayout.warning') {
      fieldState.props['x-component-props']!.disabled = false;
      fieldState.editable = true;
      return;
    }

    fieldState.props['x-component-props']!.disabled = disabled;
    fieldState.editable = true;
  });
};

// 增加节流处理
const handleSpecificationTableInputValueChangeDebounce = debounce(
  handleSpecificationTableInputValueChange,
  300,
);

const handleSkuItemChangeDebounce = debounce(handleSkuItemChange, 300);

export const usePriceLayoutEffects = (
  props: {
    contrastTableInputMinimumValuesFC?: () => AnyObject;
    isImportFromProductRef?: AnyObject;
  } = {},
) => {
  const { contrastTableInputMinimumValuesFC, isImportFromProductRef } = props;

  const linkage = createLinkageUtils();

  onSKUTableDataSourceChange$().subscribe((values: any) => {
    handleSkuItemChangeDebounce({
      linkage,
      dataSource: values,
      isImportFromProductRef,
    });
  });

  onFieldValueChange$(`${specificationTableFormPath}.*.*`).subscribe(() => {
    handleSpecificationTableInputValueChangeDebounce(
      linkage,
      specificationTableFormPath,
      contrastTableInputMinimumValuesFC,
    );
  });
};
