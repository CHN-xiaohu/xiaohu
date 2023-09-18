/* eslint-disable no-plusplus */
import type { displayCategoryColumn } from './Api';

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
  nameField = 'name',
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
export const formatCategoryData = (dataSource: displayCategoryColumn[] = []) => {
  return loopConvertOneDimensionalArrayIntoTree<displayCategoryColumn>({
    dataSource,
    pid: '0',
    pidField: 'parentId',
    customFormatCallback: ({ id, name }) => ({
      // 因为 Form 表单用的是 antd 的 treeSelect 组件，所以在将一维数组转化树形结构的时候
      // 顺便一起把 treeSelect 需要的数据字段也添加进去, 减少重复性工作
      title: name,
      value: id,
      key: id,
    }),
  });
};
