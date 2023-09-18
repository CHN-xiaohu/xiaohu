import * as React from 'react';
import { Select } from 'antd';

import type { SelectProps } from 'antd/lib/select';
import { useImmer } from 'use-immer';
import { useRequest } from 'ahooks';

import { getSelectProduct } from '../Api';

export type FieldNameType = {
  value?: string;
  label?: string;
};

type ISelectProps = {
  //
} & SelectProps<any>;

const SelectProducts = (props: ISelectProps) => {
  const [state, setState] = useImmer({
    queryParams: {
      name: '',
      oldName: '',
    },
  });

  const { data, loadMore, loading, loadingMore } = useRequest(
    (params) => {
      const size = 10;
      const currentPage = params?.nextPage || 1;
      const options = {
        current: currentPage,
        size,
      };

      const isQueryName = state.queryParams.oldName !== state.queryParams.name;
      options[isQueryName ? 'name' : 'inculdeIds'] = isQueryName
        ? state.queryParams.name
        : props.value;

      return getSelectProduct(options).then((res) => ({
        nextPage: currentPage + 1,
        total: res.data.total,
        list: (params?.list || []).concat(
          res.data.records.map((item) => ({ label: item.name, value: item.id })),
        ),
      }));
    },
    {
      loadMore: true,
      debounceInterval: 120,
      refreshDeps: [state.queryParams.name],
    },
  );

  const handleOnSearch = (searchVal: any) => {
    setState((draft) => {
      draft.queryParams.oldName = draft.queryParams.name;
      draft.queryParams.name = searchVal;
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
      placeholder="请选择商品"
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

export default SelectProducts;
