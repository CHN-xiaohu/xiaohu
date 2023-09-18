import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import type { SubscriptionAPI } from 'dva';

import { getCategoriesValid, getTopicDetail } from '../Api';
import { formatCategoryData } from '../../../DisplayCategory/Utils';

const topic = extendBaseModel({
  namespace: 'topic' as 'topic',
  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {
      history.listen(({ pathname }) => {
        if (pathname.split('/')[3] === 'form' && pathname.split('/')[2] === 'topic') {
          dispatch({
            type: 'getCategories',
          });
          dispatch({
            type: 'getTopicDetails',
            payload: {
              id: pathname.split('/')[4],
            },
          });
        }
      });
    },
  },
  state: {
    productCategories: [],
    tempRowProducts: [],
    selectRowProducts: [],
    selectedProductRowKeys: [],
    topicDetail: {},
  },
  effects: {
    *getCategories(_: any, { put }: DvaEffectsCommandMap) {
      const { data } = yield getCategoriesValid();
      const productCategories = formatCategoryData(data);
      yield put({
        type: 'updateState',
        payload: {
          productCategories,
        },
      });
    },
    *getTopicDetails({ payload }: DvaAnyAction, { put }: DvaEffectsCommandMap) {
      console.log('payload.id', payload?.id);
      if (payload?.id) {
        const { data } = yield getTopicDetail(payload.id);
        const selectRowKeys = data.lists.map((item: any) => item.productInfoId);
        data.lists.forEach((item: any) => {
          item.id = item.productInfoId;
        });
        yield put({
          type: 'updateState',
          payload: {
            selectedProductRowKeys: selectRowKeys,
            topicDetail: data,
            selectRowProducts: data.lists,
            tempRowProducts: data.lists,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            selectedProductRowKeys: [],
            topicDetail: {},
            selectRowProducts: [],
            tempRowProducts: [],
          },
        });
      }
    },
  },
});

export default topic;

declare global {
  interface PageModelState {
    // eslint-disable-next-line no-undef
    [topic.namespace]: typeof topic.state;
  }

  interface PageModelReducers {
    // eslint-disable-next-line no-undef
    [topic.namespace]: GetAssignMethods<typeof topic.reducers>;
  }

  interface PageModelEffects {
    // eslint-disable-next-line no-undef
    [topic.namespace]: GetAssignMethods<typeof topic.effects>;
  }
}
