import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

const News = extendBaseModel({
  namespace: 'news' as 'news',

  subscriptions: {},

  state: {
    merchantList: [],
    selectedProductRowKeys: [],
  },

  effects: {},
  reducers: {},
});

export default News;

declare global {
  interface PageModelState {
    // eslint-disable-next-line no-undef
    [News.namespace]: typeof News.state;
  }

  interface PageModelReducers {
    // eslint-disable-next-line no-undef
    [News.namespace]: GetAssignMethods<typeof News.reducers>;
  }

  interface PageModelEffects {
    // eslint-disable-next-line no-undef
    [News.namespace]: GetAssignMethods<typeof News.effects>;
  }
}
