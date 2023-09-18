import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import type { SubscriptionAPI } from 'dva';

import { formatCategoryDatas } from '../Util';
import { formatCategoryData } from '../../Product/Utils';

import { getCategoriesByValid } from '../../Product/Api';
import { couponDetail, getProductList, getMiniProduct } from '../Api';

const coupon = extendBaseModel({
  namespace: 'coupon' as 'coupon',
  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      history.listen(({ pathname }) => {
        if (pathname.split('/')[2] === 'coupon' && pathname.split('/')[3] === 'form') {
          dispatch({
            type: 'getCategoriesList',
          });
        }
        if (pathname.split('/')[2] === 'coupon' && pathname.split('/')[3] === 'detail') {
          dispatch({
            type: 'getCategoriesList',
          });
          dispatch({
            type: 'updateState',
            payload: {
              isDetail: true,
            },
          });
        } else {
          dispatch({
            type: 'updateState',
            payload: {
              isDetail: false,
            },
          });
        }
      });
    },
  },
  state: {
    productCategories: [],
    productOneCategories: [],
    selectedProductRowKeys: [],
    tempRowProducts: [],
    selectRowProducts: [],
    detailMessage: {},
    timeRemark: '',
    ruleRemark: '',
    usedRemark: '',
    detailTotal: 0,
    detailCurrent: 1,
    isDetail: false,
    categoryName: '',
    merchantList: [],
    currentMerchantList: [],
    couponUsed: window.location.pathname.split('/').includes('miniProgram') ? 40 : 20,
    originCategoryList: [],
    storeId: '',
    couponId: '',
  },
  effects: {
    *getCategoriesList(_: any, { put }: DvaEffectsCommandMap) {
      const { data } = yield getCategoriesByValid();
      const productCategories = formatCategoryDatas(data);
      const productOneCategories = formatCategoryData(data);
      yield put({
        type: 'updateState',
        payload: {
          productCategories,
          productOneCategories,
          originCategoryList: data,
        },
      });
    },
    *getDetail({ id }: DvaAnyAction, { put }: DvaEffectsCommandMap) {
      const { data } = yield couponDetail(id);
      yield put({
        type: 'updateState',
        payload: {
          detailMessage: data,
        },
      });
    },
    *getCouponProducts({ payload }: DvaAnyAction, { put, select }: DvaEffectsCommandMap) {
      const { storeId } = yield select((_: any) => _.coupon);
      const requestUrl = window.location.pathname.split('/').includes('miniProgram')
        ? getMiniProduct
        : getProductList;
      if (window.location.pathname.split('/').includes('miniProgram') && payload.storeId === '') {
        payload.storeId = storeId;
      }
      const { data } = yield requestUrl(payload);
      const { records, total, current } = data;
      yield put({
        type: 'updateState',
        payload: {
          tempRowProducts: records,
          selectRowProducts: records,
          detailTotal: total,
          detailCurrent: current,
        },
      });
    },
    *getPerCategoryName({ payload }: DvaAnyAction, { put }: DvaEffectsCommandMap) {
      const { data } = yield getCategoriesByValid();
      let categoryName = '';
      data.forEach((item: any) => {
        if (item.id === payload.id) {
          categoryName = item.treeNamePath;
        }
      });
      yield put({
        type: 'updateState',
        payload: {
          categoryName,
        },
      });
    },
  },
});

export default coupon;

declare global {
  interface PageModelState {
    // eslint-disable-next-line no-undef
    [coupon.namespace]: typeof coupon.state;
  }

  interface PageModelReducers {
    // eslint-disable-next-line no-undef
    [coupon.namespace]: GetAssignMethods<typeof coupon.reducers>;
  }

  interface PageModelEffects {
    // eslint-disable-next-line no-undef
    [coupon.namespace]: GetAssignMethods<typeof coupon.effects>;
  }
}
