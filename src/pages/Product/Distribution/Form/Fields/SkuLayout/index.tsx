import { useRef } from 'react';
import type { ISchemaFormAsyncActions, IFormAsyncActions } from '@formily/antd';

import type { TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { formatTabelDataSourceToDescarteData } from '@/pages/Product/Manager/Form/Utils/Specification';

import { useDebounceWatch } from '@/foundations/hooks';

import type { DistributionProductModelState } from 'umi';

import { useUnmount } from 'ahooks';

import { clearSkuTableAllCache } from '@/pages/Product/Manager/Form/Fields/SkuLayout';

import { useAppSchema } from './app/schema';
import { useMiniprogramSchema } from './miniprogram/schema';

import { skuFormPath } from './common';

import { modelNamespace } from '../..';

export type ISpecificationOption = {
  label: string;
  value: string;
  parent_id: string;
  parent_name: string;
};

// 处理 sku table 的表单值
export const handleInitSkuTableField = (
  formActions: ISchemaFormAsyncActions,
  initialValues: DistributionProductModelState['initialValues'],
  formPath = `${skuFormPath}.*.specification.specificationTable`,
) => {
  const specificationKeyValuePairs = initialValues.salePropKeyIds.reduce(
    (prve, id, index) => ({
      ...prve,
      [id]: initialValues.salePropKeyNames[index],
    }),
    {},
  );

  const { dataSource, columns } = formatTabelDataSourceToDescarteData(
    initialValues.products,
    specificationKeyValuePairs,
  );

  // 设置 sku table 的数据源
  requestAnimationFrame(() => {
    formActions.hostUpdate(() => {
      formActions.setFieldState(formPath, (field) => {
        field.value = dataSource;
        field.props['x-component-props']!.columns = columns;
      });
    });
  });
};

export const syncInitialValues = (
  formActions: IFormAsyncActions,
  initialValues: AnyObject,
  formPath = `${skuFormPath}.*.priceCollection.layout.*`,
) => {
  formActions.hostUpdate(() => {
    formActions.setFieldState(formPath, (fieldState) => {
      const valueMaps = {
        supplyPrice: 'minSupplyPrice',
        minimumSale: 'minimumSale',

        // 采购 app
        purchasePrice: 'minPurchasePrice',
        vipPurchasePrice: 'minVipPurchasePrice',

        // 小程序相关
        storeSupplyPrice: 'minStoreSupplyPrice',
        salePrice: 'minSalePrice',
        orignPrice: 'minOrignPrice',
        stock: 'stock',
        warning: 'warning',
      };

      fieldState.value = initialValues[valueMaps[fieldState.props.key]];

      // 拿到库存及预警最小值显示
      if (['stock', 'warning'].includes(fieldState.props.key)) {
        const diffResult = Math.min(
          ...initialValues.products.map(function (o: any) {
            return o[fieldState.props.key];
          }),
        );
        fieldState.value = diffResult;
      }

      // 这两个字段是需要一直都保持禁用状态
      if (['supplyPrice', 'minimumSale', 'stock', 'warning'].includes(fieldState.props.key)) {
        fieldState.props['x-component-props']!.disabled = true;
      }
    });
  });
};

export const useSkuLayoutBySchema = (formActions: ISchemaFormAsyncActions): TSchemas => {
  const { initialValues, currentStep } = useStoreState(modelNamespace);
  const isInitComplete = useRef(false);

  const app = useAppSchema(formActions);
  const miniprogram = useMiniprogramSchema(formActions);

  useUnmount(() => {
    clearSkuTableAllCache();
  });

  useDebounceWatch(
    () => {
      if (isInitComplete.current || currentStep !== 2) {
        return;
      }

      isInitComplete.current = true;

      const isExistsSku = !!initialValues.products?.[0]?.salePropValIds.length;

      // 设置价格区块相关字段的禁用状态
      formActions.setFieldState(`${skuFormPath}.*.priceCollection.layout.*`, (fieldState) => {
        if (!['supplyPrice', 'minimumSale'].includes(fieldState.props.key)) {
          fieldState.props['x-component-props']!.disabled = isExistsSku;
        }
      });

      // 设置默认值
      syncInitialValues(formActions, initialValues);

      if (!isExistsSku) {
        // 如果没有 sku，那么就需要将 sku table 给移除
        formActions.setFieldState(`${skuFormPath}.*.specification`, (field) => {
          field.visible = false;
        });

        return;
      }

      handleInitSkuTableField(formActions, initialValues);
    },
    [initialValues.products, currentStep],
    { ms: 16 },
  );

  const schema = useRef<TSchemas>({
    type: 'object',
    'x-component': 'virtualBox',
    properties: {
      app,
      miniprogram,
    },
  });

  return schema.current;
};
