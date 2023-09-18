import { isStr } from '@/utils';

/**
 * @ref https://github.com/alibaba/formily/blob/master/packages/shared/src/string.ts
 */

// ansiRegex
const ansiRegex = () => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))',
  ].join('|');

  return new RegExp(pattern, 'g');
};

// astralRegex
const regex = '[\uD800-\uDBFF][\uDC00-\uDFFF]';

const astralRegex = (opts?: { exact: boolean }) =>
  opts?.exact ? new RegExp(`^${regex}$`) : new RegExp(regex, 'g');

// stripAnsi
const stripAnsi = <T extends any>(input: T) =>
  typeof input === 'string' ? input.replace(ansiRegex(), '') : input;

export const stringLength = (input: string) => stripAnsi(input).replace(astralRegex(), ' ').length;

export const getLength = (value: any) =>
  isStr(value) ? stringLength(value) : value ? value.length : 0;
