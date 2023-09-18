import * as React from 'react';
import { Select } from 'antd';

import type { SelectProps } from 'antd/lib/select';
import { useImmer } from 'use-immer';
import { useRequest } from 'ahooks';

import { getDesigners } from '../Api';

export type FieldNameType = {
  value?: string;
  label?: string;
};

type ISelectProps = {} & SelectProps<any>;

const SelectDesigner = (props: ISelectProps) => {
  const [state, setState] = useImmer({
    queryParams: {
      searchKey: '',
    },
  });

  const { data, loadMore, loading, loadingMore } = useRequest(
    (params) => {
      const size = 10;
      const currentPage = params?.nextPage || 1;
      const options = {
        current: currentPage,
        size,
        searchKey: state.queryParams.searchKey,
      };

      return getDesigners(options).then((res) => ({
        nextPage: currentPage + 1,
        total: res.data.total,
        list: (params?.list || []).concat(
          res.data.records.map((item: any) => ({ label: item.name, value: item.appuid })),
        ),
      }));
    },
    {
      loadMore: true,
      debounceInterval: 120,
      refreshDeps: [state.queryParams.searchKey],
    },
  );

  const handleOnSearch = (searchVal: any) => {
    setState((draft) => {
      draft.queryParams.searchKey = searchVal;
    });
  };

  const handleOnPopupScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    if ((data?.list?.length || 0) >= data!.total) {
      return;
    }

    // react 17 无需再这样声明
    e.persist();

    const { target } = (e as unknown) as { target: HTMLDivElement };
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      loadMore();
    }
  };

  return (
    <Select
      placeholder="手机号/设计师名称"
      {...props}
      options={data?.list}
      loading={loading || loadingMore}
      filterOption={false}
      showSearch
      onSearch={handleOnSearch}
      onPopupScroll={handleOnPopupScroll}
    />
  );
};

export default SelectDesigner;
