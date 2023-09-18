/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef } from 'react';
import * as React from 'react';
import { Spin, TreeSelect } from 'antd';
import { useCreation, useDebounceFn, usePersistFn } from 'ahooks';
import type { TreeSelectProps } from 'antd/lib/tree-select';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { NodeListRef } from 'rc-tree/lib/NodeList';

import { useDebounceWatch, useWatch } from '@/foundations/hooks';
import { getArrayLastItem, isArr, isStr } from '@/utils';

import type { Draft } from 'immer';
import { cloneDeep, isEqual } from 'lodash';

import type { District } from './useAMAPAddress';
import { useAMAPAddress } from './useAMAPAddress';

type AMAPAddressItem = Omit<District, 'children'> & {
  idxArr: string[];
  value: string;
  title: string;
  disabled?: boolean;
  children?: AMAPAddressItem[];
};

type LabelValue = { value: string; label: string };

type Value = string | LabelValue;

export type AreaTreeSelectProps<T> = {
  labelInValue?: boolean;
  showAreaLevel?: number;
  value?: Value[][];
  // all 禁用命中项以及其所有下级 self 只禁用命中项
  disabledType: 'all' | 'self';
  disabledKeys?: AreaTreeSelectProps<T>['value'];
  // 必须是字符串，因为高德返回的就是字符串
  defaultValue?: Value[][];
  onChange?: (v: AreaTreeSelectProps<T>['value'] | AMAPAddressItem[][]) => void;
} & Omit<TreeSelectProps<any>, 'treeData' | 'loadData' | 'onChange' | 'value'>;

const loopDisabledChildren = (addressChildren: AMAPAddressItem[]): AMAPAddressItem[] => {
  return addressChildren.map((item) => ({
    ...item,
    disabled: true,
    children: item.children ? loopDisabledChildren(item.children) : undefined,
  }));
};

const loopDisabled = (
  disabledKeysObj: AnyObject,
  addressChildren: AMAPAddressItem[],
  disabledSelf = false,
): AMAPAddressItem[] => {
  return addressChildren.map((item) => {
    if (disabledKeysObj[item.value]) {
      const currentDisabledKeys = disabledKeysObj[item.value];

      // 如果当前只要求禁用自己，并且命中了
      if (disabledSelf && currentDisabledKeys) {
        return {
          ...item,
          children: item.children
            ? loopDisabled(currentDisabledKeys, item.children, disabledSelf)
            : undefined,
          disabled: currentDisabledKeys.isDisabledChildren,
        };
      }

      // 如果没有下级了，那么就直接禁用
      // 如果存在提前终结的标识，那直接禁用即可
      if (currentDisabledKeys.isDisabledChildren || !Object.keys(currentDisabledKeys).length) {
        return {
          ...item,
          disabled: true,
          children: item.children ? loopDisabledChildren(item.children) : undefined,
        };
      }

      if (item.children?.length) {
        // 如果还存在需要禁用的下级，并且当前数据也还有下级的时候
        const loopResult = loopDisabled(currentDisabledKeys, item.children, disabledSelf);

        return {
          ...item,
          children: loopResult,
          disabled: loopResult.every((v) => v.disabled),
        };
      }
    }

    return item;
  });
};

const handleDisabledTreeItem = (
  dataSource: AMAPAddressItem[],
  disabledKeysTree: AnyObject,
  disabledSelf = false,
) => {
  return dataSource.map((item) => {
    const currentDisabledKeys = disabledKeysTree[item.value];

    // 用这种递归的方式，是为了避免因为处理 disabled 数据的时候，污染了 dataSource 的
    if (currentDisabledKeys) {
      // 只禁用命中值
      if (disabledSelf) {
        return {
          ...item,
          children: item.children?.length
            ? loopDisabled(currentDisabledKeys, item.children, disabledSelf)
            : undefined,
          disabled: currentDisabledKeys.isDisabledChildren,
        };
      }

      // 因为 antd tree 的 disabled 特性，所以处理这个功能，需要深度优先
      if (currentDisabledKeys.child_level && item.children?.length) {
        const loopResult = currentDisabledKeys.isDisabledChildren
          ? loopDisabledChildren(item.children)
          : loopDisabled(currentDisabledKeys, item.children);

        return {
          ...item,
          children: loopResult,
          disabled: currentDisabledKeys.isDisabledChildren || loopResult.every((v) => v.disabled),
        };
      }
    }

    return {
      ...item,
      disabled: !!currentDisabledKeys?.isDisabledChildren,
    };
  });
};

const getValueFromLabelValue = (v: Value) => (isStr(v) ? v : v.value);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AreaTreeSelect = <T extends string[] = string[], _U = AnyObject>({
  showAreaLevel = 3,
  value,
  defaultValue,
  disabledKeys,
  labelInValue = false,
  disabledType = 'self',
  treeCheckStrictly = true,
  onChange,
  ...lastProps
}: AreaTreeSelectProps<T>) => {
  const [innerValue, setInnerValue] = React.useState(
    () =>
      ((defaultValue || value)?.map((item: Value[]) => getArrayLastItem(item)) || []) as Value[],
  );
  const selectTreeItemMap = useCreation(() => new Map<React.Key, AMAPAddressItem[]>(), []);
  // 禁用的键值集合树
  const disabledKeysTree = React.useRef({} as AnyObject);
  const needHandleDefaultQueueRef = React.useRef(false);
  const isChangeTriggerRef = React.useRef(false);
  const [treeExpandedKeys, setTreeExpandedKeys] = React.useState([] as React.Key[]);
  const treeRef = useRef<{ selectRef: { current: NodeListRef } }>(null);
  const dropdownVisibleRef = useRef<boolean>(false);
  const scrollToKeyRef = useRef<string | null>(null);

  const {
    requestSearchAddress,
    dataSource,
    setInnerOptions,
    setDataSource,
    loading,
  } = useAMAPAddress<AMAPAddressItem>({
    cacheKey: 'AreaTreeSelect',
    formatOptions: (values) =>
      values.map((item) => ({
        ...item,
        value: item.name,
        title: item.name,
        isLeaf: false,
        idxArr: [],
      })),
  });

  const handleLoadData = usePersistFn(
    (
      selectedOption: AMAPAddressItem & { pos: string; title: string },
      dataSourcePar?: typeof dataSource,
    ) => {
      if (selectedOption.children?.length) {
        return Promise.resolve(selectedOption);
      }

      const pos = (selectedOption.pos || '').split('-').slice(1);

      return requestSearchAddress(String(selectedOption.title)).then((res) => {
        const isLeaf = pos.length >= showAreaLevel - 1;
        const children = res?.map((item) => ({ ...item, isLeaf, idxArr: pos }));

        const findAndSetData = (draft: typeof dataSource | Draft<typeof dataSource>) => {
          const currentOption = pos.reduce((p, idx) => {
            return p[idx].children || p[idx];
          }, draft) as District | District[] | undefined;

          if (currentOption && !isArr(currentOption)) {
            if (res.length) {
              currentOption.children = children;
            }

            // 是否是叶子节点
            currentOption.isLeaf = !res.length;
          }
        };

        if (!dataSourcePar) {
          setDataSource(findAndSetData);
        } else {
          findAndSetData(dataSourcePar);
        }

        return { ...selectedOption, children };
      });
    },
  );

  const syncDefaultValueToInnerValue = () => {
    const newInnerValue = defaultValue?.map((item: Value[]) => getArrayLastItem(item)!) || [];

    if (!isEqual(innerValue, newInnerValue) && newInnerValue.length) {
      setInnerValue(newInnerValue);

      scrollToKeyRef.current = getValueFromLabelValue(newInnerValue[0]);
    }
  };

  const setSelectTreeItemToMap = (collection: Value, chainNexus: AMAPAddressItem[]) => {
    selectTreeItemMap.set(getValueFromLabelValue(collection), chainNexus);

    const expandedKeys = new Set<string>();

    for (const [, arr] of selectTreeItemMap) {
      arr.forEach((item, index) => {
        if (arr.length - 1 !== index) {
          expandedKeys.add(item.value);
        }
      });
    }

    setTreeExpandedKeys([...expandedKeys.values()]);
  };

  const { run: handleDefaultValues } = useDebounceFn(
    async () => {
      needHandleDefaultQueueRef.current = false;

      if (!defaultValue || !dataSource.length) {
        syncDefaultValueToInnerValue();

        return;
      }

      // 每一次同步默认值的时候，都需要清空值，避免类似弹窗表单这种情况
      selectTreeItemMap.clear();

      // clone 一份数据，用于下面查找匹配的时候，利用引用特性，来减少不要的查找
      // todo: 地址数据很大的时候需要优化，当前是懒加载，在初始阶段的数据量应该还好
      const dataSourceClone = cloneDeep(dataSource) as AMAPAddressItem[];

      for (let i = 0; i < defaultValue.length; i += 1) {
        const collection = defaultValue[i];

        // 从一级开始
        const currentDataSourceIndex = dataSourceClone.findIndex(
          (item) => item.value === getValueFromLabelValue(collection[0]),
        );

        // 如果集合长度为 1，那么就代表只是选中了省，而省的数据是默认获取的，所以可以跳过这次数据查找
        if (collection.length === 1) {
          // 需要将值同步到当前集合中
          setSelectTreeItemToMap(collection[0], [dataSourceClone[currentDataSourceIndex]]);

          continue;
        }

        // 当前项的父级数据源
        let currentDataSource = dataSourceClone[currentDataSourceIndex];
        if (!currentDataSource) {
          break;
        }

        // 父级索引集合, 用于默认值同步时，跟手动点击 select 时的行为一致
        const chainNexus = [currentDataSource] as AMAPAddressItem[];

        // 生成跟 antd 自带的 pos 属性，用于标记当前项的族谱索引记录
        let pos = [0, currentDataSourceIndex].join('-');

        for (let j = 1; j < collection.length; j += 1) {
          const id = getValueFromLabelValue(collection[j]);

          // 当前父级数据源有下级数据，那么就无需再请求其下级了，直接进入下一项
          if (currentDataSource?.children) {
            const currentOptionIndex = currentDataSource.children.findIndex(
              (item) => item.value === id,
            );

            currentDataSource = currentDataSource.children[currentOptionIndex];
            pos += `-${currentOptionIndex}`;

            chainNexus.push(currentDataSource);

            continue;
          }

          // 如果不存在下级数据，那么就去请求其下级数据
          // eslint-disable-next-line no-await-in-loop
          const result = await handleLoadData({ ...currentDataSource, pos }, dataSourceClone);

          if (!result.children) {
            break;
          }

          // 将其设置为下一次遍历的父级数据
          const currentOptionIndex = result.children.findIndex((item) => item.value === id);
          currentDataSource = result.children[currentOptionIndex];
          pos += `-${currentOptionIndex}`;

          chainNexus.push(currentDataSource);
        }

        const lastCollection = getArrayLastItem<Value>(collection)!;

        setSelectTreeItemToMap(lastCollection, chainNexus);
      }

      setInnerOptions((draft) => {
        draft.dataSource = dataSourceClone;
      });

      // 同步默认值
      syncDefaultValueToInnerValue();
    },
    { wait: 32 },
  );

  // 因为高德地图是异步加载的，所以可能存在默认值已经存在了，但是高德地图的实例还没创建
  // 所以加一个标识来标记下，如果实例创建完成，并且已加载了一级数据，那么就进行默认值的初始化处理
  useDebounceWatch(
    async () => {
      if (!defaultValue?.length && innerValue.length) {
        // 因为内部接管了选中值的同步，所以在弹窗中使用，会出现这样的情况：选中了一项，然后关闭了弹窗，然后再打开，还是会显示上一次的选中值
        // 这是因为 innerValue 变动了，但是 defaultValue 没有变动，所以在下一次打开时，就无法进行同步
        setInnerValue([]);

        return;
      }

      if (dataSource.length) {
        handleDefaultValues();
      } else {
        needHandleDefaultQueueRef.current = true;
      }
    },
    [defaultValue],
    { ms: 16, immediate: true },
  );

  // 原因同上
  useDebounceWatch(
    () => {
      if (dataSource.length && needHandleDefaultQueueRef.current) {
        handleDefaultValues();
      }
    },
    [dataSource],
    { ms: 60 },
  );

  // useDebounceWatch(() => {
  //   // 因为内部接管了选中值的同步，所以在弹窗中使用，会出现这样的情况：选中了一项，然后关闭了弹窗，然后再打开，还是会显示上一次的选中值
  //   // 这是因为 innerValue 变动了，但是 defaultValue 没有变动，所以在下一次打开时，就无法进行同步
  //   if (!value?.length && innerValue.length) {
  //     setInnerValue([]);
  //   }
  // }, [value]);

  React.useEffect(() => {
    // 空间换时间
    disabledKeysTree.current = {};

    disabledKeys?.forEach((keys) => {
      const key = getValueFromLabelValue(keys[0]);
      const isDisabledChildren = keys.length - 1 === 0;

      const child_level = keys.length - 1;
      if (!disabledKeysTree.current[key]) {
        disabledKeysTree.current[key] = {
          // 孩子层级
          child_level,
          isDisabledChildren,
        };
      } else {
        if (child_level > disabledKeysTree.current[key].child_level) {
          disabledKeysTree.current[key].child_level = child_level;
        }

        if (isDisabledChildren && !disabledKeysTree.current[key].isDisabledChildren) {
          disabledKeysTree.current[key].isDisabledChildren = true;
        }
      }

      let current = disabledKeysTree.current[key];

      for (let i = 1; i < keys.length; i += 1) {
        const cKey = getValueFromLabelValue(keys[i]);
        const cIsDisabledChildren = keys.length - 1 === i || i === showAreaLevel - 1;

        if (!current[cKey]) {
          current[cKey] = {
            isDisabledChildren: cIsDisabledChildren,
          };
        } else if (cIsDisabledChildren && !current[cKey].isDisabledChildren) {
          current[cKey].isDisabledChildren = true;
        }

        current = current[cKey];
      }
    });
  }, [disabledKeys]);

  const handleSelect: TreeSelectProps<T>['onSelect'] = (val, node) => {
    const { idxArr } = node as AMAPAddressItem;

    // 如果没有父级索引集合，那么就代表当前选中的是一级地址
    const chainNexus = [node] as AMAPAddressItem[];
    if (idxArr.length) {
      idxArr.reduce((options, idx, index) => {
        const { children, ...last } = options[idx];

        chainNexus.splice(index, 0, last);

        return children;
      }, dataSource);
    }

    selectTreeItemMap.set(val, chainNexus);
  };

  const handleChange: TreeSelectProps<T>['onChange'] = (values, labelList, extra) => {
    // 如果是取消选中，那么就从结果集中删除
    if (!extra.checked) {
      selectTreeItemMap.delete(extra.triggerValue);
    }

    isChangeTriggerRef.current = true;

    setInnerValue(values);
  };

  useWatch(() => {
    // value/default 的同步，不应该触发 onChange
    if (!(onChange && isChangeTriggerRef.current)) {
      return;
    }

    isChangeTriggerRef.current = false;

    const valueArr = [...selectTreeItemMap.values()];

    onChange(labelInValue ? valueArr : valueArr.map((arr) => arr.map((item) => item.value)));
  }, [innerValue]);

  const treeData = React.useMemo(() => {
    // 无需处理数据禁用情况
    if (!Object.keys(disabledKeysTree.current).length) {
      return dataSource;
    }

    return handleDisabledTreeItem(dataSource, disabledKeysTree.current, disabledType === 'self');
  }, [dataSource, disabledKeysTree.current]);

  const handleTreeExpand = useCallback((expandedKeys: React.Key[]) => {
    setTreeExpandedKeys(expandedKeys);
  }, []);

  useWatch(() => {
    setTimeout(() => {
      if (
        dropdownVisibleRef.current &&
        scrollToKeyRef.current &&
        treeRef.current?.selectRef.current?.scrollTo
      ) {
        treeRef.current.selectRef.current.scrollTo({ key: scrollToKeyRef.current, align: 'top' });

        scrollToKeyRef.current = '';
      }
    }, 16);
  }, [scrollToKeyRef.current, dropdownVisibleRef.current]);

  return (
    <Spin spinning={loading}>
      <TreeSelect<any>
        {...{
          treeCheckable: true,
          showCheckedStrategy: TreeSelect.SHOW_PARENT,
          ...lastProps,
          onDropdownVisibleChange: (v) => {
            dropdownVisibleRef.current = v;
          },
          ref: treeRef as any,
          treeExpandedKeys,
          style: { width: '100%', ...lastProps.style },
          value: innerValue,
          treeData,
          treeCheckStrictly,
          loadData: (v) => handleLoadData(v as any),
          onChange: handleChange,
          onSelect: handleSelect,
          onTreeExpand: handleTreeExpand,
        }}
      />
    </Spin>
  );
};
