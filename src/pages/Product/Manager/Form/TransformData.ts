import type { IFormGraph, IFormAsyncActions } from '@formily/antd';
import type { ColumnProps } from 'antd/lib/table';
import { getArrayLastItem, isArr } from '@/utils';

import { selectFieldFormFormGraph } from '@/components/Business/Formily/Utils';

import { specificationTableFormPath } from './Fields/SkuLayout';
import { getValueAndIdDataFromFieldPropByOption } from './components/FormFields/ParamsList/help';

import { paramsLayoutFieldFormPath } from './Fields/ParamsLayout';

import type { ProductModelState } from '../../models/Product';

type IParams = {
  formActions: IFormAsyncActions;
  values: Record<string, any>;
  isMiniprogramProduct: boolean;
  formId?: string;
  initialValues: ProductModelState['initialValues'];
};

type IIntegratedDefault = {
  requestBody: AnyObject;
  formGraphs: IFormGraph;
};

type IIntegratedSkuFullLayoutFormData = {
  values: IParams['values'];
  skuFullLayoutValues: AnyObject;
  initialValues: IParams['initialValues'];
  isMiniprogramProduct: IParams['isMiniprogramProduct'];
} & IIntegratedDefault;

const getSpecificationTableFieldValue = (isMiniprogramProduct: boolean, value: AnyObject) => {
  const result = {
    [isMiniprogramProduct ? 'salePrice' : 'factoryPrice']: value.factoryPrice,
    [isMiniprogramProduct ? 'orignPrice' : 'vipPurchasePrice']: value.vipPurchasePrice,
    [isMiniprogramProduct ? 'miniMinimumSale' : 'minimumSale']: value.minimumSale,
    purchasePrice: value.purchasePrice,
  };

  if (isMiniprogramProduct) {
    delete result.purchasePrice;
  }

  return result;
};

// 解析整理 paramsLayout 的表单数据
export const parsingParamsFormData = ({
  formGraphs,
  requestBody,
  paramsList,
}: IIntegratedDefault & { paramsList: AnyObject }) => {
  const cacheParamsLayoutGraphs = {};
  selectFieldFormFormGraph({
    formActions: formGraphs,
    matchPath: 'formLayout.skuFullLayout.paramsLayout.paramsList',
    callback: (graph, fieldState) => {
      cacheParamsLayoutGraphs[getArrayLastItem(graph.split('.')) || 0] = fieldState;
    },
  });

  Object.keys(paramsList).forEach((fieldName) => {
    const paramValue = paramsList[fieldName];

    if (paramValue) {
      const fieldState = formGraphs[`${paramsLayoutFieldFormPath}.${fieldName}`];

      // 多选
      if (isArr(paramValue)) {
        const [paramVal, paramValId] = paramValue.reduce(
          (p, c: string) => {
            const [cval, cid] = getValueAndIdDataFromFieldPropByOption(c);

            p[0].push(cval);
            p[1].push(cid);

            return p;
          },
          [[], []],
        );

        requestBody.paramVals.push(paramVal.join(','));
        requestBody.paramValIds.push(paramValId.join(','));
      } else {
        // 单选跟文本框
        const [paramVal, paramValId] = getValueAndIdDataFromFieldPropByOption(paramValue);

        requestBody.paramVals.push(paramVal);
        requestBody.paramValIds.push(paramValId || '');
      }

      const [, paramPropKeyId] = fieldName.split('_');
      requestBody.paramPropKeyIds.push(paramPropKeyId);
      requestBody.paramPropKeyNames.push(fieldState.props?.title || '');
    }
  });
};

const integratedSkuFormData = ({
  values,
  requestBody,
  formGraphs,
  initialValues,
  skuFullLayoutValues,
  isMiniprogramProduct,
}: IIntegratedSkuFullLayoutFormData): any => {
  // 在编辑的时候，因为使用了 goTo step, 而 formily 在 field display 的时候，是无法设置的
  // 这就会导致如果没有变动 skuFullLayout skuFullLayout 就会为 null, 所以这里做一下兜底
  if (!Object.keys(skuFullLayoutValues).length) {
    // 需要确保是同一分类数据，不然的话，就走下面的注释
    if (values.categoryId?.join('') === initialValues.categoryIds?.join('')) {
      [
        'paramPropKeyIds',
        'paramPropKeyNames',
        'paramValIds',
        'paramVals',
        'salePropKeyIds',
        'salePropKeyNames',
        'products',
      ].forEach((key) => {
        requestBody[key] = initialValues[key];
      });
    }

    // 如果分类 id 不相等，那么就代表是没有进入第三步表单，然后还切换了分类，那么就默认只获取 products 数据

    return requestBody;
  }

  // sku 规格数据整理
  if (skuFullLayoutValues.specificationTable?.length) {
    const specificationTableFieldState = formGraphs[specificationTableFormPath];

    requestBody.products = (skuFullLayoutValues.specificationTable as any[]).map((item, index) => {
      const currentRealItem = skuFullLayoutValues.specificationTable[index] || {};

      const result = {
        ...currentRealItem,
        ...getSpecificationTableFieldValue(isMiniprogramProduct, currentRealItem),
        salePropValIds: item.sku_value_map || item.salePropValIds,
        salePropValNames: item.sku_name_map || item.salePropValNames,
        warning: item.warning,
      };

      if (item.id.indexOf('internal') !== 0) {
        const [realId] = item.id.split('_');
        result.id = realId;
        result.productInfoId = requestBody.productInfo.id;
      } else {
        delete result.id;
      }

      return result;
    });

    ((specificationTableFieldState.props['x-component-props']?.columns ||
      []) as ColumnProps<any>[]).forEach((item) => {
      requestBody.salePropKeyIds.push(item.dataIndex);
      requestBody.salePropKeyNames.push(item.title);
    });
  } else {
    requestBody.products[0].warning = skuFullLayoutValues.warning;
    requestBody.products[0].stock = skuFullLayoutValues.stock;
    requestBody.products[0].factoryPrice = skuFullLayoutValues.factoryPrice;
  }

  return requestBody;
};

export const formatFormData = async ({
  formActions,
  values,
  formId,
  initialValues,
  isMiniprogramProduct,
}: IParams) => {
  const { productInfoFullLayout, skuFullLayout = {} } = values;

  /**
   * 格式化为后端所需数据格式
   *
   * @see http://120.79.18.38:41691/project/25/interface/api/45
   */
  let requestBody = {
    images: productInfoFullLayout.images || [],
    introductions: (productInfoFullLayout.introductions || []).map((item: Record<string, any>) => {
      if (item?.id.indexOf('internal_') === 0) {
        delete item.id;
      }

      return item;
    }),
    productInfo: {
      name: productInfoFullLayout.name,
      serial: productInfoFullLayout.serial,
      videoUrl: productInfoFullLayout.videoUrl,
      virtualUrl: productInfoFullLayout.virtualUrl,
      brandId: productInfoFullLayout.brandId,

      ...(isMiniprogramProduct
        ? { storeId: productInfoFullLayout.storeId }
        : { supplierId: productInfoFullLayout.supplierId }),

      [isMiniprogramProduct ? 'miniProductState' : 'productState']: values.productState
        ? Number(values.productState)
        : 2,
      shareProfit: Number(values.shareProfit),

      chargeUnit: {
        chargeUnitId: getArrayLastItem(productInfoFullLayout.chargeUnits),
      },
    },

    // 商品分组
    groups: productInfoFullLayout?.groups?.map((items: AnyObject) => ({
      id: items.value,
      name: items.label,
    })),

    // 销售参数id，多个逗号隔开，没有id的留空字符
    paramPropKeyIds: [] as string[],
    // 销售参数中文，多个逗号隔开，没有id的留空字符
    paramPropKeyNames: [] as string[],
    // 销售参数值id，多个逗号隔开，没有id的留空字符
    paramValIds: [] as string[],
    // 销售参数值中文，多个逗号隔开
    paramVals: [] as string[],

    salePropKeyIds: [] as string[],
    salePropKeyNames: [] as string[],

    // 默认值
    products: [
      {
        image: '',
        salePropValIds: [],
        salePropValNames: [],
        // 小程序商品跟采购商品的字段是不一样的, 但是表单控件是一样的，所以这里只需要做一下字段转换即可
        ...getSpecificationTableFieldValue(
          isMiniprogramProduct,
          skuFullLayout || initialValues.products?.[0],
        ),
      },
    ],
  };

  if (formId) {
    (requestBody.productInfo as any).id = formId;
  }

  // 在编辑的时候，因为使用了 goTo step, 而 formily 在 field display 的时候，是无法设置的 form schame
  // 这就会导致如果没有变动 categoryId 的值，categoryId 就会为 null, 所以这里做一下兜底
  if (
    (!Array.isArray(values.categoryId) || !values.categoryId.length) &&
    initialValues.categoryIds
  ) {
    values.categoryId = initialValues.categoryIds;
  } else {
    // 分类
    (values.categoryId as string[]).forEach((item, index) => {
      requestBody.productInfo[`category${index + 1}Id`] = item;
    });
  }

  const formGraphs = await formActions.getFormGraph();

  // 产品参数
  if (skuFullLayout.paramsList) {
    parsingParamsFormData({
      formGraphs,
      requestBody,
      paramsList: skuFullLayout.paramsList,
    });
  }

  requestBody = integratedSkuFormData({
    values,
    requestBody,
    formGraphs,
    initialValues,
    skuFullLayoutValues: skuFullLayout,
    isMiniprogramProduct,
  });

  // 编辑时
  if (initialValues.products[0]?.id && !requestBody.products[0].salePropValIds.length) {
    (requestBody.products[0] as any).id = initialValues.products[0].id;
  }

  return requestBody;
};
