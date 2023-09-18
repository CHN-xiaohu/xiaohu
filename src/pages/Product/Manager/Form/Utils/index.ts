import type { ISchema } from '@formily/antd';

import type { skuCacheManage } from './Specification';

// 生成 sku
export const descarte = (specArray: any[] = []): any[][] =>
  // 从第一组数组开始进行累加遍历
  specArray.reduce(
    (previousTotal, current: any) =>
      // 遍历每一组的数组情况,然后合并累加
      previousTotal
        .map((a: any) => current.map((b: any) => a.concat(b)))
        .reduce((total: any, currentValue: any) => total.concat(currentValue), []),
    [[]],
  );

export const generateGridRowSchemas = <T = any>({
  dataSource,
  generateGridSchema,
  generateChildrenSchema,
  prefix = 'prefix',
  rowLimit = 3,
}: {
  dataSource: T[];
  prefix: string;
  rowLimit?: number;
  generateChildrenSchema: (
    item: T,
    children: Record<string, ISchema>,
    gridIndex: number,
    index: number,
  ) => void;
  generateGridSchema: (index: number) => ISchema;
}) => {
  const properties = {};

  dataSource.forEach((item, index) => {
    const clacCurrentGridIndex = index / rowLimit;

    const currentGridIndex = parseInt(String(clacCurrentGridIndex), 10);

    // 如果是整数
    if (!properties[`${prefix}_${currentGridIndex}`]) {
      properties[`${prefix}_${currentGridIndex}`] = generateGridSchema(currentGridIndex);
    }

    generateChildrenSchema(
      item,
      properties[`${prefix}_${currentGridIndex}`].properties,
      currentGridIndex,
      index,
    );
  });

  return properties;
};

export const miniprogramSpecificationTableFieldValueToProductSpecificationTableFieldValue = (
  value: AnyObject,
) => ({
  factoryPrice: value.salePrice,
  vipPurchasePrice: value.orignPrice,
  minimumSale: value.miniMinimumSale,
  purchasePrice: value.purchasePrice,
});

// 冒泡排序
export const columnsIdsBubbleSort = (skuCacheManageData: typeof skuCacheManage) => {
  const idJoinLengthArr = [...skuCacheManageData.cacheCheckAttributesByIdResultMap.keys()].map(
    (id) => `${id}_${skuCacheManageData.cacheCheckAttributesByIdResultMap.get(id)?.length}`,
  );

  // 冒泡排序
  for (let oneIndex = 0; oneIndex < idJoinLengthArr.length - 1; oneIndex += 1) {
    // 标记是否提前
    let isEarlyTermination = true;

    for (let twoIndex = 0; twoIndex < idJoinLengthArr.length - oneIndex - 1; twoIndex += 1) {
      // 只需要比较前面的就好了，因为后面的都已经是最大了
      const [, previousNumber] = idJoinLengthArr[twoIndex].split('_');
      const [, nextNumber] = idJoinLengthArr[twoIndex + 1].split('_');

      if (previousNumber > nextNumber) {
        // 如果这一轮有前后移位，那么就是尚未终结，还需要继续执行
        isEarlyTermination = false;

        // 利用 js 解构来进行位置交换
        [idJoinLengthArr[twoIndex], idJoinLengthArr[twoIndex + 1]] = [
          idJoinLengthArr[twoIndex + 1],
          idJoinLengthArr[twoIndex],
        ];
      }
    }

    if (isEarlyTermination) {
      break;
    }
  }

  return idJoinLengthArr.map((idStr) => idStr.split('_')[0]);
};

export const getTheMinValueOfFieldByProducts = (fieldName: string, products: AnyObject[]) =>
  products.reduce(
    (prve, current) =>
      parseFloat(prve) < parseFloat(current[fieldName]) ? prve : current[fieldName],
    '10000000000',
  );
