import type { SubscriptionAPI } from 'dva';

import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import { getCategoriesByValid } from '../../../Product/Api';

const Merchants = extendBaseModel({
  namespace: 'merchant' as 'merchant',

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      history.listen(({ pathname }) => {
        if (['/consumer/merchant'].includes(pathname)) {
          dispatch({
            type: 'getDisplayCategories',
          });
          dispatch({
            type: 'getCategoriesList',
          });
        }
      });
    },
  },

  state: {
    productCategories: [],
  },

  effects: {
    *getCategoriesList(_: any, { put }: DvaEffectsCommandMap) {
      const { data } = yield getCategoriesByValid();

      const newArr = data.filter((element: any) => {
        if (element.grade === 3) {
          element.value = element.id;
          element.label = element.treeNamePath;
          return element;
        }

        return false;
      });

      yield put({
        type: 'updateState',
        payload: {
          productCategories: newArr,
        },
      });
    },
  },
  reducers: {},
});

export default Merchants;

declare global {
  interface PageModelState {
    // eslint-disable-next-line no-undef
    [Merchants.namespace]: typeof Merchants.state;
  }

  interface PageModelReducers {
    // eslint-disable-next-line no-undef
    [Merchants.namespace]: GetAssignMethods<typeof Merchants.reducers>;
  }

  interface PageModelEffects {
    // eslint-disable-next-line no-undef
    [Merchants.namespace]: GetAssignMethods<typeof Merchants.effects>;
  }
}
