/* eslint-disable no-use-before-define */
import { useDebounceByMemo, useWatch } from '@/foundations/hooks';

import * as React from 'react';

import { Tree, Input, Card } from 'antd';
import type { TreeProps } from 'antd/lib/tree';
import type { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { cloneDeep } from 'lodash';
import { useImmer } from 'use-immer';

import styles from './index.less';

export type ITreeSelectProps = {
  selectedKeys?: string[] | undefined;
  treeData: TreeProps['treeData'];
  onSearch?: (value: string) => void;
  onSelect?: (value: string[]) => void;
  style?: React.CSSProperties;
  defaultExpandAll?: boolean;
};

const expandedKeys = new Set<string>();

const RenderTreeTitleNode = (title: string, searchValue: string) => {
  const index = title.indexOf(searchValue);
  const beforeStr = title.substr(0, index);
  const afterStr = title.substr(index + searchValue.length);

  return (
    <span>
      {beforeStr}
      <span style={{ color: '#f50' }}>{searchValue}</span>
      {afterStr}
    </span>
  );
};

const whetherTitleDataHitSearch = (title: string, filterValue: string) =>
  title.indexOf(filterValue) > -1;

// 判断是否跟搜索值相符
const whetherHitSearch = (treeItem: TreeNodeNormal, filterValue: string) => {
  const checkTitle = whetherTitleDataHitSearch(treeItem.title as string, filterValue);

  // 这一步是必须要执行的, 因为需要深度遍历查找
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const checkChildrenIsOk = treeItem.children && loopFilterChildren(treeItem, filterValue);

  const isOk = checkTitle || checkChildrenIsOk;

  if (checkTitle) {
    // 高亮
    treeItem.title = RenderTreeTitleNode(String(treeItem.title), filterValue);
  }

  if (isOk) {
    // 需要展开
    expandedKeys.add(String(treeItem.key));
  }

  return isOk;
};

// 过滤下级
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
  defaultExpandAll = false,
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

  const handleSearch = React.useCallback(
    (value: string) => {
      setState((draft) => {
        draft.searchValue = value;
        draft.filterTreeData = value ? searchFilterTreeData(cloneDeep(treeData), value) : [];

        onSearch && onSearch(value);
      });
    },
    [treeData, onSearch],
  );

  const handleSearchDebounce = useDebounceByMemo(handleSearch, { deps: [treeData] });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleExpand = React.useCallback((keys: React.ReactText[]) => {
  //   setState(draft => {
  //     draft.expandedKeys = keys as string[];
  //   });
  // }, []);

  return (
    <Card className={styles.searchTreeWrapper} style={{ height: '100%', ...style }}>
      <div className={styles.searchBox}>
        <Input.Search
          placeholder="请输入关键词进行搜索"
          allowClear
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSearchDebounce(e.target.value)
          }
          onSearch={handleSearchDebounce}
        />
      </div>

      <Tree
        className={styles.scrollWrapper}
        height={window.innerHeight - 108 - 68}
        defaultExpandAll={defaultExpandAll}
        selectedKeys={selectedKeys}
        // expandedKeys={[...expandedKeys, ...state.expandedKeys]}
        // onExpand={handleExpand}
        onSelect={onSelect as any}
        treeData={state.filterTreeData.length ? state.filterTreeData : treeData}
      />
    </Card>
  );
};

export const TreeSearchSelect = React.memo(Main);
