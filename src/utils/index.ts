/* eslint-disable no-useless-escape */
import ReactDOM from 'react-dom';
import FileSaver from 'file-saver';
import { random, debounce } from 'lodash';
import { MathCalcul } from '@/foundations/Support/Math';

export * from './string';

/**
 * 自身属性中是否具有指定的属性（也就是是否有指定的键）
 */
export const hasOwnProperty = (obj: AnyObject, property: string) =>
  Object.prototype.hasOwnProperty.call(obj, property);

// eslint-disable-next-line max-len
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

/**
 * 判断是否是指定 js 数据类型
 *
 * @param {string} type 数据类型
 * @param {any} value 需要判断的值
 *
 * @returns {boolean}
 */
export const isType = <T>(type: string) => (value: any): value is T =>
  value != null && Object.prototype.toString.call(value) === `[object ${type}]`;

export const isFn = isType<(...args: any[]) => any>('Function');

export const isArr = Array.isArray || isType<unknown[]>('Array');

export const isObj = isType<object>('Object');

export const isStr = isType<string>('String');

export const isNum = isType<number>('Number');

export const isBool = isType<number>('Boolean');

export const isNotEmptyObj = (obj: any) => isObj(obj) && !!Object.keys(obj).length;

export const compose = (...args: any[]) => (payload: any, ...extra: any[]) =>
  args.reduce(
    (buf, fn) => (buf !== undefined ? fn(buf, ...extra) : fn(payload, ...extra)),
    payload,
  );

/**
 * 生成随机字符串
 *
 * @param {string} len 字符长度
 * @param {string} type 生成的类型
 *
 * @returns {string}
 */
export const strRandom = (len = 16, type: 'string' | 'number' | 'all' = 'all') => {
  const number = '0123456789';
  // todo: 去掉了某些特殊的字符, 后面可以参考加上
  const letter = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let chars = '';
  switch (type) {
    case 'number':
      chars = number;
      break;
    case 'string':
      chars = letter;
      break;
    default:
      chars = letter + number;
      break;
  }

  let strValue = '';
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < len; index++) {
    strValue += chars[random(0, chars.length - 1)];
  }

  return strValue;
};

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// 判断是否为空
export const isEmpty = (value: any) => value === null || value === undefined;

export const notEmpty = (value: any) => !isEmpty(value);

export const createReactDomContainer = (id: string) => {
  // 当前只允许开启一个资源管理面板
  const containerNode = document.querySelector(`#${id}`);
  if (containerNode) {
    return containerNode;
  }

  const containerEl = document.createElement('div');
  containerEl.id = id;
  document.body.appendChild(containerEl);

  return containerEl;
};

export const createReactDOM = <T = any>(element: React.ReactElement<T>, container?: Element) => {
  let containerNode = container;

  if (!containerNode) {
    containerNode = document.createElement('div');
    document.body.appendChild(containerNode);
  }

  ReactDOM.render(element, containerNode);
};

let clickCount = 0;
export const doubleClickWarpper = (...args: (() => void)[]) => {
  clickCount += 1;

  debounce(() => {
    if (clickCount >= 2 && args.length === 2) {
      // 双击事件
      args[1]();
    } else if (clickCount === 1) {
      // 单击事件
      args[0]();
    }

    clickCount = 0;
  }, 200)();
};

export const cancellablePromise = (promise: Promise<any>) => {
  let isCanceled = false;

  const wrappedPromise = () =>
    new Promise((resolve, reject) => {
      promise.then(
        // eslint-disable-next-line prefer-promise-reject-errors
        (value) => (isCanceled ? reject({ isCanceled, value }) : resolve(value)),
        // eslint-disable-next-line prefer-promise-reject-errors
        (error) => reject({ isCanceled, error }),
      );
    });

  const cancel = () => {
    isCanceled = true;

    return isCanceled;
  };

  return {
    promise: wrappedPromise,
    cancel,
  };
};

/**
 * 安全的JSON.parse
 */
export const safeJsonParse = (data: any = '', def?: any) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return def || data;
  }
};

export const download = (src: string, name?: string) => {
  const srcSplit = src.split('/');

  let fileName = srcSplit[srcSplit.length - 1];

  if (name) {
    const extSplit = fileName.split('.');

    fileName = `${name}.${extSplit[extSplit.length - 1]}`;
  }

  FileSaver.saveAs(src, fileName);
};

export const cloneDeepByJSON = (value: object) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    //
  }

  return Object.create({});
};

export const convertToChinese = (num: number) => {
  if (isEmpty(num)) {
    return '零';
  }

  const chineseMaps = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  const result = [];
  const num2str = num.toString();

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < num2str.length; index++) {
    const key = num2str.charAt(index);

    result.push(chineseMaps[key]);
  }

  return result.join('');
};

export const convertNumberToChinese = (money: string) => {
  const cns = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const cnUnits = ['', '拾', '佰', '仟', '万', '亿', '兆']; // 基本单位
  const cnDecUnits = ['角', '分', '毫', '厘']; // 小数后的单位
  const cnIntegerYuan = '元';

  if (!money) {
    return cns[0] + cnIntegerYuan;
  }

  let cnMoney = '';
  let decimalMoney = '';
  const [integer, decimal] = money.split('.');

  for (let i = 0; i < integer.length; i += 1) {
    cnMoney += cns[Number(integer[i])];
  }

  cnMoney = cnMoney
    .split('')
    .reverse()
    .map((str, index) => (str === cns[0] ? undefined : str + cnUnits[index]))
    .filter(Boolean)
    .reverse()
    .join('');

  cnMoney += cnIntegerYuan;

  // 处理小数
  if (decimal) {
    for (let i = 0; i < decimal.length; i += 1) {
      decimalMoney += cns[Number(decimal[i])];
    }

    decimalMoney = decimalMoney
      .split('')
      .map((str, index) => (str === cns[0] ? undefined : str + cnDecUnits[index]))
      .filter(Boolean)
      .join('');
  }

  cnMoney += decimalMoney || '整';

  return cnMoney;
};

export const objectToArray = <T = any>(obj: Record<string, T>) =>
  Object.keys(obj).map((k) => obj[k]);

export const getArrayLastItem = <T = any>(arr: T[], def?: T) => arr[arr.length - 1] || def;

export const composeNewObjectFromDataSourceByFields = (dataSource: object, fields: string[]) =>
  fields.reduce((obj, k) => {
    obj[k] = dataSource[k];

    return obj;
  }, {} as object);

export const transformToSelectOptions = (values: object) =>
  Object.keys(values).map((value) => ({ label: values[value], value }));

// 将数值转化为分为单位的数值
export const transformToPenny = (value: string | number) =>
  new MathCalcul(value).multipliedBy(100).toNumber();

// 将以分为单位的数值转化为带小数的形式
export const transformPennyToDecimal = (value: string | number) =>
  new MathCalcul(value).dividedBy(100).toFixed(2);

export const isCnCharacter = (str: string) => /[\u4E00-\u9FA5\uFE30-\uFFA0]/.test(str);

export const getContentContainerHeight = () => {
  const node = document.querySelector('#globalHeader');
  if (!node) {
    return 0;
  }

  return window.innerHeight - node.clientHeight - 48;
};

/**
 *  多选
 * @param selected 是否选中
 * @param selectedRows
 * @param changeRows 选中的数组
 * @param tempRowProducts 产品数据
 */
export const handleSelectionArray = (
  selected: any,
  selectedRows: any,
  changeRows: any[],
  tempRowProducts: any[],
  IdType: string,
) => {
  let newTempRowProducts: any[] = tempRowProducts;
  const realChangeRows = changeRows.filter(Boolean);

  tempRowProducts.map((items) => ({ id: items.thirdCategoryId, ...items }));

  if (selected) {
    // 去重
    const result = newTempRowProducts.concat(realChangeRows).reduce((prev, current) => {
      if (!prev[current[IdType]]) {
        prev[current[IdType]] = current;
      }

      return prev;
    }, {});

    newTempRowProducts = Object.values(result);
  } else {
    const filterIds = realChangeRows.map((item) => item[IdType]) as string[];
    newTempRowProducts = newTempRowProducts.filter((item) => !filterIds.includes(item[IdType]));
  }
  return newTempRowProducts;
};

/**
 * @param text 字符串
 * @param code 符号
 * 截取指定字符串后面的所有字符
 */
export const handleSubstringTextAfter = (text: any, code: any) => {
  return text.substring(text.lastIndexOf(`${code}`) + 1, text.length);
};

/**
 * @param text 字符串
 * @param code 符号
 * 截取指定字符串前面的所有字符
 */
export const handleSubstringTextBefore = (text: any, code: any) => {
  return text.substring(0, text.lastIndexOf(`${code}`));
};
