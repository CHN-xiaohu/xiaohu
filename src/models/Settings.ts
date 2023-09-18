/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 全局通用相关
|
*/

import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

import defaultSettings from '../../config/defaultSettings';

type State = {
  setting: typeof defaultSettings;
};

const ModelDefinition = extendBaseModel({
  namespace: 'setting' as 'setting',

  state: {
    setting: {
      ...defaultSettings,
      title: window.injectionGlobalDataSource.name,
      ...window.injectionGlobalDataSource,
    },
  } as State,

  reducers: {
    //
  },

  effects: {
    //
  },
});

export default ModelDefinition;

type GeneralExtensionInheritance<V> = {
  // eslint-disable-next-line no-undef
  setting: GetAssignMethods<V>;
};

declare global {
  interface GlobalModelState {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: typeof ModelDefinition.state;
  }

  // eslint-disable-next-line no-undef
  interface GlobalModelReducers // eslint-disable-next-line no-undef
    extends GeneralExtensionInheritance<typeof ModelDefinition.reducers> {
    //
  }

  // eslint-disable-next-line no-undef
  interface GlobalModelEffects extends GeneralExtensionInheritance<typeof ModelDefinition.effects> {
    //
  }
}
