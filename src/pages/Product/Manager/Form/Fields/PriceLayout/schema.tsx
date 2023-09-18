import { useMemo, useEffect } from 'react';
import type { SchemaFormProps, TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import type { IFormAsyncActions } from '@formily/antd';

import { IsShowTakeProductPrice } from '@/pages/Product/Miniprogram/IsShowTakeProductPrice';

import { expandColumnsFieldMap } from '../../Utils/Specification';

const CONMMON_PROPS = {
  min: 0.01,
  max: 999999,
  precision: 2,
  step: 0.1,
  addonAfter: '元',
  className: 'product-price__input-number--wrapper',
};

export const generatePriceLayoutPropertiesSchema = ({
  isMiniprogramProduct,
  isImportFromProduct,
}: {
  isMiniprogramProduct?: boolean;
  isImportFromProduct?: boolean;
}) => {
  const factoryPriceTitle = isImportFromProduct || isMiniprogramProduct ? '零售价' : '成本价';

  const vipPurchasePriceTitle =
    isImportFromProduct || isMiniprogramProduct ? '销售原价' : '会员采购价';

  const expandColumnsFieldMapValue = expandColumnsFieldMap(
    isImportFromProduct,
    isMiniprogramProduct,
  );

  const takeThePrice = !isImportFromProduct
    ? {}
    : {
        takeThePrice: {
          title: '成本价',
          type: 'inputNumber',
          'x-component-props': {
            className: 'product-price__input-number--wrapper',
            addonAfter: '元',
          },
        },
      };

  return {
    ...takeThePrice,
    factoryPrice: {
      title: factoryPriceTitle,
      type: 'inputNumber',
      'x-component-props': {
        ...expandColumnsFieldMapValue.factoryPrice['x-component-props'],
        ...CONMMON_PROPS,
      },
      'x-rules': expandColumnsFieldMapValue.factoryPrice['x-rules'],
    },

    vipPurchasePrice: {
      title: vipPurchasePriceTitle,
      type: 'inputNumber',
      'x-component-props': {
        ...expandColumnsFieldMapValue.vipPurchasePrice['x-component-props'],
        ...CONMMON_PROPS,
      },
      'x-rules': expandColumnsFieldMapValue.vipPurchasePrice['x-rules'],
    },
    ...(isImportFromProduct || isMiniprogramProduct
      ? {}
      : {
          purchasePrice: {
            title: '普通采购价',
            type: 'inputNumber',
            visible: !isImportFromProduct,
            'x-component-props': {
              ...expandColumnsFieldMapValue.purchasePrice['x-component-props'],
              ...CONMMON_PROPS,
            },
            'x-rules': expandColumnsFieldMapValue.purchasePrice['x-rules'],
          },
        }),
    stock: {
      title: '商品库存',
      type: 'inputNumber',
      description: (
        <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>商品可售卖的库存,下单后自动扣减库存</span>
      ),
      'x-component-props': {
        ...expandColumnsFieldMapValue.stock['x-component-props'],
        min: 0,
        max: 999999,
        precision: 0,
        addonAfter: '件',
      },
      'x-rules': expandColumnsFieldMapValue.stock['x-rules'],
    },
    warning: {
      title: '库存预警',
      type: 'inputNumber',
      description: (
        <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
          当商品库存等于预警值时,触发信息进行提醒
        </span>
      ),
      default: 1,
      'x-component-props': {
        min: 1,
        max: 99,
        precision: 0,
        addonAfter: '件',
      },
    },
    minimumSale: {
      title: '起批数量',
      type: 'inputNumber',
      'x-component-props': {
        ...expandColumnsFieldMapValue.minimumSale['x-component-props'],
        className: CONMMON_PROPS.className,
      },
    },
  };
};

export const syncPricePropertiesValues = (
  fieldMaps: string[][],
  initialValues: AnyObject,
  formActions: IFormAsyncActions,
) => {
  fieldMaps.forEach((keys) => {
    const [key, valueKey] = keys;

    formActions.setFieldValue(
      `*.*.priceLayout.*.${key}`,
      initialValues[valueKey] ?? initialValues.products[0]?.[valueKey],
    );
  });
};

export const miniprogramProductPricePropertiesFieldMaps = [
  ['takeThePrice', 'takeThePrice'],
  ['factoryPrice', 'salePrice'],
  ['vipPurchasePrice', 'orignPrice'],
  ['minimumSale', 'miniMinimumSale'],
  ['purchasePrice', 'purchasePrice'],
  ['stock', 'stock'],
  ['warning', 'warning'],
];

export const usePriceLayoutBySchema = (
  formActions: IFormAsyncActions,
  isImportFromProduct: boolean,
  isMiniprogramProduct: boolean,
  isMiniprogramShowTakeProductsPrice: boolean,
): SchemaFormProps['schema'] => {
  const { initialValues } = useStoreState('product');

  useEffect(() => {
    if (!initialValues.products.length) {
      return;
    }

    let kvMaps = [
      ['factoryPrice', 'minFactoryPrice'],
      ['vipPurchasePrice', 'minVipPurchasePrice'],
      ['purchasePrice', 'minPurchasePrice'],
      ['minimumSale', 'minimumSale'],
      ['stock', 'stock'],
      ['warning', 'warning'],
    ];

    if (isMiniprogramProduct) {
      kvMaps = miniprogramProductPricePropertiesFieldMaps;
    }

    syncPricePropertiesValues(kvMaps, initialValues, formActions);
  }, [initialValues.products.length]);

  return useMemo((): TSchemas => {
    return {
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        title: isMiniprogramShowTakeProductsPrice ? <IsShowTakeProductPrice /> : '商品价格',
        type: 'inner',
      },
      properties: {
        priceGrid: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 2,
          },
          properties: generatePriceLayoutPropertiesSchema({
            isMiniprogramProduct,
            isImportFromProduct,
          }),
        },
      },
    };
  }, [isImportFromProduct, isMiniprogramShowTakeProductsPrice]);
};
