/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 文章相关
|
*/

import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import { strRandom } from '@/utils';

import type { SupplyProductModelState } from './Supply';

import {
  getPropertyByCategoryId,
  getBrandsByCategoryId,
  getDistributionProduct,
  getSupplyProductSnapshot,
} from '../Api';

export type DistributionProductModelState = {
  initialValues: {
    mini: number;
    purchase: number;
    minStoreSupplyPrice?: string;
    minSalePrice?: string;
    minOrignPrice?: string;
    minLowerSalePrice?: string;
  } & SupplyProductModelState['initialValues'];
} & Omit<SupplyProductModelState, 'initialValues'>;

const getInitialValues = () => ({
  name: undefined as any,
  categoryIds: [],
  introductions: [],
  salePropKeyIds: [],
  salePropKeyNames: [],
  products: [],
  paramPropKeyIds: [],
  paramPropKeyNames: [],
  paramValIds: [],
  paramVals: [],
  productState: true,
  shareProfit: true,
  mini: 0,
  purchase: 1,
});

const initModelState = () => ({
  params: [],
  attributes: [],
  brands: [],
  storeUsers: [],
  formLoading: false,
  currentStep: 0,
  isShowEditCategoryPopconfirm: false,
  initialValues: getInitialValues(),
  reselectCategory: 0,
  categoryIsReselected: false,
});

const toFixed2 = (num: string) => {
  const result = parseFloat(num).toFixed(2);

  // eslint-disable-next-line no-restricted-globals
  return isNaN(result as any) ? undefined : result;
};

const ModelDefinition = extendBaseModel({
  namespace: 'distributionProduct' as 'distributionProduct',

  state: {
    ...initModelState(),
  } as DistributionProductModelState,

  reducers: {
    resetInitialValues(state: DistributionProductModelState) {
      Object.assign(state, initModelState());
    },

    clearAttributesAndParamsAndBrands(state: DistributionProductModelState) {
      state.attributes = [];
      state.params = [];
      state.brands = [];

      state.isShowEditCategoryPopconfirm = false;
    },

    toggleFormLoading(state: DistributionProductModelState) {
      state.formLoading = !state.formLoading;
    },

    switchShowEditCategoryPopconfirm(
      state: DistributionProductModelState,
      { payload }: { payload: any },
    ) {
      state.isShowEditCategoryPopconfirm = payload.type;
    },
  },

  effects: {
    *handleInitialValues(
      { payload: { id, isSnapshot } }: DvaAnyAction,
      { call, put }: DvaEffectsCommandMap,
    ) {
      yield put({ type: 'toggleFormLoading' });

      const result: ResponseResult<DistributionProductModelState['initialValues']> = yield call(
        isSnapshot ? getSupplyProductSnapshot : getDistributionProduct,
        id,
      );

      const initialValues = result.data;

      const { productInfo } = initialValues as Record<string, any>;

      initialValues.categoryIds = [...Array(3)].map(
        (_, index) => productInfo[`category${index + 1}Id`],
      );
      initialValues.chargeUnitId = productInfo.chargeUnit.chargeUnitId;

      const initialValuesResult = {
        ...productInfo,
        ...initialValues,
      } as DistributionProductModelState['initialValues'];

      if (initialValuesResult.salePropKeyIds && initialValuesResult.salePropKeyNames) {
        // 加多一个去重的操作来保证数据的唯一
        initialValuesResult.salePropKeyIds = [...new Set(initialValuesResult.salePropKeyIds)];
        initialValuesResult.salePropKeyNames = [...new Set(initialValuesResult.salePropKeyNames)];
      }

      if (String(initialValuesResult.storeId).length < 5) {
        initialValuesResult.storeId = undefined;
      }

      const diffFields = [
        'supplyPrice',
        'minimumSale',

        'purchasePrice',
        'vipPurchasePrice',

        'storeSupplyPrice',
        'salePrice',
        'orignPrice',

        'lowerSalePrice',
      ];

      // 因为后端没有提供 [起批数量] 的最小值，所以需要我们自己遍历比对
      const minValueOfFields = initialValuesResult.products.reduce((prve, current, index) => {
        diffFields.forEach((fieldName) => {
          prve[fieldName] =
            parseFloat(prve[fieldName]) < parseFloat(current[fieldName])
              ? prve[fieldName]
              : current[fieldName];

          if (fieldName !== 'minimumSale') {
            // 将价格格式化一下，方便后面做展示使用
            current[fieldName] = toFixed2(current[fieldName]);

            // 防止没有 sku 的时候，默认的第一项没有设置转换到
            if (index === 0) {
              prve[fieldName] = toFixed2(prve[fieldName]);
            }
          }
        });

        ['suggestSalePrice'].forEach((fieldName) => {
          current[fieldName] = toFixed2(current[fieldName]);

          // 防止没有 sku 的时候，默认的第一项没有设置转换到
          if (index === 0) {
            prve[fieldName] = toFixed2(prve[fieldName]);
          }
        });

        return prve;
      }, JSON.parse(JSON.stringify(initialValues.products[0])));

      initialValuesResult.minSupplyPrice = minValueOfFields.supplyPrice;
      initialValuesResult.minimumSale = Number(minValueOfFields.minimumSale);
      initialValuesResult.minStoreSupplyPrice = minValueOfFields.storeSupplyPrice;
      initialValuesResult.minSalePrice = minValueOfFields.salePrice;
      initialValuesResult.minOrignPrice = minValueOfFields.orignPrice;
      initialValuesResult.minLowerSalePrice = minValueOfFields.lowerSalePrice;
      initialValuesResult.minSuggestSalePrice = minValueOfFields.suggestSalePrice;

      yield put({
        type: 'updateState',
        payload: {
          initialValues: initialValuesResult,
        },
      });

      yield put({ type: 'toggleFormLoading' });

      yield put({
        type: 'switchShowEditCategoryPopconfirm',
        payload: {
          type: initialValuesResult?.products?.length > 1,
        },
      });

      return Promise.resolve(initialValuesResult);
    },

    // 通过分类 id 来查找对应所属的商品属性
    *requestProductAttributesByCategoryId(
      { payload: { categoryId } }: DvaAnyAction,
      { call, put }: DvaEffectsCommandMap,
    ) {
      const attributesResult: ResponseResult = yield call(getPropertyByCategoryId, {
        categoryId,
        propType: 1,
      });

      yield put({
        type: 'updateState',
        payload: {
          attributes: attributesResult.data,
        },
      });
    },

    // 通过分类 id 来查找对应所属的商品属性、商品参数
    *requestProductParamsByCategoryId(
      { payload: { categoryId } }: DvaAnyAction,
      { call, put }: DvaEffectsCommandMap,
    ) {
      const paramsResult: ResponseResult = yield call(getPropertyByCategoryId, {
        categoryId,
        propType: 2,
      });

      yield put({
        type: 'requestProductAttributesByCategoryId',
        payload: {
          categoryId,
        },
      });

      yield put({
        type: 'updateState',
        payload: {
          params: paramsResult.data,
        },
      });

      return Promise.resolve();
    },

    // 通过分类 id 来查找对应所属的品牌数据
    *requestBrandsByCategoryId(
      { payload: { categoryId } }: DvaAnyAction,
      { call, put }: DvaEffectsCommandMap,
    ) {
      const result: ResponseResult = yield call(getBrandsByCategoryId, {
        searchCategoryId: categoryId,
      });

      yield put({
        type: 'updateState',
        payload: {
          brands: result.data,
        },
      });

      return Promise.resolve();
    },

    *resetRequestProductParamsAndAttributes(
      { payload }: DvaAnyAction,
      { put }: DvaEffectsCommandMap,
    ) {
      // yield put({ type: 'clearAttributesAndParamsAndBrands' });
      yield put({
        type: 'updateState',
        payload: {
          isShowEditCategoryPopconfirm: false,
        },
      });

      yield put({ type: 'requestProductParamsByCategoryId', payload });

      yield put({ type: 'requestBrandsByCategoryId', payload });

      yield put({ type: 'updateState', payload: { reselectCategory: strRandom(6, 'number') } });
    },
  },
});

export default ModelDefinition;

declare global {
  interface PageModelState {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: typeof ModelDefinition.state;
  }

  interface PageModelReducers {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: GetAssignMethods<typeof ModelDefinition.reducers>;
  }

  interface PageModelEffects {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: GetAssignMethods<typeof ModelDefinition.effects>;
  }
}
