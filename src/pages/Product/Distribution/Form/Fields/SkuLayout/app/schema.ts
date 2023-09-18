import { useRef, useCallback } from 'react';
import type { TSchemas } from '@/components/Business/Formily';

import type { IFormAsyncActions } from '@formily/antd';

import { expandColumnsFieldMap, expandColumnsMap, realExpandColumnsFieldPropsMap } from './util';

import { skuFormPath, generatePriceSchema, handleBatchSetting } from '../common';

const priceProperties = generatePriceSchema(expandColumnsFieldMap, expandColumnsMap);

export const appSpecificationTableFormPath = `${skuFormPath}.app.specification.specificationTable`;

export const useAppSchema = (formActions: IFormAsyncActions) => {
  const innerHandleBatchSetting = useCallback((columnInputValues, selectedRowIndexs) => {
    handleBatchSetting({
      formActions,
      specificationTableFormPath: appSpecificationTableFormPath,
      columnInputValues,
      selectedRowIndexs,
    });
  }, []);

  const schema = useRef<TSchemas>({
    type: 'object',
    'x-component': 'card',
    'x-component-props': {
      title: '采购 App - 价格设置',
    },
    properties: {
      specification: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '销售属性',
          type: 'inner',
        },
        properties: {
          specificationTable: {
            type: 'array',
            'x-component': 'specificationTable',
            'x-component-props': {
              initialValue: [],
              expandColumnsFieldPropsMap: realExpandColumnsFieldPropsMap,
              expandColumnsMap,
              onBatchSetting: innerHandleBatchSetting,
            },
            items: {
              type: 'object',
              properties: expandColumnsFieldMap(),
            },
          },
        },
      },
      priceCollection: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '商品价格',
          type: 'inner',
        },
        properties: {
          layout: {
            type: 'object',
            'x-component': 'mega-layout',
            'x-component-props': {
              grid: true,
              autoRow: true,
              full: true,
              columns: 3,
              labelWidth: 120,
            },
            properties: priceProperties,
          },
        },
      },
    },
  });

  return schema.current;
};
