import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';
import { getCategoriesByValid } from '@/pages/Product/Api';
import { formatCategoryData } from '@/pages/Product/Utils';

import type { SubscriptionAPI } from 'dva';

import { TemplateSelectTree } from '../Constant';
import { resetForm as resetAllform } from '../UpdatePage';
// import * as api from '@/pages/Programa/Api'

const ModelDefinition = extendBaseModel({
  namespace: 'programa' as 'programa',

  state: {
    templateCode: '',
    type: 'ADVERT_TEMPLATE',
    showProduction: false,
    showCategory: false,
    showColumnsPic: true,
    previewList: [{}],
    selectRowProducts: [],
    selectRowCategories: [],
    column: undefined,
    categoriesTree: [],
    currentTemplateTree: TemplateSelectTree.ADVERT_TEMPLATE,
    categoriesList: [],
    selectedProductRowKeys: [],
    selectedCategoryRowKeys: [],
    prevSelectedProductRowKeys: [],
    prevSelectedCategoriesRowKeys: [],
    tempRowProducts: [],
    tempSelectedRowCategories: [],
    originCategoryList: [],
    picUrl: '',
  },

  reducers: {},

  effects: {
    *getCategoriesList(_: any, { put }: DvaEffectsCommandMap) {
      const { data } = yield getCategoriesByValid();
      const categoriesList = formatCategoryData(data);
      yield put({
        type: 'updateState',
        payload: {
          categoriesList,
        },
      });
    },
    *getCategoriesTree(__: never, { put, call, select }: DvaAnyAction) {
      const { categoriesTree } = yield select((_: any) => _.programa);
      if (!categoriesTree.length) {
        const { data } = yield call(getCategoriesByValid);
        const categories = formatCategoryData(data);
        yield put({
          type: 'updateState',
          payload: {
            categoriesTree: categories,
            originCategoryList: data,
          },
        });
      }
    },
    *resetForm(_: never, { put }: DvaAnyAction) {
      yield put({
        type: 'updateState',
        payload: {
          templateCode: '',
          type: 'ADVERT_TEMPLATE',
          showProduction: false,
          showCategory: false,
          showColumnsPic: true,
          previewList: [{}],
          selectRowProducts: [],
          selectRowCategories: [],
          column: undefined,
          currentTemplateTree: TemplateSelectTree.ADVERT_TEMPLATE,
          categoriesList: [],
          selectedProductRowKeys: [],
          selectedCategoryRowKeys: [],
          prevSelectedProductRowKeys: [],
          prevSelectedCategoriesRowKeys: [],
          picUrl: '',
        },
      });
      resetAllform();
    },
  },
  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      history.listen(({ pathname }: any) => {
        if (pathname.includes('/programa')) {
          dispatch({
            type: 'getCategoriesList',
          });
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
