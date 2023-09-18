/* eslint-disable import/no-extraneous-dependencies */
import type { ValidateDescription, ValidateResponse } from '@formily/validator';
import FormilyFormats from '@formily/validator/lib/formats';

import { isStr, isArr } from '@/utils';

import { phone } from '@/utils/Validator/Rules';

import { getLength, formatMessage } from './Utils';

type ValidateRules = Record<
  string,
  (value: any, rule: ValidateDescription) => ValidateResponse | Promise<ValidateResponse>
>;

declare global {
  interface GlobalFormSchemaRules {
    range?: number[];
    checkUrl?: boolean;
    phone?: boolean;
    notEmpty?: boolean;
    versionNumber?: boolean;
    chineCharOrNumberOrABCAndLength?: number[];
  }
}

export default {
  range: (value: any, rule) => {
    const length = getLength(value);

    const { range = [100000] } = rule;

    if (!Array.isArray(range)) {
      return 'range rule 数据不正确';
    }

    return length >= range[0] && length <= range[1]
      ? true
      : formatMessage(rule.message || '输入的数据需要在 %s ~ %s 字符之间', ...range);
  },

  checkUrl: (value: any, rule) => {
    const result = value ? FormilyFormats.url.test(value) : true;

    return result || formatMessage(rule.message || '请输入正确格式的 url');
  },

  notEmpty: (value: any, rule) => {
    let result = value !== undefined || value !== null;

    if (isArr(value)) {
      result = !!value.length;
    } else if (isStr(value)) {
      result = !!value.trim().length;
    }

    return (
      result ||
      formatMessage(
        isStr(rule.notEmpty) ? rule.notEmpty : rule.message || '该字段不能为单纯的空字符',
      )
    );
  },

  phone: (value: any, rule) => {
    const result = value ? phone(value) : true;

    return result || formatMessage(rule.message || '手机号码格式不正确');
  },

  // 版本号格式必须为 X.Y.Z
  versionNumber: (value: any, rule) => {
    const result = value ? /^\d+(?:\.\d+){2}$/.test(value) : true;

    return result || formatMessage(rule.message || '版本号格式不正确');
  },

  // 检测 中文、数字、字母，并且字符长度在合法的区间内
  chineCharOrNumberOrABCAndLength: (value: any, rule) => {
    const { range = [100000] } = rule;

    let result = /^(?:[A-Za-z0-9-\u4e00-\u9fa5]+)$/.test(value);

    if (result) {
      const length = getLength(value);

      result = length > range[0] && length < (range[1] || range[0]);
    }

    return result || formatMessage(rule.message || '版本号格式不正确');
  },
} as ValidateRules;
