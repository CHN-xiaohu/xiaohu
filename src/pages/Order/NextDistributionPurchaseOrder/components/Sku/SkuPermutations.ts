/**
 * 参考以及部分代码来源
 *
 * @ref https://github.com/accforgit/sku-manager
 * @ref https://github.com/accforgit/blog-data/tree/master/%E7%94%B5%E5%95%86sku%E7%BB%84%E5%90%88%E7%8A%B6%E6%80%81%E6%9F%A5%E8%AF%A2
 */

import type { ISkuProps as SkuProps, TSkuListItem } from './index';

/**
 * 构造返回指定长度的数组
 * @param len 数组的长度
 * @param fill 数组每一项的填充值，默认填充 index的值
 */
function getArrByLen(len: number, fill?: any): any[] {
  if (len === 0) return [];
  return `${Array(len)}`.split(',').map((v, k) => fill || k);
}

/**
 * 将所给定的数组填充到给定的长度
 * @param arr 需要填充的数组
 * @param length 需要填充的长度
 * @param fill 新增填充的项的填充值
 */
function completeArr(arr: any[], length: number, fill: any): any[] {
  return arr.concat(getArrByLen(length, fill));
}

/**
 * 给定 mArr长度个数组，从这些数组中取 n 个项，每个数组最多取一项，求所有的可能集合，其中，mArr的每个项的值代表这个数组的长度
 * 例如 composeMArrN(([1, 2, 3], 2))，表示给定了 3 个数组，第一个数组长度为 1，第二个数组长度为 2，第二个数组长度为 3，从这三个数组任意取两个数
 * example： composeMArrN(([1, 2, 3], 2))，返回：
 * [[0,0,-1],[0,1,-1],[0,-1,0],[0,-1,1],[0,-1,2],[-1,0,0],[-1,0,1],[-1,0,2],[-1,1,0],[-1,1,1],[-1,1,2]]
 * 返回的数组长度为 11，表示有1 种取法，数组中每个子数组就是一个取值组合，子数组中的数据项就表示取值的规则
 * 例如，对于上述结果的第一个子数组 [0, 0, -1] 来说，表示第一种取法是 取第一个数组下标为 0 和 第二个数组下标为 0 的数，下标为 2 的数组项值为 -1 表示第三个数组不取任何数
 * @param mArr 数据源信息
 * @param n 取数的个数
 * @param arr 递归使用，外部调用不需要传此项
 * @param hasSelectedArr 递归使用，外部调用不需要传此项
 * @param rootArr 递归使用，外部调用不需要传此项
 */
function composeMArrN(
  mArr: number[],
  n: number,
  arr: number[] = [],
  hasSelectedArr: number[] = [],
  rootArr: number[][] = [],
): number[][] | any[] {
  if (!n || n < 1 || mArr.length < n) {
    return arr;
  }
  for (let i = 0; i < mArr.length; i += 1) {
    // 当前层级已经存在选中项了
    if (hasSelectedArr.indexOf(i) !== -1) continue;
    // eslint-disable-next-line no-param-reassign
    hasSelectedArr = hasSelectedArr.slice();
    hasSelectedArr.push(i);
    for (let j = 0; j < mArr[i]; j += 1) {
      let arr1: number[] = completeArr(arr, i - arr.length, -1);
      arr1.push(j);
      if (n === 1) {
        arr1 = completeArr(arr1, mArr.length - arr1.length, -1);
        rootArr.push(arr1);
      } else {
        composeMArrN(mArr, n - 1, arr1, hasSelectedArr, rootArr);
      }
    }
  }
  return rootArr;
}

/**
 * 从 m 个数字中取 n 个，所有可能的取法（不考虑顺序）
 * @param m 数据总数
 * @param n 取数个数
 * @param arr 递归使用，外部调用不需要传此项
 * @param hasSelectedArr 递归使用，外部调用不需要传此项
 * @param rootArr 递归使用，外部调用不需要传此项
 */
function composeMN(
  m: number,
  n: number,
  arr: number[] = [],
  hasSelectedArr: number[] = [],
  rootArr: number[][] = [],
): number[][] {
  for (let i = 0; i < m; i += 1) {
    if (hasSelectedArr.indexOf(i) !== -1) continue;
    // eslint-disable-next-line no-param-reassign
    hasSelectedArr = hasSelectedArr.slice();
    hasSelectedArr.push(i);
    const arr1 = arr.slice();
    arr1.push(i);
    if (n !== 1) {
      composeMN(m, n - 1, arr1, hasSelectedArr, rootArr);
    } else {
      rootArr.push(arr1);
    }
  }
  return rootArr;
}

/**
 * 求数组交集，每个数组的数据项只能是数字，并且每个数组都要是排好序的，算法优化的需要
 * @param params 需要求交集的数组，例如 intersectionSortArr([2, 3, 7, 8], [3, 7, 9, 12, 18, 20], [7, 16, 18])
 */
function intersectionSortArr(...params: number[][]): number[] {
  if (!params || params.length === 0) return [];
  if (params.length === 1) {
    return params[0];
  }
  const arr1 = params[0];
  const arr2 = params[1];
  if (params.length > 2) {
    return intersectionSortArr(arr1, intersectionSortArr(arr2, ...params.slice(2)));
  }
  const arr: number[] = [];
  if (!arr1.length || !arr2.length || arr1[0] > arr2.slice(-1)[0] || arr2[0] > arr1.slice(-1)[0]) {
    return arr;
  }
  let j = 0 as number;
  let k = 0 as number;
  const arr1Len = arr1.length;
  const arr2Len = arr2.length;
  while (j < arr1Len && k < arr2Len) {
    if (arr1[j] < arr2[k]) {
      j += 1;
    } else if (arr1[j] > arr2[k]) {
      k += 1;
    } else {
      arr.push(arr1[j]);
      j += 1;
      k += 1;
    }
  }
  return arr;
}

export class SkuPermutations {
  skuTreeAssembleMap = {} as Record<string, Record<string, TSkuListItem>>;
  // 在 list 中，所有包含 sku 每一商品属性（例如黑色）的数据项的下标的集合
  // 例如：{ 规格属性 id: [0, 1, 2, 3, 4, 5] ==> 含有该规格属性 id 的 sku 项在 sku 数组中的数组索引集合 }
  keyRankMap = {} as Record<string, number[]>;

  // TODO: 优化，可以提前计算无论怎么选，都是没有库存的规格属性
  emptySkuMap = [] as string[];

  constructor(dataSource: SkuProps['dataSource']) {
    this.init(dataSource);
  }

  init(dataSource: SkuProps['dataSource']) {
    const { tree: skuTree = [], list: skuDataSource = [] } = dataSource || {};

    // 提前猜解组合每一个 sku attr 的 sku 项
    const indexKeyInfoMap = {} as Record<string, Record<string, any>>;
    const mLens = skuTree.map((item) => item.v.length)!;

    const getKeyRankMap = {};

    for (let i = 0; i < skuTree.length; i += 1) {
      skuTree[i].v.forEach((vItem) => {
        const kIndex = [] as number[];
        dataSource?.list.forEach((dataItem, listIndex) => {
          if (dataItem.sku_value_map.includes(vItem.id)) {
            kIndex.push(listIndex);
          }
          getKeyRankMap[vItem.id] = kIndex;
        });
      });
    }

    this.keyRankMap = getKeyRankMap;

    for (let i = 0; i < skuTree.length; i += 1) {
      indexKeyInfoMap[i] = {};

      const caseCom = composeMArrN(mLens, i + 1).map((item: any[]) => {
        return item.reduce((previous, current, idx) => {
          if (current >= 0) {
            previous.push(skuTree[idx].v[current].id);
          }

          return previous;
        }, []);
      });

      caseCom.forEach((skuIds: string[]) => {
        const skuIdsToStr = skuIds.join('_');

        let stock_num = 0 as any;
        // 获取库存为0的交集的下标
        const skuItemIndexs = intersectionSortArr(
          ...skuIds.reduce((p, c) => [...p, this.keyRankMap[c]], [] as number[][]),
        );

        skuItemIndexs.forEach((skuItemIndex) => {
          stock_num += skuDataSource![skuItemIndex]?.stock_num;
        });

        indexKeyInfoMap[i][skuIdsToStr] = {
          stock_num,
        };
      });
    }

    this.skuTreeAssembleMap = indexKeyInfoMap;

    // 如果存在有没有库存的 sku, 那么就触发一次第一项组合中，没有库存的规格属性 id (因为猜解的每一项组合所对应的库存值都是其组合 key 存在的 sku 项的库存累计)
    if (skuDataSource.some((item) => !item.stock_num)) {
      this.emptySkuMap = this.computeEmptyInfo(0);
    }
  }

  /**
   * 当前选择状态下，再次选择时，库存为 0 的 sku属性，返回值例如：['20_201']
   * @param arrKeyCount 选中了几个sku属性
   * @param activeSkuAttributeIdsToStr 已经选中的sku属性，例如：'10_100'
   */
  computeEmptyInfo(arrKeyCount: number, activeSkuAttributeIdsToStr: string = '') {
    let nextEmptyKV: string[] = [];
    if (arrKeyCount === 0) {
      // 只选择了一个
      return Object.keys(this.skuTreeAssembleMap[0]).filter(
        (item) => this.skuTreeAssembleMap[0][item].stock_num === 0,
      );
    }

    if (arrKeyCount >= Object.keys(this.skuTreeAssembleMap).length) {
      // 选择了全部 sku 属性
      return nextEmptyKV;
    }

    const nextKeyMap = this.skuTreeAssembleMap[arrKeyCount];
    const activeSkuAttributeIds = activeSkuAttributeIdsToStr.split('_');
    const activeSkuAttributeIdsLen = activeSkuAttributeIds.length;
    const nextEmptyKeyArr: string[] = [];

    // 从排序组合中，找到可能存在的 sku 组件，然后判断是否有无库存
    // 有就跳过，没有就拿出来
    for (const [skuAttributeIdsToStr, skuItem] of Object.entries(nextKeyMap)) {
      if (skuItem.stock_num !== 0) {
        continue;
      }

      let i = 0;
      const itemArr: string[] = skuAttributeIdsToStr.split('_');
      itemArr.forEach((v) => {
        if (v === activeSkuAttributeIds[i]) i += 1;
      });

      if (i === activeSkuAttributeIdsLen) {
        nextEmptyKeyArr.push(skuAttributeIdsToStr);
      }
    }

    if (nextEmptyKeyArr.length) {
      nextEmptyKV = [
        ...new Set(
          nextEmptyKeyArr.map((item) => {
            // 删掉当前已经选中的，剩下的一个就是应该置灰的
            activeSkuAttributeIds.forEach((v) => {
              // eslint-disable-next-line no-param-reassign
              item = item.replace(v, '');
            });

            return item.replace(/_/g, '');
          }),
        ),
      ];
    }

    return nextEmptyKV;
  }

  executeBySelected(selectedSkuAttributeIds: React.Key[]) {
    // 取得当前条件对应的库存和价格

    const currentRst =
      selectedSkuAttributeIds?.length > 0
        ? this.skuTreeAssembleMap[selectedSkuAttributeIds?.length - 1][
            selectedSkuAttributeIds?.join('_')
          ]
        : [];
    // 需要置灰的 sku属性
    let nextEmptyKV: string[] = [];

    // 取得置灰的属性信息
    for (let i = 0; i < selectedSkuAttributeIds.length; i += 1) {
      const currentList = composeMN(selectedSkuAttributeIds.length, i + 1);
      nextEmptyKV = nextEmptyKV.concat(
        currentList.reduce((t, item) => {
          const currentSkuAttributeIdsToStr = item.map((k) => selectedSkuAttributeIds[k]).join('_');

          return t.concat(this.computeEmptyInfo(item.length, currentSkuAttributeIdsToStr));
        }, [] as string[]),
      );
    }

    return {
      currentRst,
      // 应该置为灰色不可点击状态的按钮，需要加上当任何属性不选择是库存为 0 的属性
      nextEmptyKV: [...new Set(nextEmptyKV.concat(this.emptySkuMap))],
    };
  }
}
