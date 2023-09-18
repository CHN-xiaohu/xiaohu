import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';
import { getCategoriesByValid } from '@/pages/Product/Api';
import { formatCategoryData } from '@/pages/Product/Utils';

import type { SubscriptionAPI } from 'dva';

export type PcColumnModelState = {
  name: string;
};

const ModelDefinition = extendBaseModel({
  namespace: 'pcColumn' as 'pcColumn',

  state: {
    navigationList: [] as any,
    perNavigation: {} as any,
    columnType: '',
    productAdvImgType: '',
    categoriesTree: [],
    tempRowProducts: [],
    selectedProductRowKeys: [],
    selectRowProducts: [],
    tempRowCategory: [],
    selectedCategoryRowKeys: [],
    selectRowCategory: [],
  },

  effects: {
    *getCategoriesTree(__: never, { put, call, select }: DvaAnyAction) {
      const { categoriesTree } = yield select((_: any) => _.pcColumn);
      if (!categoriesTree.length) {
        const { data } = yield call(getCategoriesByValid);
        const categories = formatCategoryData(data);
        yield put({
          type: 'updateState',
          payload: {
            categoriesTree: categories,
          },
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      history.listen(({ pathname }: any) => {
        if (pathname.includes('/column/form') || pathname.includes('/column/edit_form')) {
          dispatch({
            type: 'getCategoriesTree',
          });
        }
      });
      history.listen(({ pathname }: any) => {
        if (pathname.includes('/miniProgram/miniAdv')) {
          dispatch({
            type: 'getCategoriesTree',
          });
        }
      });
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
