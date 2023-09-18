/* eslint-disable no-use-before-define */
import * as React from 'react';

import { Tree, Input, Card } from 'antd';
import type { TreeProps } from 'antd/lib/tree';
import type { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { cloneDeep } from 'lodash';
import { useImmer } from 'use-immer';

import { Scroll } from '@/components/Library/Scroll';
import { useDebounceByMemo, useWatch } from '@/foundations/hooks';

import { usePersistFn } from 'ahooks';

import styles from './index.less';

const { Search } = Input;
const { TreeNode } = Tree;

type ITreeSelectProps = {
  selectedKeys?: string[] | undefined;
  treeData: TreeProps['treeData'];
  onSearch?: (value: string) => void;
  onSelect?: (value: string[]) => void;
  style?: React.CSSProperties;
};

const expandedKeys = new Set<string>();

const whetherTitleDataHitSearch = (title: string, filterValue: string) =>
  title.indexOf(filterValue) > -1;

const whetherHitSearch = (treeItem: TreeNodeNormal, filterValue: string) => {
  const checkTitle = whetherTitleDataHitSearch(treeItem.title as string, filterValue);

  // 这一步是必须要执行的, 因为需要深度遍历查找
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const checkChildrenIsOk = treeItem.children && loopFilterChildren(treeItem, filterValue);

  const isOk = checkTitle || checkChildrenIsOk;

  if (isOk) {
    expandedKeys.add(treeItem.key);
  }

  return isOk;
};

const loopFilterChildren = (treeItem: TreeNodeNormal, filterValue: string) => {
  if (treeItem.children?.length) {
    treeItem.children = treeItem.children.filter((item) => whetherHitSearch(item, filterValue));

    if (treeItem.children.length) {
      return true;
    }

    delete treeItem.children;
  }

  return false;
};

const searchFilterTreeData = (treeData: TreeProps['treeData'] = [], filterValue: string) =>
  treeData.filter((treeItem) => whetherHitSearch(treeItem, filterValue));

export const Main = ({
  selectedKeys = [],
  treeData = [],
  onSelect,
  onSearch,
  style = {},
}: ITreeSelectProps) => {
  const [state, setState] = useImmer({
    searchValue: '',
    expandedKeys: [] as string[],
    filterTreeData: [] as TreeNodeNormal[],
  });

  useWatch(() => {
    // 选中数组长度为 0 ，即是被重置
    if (!selectedKeys.length) {
      // eslint-disable-next-line no-unused-expressions
      (document
        .querySelector(`.${styles.searchBox}`)
        ?.querySelector('.anticon-close-circle') as HTMLElement)?.click();
    }
  }, [selectedKeys]);

  const handleSearch = usePersistFn((value: string) => {
    setState((draft) => {
      draft.searchValue = value;
      draft.filterTreeData = value ? searchFilterTreeData(cloneDeep(treeData), value) : [];

      onSearch?.(value);
    });
  });

  const handleSearchDebounce = useDebounceByMemo(handleSearch, { deps: [treeData] });

  const handleExpand = React.useCallback((keys: string[]) => {
    setState((draft) => {
      draft.expandedKeys = keys;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTreeTitleNode = (title: string) => {
    const index = title.indexOf(state.searchValue);
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + state.searchValue.length);

    return (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{state.searchValue}</span>
        {afterStr}
      </span>
    );
  };

  const loopRenderTreeNode = (dataSource: TreeNodeNormal[]) =>
    dataSource.map((item) => {
      const title = String(item?.title || '');
      const titleNode =
        state.searchValue && title.indexOf(state.searchValue) > -1 ? (
          renderTreeTitleNode(String(item?.title || ''))
        ) : (
          <span>{item.title}</span>
        );

      return (
        <TreeNode key={item.key} title={titleNode}>
          {item.children?.length ? loopRenderTreeNode(item.children) : null}
        </TreeNode>
      );
    });

  return (
    <Card className={styles.searchTreeWrapper} style={{ height: '100%', ...style }}>
      <div className={styles.searchBox}>
        <Search
          placeholder="请输入关键词进行搜索"
          allowClear
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSearchDebounce(e.target.value)
          }
          onSearch={handleSearchDebounce}
        />
      </div>

      <Scroll className={styles.scrollWrapper}>
        <Tree
          selectedKeys={selectedKeys}
          expandedKeys={[...expandedKeys, ...state.expandedKeys]}
          onSelect={onSelect}
          onExpand={handleExpand}
        >
          {loopRenderTreeNode(state.filterTreeData.length ? state.filterTreeData : treeData)}
        </Tree>
      </Scroll>
    </Card>
  );
};

export const TreeSearchSelect = React.memo(Main);
