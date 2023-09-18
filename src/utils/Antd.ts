/**
 * 递归整理数据格式为 TreeSelect 所属的数据格式
 * @param {any[]} dataSource
 */
export const loopOrganizeDataFormatForTreeSelect = (
  dataSource: any[],
  titleField = 'name',
  pkField = 'id',
): any[] =>
  dataSource.map((item) => ({
    title: item[titleField],
    value: item[pkField],
    key: item[pkField],
    children: item.children ? loopOrganizeDataFormatForTreeSelect(item.children) : [],
  }));

type Fields = {
  // 主键的字段名称
  pkField?: string;
  // name 的字段名称
  nameField?: string;
  // 上级节点的字段名称
  pidField?: string;
  // 下级数据的字段名称
  childrenField?: string;
};

type LoopOrganizeDataAsTreeFormatProps<V extends any, AV extends any> = {
  // 数据源
  dataSource: V[];
  // 上级节点的数据, 默认为 0
  pid?: number | string;
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
  customFormatCallback,
}: LoopOrganizeDataAsTreeFormatProps<V, AV>) => {
  // 创建数据
  const tree = [];

  // eslint-disable-next-line no-plusplus
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

      // 剔除已命中的数据，减少内存使用
      // dataSource.splice(index, index);

      item[childrenField] = !dataSource.length
        ? []
        : loopConvertOneDimensionalArrayIntoTree({
            dataSource,
            pid: item[pkField],
            nameField,
            pidField,
            pkField,
            childrenField,
            customFormatCallback,
          });

      // 储存到数组
      tree.push(item);
    }
  }

  return tree;
};

export const loopSetTreeNodeDisabled = (
  dataSource: any[] = [],
  id: string,
  opts = {} as Fields & { disabled: boolean },
) => {
  const { pkField = 'id', childrenField = 'children', disabled = false } = opts;

  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < dataSource.length; index++) {
    const item = dataSource[index];

    if (item[pkField] === id) {
      if (Array.isArray(item[childrenField])) {
        loopSetTreeNodeDisabled(item[childrenField], id, { ...opts, disabled: true });
      }
    }

    if (disabled) {
      item.disabled = true;
      if (Array.isArray(item[childrenField])) {
        loopSetTreeNodeDisabled(item[childrenField], id, { ...opts, disabled: true });
      }
    }
  }
};
