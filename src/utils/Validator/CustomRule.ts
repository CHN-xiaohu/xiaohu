/* eslint-disable @typescript-eslint/no-unused-vars */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 基于 async-validator 的自定义校验
|
*/

import type { Rules, ValidateSource, ValidateOption } from 'async-validator';

import { idCard, alphaNum } from './Rules';

export const idCardRule = (message?: string, sourceData?: any) => ({
  validator(
    rule: Rules,
    value: any,
    callback: Function,
    source: ValidateSource,
    options: ValidateOption,
  ) {
    return idCard(value) ? callback() : callback(new Error(message || '手机号码格式不正确'));
  },
});

export const alphaNumRule = (message?: string, sourceData?: any) => ({
  validator(rule: Rules, value: any, callback: Function) {
    return alphaNum(value)
      ? callback()
      : callback(new Error(message || `${rule.field} 段必须是完全是字母、数字`));
  },
});

export const wxAppIdRule = () => ({
  validator(rule: Rules, value: any, callback: Function) {
    return /^[wx][A-Za-z0-9]{3,60}$/.test(value) ? callback() : callback(new Error('appid 不正确'));
  },
});
