import { useMemo, useEffect } from 'react';
import { Typography } from 'antd';
import type { SchemaFormProps, TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import type { IFormAsyncActions } from '@formily/antd';

import { getTheMinValueOfFieldByProducts } from '@/pages/Product/Manager/Form/Utils';

import { expandColumnsFieldMap } from '../../Utils/TableColumns';
import { modelNamespace } from '../..';

const expandColumnsFieldPropsMap = expandColumnsFieldMap();

const CONMMON_PROPS = {
  min: 0.01,
  max: 99999,
  precision: 2,
  step: 0.1,
  addonAfter: '元',
  className: 'product-price__input-number--wrapper',
};

export const usePriceLayoutBySchema = (
  formActions: IFormAsyncActions,
): SchemaFormProps['schema'] => {
  const { initialValues } = useStoreState(modelNamespace);

  useEffect(() => {
    if (!initialValues.products.length) {
      return;
    }

    [
      ['minimumSale', 'minimumSale'],
      ['lowerSalePrice', 'minLowerSalePrice'],
      ['suggestSalePrice', 'minSuggestSalePrice'],
      ['supplyPrice', 'minSupplyPrice'],
      ['stock', 'stock'],
      ['warning', 'warning'],
    ].forEach((keys) => {
      const [key, valueKey] = keys;

      let realValue = initialValues[valueKey] || initialValues.products[0]?.[key] || undefined;

      if (key === 'lowerSalePrice') {
        // 获取最小值
        realValue = getTheMinValueOfFieldByProducts('lowerSalePrice', initialValues.products);
      }

      formActions.setFieldValue(`*.*.priceLayout.*.${key}`, realValue);
    });
  }, [initialValues.products.length]);

  return useMemo((): TSchemas => {
    return {
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        title: (
          <div>
            商品价格
            <Typography.Text type="secondary" style={{ marginLeft: 6 }}>
              建议零售价需大于等于供货价，最低零售价需大于等于供货价且需小于等于建议零售价
            </Typography.Text>
          </div>
        ),
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
          properties: {
            supplyPrice: {
              title: '供货价',
              type: 'inputNumber',
              'x-component-props': {
                ...expandColumnsFieldPropsMap.supplyPrice['x-component-props'],
                ...CONMMON_PROPS,
              },
              'x-rules': expandColumnsFieldPropsMap.supplyPrice['x-rules'],
            },

            suggestSalePrice: {
              title: '建议零售价',
              type: 'inputNumber',
              'x-component-props': {
                ...expandColumnsFieldPropsMap.suggestSalePrice['x-component-props'],
                ...CONMMON_PROPS,
              },
              'x-rules': expandColumnsFieldPropsMap.suggestSalePrice['x-rules'],
            },
            lowerSalePrice: {
              title: '最低销售价',
              type: 'inputNumber',
              'x-component-props': {
                ...expandColumnsFieldPropsMap.lowerSalePrice['x-component-props'],
                ...CONMMON_PROPS,
              },
              'x-rules': expandColumnsFieldPropsMap.lowerSalePrice['x-rules'],
            },
            stock: {
              title: '商品库存',
              type: 'inputNumber',
              description: '商品可售卖的库存,下单后自动扣减库存',
              'x-component-props': {
                ...expandColumnsFieldPropsMap.stock['x-component-props'],
                min: 0,
                max: 999999,
                precision: 0,
                addonAfter: '件',
              },
              'x-rules': expandColumnsFieldPropsMap.stock['x-rules'],
            },
            warning: {
              title: '库存预警',
              type: 'inputNumber',
              default: 1,
              description: '当商品库存等于预警值时,触发信息进行提醒',
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
                ...expandColumnsFieldPropsMap.minimumSale['x-component-props'],
                className: CONMMON_PROPS.className,
              },
            },
          },
        },
      },
    };
  }, []);
};
