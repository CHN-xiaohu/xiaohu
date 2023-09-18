/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 文章相关
|
*/
// eslint-disable-next-line import/no-extraneous-dependencies
import type { SubscriptionAPI } from 'dva';
import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import type { CategoryColumns } from '../Api';
import { getCategoriesByValid } from '../Api';
import { formatCategoryData } from '../Utils';

export type CategoryTree = (CategoryColumns & {
  value: CategoryColumns['id'];
  key: CategoryColumns['id'];
  title: CategoryColumns['name'];
  children?: CategoryColumns[];
})[];

type State = {
  categories: CategoryTree;
  listValid: any[];
};

const ModelDefinition = extendBaseModel({
  namespace: 'productCategory' as 'productCategory',

  state: {
    // 缓存一份来公用，减少请求, 这里的分类是已经过滤过被禁用的分类项的
    categories: [],
    listValid: [],
  } as State,

  reducers: {
    // 初始化分类数据
    initCategories(state: State, { payload }: any) {
      state.categories = payload.categories;
      state.listValid = payload.listValid;
    },
  },

  effects: {
    *handleRequestCategories(
      { payload = {} }: DvaAnyAction,
      { select, call, put }: DvaEffectsCommandMap,
    ) {
      const { params = {}, resetRequest = false } = payload;

      let categories: CategoryColumns[] = yield select((state) => state.productCategory.categories);

      if (!categories.length || resetRequest) {
        const result: ResponseResult<CategoryColumns[]> = yield call<any>(
          getCategoriesByValid,
          params,
        );

        categories = formatCategoryData(result.data);

        yield put({ type: 'initCategories', payload: { categories, listValid: result.data } });
      }

      return Promise.resolve({ data: categories, total: categories.length });
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      history.listen(({ pathname }) => {
        if (pathname.includes('/product') || pathname.includes('/model')) {
          dispatch({
            type: 'handleRequestCategories',
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
