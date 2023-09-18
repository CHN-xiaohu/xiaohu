import { strRandom } from '@/utils';

import type { SearchFromProps } from './index';

export const deliveryInfo = (handleChangeCascader: any) => [
  {
    customerName: {
      title: '收货姓名',
      col: 11,
      type: 'string',
      'x-component-props': {
        placeholder: '请输入收货人姓名',
      },
      'x-props': {},
      'x-rules': [
        {
          range: [0, 20],
          message: '收货姓名不能超过20个字符',
        },
        {
          notEmpty: true,
          message: '收货姓名不能为空字符',
        },
        {
          required: true,
          message: '请输入收货人姓名',
        },
      ],
    },
    customerPhone: {
      title: '手机号',
      col: 11,
      type: 'string',
      'x-component-props': {
        placeholder: '请输入手机号',
      },
      'x-rules': [
        {
          required: true,
          message: '手机号不能为空',
        },
        {
          pattern: /^1[3456789]\d{9}$/,
          message: '请输入正确的手机号',
        },
      ],
    },
  },
  {
    place: {
      title: '收货地址',
      col: 9,
      type: 'area',
      'x-component-props': {
        onChange: handleChangeCascader,
        showAreaLevel: 3,
        placeholder: '请选择省市区',
        isUseCode: true,
      },
      'x-props': {
        labelCol: 5,
        wrapperCol: 19,
      },
      'x-rules': [
        {
          required: true,
          message: '收货地址不能为空',
        },
      ],
    },
    address: {
      type: 'string',
      col: 10,
      'x-component-props': {
        placeholder: '请输入详细地址',
        className: 'not-antd-form-item__colon',
      },
      'x-rules': [
        {
          required: true,
          message: '详细地址不能为空',
        },
      ],
    },
  },
];

const calcGridCol = (items: SearchFromProps['items'], maxItem: number) => {
  const { cols } = Object.keys(items).reduce(
    (previous, key) => {
      const currentNode = items[key];

      let currentCol = Math.floor(24 / maxItem);
      if (currentNode.col) {
        currentCol = currentNode.col;

        // delete currentNode.col;
      }

      const sun = previous.sun + currentCol;

      if (sun <= 24) {
        previous.cols.push(currentCol);
        previous.sun = sun;
      }

      return previous;
    },
    { sun: 0, cols: [] as number[] },
  );

  return cols;
};

export const formatGridLayoutSchema = (items: SearchFromProps['items'], minItem?: number) => {
  const newSchema = {};

  // 最大项
  let maxItemNumber = Object.keys(items).reduce((previousValue, index) => {
    const itemNumber = Object.keys(items[index]).filter((k) => !k.includes('_inner_empty')).length;

    return previousValue > itemNumber ? previousValue : itemNumber;
  }, 0);

  if (minItem && maxItemNumber < minItem) {
    maxItemNumber = minItem;
  }

  items.forEach((item, i) => {
    const keys = Object.keys(item);
    let keysNumber = keys.length;

    // 判断最后一项 schema 有没有配置 col
    if (maxItemNumber > keysNumber) {
      [...Array(maxItemNumber - keysNumber)].forEach(() => {
        keysNumber += 1;
        keys.push('');

        item[`${strRandom(6)}_inner_empty`] = {
          type: 'emptyPlaceholder',
        };
      });
    }

    const cols = calcGridCol(item as any, maxItemNumber);

    newSchema[`formItemGrid${i}`] = {
      'x-component': 'grid',
      'x-component-props': {
        gutter: 24,
        cols: cols.filter((col) => col > 0),
      },
      properties: item,
    };
  });

  return newSchema;
};
