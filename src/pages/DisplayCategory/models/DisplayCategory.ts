// eslint-disable-next-line import/no-extraneous-dependencies
import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import type { SubscriptionAPI } from 'dva';

import { formatCategoryData } from '../Utils';

import type { displayCategoryColumn } from '../Api';
import { getCategoryTree, getMiniCategoryList, getSupplyCategory } from '../Api';
import { getGroupsNoPage } from '../../Product/Api/groups';

import { getCategoriesByValid } from '../../Product/Api';

export type displayCategoryTree = (displayCategoryColumn & {
  value: displayCategoryColumn['id'];
  key: displayCategoryColumn['id'];
  title: displayCategoryColumn['name'];
  children?: displayCategoryColumn[];
})[];

const displayCategory = extendBaseModel({
  namespace: 'displayCategory' as 'displayCategory',

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      history.listen(({ pathname }) => {
        if (
          ['/app/displayCategory'].includes(pathname) ||
          ['/miniProgram/miniCatetory'].includes(pathname) ||
          ['/shareMarketing/supplyCategory'].includes(pathname)
        ) {
          dispatch({
            type: 'getDisplayCategories',
          });
          dispatch({
            type: 'getCategoriesList',
          });
          if (!['/shareMarketing/supplyCategory'].includes(pathname)) {
            dispatch({
              type: 'getGroupsList',
            });
          }
        }
      });
    },
  },

  state: {
    displayCategories: [],
    productCategories: [],
    parentCategories: [],
    groupsList: [],
  },

  effects: {
    *getParentCategory({ payload }: DvaAnyAction, { call, put }: DvaEffectsCommandMap) {
      const { params = {} } = payload || {};
      const parentCategories: any = [];
      let parentObj = {};
      let result: any = [];
      if (window.location.pathname.split('/').includes('miniCatetory')) {
        result = yield call<any>(getMiniCategoryList, params);
      } else if (window.location.pathname.split('/').includes('supplyCategory')) {
        result = yield call<any>(getSupplyCategory, params);
      } else {
        result = yield call<any>(getCategoryTree, params);
      }
      result.data.forEach((items: any) => {
        if (Number(items.parentId) === 0) {
          parentObj = {
            title: items.name,
            value: items.id,
            key: items.id,
            parentId: items.parentId,
          };
          parentCategories.push(parentObj);
        }
      });

      yield put({ type: 'updateState', payload: { parentCategories } });
    },

    *getDisplayCategories({ payload }: DvaAnyAction, { call, put }: DvaEffectsCommandMap) {
      const { params = {} } = payload || {};

      if (params?.name) {
        yield put({ type: 'getParentCategory' });
      }

      let result: any = [];
      if (window.location.pathname.split('/').includes('miniCatetory')) {
        result = yield call<any>(getMiniCategoryList, params);
      } else if (window.location.pathname.split('/').includes('supplyCategory')) {
        result = yield call<any>(getSupplyCategory, params);
      } else {
        result = yield call<any>(getCategoryTree, params);
      }

      const categoryData = result.data;

      let displayCategories = [];

      if (params?.name) {
        categoryData.forEach((item: any) => {
          item.children = '';
        });
        displayCategories = categoryData;
      } else {
        displayCategories = formatCategoryData(categoryData);
        let parentObj = {};
        const parentCategories = [] as any;
        result.data.forEach((items: any) => {
          if (Number(items.parentId) === 0) {
            parentObj = {
              title: items.name,
              value: items.id,
              key: items.id,
              parentId: items.parentId,
            };
            parentCategories.push(parentObj);
          }
        });

        yield put({ type: 'updateState', payload: { parentCategories } });
      }

      yield put({ type: 'updateState', payload: { displayCategories } });

      return Promise.resolve({ data: displayCategories, total: displayCategories.length });
    },

    *getCategoriesList(_: any, { put }: DvaEffectsCommandMap) {
      const { data } = yield getCategoriesByValid();
      // console.log('getCategoriesList', data)
      const productCategories = formatCategoryData(data);
      yield put({
        type: 'updateState',
        payload: {
          productCategories,
        },
      });
    },
    *getGroupsList(_: any, { put }: DvaEffectsCommandMap) {
      const { data } = yield getGroupsNoPage({ contentFiled: '' });
      const groups = data?.map((items: AnyObject) => ({ label: items.name, value: items.id }));
      yield put({
        type: 'updateState',
        payload: {
          groupsList: groups,
        },
      });
    },
  },
  reducers: {},
});

export default displayCategory;

declare global {
  interface PageModelState {
    // eslint-disable-next-line no-undef
    [displayCategory.namespace]: typeof displayCategory.state;
  }

  interface PageModelReducers {
    // eslint-disable-next-line no-undef
    [displayCategory.namespace]: GetAssignMethods<typeof displayCategory.reducers>;
  }

  interface PageModelEffects {
    // eslint-disable-next-line no-undef
    [displayCategory.namespace]: GetAssignMethods<typeof displayCategory.effects>;
  }
}
