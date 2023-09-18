/**
 * {key: value} -> 树状结构
 * @param enums
 */
export const enumToTree = (enums: Record<string, any>) =>
  Object.keys(enums).map((key) => ({
    label: enums[key],
    value: key,
    title: enums[key],
  }));

type TreeType = {
  parentId: string;
  id: string;
  grade: number;
};

/**
 * 由于接口数据是只有最末端的三级数据，而 cascader 组件是以数组形式寻值的，所以得手动拼接
 * @param {array} tree 接口的 lists 数据源
 */
export const generateCategoriesParentTree = (tree: any[], targetId: string) => {
  if (!tree.length) {
    return undefined;
  }
  const target = tree.find((e) => e.id === targetId);
  if (target?.grade === 1) {
    return [targetId];
  }

  if (targetId === undefined) {
    return '';
  }

  const { parentId } = target as TreeType;
  if (target?.grade === 2) {
    return [parentId, targetId];
  }

  const parent = tree.find((e) => e.id === parentId) as TreeType;
  return [parent.parentId, parentId, targetId];
};

/**
 * @param arr 商品/分类数据
 * @param key 目标字段
 * @param conditionKey 某个条件字段，如要对比 isFirst 为 true 的项的 key 值是否重复
 */
export const hasRepeat = (arr: any[], key: string, conditionKey?: string) => {
  const dic: string[] = [];
  arr.forEach((e) => {
    const condition = conditionKey ? e[conditionKey] : true;

    if (condition) {
      dic.push(String(e[key]));
    }
  });
  const set = new Set(dic);
  return set.size !== dic.length;
};

/**
 * 商品价格
 * @param min
 * @param max
 */
export const handlePrice = (min: any, max: any) => {
  if (min === max) {
    return min;
  }
  return `${min}~${max}`;
};
