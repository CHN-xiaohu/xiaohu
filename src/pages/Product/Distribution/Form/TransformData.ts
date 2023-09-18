import type { IFormAsyncActions } from '@formily/antd';
import { cloneDeep } from 'lodash';
import { isArr } from '@/utils';

import type { SupplyProductModelState } from '../../models/Supply';

type IParams = {
  formActions: IFormAsyncActions;
  values: Record<string, any>;
  formId?: string;
  initialValues: SupplyProductModelState['initialValues'];
};

export const formatFormData = async ({ values, formId, initialValues }: IParams) => {
  const { productInfoFullLayout, skuFullLayout = {} } = values;
  /**
   * 格式化为后端所需数据格式
   *
   * @see http://120.79.18.38:41691/project/25/interface/api/3413
   */

  const result = {
    productInfo: {
      id: formId,
      serial: productInfoFullLayout.serial,
      storeId: productInfoFullLayout.storeId,
      mini: Number(productInfoFullLayout.salesChannel.includes('mini')),
      purchase: Number(productInfoFullLayout.salesChannel.includes('purchase')),

      productState: values.productState ? Number(values.productState) : 2,
    },

    // 商品分组
    groups: productInfoFullLayout?.groups?.map((item: AnyObject) => ({
      name: item.label,
      id: item.value,
    })),

    // 默认值
    products:
      isArr(skuFullLayout.specificationTable) && skuFullLayout.specificationTable.length
        ? skuFullLayout.specificationTable
        : Object.keys(skuFullLayout).length
        ? [skuFullLayout]
        : initialValues.products,
  } as typeof initialValues;

  result.products = cloneDeep(result.products).map((item) => {
    if (item.id && item.id.indexOf('internal') !== 0) {
      const [realId] = item.id.split('_');
      item.id = realId;
    } else {
      delete item.id;
    }

    return item;
  });

  // 没有 sku 的情况下，需要将原有 id 补上去
  if (!result.products[0]?.salePropValIds?.length) {
    result.products[0].id = initialValues.products[0].id;
  }

  return result;
};
