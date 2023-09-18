import type { TCreateLinkageUtils } from '@/components/Business/Formily';
import { createLinkageUtils } from '@/components/Business/Formily';
import type { IFieldState } from '@formily/antd';
import { FormEffectHooks } from '@formily/antd';
import type { DistributionProductModelState } from 'umi';
import { debounce } from 'lodash';
import { cloneDeepByJSON } from '@/utils';

import {
  verifyStoreSupplyPrice,
  verifySalePricePrice,
  verifyPurchasePriceAndVipPurchasePrice,
} from './rules';
import { skuFormPath } from './common';
import { generateContrastTableInputMinimumValues } from './app/util';
// eslint-disable-next-line max-len
import { generateContrastTableInputMinimumValues as generateContrastTableInputMinimumValuesFromMiniprogram } from './miniprogram/util';

import { appSpecificationTableFormPath } from './app/schema';
import { miniprogramSpecificationTableFormPath } from './miniprogram/schema';

const miniprogramPriceCollectionLayoutFormPath = `${skuFormPath}.miniprogram.priceCollection.layout`;
const appPriceCollectionLayoutFormPath = `${skuFormPath}.app.priceCollection.layout`;

// 处理 sku table 中相关的值变动后，更新商品价格模块的对应项的数据
export const handleSpecificationTableInputValueChange = debounce(
  async (linkage: TCreateLinkageUtils, state: IFieldState) => {
    const formPath = state.path.substr(
      0,
      state.path.indexOf('specificationTable') + 'specificationTable'.length,
    );

    const currentSchema = formPath.indexOf('app') !== -1 ? 'app' : 'miniprogram';

    const currentDiffSizeFields =
      currentSchema === 'app'
        ? generateContrastTableInputMinimumValues()
        : generateContrastTableInputMinimumValuesFromMiniprogram();

    try {
      // 避免因为防抖函数的延时操作，导致表单实例已经销毁了，但是工作还在执行
      linkage.getFieldState(formPath, (fieldState) => {
        // 比对最小值
        const diffResult = fieldState.value.reduce(
          (prve: AnyObject, current: AnyObject) => {
            currentDiffSizeFields.forEach((fieldName) => {
              prve[fieldName] =
                parseFloat(prve[fieldName]) < parseFloat(current[fieldName])
                  ? prve[fieldName]
                  : current[fieldName];
            });

            return prve;
          },
          // todo: 验证下 cloneDeep from loadsh
          cloneDeepByJSON(fieldState.value[0]),
        );

        // 同步 sku 的最小值到价格模块中
        try {
          currentDiffSizeFields.forEach((fieldName) => {
            linkage.setFieldValue(
              `${skuFormPath}.${currentSchema}.priceCollection.layout.${fieldName}`,
              diffResult[fieldName],
            );
          });
        } catch {
          //
        }
      });
    } catch {
      //
    }
  },
  360,
);

// 小程序价格校验
const verifyMiniprogramPrice = (opts: {
  fieldName: string;
  value: any;
  lowerSalePrice: string;
  storeSupplyPrice: number;
  salePrice: number;
  supplyPrice: number;
  suggestSalePrice: number;
}) => {
  const [value, , lowerSalePrice, storeSupplyPrice, supplyPrice, suggestSalePrice] = [
    'value',
    'salePrice',
    'lowerSalePrice',
    'storeSupplyPrice',
    'supplyPrice',
    'suggestSalePrice',
  ].map((k) => parseFloat(opts[k]));

  const verifyResult = {
    storeSupplyPrice: () =>
      verifyStoreSupplyPrice(value, {
        salePrice: supplyPrice,
        lowerSalePrice: suggestSalePrice,
      }),

    salePrice: () =>
      verifySalePricePrice(value, {
        storeSupplyPrice,
        lowerSalePrice,
      }),
  };

  return verifyResult[opts.fieldName]();
};

// todo: 对于大型的 sku 校验，后面应该使用 rxjs 来做流控优化
export const useSkuLayoutEffects = (
  initialValuesRef: React.RefObject<DistributionProductModelState['initialValues']>,
) => {
  const linkage = createLinkageUtils();

  const getLowerSalePrice = () => initialValuesRef.current?.minLowerSalePrice ?? '0';
  // 商品供货价
  const getLowerSupplyPrice = () => initialValuesRef.current?.minSupplyPrice ?? '0';
  // 商品最小建议零售价
  const getMinSuggestSalePrice = () => initialValuesRef.current?.minSuggestSalePrice ?? '0';

  FormEffectHooks.onFieldValueChange$('*.*.productInfoLayout.*.salesChannel').subscribe(
    (fieldState) => {
      // 初始化时不做处理
      if (!fieldState.value) {
        return;
      }

      // 根据选中的渠道，对相关字段进行显/隐
      if (fieldState.value.length) {
        [
          ['purchase', 'app'],
          ['mini', 'miniprogram'],
        ].forEach((item) => {
          const [value, fieldPath] = item;

          linkage.visible(`${skuFormPath}.${fieldPath}`, fieldState.value.includes(value));
        });
      } else {
        linkage.visible(`${skuFormPath}.*`, false);
      }
    },
  );

  FormEffectHooks.onFieldValueChange$(
    `${skuFormPath}.*.specification.specificationTable.*.*`,
  ).subscribe((state) => {
    handleSpecificationTableInputValueChange(linkage, state);
  });

  // =========================== 采购 app 相关处理 =========================================

  /**
   * app 商品价格区块的价格处理
   *
   * 当前店铺供货价、零售价进行合法判断处理
   */
  FormEffectHooks.onFieldValidateEnd$(
    `${appPriceCollectionLayoutFormPath}.*(purchasePrice,vipPurchasePrice)`,
  ).subscribe((fieldState) => {
    linkage.setFieldState(fieldState!.path!, (state) => {
      state.ruleErrors = verifyPurchasePriceAndVipPurchasePrice(fieldState.value, {
        lowerSalePrice: getMinSuggestSalePrice(),
        supplyPrice: getLowerSupplyPrice(),
      }) as any;
    });
  });

  // 判断同一行的供货价、建议零售价、最低零售价的价格是否符合规定
  FormEffectHooks.onFieldValidateEnd$(
    `${appSpecificationTableFormPath}.*.*(purchasePrice,vipPurchasePrice)`,
  ).subscribe(async (fieldState) => {
    const currentIndex = (fieldState.name as string).replace(/[^\d+]*/g, '');

    // 父节点的值
    const parentNodeValue = await linkage.getFieldValue(
      fieldState.path!.substr(0, fieldState.path!.indexOf(`.${currentIndex}`)),
    );

    // 这里的校验跟上面的校验是一样的
    linkage.setFieldState(fieldState!.path!, (state) => {
      state.ruleErrors = verifyPurchasePriceAndVipPurchasePrice(fieldState.value, {
        lowerSalePrice: parentNodeValue[currentIndex].suggestSalePrice,
        supplyPrice: parentNodeValue[currentIndex].supplyPrice,
      }) as any;
    });
  });

  // =========================== C 端小程序 相关处理 =========================================

  /**
   * miniprogram 商品价格区块的价格处理
   *
   * 当前店铺供货价、零售价进行合法判断处理
   */
  FormEffectHooks.onFieldValidateEnd$(
    `${miniprogramPriceCollectionLayoutFormPath}.*(storeSupplyPrice,salePrice)`,
  ).subscribe(async () => {
    const lowerSalePrice = getLowerSalePrice();
    const lowerSupplyPrice = getLowerSupplyPrice();
    const lowerSuggestSalePrice = getMinSuggestSalePrice();

    const salePrice = await linkage.getFieldValue(
      `${miniprogramPriceCollectionLayoutFormPath}.salePrice`,
    );
    const storeSupplyPrice = await linkage.getFieldValue(
      `${miniprogramPriceCollectionLayoutFormPath}.storeSupplyPrice`,
    );

    ['storeSupplyPrice', 'salePrice'].forEach((fieldName) => {
      linkage.setFieldState(
        `${miniprogramPriceCollectionLayoutFormPath}.${fieldName}`,
        async (state) => {
          state.ruleErrors = verifyMiniprogramPrice({
            value: state.value,
            fieldName,
            lowerSalePrice,
            salePrice,
            storeSupplyPrice,
            supplyPrice: lowerSupplyPrice,
            suggestSalePrice: lowerSuggestSalePrice,
          });
        },
      );
    });
  });

  // 判断同一行的供货价、建议零售价、最低零售价的价格是否符合规定
  FormEffectHooks.onFieldValidateEnd$(
    `${miniprogramSpecificationTableFormPath}.*.*(storeSupplyPrice,salePrice)`,
  ).subscribe(async (fieldState) => {
    const currentIndex = (fieldState.name as string).replace(/[^\d+]*/g, '');

    // 父节点的值
    const parentNodeValue = await linkage.getFieldValue(
      fieldState.path!.substr(0, fieldState.path!.indexOf(`.${currentIndex}`)),
    );

    const currentItem = parentNodeValue[currentIndex];

    console.log(fieldState!.path);
    ['storeSupplyPrice', 'salePrice'].forEach((fieldName) => {
      linkage.setFieldState(
        fieldState!.path!.replace(/(storeSupplyPrice|salePrice)$/, fieldName),
        async (state) => {
          state.ruleErrors = verifyMiniprogramPrice({
            value: state.value,
            fieldName,
            lowerSalePrice: currentItem.lowerSalePrice,
            salePrice: currentItem.salePrice,
            storeSupplyPrice: currentItem.storeSupplyPrice,
            supplyPrice: currentItem.supplyPrice,
            suggestSalePrice: currentItem.suggestSalePrice,
          });
        },
      );
    });
  });
};
