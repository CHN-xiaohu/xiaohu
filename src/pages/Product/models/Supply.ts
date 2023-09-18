/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 文章相关
|
*/

import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import { strRandom } from '@/utils';

import type { StoreUserColumns } from '@/pages/Consumer/Supplier/Api';

import type { ProductChargeUnit } from './Product';
import { formatInitialValues } from './Product';

import type { PropertyColumns, BrandColumns } from '../Api';
import { fromMiniProductCopyToSupplyProduct } from '../Api';
import {
  getPropertyByCategoryId,
  getBrandsByCategoryId,
  fromProductCopyToSupplyProduct,
  getSupplyProduct,
  getSupplyProductSnapshot,
} from '../Api';

import { getShareProductDetail } from '../Api/share';
import { generateDetailEditorItemId } from '../Manager/Form/components/FormFields/DetailEditor';
import { expandColumnsFieldMap } from '../Supply/Form/Utils/TableColumns';

export type SupplyProductModelState = {
  params: PropertyColumns[];
  attributes: PropertyColumns[];
  brands: BrandColumns[];
  storeUsers: StoreUserColumns[];
  formLoading: boolean;
  currentStep: number;
  reselectCategory: number;
  // 分类是否被重选，即跟原编辑数据所选的分类一直
  categoryIsReselected: boolean;
  isShowEditCategoryPopconfirm: boolean;
  initialValues: {
    name: string;
    brandId?: string;
    brandName?: string;
    supplierId?: string;
    supplierName?: string;
    storeId?: string;
    storeName?: string;
    linkPhone?: string;
    images?: {
      id?: string;
      productInfoId: string;
      serial: number;
      url: string;
    }[];
    categoryIds: string[];
    introductions: any[];
    videoUrl?: string;
    serial?: number;
    virtualUrl?: string;
    chargeUnitId?: string;

    minimumSale?: number;
    minFactoryPrice?: number;
    minPurchasePrice?: number;
    minVipPurchasePrice?: number;

    // 最大、最小利润率
    maxProfitMargin?: string;
    minProfitMargin?: string;

    // 最大、最小建议零售价
    maxSuggestSalePrice?: string;
    minSuggestSalePrice?: string;

    // 最大、最小供货价
    maxSupplyPrice?: string;
    minSupplyPrice?: string;

    salePropKeyIds: string[];
    salePropKeyNames: string[];
    paramPropKeyIds: string[];
    paramPropKeyNames: string[];
    paramValIds: string[];
    paramVals: string[];
    productState?: boolean | number;
    shareProfit: boolean | number;
    sharePool?: number;
    chargeUnit?: ProductChargeUnit;
    productInfo?: any;
    products: {
      id: string;
      productInfoId: string;
      image: string;
      salePropValIds: string[];
      salePropValNames: string[];

      // 起售数量
      minimumSale: string;
      // 最低销售价
      lowerSalePrice: string;
      // 建议零售价
      suggestSalePrice: string;
      // 供货价
      supplyPrice: string;
    }[];
    // 商品分组
    groups: {
      name: string;
      id: string;
    }[];
  };
};

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

const ModelDefinition = extendBaseModel({
  namespace: 'supplyProduct' as 'supplyProduct',

  state: {
    ...initModelState(),
  } as SupplyProductModelState,

  reducers: {
    resetInitialValues(state: SupplyProductModelState) {
      Object.assign(state, initModelState());
    },

    clearAttributesAndParamsAndBrands(state: SupplyProductModelState) {
      state.attributes = [];
      state.params = [];
      state.brands = [];

      state.isShowEditCategoryPopconfirm = false;
    },

    toggleFormLoading(state: SupplyProductModelState) {
      state.formLoading = !state.formLoading;
    },

    switchShowEditCategoryPopconfirm(
      state: SupplyProductModelState,
      { payload }: { payload: any },
    ) {
      state.isShowEditCategoryPopconfirm = payload.type;
    },
  },

  effects: {
    *requestFromProductCopyToSupplyProduct(
      { payload }: DvaAnyAction,
      { put }: DvaEffectsCommandMap,
    ) {
      yield put({ type: 'toggleFormLoading' });

      const res = yield fromProductCopyToSupplyProduct(payload.id);

      yield put({
        type: 'formCopyProductDataSyncToInitialValues',
        payload: {
          initialValues: res.data,
        },
      });

      yield put({ type: 'toggleFormLoading' });
    },

    *requestFromMiniProductCopyToSupplyProduct(
      { payload }: DvaAnyAction,
      { put }: DvaEffectsCommandMap,
    ) {
      yield put({ type: 'toggleFormLoading' });

      const res = yield fromMiniProductCopyToSupplyProduct(payload.id);

      yield put({
        type: 'formCopyProductDataSyncToInitialValues',
        payload: {
          initialValues: res.data,
        },
      });

      yield put({ type: 'toggleFormLoading' });
    },

    *formCopyProductDataSyncToInitialValues(
      { payload = {} }: DvaAnyAction,
      { put }: DvaEffectsCommandMap,
    ) {
      const { initialValues } = payload as {
        initialValues: SupplyProductModelState['initialValues'];
      };

      // 删除无用的 id
      delete initialValues.productInfo.id;

      if (initialValues.images?.length) {
        initialValues.images.forEach((item) => {
          if (item.id === '-1') {
            delete item.productInfoId;
            delete item.id;
          }
        });
      }

      const columnsFieldNames = Object.keys(expandColumnsFieldMap());
      initialValues.products.forEach((item) => {
        // 去除无用的 id
        delete item.id;
        delete item.productInfoId;

        columnsFieldNames.forEach((k) => {
          if (!item[k] || (k === 'minimumSale' && !Number(item[k]))) {
            item[k] = undefined;
          }
        });
      });

      initialValues.introductions.forEach((item) => {
        item.id = generateDetailEditorItemId();
        delete item.productInfoId;
      });

      yield put({
        type: 'updateState',
        payload: {
          initialValues: formatInitialValues<SupplyProductModelState['initialValues']>(
            initialValues,
          ),
        },
      });

      return Promise.resolve();
    },

    *handleInitialValues(
      { payload: { id, isSnapshot } }: DvaAnyAction,
      { call, put }: DvaEffectsCommandMap,
    ) {
      yield put({ type: 'toggleFormLoading' });

      const result: ResponseResult<SupplyProductModelState['initialValues']> = yield call(
        window.location.pathname.includes('shareMarketing')
          ? getShareProductDetail
          : isSnapshot
          ? getSupplyProductSnapshot
          : getSupplyProduct,
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
      } as SupplyProductModelState['initialValues'];

      if (initialValuesResult.salePropKeyIds && initialValuesResult.salePropKeyNames) {
        // 加多一个去重的操作来保证数据的唯一
        initialValuesResult.salePropKeyIds = [...new Set(initialValuesResult.salePropKeyIds)];
        initialValuesResult.salePropKeyNames = [...new Set(initialValuesResult.salePropKeyNames)];
      }

      if (String(initialValuesResult.storeId).length < 5) {
        initialValuesResult.storeId = undefined;
      }

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
