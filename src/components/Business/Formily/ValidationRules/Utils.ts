// eslint-disable-next-line import/no-extraneous-dependencies
import { stringLength } from '@formily/shared';
import { isStr } from '@/utils';

export const getLength = (value: any) =>
  isStr(value) ? stringLength(value) : value ? value.length : 0;

const formatRegExp = /%[sdj%]/g;

export const formatMessage = (message: string, ...args: any[]) => {
  let i = 0;

  /**
   * 当前只支持 %s 作为替换符
   *
   * @see https://github.com/yiminghe/async-validator/blob/304471f5f168b05a3123c97e0fa7542452fe9c8f/src/util.js#L36
   */
  // eslint-disable-next-line no-plusplus
  return String(message).replace(formatRegExp, () => String(args[i++]));
};
