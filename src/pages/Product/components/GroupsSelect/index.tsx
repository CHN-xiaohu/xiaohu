import React from 'react';
import { Select } from 'antd';

import { saveOrUpdatetGroups, getGroupsNoPage } from '@/pages/Product/Api/groups';

import type { SelectProps } from 'antd/lib/select';
import { useRequest } from 'ahooks';

import { AddGroupsInput } from './AddGroupsInput';

const { Option } = Select;

export type FieldNameType = {
  value?: string;
  label?: string;
};

type ISelectProps = {
  //
} & SelectProps<any>;

export const stringFilterOption = (input: string, option: { props: { children: string } }) =>
  option.props.children.indexOf(input) > -1;

export function GroupSelect(props: ISelectProps) {
  const { data = [], loading, refresh } = useRequest(() => getGroupsNoPage({}), {
    formatResult: (res) => res.data,
  });

  const handleAddGroup = (inputValue: string) => {
    const params = {
      name: inputValue,
    };

    saveOrUpdatetGroups(params).then(() => {
      refresh();
    });
  };

  return (
    <div id="area">
      <Select
        placeholder="请选择商品分组"
        labelInValue={true}
        mode="multiple"
        showSearch={true}
        filterOption={stringFilterOption as any}
        getPopupContainer={() => document.getElementById('area') as any}
        {...props}
        dropdownRender={(menu) => (
          <div>
            {menu}
            <AddGroupsInput {...{ handleAddGroup, loading }} />
          </div>
        )}
      >
        {data?.map((items: AnyObject) => (
          <Option key={items.id} value={items.id}>
            {items.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
