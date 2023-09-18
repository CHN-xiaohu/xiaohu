/* eslint-disable no-param-reassign */
/**
 * 电商价格计算
 *
 * @description 当前需求：当余数超过了 [分] 之后，那么就需要向上给最后的 [分] +1
 *
 * @param {number} num
 * @returns {number}
 */
export const ECommerceCommodityPriceCalculation = (num: number | string) => {
  /**
   * @description 当前需求：当余数超过了 [分] 之后，那么就需要向上给最后的 [分] +1
   */
  const numStr = `${num}`;
  // 判断是否有余数
  if (numStr.includes('.')) {
    const numStrArr = numStr.split('.');

    // 判断余数是否超过了 [分]
    if (numStrArr[1].length > 2) {
      // 如果超过了，那么就向上给最后的 [分] +1
      numStrArr[1] = numStrArr[1].slice(0, 2);
      numStrArr[1] = (parseInt(numStrArr[1], 10) + 1).toString();

      // 这里需要处理一下当 [角] 为 0 的情况，因为它会被 parseInt 转化的时候给去掉了，这里需要给它补上
      if (numStrArr[1].length === 1) {
        numStrArr[1] = `0${numStrArr[1]}`;
      }

      // eslint-disable-next-line no-param-reassign
      num = parseFloat(numStrArr.join('.'));
    }
  }

  return num as number;
};

/**
 * 获取小数点的位数
 */
export const getDecimalPointLength = (value: any) => {
  const valueStr = `${value}`;

  if (!valueStr || !valueStr.includes('.')) {
    return 0;
  }

  const [, len] = valueStr.split('.');

  return len.length;
};

// 移动小数点位置
export const movingDecimalPosition = (value: any, length: number) => {
  value = `${value}`;
  if (!value || !value.includes('.')) {
    return Number.isNaN(value) ? Number(value) : 0;
  }

  const valueSplit = value.split('.');
  if (!valueSplit[1]) {
    return value;
  }

  const laseString = valueSplit[1].substr(0, length);

  const joinValue =
    valueSplit[0] === '0'
      ? [laseString, valueSplit[1].substr(length, length)]
      : [valueSplit[0], laseString];

  // eslint-disable-next-line no-nested-ternary
  return joinValue[1]
    ? parseFloat(joinValue.join('.'))
    : Number.isNaN(joinValue[0])
    ? Number(joinValue[0])
    : 0;
};

/**
 * 原样地截取小数点的指定位数, 不会像 toFixed、floor 会向上、向下得取整
 *
 * @example 12.23456 => subDecimal(12.23456, 2) => 12.23
 *
 * @param {any} value
 * @param {number} length
 */
export const subDecimal = (value: number | string, length: number) => {
  value = String(value);

  if (!value || !value.includes('.')) {
    // eslint-disable-next-line use-isnan
    return Number.isNaN(Number(value)) ? Number(value) : 0;
  }

  const valueSplit = value.split('.');
  valueSplit[1] = valueSplit[1].substr(0, length);

  return parseFloat(valueSplit.join('.'));
};

// 计算返佣金额, 单位： 分
export const calcCommissionRateAmountToPoints = (
  price: string | number,
  rate: string | number,
  distributionConsumerFee: string | number,
) => {
  // 获取商家分佣比例，最多 4 位小数
  rate = subDecimal(parseFloat(String(rate)), 4);
  // 获取消费者比例，最多 4 位小数
  distributionConsumerFee = subDecimal(parseFloat(String(distributionConsumerFee)), 4);
  // 再计算价格，这里要把比例 / 100，因为价钱的计算是需要 * 比例的百分比
  // 先 * 商家分佣，然后向上取余
  const currentPrice = ECommerceCommodityPriceCalculation(parseFloat(String(price)) * rate);

  return subDecimal(currentPrice * distributionConsumerFee, 2);
};
