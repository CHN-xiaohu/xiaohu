import { Select } from 'antd';
import type { SelectProps, LabeledValue } from 'antd/lib/select';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import { usePrevious } from '@/foundations/hooks';

export type FieldNameType = {
  value?: string;
  label?: string;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface SelectByLoadMoreProps
  extends Omit<SelectProps<any>, 'options' | 'loading' | 'onPopupScroll'> {
  request: (params?: {
    size: number;
    current: number;
    searchValue?: LabeledValue['value'];
  }) => Promise<{ data: LabeledValue; total: number }>;
  requestOptions?: {
    size?: number;
    debounceInterval?: number;
  };
}

export function SelectByLoadMore({ request, requestOptions, ...props }: SelectByLoadMoreProps) {
  const [searchValue, setSearchVal] = useState<LabeledValue['value'] | undefined>(undefined);
  const searchValuePrevious = usePrevious(searchValue);

  const { data, loadMore, loading, loadingMore } = useRequest(
    (params) => {
      const size = requestOptions?.size || 20;
      // 当前请求是否是搜索行为
      const isSearch = searchValuePrevious !== searchValue;

      // 如果进行了搜索，那么就从第一页开始
      const currentPage = isSearch ? 1 : params?.nextPage || 1;

      return request({ searchValue, current: currentPage, size }).then((res) => ({
        nextPage: currentPage + 1,
        total: res.total,
        list: isSearch ? res.data : (params?.list || []).concat(res.data),
      }));
    },
    {
      loadMore: true,
      debounceInterval: requestOptions?.debounceInterval || 120,
      refreshDeps: [searchValue],
    },
  );

  const handleOnPopupScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    if ((data?.list?.length || 0) >= data!.total) {
      return;
    }

    const { target } = e as unknown as { target: HTMLDivElement };
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      loadMore();
    }
  };

  return (
    <Select
      filterOption={false}
      showSearch
      {...props}
      options={data?.list}
      loading={loading || loadingMore}
      onSearch={setSearchVal}
      onPopupScroll={handleOnPopupScroll}
    />
  );
}
