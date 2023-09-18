/**
 * 整理当前命名空间下的 effects 的 (effect function name) => namespace / effect function name 的形式
 *
 * @example {
 *  namespace: 'user',
 *
 *  effects: {
 *    * login() {
 *      ///
 *    }
 *  }
 * }  ========> { login: 'user/login' }
 *    ========> dispatch 函数调用: dispatch(user.login, payload: { // })
 *
 * @param {string} namespace 命名空间
 * @param {object} methodObj 当前命名空间下的所有副作用集合
 *
 * @returns {object}
 */
export const getCurrentMethods = (namespace: string, methodObj: AnyObject) => {
  const newMethods: any = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const method of Object.keys(methodObj)) {
    newMethods[method] = `${namespace}/${method}`;
  }

  return newMethods;
};

// 获取当前所有需要注入 model 对应的 effect/reducers 的方法集合
export const getAllModelEffectOrReducerMethodsByModel = (
  AppModels: any[],
  type: 'effects' | 'reducers' = 'effects',
) => {
  const allMethods: any = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const model of AppModels) {
    const { namespace } = model;
    allMethods[namespace] = getCurrentMethods(namespace, model[type]);
  }

  return allMethods;
};
