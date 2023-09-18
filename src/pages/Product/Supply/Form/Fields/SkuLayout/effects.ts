import { createLinkageUtils } from '@/components/Business/Formily';
import { FormEffectHooks } from '@formily/antd';

import {
  //
  onSelectedSpecificationAttribute$,
} from '@/pages/Product/Manager/Form/components/FormFields/SpecificationAttributes';
import {
  specificationTableFormPath,
  handleSelectedSpecificationAttribute,
  handleSpecificationTableBatchSetting,
} from '@/pages/Product/Manager/Form/Fields/SkuLayout';

import { debounce } from 'lodash';

import { handleSpecificationTableInputValueChange } from '@/pages/Product/Manager/Form/Fields/PriceLayout';

import { onSpecificationTableBatchSetting$ } from '../../components/FormFields/SpecificationTable';
import { generateColumnToFormField } from '../../Utils/TableColumns';

export const getVerifyPriceRulesByValues = (values: {
  supplyPrice: number;
  suggestSalePrice: number;
  lowerSalePrice: number;
}) => {
  return [
    {
      fieldName: 'suggestSalePrice',
      errorMessage: values.suggestSalePrice < values.supplyPrice ? '建议零售价需要 ≥ 供货价' : '',
    },
    {
      fieldName: 'lowerSalePrice',
      errorMessage:
        values.lowerSalePrice < values.supplyPrice
          ? '最低零售价需要 ≥ 供货价'
          : values.lowerSalePrice > values.suggestSalePrice
          ? '最低零售价需要 ≤ 建议零售价'
          : '',
    },
  ];
};

// 增加节流处理
const handleSpecificationTableInputValueChangeDebounce = debounce(
  handleSpecificationTableInputValueChange,
  300,
);

export const useSkuLayoutEffects = (contrastTableInputMinimumValuesFC?: () => AnyObject) => {
  const linkage = createLinkageUtils();

  // 勾选生成新的 sku
  onSelectedSpecificationAttribute$().subscribe((values) => {
    handleSelectedSpecificationAttribute(linkage, values, generateColumnToFormField as any);
  });

  // 批量设置值
  onSpecificationTableBatchSetting$().subscribe((values) => {
    handleSpecificationTableBatchSetting(linkage, values);
  });

  // 监听表单变化
  FormEffectHooks.onFieldValueChange$(`${specificationTableFormPath}.*.*`).subscribe(() => {
    handleSpecificationTableInputValueChangeDebounce(
      linkage,
      specificationTableFormPath,
      contrastTableInputMinimumValuesFC,
    );
  });

  // 判断同一行的供货价、建议零售价、最低零售价的价格是否符合规定
  FormEffectHooks.onFieldValidateEnd$(
    `${specificationTableFormPath}.*(supplyPrice,suggestSalePrice,lowerSalePrice)`,
  ).subscribe(async (fieldState) => {
    const diffValues = {
      supplyPrice: 0,
      suggestSalePrice: 0,
      lowerSalePrice: 0,
    };

    const currentIndex = (fieldState.name as string).replace(/[^\d+]*/g, '');
    const parentFormPath = fieldState.path!.substr(0, fieldState.path!.indexOf(`.${currentIndex}`));

    // 父节点的值
    const parentNodeValue = await linkage.getFieldValue(parentFormPath);

    const currentItem = parentNodeValue[currentIndex];

    Object.keys(diffValues).forEach((fName) => {
      diffValues[fName] = currentItem[fName] || 0;
    });

    getVerifyPriceRulesByValues(diffValues).forEach((item) => {
      linkage.setFieldState(`${parentFormPath}.${currentIndex}.${item.fieldName}`, (fstate) => {
        // 不要用数组的形式
        fstate.errors = item.errorMessage as any;
      });
    });
  });
};
