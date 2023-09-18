/* eslint-disable no-plusplus */
import type { CategoryColumns, CouponColumns } from './Api';

export const typeList = ['', '满减券', '打折券'];
export const statusList = ['未开始', '进行中', '已结束', '已失效'];
export const publishType = ['新用户注册自动发放', '储值活动', '用户领取', '平台发放'];
export const searchStatus = ['未使用', '已使用', '已过期', '已失效'];

export const getDiscountText = (
  withAmount: any,
  type: any,
  usedAmount: any,
  usedDiscount: number,
) => {
  if (Number(withAmount) === 0) {
    if (Number(type) === 1) {
      return `无门槛减${usedAmount}元`;
    }
    return `无门槛打${(usedDiscount * 10).toFixed(1)}折`;
  }
  if (Number(type) === 1) {
    return `满${withAmount}减${usedAmount}元`;
  }
  return `满${withAmount}打${(usedDiscount * 10).toFixed(1)}折`;
};

export const getCouponvalidType = (
  validType: any,
  validStartTime: any,
  validEndTime: any,
  validDays: any,
) => {
  if (Number(validType) === 1) {
    return `使用时间：${validStartTime}~${validEndTime}`;
  }
  return `使用时间：领券当日起${validDays}天内可用`;
};

export const getUsed = (uses: any, categoryName = '指定') => {
  const types = {
    10: '优惠内容：全部商品可用，',
    20: '优惠内容：仅部分商品可用，',
    40: '优惠内容：全部商品可用，',
    30: `优惠内容：仅${categoryName}类目可用，`,
  }[Number(uses)];
  return types;
};

export const stringFilterOption = (input: string, option: { props: { children: string } }) =>
  option.props.children.indexOf(input) > -1;

export const getCouponDescriptionByType = (couponItem: CouponColumns) =>
  Number(couponItem.type) === 1
    ? getDiscountText(couponItem.withAmount, couponItem.type, couponItem.usedAmount, '')
    : getDiscountText(couponItem.withAmount, couponItem.type, '', couponItem.usedDiscount);

export const handlePrice = (min: any, max: any) => {
  if (min === max) {
    return min;
  }
  return `${min}~${max}`;
};

export const handleIsMiniCoupon = () => window.location.pathname.split('/').includes('miniProgram');

type Fields = {
  // 主键的字段名称
  pkField?: string;
  // name 的字段名称
  nameField?: string;
  // 上级节点的字段名称
  pidField?: string;
  // 下级数据的字段名称
  childrenField?: string;
  // 三级分类的grade
  threeGrade?: number;
};

type LoopOrganizeDataAsTreeFormatProps<V extends any, AV extends any> = {
  // 数据源
  dataSource: V[];
  // 上级节点的数据, 默认为 0
  pid?: number | string;
  // parentData?: V;
  rootParentData?: V;
  // level?: number;
  // 自定义格式回调
  customFormatCallback?: (data: V) => V & AV;
} & Fields;

/**
 * 将一维数组转化为树形结构
 *
 * @param {LoopOrganizeDataAsTreeFormatProps<any>} props 配置项
 */
export const loopConvertOneDimensionalArrayIntoTree = <V extends any, AV = any>({
  dataSource = [],
  pid = 0,
  pkField = 'id',
  nameField = 'treeNamePath',
  pidField = 'parent_id',
  childrenField = 'children',
  // level = 1,
  // parentData,
  rootParentData,
  customFormatCallback,
}: LoopOrganizeDataAsTreeFormatProps<V, AV>) => {
  // 创建数据
  const tree = [];

  for (let index = 0; index < dataSource.length; index++) {
    let item = dataSource[index];
    if (item[pidField] === pid) {
      if (customFormatCallback) {
        // 自定义格式
        item = {
          ...item,
          ...customFormatCallback(item),
        };
      } else {
        item.value = item[pkField];
        item.label = item[nameField];
      }

      let realRootParentData = rootParentData;
      if (!realRootParentData) {
        realRootParentData = item;
      }

      // 剔除已命中的数据，减少内存使用
      // dataSource.splice(index, index);

      if (dataSource.length) {
        item[childrenField] = loopConvertOneDimensionalArrayIntoTree({
          dataSource,
          pid: item[pkField],
          nameField,
          pidField,
          pkField,
          childrenField,
          customFormatCallback,
          rootParentData: realRootParentData,
        });

        if (Array.isArray(item[childrenField]) && !item[childrenField].length) {
          delete item[childrenField];
        }
      }

      // 储存到数组
      tree.push(item);
    }
  }

  return tree;
};

// 格式 Category 的源数据
export const formatCategoryDatas = (dataSource: CategoryColumns[] = []) =>
  loopConvertOneDimensionalArrayIntoTree<CategoryColumns>({
    dataSource,
    pid: '0',
    pidField: 'parentId',
    customFormatCallback: ({ id, treeNamePath }) => ({
      // 因为 Form 表单用的是 antd 的 treeSelect 组件，所以在将一维数组转化树形结构的时候
      // 顺便一起把 treeSelect 需要的数据字段也添加进去, 减少重复性工作
      title: treeNamePath,
      value: id,
      key: id,
    }),
  });
