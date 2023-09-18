import { FormEffectHooks } from '@formily/antd';

import { createLinkageUtils } from '@/components/Business/Formily';

import { getVerifyPriceRulesByValues } from '../SkuLayout/effects';

export const usePriceLayoutSupplementEffects = () => {
  const linkage = createLinkageUtils();

  FormEffectHooks.onFieldValidateEnd$(
    '*.*.priceLayout.*.*(supplyPrice,suggestSalePrice,lowerSalePrice)',
  ).subscribe(async (fieldState) => {
    const parentFormPath = fieldState.path?.substr(
      0,
      fieldState.path.indexOf(`.${fieldState.props.key}`),
    );

    const diffValues = {
      supplyPrice: 0,
      suggestSalePrice: 0,
      lowerSalePrice: 0,
    };

    for (const [k, v] of Object.entries(diffValues)) {
      // eslint-disable-next-line no-await-in-loop
      diffValues[k] = (await linkage.getFieldValue(`${parentFormPath}.${k}`)) || v;
    }

    getVerifyPriceRulesByValues(diffValues).forEach((item) => {
      linkage.setFieldState(`${parentFormPath}.${item.fieldName}`, (fstate) => {
        // 不要用数组的形式
        fstate.errors = item.errorMessage as any;
      });
    });
  });
};
