/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 验证工具类
|
*/

import type { Rules, ValidateOption } from 'async-validator';
import AsyncValidator from 'async-validator';

export const createValidator = (rules: Rules) => {
  const validator = new AsyncValidator(rules);

  /**
   * todo: 到时候抽离成多语言文件
   *
   * @see https://github.com/yiminghe/async-validator/blob/e782748f0345b462d84e96a582c0dd38db2de666/src/messages.js
   */
  const cn = {
    required: '%s 必填',

    types: {
      email: '%s 并不是正确格式的 %s',
    },

    string: {
      len: '%s 长度为 %s 位',
      min: '%s 长度最少要 %s 位',
      max: '%s 长度最大要 %s 位',
      range: '%s 长度为 %s ~ %s 位',
    },
  };

  // 挂载语言信息
  (validator as any).messages(cn);

  return validator;
};

// 因为小程序暂时无法实现表单依赖收集，所以先这样 hack 一下
export const runValidatorByInstance = (
  validatorInstance: AsyncValidator,
  source: object,
  options?: ValidateOption,
) =>
  new Promise((resolve, reject) => {
    validatorInstance
      .validate(source, options)
      .then(() => resolve({}))
      .catch((e) => {
        const { fields } = e;

        // todo: 当前只取第一个错误，后面可以根据传入 options 来指定获取多个还是一个
        const formError = {};
        for (const [key, value] of Object.entries(
          fields as Record<string, { message: string }[]>,
        )) {
          formError[key] = value[0].message || '未知错误';
        }

        reject(formError);
      });
  });

// 理由同上, 但是这是传入 rules, 而不是实例好的验证类
// 上面存在的意思是为了减少实例的开销，一开始就实例好验证类，并且储存起来使用
export const runValidator = (source: object, rules: Rules, options?: ValidateOption) =>
  new Promise((resolve, reject) => {
    createValidator(rules).validate(source, options, (_, fields) => {
      // todo: 当前只取第一个错误，后面可以根据传入 options 来指定获取多个还是一个
      const formError = {};
      if (fields) {
        for (const [key, value] of Object.entries(fields)) {
          formError[key] = value[0].message || '未知错误';
        }
      }

      _ ? reject(formError) : resolve();
    });
  });
