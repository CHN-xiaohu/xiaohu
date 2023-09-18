/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import type { PaginationProps } from 'antd/lib/pagination';
import { useCallback, useRef } from 'react';
import { useMount, usePersistFn, useRequest, useUnmount } from 'ahooks';
import type { TablePaginationConfig } from 'antd/lib/table';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { BaseOptions } from '@ahooksjs/use-request/es/types';
import { isObj, isFn } from '@/utils';
import { useForceUpdate } from '@/foundations/hooks';

import { useWatch } from '../Common/useWatch';

export type UseTableOptions<T = any> = {
  defaultPageSize?: number;
  defaultPagination?: PaginationProps | boolean;
  // 格式化返回值
  formatResult?: (
    result: ResponseResult,
  ) => {
    current?: number;
    pageSize?: number;
    total: number;
    data: T[];
  };
  formatSearchParams?: (params: any) => any;
  // 是否过滤空字符值
  isFilterNullString?: false;
  isPageTurningAutoScrollToTop?: boolean;
} & Omit<BaseOptions<T, any>, 'paginated'>;
export type FnParams = {
  current: number;
  pageSize?: number;
  [key: string]: any;
};

type FormData = Record<string, any>;

export type TFN<P> = (params: P) => any;

/**
 * 做了下定制优化
 *
 * @see https://github.com/umijs/hooks/blob/master/src/useAntdTable/index.ts
 */
export const useTable = <D extends AnyObject = AnyObject, P extends FnParams = FnParams>(
  fn: TFN<P>,
  options?: UseTableOptions<D>,
) => {
  const {
    defaultPageSize = 16,
    defaultPagination = {},
    isFilterNullString = true,
    formatResult,
    formatSearchParams,
    isPageTurningAutoScrollToTop,
    manual,
    ...last
  } = options || {};

  // const [state, setState] = useImmer({
  //   data: [],
  //   current: 1,
  //   total: 0,
  //   count: 0,
  //   searchFormData: {} as AnyObject,
  //   pageSize: defaultPageSize,
  // });

  const stateRef = useRef({
    data: [],
    current: 1,
    total: 0,
    count: 0,
    // 临时查询数据, 只生效一次
    temporarySearchForm: {} as AnyObject,
    searchFormData: {} as AnyObject,
    pageSize: defaultPageSize,
  });

  const { refresh, loading, run, cancel } = useRequest(fn, {
    // 防抖
    // debounceInterval: 300,
    // 节流
    // throttleInterval: 300,
    // 格式请求结果
    formatResult: (res) => {
      const result = formatResult?.(res) || res;

      stateRef.current.data = result?.data || [];
      stateRef.current.total = result?.total || 0;

      return result;
    },
    ...(last as any),
    manual: true,
  });

  const loadingRef = useRef(loading);
  const runIntervalRef = useRef<NodeJS.Timeout>();
  const forceUpdate = useForceUpdate();

  useUnmount(() => {
    if (loading) {
      cancel();
    }
  });

  useWatch(() => {
    loadingRef.current = loading;
  }, [loading]);

  // 如果是根据依赖变动来触发请求，方便是方便，但是会多一次 re render
  const runRequest = usePersistFn(() => {
    const state = stateRef.current;

    const formattedData: FormData = {};
    const fullSearchFormData = { ...state.searchFormData, ...state.temporarySearchForm };

    /* 把  undefined 的过滤掉 */
    Object.keys(fullSearchFormData).forEach((key) => {
      if (fullSearchFormData[key] !== undefined) {
        if (isFilterNullString && fullSearchFormData[key] === '') {
          return;
        }

        formattedData[key] = fullSearchFormData[key];
      }
    });

    let params = {
      current: state.current,
      pageSize: state.pageSize,
      ...formattedData,
    };

    if (isFn(formatSearchParams)) {
      params = formatSearchParams(params);
    }

    run(params as any).finally(() => {
      stateRef.current.temporarySearchForm = {};
    });
  });

  // 初始触发
  useMount(() => {
    if (manual) {
      return;
    }

    runRequest();
  });

  const setState = useCallback((cb: (v: typeof stateRef.current) => void) => {
    cb(stateRef.current);
    runRequest();
  }, []);

  const addSearchParamsAndRefresh = useCallback((params: AnyObject) => {
    setState((draft) => {
      draft.searchFormData = {
        ...draft.searchFormData,
        ...params,
      };
      draft.current = 1;
      draft.count += 1;
    });
  }, []);

  // 重新请求
  const reload = useCallback(
    (props?: { temporarySearchFormData?: AnyObject; searchFormData?: AnyObject }) => {
      const { temporarySearchFormData = {}, searchFormData } = props || {};

      setState((draft) => {
        if (searchFormData) {
          draft.searchFormData = {
            ...draft.searchFormData,
            ...searchFormData,
          };
        } else {
          draft.searchFormData = {};
        }

        draft.temporarySearchForm = temporarySearchFormData;

        // 这种情况是 table 的 change 事件被上层给覆盖替换了
        draft.current = temporarySearchFormData.current || 1;
        if (temporarySearchFormData.pageSize) {
          draft.pageSize = temporarySearchFormData.pageSize;
        }
      });
    },
    [],
  );

  // 表格翻页
  const changeTable = useCallback(
    (pagination: TablePaginationConfig) => {
      const currentPage = Number(pagination.current);

      // 翻页的时候，自动滚动到顶部
      if (isPageTurningAutoScrollToTop && currentPage !== stateRef.current.current) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
      }

      setState((draft) => {
        draft.current = currentPage;
        draft.pageSize = Number(pagination.pageSize);
      });
    },
    [isPageTurningAutoScrollToTop, setState],
  );

  // 触发搜索
  const searchSubmit = useCallback(
    (values: any) => {
      setState((draft) => {
        draft.searchFormData = values;
        draft.current = 1;
      });

      // 因为触发 searchSubmit 跟 执行请求的处理 是分离的，所以用这种方式来模拟请求
      return new Promise((resolve) => {
        setTimeout(() => {
          runIntervalRef.current = setInterval(() => {
            if (loadingRef.current === false) {
              resolve(undefined);

              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              runIntervalRef.current && clearInterval(runIntervalRef.current);
            }
          }, 16);
        }, 300);
      });
    },
    [setState],
  );

  // 合并其他查询条件后，再进行搜索
  const mergeSearchSubmit = useCallback(
    (values) => {
      setState((draft) => {
        draft.temporarySearchForm = values;
      });
    },
    [searchSubmit],
  );

  // 每页条数大小设置
  const handleShowSizeChange = useCallback((current: number, size: number) => {
    setState((draft) => {
      draft.pageSize = size;
    });
  }, []);

  const setStateRefAndForceUpdate = useCallback(
    (callback: (data: typeof stateRef.current) => void) => {
      callback(stateRef.current);

      forceUpdate();
    },
    [],
  );

  // 内部改变 dataSource, 无需发起请求，只需要重渲染组件
  const setDataSource = useCallback(
    <T = D>(callback: (data: T[]) => void) => {
      setStateRefAndForceUpdate((draft) => {
        callback(draft.data);
      });
    },
    [setStateRefAndForceUpdate],
  );

  const deleteDataSourceByIndex = useCallback((index: number) => {
    setDataSource((dataSource) => {
      dataSource.splice(index, 1);
    });
  }, []);

  return {
    tableProps: {
      dataSource: stateRef.current.data as D[],
      loading,
      onChange: changeTable,
      bordered: true,
      pagination: isObj(defaultPagination)
        ? {
            onShowSizeChange: handleShowSizeChange,
            showTotal: (total: number) => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
            ...defaultPagination,
            current: stateRef.current.current,
            pageSize: stateRef.current.pageSize,
            total: stateRef.current.total || 0,
            pageSizeOptions: [...Array(4)].map((_, i) => String((i + 1) * defaultPageSize)),
          }
        : (false as false),
    },
    state: stateRef.current,
    setUseTableHookState: setStateRefAndForceUpdate,
    setDataSource,
    deleteDataSourceByIndex,
    reload,
    refresh,
    addSearchParamsAndRefresh,
    mergeSearchSubmit,
    searchSubmit,
  };
};
