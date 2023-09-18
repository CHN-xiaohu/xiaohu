/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 文章相关
|
*/

import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import { strRandom } from '@/utils';

import type { SupplierColumns, StoreUserColumns } from '@/pages/Consumer/Supplier/Api';
import { getSuppliers, getAllStoreUsers } from '@/pages/Consumer/Supplier/Api';

import type { PropertyColumns, BrandColumns } from '../Api';
import {
  getPropertyByCategoryId,
  getProduct,
  getBrandsByCategoryId,
  getMiniprogramProduct,
} from '../Api';
import { miniprogramSpecificationTableFieldValueToProductSpecificationTableFieldValue } from '../Manager/Form/Utils';

export type ProductChargeUnit = {
  attrResult: string;
  attrs: any[];
  chargeUnitId: 101;
  chargeUnitName: string;
  chargeWay: number;
  chargeWayName: string;
  formula: string;
};

export type ProductModelState = {
  params: PropertyColumns[];
  attributes: PropertyColumns[];
  brands: BrandColumns[];
  suppliers: SupplierColumns[];
  storeUsers: StoreUserColumns[];
  formLoading: boolean;
  currentStep: number;
  reselectCategory: number;
  // 分类是否被重选，即跟原编辑数据所选的分类一直
  categoryIsReselected: boolean;
  isShowEditCategoryPopconfirm: boolean;
  buttonGroupDisabled: boolean;
  // 从采购商品导入到小程序商品
  isImportFromProduct: boolean;
  // 是否处在编辑从采购商品导入为小程序商品的状态
  isEditImportFromProduct: boolean;
  initialValues: {
    name: string;
    brandId?: string;
    brandName?: string;
    supplierId?: string;
    supplierName?: string;
    storeId?: string;
    storeName?: string;
    linkPhone?: string;
    // 1 小程序商品; 0 采购商品
    productType: number;
    // 1 小程序商品可查看商品拿货价
    fromType?: number;
    // 商品源头id
    fromProductInfoId: string;
    images?: string[];
    categoryIds: string[];
    introductions: any[];
    videoUrl?: string;
    serial?: number;
    virtualUrl?: string;
    chargeUnitId?: string;
    minimumSale?: number;
    mini: number;
    minFactoryPrice?: number;
    minPurchasePrice?: number;
    minVipPurchasePrice?: number;
    salePropKeyIds: string[];
    salePropKeyNames: string[];
    paramPropKeyIds: string[];
    paramPropKeyNames: string[];
    paramValIds: string[];
    paramVals: string[];
    productState?: boolean | number;
    miniProductState?: boolean | number;
    shareProfit: boolean | number;
    chargeUnit?: ProductChargeUnit;
    productInfo?: any;
    groups: {
      id: string;
      name: string;
    }[];
    products: {
      id: string;
      minimumSale: number;
      factoryPrice: number;
      purchasePrice: number;
      vipPurchasePrice: number;
      salePropValIds: string[];
      salePropValNames: string[];
    }[];
  };
};

export const formatInitialValues = <T>(initialValues: Record<string, any>): T => {
  const { productInfo } = initialValues;

  initialValues.categoryIds = [...Array(3)].map(
    (_, index) => productInfo[`category${index + 1}Id`],
  );
  initialValues.chargeUnitId = productInfo.chargeUnit.chargeUnitId;

  return {
    ...productInfo,
    ...initialValues,
  };
};

export const getInitialValues = () => ({
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
  productType: 0,
});

const initModelState = () => ({
  params: [],
  attributes: [],
  brands: [],
  suppliers: [],
  storeUsers: [],
  formLoading: false,
  currentStep: 0,
  isShowEditCategoryPopconfirm: false,
  initialValues: getInitialValues(),
  reselectCategory: 0,
  categoryIsReselected: false,
  buttonGroupDisabled: true,
  isImportFromProduct: false,
  isEditImportFromProduct: false,
});

const ModelDefinition = extendBaseModel({
  namespace: 'product' as 'product',

  state: {
    ...initModelState(),
  } as ProductModelState,

  reducers: {
    resetInitialValues(state: ProductModelState) {
      Object.assign(state, initModelState());
    },

    clearAttributesAndParamsAndBrands(state: ProductModelState) {
      state.attributes = [];
      state.params = [];
      state.brands = [];

      state.isShowEditCategoryPopconfirm = false;
    },

    openFormLoading(state: ProductModelState) {
      state.formLoading = true;
    },

    closeFormLoading(state: ProductModelState) {
      state.formLoading = false;
    },

    switchShowEditCategoryPopconfirm(state: ProductModelState, { payload }: { payload: any }) {
      state.isShowEditCategoryPopconfirm = payload.type;
    },

    setIsImportFromProduct(state: ProductModelState, { payload }: { payload: any }) {
      state.isImportFromProduct = Boolean(payload.type);
    },
  },

  effects: {
    /**
     * 这里需要处理四种情况
     * 一、处理采购商品
     * 二、处理正常添加的小程序商品
     * 三、处理导入的小程序商品（新增时）
     * 四、处理导入的小程序商品（编辑时）
     */
    *handleInitialValues(
      { payload: { id, isMiniprogramProduct, isImportFromProduct } }: DvaAnyAction,
      { call, put }: DvaEffectsCommandMap,
    ) {
      yield put({ type: 'openFormLoading' });

      const result: ResponseResult<ProductModelState['initialValues']> = yield call(
        // 这里不能单纯地靠所处的页面类型来判断是否是小程序商品还是采购商品，因为新增导入时，获取接口应该是采购商品，其他情况就都按照页面类型来获取
        isMiniprogramProduct && !isImportFromProduct ? getMiniprogramProduct : getProduct,
        id,
      );

      const initialValuesResult = formatInitialValues<ProductModelState['initialValues']>(
        result.data,
      );

      /**
       * 采购商品0；
       * 小程序商品1；
       * 供货商品 2；
       * 分销商品 3；
       * 商家自营商品4
       */
      // productType = 0 且 mini = 1 是采购商品导入到小程序商品
      const isItImportMiniprogramProduct =
        isMiniprogramProduct &&
        Number(initialValuesResult.mini) === 1 &&
        Number(initialValuesResult.productType) === 0;

      if (isMiniprogramProduct) {
        initialValuesResult.products = initialValuesResult.products.map((item) => ({
          ...item,
          takeThePrice: item.factoryPrice,
          ...miniprogramSpecificationTableFieldValueToProductSpecificationTableFieldValue(item),
        }));
      }

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
          buttonGroupDisabled: false,
          initialValues: initialValuesResult,
          isImportFromProduct: isImportFromProduct || isItImportMiniprogramProduct,
        },
      });

      yield put({ type: 'closeFormLoading' });

      yield put({
        type: 'switchShowEditCategoryPopconfirm',
        payload: {
          type: initialValuesResult?.products?.length > 1,
        },
      });
      return Promise.resolve(initialValuesResult);
    },

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

    *requestSuppliers(_: DvaAnyAction, { call, put }: DvaEffectsCommandMap) {
      const result: ResponseResult = yield call(getSuppliers);

      yield put({ type: 'updateState', payload: { suppliers: result.data } });
    },

    *requestAllStoreUsers(_: DvaAnyAction, { call, put }: DvaEffectsCommandMap) {
      const result: ResponseResult = yield call(getAllStoreUsers);

      yield put({ type: 'updateState', payload: { storeUsers: result.data } });
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
