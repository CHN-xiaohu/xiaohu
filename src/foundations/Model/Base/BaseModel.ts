import modelExtend from 'dva-model-extend';
import type { AnyAction } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { EffectsCommandMap } from 'dva';

import { getCurrentMethods } from './Utils';

export type EffectAction = AnyAction;
export type EffectEffects<S = any> = EffectsCommandMap & {
  select: <T>(func: (state: S) => T) => T;
};

export type Effect = (action: EffectAction, effects: EffectEffects) => void;

/**
 * 基础 model
 */
const BaseModel = {
  namespace: 'base',

  state: {},

  reducers: {
    updateState(state: any, props: any = {}) {
      return {
        ...state,
        ...(props.payload || props), // 兼容两种传参形式，一种是放置在 { payload: any }; 另一种是直接传参： { id: xx, name: atzcl }
      };
    },
  },

  effects: {
    //
  },
};

/**
 * 继承型
 */
const extend = <A, B>(acc: A, extendModel: B): A & B => modelExtend(acc, extendModel);

/**
 * 继承基础型
 *
 * @param {Model} ModelDefinition 需要继承的模型
 */
const extendBaseModel = <M>(ModelDefinition: M) => {
  const extendModel = extend(BaseModel, ModelDefinition);

  /**
   * 挂载当前注入模型的 effects、reducers 所有方法集合原始值，供实际代码使用
   */
  window.$modelEffectsAndReducers = {
    ...(window.$modelEffectsAndReducers || {}),
    [extendModel.namespace]: getCurrentMethods(extendModel.namespace, {
      ...extendModel.effects,
      ...extendModel.reducers,
    }),
  };

  return extendModel;
};

export { extend, BaseModel, extendBaseModel };
